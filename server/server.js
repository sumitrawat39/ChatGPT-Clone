import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();

await connectDB();
//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server is Live"));
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`);
});
