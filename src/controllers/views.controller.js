import { ServiceMongoDao } from "../dao/mongoDB/ServiceMongoDao.js";
import { ServiceRepository } from "../repositories/services.repository.js";
import { ServicesService } from "../services/services.service.js";

import { BookingMongoDao } from "../dao/mongoDB/BookingMongoDao.js";
import { BookingRepository } from "../repositories/bookings.repository.js";
import { BookingService } from "../services/bookings.service.js";

// 1. Instanciación para Servicios
const serviceDao = new ServiceMongoDao();
const serviceRepository = new ServiceRepository(serviceDao);
const servicesService = new ServicesService(serviceRepository);

// 2. Instanciación para Reservas
const bookingDao = new BookingMongoDao();
const bookingRepository = new BookingRepository(bookingDao);
const bookingService = new BookingService(bookingRepository, serviceRepository);

// Función auxiliar para convertir cualquier documento de Mongoose a objeto JS plano
const toPlainObject = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map((item) => (item.toObject ? item.toObject() : item));
  }
  return data.toObject ? data.toObject() : data;
};

// GET /services
export const renderServices = async (req, res) => {
  try {
    // 1. servicesResponse es el objeto { data: [...], pagination: {...} }
    const servicesResponse = await servicesService.getServices();
    
    // 2. Extraemos el arreglo de data (y convertimos a objeto plano por seguridad)
    const rawList = servicesResponse.data || servicesResponse; 
    const services = toPlainObject(rawList);

    res.render("services", {
      title: "Servicios Disponibles",
      services, // Ahora 'services' vuelve a ser el arreglo [ {...}, {...} ]
      pagination: servicesResponse.pagination // Opcional: si quieres usar la paginación en el HTML
    });
  } catch (error) {
    res.status(500).render("services", {
      title: "Error al cargar servicios",
      error: error.message,
    });
  }
};

// GET /services/:sid
export const renderServiceDetail = async (req, res) => {
  try {
    const { sid } = req.params;
    const serviceRaw = await servicesService.getServiceById(sid);

    if (!serviceRaw) {
      return res.status(404).render("service-detail", {
        title: "Servicio no encontrado",
        error: "El servicio solicitado no existe.",
      });
    }

    const service = toPlainObject(serviceRaw);

    res.render("service-detail", {
      title: `Detalle - ${service.name}`,
      service,
    });
  } catch (error) {
    res.status(500).render("service-detail", {
      title: "Error en la consulta",
      error: error.message,
    });
  }
};

// GET /realtime-services
export const renderRealTimeServices = async (req, res) => {
  try {
    const servicesResponse = await servicesService.getServices();
    const rawList = servicesResponse.data || servicesResponse;
    const services = toPlainObject(rawList);

    res.render("services_realtime", {
      title: "Servicios en Tiempo Real",
      services,
    });
  } catch (error) {
    res.status(500).send("Error al cargar la vista en tiempo real");
  }
};

// GET /bookings
export const renderBookings = async (req, res) => {
  try {
    const bookingsRaw = await bookingService.getBooking();
    const bookings = toPlainObject(bookingsRaw);

    res.render("bookings", {
      title: `Reservas`,
      bookings,
    });
  } catch (error) {
    res.status(404).send("Reservas no encontradas");
  }
};

// GET /bookings/:id
export const renderBookingDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const bookingRaw = await bookingService.getBookingById(id);

    if (!bookingRaw) {
      return res.status(404).render("booking-detail", {
        title: "Reserva no encontrada",
        error: "La reserva solicitada no existe.",
      });
    }

    const booking = toPlainObject(bookingRaw);

    res.render("booking-detail", {
      title: `Detalle de reserva`,
      booking,
    });
  } catch (error) {
    res.status(404).send("Reserva no encontrada");
  }
};

// GET /realtime-bookings
export const renderRealTimeBookings = async (req, res) => {
  try {
    const bookingsRaw = await bookingService.getBooking();
    const bookings = toPlainObject(bookingsRaw);

    res.render("bookings_realtime", {
      title: "Reservas en Tiempo Real",
      reservas: bookings,
    });
  } catch (error) {
    res.status(500).send("Error al cargar la vista de reservas en tiempo real");
  }
};