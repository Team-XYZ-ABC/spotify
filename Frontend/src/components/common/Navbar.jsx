import React, { useState } from "react";
import { Link } from "react-router";
import UserMenuCard from "../../pages/home/UserMenuCard";

const Navbar = ({ toggleSidebar }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="w-full relative h-16 flex items-center justify-between px-4 text-white">
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/img/spotify_logo_white.png"
          alt="logo"
          className="h-10 w-10"
        />
      </Link>
      <div className="hidden md:flex items-center bg-[#121212] px-4 py-3 rounded-full w-[40%]">
        <input
          type="text"
          placeholder="What do you want to play?"
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>
      {isLogin
        ? (
          <div className="flex items-center">
            <div className="relative group h-12 w-12 hidden items-center justify-center cursor-pointer md:flex rounded-full bg-zinc-900 transition-all ease-in-out duration-200 hover:bg-zinc-800">
              <div
                onClick={() => setShowProfile(!showProfile)}
                className="profile bg-blue-700 text-white font-semibold text-2xl h-10 w-10 flex items-center justify-center rounded-full"
              >
                S
              </div>
              <span
                className={`absolute ${
                  showProfile ? "hidden" : "group-hover:flex"
                } hidden text-xs -bottom-8 w-27 rounded -left-14 z-9 px-2 py-1 bg-zinc-800`}
              >
                Suryakumar Sirvi
              </span>
            </div>

            {showProfile && <UserMenuCard setShowProfile={setShowProfile}/>}

            <button
              onClick={() => setShowProfile(!showProfile)}
              className="md:hidden text-white text-3xl"
            >
              <i className="ri-settings-3-line"></i>
            </button>
          </div>
        )
        : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/register"
                className="text-sm font-semibold text-gray-300 hover:text-white"
              >
                Sign up
              </Link>

              <Link
                to="/login"
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition"
              >
                Log in
              </Link>
            </div>
            <button
              onClick={toggleSidebar}
              className="md:hidden text-white text-xl"
            >
              ☰
            </button>
          </div>
        )}
    </div>
  );
};

export default Navbar;
