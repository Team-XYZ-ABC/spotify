import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTrack } from "../../../hooks/useTrack";
import UploadSongForm from "../../../components/ui/UploadSongForm";
import TrackPlayerBar from "../../../components/music/trackCard/TrackPlayerBar";

const formatDuration = (seconds = 0) => {
    const s = Number.isFinite(Number(seconds)) ? Math.max(0, Math.floor(Number(seconds))) : 0;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
};

const Songs = () => {
    const {
        getMyTracks,
        getStreamUrl,
        updateTrack,
        deleteTrack,
        loading,
    } = useTrack();

    const [songs, setSongs] = useState([]);
    const [pageError, setPageError] = useState("");
    const [showUpload, setShowUpload] = useState(false);
    const [editingSong, setEditingSong] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        artists: "",
        genre: "",
        language: "",
    });

    const audioRef = useRef(new Audio());
    const [currentSongId, setCurrentSongId] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [shuffleEnabled, setShuffleEnabled] = useState(false);
    const [repeatMode, setRepeatMode] = useState("off");

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

    useEffect(() => {
        const audio = audioRef.current;
        const onPause = () => setIsPlaying(false);
        const onPlay = () => setIsPlaying(true);

        audio.addEventListener("pause", onPause);
        audio.addEventListener("play", onPlay);

        return () => {
            audio.pause();
            audio.src = "";
            audio.removeEventListener("pause", onPause);
            audio.removeEventListener("play", onPlay);
        };
    }, []);

    const handlePlaySong = async (song) => {
        const audio = audioRef.current;
        const songId = String(song.id);

        if (currentSongId === songId) {
            if (audio.paused) {
                await audio.play();
            } else {
                audio.pause();
            }
            return;
        }

        try {
            const { streamUrl } = await getStreamUrl(songId);
            if (!streamUrl) {
                throw new Error("Stream URL not available for this song");
            }

            // Show bottom player immediately even if autoplay fails later.
            setCurrentSongId(songId);
            setCurrentTrack({
                id: songId,
                title: song.title,
                subtitle: (song.artists || []).join(", ") || "Unknown Artist",
                image: song.coverImage || "https://picsum.photos/80?music=fallback",
            });

            audio.pause();
            audio.src = streamUrl;
            audio.load();
            await audio.play();
            setIsPlaying(true);
            setPageError("");
        } catch (err) {
            setIsPlaying(false);
            setPageError(err?.message || "Failed to play song");
        }
    };

    const handlePlayPause = async () => {
        const audio = audioRef.current;
        if (!currentSongId) return;

        if (audio.paused) {
            await audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
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
            if (currentSongId === String(songId)) {
                audioRef.current.pause();
                setCurrentSongId(null);
                setCurrentTrack(null);
                setIsPlaying(false);
            }
            await loadSongs();
        } catch (err) {
            setPageError(err?.message || "Failed to delete song");
        }
    };

    const sortedSongs = useMemo(() => {
        return [...songs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [songs]);

    const getCurrentIndex = () => {
        if (!currentSongId) return -1;
        return sortedSongs.findIndex((song) => String(song.id) === String(currentSongId));
    };

    const playAtIndex = async (index) => {
        if (index < 0 || index >= sortedSongs.length) return;
        await handlePlaySong(sortedSongs[index]);
    };

    const playNext = async () => {
        if (!sortedSongs.length) return;

        const currentIndex = getCurrentIndex();

        if (repeatMode === "one" && currentIndex >= 0) {
            audioRef.current.currentTime = 0;
            await audioRef.current.play();
            return;
        }

        if (shuffleEnabled) {
            const randomIndex = Math.floor(Math.random() * sortedSongs.length);
            await playAtIndex(randomIndex);
            return;
        }

        let nextIndex = currentIndex + 1;
        if (nextIndex >= sortedSongs.length) {
            if (repeatMode === "all") {
                nextIndex = 0;
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
                return;
            }
        }

        await playAtIndex(nextIndex);
    };

    const playPrevious = async () => {
        if (!sortedSongs.length) return;

        const currentIndex = getCurrentIndex();

        if (audioRef.current.currentTime > 3 && currentIndex >= 0) {
            audioRef.current.currentTime = 0;
            return;
        }

        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = repeatMode === "all" ? sortedSongs.length - 1 : 0;
        }

        await playAtIndex(prevIndex);
    };

    useEffect(() => {
        const audio = audioRef.current;
        const onEnded = () => {
            if (repeatMode === "one") {
                audio.currentTime = 0;
                audio.play().catch(() => { });
                return;
            }
            playNext();
        };

        audio.addEventListener("ended", onEnded);
        return () => {
            audio.removeEventListener("ended", onEnded);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [repeatMode, shuffleEnabled, sortedSongs, currentSongId]);

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
                    <p className="text-zinc-400 mt-1">Manage uploads, metadata, playback and publishing details.</p>
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
                    const active = currentSongId === String(song.id);
                    return (
                        <div
                            key={song.id}
                            className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-4 border-b border-white/5 hover:bg-white/3"
                        >
                            <div className="md:col-span-1 flex items-center">
                                <button
                                    onClick={() => handlePlaySong(song)}
                                    className="text-lg text-white"
                                    aria-label={active && isPlaying ? "Pause" : "Play"}
                                >
                                    <i className={active && isPlaying ? "ri-pause-fill text-[#1ed760]" : "ri-play-fill"}></i>
                                </button>
                                <span className="ml-3 text-zinc-400 md:hidden">{idx + 1}</span>
                            </div>

                            <div className="md:col-span-4 flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => handlePlaySong(song)}>
                                {song.coverImage ? (
                                    <img src={song.coverImage} alt={song.title} className="h-12 w-12 rounded object-cover" />
                                ) : (
                                    <div className="h-12 w-12 rounded bg-zinc-800 flex items-center justify-center text-zinc-500">
                                        <i className="ri-music-2-line"></i>
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
                                    className="rounded-full border border-white/20 px-3 py-1 text-xs"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(song.id)}
                                    className="rounded-full border border-rose-500/40 text-rose-300 px-3 py-1 text-xs"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}

                {sortedSongs.length === 0 && !loading && (
                    <div className="px-4 py-12 text-center text-zinc-500">No songs uploaded yet.</div>
                )}
            </div>

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

            {currentTrack && (
                <TrackPlayerBar
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    onNext={playNext}
                    onPrevious={playPrevious}
                    onShuffleToggle={() => setShuffleEnabled((prev) => !prev)}
                    onRepeatToggle={() => {
                        const modes = ["off", "all", "one"];
                        const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
                        setRepeatMode(nextMode);
                    }}
                    shuffleEnabled={shuffleEnabled}
                    repeatMode={repeatMode}
                    audioRef={audioRef}
                />
            )}
        </div>
    );
};

export default Songs;
