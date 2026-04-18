import React, { useState } from 'react'

const TopFilters = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All" },
    { id: "music", label: "Music" },
    { id: "podcasts", label: "Podcasts" },
  ];

  return (
    <div className="flex gap-3 pb-4 pt-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`rounded-full px-5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
            activeFilter === filter.id
              ? "bg-white text-black"
              : "bg-[#282828] text-white hover:bg-[#3e3e3e]"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TopFilters