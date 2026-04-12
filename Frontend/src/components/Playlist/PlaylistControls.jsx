import React from "react";

const PlaylistControls = () => {
    return (
        <div className="px-6 md:px-8 py-6 bg-black flex items-center justify-between">

            {/* Left */}
            <div className="flex items-center gap-6">

                {/* Mobile Icons */}
                <div className="md:hidden flex items-center gap-6 text-4xl text-gray-300">
                    <button className="text-green-500">
                        <i className="ri-heart-fill"></i>
                    </button>

                    <button>
                        <i className="ri-share-forward-line"></i>
                    </button>

                    <button>
                        <i className="ri-more-fill"></i>
                    </button>
                </div>

                {/* Desktop Play */}
                <button className="hidden md:flex w-16 h-16 rounded-full bg-green-500 text-black text-3xl items-center justify-center">
                    <i className="ri-play-fill ml-1"></i>
                </button>
            </div>

            {/* Mobile Play */}
            <button className="md:hidden w-20 h-20 rounded-full bg-green-500 text-black text-4xl flex items-center justify-center">
                <i className="ri-play-fill ml-1"></i>
            </button>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-6 text-4xl text-gray-300">
                <button><i className="ri-shuffle-line"></i></button>
                <button><i className="ri-download-2-line"></i></button>
                <button><i className="ri-user-add-line"></i></button>
                <button><i className="ri-more-fill"></i></button>
            </div>
        </div>
    );
};

export default PlaylistControls;