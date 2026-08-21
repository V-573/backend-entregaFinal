import { Schema, model } from 'mongoose';

const serviceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true }, // en minutos
  price: { type: Number, required: true },
  category: { type: String },
  available: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const ServiceModel = model('Service', serviceSchema);