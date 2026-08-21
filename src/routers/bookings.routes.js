import { Router } from "express";
import { validateSchema } from "../middlewares/validate.meddleware.js";
import { createBookingSchema } from "../validations/booking.validations.js";
import {
  createBooking,
  getBookingById,
  addServiceToBooking,
  getBooking,
} from "../controllers/booking.controller.js";

const router = Router();

router.post("/", validateSchema(createBookingSchema), createBooking);

router.get("/:bid", getBookingById);
router.get("/", getBooking);

router.post("/:bid/services/:sid", addServiceToBooking);

export default router;
