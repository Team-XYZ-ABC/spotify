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
  const seekingTimeRef = useRef(null);
  const progressBarRef = useRef(null);

  const displayTime = isSeeking && seekingTimeRef.current !== null
    ? seekingTimeRef.current
    : currentTime;

  const progressPercent = duration > 0
    ? Math.min(100, Math.max(0, (displayTime / duration) * 100))
    : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => { if (!isSeeking) setCurrentTime(audio.currentTime); };
    const updateDuration = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const handleVolumeChange = () => {
      setVolume(audio.volume);
      setIsMuted(audio.volume === 0);
    };

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

  const formatTime = (s) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const calcSeekTime = (clientX) => {
    if (!progressBarRef.current || !duration) return null;
    const rect = progressBarRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * duration;
  };

  const handleSeekMouseDown = (e) => {
    e.preventDefault();
    const t = calcSeekTime(e.clientX);
    if (t === null) return;
    seekingTimeRef.current = t;
    setIsSeeking(true);
    setCurrentTime(t);
  };

  // Touch-based seeking (mobile)
  const handleSeekTouchStart = (e) => {
    const t = calcSeekTime(e.touches[0].clientX);
    if (t === null) return;
    seekingTimeRef.current = t;
    setIsSeeking(true);
    setCurrentTime(t);
  };

  useEffect(() => {
    if (!isSeeking) return;
    const onMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const t = calcSeekTime(x);
      if (t === null) return;
      seekingTimeRef.current = t;
      setCurrentTime(t);
    };
    const onUp = (e) => {
      const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const t = calcSeekTime(x);
      if (t !== null) { audioRef.current.currentTime = t; setCurrentTime(t); }
      seekingTimeRef.current = null;
      setIsSeeking(false);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSeeking, duration]);

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    audioRef.current.volume = v;
    setIsMuted(v === 0);
  };

  const toggleMute = () => {
    if (isMuted) { audioRef.current.volume = volume || 0.5; setIsMuted(false); }
    else { audioRef.current.volume = 0; setIsMuted(true); }
  };

  // artist name — PlayerContext stores it as `artist`, sidebar shows `subtitle` as alias
  const artistName = currentTrack.artist || currentTrack.subtitle || "";

  return (
    <div className="w-full bg-[#181818] border-t border-white/10 shrink-0">

      {/* ── Mobile layout (hidden on md+) ─────────────────────────────── */}
      <div className="flex flex-col md:hidden">
        {/* Mini progress bar at very top on mobile */}
        <div
          ref={progressBarRef}
          className="h-0.5 w-full bg-[#3a3a3a] cursor-pointer"
          onMouseDown={handleSeekMouseDown}
          onTouchStart={handleSeekTouchStart}
        >
          <div
            className="h-full bg-[#1ed760] transition-[width]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Track row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <img
            src={currentTrack.image}
            alt={currentTrack.title}
            className="w-12 h-12 rounded object-cover shrink-0 shadow"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${isPlaying ? "text-[#1ed760]" : "text-white"}`}>
              {currentTrack.title}
            </p>
            <p className="text-xs text-[#b3b3b3] truncate">{artistName}</p>
          </div>

          {/* Like */}
          <button className="text-[#b3b3b3] hover:text-white transition p-1" aria-label="Like">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Previous (mobile) */}
          <button
            onClick={onPrevious}
            className="text-white p-1"
            aria-label="Previous"
          >
            <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            onClick={onPlayPause}
            className="bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg hover:scale-105 transition shrink-0"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="h-5 w-5 fill-black" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="ml-0.5 h-5 w-5 fill-black" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next (mobile) */}
          <button
            onClick={onNext}
            className="text-white p-1"
            aria-label="Next"
          >
            <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Desktop layout (hidden below md) ─────────────────────────── */}
      <div className="hidden md:flex items-center justify-between px-4 lg:px-6 py-3 gap-3">

        {/* Left: track info */}
        <div className="flex items-center gap-3 w-[28%] min-w-0">
          <img
            src={currentTrack.image}
            alt={currentTrack.title}
            className="w-14 h-14 rounded object-cover shrink-0 shadow-lg"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-semibold truncate ${isPlaying ? "text-[#1ed760]" : "text-white"}`}>
              {currentTrack.title}
            </p>
            <p className="text-xs text-[#b3b3b3] truncate">{artistName}</p>
          </div>
          <button className="shrink-0 text-[#b3b3b3] hover:text-white transition" aria-label="Like">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Centre: playback controls + seek bar */}
        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl">
          <div className="flex items-center gap-5">
            <button
              onClick={onShuffleToggle}
              className={`transition ${shuffleEnabled ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"}`}
              title="Shuffle"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
              </svg>
            </button>

            <button onClick={onPrevious} className="text-[#b3b3b3] hover:text-white transition" title="Previous">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={onPlayPause}
              className="bg-white rounded-full h-9 w-9 flex items-center justify-center hover:scale-105 transition shadow-lg shrink-0"
            >
              {isPlaying ? (
                <svg className="h-4 w-4 fill-black" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="ml-0.5 h-4 w-4 fill-black" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button onClick={onNext} className="text-[#b3b3b3] hover:text-white transition" title="Next">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
              </svg>
            </button>

            <button
              onClick={onRepeatToggle}
              className={`transition ${repeatMode !== "off" ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"}`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === "one" ? (
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                </svg>
              )}
            </button>
          </div>

          {/* Seek bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[10px] text-[#b3b3b3] w-8 text-right shrink-0">{formatTime(displayTime)}</span>
            <div
              ref={progressBarRef}
              className="relative group flex-1 h-1 bg-[#4d4d4d] rounded-full cursor-pointer select-none"
              onMouseDown={handleSeekMouseDown}
              onTouchStart={handleSeekTouchStart}
            >
              <div
                className={`absolute h-full rounded-full ${isSeeking ? "bg-[#1ed760]" : "bg-white group-hover:bg-[#1ed760]"} transition-colors`}
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className={`absolute w-3 h-3 bg-white rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 shadow ${isSeeking ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                style={{ left: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#b3b3b3] w-8 shrink-0">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: volume + extras */}
        <div className="flex items-center justify-end gap-3 w-[28%]">
          <button onClick={toggleMute} className="text-[#b3b3b3] hover:text-white transition shrink-0">
            {isMuted || volume === 0 ? (
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : volume < 0.5 ? (
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 lg:w-24 h-1 bg-[#4d4d4d] rounded-full appearance-none cursor-pointer accent-white"
          />
          <button
            onClick={() => document.documentElement.requestFullscreen?.()}
            className="text-[#b3b3b3] hover:text-white transition shrink-0 hidden lg:block"
            title="Full screen"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackPlayerBar;
