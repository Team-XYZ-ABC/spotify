import React from "react";
import usePlayer from "@/features/player/hooks/usePlayer";

const TrackItem = ({ track, tracks, index }) => {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const isActive = currentTrack?.id === track.trackId || currentTrack?.id === track.id;

  const handleClick = () => {
    if (isActive) {
      togglePlayPause();
    } else {
      // Normalize to player shape
      const normalizedTrack = {
        id: String(track.trackId || track.id || ""),
        title: track.title,
        artist: track.artist,
        subtitle: track.artist,
        image: track.img || track.image || "",
        audioUrl: track.audioUrl || null,
        duration: track.duration,
      };

      const normalizedQueue = tracks.map((t) => ({
        id: String(t.trackId || t.id || ""),
        title: t.title,
        artist: t.artist,
        subtitle: t.artist,
        image: t.img || t.image || "",
        audioUrl: t.audioUrl || null,
        duration: t.duration,
      }));

      playTrack(normalizedTrack, normalizedQueue, index);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`grid grid-cols-12 items-center hover:bg-[#1a1a1a] p-3 rounded cursor-pointer transition-colors ${isActive ? "bg-white/5" : ""}`}
    >
      <span className="col-span-1 text-gray-400">
        {isActive && isPlaying ? (
          <i className="ri-volume-up-fill text-green-500 text-base"></i>
        ) : (
          index + 1
        )}
      </span>

      <div className="col-span-6 flex gap-3 min-w-0">
        <img src={track.img} className="w-10 h-10 rounded object-cover shrink-0" />
        <div className="truncate">
          <p className={`truncate ${isActive ? "text-green-500 font-medium" : "text-white"}`}>{track.title}</p>
          <p className="text-xs text-gray-400 truncate">{track.artist}</p>
        </div>
      </div>

      <span className="col-span-3 text-gray-400 truncate pr-2">{track.album}</span>
      <span className="col-span-2 text-right text-gray-400">
        {track.duration}
      </span>
    </div>
  );
};

export default TrackItem;