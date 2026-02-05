import Booking from "../models/booking.model.js";

export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền xem booking của người khác."
      });
    }

    const bookings = await Booking.find({ user_id: userId })
      .populate("car_id");

    res.render("user/bookings", {
      bookings
    });
  } catch (err) {
    console.error("Error in getUserBookings:", err);
    next(err);
  }
};

export const getMyCarBookings = async (req, res, next) => {
  try {
    const ownerId = req.user.id; 

    const bookings = await Booking.find()
      .populate({
        path: "car_id",
        match: { owner_id: ownerId }
      })
      .populate("user_id");

    const ownerBookings = bookings.filter(b => b.car_id);

    res.render("user/bookings", {
      bookings: ownerBookings
    });
  } catch (err) {
    console.error("Error in getMyCarBookings:", err);
    next(err);
  }
};

export const getBookingSummary = async (req, res, next) => {
  try {
    const total = await Booking.countDocuments();

    const aggResult = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const byStatus = {};
    aggResult.forEach(item => {
      byStatus[item._id] = item.count;
    });

    res.render("user/summary", {
      total,
      byStatus
    });
  } catch (err) {
    console.error("Error in getBookingSummary:", err);
    next(err);
  }
};
