import React from "react";
import HighlightText from "../../ui/HighlightText";

const TrackSuggestionResults = ({ tracks, query }) => {
  if (!tracks.length) return null;

  return (
    <div className="flex flex-col gap-2">
      {tracks.map((track, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer rounded-md">
          <img src={track.coverImage} alt={track.title} className="w-10 h-10 rounded object-cover" />
          <div className="text-zinc-400">
            <HighlightText text={track.title} highlight={query} />
            <div className="text-xs text-gray-400">{track.artists?.join(", ") || "Unknown"}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackSuggestionResults;