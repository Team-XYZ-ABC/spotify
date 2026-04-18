import React from "react";
import { formatAddedLabel } from "../../utils/playlist";

const MobileSongsList = ({ songs, onRemoveTrack, canModifyTracks }) => {
  return (
    <div className="px-4 sm:px-6 pb-8 space-y-4">
      {songs.map((song) => (
        <div
          key={song.id}
          className="flex items-center justify-between gap-3 rounded-2xl bg-[#151515] px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-4">
            <img
              src={song.image}
              alt={song.title}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded object-cover"
            />

            <div className="min-w-0">
              <h3 className="truncate text-base sm:text-xl font-medium">
                {song.title}
              </h3>
              <p className="truncate text-gray-400 text-sm sm:text-base">
                {song.artist}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-zinc-500">
                <span>{formatAddedLabel(song.addedAt)}</span>
                <span>•</span>
                <span>{song.duration}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onRemoveTrack(song.id)}
            disabled={!canModifyTracks}
            className="text-2xl text-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Remove ${song.title}`}
          >
            <i className="ri-delete-bin-7-line"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default MobileSongsList;