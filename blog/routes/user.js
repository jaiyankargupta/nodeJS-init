const express = require("express");
const User = require("../models/user.js");

const router = express.Router();

router.get("/signin", (_, res) => {
  return res.render("signin");
});
router.get("/signup", (_, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchedPasswordAndGenerateToken(email, password);
    console.log(token);
    if (token) return res.cookie("token", token).redirect("/");
  } catch (err) {
    console.log(err);
    return res.render("signin", { error: "Invalid email or password" });
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    await User.create({ fullName, email, password });

    return res.redirect("/user/signin");
  } catch (err) {
    return res.render("signup", { error: "Signup failed. Please try again." });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
