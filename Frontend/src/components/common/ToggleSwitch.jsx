import React from "react";

const ToggleSwitch = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-sm font-bold text-white">{label}</span>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-[#1DB954]/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
                checked
                    ? "bg-linear-to-r from-[#1DB954] to-[#1ed760]"
                    : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ${
                    checked ? "translate-x-7" : "translate-x-1"
                }`}
            />
        </button>
    </div>
);

export default ToggleSwitch;
