import mongoose from 'mongoose';

const societySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: String,
  totalFlats: {
    type: Number,
    required: true,
  },
  totalArea: {
    type: Number,
    required: true,
    description: 'Total area in square feet',
  },
  yearEstablished: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Society', societySchema);
