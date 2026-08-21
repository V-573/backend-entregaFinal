import { Router } from "express";
import servicesRouter from "./services.routes.js";
import bookingsRouter from "./bookings.routes.js";
import messagesRouter from "./messages.router.js";
// import viewsRouter from "./views.router.js";

const mainRouter = Router();

// Aquí asignamos el prefijo de manera global
mainRouter.use("/services", servicesRouter);
mainRouter.use("/bookings", bookingsRouter);
mainRouter.use("/messages", messagesRouter);
// mainRouter.use("/views", viewsRouter );

export default mainRouter;