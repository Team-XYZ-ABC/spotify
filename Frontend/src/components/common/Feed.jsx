import React from "react";
import Footer from "./Footer";

const Feed = () => {
  return (
    <div className="flex-1 h-[calc(100vh-86px)] no-scrollbar overflow-y-auto bg-zinc-900 rounded-lg flex flex-col">
      <div className="flex flex-col gap-3 p-6 text-white">
        {Array(5).fill().map((_, i) => (
          <div
            key={i}
            className=" p-2 cursor-pointer flex flex-col gap-4 w-full rounded-md transition"
          >
            <h1 className="text-xl">Genre Category</h1>
            <div className="flex gap-4 no-scrollbar overflow-x-auto">
              {Array(8).fill().map((_, i) => (
              <div key={i} className="h-56 w-54 shrink-0 bg-zinc-950 rounded-lg">
              </div>
            ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Feed;
