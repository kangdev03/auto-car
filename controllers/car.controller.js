import Car from "../models/car.model.js";

export const getCars = async (req, res, next) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.render("car/index", { cars });
  } catch (err) {
    console.error("Error in getCars:", err);
    next(err);
  }
};

export const searchCars = async (req, res, next) => {
  try {
    const { keyword, name, status, minPrice, maxPrice } = req.query;
    const filter = {};

    const searchTerm = keyword || name;
    if (searchTerm) filter.name = { $regex: searchTerm, $options: "i" };
    if (status) filter.status = status;

    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    const cars = await Car.find(filter);
    res.render("car/index", { cars });
  } catch (err) {
    console.error("Error in searchCars:", err);
    next(err);
  }
};
