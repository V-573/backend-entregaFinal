import {Router} from "express";
import {
  renderBookingDetail,
  renderServiceDetail,
  renderRealTimeServices,
  renderServices,
  renderBookings,
  renderRealTimeBookings,
} from "../controllers/views.controller.js";
const router = Router();

router.get("/", (req, res) => res.redirect("services"));
router.get("/services", renderServices);
router.get("/realtime-services", renderRealTimeServices);
router.get("/realtime-bookings", renderRealTimeBookings);
router.get("/bookings/:id", renderBookingDetail);
router.get("/bookings", renderBookings);
router.get("/services/:sid", renderServiceDetail);

export default router;
