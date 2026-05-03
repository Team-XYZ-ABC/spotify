import React, { useState } from "react";
import { formatAddedLabel } from "@/features/playlist/utils/playlist";

const SongsTable = ({ songs, onRemoveTrack, canModifyTracks, onReorder, onPlay, currentTrackId, isPlaying }) => {
    const [dragIndex, setDragIndex] = useState(null);

    const handleDrop = async (dropIndex) => {
        if (dragIndex === null || dragIndex === dropIndex || !canModifyTracks) {
            setDragIndex(null);
            return;
        }

        await onReorder(dragIndex, dropIndex);
        setDragIndex(null);
    };

    return (
        <div className="px-6 lg:px-8 pb-10">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 lg:px-6 py-4 border-b border-zinc-800 text-gray-400 text-sm">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-3">Album</div>
                <div className="col-span-2">Date added</div>
                <div className="col-span-1 text-right">
                    <i className="ri-time-line"></i>
                </div>
            </div>

            {/* Songs */}
            {songs.map((song, index) => (
                <div
                    key={song.id}
                    draggable={canModifyTracks}
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(event) => {
                        if (canModifyTracks) event.preventDefault();
                    }}
                    onDrop={() => handleDrop(index)}
                    className="group grid grid-cols-12 gap-4 px-4 lg:px-6 py-3 items-center rounded-md transition hover:bg-[#1a1a1a] cursor-pointer"
                    onClick={() => onPlay?.(song)}
                >
                    <div className="col-span-1 text-gray-400 text-lg flex items-center">
                        {currentTrackId === String(song.id) ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); onPlay?.(song); }}
                                className="text-[#1ed760]"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                <i className={isPlaying ? "ri-pause-fill" : "ri-play-fill"}></i>
                            </button>
                        ) : (
                            <>
                                <span className="group-hover:hidden">{index + 1}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onPlay?.(song); }}
                                    className="hidden group-hover:inline text-white"
                                    aria-label={`Play ${song.title}`}
                                >
                                    <i className="ri-play-fill"></i>
                                </button>
                            </>
                        )}
                    </div>

                    <div className="col-span-5 flex items-center gap-4 min-w-0">
                        {song?.image
                            ? (
                                <img
                                    src={song?.image}
                                    alt={song.title}
                                    className="w-14 h-14 rounded object-cover"
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                            )
                            : (
                                <div className="flex h-full p-4 items-center justify-center text-2xl text-zinc-500">
                                    <i className="ri-music-2-line"></i>
                                </div>
                            )}
                        <div className="min-w-0">
                            <h3 className="truncate text-base lg:text-lg font-medium">
                                {song.title}
                            </h3>
                            <p className="truncate text-sm text-gray-400">
                                {song.artist}
                            </p>
                        </div>
                    </div>

                    <div className="col-span-3 truncate text-gray-300 text-base">
                        {song.album}
                    </div>

                    <div className="col-span-2 text-gray-400 text-base">
                        {formatAddedLabel(song.addedAt)}
                    </div>

                    <div className="col-span-1 flex items-center justify-end gap-3 text-gray-300 text-base">
                        <span>{song.duration}</span>
                        <button
                            onClick={() => onRemoveTrack(song.id)}
                            disabled={!canModifyTracks}
                            className="text-zinc-500 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Remove ${song.title}`}
                        >
                            <i className="ri-delete-bin-7-line"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SongsTable;
