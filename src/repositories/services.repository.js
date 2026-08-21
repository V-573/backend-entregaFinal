export class ServiceRepository {
  constructor(dao) {
    this.dao = dao;
  }

async getServices(options){
    return await this.dao.getServices(options);
}

async getServiceById(id){
    return await this.dao.getServiceById(id)
}


async addService(serviceData){
 return await this.dao.addService(serviceData);

}

async updateData(id, updateData){

    return await this.dao.updateData(id, updateData);
}

async deleteService(id){

return await this.dao.deleteService(id);

}



}
