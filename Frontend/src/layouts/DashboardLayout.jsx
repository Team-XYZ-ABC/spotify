import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/common/DashboardSidebar";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    document.title = "Spotify for Artist - Dashboard";
  }, []);

  return (
    <div className="h-screen w-full bg-zinc-950 text-white flex">
      
      <DashboardSidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      <div
  className={`
    flex-1 min-h-screen overflow-y-auto
    transition-all duration-300
    pt-14 md:pt-0
    ${isCollapsed ? "md:pl-18" : "md:pl-65"}
  `}
>
  <Outlet />
</div>
    </div>
  );
};

export default DashboardLayout;