import React, { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex flex-col p-3 gap-4 h-screen bg-zinc-950">
            <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-1 gap-3 relative">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <Sidebar
                    isOpen={isSidebarOpen}
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed((prev) => !prev)}
                />

                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
