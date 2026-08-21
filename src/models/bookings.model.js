import { Schema, model } from 'mongoose';

const bookingSchema = new Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true, default: 'pending' },
  services: [
    {
      service: {
        type: Schema.Types.ObjectId,
        ref: 'Service', // Apunta al modelo registrado como 'Service'
        required: true
      },
      quantity: { type: Number, default: 1 }
    }
  ]
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

export const BookingModel = model('Booking', bookingSchema);