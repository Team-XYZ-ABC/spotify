import React, { useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router";
import TermsandPolicy from "@/shared/components/ui/TermsandPolicy";

const VerifyOtp = () => {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputsRef = useRef([]);

    const isValid = otp.every((digit) => digit !== "");

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").slice(0, 6);
        console.log(paste)
        if (!/^[0-9]+$/.test(paste)) return;

        const newOtp = paste.split("");
        setOtp(newOtp);

        newOtp.forEach((_, i) => {
            if (inputsRef.current[i]) {
                inputsRef.current[i].value = newOtp[i];
            }
        });
    };

    return (
        <div className="min-h-screen w-full bg-[#121212] flex flex-col justify-between items-center text-white px-4 py-10">
            <div className="w-80 py-20 flex flex-col gap-6">
                <Link
                    to="/phoneRegister"
                    className="text-gray-400 text-xl hover:text-white w-fit"
                >
                    <IoArrowBack />
                </Link>

                <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-semibold">
                        Enter the 6-digit code
                    </h1>
                    <p className="text-sm text-gray-400">
                        Sent to +91 99879 93844
                    </p>
                </div>
                <div
                    className="flex justify-between gap-2"
                    onPaste={handlePaste}
                >
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            ref={(el) => (inputsRef.current[index] = el)}
                            onChange={(e) =>
                                handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-10 h-12 text-center text-xl bg-transparent border border-gray-600 rounded-md 
              focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
                        />
                    ))}
                </div>

                <button
                    disabled={!isValid}
                    className={`mt-2 py-3 rounded-full font-bold transition 
          ${
                        isValid
                            ? "bg-green-500 text-black hover:scale-[1.02] active:scale-[0.98]"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    Verify
                </button>

                <p className="text-sm text-gray-400 text-center">
                    Didn’t receive code?{" "}
                    <span className="text-green-500 cursor-pointer hover:underline">
                        Resend
                    </span>
                </p>
            </div>

            <TermsandPolicy />
        </div>
    );
};

export default VerifyOtp;
