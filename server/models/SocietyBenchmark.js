import mongoose from 'mongoose';

const societyBenchmarkSchema = new mongoose.Schema(
  {
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
      min: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Ensure unique combination of society and benchmark
societyBenchmarkSchema.index({ societyId: 1, benchmarkId: 1 }, { unique: true });

const SocietyBenchmark = mongoose.model('SocietyBenchmark', societyBenchmarkSchema);
export default SocietyBenchmark;
