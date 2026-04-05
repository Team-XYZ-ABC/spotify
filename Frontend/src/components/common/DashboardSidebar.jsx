import React, { useState } from "react";
import { NavLink } from "react-router";
import { DashboardTabs } from "../../data/DashboardTabs";

const DashboardSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    transition-all duration-300 overflow-hidden
    w-full
    ${isCollapsed ? "md:w-18" : "md:w-65"}
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-800">
          <div className="flex items-center justify-between w-full">
            {!isCollapsed
              ? <h1 className="text-sm font-semibold">Dashboard</h1>
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
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-900 font-semibold">
            Z
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">Zoro</span>
              <span className="text-xs text-zinc-400">zoro@mail.com</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
