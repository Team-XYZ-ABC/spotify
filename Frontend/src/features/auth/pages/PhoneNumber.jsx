import React, { useState } from "react";
import TermsandPolicy from "@/shared/components/ui/TermsandPolicy";
import { IoArrowBack, IoChevronDown } from "react-icons/io5";
import { Link, useNavigate } from "react-router";

const PhoneNumber = () => {
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    const isValid = phone.length === 10 && /^[0-9]+$/.test(phone);

    const handleContinue = () => {
        if (!isValid) return;
        navigate("/register/verify-otp");
    };

    return (
        <div className="min-h-screen w-full bg-[#121212] flex flex-col justify-between items-center text-white px-4 py-10">
            <div className="w-80 py-20 flex flex-col gap-6">
                <Link
                    to="/register"
                    className="text-gray-400 text-xl hover:text-white w-fit"
                >
                    <IoArrowBack />
                </Link>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                        Phone number
                    </label>

                    <div className="flex gap-3">
                        <div className="flex items-center justify-between border border-gray-600 px-3 py-3 rounded-md w-24 cursor-pointer hover:border-white transition">
                            <span>+91</span>
                            <IoChevronDown />
                        </div>

                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                            className="flex-1 bg-transparent border border-gray-600 px-4 py-3 rounded-md 
              focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
                        />
                    </div>

                    {!isValid && phone.length > 0 && (
                        <p className="text-red-500 text-xs mt-1">
                            Enter a valid 10-digit phone number
                        </p>
                    )}
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!isValid}
                    className={`mt-4 py-3 rounded-full font-bold transition 
          ${
                        isValid
                            ? "bg-green-500 text-black hover:scale-[1.02] active:scale-[0.98]"
                            : "text-gray-400 border cursor-not-allowed"
                    }`}
                >
                    Continue
                </button>
            </div>

            <TermsandPolicy />
        </div>
    );
};

export default PhoneNumber;
