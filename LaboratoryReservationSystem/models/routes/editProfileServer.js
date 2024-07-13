const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();

const { userProfileModel } = require("../laboratorySchema");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost/CCAPDEV");

// POST /api/publicProfile
router.get("/publicProfile", async (req, res) => {
  try {
    const allProfiles = await userProfileModel.find();
    res.status(200).json(allProfiles);
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    res.status(500).json({ error: "Failed to fetch user profiles" });
  }
});

router.get("/Profile", async (req, res) => {
  const email = req.session.user.email;

  try {
    const userProfile = await userProfileModel.findOne({ email });
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
});

module.exports = router;
