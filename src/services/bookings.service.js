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
      throw new Error(`❌ Formato de ID inválido: '${id}'. Revisar el formato de reserva, debe ser un ObjectId de 24 caracteres o la reserva que consulta no existe.`);
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
      throw new Error(`❌ El ID del servicio '${serviceId}' no tiene un formato válido o no existe el servicio.`);
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

async removeServiceFromBooking(bookingId, serviceId) {
  // 1. Validar formato de ObjectIds
  if (!Types.ObjectId.isValid(bookingId)) {
    throw new Error(`❌ El ID de la reserva '${bookingId}' no tiene un formato válido.`);
  }

  if (!Types.ObjectId.isValid(serviceId)) {
    throw new Error(`❌ El ID del servicio '${serviceId}' no tiene un formato válido.`);
  }

  // 2. Obtener reserva
  const booking = await this.bookingRepository.getBookingById(bookingId);
  if (!booking) {
    throw new Error("Reserva no encontrada");
  }

  if (!booking.services || booking.services.length === 0) {
    throw new Error("La reserva no contiene servicios para reducir o eliminar.");
  }

  // 3. Buscar el índice del servicio dentro del arreglo
  const serviceIndex = booking.services.findIndex((s) => {
    const sId = s.service._id ? s.service._id.toString() : s.service.toString();
    return sId === serviceId.toString();
  });

  if (serviceIndex === -1) {
    throw new Error("El servicio especificado no existe en esta reserva.");
  }

  // 4. Lógica de decremento o eliminación completa
  if (booking.services[serviceIndex].quantity > 1) {
    // Si hay más de 1, restamos 1 a la cantidad
    booking.services[serviceIndex].quantity -= 1;
  } else {
    // Si la cantidad es 1, removemos el servicio del arreglo
    booking.services.splice(serviceIndex, 1);
  }

  // 5. Guardar cambios en el repositorio
  return await this.bookingRepository.updateBookingServices(
    bookingId,
    booking.services
  );
}

async updateServiceQuantity(bookingId, serviceId, newQuantity) {
  // 1. Validar formato de ObjectIds
  if (!Types.ObjectId.isValid(bookingId)) {
    throw new Error(`❌ El ID de la reserva '${bookingId}' no tiene un formato válido.`);
  }

  if (!Types.ObjectId.isValid(serviceId)) {
    throw new Error(`❌ El ID del servicio '${serviceId}' no tiene un formato válido.`);
  }

  // 2. Buscar la reserva
  const booking = await this.bookingRepository.getBookingById(bookingId);
  if (!booking) {
    throw new Error("Reserva no encontrada.");
  }

  if (!booking.services || booking.services.length === 0) {
    throw new Error("La reserva no contiene servicios.");
  }

  // 3. Localizar el índice del servicio
  const serviceIndex = booking.services.findIndex((s) => {
    const sId = s.service._id ? s.service._id.toString() : s.service.toString();
    return sId === serviceId.toString();
  });

  if (serviceIndex === -1) {
    throw new Error("El servicio especificado no está registrado en esta reserva.");
  }

  // 4. Actualizar o eliminar según la cantidad
  if (newQuantity === 0) {
    // Si la nueva cantidad es 0, removemos el servicio
    booking.services.splice(serviceIndex, 1);
  } else {
    // Si es mayor a 0, actualizamos la cantidad
    booking.services[serviceIndex].quantity = newQuantity;
  }

  // 5. Persistir cambios mediante el repositorio
  return await this.bookingRepository.updateBookingServices(
    bookingId,
    booking.services
  );
}

async deleteBooking(bookingId) {
  // 1. Validar formato de ObjectId
  if (!Types.ObjectId.isValid(bookingId)) {
    throw new Error(`❌ El ID de la reserva '${bookingId}' no tiene un formato válido.`);
  }

  // 2. Verificar que la reserva exista antes de intentar eliminarla
  const booking = await this.bookingRepository.getBookingById(bookingId);
  if (!booking) {
    throw new Error(`❌ Reserva no encontrada con el ID: '${bookingId}'.`);
  }

  // 3. Proceder con la eliminación en el repositorio
  return await this.bookingRepository.deleteBooking(bookingId);
}

}
