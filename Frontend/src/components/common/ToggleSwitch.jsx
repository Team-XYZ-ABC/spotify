import React from 'react'

const ToggleSwitch = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#121212] ${
                checked ? "bg-green-500" : "bg-gray-600"
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checked ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
    </div>
);

export default ToggleSwitch