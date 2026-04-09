import Society from '../models/Society.js';
import SocietyBenchmark from '../models/SocietyBenchmark.js';

// Get all societies (public)
export const getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(societies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get society by ID with benchmarks (public)
export const getSocietyById = async (req, res) => {
  try {
    const { id } = req.params;
    const society = await Society.findById(id);

    if (!society || society.isDeleted) {
      return res.status(404).json({ error: 'Society not found' });
    }

    const benchmarks = await SocietyBenchmark.find({ societyId: id })
      .populate('benchmarkId')
      .lean();

    res.json({ society, benchmarks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new society (admin)
export const createSociety = async (req, res) => {
  try {
    const { name, location, totalFlats, totalArea, yearEstablished } = req.body;

    if (!name || !location || !totalFlats || !totalArea || !yearEstablished) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const society = new Society({
      name,
      location,
      totalFlats,
      totalArea,
      yearEstablished,
    });

    await society.save();
    res.status(201).json(society);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update society (admin)
export const updateSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, totalFlats, totalArea, yearEstablished } = req.body;

    const society = await Society.findById(id);
    if (!society || society.isDeleted) {
      return res.status(404).json({ error: 'Society not found' });
    }

    if (name !== undefined) society.name = name;
    if (location !== undefined) society.location = location;
    if (totalFlats !== undefined) society.totalFlats = totalFlats;
    if (totalArea !== undefined) society.totalArea = totalArea;
    if (yearEstablished !== undefined) society.yearEstablished = yearEstablished;

    await society.save();
    res.json(society);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete society (admin)
export const deleteSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const society = await Society.findById(id);

    if (!society || society.isDeleted) {
      return res.status(404).json({ error: 'Society not found' });
    }

    society.isDeleted = true;
    await society.save();
    res.json({ message: 'Society deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
