import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.start_date;
        },
        message: "End date must be after start date",
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

bookingSchema.virtual("total_cost").get(function () {
  if (!this.car_id?.pricePerDay) return 0;
  const days = Math.ceil(
    (new Date(this.end_date) - new Date(this.start_date)) / (1000 * 60 * 60 * 24)
  );
  return days * (this.car_id.pricePerDay || 0);
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
