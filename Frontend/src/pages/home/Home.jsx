import React from "react";
import Sidebar from "../../components/common/Sidebar";
import Feed from "../../components/common/Feed";
import Navbar from "../../components/common/Navbar";

const Home = () => {
    return (
        <div className="flex flex-col p-3 gap-4 h-screen w-full bg-zinc-950">
            <Navbar />
            <div className="flex h-full gap-3">
                <Sidebar />
                <Feed />
            </div>
        </div>
    );
};

export default Home;
