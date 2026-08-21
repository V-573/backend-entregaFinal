import { ServiceModel } from '../../models/services.models.js'; // Ajusta la ruta a tu modelo de Mongoose

export class ServiceMongoDao {
  // 1. Obtener todos los servicios registrados en MongoDB
  async getServices(options = {}) {
    const { filters = {}, pagination = {}, sort } = options;
    const { page = 1, limit = 10 } = pagination;

    // Construcción dinámica del query de Mongoose
    const mongoQuery = {};

    if (filters.name) {
      mongoQuery.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.category) {
      mongoQuery.category = { $regex: filters.category, $options: 'i' };
    }

    if (filters.available !== undefined) {
      mongoQuery.available = filters.available;
    }

    //verifico lo que envio a mongo:
console.log("Filtro enviado a MongoDB:", JSON.stringify(mongoQuery, null, 2));
    // Calculamos el desplazamiento (skip)
    const skip = (page - 1) * limit;

    // Configuración de ordenamiento por precio
    const sortConfig = {};
    if (sort) {
      sortConfig.price = sort; // 1 para asc, -1 para desc
    }

    // Ejecutamos la consulta y el conteo en paralelo para optimizar rendimiento
    const [data, totalItems] = await Promise.all([
      ServiceModel.find(mongoQuery)
        .sort(sortConfig)
        .skip(skip)
        .limit(limit)
        .lean(),
      ServiceModel.countDocuments(mongoQuery)
    ]);

    return {
      data,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit
      }
    };
  }

  // 2. Buscar un servicio por su _id único de MongoDB
  async getServiceById(id) {
    const service = await ServiceModel.findById(id).lean();
    
    if (!service) {
      throw new Error(`El servicio con ID ${id} no existe.`);
    }
    
    return service;
  }

  // 3. Buscar por Nombre (insensible a mayúsculas/minúsculas y coincidencia parcial)
  // async getServicesByName(name) {
  //   // Usamos $regex para buscar el string y $options: 'i' para ignorar mayúsculas/minúsculas
  //   const filteredServices = await ServiceModel.find({
  //     name: { $regex: name, $options: 'i' }
  //   });

  //   if (filteredServices.length === 0) {
  //     throw new Error(`No se encontraron servicios que coincidan con: ${name}`);
  //   }

  //   return filteredServices;
  // }

  // // 4. Filtrar por disponibilidad (disponible = true/false)
  // async getServicesByAvailable(availableStatus) {
  //   const filteredAvailable = await ServiceModel.find({ available: availableStatus });

  //   if (filteredAvailable.length === 0) {
  //     throw new Error("No se encontraron servicios disponibles.");
  //   }

  //   return filteredAvailable;
  // }

  // // 5. Filtrar por categoría (búsqueda parcial insensible a mayúsculas)
  // async getServicesByCategory(category) {
  //   const filteredCategory = await ServiceModel.find({
  //     category: { $regex: category, $options: 'i' }
  //   });

  //   return filteredCategory;
  // }

  // 6. Crear un nuevo servicio
 
 
  async addService(serviceData) {
    // MongoDB genera automáticamente el _id (ObjectId de 24 caracteres)
    const newService = await ServiceModel.create(serviceData);
    return newService;
  }

  // 7. Actualizar un servicio existente
  async updateData(id, updatedData) {
    // findByIdAndUpdate requiere: 1) id, 2) objeto a actualizar, 3) { new: true } para retornar el documento ya actualizado
    const updatedService = await ServiceModel.findByIdAndUpdate(id, updatedData, { 
      new: true,
      runValidators: true // Asegura que los datos actualizados cumplan el esquema de Mongoose
    }).lean();

    if (!updatedService) {
      throw new Error(`No se puede actualizar. El servicio con ID ${id} no existe.`);
    }

    return updatedService;
  }

  // 8. Eliminar un servicio por su _id
  async deleteService(id) {
    const deletedService = await ServiceModel.findByIdAndDelete(id);

    if (!deletedService) {
      throw new Error(`No se puede eliminar. El servicio con ID ${id} no existe.`);
    }

    return deletedService;
  }
}