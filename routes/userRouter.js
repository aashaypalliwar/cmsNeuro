const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

const router = express.Router();

// GET LEADERBOARD
router.get("/currentleaderboard", userController.getLeaderBoard);

//ADD USER(S) WITH ROLE AND DESIGNATION
router.post(
  "/newUser",
  authController.protect,
  authController.restrictTo("superAdmin"),
  authController.bulkSignup
);

//GET OWN PROFILE
router.get("/profile", authController.protect, userController.getOwnProfile);

//GET ONE USER
router.get("/:id", authController.protect, userController.getOneUser);

//GET ALL USERS
router.get("/allUsers", authController.protect, userController.getAllUsers);

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

//CHANGE BIO
router.patch("/me", authController.protect, userController.addBio);

module.exports = router;
