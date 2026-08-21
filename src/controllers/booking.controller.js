// DAO y Repositorios para MongoDB
import { BookingMongoDao } from "../dao/mongoDB/BookingMongoDao.js";
import { BookingRepository } from "../repositories/bookings.repository.js";
import { BookingService } from "../services/bookings.service.js";

import { ServiceMongoDao } from "../dao/mongoDB/ServiceMongoDao.js";
import { ServiceRepository } from "../repositories/services.repository.js";

// Instanciación de Services
const serviceDao = new ServiceMongoDao();
const serviceRepository = new ServiceRepository(serviceDao);

// Instanciación de Bookings
const bookingDao = new BookingMongoDao();
const bookingRepository = new BookingRepository(bookingDao);
const bookingService = new BookingService(bookingRepository, serviceRepository);

// exportamos las funciones controladoras directamente
export const getBooking = async (req, res) => {
  try {
    const data = await bookingService.getBooking();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { bid } = req.params;
    const data = await bookingService.getBookingById(bid);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const nuevaReserva = await bookingService.createBooking(req.body);

// 2. Obtener la instancia de Socket.io
    const io = req.app.get("socketio");

    // 3. Emitir a TODOS los clientes conectados
    io.emit("reserva_creada", nuevaReserva);

    res
      .status(201)
      .json({ success: true, message: "Reserva adicionada con éxito", data: nuevaReserva });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addServiceToBooking = async (req, res) => {
  try {
    const { bid, sid } = req.params;
    const bookingId = bid;
    const serviceId = sid;

    // 2. Si existe, procedemos a agregarlo a la reserva
    const reservaActualizada = await bookingService.addServiceToBooking(bookingId, serviceId);

    const io = req.app.get("socketio");
    // Emitimos evento de actualización de la reserva
    io.emit("reserva_actualizada", reservaActualizada);

    res.status(200).json({
      success: true,
      message: "Servicio agregado a la reserva con éxito",
      data: reservaActualizada,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
