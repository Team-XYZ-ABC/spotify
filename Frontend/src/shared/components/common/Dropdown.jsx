import React, { useEffect, useRef, useState } from "react";

const Dropdown = (
    {
        label,
        value,
        onChange,
        options,
        placeholder,
        required = false,
        search = true,
    },
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find((opt) => opt.value === value)?.label ||
        placeholder;

    return (
        <div className="w-full" ref={dropdownRef}>
            <label className="block text-xs font-bold text-white mb-1.5">
                {label}
                {required && <span className="text-[#1DB954] ml-1">•</span>}
            </label>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]/30 text-left flex items-center justify-between"
                >
                    <span className="text-xs truncate">{selectedLabel}</span>
                    <svg
                        className={`w-4 h-4 text-gray-400 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                        {search && (
                            <div className="p-2 border-b border-white/5">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded text-xs px-2 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#1DB954]"
                                />
                            </div>
                        )}
                        <div className="max-h-48 overflow-y-auto">
                            {filteredOptions.length > 0
                                ? (
                                    filteredOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                onChange(option.value);
                                                setIsOpen(false);
                                                setSearchQuery("");
                                            }}
                                            className={`w-full px-3 py-2 text-left text-xs font-medium ${
                                                value === option.value
                                                    ? "bg-[#1DB954] text-black"
                                                    : "text-gray-300 hover:bg-white/10"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))
                                )
                                : (
                                    <div className="px-3 py-4 text-xs text-gray-500 text-center">
                                        No options found
                                    </div>
                                )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
