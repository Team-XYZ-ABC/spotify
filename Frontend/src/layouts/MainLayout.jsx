import React, { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen flex-col gap-4 overflow-hidden bg-zinc-950 p-3">
            <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="relative flex min-h-0 flex-1 gap-3">

                <Sidebar
                    isOpen={isSidebarOpen}
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed((prev) => !prev)}
                    closeSidebar={() => setIsSidebarOpen(false)}
                />

                <div className="min-h-0 min-w-0 flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
