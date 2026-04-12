import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import TermsandPolicy from "../../components/ui/TermsandPolicy";
import useAuth from "../../hooks/useAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser, loading, error, clearError } = useAuth();

  useEffect(() => {
    document.title = "Login - Spotify";
    clearError();
  }, [clearError]);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Email and Password are required");
      return;
    }

    loginUser({ email, password });
  };

  return (
    <div className="min-h-screen p-14 sm:p-26 w-full bg-[#121212] flex flex-col gap-18 justify-between items-center text-white px-4">

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
            Welcome back
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="bg-transparent border border-gray-500 p-3 rounded-md focus:outline-none focus:border-white w-full transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <div className="relative w-full border border-gray-500 rounded-md focus-within:border-white transition-colors">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-transparent p-3 pr-10 w-full focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-semibold">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={!email || !password || loading}
          className={`py-3 rounded-full font-bold transition flex justify-center items-center ${!email || !password || loading
            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
            : "bg-green-500 text-black cursor-pointer hover:bg-green-400 active:scale-95"
            }`}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="flex items-center gap-3 my-2">
          <div className="h-px bg-gray-600 flex-1"></div>
          <span className="text-sm text-gray-400">or</span>
          <div className="h-px bg-gray-600 flex-1"></div>
        </div>

        <button className="border cursor-pointer border-gray-500 py-3 rounded-full hover:border-white transition">
          <div className="h-6 flex px-4 items-center font-bold justify-between">
            <img className="h-full object-cover" src="/img/google.png" alt="" />
            Continue with Google
            <span></span>
          </div>
        </button>

        <button className="border cursor-pointer border-gray-500 py-3 rounded-full hover:border-white transition">
          <div className="h-6 flex px-4 items-center font-bold justify-between">
            <img className="h-full object-cover" src="/img/Apple.png" alt="" />
            Continue with Apple
            <span></span>
          </div>
        </button>

      </div>

      <div className="flex flex-col gap-10">
        <p className="text-md flex flex-col gap-3 text-zinc-400 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-white cursor-pointer font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>

        <TermsandPolicy />
      </div>
    </div>
  );
};

export default Login;