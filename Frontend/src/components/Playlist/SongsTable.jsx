import React from "react";

const SongsTable = ({ songs }) => {
    return (
        <div className="px-8 pb-10">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800 text-gray-400 text-sm">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-3">Album</div>
                <div className="col-span-2">Date added</div>
                <div className="col-span-1 text-right">
                    <i className="ri-time-line"></i>
                </div>
            </div>

            {/* Songs */}
            {songs.map((song, index) => (
                <div
                    key={song.id}
                    className="grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-[#1a1a1a] rounded-md transition"
                >
                    <div className="col-span-1 text-gray-400 text-lg">
                        {index + 1}
                    </div>

                    <div className="col-span-5 flex items-center gap-4">
                        <img
                            src={song.image}
                            alt={song.title}
                            className="w-14 h-14 rounded object-cover"
                        />
                        <div>
                            <h3 className="text-lg font-medium">{song.title}</h3>
                            <p className="text-sm text-gray-400">{song.artist}</p>
                        </div>
                    </div>

                    <div className="col-span-3 text-gray-300 text-base">
                        {song.album}
                    </div>

                    <div className="col-span-2 text-gray-400 text-base">
                        2 minutes ago
                    </div>

                    <div className="col-span-1 text-right text-gray-300 text-base">
                        {song.duration}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SongsTable;