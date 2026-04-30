import React, { useState } from "react";
import UploadSongForm from "@/shared/components/ui/UploadSongForm";

const steps = [
  {
    id: "01",
    title: "Choose a distributor",
    desc: "Pick a music distributor to get your track on Spotify.",
  },
  {
    id: "02",
    title: "Upload your music",
    desc: "Add your audio file, cover image and metadata.",
  },
  {
    id: "03",
    title: "Access your dashboard",
    desc: "Manage your tracks and track performance.",
  },
  {
    id: "04",
    title: "Prepare for release",
    desc: "Schedule and publish your music globally.",
  },
];

const UploadTrack = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <UploadSongForm
        isOpen={showForm}
        onClose={setShowForm}
      />
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-12 py-12 flex flex-col justify-evenly text-white space-y-16">
      <div className="max-w-5xl space-y-6">
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold leading-tighter">
          Get your music on Spotify
        </h1>

        <p className="text-base md:text-2xl ml-2 text-zinc-400 max-w-xl">
          Reach millions of listeners and find your fans around the world.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 cursor-pointer hover:bg-white/95 hover:scale-102 transition-all py-3 rounded-full bg-white text-black font-semibold"
        >
          Get Started
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-xl">Stages we follow</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="relative min-h-45 border-t-2 border-violet-600 overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-violet-600 scale-y-0 origin-top transition-transform duration-500 group-hover:scale-y-100" />

              <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div>
                  <span className="text-sm text-zinc-400 group-hover:text-white transition">
                    {step.id}
                  </span>

                  <h2 className="text-lg font-semibold mt-2 group-hover:text-white transition">
                    {step.title}
                  </h2>

                  <p className="text-sm text-zinc-400 mt-2 group-hover:text-white/80 transition">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <i className="ri-arrow-right-line text-lg opacity-0 -translate-x-2.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  </i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadTrack;
