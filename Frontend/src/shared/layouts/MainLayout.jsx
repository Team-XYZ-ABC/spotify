import React, { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "@/shared/components/common/Navbar";
import Sidebar from "@/shared/components/common/Sidebar";
import TrackPlayerBar from "@/features/player/components/TrackPlayerBar";
import usePlayer from "@/features/player/hooks/usePlayer";

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const {
        currentTrack,
        isPlaying,
        shuffleEnabled,
        repeatMode,
        audioRef,
        togglePlayPause,
        playNext,
        playPrevious,
        handleShuffleToggle,
        handleRepeatCycle,
    } = usePlayer();

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-zinc-950">
            <div className="px-3 pt-3">
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>

            <div className="relative flex min-h-0 flex-1 gap-3 px-3 py-2 overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed((prev) => !prev)}
                    closeSidebar={() => setIsSidebarOpen(false)}
                />

                <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
                    <Outlet />
                </div>
            </div>

            {/* Global player bar — lives at the bottom of the flex column, never overlaps */}
            {currentTrack && (
                <TrackPlayerBar
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    onPlayPause={togglePlayPause}
                    onNext={playNext}
                    onPrevious={playPrevious}
                    onShuffleToggle={handleShuffleToggle}
                    onRepeatToggle={handleRepeatCycle}
                    shuffleEnabled={shuffleEnabled}
                    repeatMode={repeatMode}
                    audioRef={audioRef}
                />
            )}
        </div>
    );
};

export default MainLayout;

