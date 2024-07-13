const express = require("express");
const bcrypt = require("bcryptjs");
const { userProfileModel } = require("../laboratorySchema");

const router = express.Router();

// POST /api/register
router.post("/register", async (req, res) => {
  const { username, email, password, userType } = req.body;
  const VALID_USER_TYPES = ["student", "faculty"];

  if (!username || !email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if userType is valid
  if (!VALID_USER_TYPES.includes(userType)) {
    return res.status(400).json({ error: "Invalid user type" });
  }

  try {
    // Checks if username or email is already in use
    const existingUser = await userProfileModel.findOne({
      $or: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user profile
    const newUser = new userProfileModel({
      username,
      email,
      password: hashedPassword,
      userType,
      description: "No Description.",
    });

    await newUser.save();
    res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await userProfileModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    req.session.user = {
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      userType: user.userType,
      description: user.description,
    };

    res.cookie("sessionId", req.sessionID, { httpOnly: true });

    res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sessionId");
    res.redirect("/login");
  });
});

module.exports = router;
