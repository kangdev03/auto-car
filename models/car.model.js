import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: [true, "Car name is required"],
      trim: true,
      minlength: [2, "Car name must be at least 2 characters"],
      maxlength: [100, "Car name must be at most 100 characters"]
    },

    status: {
      type: String,
      enum: {
        values: ["available", "booked"],
        message: "Status must be available or booked"
      },
      default: "available"
    },

    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
      min: [0, "Price per day must be >= 0"]
    }
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
