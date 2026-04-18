import React from "react";
import { useNavigate } from "react-router";
import {
    formatPlaylistDuration,
    formatTrackCount,
    getPlaylistCoverImages,
} from "../../utils/playlist";

const PlaylistHeader = ({
    playlist,
    canManagePlaylist,
    onOpenEdit,
    onOpenCollaborators,
}) => {
    const navigate = useNavigate();

    const coverImages = getPlaylistCoverImages(playlist, 4);
    const totalDuration = formatPlaylistDuration(playlist.tracks);
    const ownerName = playlist.owner?.displayName || playlist.owner?.username || "Unknown";
    const ownerAvatar = playlist.owner?.avatar || "";

    return (
        <div
            className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 lg:pt-8 pb-7 sm:pb-9"
            style={{
                background: "linear-gradient(180deg,#3a0313 0%,#12090c 100%)",
            }}
        >

            {/* Mobile Back Arrow */}
            <button
                onClick={() => navigate(-1)}
                className="md:hidden mb-6 text-3xl text-gray-300"
            >
                <i className="ri-arrow-left-line"></i>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8 lg:gap-10">

                {/* Cover */}
                <div className="mx-auto sm:mx-0 w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 shadow-2xl rounded-md overflow-hidden grid grid-cols-2 grid-rows-2 shrink-0 bg-[#202020]">
                    {coverImages.length > 0 ? (
                        <>
                            {coverImages.map((image, index) => (
                                <img
                                    key={`${playlist.id}-${index}`}
                                    src={image}
                                    alt={playlist.name}
                                    className="w-full h-full object-cover"
                                />
                            ))}
                            {Array.from({ length: Math.max(0, 4 - coverImages.length) }).map((_, index) => (
                                <div
                                    key={`${playlist.id}-filler-${index}`}
                                    className="flex h-full w-full items-center justify-center bg-[#2a2a2a] text-zinc-500"
                                >
                                    <i className="ri-music-2-line text-xl"></i>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="col-span-2 row-span-2 flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,#3f3f46,transparent_55%)] text-zinc-400">
                            <i className="ri-music-2-line text-7xl sm:text-8xl"></i>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="text-left sm:pb-3 min-w-0">
                    <p className="hidden sm:block text-sm text-gray-200/90 mb-3 uppercase tracking-[0.18em]">
                        Public Playlist
                    </p>

                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <h1 className="min-w-0 text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-none tracking-tight wrap-break-word">
                            {playlist.name}
                        </h1>

                        {canManagePlaylist && (
                            <button
                                onClick={onOpenEdit}
                                className="h-10 w-10 rounded-full bg-white/10 text-lg text-white backdrop-blur-sm transition hover:bg-white/20"
                            >
                                <i className="ri-pencil-line"></i>
                            </button>
                        )}
                    </div>

                    <p className="mb-4 max-w-2xl text-sm sm:text-base text-white/70">
                        {playlist.description || "No description yet"}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-100 mb-2">
                        {ownerAvatar ? (
                            <img
                                src={ownerAvatar}
                                alt={ownerName}
                                className="h-7 w-7 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold uppercase">
                                {ownerName.charAt(0)}
                            </div>
                        )}

                        <span className="font-semibold">{ownerName}</span>
                        <span className="text-white/50">•</span>
                        <span className="text-white/80">{formatTrackCount(playlist.tracks.length)}</span>
                        <span className="text-white/50">•</span>
                        <span className="text-white/80">{totalDuration}</span>
                        <span className="text-white/50">•</span>
                        {canManagePlaylist ? (
                            <button
                                onClick={onOpenCollaborators}
                                className="text-white/80 underline-offset-2 transition hover:text-white hover:underline"
                            >
                                {playlist.collaborators?.length || 0} collaborator{playlist.collaborators?.length === 1 ? "" : "s"}
                            </button>
                        ) : (
                            <span className="text-white/80">
                                {playlist.collaborators?.length || 0} collaborator{playlist.collaborators?.length === 1 ? "" : "s"}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaylistHeader;
