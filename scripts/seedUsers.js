/**
 * Script tạo user mẫu để test đăng nhập
 * Chạy: node scripts/seedUsers.js
 */
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { connectDB } from "../config/db.config.js";
import User from "../models/user.model.js";

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@test.com",
    password: "1234",
    phone: "0901234567",
    role: "admin"
  },
  {
    name: "Car Owner",
    email: "owner@test.com",
    password: "1234",
    phone: "0901234568",
    role: "owner"
  },
  {
    name: "Regular User",
    email: "user@test.com",
    password: "1234",
    phone: "0901234569",
    role: "user"
  }
];

async function seed() {
  try {
    await connectDB();

    for (const u of users) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.findOneAndUpdate(
        { email: u.email },
        {
          $set: {
            name: u.name,
            email: u.email,
            password: hashed,
            phone: u.phone,
            role: u.role
          }
        },
        { upsert: true, new: true }
      );
      console.log(`✓ User: ${u.email} (${u.role})`);
    }

    console.log("\nĐã tạo user mẫu. Đăng nhập với:");
    console.log("  admin@test.com / 1234 (admin)");
    console.log("  owner@test.com / 1234 (owner)");
    console.log("  user@test.com / 1234 (user)");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
