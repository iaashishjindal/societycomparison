import Society from '../models/Society.js';
import SocietyBenchmark from '../models/SocietyBenchmark.js';
import Benchmark from '../models/Benchmark.js';

// Helper to calculate statistics
const calculateStats = (values) => {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return { mean, median, min, max, stdDev, count: values.length };
};

// Helper to identify outliers (values beyond 1.5 * IQR)
const identifyOutliers = (values) => {
  if (values.length < 4) return [];

  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;

  return values.filter((val) => val < q1 - 1.5 * iqr || val > q3 + 1.5 * iqr);
};

// Get comparison data for all societies
export const getComparisonData = async (req, res) => {
  try {
    const { benchmarkId, minFlats, maxFlats, minArea, maxArea, location } = req.query;

    let query = { isDeleted: false };
    if (minFlats) query.totalFlats = { ...query.totalFlats, $gte: parseInt(minFlats) };
    if (maxFlats)
      query.totalFlats = { ...query.totalFlats, $lte: parseInt(maxFlats) };
    if (minArea)
      query.totalArea = { ...query.totalArea, $gte: parseInt(minArea) };
    if (maxArea) query.totalArea = { ...query.totalArea, $lte: parseInt(maxArea) };
    if (location) query.location = new RegExp(location, 'i');

    const societies = await Society.find(query).lean();
    const societyIds = societies.map((s) => s._id);

    let benchmarkQuery = { societyId: { $in: societyIds } };
    if (benchmarkId) benchmarkQuery.benchmarkId = benchmarkId;

    const benchmarkData = await SocietyBenchmark.find(benchmarkQuery)
      .populate('benchmarkId')
      .populate('societyId')
      .lean();

    // Group by benchmark for analysis
    const grouped = benchmarkData.reduce((acc, item) => {
      const key = item.benchmarkId._id;
      if (!acc[key]) {
        acc[key] = {
          benchmark: item.benchmarkId,
          data: [],
        };
      }
      acc[key].data.push({
        societyId: item.societyId._id,
        societyName: item.societyId.name,
        value: item.value,
        notes: item.notes,
      });
      return acc;
    }, {});

    // Calculate statistics for each benchmark
    const insights = Object.entries(grouped).map(([key, { benchmark, data }]) => {
      const values = data.map((d) => d.value);
      const stats = calculateStats(values);
      const outliers = identifyOutliers(values);

      return {
        benchmarkId: key,
        benchmarkName: benchmark.name,
        category: benchmark.category,
        unit: benchmark.unit,
        stats,
        data,
        outliers,
      };
    });

    res.json({ societies, insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get society-specific insights
export const getSocietyInsights = async (req, res) => {
  try {
    const { societyId } = req.params;

    const society = await Society.findById(societyId);
    if (!society || society.isDeleted) {
      return res.status(404).json({ error: 'Society not found' });
    }

    // Get all benchmarks for this society
    const societyBenchmarks = await SocietyBenchmark.find({ societyId })
      .populate('benchmarkId')
      .lean();

    // Get average values across all societies for comparison
    const allSocieties = await Society.find({ isDeleted: false }).lean();
    const allSocietyIds = allSocieties.map((s) => s._id);

    const insights = await Promise.all(
      societyBenchmarks.map(async (sb) => {
        const benchmarkId = sb.benchmarkId._id;
        const allValues = await SocietyBenchmark.find({
          benchmarkId,
          societyId: { $in: allSocietyIds },
        })
          .select('value')
          .lean();

        const values = allValues.map((v) => v.value);
        const stats = calculateStats(values);
        const societyValue = sb.value;
        const percentile =
          values.filter((v) => v <= societyValue).length /
          values.length;

        return {
          benchmarkName: sb.benchmarkId.name,
          category: sb.benchmarkId.category,
          societyValue,
          averageValue: stats?.mean || 0,
          medianValue: stats?.median || 0,
          minValue: stats?.min || 0,
          maxValue: stats?.max || 0,
          percentile: Math.round(percentile * 100),
          isAboveAverage: societyValue > (stats?.mean || 0),
          isOutlier:
            values.length > 3 &&
            identifyOutliers(values).includes(societyValue),
        };
      })
    );

    res.json({ society, insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get summary statistics for all societies
export const getSummaryStats = async (req, res) => {
  try {
    const societies = await Society.find({ isDeleted: false }).lean();
    const societyCount = societies.length;

    if (societyCount === 0) {
      return res.json({
        totalSocieties: 0,
        avgMaintenanceCharge: 0,
        avgFlats: 0,
        avgArea: 0,
      });
    }

    // Get maintenance benchmark (typically in Building & Maintenance category)
    const maintenanceBenchmarks = await Benchmark.find({
      category: 'Building & Maintenance',
      isActive: true,
    }).lean();

    if (maintenanceBenchmarks.length === 0) {
      return res.json({
        totalSocieties: societyCount,
        avgMaintenanceCharge: 0,
        avgFlats: societies.reduce((sum, s) => sum + s.totalFlats, 0) / societyCount,
        avgArea: societies.reduce((sum, s) => sum + s.totalArea, 0) / societyCount,
      });
    }

    // Get maintenance charge values
    const maintenanceIds = maintenanceBenchmarks.map((b) => b._id);
    const maintenanceValues = await SocietyBenchmark.find({
      benchmarkId: { $in: maintenanceIds },
    })
      .select('value')
      .lean();

    const avgCharge =
      maintenanceValues.length > 0
        ? maintenanceValues.reduce((sum, v) => sum + v.value, 0) /
          maintenanceValues.length
        : 0;

    res.json({
      totalSocieties: societyCount,
      avgMaintenanceCharge: parseFloat(avgCharge.toFixed(2)),
      avgFlats: parseFloat(
        (societies.reduce((sum, s) => sum + s.totalFlats, 0) / societyCount).toFixed(0)
      ),
      avgArea: parseFloat(
        (societies.reduce((sum, s) => sum + s.totalArea, 0) / societyCount).toFixed(0)
      ),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
