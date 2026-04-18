import React from "react";
import HighlightText from "../../ui/HighlightText";

const TextSuggestionResults = ({ suggestions, query }) => {
  if (!suggestions.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case "user": return "ri-user-line";
      case "album": return "ri-album-line";
      case "track": return "ri-music-2-line";
      case "playlist": return "ri-play-list-line";
      default: return "ri-file-line";
    }
  };

  return (
    <div className="mb-4">
      <div className="text-xs uppercase text-gray-400 font-semibold px-3 py-2">Top results</div>
      {suggestions.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 px-3 py-3 hover:bg-white/10 cursor-pointer rounded-md transition"
        >
          <i className={`${getIcon(item.type)} text-xl text-gray-300`}></i>
          <div className="flex-1">
            <HighlightText text={item.name} highlight={query} />
            <div className="text-xs text-gray-400 capitalize">{item.type}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TextSuggestionResults;