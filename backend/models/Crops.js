import mongoose from 'mongoose';

const grainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marathi_name: { type: String, required: true },
  type: { type: String, required: true },
});

const vegetableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marathi_name: { type: String, required: true },
  marathi_english_name: { type: String, required: true },
  type: { type: String, required: true }
});

// Create models for Grain and Vegetable
const Grain = mongoose.model("Grains", grainSchema);
const Vegetable = mongoose.model("Vegetables", vegetableSchema);

export { Grain, Vegetable };

