import express from "express";
import {
  createChat,
  deleteChats,
  getChats,
} from "../controllers/chat.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const chatRouter = express.Router();

chatRouter.get("/create", protect, createChat);
chatRouter.get("/get", protect, getChats);
chatRouter.post("/delete", protect, deleteChats);

export default chatRouter;
