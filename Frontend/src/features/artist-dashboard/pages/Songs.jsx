import React, { useEffect, useMemo, useState } from "react";
import { useTrack } from "@/features/track/hooks/useTrack";
import usePlayer from "@/features/player/hooks/usePlayer";
import UploadSongForm from "@/shared/components/ui/UploadSongForm";
import api from "@/shared/config/axios.config";

const formatDuration = (seconds = 0) => {
    const s = Number.isFinite(Number(seconds)) ? Math.max(0, Math.floor(Number(seconds))) : 0;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
};

const StatusBadge = ({ status, progress }) => {
    if (!status || status === "ready") {
        return (
            <span className="inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-300 px-2 py-0.5 text-[10px] font-semibold">
                Ready
            </span>
        );
    }
    if (status === "failed") {
        return (
            <span className="inline-flex items-center rounded-full bg-rose-500/15 text-rose-300 px-2 py-0.5 text-[10px] font-semibold">
                Failed
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-300 px-2 py-0.5 text-[10px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" />
            {status === "uploading_chunks" ? "Publishing" : status}
            {typeof progress === "number" ? ` ${progress}%` : ""}
        </span>
    );
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

    // Live progress for any song still in flight (subscribe via SSE per song,
    // with polling fallback for environments where EventSource is blocked).
    useEffect(() => {
        const inflight = songs.filter(
            (s) => s.status && s.status !== "ready" && s.status !== "failed"
        );
        if (inflight.length === 0) return;

        const base =
            import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

        const applyUpdate = (songId, data) => {
            setSongs((prev) =>
                prev.map((row) =>
                    String(row.id || row._id) === songId
                        ? {
                            ...row,
                            status: data.status,
                            progress: data.progress,
                            statusMessage: data.statusMessage,
                            hls: data.hls || row.hls,
                        }
                        : row
                )
            );
        };

        const subscriptions = inflight.map((s) => {
            const songId = String(s.id || s._id);
            let stopped = false;
            let pollTimer = null;

            const startPolling = () => {
                if (pollTimer) return;
                pollTimer = setInterval(async () => {
                    if (stopped) return clearInterval(pollTimer);
                    try {
                        const res = await api.get(`/songs/status/${songId}`);
                        const data = res.data?.data || res.data;
                        applyUpdate(songId, data);
                        if (data.status === "ready" || data.status === "failed") {
                            stopped = true;
                            clearInterval(pollTimer);
                        }
                    } catch {
                        /* keep trying */
                    }
                }, 2000);
            };

            let es;
            try {
                es = new EventSource(`${base}/songs/progress/${songId}`, {
                    withCredentials: true,
                });
                es.onmessage = (ev) => {
                    try {
                        const data = JSON.parse(ev.data);
                        applyUpdate(songId, data);
                        if (data.status === "ready" || data.status === "failed") {
                            stopped = true;
                            es.close();
                        }
                    } catch { /* ignore */ }
                };
                es.onerror = () => {
                    if (es.readyState === EventSource.CLOSED) startPolling();
                };
            } catch {
                startPolling();
            }

            return () => {
                stopped = true;
                if (es) es.close();
                if (pollTimer) clearInterval(pollTimer);
            };
        });

        return () => subscriptions.forEach((stop) => stop());
    }, [songs.map((s) => `${s.id}:${s.status}`).join("|")]);

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
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={song.status} progress={song.progress} />
                                </div>
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
