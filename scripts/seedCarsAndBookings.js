/**
 * Script tạo xe và booking mẫu cho owner
 * Owner đăng nhập sẽ thấy dữ liệu trong My Car Bookings
 * Chạy: node scripts/seedCarsAndBookings.js
 * (Chạy seedUsers.js trước nếu chưa có user)
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.config.js";
import User from "../models/user.model.js";
import Car from "../models/car.model.js";
import Booking from "../models/booking.model.js";

dotenv.config();

async function seed() {
  try {
    await connectDB();

    const owner = await User.findOne({ email: "owner@test.com" });
    const user = await User.findOne({ email: "user@test.com" });

    if (!owner || !user) {
      console.log("Chạy npm run seed:users trước để tạo user.");
      process.exit(1);
    }

    const carsData = [
      { name: "Toyota Vios", pricePerDay: 30, status: "available", owner_id: owner._id },
      { name: "Honda City", pricePerDay: 35, status: "available", owner_id: owner._id },
      { name: "Mazda 3", pricePerDay: 45, status: "available", owner_id: owner._id }
    ];

    const cars = [];
    for (const c of carsData) {
      const car = await Car.findOneAndUpdate(
        { name: c.name, owner_id: owner._id },
        { $set: c },
        { upsert: true, new: true }
      );
      cars.push(car);
      console.log(`✓ Car: ${car.name} (owner: owner@test.com)`);
    }

    const now = new Date();
    const start1 = new Date(now);
    start1.setDate(start1.getDate() + 2);
    const end1 = new Date(start1);
    end1.setDate(end1.getDate() + 3);

    const start2 = new Date(now);
    start2.setDate(start2.getDate() + 7);
    const end2 = new Date(start2);
    end2.setDate(end2.getDate() + 5);

    const bookingsData = [
      { user_id: user._id, car_id: cars[0]._id, start_date: start1, end_date: end1, status: "pending" },
      { user_id: user._id, car_id: cars[1]._id, start_date: start2, end_date: end2, status: "confirmed" }
    ];

    for (const b of bookingsData) {
      const exists = await Booking.findOne({
        car_id: b.car_id,
        user_id: b.user_id,
        start_date: b.start_date
      });
      if (!exists) {
        await Booking.create(b);
        const car = cars.find((c) => c._id.equals(b.car_id));
        console.log(`✓ Booking: ${car?.name} - ${b.status}`);
      }
    }

    console.log("\nĐã tạo dữ liệu mẫu. Đăng nhập owner@test.com / 1234 để xem My Car Bookings.");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
