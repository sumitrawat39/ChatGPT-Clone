import express from "express";
import "dotenv/config";
import cors from "cors";
import { connect } from "mongoose";
import connectDB from "./config/db.js";

const app = express();

await connectDB();
//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server is Live"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`);
});
