import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

function Sidebar() {
  const { chats, setSelectedChat, theme, setTheme, user } = useAppContext();
  const [search, setSearch] = useState("");
  return (
    <div className="flex flex-col h-screen min-w-72 p-5 dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30 border-r border[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1 ">
      <img src={assets.logo} alt="" className="w-full max-w-20" />

      <button>
        <span className="mr-2 text-xl">+</span> New Chat
      </button>

     <div>
        <img src={assets.search_icon} className="w-4 not-dark:invert" alt="" /></div> 
        <input onChange={(e)=>setSearch(e.target.value)} value={search} type="text" placeholder="Search Conversation" />
    </div>
  );
}

export default Sidebar;
