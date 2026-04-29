import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import Message from "./Message";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const MessageActions = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = message.content; // image URL
    link.download = `image-${Date.now()}.png`;
    link.click();
  };

  const handleView = () => {
    window.open(message.content, "_blank");
  };

  if (message.role !== "assistant") return null;

  return (
    <div className="flex items-center gap-1.5 mt-1.5 ml-1">
      {message.isImage ? (
        <>
          {/* View button for images */}
          <button
            onClick={handleView}
            title="View image"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
              px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View
          </button>

          {/* Download button for images */}
          <button
            onClick={handleDownload}
            title="Download image"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
              px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>
        </>
      ) : (
        // Copy button for text
        <button
          onClick={handleCopy}
          title="Copy response"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
            px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
        >
          {copied ? (
            <>
              <svg
                className="w-3.5 h-3.5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      )}
    </div>
  );
};

function ChatBox() {
  const { selectedChat, user, axios, token, setUser } = useAppContext();
  const containerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (!user) return toast("Login to send message");
    if (!selectedChat?._id)
      return toast.error("Please select or create a chat first");
    const promptCopy = prompt;
    if (!selectedChat?.message || selectedChat.message.length === 0) {
      selectedChat.name = promptCopy;
    }
    try {
      setLoading(true);

      setPrompt("");

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: promptCopy,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);

      const { data } = await axios.post(
        `/api/message/${mode}`,
        {
          chatId: selectedChat._id,
          prompt: promptCopy,
          isPublished,
          isFirstMessage: messages.length === 0,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);
        setUser((prev) => ({
          ...prev,
          credits: prev.credits - (mode === "image" ? 2 : 1),
        }));
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) setMessages(selectedChat.messages || []);
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify-between px-4 md:px-10 py-6 max-md:mt-14 2xl:pr-40">
      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-6 pr-2 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center">
            <h3 className="text-3xl sm:text-5xl font-semibold text-gray-400 dark:text-gray-200">
              Where should we begin?
            </h3>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index}>
            <Message message={message} />
            {/* ✅ Action buttons below each assistant message */}
            <MessageActions message={message} />
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <img
              src={assets.logo_icon}
              className="w-8 h-8 rounded-full"
              alt=""
            />
            <div className="px-4 py-2 rounded-2xl bg-gray-100 dark:bg-[#2a2a2a]">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="mt-4 flex items-center gap-4 border rounded-4xl px-3 py-2 shadow-sm bg-white dark:bg-[#1f1f1f]"
      >
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="text-sm px-1 py-1 rounded-3xl bg-transparent border"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          placeholder="Ask anything..."
          disabled={loading}
          className={`flex-1 text-sm outline-none bg-transparent px-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          required
        />

        <button
          disabled={loading}
          className={`p-1.5 rounded-lg transition ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
          }`}
        >
          <img
            src={loading ? assets.stop_icon : assets.search_icon}
            className="w-6 h-6"
            alt=""
          />
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
