import React, { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Feed from "../../components/common/Feed";
import Navbar from "../../components/common/Navbar";

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        document.title = 'Spotify - Web player: Music for everyone'
    }, []);

    return (
        <div className="flex flex-col p-3 gap-4 h-screen w-full bg-zinc-950">
            
            <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex h-full gap-3 relative">
                
                <Sidebar isOpen={isSidebarOpen} />

                <Feed />
            </div>
        </div>
    );
};

export default Home;