import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be at most 100 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Email format is invalid"
      ]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters"]
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [
        /^[0-9]{9,11}$/,
        "Phone number must contain 9–11 digits"
      ]
    },

    role: {
      type: String,
      enum: {
        values: ["user", "owner", "admin"],
        message: "Role must be user, owner or admin"
      },
      default: "user"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
