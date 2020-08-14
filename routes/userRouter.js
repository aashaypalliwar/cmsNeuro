const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

const router = express.Router();

//LOGIN
router.post("/auth/login", authController.login);

//  FORGOT PASSWORD
router.post("/auth/forgotPassword", authController.forgotPassword);

// RESET PASSWORD
router.patch("/auth/resetPassword", authController.resetPassword);

//UPDATE PASSWORD
router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

router.get("/currentleaderboard", userController.getLeaderBoard);

//ADD USER(S) WITH ROLE AND DESIGNATION
router.post(
  "/newUser",
  authController.protect,
  authController.restrictTo("superAdmin"),
  authController.bulkSignup
);

//GET OWN PROFILE
router.get("/me", authController.protect, userController.getMe);

//GET ONE USER
router.get(
  "/:id",
  authController.protect,
  authController.restrictTo("superAdmin", "admin"),
  userController.getOne
);

//BLACKLIST/WHITELIST
router.patch(
  "/:id/blacklist",
  authController.protect,
  authController.restrictTo("superAdmin"),
  userController.blacklist
);

//CHANGE DESIGNATION
router.patch(
  "/:id/changeDesignation",
  authController.protect,
  authController.restrictTo("superAdmin"),
  userController.changeDesignation
);

//CHANGE ROLE
router.patch(
  "/:id/changeRole",
  authController.protect,
  authController.restrictTo("superAdmin"),
  userController.changeRole
);

//REMOVE USER
router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("superAdmin"),
  userController.deleteUser
);

router.patch(
  "/:id/awardPoints",
  authController.protect,
  authController.restrictTo("superAdmin", "admin"),
  userController.awardPoints
);

//ADD/CHANGE BIO
router.patch("/me", authController.protect, userController.addBio);

module.exports = router;
