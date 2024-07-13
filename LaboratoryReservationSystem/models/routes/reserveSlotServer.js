const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();

const {
  DateModel,
  LaboratoryNumber,
  TimeSlot,
  SeatStatus,
  userProfileModel,
} = require("../laboratorySchema");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost/CCAPDEV");

// GET /api/available-dates
router.get("/available-dates", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected");
    }

    const { year, month } = req.query;

    const yearNum = parseInt(year);
    const monthNum = parseInt(month) - 1;

    const startDate = new Date(yearNum, monthNum, 1);
    const endDate = new Date(yearNum, monthNum + 1, 0);

    const dates = await DateModel.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).select("date");

    const availableDates = dates.map((date) => date.date.getDate());

    res.json({ availableDates });
  } catch (error) {
    console.error("Error fetching available dates:", error);
  }
});

router.get("/timeslots", async (req, res) => {
  try {
    const { labNumber, date } = req.query;

    // Parse the date and set it to noon UTC to avoid timezone issues
    const queryDate = new Date(date);
    queryDate.setUTCHours(12, 0, 0, 0);

    const dateDoc = await DateModel.findOne({
      date: {
        $gte: new Date(queryDate.getTime()),
        $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!dateDoc) {
      return res.status(404).json({ error: "Date not found" });
    }

    // Find the laboratory for the given lab number and date
    const laboratory = await LaboratoryNumber.findOne({
      laboratoryNumber: labNumber,
      date: dateDoc._id,
    }).populate({
      path: "timeSlots",
      populate: {
        path: "seatStatuses",
      },
    });

    if (!laboratory) {
      return res
        .status(404)
        .json({ error: "Laboratory not found for the given date" });
    }

    const formattedTimeslots = laboratory.timeSlots.map((slot) => ({
      timeSlot: slot.timeSlot,
      slotsLeft: calculateAvailableSlots(slot.seatStatuses),
      timeSlotStatus: slot.timeSlotStatus,
    }));

    res.json({ timeslots: formattedTimeslots });
  } catch (error) {
    console.error("Error fetching timeslots:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Helper function to calculate available slots
function calculateAvailableSlots(seatStatuses) {
  return seatStatuses.filter((status) => status.status === "Available").length;
}

router.get("/seat-statuses", async (req, res) => {
  try {
    const { labNumber, timeslot, date } = req.query;

    const queryDate = new Date(date);
    queryDate.setUTCHours(12, 0, 0, 0);

    const dateDoc = await DateModel.findOne({
      date: {
        $gte: new Date(queryDate.getTime()),
        $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    const laboratory = await LaboratoryNumber.findOne({
      laboratoryNumber: labNumber,
      date: dateDoc._id,
    }).populate({
      path: "timeSlots",
      match: { timeSlot: timeslot },
      populate: {
        path: "seatStatuses",
      },
    });

    const seatStatuses = laboratory.timeSlots[0].seatStatuses;

    res.json({ seatStatuses });
  } catch (error) {
    console.error("Error fetching seat statuses:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.post("/confirm-booking", async (req, res) => {
  const { seatNumber, labNumber, bookingDate, requestTime } = req.query;

  // Accessing user information from session
  const bookerName = req.session.user.username;
  const bookerEmail = req.session.user.email;
  const timeslot = req.query.timeslot;

  try {
    const queryDate = new Date(bookingDate);
    queryDate.setUTCHours(12, 0, 0, 0);

    const dateDoc = await DateModel.findOne({
      date: {
        $gte: new Date(queryDate.getTime()),
        $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    const laboratory = await LaboratoryNumber.findOne({
      laboratoryNumber: labNumber,
      date: dateDoc._id,
    }).populate({
      path: "timeSlots",
      match: { timeSlot: timeslot },
      populate: {
        path: "seatStatuses",
        match: { seatNumber: seatNumber, status: "Available" },
      },
    });

    const timeSlot = laboratory.timeSlots.find(
      (slot) => slot.seatStatuses.length > 0
    );

    const seatStatus = timeSlot.seatStatuses.find(
      (status) => status.seatNumber === seatNumber
    );

    seatStatus.status = "Booked";
    seatStatus.info = { bookerName, bookerEmail, bookingDate, requestTime };
    const updatedSeatStatus = await seatStatus.save();

    await userProfileModel.updateOne(
      { email: bookerEmail },
      { $push: { bookings: seatStatus._id } }
    );

    res
      .status(200)
      .json({ message: "Booking confirmed", seatStatus: updatedSeatStatus });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res
      .status(500)
      .json({ message: "Internal server error", details: error.message });
  }
});

module.exports = router;
