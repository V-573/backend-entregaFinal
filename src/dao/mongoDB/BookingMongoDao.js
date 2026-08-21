import { BookingModel } from '../../models/bookings.model.js';

export class BookingMongoDao {
  async getBooking() {
    // populate reemplaza los ObjectIds de los servicios por los objetos completos del servicio
    return await BookingModel.find().populate('services.service').lean();
  }

  async getBookingById(id) {
    return await BookingModel.findById(id).populate('services.service').lean();
  }

  async createBooking(bookingData) {
    // return await BookingModel.create(bookingData);

    const newBooking = await BookingModel.create(bookingData);
  // Popularizamos los servicios antes de retornar hacia el service/controller
  return await BookingModel.findById(newBooking._id).populate('services.service').lean();
  }

  async addServiceToBooking(bookingId, bookingData) {
    // Actualiza la reserva guardando el arreglo de servicios modificado
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      { services: bookingData.services },
      { new: true } // Regresa el documento ya actualizado
    ).populate('services.service').lean();
  }
}