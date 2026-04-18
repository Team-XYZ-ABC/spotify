import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import usePlaylists from "../../hooks/usePlaylists";
import { formatTrackCount, getPlaylistCoverImages } from "../../utils/playlist";

const Sidebar = ({
  isOpen,
  isCollapsed,
  toggleCollapse,
  closeSidebar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playlists, createPlaylist, loadPlaylists } = usePlaylists();

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  const handleCreatePlaylist = async () => {
    try {
      const playlist = await createPlaylist({
        name: `My Playlist #${playlists.length + 1}`,
        description: "Made for the songs you have not added yet.",
      });

      navigate(`/playlist/${playlist.id}`);
      closeSidebar?.();
    } catch {
      // Errors are tracked in Redux state.
    }
  };

  const handlePlaylistOpen = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
    closeSidebar?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 z-50 flex h-dvh flex-col overflow-hidden rounded-lg bg-[#121212] text-white
          md:static md:h-full md:shrink-0
          transition-transform duration-300 ease-out

          ${isCollapsed ? "md:w-16" : "md:w-[26%] lg:w-[20%] xl:w-[18%]"}
          w-[85%] sm:w-[70%]

          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex min-h-16 items-center justify-between px-4 py-4">
          {!isCollapsed && (
            <h2 className="text-sm font-semibold text-gray-300 whitespace-nowrap">
              Your Library
            </h2>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleCollapse}
              className="hidden md:flex bg-[#1f1f1f] h-8 w-8 items-center justify-center rounded-full hover:bg-[#2a2a2a]"
            >
              <i
                className={`ri-${isCollapsed
                  ? "arrow-right-double-line"
                  : "arrow-left-double-line"
                  }`}
              />
            </button>

            <button
              onClick={closeSidebar}
              className="md:hidden bg-[#1f1f1f] h-8 w-8 flex items-center justify-center rounded-full"
            >
              <i className="ri-close-line" />
            </button>

            {!isCollapsed && (
              <button
                onClick={handleCreatePlaylist}
                className="bg-[#1f1f1f] h-8 w-8 rounded-full hover:bg-[#2a2a2a] flex items-center justify-center"
              >
                +
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-2">
          {!isCollapsed ? (
            <>
              <div className="px-2 pt-1">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <button className="rounded-full bg-[#232323] px-3 py-1.5 text-white">
                    Playlists
                  </button>
                  <button className="rounded-full bg-[#181818] px-3 py-1.5 hover:bg-[#232323] transition-colors">
                    Artists
                  </button>
                </div>
              </div>

              <div className="px-2 pt-1 pb-2 flex items-center justify-between text-sm text-gray-400">
                <button className="h-8 w-8 rounded-full hover:bg-[#232323] transition-colors">
                  <i className="ri-search-line"></i>
                </button>
                <span className="flex items-center gap-2">
                  Recents
                  <i className="ri-list-check-2"></i>
                </span>
              </div>

              <div className="space-y-1 pb-4">
                {playlists.map((playlist) => {
                  const coverImages = getPlaylistCoverImages(playlist, 4);
                  const isActive = location.pathname === `/playlist/${playlist.id}`;

                  return (
                    <button
                      key={playlist.id}
                      onClick={() => handlePlaylistOpen(playlist.id)}
                      className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${isActive ? "bg-[#2a2a2a]" : "hover:bg-[#1a1a1a]"
                        }`}
                    >
                      <div
                        className={`h-12 w-12 shrink-0 overflow-hidden rounded-md ${playlist.id === "liked-songs"
                          ? "bg-linear-to-br from-[#4f46e5] to-[#8b5cf6]"
                          : "bg-[#202020]"
                          }`}
                      >
                        {playlist.id === "liked-songs" ? (
                          <div className="flex h-full items-center justify-center text-xl text-white">
                            <i className="ri-heart-fill"></i>
                          </div>
                        ) : coverImages.length > 1 ? (
                          <div className="grid h-full w-full grid-cols-2 grid-rows-2">
                            {coverImages.map((image, index) => (
                              <img
                                key={`${playlist.id}-${index}`}
                                src={image}
                                alt={playlist.name}
                                className="h-full w-full object-cover"
                              />
                            ))}
                            {Array.from({ length: Math.max(0, 4 - coverImages.length) }).map((_, index) => (
                              <div
                                key={`${playlist.id}-empty-${index}`}
                                className="flex h-full w-full items-center justify-center bg-[#2a2a2a] text-xs text-zinc-500"
                              >
                                <i className="ri-music-2-line"></i>
                              </div>
                            ))}
                          </div>
                        ) : coverImages.length === 1 ? (
                          <img
                            src={coverImages[0]}
                            alt={playlist.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl text-zinc-500">
                            <i className="ri-music-2-line"></i>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {playlist.name}
                        </p>
                        <p className="truncate text-xs text-gray-400">
                          {playlist.id === "liked-songs"
                            ? `Playlist • ${formatTrackCount(playlist.tracks.length)}`
                            : `Playlist • ${playlist.owner?.displayName || playlist.owner?.username || "You"}`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-6 mt-6">
              <button
                onClick={handleCreatePlaylist}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1f1f] text-xl"
              >
                <i className="ri-add-line"></i>
              </button>
              <i className="ri-music-2-line text-xl cursor-pointer" />
              <i className="ri-play-list-line text-xl cursor-pointer" />
              <i className="ri-mic-line text-xl cursor-pointer" />
            </div>
          )}
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="px-4 py-4 text-[11px] text-gray-400 space-y-3">
            <div className="flex flex-wrap gap-3">
              <span>Legal</span>
              <span>Privacy</span>
              <span>Cookies</span>
            </div>

            <button
              onClick={handleCreatePlaylist}
              className="mb-3 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Create playlist
            </button>

            <button className="border border-gray-500 px-3 flex items-center gap-2 py-1 rounded-full text-xs hover:border-white">
              <span className="ri-global-line text-lg"></span>
              English
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;