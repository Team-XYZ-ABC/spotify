import React from "react";

const PlaylistControls = ({
    isEmpty,
    canManagePlaylist,
    canModifyTracks,
    onFindSongs,
    onCreatePlaylist,
    onOpenCollaborators,
    onDeletePlaylist,
    onPlay,
    isPlaying,
}) => {
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-5 bg-[linear-gradient(180deg,rgba(0,0,0,0.36),transparent)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                        disabled={isEmpty}
                        onClick={onPlay}
                        className={`flex h-14 w-14 items-center justify-center rounded-full text-3xl transition-transform ${isEmpty
                            ? "cursor-not-allowed bg-zinc-700 text-zinc-500"
                            : "bg-[#1ed760] text-black hover:scale-[1.03]"
                            }`}
                    >
                        <i className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill ml-1"}`}></i>
                    </button>

                    <button
                        onClick={onFindSongs}
                        disabled={!canModifyTracks}
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
                    >
                        Find songs
                    </button>

                    <button
                        onClick={onCreatePlaylist}
                        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                    >
                        New playlist
                    </button>

                    {canManagePlaylist && (
                        <button
                            onClick={onDeletePlaylist}
                            className="rounded-full border border-rose-400/40 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:border-rose-300 hover:bg-rose-400/10"
                        >
                            Delete
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-300 sm:gap-3">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10">
                        <i className="ri-shuffle-line text-xl"></i>
                    </button>
                    <button
                        onClick={onOpenCollaborators}
                        disabled={!canManagePlaylist}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <i className="ri-user-add-line text-xl"></i>
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10">
                        <i className="ri-share-forward-line text-xl"></i>
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10">
                        <i className="ri-more-fill text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaylistControls;