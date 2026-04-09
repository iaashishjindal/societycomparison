import express from 'express';
import {
  getAllSocieties,
  getSocietyById,
} from '../controllers/societyController.js';
import {
  getAllBenchmarks,
  getBenchmarksByCategory,
} from '../controllers/benchmarkController.js';
import {
  getComparisonData,
  getSocietyInsights,
  getSummaryStats,
} from '../controllers/insightsController.js';

const router = express.Router();

// Society routes
router.get('/societies', getAllSocieties);
router.get('/societies/:id', getSocietyById);

// Benchmark routes
router.get('/benchmarks', getAllBenchmarks);
router.get('/benchmarks-by-category', getBenchmarksByCategory);

// Comparison & Insights routes
router.get('/comparison', getComparisonData);
router.get('/insights/society/:societyId', getSocietyInsights);
router.get('/insights/summary', getSummaryStats);

export default router;
