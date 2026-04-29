import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Loading() {
  const navigate = useNavigate();
  const { fetchUser } = useAppContext();
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUser();
      navigate("/");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="bg-linear-to-b from-gray-900 to-black flex items-center justify-center h-screen w-screen text-white">
      <div className="w-10 h-10 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
    </div>
  );
}

export default Loading;
