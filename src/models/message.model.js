import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "El usuario es obligatorio"],
    },
    message: {
      type: String,
      required: [true, "El mensaje no puede estar vacío"],
    },
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
  },
);

export const MessageModel = mongoose.model("messages", messageSchema);
