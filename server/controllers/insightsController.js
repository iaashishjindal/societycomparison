import Society from '../models/Society.js';
import SocietyBenchmark from '../models/SocietyBenchmark.js';
import Benchmark from '../models/Benchmark.js';

const calculateStats = (values) => {
  const sorted = values.sort((a, b) => a - b);
  const n = sorted.length;
  
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 === 0 
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
    : sorted[Math.floor(n / 2)];
  
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  return { mean, median, stdDev, min: sorted[0], max: sorted[n - 1] };
};

export const getComparisonData = async (req, res) => {
  try {
    const societies = await Society.find();
    const benchmarks = await Benchmark.find();
    
    const data = await Promise.all(
      societies.map(async (society) => {
        const benchmarkValues = await SocietyBenchmark.find({ societyId: society._id })
          .populate('benchmarkId');
        
        const benchmarkMap = {};
        benchmarkValues.forEach((bv) => {
          benchmarkMap[bv.benchmarkId._id] = bv.value;
        });

        return {
          ...society.toObject(),
          benchmarks: benchmarkMap,
        };
      })
    );

    res.json({ societies: data, benchmarks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInsights = async (req, res) => {
  try {
    const benchmarks = await Benchmark.find();
    const societyBenchmarks = await SocietyBenchmark.find().populate(['societyId', 'benchmarkId']);
    
    // Group by benchmark
    const insightsByBenchmark = {};
    
    for (const benchmark of benchmarks) {
      const values = societyBenchmarks
        .filter(sb => sb.benchmarkId._id.toString() === benchmark._id.toString())
        .map(sb => sb.value);
      
      if (values.length > 0) {
        const stats = calculateStats(values);
        const outliers = values.filter(v => v > stats.mean + 2 * stats.stdDev || v < stats.mean - 2 * stats.stdDev);
        
        insightsByBenchmark[benchmark._id] = {
          name: benchmark.name,
          category: benchmark.category,
          stats,
          outliersCount: outliers.length,
        };
      }
    }

    res.json(insightsByBenchmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTrendsData = async (req, res) => {
  try {
    const benchmarks = await Benchmark.find();
    const societies = await Society.find();
    const societyBenchmarks = await SocietyBenchmark.find().populate(['societyId', 'benchmarkId']);

    const trendData = [];

    for (const benchmark of benchmarks) {
      const benchmarkValues = societyBenchmarks
        .filter(sb => sb.benchmarkId._id.toString() === benchmark._id.toString())
        .map(sb => ({
          value: sb.value,
          societyId: sb.societyId._id,
          societyName: sb.societyId.name,
          area: sb.societyId.totalArea,
          flats: sb.societyId.totalFlats,
        }));

      if (benchmarkValues.length > 0) {
        trendData.push({
          benchmarkId: benchmark._id,
          benchmarkName: benchmark.name,
          category: benchmark.category,
          values: benchmarkValues,
        });
      }
    }

    res.json(trendData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
