import { Types } from "mongoose";

export class BookingService {
  constructor(bookingRepository, serviceRepository) {
    this.bookingRepository = bookingRepository;
    this.serviceRepository = serviceRepository;
  }


  
  async getBooking() {
    return await this.bookingRepository.getBooking();
  }


  async getBookingById(id) {

// 1. Validar si el ID enviado tiene el formato hexadecimal válido de MongoDB
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`❌ Formato de ID inválido: '${id}'. Debe ser un ObjectId de 24 caracteres.`);
    }

    // 2. Buscar en el repositorio / DAO
    const booking = await this.bookingRepository.getBookingById(id);

    // 3. Validar si el recurso existe en la base de datos
    if (!booking) {
      throw new Error(`❌ Reserva no encontrada con el ID: '${id}'.`);
    }

    return booking;
  }

  async createBooking(bookingData) {
    const { clientName, clientEmail, date, time, status} =
      bookingData;

    // Validación estricta de campos obligatorios
    if (
      clientName === undefined ||
      clientEmail === undefined ||
      date === undefined ||
      time === undefined ||
      status === undefined
    ) {
      throw new Error(
        "❌ Error: Todos los campos son obligatorios (clientName, clientEmail, date, time, status).",
      );
    }

    return await this.bookingRepository.createBooking(bookingData);
  }

  async addServiceToBooking(bookingId, serviceId) {
    // Validar formato de ambos IDs antes de consultar la base de datos
    if (!Types.ObjectId.isValid(bookingId)) {
      throw new Error(`❌ El ID de la reserva '${bookingId}' no tiene un formato válido.`);
    }

    if (!Types.ObjectId.isValid(serviceId)) {
      throw new Error(`❌ El ID del servicio '${serviceId}' no tiene un formato válido.`);
    }


    const booking = await this.bookingRepository.getBookingById(bookingId);
    if (!booking) {
      throw new Error("Reserva no encontrada");
    }
    const service = await this.serviceRepository.getServiceById(serviceId);
    if (!service) throw new Error("no esta disponible el servicio");

    // Lógica de acumulación de cantidad de servicio
    if (!booking.services) booking.services = [];

    // Buscamos si el servicio ya está registrado en esta reserva
    const serviceIndex = booking.services.findIndex(
      // (s) => s.service === serviceId,
      (s) => s.service._id.toString() === serviceId.toString() || s.service.toString() === serviceId.toString()
    );

    if (serviceIndex !== -1) {
      // Si ya existe, incrementamos su cantidad
      booking.services[serviceIndex].quantity += 1;
    } else {
      // Si no existe, lo agregamos con cantidad 1
      booking.services.push({
        service: serviceId,
        quantity: 1,
      });
    }

    return await this.bookingRepository.addServiceToBooking(
      bookingId,
      booking,
    );
  }
}
