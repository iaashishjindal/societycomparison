import Benchmark from '../models/Benchmark.js';
import SocietyBenchmark from '../models/SocietyBenchmark.js';
import Society from '../models/Society.js';

// Get all benchmarks (public)
export const getAllBenchmarks = async (req, res) => {
  try {
    const benchmarks = await Benchmark.find({ isActive: true })
      .sort({ category: 1, name: 1 })
      .lean();
    res.json(benchmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get benchmarks by category (public)
export const getBenchmarksByCategory = async (req, res) => {
  try {
    const benchmarks = await Benchmark.find({ isActive: true })
      .sort({ category: 1, name: 1 })
      .lean();

    const grouped = benchmarks.reduce((acc, benchmark) => {
      if (!acc[benchmark.category]) {
        acc[benchmark.category] = [];
      }
      acc[benchmark.category].push(benchmark);
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get benchmarks for a society (admin)
export const getSocietyBenchmarks = async (req, res) => {
  try {
    const { societyId } = req.params;

    const society = await Society.findById(societyId);
    if (!society || society.isDeleted) {
      return res.status(404).json({ error: 'Society not found' });
    }

    const benchmarks = await SocietyBenchmark.find({ societyId })
      .populate('benchmarkId')
      .lean();

    res.json(benchmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save/Update benchmark value for a society (admin)
export const saveSocietyBenchmark = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { benchmarkId, value, notes } = req.body;

    if (!benchmarkId || value === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const society = await Society.findById(societyId);
    if (!society || society.isDeleted) {
      return res.status(404).json({ error: 'Society not found' });
    }

    const benchmark = await Benchmark.findById(benchmarkId);
    if (!benchmark) {
      return res.status(404).json({ error: 'Benchmark not found' });
    }

    let societyBenchmark = await SocietyBenchmark.findOne({
      societyId,
      benchmarkId,
    });

    if (societyBenchmark) {
      societyBenchmark.value = value;
      societyBenchmark.notes = notes || '';
    } else {
      societyBenchmark = new SocietyBenchmark({
        societyId,
        benchmarkId,
        value,
        notes: notes || '',
      });
    }

    await societyBenchmark.save();
    await societyBenchmark.populate('benchmarkId');

    res.json(societyBenchmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk save benchmarks for a society (admin)
export const saveBulkBenchmarks = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { benchmarks } = req.body; // Array of {benchmarkId, value, notes}

    if (!Array.isArray(benchmarks)) {
      return res.status(400).json({ error: 'benchmarks must be an array' });
    }

    const society = await Society.findById(societyId);
    if (!society || society.isDeleted) {
      return res.status(404).json({ error: 'Society not found' });
    }

    const results = [];

    for (const { benchmarkId, value, notes } of benchmarks) {
      if (!benchmarkId || value === undefined) continue;

      const benchmark = await Benchmark.findById(benchmarkId);
      if (!benchmark) continue;

      let societyBenchmark = await SocietyBenchmark.findOne({
        societyId,
        benchmarkId,
      });

      if (societyBenchmark) {
        societyBenchmark.value = value;
        societyBenchmark.notes = notes || '';
      } else {
        societyBenchmark = new SocietyBenchmark({
          societyId,
          benchmarkId,
          value,
          notes: notes || '',
        });
      }

      await societyBenchmark.save();
      results.push(societyBenchmark);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
