import mongoose from 'mongoose';

const societySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    totalFlats: {
      type: Number,
      required: true,
      min: 1,
    },
    totalArea: {
      type: Number,
      required: true,
      min: 1,
      description: 'Total area in square feet',
    },
    yearEstablished: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
societySchema.index({ isDeleted: 1, location: 1 });

const Society = mongoose.model('Society', societySchema);
export default Society;
