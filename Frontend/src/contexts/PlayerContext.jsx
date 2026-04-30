import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    cycleRepeat,
    loadTrack,
    setPlaying,
    setQueueIndex,
    toggleShuffle,
} from "../redux/slices/player.slice";
import { getStreamUrlService } from "../services/track.service";

const PlayerContext = createContext(null);

/**
 * Normalize any track shape (home feed, playlist, artist songs)
 * into a single consistent format the player understands.
 */
const normalizeTrack = (track) => ({
    id: String(track._id?.$oid || track._id || track.id || ""),
    title: track.title || "Unknown",
    artist:
        track.artist ||
        (Array.isArray(track.artists) ? track.artists.join(", ") : "") ||
        track.subtitle ||
        "Unknown artist",
    image: track.image || track.coverImage || "",
    // audioUrl is present for static/demo tracks; null means we must fetch a presigned URL
    audioUrl: track.audioUrl ?? null,
    duration: track.duration || "0:00",
    durationSeconds: track.durationSeconds || track.duration_seconds || 0,
});

export const PlayerProvider = ({ children }) => {
    const dispatch = useDispatch();

    // Keep a mutable ref that always holds the latest Redux player state.
    // This prevents stale-closure bugs in event handlers.
    const playerStateRef = useRef({
        queue: [],
        queueIndex: -1,
        repeatMode: "off",
        shuffleEnabled: false,
        currentTrack: null,
        isPlaying: false,
    });

    const playerState = useSelector((s) => s.player);

    useEffect(() => {
        playerStateRef.current = playerState;
    });

    // Single Audio element — lives for the entire app session
    const audioRef = useRef(new Audio());

    // ─── Core: load a URL into the audio element and play ───────────────
    const loadAndPlay = useCallback(
        async (track) => {
            const audio = audioRef.current;
            audio.pause();
            audio.src = "";

            let src = track.audioUrl;

            // Real backend tracks: fetch a short-lived presigned URL
            if (!src && track.id) {
                try {
                    const { streamUrl } = await getStreamUrlService(track.id);
                    src = streamUrl;
                } catch (err) {
                    console.error("[Player] Failed to get stream URL:", err);
                    dispatch(setPlaying(false));
                    return;
                }
            }

            if (!src) {
                console.warn("[Player] No audio source available for track:", track.id);
                dispatch(setPlaying(false));
                return;
            }

            audio.src = src;
            audio.load();

            try {
                await audio.play();
                dispatch(setPlaying(true));
            } catch (err) {
                // Autoplay blocked or other media error
                console.warn("[Player] Playback error:", err);
                dispatch(setPlaying(false));
            }
        },
        [dispatch]
    );

    // ─── Play a track with optional queue context ────────────────────────
    const playTrack = useCallback(
        (track, queue = [], startIndex = 0) => {
            const normalized = normalizeTrack(track);
            const normalizedQueue = queue.length
                ? queue.map(normalizeTrack)
                : [normalized];

            dispatch(
                loadTrack({
                    track: normalized,
                    queue: normalizedQueue,
                    index: startIndex,
                })
            );

            loadAndPlay(normalized);
        },
        [dispatch, loadAndPlay]
    );

    // ─── Toggle play / pause ─────────────────────────────────────────────
    const togglePlayPause = useCallback(() => {
        const audio = audioRef.current;
        const { currentTrack } = playerStateRef.current;
        if (!currentTrack) return;

        if (audio.paused) {
            audio
                .play()
                .then(() => dispatch(setPlaying(true)))
                .catch(() => { });
        } else {
            audio.pause();
            dispatch(setPlaying(false));
        }
    }, [dispatch]);

    // ─── Next track ──────────────────────────────────────────────────────
    const playNext = useCallback(() => {
        const { queue, queueIndex, repeatMode, shuffleEnabled } =
            playerStateRef.current;

        if (!queue.length) return;

        if (repeatMode === "one") {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
            return;
        }

        let nextIndex;
        if (shuffleEnabled) {
            // pick a random index that isn't the current one
            do {
                nextIndex = Math.floor(Math.random() * queue.length);
            } while (queue.length > 1 && nextIndex === queueIndex);
        } else {
            nextIndex = queueIndex + 1;
        }

        if (nextIndex >= queue.length) {
            if (repeatMode === "all") {
                nextIndex = 0;
            } else {
                audioRef.current.pause();
                dispatch(setPlaying(false));
                return;
            }
        }

        const nextTrack = queue[nextIndex];
        dispatch(setQueueIndex(nextIndex));
        loadAndPlay(nextTrack);
    }, [dispatch, loadAndPlay]);

    // ─── Previous track ──────────────────────────────────────────────────
    const playPrevious = useCallback(() => {
        const audio = audioRef.current;

        // If we're more than 3s in, restart current track (Spotify behaviour)
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }

        const { queue, queueIndex, repeatMode } = playerStateRef.current;
        if (!queue.length) return;

        let prevIndex = queueIndex - 1;
        if (prevIndex < 0) {
            prevIndex = repeatMode === "all" ? queue.length - 1 : 0;
        }

        const prevTrack = queue[prevIndex];
        dispatch(setQueueIndex(prevIndex));
        loadAndPlay(prevTrack);
    }, [dispatch, loadAndPlay]);

    // ─── Handle track ended ──────────────────────────────────────────────
    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => playNext();
        audio.addEventListener("ended", handleEnded);
        return () => audio.removeEventListener("ended", handleEnded);
    }, [playNext]);

    // ─── Global keyboard shortcuts ───────────────────────────────────────
    // Space   → play / pause
    // →       → next track
    // ←       → previous track
    // ↑ / ↓   → volume +/- 10%
    // M       → mute toggle
    // S       → shuffle
    // R       → cycle repeat
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore when user is typing in an input / textarea / contenteditable
            const tag = e.target?.tagName;
            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT" ||
                e.target?.isContentEditable
            ) return;

            const audio = audioRef.current;

            switch (e.key) {
                case " ":
                case "Spacebar":
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    playNext();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    playPrevious();
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    audio.volume = Math.min(1, parseFloat((audio.volume + 0.1).toFixed(1)));
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    audio.volume = Math.max(0, parseFloat((audio.volume - 0.1).toFixed(1)));
                    break;
                case "m":
                case "M":
                    audio.muted = !audio.muted;
                    break;
                case "s":
                case "S":
                    dispatch(toggleShuffle());
                    break;
                case "r":
                case "R":
                    dispatch(cycleRepeat());
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [togglePlayPause, playNext, playPrevious, dispatch]);

    const handleShuffleToggle = useCallback(
        () => dispatch(toggleShuffle()),
        [dispatch]
    );

    const handleRepeatCycle = useCallback(
        () => dispatch(cycleRepeat()),
        [dispatch]
    );

    return (
        <PlayerContext.Provider
            value={{
                audioRef,
                playTrack,
                togglePlayPause,
                playNext,
                playPrevious,
                handleShuffleToggle,
                handleRepeatCycle,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayerContext = () => {
    const ctx = useContext(PlayerContext);
    if (!ctx) {
        throw new Error("usePlayerContext must be used inside <PlayerProvider>");
    }
    return ctx;
};
