import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import usePlaylists from "../../hooks/usePlaylists";
import { formatPlaylistDuration, formatTrackCount, getPlaylistCoverImages } from "../../utils/playlist";
import CreatePlaylistModal from "../../components/Playlist/modals/CreatePlaylistModal";

const PlaylistList = () => {
    const navigate = useNavigate();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { playlists, loading, error, loadPlaylists, createPlaylist } = usePlaylists();

    useEffect(() => {
        loadPlaylists();
    }, [loadPlaylists]);

    const handleCreate = async (payload) => {
        const playlist = await createPlaylist(payload);
        setIsCreateOpen(false);
        navigate(`/playlist/${playlist.id}`);
    };

    return (
        <div className="flex-1 min-w-0 h-[calc(100vh-88px)] overflow-y-auto rounded-lg bg-black text-white no-scrollbar px-4 sm:px-6 lg:px-8 py-6">
            <CreatePlaylistModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
                isSubmitting={loading}
            />

            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Your playlists</h1>
                    <p className="mt-1 text-sm text-zinc-400">Create and manage collaborative playlists.</p>
                </div>

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-full bg-[#1ed760] px-4 py-2 text-sm font-semibold text-black"
                >
                    New playlist
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                </div>
            )}

            {loading && playlists.length === 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="animate-pulse rounded-2xl bg-zinc-900 p-4">
                            <div className="h-36 rounded-lg bg-zinc-800"></div>
                            <div className="mt-3 h-5 w-2/3 rounded bg-zinc-800"></div>
                            <div className="mt-2 h-4 w-1/2 rounded bg-zinc-800"></div>
                        </div>
                    ))}
                </div>
            ) : playlists.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/20 px-6 py-12 text-center">
                    <h2 className="text-xl font-semibold">No playlists yet</h2>
                    <p className="mt-2 text-zinc-400">Create your first playlist to start adding songs.</p>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
                    >
                        Create playlist
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {playlists.map((playlist) => {
                        const coverImages = getPlaylistCoverImages(playlist, 4);

                        return (
                            <Link
                                key={playlist.id}
                                to={`/playlist/${playlist.id}`}
                                className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                            >
                                <div className="grid h-40 w-full grid-cols-2 grid-rows-2 overflow-hidden rounded-xl bg-zinc-800">
                                    {coverImages.length > 0 ? (
                                        <>
                                            {coverImages.map((image, index) => (
                                                <img
                                                    key={`${playlist.id}-${index}`}
                                                    src={image}
                                                    alt={playlist.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ))}
                                            {Array.from({ length: Math.max(0, 4 - coverImages.length) }).map((_, index) => (
                                                <div
                                                    key={`${playlist.id}-empty-${index}`}
                                                    className="flex h-full w-full items-center justify-center bg-zinc-700 text-zinc-500"
                                                >
                                                    <i className="ri-music-2-line"></i>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="col-span-2 row-span-2 flex items-center justify-center text-zinc-500">
                                            <i className="ri-music-2-line text-5xl"></i>
                                        </div>
                                    )}
                                </div>

                                <h3 className="mt-3 truncate text-lg font-semibold">{playlist.name}</h3>
                                <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                                    {playlist.description || "No description"}
                                </p>
                                <p className="mt-3 text-sm text-zinc-300">
                                    {formatTrackCount(playlist.songCount || playlist.tracks?.length || 0)} • {formatPlaylistDuration(playlist.tracks || [])}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PlaylistList;
