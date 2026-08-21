import { MessageService } from "../services/message.service.js";

// GET /api/messages - Obtener historial completo
export const getMessages = async (req, res) => {
  try {
    const messages = await MessageService.getHistory();
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/messages - Crear un mensaje manual desde HTTP / Postman
export const createMessage = async (req, res) => {
  try {
    const { user, message } = req.body;
    const newMessage = await MessageService.sendMessage(user, message);
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
