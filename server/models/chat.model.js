import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 
    userName: { type: String, required: true }, 
    name: { type: String, required: true },
    messages: [
      {
        isImage: { type: Boolean, required: true },
        isPublished: { type: Boolean, default: false },
        role: { type: String, default: "user" },
        content: { type: String, default: "" },
        timestamp: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
