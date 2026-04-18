import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PlaylistHeader from "../../components/Playlist/PlaylistHeader";
import PlaylistControls from "../../components/Playlist/PlaylistControls";
import SongsTable from "../../components/Playlist/SongsTable";
import MobileSongsList from "../../components/Playlist/MobileSongsList";
import Footer from "../../components/common/Footer";
import usePlaylists from "../../hooks/usePlaylists";
import { formatPlaylistDuration, formatTrackCount } from "../../utils/playlist";
import CreatePlaylistModal from "../../components/Playlist/modals/CreatePlaylistModal";
import EditPlaylistModal from "../../components/Playlist/modals/EditPlaylistModal";
import CollaboratorManagementModal from "../../components/Playlist/modals/CollaboratorManagementModal";

const Playlist = () => {
    const navigate = useNavigate();
    const { playlistId } = useParams();
    const searchSectionRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCollaboratorOpen, setIsCollaboratorOpen] = useState(false);

    const {
        playlists,
        activePlaylist,
        trackSuggestions,
        collaboratorSearchResults,
        loading,
        isFetchingDetails,
        trackSearchLoading,
        collaboratorSearchLoading,
        error,
        loadPlaylists,
        loadPlaylistById,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addCollaborators,
        removeCollaborator,
        searchCollaborators,
        searchTracks,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        getPlaylistById,
        reorderTracks,
        clearSuggestions,
        clearError,
    } = usePlaylists();

    const playlist = useMemo(() => {
        if (!playlistId) return null;
        if (activePlaylist?.id === playlistId) return activePlaylist;
        return getPlaylistById(playlistId);
    }, [activePlaylist, getPlaylistById, playlistId]);

    const canManagePlaylist = Boolean(playlist?.permissions?.isOwner);
    const canModifyTracks = Boolean(
        playlist?.permissions?.isOwner || playlist?.permissions?.isCollaborator
    );
    const isEmpty = !playlist || playlist.tracks.length === 0;

    useEffect(() => {
        loadPlaylists();
    }, [loadPlaylists]);

    useEffect(() => {
        if (playlistId) {
            loadPlaylistById(playlistId);
        }
    }, [loadPlaylistById, playlistId]);

    useEffect(() => {
        if (!playlistId && playlists.length > 0) {
            navigate(`/playlist/${playlists[0].id}`, { replace: true });
        }
    }, [navigate, playlistId, playlists]);

    useEffect(() => {
        if (playlist) {
            document.title = `${playlist.name} - Spotify`;
        }
    }, [playlist]);

    useEffect(() => {
        if (!playlist) return;

        if (!searchQuery.trim()) {
            clearSuggestions();
            return;
        }

        const timeout = setTimeout(() => {
            searchTracks(searchQuery, playlist.id);
        }, 250);

        return () => clearTimeout(timeout);
    }, [clearSuggestions, playlist, searchQuery, searchTracks]);

    if (!playlist) {
        if (loading || isFetchingDetails) {
            return (
                <div className="flex-1 min-w-0 h-[calc(100vh-88px)] overflow-y-auto rounded-lg bg-black text-white no-scrollbar p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-44 rounded-xl bg-zinc-800"></div>
                        <div className="h-8 w-2/3 rounded bg-zinc-800"></div>
                        <div className="h-8 w-1/2 rounded bg-zinc-800"></div>
                    </div>
                </div>
            );
        }

        return null;
    }

    const handleCreatePlaylist = async (payload) => {
        const nextPlaylist = await createPlaylist(payload);
        setIsCreateOpen(false);
        navigate(`/playlist/${nextPlaylist.id}`);
    };

    const handleUpdatePlaylist = async (payload) => {
        await updatePlaylist(playlist.id, payload);
        setIsEditOpen(false);
    };

    const handleDeletePlaylist = async () => {
        const confirmed = window.confirm(
            `Delete "${playlist.name}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        await deletePlaylist(playlist.id);

        const nextPlaylist = playlists.find((item) => item.id !== playlist.id);
        if (nextPlaylist) {
            navigate(`/playlist/${nextPlaylist.id}`, { replace: true });
            return;
        }

        navigate("/playlists", { replace: true });
    };

    const handleFindSongs = () => {
        searchSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleAddCollaborators = async (collaboratorIds) => {
        await addCollaborators(playlist.id, collaboratorIds);
    };

    const handleRemoveCollaborator = async (userId) => {
        await removeCollaborator(playlist.id, userId);
    };

    const handleAddTrack = async (trackId) => {
        await addTrackToPlaylist(playlist.id, trackId);
        if (searchQuery.trim()) {
            await searchTracks(searchQuery, playlist.id);
        }
    };

    const handleRemoveTrack = async (trackId) => {
        await removeTrackFromPlaylist(playlist.id, trackId);
    };

    const handleReorder = async (sourceIndex, destinationIndex) => {
        await reorderTracks(playlist.id, sourceIndex, destinationIndex);
    };

    return (
        <div className="flex-1 min-w-0 h-[calc(100vh-88px)] overflow-y-auto rounded-lg bg-black text-white no-scrollbar">
            <CreatePlaylistModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreatePlaylist}
                isSubmitting={loading}
            />

            <EditPlaylistModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSubmit={handleUpdatePlaylist}
                isSubmitting={loading}
                playlist={playlist}
            />

            <CollaboratorManagementModal
                isOpen={isCollaboratorOpen}
                onClose={() => setIsCollaboratorOpen(false)}
                playlist={playlist}
                searchResults={collaboratorSearchResults}
                isSearching={collaboratorSearchLoading}
                onSearch={searchCollaborators}
                onAddCollaborators={handleAddCollaborators}
                onRemoveCollaborator={handleRemoveCollaborator}
                isSubmitting={loading}
            />

            <PlaylistHeader
                playlist={playlist}
                canManagePlaylist={canManagePlaylist}
                onOpenEdit={() => setIsEditOpen(true)}
                onOpenCollaborators={() => setIsCollaboratorOpen(true)}
            />

            <PlaylistControls
                isEmpty={isEmpty}
                canManagePlaylist={canManagePlaylist}
                canModifyTracks={canModifyTracks}
                onFindSongs={handleFindSongs}
                onCreatePlaylist={() => setIsCreateOpen(true)}
                onOpenCollaborators={() => setIsCollaboratorOpen(true)}
                onDeletePlaylist={handleDeletePlaylist}
            />

            {error && (
                <div className="px-4 sm:px-6 lg:px-8 pb-4">
                    <div className="flex items-center justify-between rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        <span>{error}</span>
                        <button onClick={clearError} className="text-rose-100">
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop Table */}
            {!isEmpty && (
                <>
                    <div className="hidden md:block">
                        <SongsTable
                            songs={playlist.tracks}
                            canModifyTracks={canModifyTracks}
                            onRemoveTrack={handleRemoveTrack}
                            onReorder={handleReorder}
                        />
                    </div>

                    {/* Mobile List */}
                    <div className="block md:hidden">
                        <MobileSongsList
                            songs={playlist.tracks}
                            canModifyTracks={canModifyTracks}
                            onRemoveTrack={handleRemoveTrack}
                        />
                    </div>
                </>
            )}

            <section ref={searchSectionRef} className="px-4 sm:px-6 lg:px-8 pb-10 pt-2 sm:pt-4">
                <div className="rounded-3xl border border-white/8 bg-[linear-gradient(180deg,#181818,#111111)] p-5 sm:p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                                {isEmpty ? "Build your playlist" : "Recommended tracks"}
                            </p>
                            <h2 className="mt-2 text-2xl sm:text-3xl font-bold">
                                {isEmpty
                                    ? "Let's find something for your playlist"
                                    : "Keep this playlist moving"}
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm sm:text-base text-zinc-400">
                                Search the catalog, add songs instantly, and shape the playlist the way Spotify users expect on desktop, tablet, and mobile.
                            </p>
                        </div>

                        <div className="grid gap-2 text-sm text-zinc-400 sm:grid-cols-2 lg:min-w-[320px]">
                            <div className="rounded-2xl bg-white/5 px-4 py-3">
                                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Tracks</p>
                                <p className="mt-1 text-lg font-semibold text-white">
                                    {formatTrackCount(playlist.tracks.length)}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/5 px-4 py-3">
                                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Duration</p>
                                <p className="mt-1 text-lg font-semibold text-white">
                                    {formatPlaylistDuration(playlist.tracks)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex-1 rounded-full border border-white/10 bg-[#2a2a2a] px-4 py-3 text-sm text-white focus-within:border-white/30">
                            <div className="flex items-center gap-3">
                                <i className="ri-search-line text-lg text-zinc-400"></i>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search for songs or episodes"
                                    className="w-full bg-transparent outline-none placeholder:text-zinc-500"
                                    disabled={!canModifyTracks}
                                />
                            </div>
                        </div>

                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="self-start rounded-full border border-white/10 px-4 py-3 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="mt-6 space-y-3">
                        {trackSearchLoading ? (
                            <div className="rounded-2xl border border-white/10 px-4 py-8 text-center text-zinc-400">
                                Searching songs...
                            </div>
                        ) : trackSuggestions.length > 0 ? (
                            trackSuggestions.map((track) => (
                                <div
                                    key={track.id}
                                    className="flex flex-col gap-4 rounded-2xl border border-white/6 bg-white/3 px-4 py-4 transition hover:border-white/12 hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <img
                                            src={track.image}
                                            alt={track.title}
                                            className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-cover"
                                        />

                                        <div className="min-w-0">
                                            <h3 className="truncate text-base sm:text-lg font-semibold text-white">
                                                {track.title}
                                            </h3>
                                            <p className="truncate text-sm text-zinc-400">
                                                {track.artist}
                                            </p>
                                            <p className="truncate text-xs uppercase tracking-[0.18em] text-zinc-500">
                                                {track.album}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                                        <span className="text-sm text-zinc-400">{track.duration}</span>
                                        <button
                                            onClick={() => handleAddTrack(track.id)}
                                            disabled={!canModifyTracks}
                                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-zinc-400">
                                {searchQuery
                                    ? "No songs found for this query."
                                    : "Start typing to search songs and add them to this playlist."}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Playlist;
