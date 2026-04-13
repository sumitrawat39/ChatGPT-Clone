import React from "react";
import { assets } from "../assets/assets";
import moment from "moment";

function Message({ message }) {
const isUser = message.role === "user";

return (
<div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>


  <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
    
    {/* Avatar */}
    <img
      src={isUser ? assets.user_icon : assets.logo_icon}
      className="w-8 h-8 rounded-full object-cover"
      alt=""
    />

    {/* Message Bubble */}
    <div>
      <div
        className={`px-4 py-2 rounded-2xl text-sm ${
          isUser
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-gray-100 dark:bg-[#2a2a2a] text-black dark:text-white"
        }`}
      >
        {message.isImage ? (
          <img
            src={message.content}
            className="w-full max-w-xs rounded-lg"
            alt=""
          />
        ) : (
          message.content
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
