import { createServer } from "node:http";
import { Server } from "socket.io";
import { env } from "./config/env.config.js";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = parseInt(env.PORT, 10) || 8080;

const httpServer = createServer(app);
const io = new Server(httpServer);

// 🔹 Adjuntamos 'io' a la aplicación para usarlo en cualquier Router o Controller
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("Cliente conectado ID:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();
