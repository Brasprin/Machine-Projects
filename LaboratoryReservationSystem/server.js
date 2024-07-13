const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { engine } = require("express-handlebars");
const path = require("path");
const routesRes = require("./models/routes/reserveSlotServer");
const routesLog = require("./models/routes/loginServer");
const routesEdit = require("./models/routes/editReservationServer");
const routesProfile = require("./models/routes/profileServer");

const app = express();

// Configure Handlebars
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Configure cookie parser
app.use(cookieParser());

// MongoDB Connection
mongoose.connect("mongodb://localhost/CCAPDEV", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use("/api", routesRes);
app.use("/api", routesLog);
app.use("/api", routesEdit);
app.use("/api", routesProfile);

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Define routes
app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Information",
    logo: "Contact Information",
    isAuthenticated: false,
    layout: "main",
    style: "contact.css",
    javascript: "",
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    logo: "User Login",
    isAuthenticated: false,
    layout: "main",
    style: "loginstyle.css",
    javascript: "loginscript.js",
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("sessionId");
    res.redirect("/login");
  });
});

app.get("/reserveSlot", isAuthenticated, (req, res) => {
  const userData = req.session.user;
  res.render("reserveSlot", {
    title: "Reserve Slot",
    logo: "Reserve Slot",
    isAuthenticated: true,
    layout: "main",
    style: "reserveSlot.css",
    javascript: "reserveSlot.js",
    labs: ["G301", "G302", "G303A", "G303B"],
    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    userData,
  });
});

app.get("/profile", isAuthenticated, (req, res) => {
  const userData = req.session.user;
  res.render("profile", {
    title: "Profile",
    logo: "Profile",
    isAuthenticated: true,
    layout: "main",
    style: "profile.css",
    javascript: "profile.js",
    userData,
  });
});

app.get("/editReservation", isAuthenticated, (req, res) => {
  res.render("editReservation", {
    title: "Edit Reservation",
    logo: "Edit Reservation",
    isAuthenticated: true,
    layout: "main",
    style: "editReservation.css",
    javascript: "editReservation.js",
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
