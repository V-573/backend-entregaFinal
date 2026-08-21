import { ServiceMongoDao } from '../dao/mongoDB/ServiceMongoDao.js';
import { ServiceRepository } from '../repositories/services.repository.js';
import { ServicesService } from '../services/services.service.js';

// Inyección de dependencias usando MongoDB
const serviceDao = new ServiceMongoDao();
const serviceRepository = new ServiceRepository(serviceDao);
const servicesService = new ServicesService(serviceRepository);

// 1. Obtener servicios (con soporte para filtros)
export const getServices = async (req, res) => {
  try {
 
    const { name, category, available, page, limit, sort } = req.query;

const result = await servicesService.getServices({
      name,
      category,
      available,
      page,
      limit,
      sort
    });

  
    return res.status(200).json({ 
      success: true, 
      message: result.data.length > 0 
      ? "Todos los servicios"
      : " no se encontraron servicios a los criterios especificados", 
      data:result.data,
    pagination: result.pagination 
  });

  } catch (error) {
    console.error("Error en getServices:", error.message);
    return res.status(404).json({
      success: false, 
      message: error.message || "Error al obtener datos"
    });
  }
};

// 2. Obtener un servicio específico por ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    // Pasamos 'id' directamente como string (sin parseInt)
    const data = await servicesService.getServiceById(id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message || `El ID no existe` });
  }
};

// 3. Crear un nuevo servicio
export const createService = async (req, res) => {
  try {
// req.body ya pasó por Zod middleware y viene validado/saneado

    const nuevoServicio = await servicesService.addService(req.body);

    // Si nuevoServicio es un documento de Mongoose, conviértelo a objeto plano
    const servicioPlain = nuevoServicio.toObject ? nuevoServicio.toObject() : nuevoServicio;

const io = req.app.get("socketio");

    if (io) {
          console.log("📢 Emitiendo servicio_creado:", servicioPlain);
      // 🔹 Enviamos el objeto con la data actualizada
      io.emit("servicio_creado", servicioPlain);
    }


    return res.status(201).json({ success: true, message: "Registro adicionado con éxito", data: servicioPlain });
  } catch (error) {
    // Aquí solo llegarán errores de base de datos o lógica interna (ej. servicio duplicado)
    return res.status(400).json({ success: false, message: error.message || "Se deben enviar datos completos" });
  }
};

// 4. Actualizar un servicio
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    // Pasamos 'id' directamente como string (sin parseInt)
    const data = await servicesService.updateService(id, req.body);

const io = req.app.get("socketio");
    if (io) {
  
      io.emit("servicio_actualizado", data); 
    }

    return res.status(200).json({
      success: true,
      message: 'Dato actualizado con éxito',
      data
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Error al actualizar" });
  }
};

// 5. Eliminar un servicio
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    // Pasamos 'id' directamente como string (sin parseInt)
    const data = await servicesService.deleteService(id);

const io = req.app.get("socketio");
    if (io) {
      io.emit("servicio_eliminado", id);
    }

    return res.status(200).json({ success: true, message: "Dato eliminado con éxito", data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message || "El dato no pudo ser eliminado" });
  }
};