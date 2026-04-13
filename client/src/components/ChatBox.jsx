import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Message from "./Message";

function ChatBox() {
const { selectedChat, theme } = useAppContext();

const [messages, setMessages] = useState([]);

useEffect(() => {
if (selectedChat) {
setMessages(selectedChat.messages);
}
}, [selectedChat]);

return ( <div className="flex-1 flex flex-col justify-between px-4 md:px-10 py-6 max-md:mt-14 2xl:pr-40">


  {/* Messages Area */}
  <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#2a2a2a]">
    
    {messages.length === 0 && (
      <div className="h-full flex flex-col items-center justify-center text-center">
        
        <h3 className="mt-4 text-3xl sm:text-5xl font-semibold text-gray-400 dark:text-gray-200">
          Where should we begin?
        </h3>
      </div>
    )}

    {messages.map((message, index) => (
      <Message key={index} message={message} />
    ))}
  </div>

  {/* Input Box (ChatGPT style placeholder) */}
  <div className="mt-4 border rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm bg-white dark:bg-[#1f1f1f] border-gray-200 dark:border-[#2a2a2a]">
    <input
      type="text"
      placeholder="Ask anything"
      className="flex-1 bg-transparent outline-none text-sm"
    />
    <button className="bg-black text-white dark:bg-white dark:text-black px-4 py-1.5 rounded-lg text-sm hover:opacity-80 transition">
      Send
    </button>
  </div>
</div>


);
}

export default ChatBox;
