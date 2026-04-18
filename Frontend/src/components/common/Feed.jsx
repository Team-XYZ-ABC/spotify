import React, { useRef, useState } from "react";
import Footer from "./Footer";
import TopFilters from "../music/trackCard/TopFilters";
import SectionRow from "../music/trackCard/SectionRow";
import { sectionsData } from "../../data/SectionsHomeTrack";

const Feed = () => {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);

  const handlePlay = (track) => {
    const audio = audioRef.current;

    if (currentTrack?.id === track.id) {
      if (!audio.paused) {
        audio.pause();
      } else {
        audio.play();
      }
      return;
    }

    audio.pause();
    audio.src = track.audioUrl;
    audio.play();

    setCurrentTrack(track);
  };
  return (
    <div className="h-full w-full overflow-y-auto bg-linear-to-b from-[#1f1f1f] via-[#121212] to-[#121212] rounded-lg">
      <div className="flex flex-col gap-10 px-6 py-5">
        <TopFilters />

        {sectionsData.map((section) => (
          <SectionRow
            key={section.id}
            title={section.title}
            items={section.items}
            type={section.type}
            onPlay={handlePlay}
          />
        ))}

        {currentTrack && (
          <div className="fixed bottom-0 left-0 z-99 right-0 bg-black text-white p-4 flex items-center gap-4">
            <img
              src={currentTrack.image}
              alt=""
              className="w-12 h-12 rounded"
            />
            <div>
              <p className="text-sm font-semibold">{currentTrack.title}</p>
              <p className="text-xs text-gray-400">
                {currentTrack.subtitle}
              </p>
            </div>
          </div>
        )}

        <div className="h-20" />
      </div>
      <Footer />
    </div>
  );
};

export default Feed;
