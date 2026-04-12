import React from "react";

const MobileSongsList = ({ songs }) => {
  return (
    <div className="px-6 pb-8 space-y-6">
      {songs.map((song) => (
        <div
          key={song.id}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <img
              src={song.image}
              alt={song.title}
              className="w-20 h-20 rounded object-cover"
            />

            <div>
              <h3 className="text-2xl font-medium">
                {song.title}
              </h3>
              <p className="text-gray-400 text-lg">
                {song.artist}
              </p>
            </div>
          </div>

          <button className="text-3xl text-gray-300">
            <i className="ri-more-fill"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default MobileSongsList;