const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");

router.post("/", protect, async (req, res) => {
  try {
    console.log("Booking request received:", req.body);
    console.log("User:", req.user);

    const {
      flightDetails,
      passengers,
      PNR,
      totalAmount,
      travelDate,
      paymentStatus,
    } = req.body;

    const booking = await Booking.create({
      userId: req.user.id,
      flightDetails,
      passengers,
      PNR,
      totalAmount,
      travelDate,
      paymentStatus,
    });

    console.log("Booking created:", booking);
    res.status(201).json({ booking });
  } catch (err) {
    console.log("Booking error full:", err);
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
