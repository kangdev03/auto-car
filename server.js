import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.config.js";

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import userRoutes from "./routes/user.routes.js";
import carRoutes from "./routes/car.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Connect to DB with error handling
connectDB().catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});

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
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.redirect("/cars");
});

app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);
app.use("/cars", carRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.status || 500;
  
  // Try to render error view, fallback to JSON if it fails
  try {
    res.status(statusCode).render("error", {
      message: err.message || "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err : {}
    });
  } catch (renderError) {
    console.error("Error rendering error page:", renderError);
    res.status(statusCode).json({
      error: err.message || "Internal Server Error"
    });
  }
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;
