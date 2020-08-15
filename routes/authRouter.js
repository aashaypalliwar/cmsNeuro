const express = require("express");
const {
  protect,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controller/authController");

const router = express.Router();

//LOGIN
router.post("/login", login);

//  FORGOT PASSWORD
router.post("/forgotPassword", forgotPassword);

// RESET PASSWORD
router.patch("/resetPassword", resetPassword);

//UPDATE PASSWORD
router.patch("/updatePassword", protect, updatePassword);

module.exports = router;
