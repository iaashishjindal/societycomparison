import Benchmark from '../models/Benchmark.js';
import SocietyBenchmark from '../models/SocietyBenchmark.js';

export const getBenchmarks = async (req, res) => {
  try {
    const benchmarks = await Benchmark.find().sort({ category: 1 });
    res.json(benchmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSocietyBenchmarks = async (req, res) => {
  try {
    const benchmarks = await SocietyBenchmark.find({ societyId: req.params.societyId })
      .populate('benchmarkId');
    res.json(benchmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSocietyBenchmarks = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { benchmarks } = req.body;

    for (const benchmark of benchmarks) {
      const { benchmarkId, value, notes } = benchmark;

      await SocietyBenchmark.findOneAndUpdate(
        { societyId, benchmarkId },
        { value, notes, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Benchmarks updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
