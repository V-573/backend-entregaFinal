export class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  async getServices(queryParams = {}) {
    const {
      name,
      category,
      available,
      page = 1,
      limit = 10,
      sort,
    } = queryParams;

    // Normalización y preparación de opciones
    const options = {
      filters: {},
      pagination: {
        page: Math.max(1, parseInt(page, 10) || 1),
        limit: Math.max(1, parseInt(limit, 10) || 10),
      },
      sort: null,
    };
    return await this.repository.getServices(options);
  }

  async getServiceById(id) {
    return await this.repository.getServiceById(id);
  }

  async addService(serviceData) {
    return await this.repository.addService(serviceData);
  }

  async updateService(id, updateData) {
    return await this.repository.updateData(id, updateData);
  }

  async deleteService(id) {
    return await this.repository.deleteService(id);
  }
}
