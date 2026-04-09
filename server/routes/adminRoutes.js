import express from 'express';
import {
  createSociety,
  updateSociety,
  deleteSociety,
} from '../controllers/societyController.js';
import {
  getSocietyBenchmarks,
  saveSocietyBenchmark,
  saveBulkBenchmarks,
} from '../controllers/benchmarkController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin authentication
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (password === 'admin123') {
    req.session.isAdmin = true;
    res.json({ success: true, message: 'Admin logged in' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out' });
  });
});

// Protected routes (require admin auth)
router.use(adminAuth);

// Society management
router.post('/societies', createSociety);
router.put('/societies/:id', updateSociety);
router.delete('/societies/:id', deleteSociety);

// Benchmark management
router.get('/benchmarks/:societyId', getSocietyBenchmarks);
router.post('/benchmarks/:societyId', saveSocietyBenchmark);
router.post('/benchmarks/:societyId/bulk', saveBulkBenchmarks);

export default router;
