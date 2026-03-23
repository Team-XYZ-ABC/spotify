import React from "react";
import Footer from "./Footer";

const Feed = () => {
  return (
    <div className="flex-1 h-[calc(100vh-86px)] no-scrollbar overflow-y-auto bg-zinc-900 rounded-lg flex flex-col">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-6 text-white">
        
        {Array(20).fill().map((_, i) => (
          <div key={i} className="h-66 cursor-pointer w-full rounded-md bg-zinc-800 hover:bg-zinc-900 transition"></div>
        ))}

      </div>
      <Footer />
    </div>
  );
};

export default Feed;