import React, { useEffect } from "react";
import Feed from "@/shared/components/common/Feed";

const Home = () => {

    useEffect(() => {
        document.title = "Spotify - Web player: Music for everyone";
    }, []);

    return <Feed />;
};

export default Home;