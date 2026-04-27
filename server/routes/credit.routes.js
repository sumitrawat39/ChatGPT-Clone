import express from "express";
import { getPlans, purchasePlans } from "../controllers/credit.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";

const creditRouter = express.Router();

creditRouter.get("/plan", getPlans);
creditRouter.post("/purchase", protect, purchasePlans);

export default creditRouter;
