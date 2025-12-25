import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  clearChat,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar); // for getting list of users for sidebar
router.get("/:id", protectRoute, getMessages); // for getting messages with a particular user , :id is id of the other user
router.post("/send/:id", protectRoute, sendMessage); // to send message to a particular user , :id is id of receiver
router.delete("/clear/:id", protectRoute, clearChat);

export default router;
