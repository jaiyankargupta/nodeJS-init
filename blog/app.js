const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const cookieParser = require("cookie-parser");
const { checkAuthenticationCookie } = require("./middlewares/auth");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse incoming request bodies (important for POST requests)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie parser and authentication middleware
app.use(cookieParser());
app.use(checkAuthenticationCookie("token"));

// Serve static files
app.use(express.static(path.resolve("./public")));

// Make user available in all EJS templates as 'user'
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Set EJS as the view engine and specify the views directory
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

// Routers
app.use("/user", userRouter);
app.use("/blog", blogRouter);

// Connect to MongoDB and start server
mongoose
  .connect(`${process.env.MONGO_URL}`)
  .then(() => {
    console.log("db connected");
    app.listen(PORT, () => {
      console.log("listening...", PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
