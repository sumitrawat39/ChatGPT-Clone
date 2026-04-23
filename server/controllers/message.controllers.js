import axios from "axios";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import OpenAI from "openai";
import imagekit from "../config/imagekit.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
     if (!req.user || req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits",
      });
    }
    const { chatId, prompt } = req.body;

    if (!prompt || !chatId) {
      return res.json({
        success: false,
        message: "Prompt and chatId are required",
      });
    }

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    return res.json({ success: true, reply });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.user || req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const encodedPrompt = encodeURIComponent(prompt);

    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/gpt/${Date.now()}.png?tr=w-800,h-800`;

    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary",
    ).toString("base64")}`;

    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "gpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    return res.json({ success: true, reply });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
