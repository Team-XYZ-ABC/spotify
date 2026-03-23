import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <div className="w-full h-16 flex items-center justify-between px-6 text-white">
      
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/img/spotify_logo_white.png"
          alt="logo"
          className="h-8 w-8"
        />
        <span className="font-bold text-lg hidden sm:block">
          Spotify
        </span>
      </Link>
      <div className="hidden md:flex items-center bg-[#121212] px-4 py-3 rounded-full w-[40%]">
        <input
          type="text"
          placeholder="What do you want to play?"
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>
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
    </div>
  );
};

export default Navbar;