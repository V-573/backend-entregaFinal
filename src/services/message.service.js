import { MessageMongoDao } from '../dao/mongoDB/MessageMongoDao.js';
import { MessageRepository } from '../repositories/message.repository.js';

const messageDao = new MessageMongoDao();
const messageRepository = new MessageRepository(messageDao);

export class MessageService {
  static async getHistory() {
    return await messageRepository.getMessages();
  }

  static async sendMessage(user, message) {
    if (!user || !message) {
      throw new Error('El usuario y el mensaje son obligatorios.');
    }
    return await messageRepository.saveMessage({ user, message });
  }
}