import React from "react";

const Sidebar = ({ isOpen, isCollapsed, toggleCollapse, closeSidebar }) => {
  return (
    <>
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <div
        className={`
          bg-[#121212] text-white flex flex-col rounded-lg
          
          fixed md:static top-0 left-0 h-screen md:h-auto
          z-50 transition-all duration-300 ease-in-out
          
          /* Width Handling */
          ${isCollapsed ? "md:w-16" : "md:w-[26%] lg:w-[20%] xl:w-[18%]"}
          w-[85%] sm:w-[70%]
          
          /* Slide animation */
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="px-4 py-4 flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-sm font-semibold text-gray-300">
              Your Library
            </h2>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={toggleCollapse}
              className="hidden md:flex bg-[#1f1f1f] h-8 w-8 items-center justify-center rounded-full hover:bg-[#2a2a2a]"
            >
              <i
                className={`ri-${
                  isCollapsed
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
              <button className="bg-[#1f1f1f] h-8 w-8 rounded-full hover:bg-[#2a2a2a]">
                +
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-3">
          {!isCollapsed
            ? (
              <>
                <div className="bg-[#1f1f1f] p-4 rounded-lg space-y-3 hover:bg-[#2a2a2a] transition">
                  <h3 className="text-sm font-semibold">
                    Create your first playlist
                  </h3>
                  <p className="text-xs text-gray-400">
                    It's easy, we'll help you
                  </p>
                  <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold w-full sm:w-auto">
                    Create playlist
                  </button>
                </div>

                <div className="bg-[#1f1f1f] p-4 rounded-lg space-y-3 hover:bg-[#2a2a2a] transition">
                  <h3 className="text-sm font-semibold">
                    Let's find some podcasts to follow
                  </h3>
                  <p className="text-xs text-gray-400">
                    We'll keep you updated
                  </p>
                  <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold w-full sm:w-auto">
                    Browse podcasts
                  </button>
                </div>
              </>
            )
            : (
              <div className="flex flex-col items-center gap-6 mt-6">
                <i className="ri-music-2-line text-xl cursor-pointer" />
                <i className="ri-play-list-line text-xl cursor-pointer" />
                <i className="ri-mic-line text-xl cursor-pointer" />
              </div>
            )}
        </div>

        {!isCollapsed && (
          <div className="px-4 py-4 text-[11px] text-gray-400 space-y-3">
            <div className="flex flex-wrap gap-3">
              <span>Legal</span>
              <span>Privacy</span>
              <span>Cookies</span>
            </div>

            <button className="border border-gray-500 px-3 flex items-center gap-2 py-1 rounded-full text-xs hover:border-white">
              <span className="ri-global-line text-lg"></span> English
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
