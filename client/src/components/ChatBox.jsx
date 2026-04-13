import React, { useEffect, useState,useRef } from "react";
import { useAppContext } from "../context/AppContext";
import Message from "./Message";
import { assets } from "../assets/assets";

function ChatBox() {
  const { selectedChat, theme } = useAppContext();
  const containerRef=useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior:"smooth",
      })
    }
  },[messages])
  return (
    <div className="flex-1 flex flex-col justify-between px-4 md:px-10 py-6 max-md:mt-14 2xl:pr-40">
      
      {/* Messages Area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-6 pr-2 scroll-smooth">
        
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

        {/* Loading dots */}
        {loading && (
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-white animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-white animate-bounce delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-white animate-bounce delay-300"></div>
          </div>
        )}
      </div>

        
      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="mt-4 flex items-center gap-4 border rounded-xl px-3 py-2 shadow-sm bg-white dark:bg-[#1f1f1f] border-gray-200 dark:border-[#2a2a2a]"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm px-2 py-1 rounded-md bg-transparent outline-none border border-gray-200 dark:border-[#2a2a2a]"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>

        {/* Input */}
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={promt}
          type="text"
          placeholder="Ask anything..."
          className="flex-1 text-sm outline-none bg-transparent px-2"
          required
        />

        {/* Button */}
        <button
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
        >
          <img
            src={loading ? assets.stop_icon : assets.search_icon}
            alt=""
            className="w-6 h-6"
          />
        </button>
      </form>
    </div>
  );
}

export default ChatBox;