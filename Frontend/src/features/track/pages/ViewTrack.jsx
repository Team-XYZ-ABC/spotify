import React from "react";

// Dummy scalable data (same shape as API)
const trackData = {
  _id: "69ecbca102856fbaa682ab23",
  title: "new song hai bhai",
  duration: 292,
  audioUrl:
    "https://ik.imagekit.io/alkama/0a86536ae8a7d49ff66bcfad266c1a0de14d9a5c_0lpIzebxL_6Z_yCMifxg.mp3",
  coverImage:
    "https://ik.imagekit.io/alkama/photo-1761839259946-2d80f8e72e18_jT4xko9JK9.avif",
  artists: ["are hum hi dala hai"],
  genres: ["pop"],
  likeCount: 0,
  playCount: 0,
};

// Utility
const formatDuration = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// Header Component
const TrackHeader = ({ track }) => {
  return (
    <div className="bg-linear-to-b from-green-700/60 to-black p-6 flex gap-6 items-end">
      <img
        src={track.coverImage}
        alt="cover"
        className="w-52 h-52 object-cover shadow-lg"
      />

      <div>
        <p className="text-sm uppercase">Track</p>
        <h1 className="text-4xl font-bold mt-2">{track.title}</h1>
        <p className="text-gray-300 mt-2">
          {track.artists.join(", ")} • {track.genres.join(", ")}
        </p>
      </div>
    </div>
  );
};

// Controls
const TrackControls = () => {
  return (
    <div className="flex items-center gap-6 px-6 py-4">
      <button className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-black text-xl">
        <i className="ri-play-fill"></i>
      </button>

      <button className="text-2xl text-gray-300 hover:text-white">
        <i className="ri-heart-line"></i>
      </button>

      <button className="text-2xl text-gray-300 hover:text-white">
        <i className="ri-share-forward-line"></i>
      </button>

      <button className="text-2xl text-gray-300 hover:text-white">
        <i className="ri-more-2-fill"></i>
      </button>
    </div>
  );
};

// Track Row (scalable for playlist later)
const TrackRow = ({ track, index }) => {
  return (
    <div className="grid grid-cols-[40px_1fr_80px] items-center px-6 py-3 hover:bg-white/10 rounded-md">
      <span className="text-gray-400">{index + 1}</span>

      <div className="flex items-center gap-4">
        <img
          src={track.coverImage}
          className="w-10 h-10 object-cover"
        />
        <div>
          <p className="font-medium">{track.title}</p>
          <p className="text-sm text-gray-400">
            {track.artists.join(", ")}
          </p>
        </div>
      </div>

      <span className="text-gray-400 text-sm">
        {formatDuration(track.duration)}
      </span>
    </div>
  );
};

// Main Component
const ViewTrack = () => {
  return (
    <div className="text-white min-h-screen bg-black">
      <TrackHeader track={trackData} />

      <TrackControls />

      {/* Track List */}
      <div className="mt-4">
        <div className="px-6 text-gray-400 text-sm grid grid-cols-[40px_1fr_80px] pb-2 border-b border-white/10">
          <span>#</span>
          <span>Title</span>
          <span>
            <i className="ri-time-line"></i>
          </span>
        </div>

        <TrackRow track={trackData} index={0} />
      </div>
    </div>
  );
};

export default ViewTrack;
