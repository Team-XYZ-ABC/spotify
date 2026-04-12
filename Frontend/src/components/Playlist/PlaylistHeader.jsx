import React from "react";

const PlaylistHeader = () => {
    return (
        <div className="bg-gradient-to-b from-[#5b0014] to-black px-6 md:px-8 pt-6 md:pt-8 pb-8">

            {/* Mobile Back Arrow */}
            <div className="md:hidden mb-6 text-3xl text-gray-300">
                <i className="ri-arrow-left-line"></i>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">

                {/* Cover */}
                <div className="mx-auto md:mx-0 w-48 h-48 md:w-72 md:h-72 shadow-2xl rounded-md overflow-hidden grid grid-cols-2 grid-rows-2 shrink-0">
                    <img src="https://picsum.photos/300?1" className="w-full h-full object-cover" />
                    <img src="https://picsum.photos/300?2" className="w-full h-full object-cover" />
                    <img src="https://picsum.photos/300?3" className="w-full h-full object-cover" />
                    <img src="https://picsum.photos/300?4" className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="text-left md:pb-3">
                    <p className="hidden md:block text-sm text-gray-200 mb-3">
                        Public Playlist
                    </p>

                    <h1 className="text-3xl md:text-8xl font-bold leading-none tracking-tight mb-4">
                        My Playlist #2
                    </h1>

                    <div className="flex items-center gap-2 text-base text-gray-200 mb-4">
                        <img
                            src="https://i.pravatar.cc/40"
                            alt=""
                            className="w-7 h-7 rounded-full"
                        />
                        <span className="font-semibold">Md Alkama</span>
                    </div>

                    <span className="text-gray-300 text-lg">
                        18 min 1 sec
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PlaylistHeader;
