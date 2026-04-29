import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";

function Message({ message }) {
  const isUser = message.role === "user";

  // 🔥 Safe content handling
  let safeContent = "";

  if (typeof message.content === "string") {
    safeContent = message.content;
  } else if (typeof message.content === "object") {
    // fallback if API returns object
    safeContent = JSON.stringify(message.content);
  } else {
    safeContent = "";
  }

  // 🔥 Debug (remove later)
  console.log("Message content:", message.content, typeof message.content);

  useEffect(() => {
    Prism.highlightAll();
  }, [safeContent]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-start gap-3 max-w-[85%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <img
          src={isUser ? assets.user_icon : assets.logo_icon}
          className="w-8 h-8 rounded-full object-cover"
          alt=""
        />

        {/* Message Bubble */}
        <div>
          <div
            className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
              isUser
                ? "bg-[#303030] text-white dark:bg-[#404040]"
                : "bg-gray-100 text-black dark:bg-[#2a2a2a] dark:text-white"
            }`}
          >
            {message.isImage ? (
              <img
                src={message.content}
                className="w-full max-w-xs rounded-lg"
                alt="chat"
              />
            ) : (
              <div className="reset-tw break-words">
                <Markdown>{safeContent}</Markdown>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <span className="text-xs text-gray-400 mt-1 block">
            {moment(message.timestamp).fromNow()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Message;