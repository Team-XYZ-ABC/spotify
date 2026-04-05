import React, { useEffect } from "react";
import DashboardSidebar from "../components/common/DashboardSidebar";
import { Outlet } from "react-router";

const DashboardLayout = () => {

    useEffect(()=>{
        document.title = "Spotify for Artist | Home"
    },[])

    return (
        <div className="h-screen w-full flex bg-zinc-950">
            <DashboardSidebar />
            <Outlet />
        </div>
    );
};

export default DashboardLayout;
