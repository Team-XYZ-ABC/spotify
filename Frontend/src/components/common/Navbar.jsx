import React, { useState } from "react";
import { Link } from "react-router";
import UserMenuCard from "../../pages/home/UserMenuCard";

const Navbar = ({ toggleSidebar }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("Search:", search);
    }
  };

  return (
    <div className="w-full h-16 flex items-center justify-between px-3 md:px-6 text-white gap-3">

      <div className="flex items-center shrink-0">
        <Link to="/">
          <img src="/img/spotify_logo_white.png" alt="logo" className="h-8 w-8" />
        </Link>
      </div>

      <div className="hidden md:flex items-center justify-center flex-1 min-w-0">
        <div className="flex items-center gap-3 bg-[#121212] px-3 py-2 rounded-full w-full max-w-130">

          <div className="shrink-0 bg-[#1f1f1f] h-10 cursor-pointer w-10 flex items-center justify-center rounded-full">
            <i className="ri-home-5-line text-xl"></i>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <i className="ri-search-line text-gray-400 text-lg shrink-0"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                console.log(e.target.value);
              }}
              onKeyDown={handleSearch}
              placeholder="What do you want to play?"
              className="bg-transparent outline-none w-full text-sm placeholder-gray-400 truncate"
            />
          </div>

          <div className="h-5 w-px bg-gray-600 shrink-0"></div>

          <div className="shrink-0">
            <i className="ri-stack-line text-xl cursor-pointer hover:text-white text-gray-300 transition-colors"></i>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">

        <div className="hidden lg:flex items-center gap-4">
          <button className="bg-white cursor-pointer text-black px-4 py-1.5 rounded-full text-sm font-semibold transition-transform hover:scale-[1.03]">
            Explore Premium
          </button>

          <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
            <i className="ri-download-line"></i>
            Install App
          </button>

          <i className="ri-notification-3-line text-xl cursor-pointer text-gray-300 hover:text-white transition-colors"></i>
          <i className="ri-group-line text-xl cursor-pointer text-gray-300 hover:text-white transition-colors"></i>
        </div>

        <div className="relative">
          <div
            onClick={() => setShowProfile(!showProfile)}
            className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-orange-500 font-semibold cursor-pointer text-sm md:text-base"
          >
            Z
          </div>

          {showProfile && (
            <UserMenuCard setShowProfile={setShowProfile} />
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>
    </div>
  );
};

export default Navbar;