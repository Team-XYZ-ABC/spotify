import React from "react";
import HighlightText from "../../ui/HighlightText";

const AlbumSuggestionResults = ({ albums, query }) => {
  if (!albums.length) return null;

  return (
    <div className="mb-4">
      <div className="text-xs uppercase text-gray-400 font-semibold px-3 py-2">Albums</div>
      {albums.map((album, idx) => (
        <div key={idx} className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 cursor-pointer rounded-md">
          <img src={album.coverImage} alt={album.title} className="w-10 h-10 rounded object-cover" />
          <div>
            <HighlightText text={album.title} highlight={query} />
            <div className="text-xs text-gray-400">Album</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlbumSuggestionResults;