import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Benchmark from './models/Benchmark.js';
import { seedBenchmarks } from './seeders/benchmarks.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS origins
const corsOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
];

// Add production frontend URL if set
if (process.env.FRONTEND_URL) {
  corsOrigins.push(process.env.FRONTEND_URL);
}

// Middleware
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}));

// Routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Seed benchmarks
    await seedBenchmarks(Benchmark);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`CORS enabled for:`, corsOrigins);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
