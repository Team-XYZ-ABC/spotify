import React from "react";
import HighlightText from "../../ui/HighlightText";

const AlbumSuggestionResults = ({ albums, query }) => {
  if (!albums.length) return null;

  return (
    <div className="flex flex-col gap-2">
      {albums.map((album, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer rounded-md">
          <img src={album.coverImage} alt={album.title} className="w-10 h-10 rounded object-cover" />
          <div className="text-zinc-400">
            <HighlightText text={album.title} highlight={query} />
            <div className="text-xs text-gray-400">Album</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlbumSuggestionResults;