import React from 'react'

const CARD_STYLES = {
  playlist: "rounded-md",
  album: "rounded-lg",
  podcast: "rounded-xl",
  artist: "rounded-full",
};

const TrackCard = ({ item, type, onPlay, isActive }) => {
  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay(item);
  };

  return (
    <div className={`group relative w-44 md:w-52 shrink-0 cursor-pointer p-3 
    rounded-lg overflow-hidden
    transition-all duration-150 ease-out
    hover:bg-white/10 ${isActive ? "bg-white/10" : ""}`}>
      <div
        className={`aspect-square w-full overflow-hidden shadow-lg ${CARD_STYLES[type] || "rounded-md"}`}
      >
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover 
          transition-transform duration-300 ease-out"
          loading="lazy"
          onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
        />

        <div className="absolute inset-0 
        bg-linear-to-t from-black/60 to-transparent 
        opacity-0 group-hover:opacity-100 
        transition-opacity duration-200 ease-out" />
      </div>

      <button
        onClick={handlePlayClick}
        className={`absolute bottom-20 right-6 flex h-12 w-12 items-center justify-center 
        rounded-full shadow-xl
        transition-all duration-200 ease-out
        hover:scale-110
        ${isActive
            ? "opacity-100 translate-y-0 scale-100 bg-green-400 hover:bg-green-300"
            : "opacity-0 translate-y-3 scale-95 bg-green-500 hover:bg-green-400 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
          }`}
        aria-label={isActive ? "Pause" : "Play"}
      >
        {isActive ? (
          <svg className="h-5 w-5 fill-black" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="ml-0.5 h-6 w-6 fill-black" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="mt-3">
        <h3 className={`truncate text-sm font-semibold hover:underline cursor-pointer ${isActive ? "text-green-400" : "text-white"}`}>
          {item.title}
        </h3>
        <p className="line-clamp-2 text-xs text-[#b3b3b3]">
          {item.subtitle}
        </p>
      </div>
    </div>
  );
};

export default TrackCard