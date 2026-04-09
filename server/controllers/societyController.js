import Society from '../models/Society.js';
import SocietyBenchmark from '../models/SocietyBenchmark.js';

export const createSociety = async (req, res) => {
  try {
    const { name, location, totalFlats, totalArea, yearEstablished } = req.body;
    
    if (!name || !totalFlats || !totalArea) {
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

export const getSocieties = async (req, res) => {
  try {
    const societies = await Society.find().sort({ createdAt: -1 });
    res.json(societies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSocietyById = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }
    
    const benchmarks = await SocietyBenchmark.find({ societyId: req.params.id })
      .populate('benchmarkId');
    
    res.json({ society, benchmarks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSociety = async (req, res) => {
  try {
    const { name, location, totalFlats, totalArea, yearEstablished } = req.body;
    
    const society = await Society.findByIdAndUpdate(
      req.params.id,
      {
        name,
        location,
        totalFlats,
        totalArea,
        yearEstablished,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    res.json(society);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSociety = async (req, res) => {
  try {
    const society = await Society.findByIdAndDelete(req.params.id);
    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    await SocietyBenchmark.deleteMany({ societyId: req.params.id });
    res.json({ message: 'Society deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
