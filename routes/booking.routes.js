import { Router } from "express";
import {
  getBookings,
  showCreateBookingForm,
  createBooking,
  confirmBooking,
  getBookingDetail
} from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getBookings);
router.get("/create", requireAuth, showCreateBookingForm);
router.get("/:id", getBookingDetail);
router.post("/", requireAuth, createBooking);
router.post("/:bookingId/confirm", confirmBooking);

export default router;
