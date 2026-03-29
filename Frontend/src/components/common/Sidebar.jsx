import React from "react";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`
        bg-[#121212] text-white flex flex-col rounded-lg
        fixed md:static top-0 left-0 h-screen md:h-auto z-8
        transition-transform duration-300
        
        w-[80%] sm:w-[60%] md:w-[26%] lg:w-[20%]

        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="px-4 py-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300">
          Your Library
        </h2>

        <button className="bg-[#1f1f1f] h-8 w-8 cursor-pointer rounded-full hover:bg-[#2a2a2a] transition">
          +
        </button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-3">

        <div className="bg-[#1f1f1f] p-4 rounded-lg space-y-3 hover:bg-[#2a2a2a] transition">
          <h3 className="text-sm font-semibold">
            Create your first playlist
          </h3>
          <p className="text-xs text-gray-400">
            It's easy, we'll help you
          </p>
          <button className="cursor-pointer bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:scale-105 transition">
            Create playlist
          </button>
        </div>

        <div className="bg-[#1f1f1f] p-4 rounded-lg space-y-3 hover:bg-[#2a2a2a] transition">
          <h3 className="text-sm font-semibold">
            Let's find some podcasts to follow
          </h3>
          <p className="text-xs text-gray-400">
            We'll keep you updated on new episodes
          </p>
          <button className="cursor-pointer bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:scale-105 transition">
            Browse podcasts
          </button>
        </div>

      </div>

      <div className="px-4 py-4 text-[11px] text-gray-400 space-y-3">
        
        <div className="flex flex-wrap gap-3">
          <span className="hover:underline cursor-pointer">Legal</span>
          <span className="hover:underline cursor-pointer">Safety & Privacy</span>
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Cookies</span>
          <span className="hover:underline cursor-pointer">Accessibility</span>
        </div>

        <button className="border border-gray-500 px-3 flex items-center gap-2 cursor-pointer py-1 rounded-full text-white text-xs hover:border-white transition">
          <span className="ri-global-line text-lg"></span> English
        </button>
      </div>
    </div>
  );
};

export default Sidebar;