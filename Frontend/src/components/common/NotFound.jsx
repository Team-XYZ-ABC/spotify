import React from "react";
import { Link } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

const NotFound = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#09090B] text-white">
      
      <div className="w-full md:px-40">
        <Navbar />
      </div>

      <div className="flex-1 flex items-center justify-center py-24 px-6">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-6">
            
            <h1 className="text-4xl sm:text-7xl font-light leading-tight">
              This page is{" "}
              <span className="font-mix text-green-500">
                out of tune
              </span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base">
              We can't find the page you're looking for. Check the link again,
              listen on our{" "}
              <span className="underline cursor-pointer hover:text-white">
                Web Player
              </span>
              , or go to our{" "}
              <span className="underline cursor-pointer hover:text-white">
                Support
              </span>{" "}
              page.
            </p>

            <p className="text-gray-400 text-sm">
              Don’t have an account yet? Well, first things first.
            </p>

            <div className="pt-2">
              <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition">
                Sign up free
              </button>
            </div>

            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm pt-4"
            >
              <i className="ri-arrow-left-line"></i>
              Back to home
            </Link>
          </div>

          <div className="flex justify-center">
            <img
              src="/img/404.png"
              alt="Not Found"
              className="w-[80%] max-w-md opacity-90"
            />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;