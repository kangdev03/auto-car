import { Router } from "express";
import {
  showLoginForm,
  login,
  logout
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", showLoginForm);
router.post("/login", login);
router.post("/logout", logout);

export default router;
