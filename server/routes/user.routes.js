import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUser);

export default userRouter;
