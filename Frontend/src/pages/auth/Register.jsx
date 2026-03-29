import React, { useEffect, useState } from "react";
import TermsandPolicy from "../../components/ui/TermsandPolicy";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  useEffect(() => {
    document.title = "Sign-up - Spotify";
  }, []);
  const [email, setEmail] = useState("");
  const { handleEmailVerify, loading, error } = useAuth();
  console.log(loading);

  return (
    <div className="min-h-screen p-14 mt-24 sm:p-26 w-full bg-[#121212] flex flex-col gap-18 justify-between items-center text-white px-4">
      <div className="w-80 flex flex-col gap-4">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="h-10 w-10">
            <img
              className="h-full w-full object-contain"
              src="/img/spotify_logo_white.png"
              alt="logo"
            />
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold leading-tight">
            Sign up to start listening
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold">
            Email address
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            id="email"
            placeholder="name@domain.com"
            className="bg-transparent border border-gray-500 p-3 rounded-md focus:outline-none focus:border-white"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
{/* 
        <Link
          to={"/register/phoneRegister"}
          className="text-green-500 underline text-sm cursor-pointer hover:underline"
        >
          Use phone number instead.
        </Link> */}

        <button
          onClick={() => handleEmailVerify(email)}
          disabled={loading}
          className="bg-green-500 w-full cursor-pointer text-black font-bold py-3 rounded-full active:scale-95 transition"
        >
          {loading ? "Checking..." : "Next"}
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-gray-600 flex-1"></div>
          <span className="text-sm text-gray-400">or</span>
          <div className="h-px bg-gray-600 flex-1"></div>
        </div>

        <button className="border border-gray-500 py-3 rounded-full hover:border-white transition">
          <div className="h-6 cursor-pointer flex px-4 items-center font-bold justify-between">
            <img className="h-full object-cover" src="/img/google.png" alt="" />
            Sign up with Google
            <span></span>
          </div>
        </button>

        <button className="border border-gray-500 py-3 rounded-full hover:border-white transition">
          <div className="h-6 cursor-pointer flex px-4 items-center font-bold justify-between">
            <img className="h-full object-cover" src="/img/Apple.png" alt="" />
            Sign up with Apple
            <span></span>
          </div>
        </button>
      </div>
      <div className="flex flex-col gap-10">
        <p className="text-md flex flex-col gap-3 text-zinc-400 text-center">
          Already have an account?{" "}
          <span className="text-white cursor-pointer font-bold">Log in</span>
        </p>

        <TermsandPolicy />
      </div>
    </div>
  );
};

export default Register;
