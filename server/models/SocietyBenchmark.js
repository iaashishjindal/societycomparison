import mongoose from 'mongoose';

const societyBenchmarkSchema = new mongoose.Schema({
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true,
  },
  benchmarkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Benchmark',
    required: true,
  },
  value: {
    type: Number,
    required: true,
    description: 'Benchmark value for the society',
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('SocietyBenchmark', societyBenchmarkSchema);
