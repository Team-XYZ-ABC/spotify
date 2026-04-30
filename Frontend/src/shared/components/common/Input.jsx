import React from "react";

const Input = (
    { label, value, onChange, placeholder, required = false, type = "text" },
) => (
    <div className="w-full">
        <label className="block text-xs font-bold text-white mb-1.5">
            {label} {required && <span className="text-[#1DB954] ml-1">•</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white placeholder-gray-500 focus:outline-none placeholder:text-xs focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]/30 text-xs"
        />
    </div>
);

export default Input;
