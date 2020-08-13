const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

const router = express.Router();

router.post("/auth/login", authController.login); //LOGIN

router.post("/auth/forgotPassword", authController.forgotPassword); //  FORGOT PASSWORD

router.patch(
  //BLACKLIST/WHITELIST
  "/:id/blacklist",
  authController.protect,
  authController.restrictTo("superAdmin"),
  userController.blacklist
);

router.patch(
  //CHANGE DESIGNATION
  "/:id/changeDesignation",
  authController.protect,
  authController.restrictTo("superAdmin"),
  userController.changeDesignation
);

router.patch(
  //CHANGE ROLE
  "/:id/changeRole",
  authController.protect,
  authController.restrictTo("superAdmin"),
  userController.changeRole
);

router.post(
  //ADD USER WITH ROLE AND DESIGNATION
  "/newUser",
  authController.protect,
  authController.restrictTo("superAdmin"),
  userController.addUser
);

router.delete(
  //REMOVE USER
  "/:id",
  authController.protect,
  authController.restrictTo("superAdmin"),
  userController.deleteUser
);

router.patch("/me", authController.protect, userController.addBio); //ADD/CHANGE BIO

module.exports = router;
