import mongoose from 'mongoose';

const benchmarkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  category: {
    type: String,
    enum: ['Building & Maintenance', 'Utilities', 'Security & Safety', 'Amenities & Recreation', 'Administration'],
    required: true,
  },
  unit: {
    type: String,
    default: 'per sq ft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Benchmark', benchmarkSchema);
