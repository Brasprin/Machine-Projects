const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  DateModel,
  LaboratoryNumber,
  TimeSlot,
  SeatStatus,
  userProfileModel,
} = require("./laboratorySchema"); // Adjust the path as needed

mongoose.connect("mongodb://localhost/CCAPDEV");

const db = mongoose.connection;

db.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    // Clear existing data
    await userProfileModel.deleteMany({});
    await DateModel.deleteMany({});
    await LaboratoryNumber.deleteMany({});
    await TimeSlot.deleteMany({});
    await SeatStatus.deleteMany({});

    const userAdmin = await userProfileModel.create({
      username: "admin",
      email: "admin@dlsu.edu.ph",
      password: await bcrypt.hash("admin", 10),
      userType: "faculty",
      description: "No Description.",
    });

    const labNumbers = ["G301", "G302", "G303A", "G303B"];
    const timeSlots = [
      "07:30 - 09:00",
      "09:15 - 10:45",
      "11:00 - 12:30",
      "12:45 - 14:15",
      "14:30 - 16:00",
      "16:15 - 17:45",
      "18:00 - 19:30",
      "19:45 - 21:15",
    ];
    const seatNumbers = [
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
      "A9",
      "A10",
    ];

    const daysIn2024 = 366; // 2024 is a leap year
    const startDate = new Date("2024-01-01");

    for (let i = 0; i < daysIn2024; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);

      const isSunday = currentDate.getDay() === 0;

      const dateDoc = await DateModel.create({ date: currentDate });

      for (let labNumber of labNumbers) {
        const labDoc = await LaboratoryNumber.create({
          laboratoryNumber: labNumber,
          date: dateDoc._id,
        });

        // Add lab to date
        dateDoc.laboratories.push(labDoc._id);

        for (let timeSlot of timeSlots) {
          const timeSlotDoc = await TimeSlot.create({
            timeSlot: timeSlot,
            laboratory: labDoc._id,
            timeSlotStatus: isSunday ? "Unavailable" : "",
          });

          // Add time slot to lab
          labDoc.timeSlots.push(timeSlotDoc._id);

          for (let seatNumber of seatNumbers) {
            const seatStatusDoc = await SeatStatus.create({
              seatNumber: seatNumber,
              status: isSunday ? "Unavailable" : "Available",
              timeSlot: timeSlotDoc._id,
              info: null,
            });

            // Add seat status to time slot
            timeSlotDoc.seatStatuses.push(seatStatusDoc._id);
          }

          await timeSlotDoc.save();
        }

        await labDoc.save();
      }

      await dateDoc.save();
      console.log(
        `Populated data for ${currentDate.toISOString().split("T")[0]}`
      );
    }

    // Print the total number of documents inserted for each schema
    const dateCount = await DateModel.countDocuments();
    const laboratoryCount = await LaboratoryNumber.countDocuments();
    const timeSlotCount = await TimeSlot.countDocuments();
    const seatStatusCount = await SeatStatus.countDocuments();

    console.log(`Inserted user profile: ${userAdmin}`);
    console.log(`Total dates inserted: ${dateCount}`);
    console.log(`Total laboratory numbers inserted: ${laboratoryCount}`);
    console.log(`Total time slots inserted: ${timeSlotCount}`);
    console.log(`Total seat statuses inserted: ${seatStatusCount}`);
  } catch (err) {
    console.error("Error inserting data:", err);
  } finally {
    mongoose.disconnect();
  }
});
