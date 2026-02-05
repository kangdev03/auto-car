import { Router } from "express";
import { getCars, searchCars } from "../controllers/car.controller.js";

const router = Router();

router.get("/", getCars);
router.get("/search", searchCars);

export default router;
