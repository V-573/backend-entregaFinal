export class MessageRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getMessages() {
    return await this.dao.getAll();
  }

  async saveMessage(data) {
    return await this.dao.create(data);
  }
}