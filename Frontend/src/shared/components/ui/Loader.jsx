import React from "react";

const Loader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#09090B]">
      <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;