import { useSelector } from "react-redux";
import { usePlayerContext } from "../contexts/PlayerContext";

/**
 * Unified hook for reading player state (from Redux)
 * and calling playback controls (from PlayerContext).
 */
const usePlayer = () => {
    const { currentTrack, isPlaying, shuffleEnabled, repeatMode, queue, queueIndex } =
        useSelector((s) => s.player);

    const {
        audioRef,
        playTrack,
        togglePlayPause,
        playNext,
        playPrevious,
        handleShuffleToggle,
        handleRepeatCycle,
    } = usePlayerContext();

    return {
        currentTrack,
        isPlaying,
        shuffleEnabled,
        repeatMode,
        queue,
        queueIndex,
        audioRef,
        playTrack,
        togglePlayPause,
        playNext,
        playPrevious,
        handleShuffleToggle,
        handleRepeatCycle,
    };
};

export default usePlayer;
