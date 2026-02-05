import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required"]
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"]
    },

    car_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Car is required"]
    },

    start_date: {
      type: Date,
      required: [true, "Start date is required"]
    },

    end_date: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return value > this.start_date;
        },
        message: "End date must be after start date"
      }
    },

    signed_at: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Contract = mongoose.model("Contract", contractSchema);
export default Contract;
