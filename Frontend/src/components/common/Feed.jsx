import React, { useRef, useState, useEffect } from "react";
import Footer from "./Footer";
import TopFilters from "../music/trackCard/TopFilters";
import SectionRow from "../music/trackCard/SectionRow";
import { sectionsData } from "../../data/SectionsHomeTrack";
import TrackPlayerBar from "../music/trackCard/TrackPlayerBar";

const Feed = () => {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const allTracks = sectionsData.flatMap(section => section.items);
  const [playlist, setPlaylist] = useState(allTracks);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); 

  useEffect(() => {
    if (shuffleEnabled && currentTrack) {
      const newOrder = [...allTracks];
      for (let i = newOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
      }
      setPlaylist(newOrder);
    } else {
      setPlaylist(allTracks);
    }
  }, [shuffleEnabled]);

  const getCurrentIndex = () => {
    return playlist.findIndex(track => track.id === currentTrack?.id);
  };

  const playNext = () => {
    if (!currentTrack) return;
    const currentIndex = getCurrentIndex();
    let nextIndex = currentIndex + 1;
    if (repeatMode === "one") {
      playTrack(currentTrack);
      return;
    }
    if (nextIndex >= playlist.length) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }
    }
    const nextTrack = playlist[nextIndex];
    if (nextTrack) playTrack(nextTrack);
  };

  const playPrevious = () => {
    if (!currentTrack) return;
    const currentIndex = getCurrentIndex();
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if (repeatMode === "all") {
        prevIndex = playlist.length - 1;
      } else {
        prevIndex = 0;
      }
    }
    const prevTrack = playlist[prevIndex];
    if (prevTrack) playTrack(prevTrack);
  };

  const playTrack = (track) => {
    const audio = audioRef.current;
    if (currentTrack?.id === track.id) {
      if (!audio.paused) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    audio.pause();
    audio.src = track.audioUrl;
    audio.load();
    audio.play().catch(err => console.warn("Play error:", err));
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTrackEnd = () => {
    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("ended", handleTrackEnd);
    return () => {
      audio.removeEventListener("ended", handleTrackEnd);
    };
  }, [currentTrack, repeatMode, playlist]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.src = "";
    };
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto bg-linear-to-b from-[#1f1f1f] via-[#121212] to-[#121212] rounded-lg">
      <div className="flex flex-col gap-10 px-6 py-5 pb-28">
        <TopFilters />
        {sectionsData.map((section) => (
          <SectionRow
            key={section.id}
            title={section.title}
            items={section.items}
            type={section.type}
            onPlay={playTrack}
          />
        ))}
        <div className="h-20" />
      </div>
      <Footer />
      {currentTrack && (
        <TrackPlayerBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={playNext}
          onPrevious={playPrevious}
          onShuffleToggle={() => setShuffleEnabled(!shuffleEnabled)}
          onRepeatToggle={() => {
            const modes = ["off", "one", "all"];
            const nextMode = modes[(modes.indexOf(repeatMode) + 1) % 3];
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

export default Feed;