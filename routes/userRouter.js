const express = require("express");
const {
  getOwnProfile,
  getOneUser,
  getAllUsers,
  blacklist,
  changeDesignation,
  changeRole,
  deleteUser,
  awardPoints,
  addBio
} = require("../controller/userController");
const { protect, restrictTo } = require("../controller/authController");

const router = express.Router();

//ADD USER(S) WITH ROLE AND DESIGNATION
// router.post(
//   "/newUser",
//    protect,
//    restrictTo("superAdmin"),
//    bulkSignup
// );
router.get("/allUsers", protect, getAllUsers);

//GET OWN PROFILE
router.get("/profile", protect, getOwnProfile);

//GET ONE USER
router.get("/:id", protect, getOneUser);

//GET ALL USERS

//BLACKLIST/WHITELIST
router.patch("/:id/blacklist", protect, restrictTo("superAdmin"), blacklist);

//CHANGE DESIGNATION
router.patch(
  "/:id/changeDesignation",
  protect,
  restrictTo("superAdmin"),
  changeDesignation
);

//CHANGE ROLE
router.patch("/:id/changeRole", protect, restrictTo("superAdmin"), changeRole);

//REMOVE USER
router.delete("/:id", protect, restrictTo("superAdmin"), deleteUser);

router.patch(
  "/:id/awardPoints",
  protect,
  restrictTo("superAdmin", "admin"),
  awardPoints
);

//CHANGE BIO
router.patch("/me", protect, addBio);

module.exports = router;
