const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Private routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Admin routes
router.get("/", protect, admin, getUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;