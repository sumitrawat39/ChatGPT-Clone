import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

function Sidebar({ isMenuOpen, setIsMenuOpen }) {
const { user, chats, setSelectedChat, theme, setTheme } = useAppContext();
const [search, setSearch] = useState("");
const navigate = useNavigate();
const isDark = theme === "dark";

return (
<div
className={`${!isMenuOpen && "max-md:-translate-x-full"} flex flex-col h-screen min-w-72 p-5 border-r transition-all duration-300 shadow-sm ${
        isDark
          ? "bg-[#171717] border-[#2a2a2a] text-white"
          : "bg-white border-gray-200 text-black"
      }`}
>
<img src="/logo.png" alt="logo" className="w-10 mx-auto rounded-xl" />

  {/* New Chat */}
  <button
    onClick={() => setSelectedChat(null)}
    className={`mt-5 p-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition ${
      isDark
        ? "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
        : "bg-gray-100 hover:bg-gray-200"
    }`}
  >
    <span className="text-lg">➕</span>
    <span>New Chat</span>
  </button>

  {/* Search */}
  <div
    className={`flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border ${
      isDark
        ? "border-[#2a2a2a] bg-[#1f1f1f]"
        : "border-gray-200 bg-gray-50"
    }`}
  >
    <span className="text-sm">🔍</span>
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      type="text"
      placeholder="Search Conversation"
      className={`flex-1 outline-none bg-transparent text-sm ${
        isDark ? "placeholder-gray-400" : "placeholder-gray-500"
      }`}
    />
  </div>

  {/* Recent Chats */}
  {chats?.length > 0 && (
    <p className="mt-4 text-xs opacity-70">Recent Chats</p>
  )}

  {/* Chat List */}
  <div className="mt-2 flex-1 overflow-y-auto">
    {(chats || [])
      .filter((chat) =>
        chat.message?.[0]
          ? chat.message[0]?.content
              ?.toLowerCase()
              .includes(search.toLowerCase())
          : chat.name?.toLowerCase().includes(search.toLowerCase())
      )
      .map((chat) => (
        <div
          key={chat._id}
          onClick={() => {
            navigate("/");
            setSelectedChat(chat);
            setIsMenuOpen(false);
          }}
          className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition ${
            isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"
          }`}
        >
          <div className="flex-1">
            <p className="text-sm font-medium truncate">
              {chat.message?.length > 0
                ? chat.message[0]?.content?.slice(0, 32)
                : chat.name}
            </p>

            <p className="text-xs opacity-60 mt-1">
              {chat.updatedAt ? moment(chat.updatedAt).fromNow() : ""}
            </p>
          </div>

          {/* Delete Icon */}
          <span
            className={`text-sm transition ${
              isDark ? "text-gray-400" : "text-gray-500"
            } hover:text-red-500`}
          >
            🗑️
          </span>
        </div>
      ))}
  </div>

  {/* Community */}
  <div
    onClick={() => {
      navigate("/community");
      setIsMenuOpen(false);
    }}
    className={`mt-3 flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition ${
      isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"
    }`}
  >
    <span>🖼️</span>
    <p className="text-sm">Community Images</p>
  </div>

  {/* Credits */}
  <div
    onClick={() => {
      navigate("/credits");
      setIsMenuOpen(false);
    }}
    className={`mt-3 flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition ${
      isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"
    }`}
  >
    <span>💎</span>
    <div className="flex flex-col">
      <p className="text-sm">Credits: {user?.credits}</p>
      <p className="text-xs text-gray-400">
        Purchase credits to use GPT
      </p>
    </div>
  </div>

  {/* Theme Toggle */}
  <button
    onClick={() => {
      const newTheme = isDark ? "light" : "dark";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      setIsMenuOpen(false);
    }}
    className={`mt-3 p-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition ${
      isDark
        ? "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
        : "bg-gray-200 hover:bg-gray-300"
    }`}
  >
    <span>{isDark ? "🌞" : "🌙"}</span>
    <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
  </button>

  {/* User */}
<div
  className={`mt-4 flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition ${
    isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"
  }`}
>
  {/* Left: User Info */}
  <div className="flex items-center gap-3">
    <img
      className="w-8 h-8 rounded-full object-cover"
      src={assets.user_icon}
      alt=""
    />

    <p className="text-sm">
      {user ? user.name : "Login Your Account"}
    </p>
  </div>

  {/* Right: Logout Icon */}
  {user && (
    <img 
      src={assets.logout_icon}
      alt="logout"
      onClick={() => {
        
        console.log("Logout clicked");
      }}
      className={`w-11 h-11 rounded-2xl cursor-pointer transition ${
        isDark ? "invert opacity-70" : "opacity-70"
      } hover:opacity-100`}
    />
  )}
</div>

  {/* Close button */}
  <img
    onClick={() => setIsMenuOpen(false)}
    src={assets.close_icon}
    className="absolute top-4 right-4 w-5 h-5 cursor-pointer md:hidden opacity-70 hover:opacity-100"
    alt=""
  />
</div>


);
}

export default Sidebar;
