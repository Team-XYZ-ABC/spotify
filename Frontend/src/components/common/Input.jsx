import React from "react";

const Input = ({ label, value, onChange, placeholder, required = false }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}{" "}
            {required && <span className="text-green-500 text-xs">*</span>}
        </label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none placeholder:text-xs focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
        />
    </div>
);

export default Input;
