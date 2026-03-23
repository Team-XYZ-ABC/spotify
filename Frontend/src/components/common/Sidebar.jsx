import React from "react";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`
    bg-zinc-900 rounded-lg p-4 text-white
    fixed md:static top-0 left-0 md:h-auto z-50
    transition-transform duration-300
    
    w-[70%] sm:w-[50%] md:w-[25%] lg:w-[20%]

    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
    >
      <h2 className="font-bold text-lg mb-4">Your Library</h2>

      <ul className="flex flex-col gap-3 text-sm">
        <li className="hover:text-white cursor-pointer">Home</li>
        <li className="hover:text-white cursor-pointer">Search</li>
        <li className="hover:text-white cursor-pointer">Your Library</li>
      </ul>
    </div>
  );
};

export default Sidebar;
