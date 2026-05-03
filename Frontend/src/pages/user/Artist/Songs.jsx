import React, { useEffect, useMemo, useState } from "react";
import { useTrack } from "../../../hooks/useTrack";
import usePlayer from "../../../hooks/usePlayer";
import UploadSongForm from "../../../components/ui/UploadSongForm";

const formatDuration = (seconds = 0) => {
    const s = Number.isFinite(Number(seconds)) ? Math.max(0, Math.floor(Number(seconds))) : 0;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
};

const Songs = () => {
    const { getMyTracks, updateTrack, deleteTrack, loading } = useTrack();
    const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayer();

    const [songs, setSongs] = useState([]);
    const [pageError, setPageError] = useState("");
    const [showUpload, setShowUpload] = useState(false);
    const [editingSong, setEditingSong] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", artists: "", genre: "", language: "" });

    const loadSongs = async () => {
        try {
            setPageError("");
            const res = await getMyTracks();
            setSongs(res?.data || []);
        } catch (err) {
            setPageError(err?.message || "Failed to load songs");
        }
    };

    useEffect(() => {
        loadSongs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sortedSongs = useMemo(
        () => [...songs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        [songs]
    );

    const handlePlaySong = (song) => {
        const songId = String(song._id || song.id);
        if (currentTrack?.id === songId) {
            togglePlayPause();
            return;
        }
        const idx = sortedSongs.findIndex((s) => String(s._id || s.id) === songId);
        playTrack(song, sortedSongs, idx >= 0 ? idx : 0);
    };

    const openEdit = (song) => {
        setEditingSong(song);
        setEditForm({
            title: song.title || "",
            artists: (song.artists || []).join(", "),
            genre: song.genres?.[0] || "",
            language: song.lang || "",
        });
    };

    const handleEditSave = async () => {
        if (!editingSong) return;
        try {
            await updateTrack(editingSong.id, editForm);
            setEditingSong(null);
            await loadSongs();
        } catch (err) {
            setPageError(err?.message || "Failed to update song");
        }
    };

    const handleDelete = async (songId) => {
        const yes = window.confirm("Delete this song? This action cannot be undone.");
        if (!yes) return;
        try {
            await deleteTrack(songId);
            await loadSongs();
        } catch (err) {
            setPageError(err?.message || "Failed to delete song");
        }
    };

    if (showUpload) {
        return (
            <UploadSongForm
                isOpen={showUpload}
                onClose={(v) => {
                    setShowUpload(v);
                    if (!v) loadSongs();
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white px-4 md:px-8 py-8 pb-36">
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Your Songs</h1>
                    <p className="text-zinc-400 mt-1">
                        Manage uploads, metadata, playback and publishing details.
                    </p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="rounded-full bg-[#1ed760] text-black px-5 py-2 font-semibold"
                >
                    Upload Song
                </button>
            </div>

            {pageError && (
                <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-200">
                    {pageError}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
                <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 text-xs uppercase tracking-wider text-zinc-500 border-b border-white/10">
                    <span className="col-span-1">#</span>
                    <span className="col-span-4">Title</span>
                    <span className="col-span-2">Artists</span>
                    <span className="col-span-1">Duration</span>
                    <span className="col-span-2">Metadata</span>
                    <span className="col-span-2 text-right">Actions</span>
                </div>

                {sortedSongs.map((song, idx) => {
                    const songId = String(song._id || song.id);
                    const active = currentTrack?.id === songId;
                    return (
                        <div
                            key={songId}
                            className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-4 border-b border-white/5 hover:bg-white/3"
                        >
                            <div className="md:col-span-1 flex items-center">
                                <button
                                    onClick={() => handlePlaySong(song)}
                                    className="text-lg text-white"
                                    aria-label={active && isPlaying ? "Pause" : "Play"}
                                >
                                    <i className={active && isPlaying ? "ri-pause-fill text-[#1ed760]" : "ri-play-fill"} />
                                </button>
                                <span className="ml-3 text-zinc-400 md:hidden">{idx + 1}</span>
                            </div>

                            <div
                                className="md:col-span-4 flex items-center gap-3 min-w-0 cursor-pointer"
                                onClick={() => handlePlaySong(song)}
                            >
                                {song.coverImage ? (
                                    <img
                                        src={song.coverImage}
                                        alt={song.title}
                                        className="h-12 w-12 rounded object-cover"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded bg-zinc-800 flex items-center justify-center text-zinc-500">
                                        <i className="ri-music-2-line" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate font-medium">{song.title}</p>
                                    <p className="truncate text-xs text-zinc-500">{song.album || "Single"}</p>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex items-center text-sm text-zinc-300">
                                {(song.artists || []).join(", ") || "-"}
                            </div>

                            <div className="md:col-span-1 flex items-center text-sm text-zinc-300">
                                {formatDuration(song.durationSeconds)}
                            </div>

                            <div className="md:col-span-2 text-xs text-zinc-400 space-y-1">
                                <p>Lang: {song.lang || "-"}</p>
                                <p>Genre: {song.genres?.[0] || "-"}</p>
                                <p>ISRC: {song.isrc || "Auto"}</p>
                            </div>

                            <div className="md:col-span-2 flex items-center justify-start md:justify-end gap-2">
                                <button
                                    onClick={() => openEdit(song)}
                                    className="rounded-full border border-white/20 px-3 py-1 text-xs hover:bg-white/5 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(song.id)}
                                    className="rounded-full border border-rose-500/40 text-rose-300 px-3 py-1 text-xs hover:bg-rose-500/10 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}

                {sortedSongs.length === 0 && !loading && (
                    <div className="px-4 py-12 text-center text-zinc-500">
                        No songs uploaded yet.
                    </div>
                )}
            </div>

            {/* Edit modal */}
            {editingSong && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#111] p-5 space-y-4">
                        <h2 className="text-xl font-semibold">Edit Song</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                value={editForm.title}
                                onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                                placeholder="Title"
                                className="rounded-lg bg-[#1a1a1a] px-3 py-2 outline-none"
                            />
                            <input
                                value={editForm.artists}
                                onChange={(e) => setEditForm((p) => ({ ...p, artists: e.target.value }))}
                                placeholder="Artist1, Artist2"
                                className="rounded-lg bg-[#1a1a1a] px-3 py-2 outline-none"
                            />
                            <input
                                value={editForm.genre}
                                onChange={(e) => setEditForm((p) => ({ ...p, genre: e.target.value }))}
                                placeholder="Genre"
                                className="rounded-lg bg-[#1a1a1a] px-3 py-2 outline-none"
                            />
                            <input
                                value={editForm.language}
                                onChange={(e) => setEditForm((p) => ({ ...p, language: e.target.value }))}
                                placeholder="Language"
                                className="rounded-lg bg-[#1a1a1a] px-3 py-2 outline-none"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditingSong(null)}
                                className="rounded-full border border-white/20 px-4 py-2 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="rounded-full bg-[#1ed760] text-black px-4 py-2 text-sm font-semibold"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Songs;
