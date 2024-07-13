const mongoose = require("mongoose");
const { Schema } = mongoose;

const userProfile = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  userType: { type: String, required: true },
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "SeatStatus",
    },
  ],
});

const dateSchema = new Schema({
  date: { type: Date, required: true, unique: true },
  laboratories: [
    {
      type: Schema.Types.ObjectId,
      ref: "LaboratoryNumber",
    },
  ],
});

const laboratoryNumberSchema = new Schema({
  laboratoryNumber: { type: String, required: true },
  date: {
    type: Schema.Types.ObjectId,
    ref: "Date",
    required: true,
  },
  timeSlots: [
    {
      type: Schema.Types.ObjectId,
      ref: "TimeSlot",
    },
  ],
});

const timeSlotSchema = new Schema({
  timeSlot: { type: String, required: true },
  laboratory: {
    type: Schema.Types.ObjectId,
    ref: "LaboratoryNumber",
    required: true,
  },
  seatStatuses: [
    {
      type: Schema.Types.ObjectId,
      ref: "SeatStatus",
    },
  ],
  timeSlotStatus: { type: String, required: false }, // Add this line
});

const seatStatusSchema = new Schema({
  seatNumber: { type: String, required: true },
  status: { type: String, required: true },
  timeSlot: { type: Schema.Types.ObjectId, ref: "TimeSlot", required: true },
  userProfile: { type: Schema.Types.ObjectId, ref: "userProfile" },
  info: {
    bookerName: String,
    bookerEmail: String,
    bookingDate: String,
    requestTime: String,
  },
});

// Models
const userProfileModel = mongoose.model("userProfile", userProfile);
const DateModel = mongoose.model("Date", dateSchema);
const LaboratoryNumber = mongoose.model(
  "LaboratoryNumber",
  laboratoryNumberSchema
);
const TimeSlot = mongoose.model("TimeSlot", timeSlotSchema);
const SeatStatus = mongoose.model("SeatStatus", seatStatusSchema);

module.exports = {
  DateModel,
  LaboratoryNumber,
  TimeSlot,
  SeatStatus,
  userProfileModel,
};
