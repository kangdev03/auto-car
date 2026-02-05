import { Router } from "express";
import {
  getUserBookings,
  getMyCarBookings,
  getBookingSummary
} from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:id/bookings", requireAuth, getUserBookings);
router.get("/my-car-bookings", requireRole("owner", "admin"), getMyCarBookings);
router.get("/bookings/summary", requireRole("admin"), getBookingSummary);

export default router;
