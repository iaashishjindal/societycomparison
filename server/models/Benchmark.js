import mongoose from 'mongoose';

const benchmarkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'Building & Maintenance',
        'Utilities',
        'Security & Safety',
        'Amenities & Recreation',
        'Administration',
      ],
      required: true,
    },
    unit: {
      type: String,
      enum: ['per sq ft', 'per unit', 'percentage', 'per month'],
      default: 'per sq ft',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Benchmark = mongoose.model('Benchmark', benchmarkSchema);
export default Benchmark;
