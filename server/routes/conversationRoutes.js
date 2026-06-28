import express from "express";

import {
  createConversation,
  getMyConversations,
} from "../controllers/conversationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createConversation);

router.get("/", protect, getMyConversations);

export default router;