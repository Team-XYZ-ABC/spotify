import React from "react";
import Sidebar from "../../components/common/Sidebar";
import Feed from "../../components/common/Feed";

const Home = () => {
    return (
        <div className="flex">
            <Sidebar />
            <Feed />
        </div>
    );
};

export default Home;
