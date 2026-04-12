import React, { useState } from "react";
import PlaylistHeader from "../../components/playlist/PlaylistHeader";
import PlaylistControls from "../../components/playlist/PlaylistControls";
import SongsTable from "../../components/playlist/SongsTable";
import MobileSongsList from "../../components/playlist/MobileSongsList";
import Footer from "../../components/common/Footer";

const Playlist = () => {
    const [songs] = useState([
        {
            id: 1,
            title: "Dost Banke",
            artist: "Gurnazar, Kartik Dev",
            album: "Dost Banke",
            duration: "4:49",
            image: "https://picsum.photos/200?1",
        },
        {
            id: 2,
            title: "Kahani Meri",
            artist: "Manish Sharmaa, Anmol Daniel",
            album: "Kahani Meri",
            duration: "2:19",
            image: "https://picsum.photos/200?2",
        },
        {
            id: 3,
            title: "Allah De Bandeya",
            artist: "B Praak, Jaani",
            album: "Zohrjabeen",
            duration: "4:17",
            image: "https://picsum.photos/200?3",
        },
    ]);

    return (
        <div className="flex-1 h-[calc(100vh-86px)] overflow-y-auto bg-black rounded-lg text-white no-scrollbar">
            <PlaylistHeader />
            <PlaylistControls />

            {/* Desktop Table */}
            <div className="hidden md:block">
                <SongsTable songs={songs} />
            </div>

            {/* Mobile List */}
            <div className="block md:hidden">
                <MobileSongsList songs={songs} />
            </div>

            <Footer />
        </div>
    );
};

export default Playlist;
