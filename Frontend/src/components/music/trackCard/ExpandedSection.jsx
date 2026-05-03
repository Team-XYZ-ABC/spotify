import React, { useCallback, useEffect, useRef } from "react";
import useRecommendationSection from "../../../hooks/useRecommendationSection";
import usePlayer from "../../../hooks/usePlayer";

const CARD_STYLES = {
    playlist: "rounded-md",
    album: "rounded-lg",
    podcast: "rounded-xl",
    artist: "rounded-full",
};

// Normalise a raw API track into the shape TrackCard expects
const normalise = (t) => ({
    id: t._id?.$oid || (t._id ? String(t._id) : null) || t.id || "",
    title: t.title,
    artist: t.primaryArtistName || (Array.isArray(t.artists) ? t.artists.join(", ") : t.artists?.[0] ?? "Unknown"),
    subtitle: t.primaryArtistName || (t.artists?.[0] ?? "Unknown"),
    image: t.coverImage || "",
    audioUrl: null,
    duration: t.duration,
    genres: t.genres || [],
});

// ── Single card ───────────────────────────────────────────────────────────────
const VirtualCard = ({ item, type, isPlaying, onPlay }) => {
    const handlePlay = (e) => {
        e.stopPropagation();
        onPlay(item);
    };

    return (
        <div className="group relative cursor-pointer p-3 rounded-lg overflow-hidden transition-all duration-150 hover:bg-white/10">
            <div className={`aspect-square w-full overflow-hidden shadow-lg ${CARD_STYLES[type] || "rounded-md"}`}>
                <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                />
            </div>

            <button
                onClick={handlePlay}
                className={`absolute bottom-20 right-6 flex h-12 w-12 items-center justify-center
          rounded-full shadow-xl
          transition-all duration-200 ease-out
          hover:scale-110
          ${isPlaying
                        ? "opacity-100 translate-y-0 scale-100 bg-green-400"
                        : "opacity-0 translate-y-3 scale-95 bg-green-500 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                    }`}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? (
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
                <h3 className="truncate text-sm font-semibold text-white hover:underline">{item.title}</h3>
                <p className="line-clamp-2 text-xs text-[#b3b3b3]">{item.subtitle}</p>
            </div>
        </div>
    );
};

// ── Expanded full-page section (infinite scroll + virtual grid) ───────────────
const ExpandedSection = ({ title, section, type, onClose, extraParams }) => {
    const { items: rawItems, loading, hasMore, loadMore } = useRecommendationSection(
        section,
        10,
        extraParams
    );
    const items = rawItems.map(normalise);

    const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayer();

    const sentinelRef = useRef(null);

    // IntersectionObserver for infinite scroll sentinel
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) loadMore(); },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [loadMore]);

    const handlePlay = useCallback(
        (item) => {
            if (currentTrack?.id === item.id) { togglePlayPause(); return; }
            const idx = items.findIndex((t) => t.id === item.id);
            playTrack(item, items, idx >= 0 ? idx : 0);
        },
        [currentTrack, items, playTrack, togglePlayPause]
    );

    return (
        <div className="fixed inset-0 z-50 bg-[#121212] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-4 bg-[#121212]/90 backdrop-blur px-6 py-4 border-b border-white/10">
                <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                    aria-label="Back"
                >
                    <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
            </div>

            {/* Virtualized grid */}
            <div className="px-6 pb-32 pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {items.map((item) => (
                        <VirtualCard
                            key={item.id}
                            item={item}
                            type={type}
                            isPlaying={isPlaying && currentTrack?.id === item.id}
                            onPlay={handlePlay}
                        />
                    ))}
                </div>

                {/* Sentinel for infinite scroll */}
                {hasMore && (
                    <div ref={sentinelRef} className="flex justify-center py-8">
                        {loading && (
                            <div className="flex gap-2">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className="h-2 w-2 rounded-full bg-green-500 animate-bounce"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {!hasMore && items.length > 0 && (
                    <p className="py-8 text-center text-xs text-[#b3b3b3]">You've reached the end</p>
                )}

                {!loading && items.length === 0 && (
                    <p className="py-16 text-center text-[#b3b3b3]">No tracks found</p>
                )}
            </div>
        </div>
    );
};

export default ExpandedSection;
