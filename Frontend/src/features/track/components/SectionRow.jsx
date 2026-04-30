import React, { useCallback, useState } from "react";
import TrackCard from "@/features/track/components/TrackCard";
import ExpandedSection from "@/features/track/components/ExpandedSection";
import useRecommendationSection from "@/features/recommendation/hooks/useRecommendationSection";
import usePlayer from "@/features/player/hooks/usePlayer";

// Normalise a raw API track → shape expected by TrackCard
const normalise = (t) => ({
  // Handle ObjectId, { $oid: "..." }, plain string, or already-normalised id
  id: t._id?.$oid || (t._id ? String(t._id) : null) || t.id || "",
  title: t.title,
  // PlayerContext stores artist name as `artist`, subtitle is the display alias
  artist: t.primaryArtistName || (Array.isArray(t.artists) ? t.artists.join(", ") : t.artists?.[0] ?? "Unknown"),
  subtitle: t.primaryArtistName || (t.artists?.[0] ?? "Unknown"),
  image: t.coverImage || "",
  // Set null so PlayerContext always fetches a fresh presigned /stream URL
  audioUrl: null,
  duration: t.duration,
  genres: t.genres || [],
});

// Skeleton placeholder while loading
const SkeletonCard = () => (
  <div className="w-44 shrink-0 p-3 rounded-lg animate-pulse">
    <div className="aspect-square w-full rounded-md bg-white/10" />
    <div className="mt-3 h-3 w-3/4 rounded bg-white/10" />
    <div className="mt-2 h-2 w-1/2 rounded bg-white/10" />
  </div>
);

const SectionRow = ({ title, section, type, extraParams }) => {
  const { items: rawItems, initialLoading, error } = useRecommendationSection(
    section,
    10,
    extraParams
  );
  const items = rawItems.map(normalise);

  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayer();
  const [expanded, setExpanded] = useState(false);

  const handlePlay = useCallback(
    (item) => {
      if (currentTrack?.id === item.id) { togglePlayPause(); return; }
      const idx = items.findIndex((t) => t.id === item.id);
      playTrack(item, items, idx >= 0 ? idx : 0);
    },
    [currentTrack, items, playTrack, togglePlayPause]
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white hover:underline cursor-pointer">
            {title}
          </h2>
          {!initialLoading && items.length > 0 && (
            <button
              onClick={() => setExpanded(true)}
              className="text-sm font-medium text-[#b3b3b3] hover:text-white hover:underline transition"
            >
              Show all
            </button>
          )}
        </div>

        <div className="scrollbar-hide relative -mx-6 overflow-x-auto px-6 pb-4 scroll-smooth">
          <div className="flex gap-6">
            {initialLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : error
                ? <p className="text-sm text-[#b3b3b3] px-2">{error}</p>
                : items.map((item) => (
                  <TrackCard
                    key={item.id}
                    item={item}
                    type={type}
                    onPlay={handlePlay}
                    isActive={isPlaying && currentTrack?.id === item.id}
                  />
                ))}
          </div>
        </div>
      </div>

      {expanded && (
        <ExpandedSection
          title={title}
          section={section}
          type={type}
          extraParams={extraParams}
          onClose={() => setExpanded(false)}
        />
      )}
    </>
  );
};

export default SectionRow;