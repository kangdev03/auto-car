import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";
import User from "../models/user.model.js";
import Contract from "../models/contract.model.js";
import AppError from "../utils/AppError.js";

export const showCreateBookingForm = async (req, res, next) => {
  try {
    const cars = await Car.find({ status: "available" }).sort({ name: 1 });
    const preselectedCarId = req.query.carId || null;
    res.render("booking/create", { cars, preselectedCarId });
  } catch (err) {
    console.error("Error in showCreateBookingForm:", err);
    next(err);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.userId) filter.user_id = req.query.userId;

    const bookings = await Booking.find(filter)
      .populate("user_id")
      .populate("car_id");

    res.render("booking/index", { bookings });
  } catch (err) {
    console.error("Error in getBookings:", err);
    next(err);
  }
};

export const getBookingDetail = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user_id")
      .populate("car_id");

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    res.render("booking/detail", { booking });
  } catch (err) {
    console.error("Error in getBookingDetail:", err);
    next(err);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      return res.redirect("/auth/login?redirect=/bookings/create");
    }

    const { carId, startDate, endDate } = req.body;

    const car = await Car.findById(carId);
    if (!car) throw new AppError("Car not found", 404);

    const conflict = await Booking.findOne({
      car_id: carId,
      status: { $in: ["pending", "confirmed"] },
      start_date: { $lte: new Date(endDate) },
      end_date: { $gte: new Date(startDate) }
    });

    if (conflict) {
      throw new AppError("Car is already booked", 400);
    }

    await Booking.create({
      user_id: userId,
      car_id: carId,
      start_date: startDate,
      end_date: endDate
    });

    res.redirect("/bookings");
  } catch (err) {
    console.error("Error in createBooking:", err);
    next(err);
  }
};

export const confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) throw new AppError("Booking not found", 404);

    booking.status = "confirmed";
    await booking.save();

    await Contract.create({
      booking_id: booking._id,
      user_id: booking.user_id,
      car_id: booking.car_id,
      start_date: booking.start_date,
      end_date: booking.end_date
    });

    res.redirect("/bookings");
  } catch (err) {
    console.error("Error in confirmBooking:", err);
    next(err);
  }
};
