import { MessageModel } from '../../models/message.model.js';

export class MessageMongoDao {
  async getAll() {
    return await MessageModel.find().sort({ createdAt: 1 }).lean(); // Ordenados por fecha
  }

  async create(messageData) {
    return await MessageModel.create(messageData);
  }
}