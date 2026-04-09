import express from 'express';
import { getSocieties, getSocietyById } from '../controllers/societyController.js';
import { getBenchmarks } from '../controllers/benchmarkController.js';
import { getComparisonData, getInsights, getTrendsData } from '../controllers/insightsController.js';

const router = express.Router();

router.get('/societies', getSocieties);
router.get('/societies/:id', getSocietyById);
router.get('/benchmarks', getBenchmarks);
router.get('/comparison', getComparisonData);
router.get('/insights', getInsights);
router.get('/trends', getTrendsData);

export default router;
