import React, { useEffect, useRef, useState } from "react";
import Footer from "../../../components/common/Footer";

const tracks = [
  {
    id: 1,
    title: "Shararar",
    artist: "Shashwat Sachdev, Jasmine Sandlas",
    album: "Dhurandhar",
    duration: "3:44",
    img: "/img/song1.jpg",
  },
  {
    id: 2,
    title: "Ez-Ez",
    artist: "Diljit Dosanjh",
    album: "Dhurandhar",
    duration: "3:02",
    img: "/img/song2.jpg",
  },
  {
    id: 3,
    title: "Thinking of You",
    artist: "AP Dhillon",
    album: "Thinking of You",
    duration: "3:00",
    img: "/img/song3.jpg",
  },
];

const UserProfile = () => {
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const [profileImg, setProfileImg] = useState(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImg(imageUrl);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current.scrollTop > 120) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };

    const container = scrollRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex-1 h-[calc(100vh-86px)] overflow-y-auto bg-zinc-900 rounded-lg flex flex-col relative"
    >
      <div
        className={`sticky top-0 z-40 bg-black/80 backdrop-blur-md px-6 py-3 transition-all ${
          showSticky ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        <h2 className="text-white font-semibold text-lg">
          Zeneration Media
        </h2>
      </div>

      <div className="bg-linear-to-b from-[#3a3a3a] to-black px-4 sm:px-6 md:px-10 py-8 sm:py-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <div
            onClick={() => fileInputRef.current.click()}
            className="relative group w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-[#1f1f1f] rounded-full flex items-center justify-center shadow-lg cursor-pointer overflow-hidden"
          >
            {profileImg
              ? (
                <img
                  src={profileImg}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              )
              : (
                <i className="ri-user-line text-4xl sm:text-5xl text-gray-400">
                </i>
              )}

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <i className="ri-pencil-line text-xl text-white sm:text-2xl"></i>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          <div>
            <p className="text-xs sm:text-sm text-gray-300">Profile</p>
            <h1 className="text-2xl text-white sm:text-4xl md:text-7xl font-bold leading-tight">
              Zeneration Media
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 text-white bg-black sm:px-6 md:px-10 py-6 sm:py-8">
        <div
          className="flex items-center justify-end gap-4 mb-4 relative"
          ref={menuRef}
        >
          <div className="relative">
            <button
              onClick={() =>
                setOpenMenu(openMenu === "settings" ? null : "settings")}
              className="w-10 cursor-pointer h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] transition"
            >
              <i className="ri-settings-3-line text-lg"></i>
            </button>

            {openMenu === "settings" && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1f1f1f] rounded-md shadow-lg p-2 z-50">
                <button className="w-full cursor-pointer text-left px-3 py-2 hover:bg-[#2a2a2a] rounded">
                  Edit Profile
                </button>
                <button className="w-full cursor-pointer text-left px-3 py-2 hover:bg-[#2a2a2a] rounded">
                  Account Settings
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === "more" ? null : "more")}
              className="w-10 h-10 flex cursor-pointer items-center justify-center rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] transition"
            >
              <i className="ri-more-2-fill text-lg"></i>
            </button>

            {openMenu === "more" && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1f1f1f] rounded-md shadow-lg p-2 z-50">
                <button className="w-full cursor-pointer text-left px-3 py-2 hover:bg-[#2a2a2a] rounded">
                  Share Profile
                </button>
                <button className="w-full cursor-pointer text-left px-3 py-2 hover:bg-[#2a2a2a] rounded text-red-400">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <h2 className="text-lg sm:text-xl font-bold mb-1">
          Top tracks this month
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
          Only visible to you
        </p>

        <div className="space-y-2 sm:space-y-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="grid grid-cols-12 items-center gap-2 sm:gap-4 text-xs sm:text-sm hover:bg-[#1a1a1a] p-2 sm:p-3 rounded transition cursor-pointer"
            >
              <span className="col-span-1 text-gray-400">
                {track.id}
              </span>

              <div className="col-span-7 sm:col-span-6 flex items-center gap-2 sm:gap-3 min-w-0">
                <img
                  src={track.img}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover"
                  alt=""
                />
                <div className="min-w-0">
                  <p className="truncate">{track.title}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                    {track.artist}
                  </p>
                </div>
              </div>

              <span className="hidden sm:block col-span-3 text-gray-400 truncate">
                {track.album}
              </span>

              <span className="col-span-4 sm:col-span-2 text-gray-400 text-right">
                {track.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
