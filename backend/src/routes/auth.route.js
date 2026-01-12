import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
  deleteUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/delete-account", protectRoute, deleteUser);

router.put("/update-profile", protectRoute, updateProfile); // this route is for updating user profile for only authenticated users

router.get("/check", protectRoute, checkAuth);

export default router;
