import React from "react";
import Footer from "./Footer";

const Feed = () => {
  return (
    <div className="w-[80%] bg-zinc-900 rounded-lg flex flex-col overflow-hidden">
      <div className="flex-1 p-6 text-white">
        Feed Content
      </div>

      <Footer />
    </div>
  );
};

export default Feed;
