import React from "react";
import HighlightText from "@/shared/components/ui/HighlightText";
import usePlayer from "@/features/player/hooks/usePlayer";

const TrackSuggestionResults = ({ tracks, query }) => {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();

  if (!tracks.length) return null;

  const handleTrackClick = (track, idx) => {
    const isCurrent = currentTrack?.id === track.id || currentTrack?.id === String(track._id?.$oid || track._id);
    if (isCurrent) {
      togglePlayPause();
    } else {
      // Normalize to player shape
      const normalizedTrack = {
        id: String(track._id?.$oid || track._id || track.id || ""),
        title: track.title,
        artist: track.primaryArtistName || (Array.isArray(track.artists) ? track.artists.join(", ") : track.artists?.[0] ?? "Unknown"),
        subtitle: track.primaryArtistName || (track.artists?.[0] ?? "Unknown"),
        image: track.coverImage || track.image || "",
        audioUrl: track.audioUrl || null,
        duration: track.duration || "0:00",
      };
      
      const normalizedQueue = tracks.map((t) => ({
        id: String(t._id?.$oid || t._id || t.id || ""),
        title: t.title,
        artist: t.primaryArtistName || (Array.isArray(t.artists) ? t.artists.join(", ") : t.artists?.[0] ?? "Unknown"),
        subtitle: t.primaryArtistName || (t.artists?.[0] ?? "Unknown"),
        image: t.coverImage || t.image || "",
        audioUrl: t.audioUrl || null,
        duration: t.duration || "0:00",
      }));

      playTrack(normalizedTrack, normalizedQueue, idx);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Songs</div>
      {tracks.slice(0, 5).map((track, idx) => {
        const trackId = String(track._id?.$oid || track._id || track.id);
        const isActive = currentTrack?.id === trackId;
        return (
          <div 
            key={idx} 
            onClick={() => handleTrackClick(track, idx)}
            className={`flex items-center justify-between p-3 hover:bg-white/10 cursor-pointer rounded-md transition-colors ${isActive ? "bg-white/5" : ""}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <img src={track.coverImage || track.image} alt={track.title} className="w-10 h-10 rounded object-cover shrink-0" />
              <div className="truncate">
                <p className={`text-sm truncate font-medium ${isActive ? "text-green-500" : "text-white"}`}>
                  <HighlightText text={track.title} highlight={query} />
                </p>
                <p className="text-xs text-zinc-400 truncate">{track.primaryArtistName || track.artists?.join(", ") || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-xs shrink-0">
              {isActive && isPlaying ? (
                <i className="ri-volume-up-fill text-green-500 text-base"></i>
              ) : (
                <span>{track.duration}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackSuggestionResults;