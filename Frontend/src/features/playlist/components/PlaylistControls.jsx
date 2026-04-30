import React, { useEffect, useRef, useState } from "react";

const PlaylistControls = ({
    isEmpty,
    canManagePlaylist,
    canModifyTracks,
    onFindSongs,
    onCreatePlaylist,
    onOpenCollaborators,
    onOpenEdit,
    onDeletePlaylist,
    onPlay,
    isPlaying,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for browsers that block clipboard
            prompt("Copy this link:", window.location.href);
        }
    };

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
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Find songs
                    </button>

                    <button
                        onClick={onCreatePlaylist}
                        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                    >
                        New playlist
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-300 sm:gap-3">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10">
                        <i className="ri-shuffle-line text-xl"></i>
                    </button>

                    <button
                        onClick={onOpenCollaborators}
                        disabled={!canManagePlaylist}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Manage collaborators"
                    >
                        <i className="ri-user-add-line text-xl"></i>
                    </button>

                    {/* Share — copies link to clipboard */}
                    <button
                        onClick={handleShare}
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition ${copied ? "bg-[#1ed760]/20 text-[#1ed760]" : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                            }`}
                        title={copied ? "Link copied!" : "Copy link"}
                    >
                        {copied
                            ? <i className="ri-check-line text-xl" />
                            : <i className="ri-share-forward-line text-xl" />
                        }
                    </button>

                    {/* 3-dot menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10"
                            title="More options"
                        >
                            <i className="ri-more-fill text-xl"></i>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 bottom-12 z-50 min-w-[180px] rounded-xl border border-white/10 bg-[#282828] shadow-2xl py-1 overflow-hidden">
                                {canManagePlaylist && (
                                    <button
                                        onClick={() => { setMenuOpen(false); onOpenEdit?.(); }}
                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition"
                                    >
                                        <i className="ri-edit-line text-base text-zinc-400" />
                                        Edit details
                                    </button>
                                )}
                                {canManagePlaylist && (
                                    <button
                                        onClick={() => { setMenuOpen(false); onDeletePlaylist?.(); }}
                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition"
                                    >
                                        <i className="ri-delete-bin-line text-base" />
                                        Delete playlist
                                    </button>
                                )}
                                <button
                                    onClick={() => { setMenuOpen(false); handleShare(); }}
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition"
                                >
                                    <i className="ri-link text-base text-zinc-400" />
                                    Copy link
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaylistControls;