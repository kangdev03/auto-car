import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import userRoutes from "./routes/user.routes.js";
import carRoutes from "./routes/car.routes.js";

dotenv.config();
const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "car-rental-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 giờ
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);
app.use("/cars", carRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
