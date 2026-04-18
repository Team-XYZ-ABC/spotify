import React, { useState } from "react";
import { NavLink } from "react-router";
import { DashboardTabs } from "../../data/DashboardTabs";
import { useSelector } from "react-redux";

const DashboardSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {user} = useSelector((state) => state.user);
  console.log(user)

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="md:hidden justify-between fixed top-0 left-0 w-full h-14 flex items-center px-4 z-30">
        <button onClick={() => setIsSidebarOpen(true)}>
          <i className="ri-menu-line text-2xl"></i>
        </button>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-900 text-sm font-medium">
          Z
        </div>
      </div>

      <aside
        className={`
    fixed top-0 left-0 z-50 h-screen
    bg-[#0f0f0f] text-white flex flex-col
     overflow-hidden
    w-full
    ${isCollapsed ? "md:w-18" : "md:w-65"}
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-800">
          <div className="flex items-center justify-between w-full">
            {!isCollapsed
              ? (
                <div className="flex items-end gap-1 ">
                  <img
                    src="/img/2024-spotify-full-logo/Spotify_Full_Logo_RGB_Green.png"
                    alt="Spotify"
                    className="h-8 object-contain transition-all ease-out duration-400"
                  />
                  <span className="text-xs mb-1">for Artists</span>
                </div>
              )
              : <div className="w-6" />}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-md hover:bg-zinc-800"
              >
                <i className="ri-menu-line text-lg"></i>
              </button>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-zinc-800"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {DashboardTabs.map((tab, i) => (
            <NavLink
              key={i}
              to={tab.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 h-11 rounded-lg transition
                ${
                  isActive
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
            >
              <div
                className={`w-6 flex ${
                  isCollapsed ? "justify-center w-full" : "justify-center"
                }`}
              >
                <i className={`${tab.icon}`}></i>
              </div>

              {(!isCollapsed || isSidebarOpen) && (
                <span className="text-sm truncate">{tab.label}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800 flex items-center gap-3">
          <div
            className="h-9 w-9 md:h-10 md:w-10 flex items-center overflow-hidden justify-center rounded-full bg-zinc-800 font-semibold cursor-pointer text-sm md:text-base"
          >
            {user?.avatar
              ? (
                <img
                  className="h-full w-full object-cover"
                  src={user?.avatar}
                />
              )
              : <h1 className="">{user?.username.toUpperCase()[0]}</h1>}
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.displayName}</span>
              <span className="text-xs text-zinc-400">{user?.email}</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
