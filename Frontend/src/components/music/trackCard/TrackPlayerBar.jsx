import React, { useState, useEffect, useRef } from "react";

const TrackPlayerBar = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffleToggle,
  onRepeatToggle,
  shuffleEnabled,
  repeatMode,
  audioRef,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const progressBarRef = useRef(null);

  const progressPercent = duration > 0
    ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
    : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime);
    };
    const updateDuration = () => {
      const nextDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
      setDuration(nextDuration);
    };
    const handleVolumeChange = () => {
      setVolume(audio.volume);
      setIsMuted(audio.volume === 0);
    };

    // Initial sync in case metadata was loaded before listeners attached.
    setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
    updateDuration();
    handleVolumeChange();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("loadeddata", updateDuration);
    audio.addEventListener("volumechange", handleVolumeChange);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("loadeddata", updateDuration);
      audio.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [audioRef, isSeeking, currentTrack?.id]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSeek = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(1, Math.max(0, x / rect.width));
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const getRepeatIcon = () => {
    if (repeatMode === "one") return <i className="ri-repeat-one-line text-xl cursor-pointer"></i>;
    if (repeatMode === "all") return <i className="ri-repeat-2-line text-xl cursor-pointer"></i>;
    return <i className="ri-repeat-line text-xl cursor-pointer"></i>;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black shadow-2xl">
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-8 py-4 gap-4">
          <div className="flex items-center gap-3 w-1/5 min-w-45">
            <img
              src={currentTrack.image}
              alt={currentTrack.title}
              className="w-18 h-18 shadow-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate text-sm">
                {currentTrack.title}
              </div>
              <div className="text-xs text-[#b3b3b3] truncate">
                {currentTrack.subtitle}
              </div>
            </div>
            <button
              onClick={() => console.log("Add to playlist", currentTrack)}
              className="text-[#b3b3b3] cursor-pointer hover:text-white transition p-1"
              title="Add to playlist"
            >
              <i className="ri-add-circle-line text-lg"></i>
            </button>
          </div>

          <div className="flex flex-col items-center gap-2 w-[40%]">
            <div className="flex items-center gap-8">
              <button
                onClick={onShuffleToggle}
                className={`transition ${shuffleEnabled ? "text-green-500" : "text-[#b3b3b3] hover:text-white"
                  }`}
                title="Shuffle"
              >
                <i className="cursor-pointer ri-shuffle-line text-xl"></i>
              </button>
              <button
                onClick={onPrevious}
                className="text-[#b3b3b3] hover:text-white transition"
                title="Previous"
              >
                <i className="cursor-pointer ri-skip-back-fill text-xl"></i>
              </button>
              <button
                onClick={onPlayPause}
                className="bg-white rounded-full h-12 w-12 flex items-center justify-center hover:scale-105 transition shadow-lg"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <i className="cursor-pointer ri-pause-fill text-2xl font-bold"></i>
                ) : (
                  <i className="cursor-pointer ri-play-fill text-2xl font-bold"></i>
                )}
              </button>
              <button
                onClick={onNext}
                className="text-[#b3b3b3] hover:text-white transition"
                title="Next"
              >
                <i className="cursor-pointer ri-skip-forward-fill text-xl"></i>
              </button>
              <button
                onClick={onRepeatToggle}
                className={`transition ${repeatMode !== "off" ? "text-green-500" : "text-[#b3b3b3] hover:text-white"
                  }`}
                title={`Repeat ${repeatMode === "one" ? "one" : repeatMode === "all" ? "all" : "off"}`}
              >
                <span className="text-base">{getRepeatIcon()}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full min-w-75">
              <span className="text-xs text-[#b3b3b3]">{formatTime(currentTime)}</span>
              <div
                ref={progressBarRef}
                className="relative group flex-1 h-1 bg-[#4d4d4d] rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="absolute h-full bg-white rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
                <div
                  className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 top-1/2 -translate-y-1/2"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs text-[#b3b3b3]">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 min-w-45">
            <button
              onClick={() => console.log("Lyrics")}
              className="text-[#b3b3b3] cursor-pointer hover:text-white transition"
              title="Lyrics"
            >
              <i className="ri-file-music-line text-xl "></i>
            </button>
            <button
              onClick={() => console.log("Queue")}
              className="cursor-pointer text-[#b3b3b3] hover:text-white transition"
              title="Queue"
            >
              <i className="ri-play-list-2-line text-xl"></i>
            </button>
            <button
              onClick={() => console.log("Connect to device")}
              className="text-[#b3b3b3] cursor-pointer hover:text-white transition"
              title="Connect to a device"
            >
              <i className="ri-device-line text-xl"></i>
            </button>

            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="cursor-pointer text-[#b3b3b3] hover:text-white">
                {isMuted || volume === 0 ? (
                  <i className="ri-volume-mute-line text-xl"></i>
                ) : (
                  <i className="ri-volume-down-line text-xl"></i>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-[#4d4d4d] rounded-full appearance-none cursor-pointer accent-white"
              />
            </div>

            <button
              onClick={() => console.log("Miniplayer")}
              className="text-[#b3b3b3] hover:text-white transition"
              title="Open miniplayer"
            >
              <i className="ri-picture-in-picture-fill text-xl cursor-pointer"></i>
            </button>
            <button
              onClick={() => document.documentElement.requestFullscreen()}
              className="text-[#b3b3b3] hover:text-white transition"
              title="Enter full screen"
            >
              <i className="ri-fullscreen-line text-xl cursor-pointer"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPlayerBar;