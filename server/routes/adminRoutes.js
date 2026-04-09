import express from 'express';
import { checkAdminAuth } from '../middleware/auth.js';
import {
  createSociety,
  updateSociety,
  deleteSociety,
  getSocieties,
} from '../controllers/societyController.js';
import {
  updateSocietyBenchmarks,
  getSocietyBenchmarks,
  getBenchmarks,
} from '../controllers/benchmarkController.js';

const router = express.Router();

// Admin login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.json({ message: 'Logged in' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

router.get('/check', (req, res) => {
  res.json({ isAdmin: req.session.isAdmin || false });
});

// Protected routes
router.use(checkAdminAuth);

// Society management
router.post('/societies', createSociety);
router.get('/societies', getSocieties);
router.put('/societies/:id', updateSociety);
router.delete('/societies/:id', deleteSociety);

// Benchmark management
router.get('/benchmarks', getBenchmarks);
router.get('/benchmarks/:societyId', getSocietyBenchmarks);
router.post('/benchmarks/:societyId', updateSocietyBenchmarks);

export default router;
