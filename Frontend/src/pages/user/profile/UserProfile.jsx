import React, { useEffect, useRef, useState } from "react";
import Footer from "../../../components/common/Footer";
import EditProfileModal from "../../../components/ui/EditProfileModal";
import {Link } from 'react-router'
const SCROLL_THRESHOLD = 120;

const tracks = [
  {
    id: 1,
    title: "Shararar",
    artist: "Shashwat Sachdev, Jasmine Sandlas",
    album: "Dhurandhar",
    duration: "3:44",
    img: "https://i.pinimg.com/avif/1200x/e2/ef/07/e2ef0764ce6cd12b9f754215c656e63f.avf",
  },
  {
    id: 2,
    title: "Ez-Ez",
    artist: "Diljit Dosanjh",
    album: "Dhurandhar",
    duration: "3:02",
    img: "https://i.pinimg.com/736x/d0/3b/99/d03b99c26428a643b1c6ec637f6f81fd.jpg",
  },
  {
    id: 3,
    title: "Thinking of You",
    artist: "AP Dhillon",
    album: "Thinking of You",
    duration: "3:00",
    img: "https://i.pinimg.com/736x/82/86/d0/8286d03a47cab27c4733495fd4cc37c7.jpg",
  },
];


const UserProfile = () => {
  const scrollRef = useRef(null);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState(null);
  const [name, setName] = useState("Zeneration Media");
  const [openMenu, setOpenMenu] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(scrollRef.current.scrollTop > SCROLL_THRESHOLD);
    };

    const el = scrollRef.current;
    el.addEventListener("scroll", handleScroll);

    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(URL.createObjectURL(file));
    }
  };

  const handleEditOpen = () => {
    setIsEditOpen(true);
    setOpenMenu(null);
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 h-[calc(100vh-86px)] overflow-y-auto bg-zinc-900 rounded-lg flex flex-col"
    >
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        name={name}
        setName={setName}
        profileImg={profileImg}
        setProfileImg={setProfileImg}
      />

      {showSticky && (
        <StickyHeader name={name} />
      )}

      <ProfileHeader
        name={name}
        profileImg={profileImg}
        fileInputRef={fileInputRef}
        onUpload={handleImageUpload}
      />

      <div className="flex-1 px-4 text-white bg-black sm:px-6 md:px-10 py-6 sm:py-8">
        
        <ProfileMenu
          menuRef={menuRef}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          onEdit={handleEditOpen}
        />
        <TrackList tracks={tracks} />
      </div>

      <Footer />
    </div>
  );
};


const StickyHeader = ({ name }) => (
  <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md px-6 py-3">
    <h2 className="text-white font-semibold text-lg">{name}</h2>
  </div>
);

const ProfileHeader = ({ name, profileImg, fileInputRef, onUpload }) => (
  <div className="bg-linear-to-b from-[#3a3a3a] to-black px-6 py-10">
    <div className="flex items-center gap-6">
      
      <div
        onClick={() => fileInputRef.current.click()}
        className="relative group w-32 h-32 rounded-full bg-[#1f1f1f] flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {profileImg ? (
          <img src={profileImg} className="w-full h-full object-cover" />
        ) : (
          <i className="ri-user-line text-5xl text-gray-400"></i>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex justify-center items-center">
          <i className="ri-pencil-line text-white text-xl"></i>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onUpload}
        className="hidden"
      />

      <div>
        <p className="text-sm text-gray-300">Profile</p>
        <h1 className="md:text-5xl text-2xl font-bold text-white">{name}</h1>
      </div>
    </div>
  </div>
);

const ProfileMenu = ({ menuRef, openMenu, setOpenMenu, onEdit }) => (
  <div className="flex justify-end gap-4 mb-4" ref={menuRef}>
    
    <div className="relative">
      <IconButton
        icon="ri-settings-3-line"
        onClick={() =>
          setOpenMenu(openMenu === "settings" ? null : "settings")
        }
      />

      {openMenu === "settings" && (
        <Dropdown>
          <DropdownItem onClick={onEdit}>Edit Profile</DropdownItem>
          <Link to={'/account'}><DropdownItem>Account Settings</DropdownItem></Link>
        </Dropdown>
      )}
    </div>

    <div className="relative">
      <IconButton
        icon="ri-more-2-fill"
        onClick={() =>
          setOpenMenu(openMenu === "more" ? null : "more")
        }
      />

      {openMenu === "more" && (
        <Dropdown>
          <DropdownItem>Share Profile</DropdownItem>
          <DropdownItem className="text-red-400">Logout</DropdownItem>
        </Dropdown>
      )}
    </div>
  </div>
);

const TrackList = ({ tracks }) => (
  <>
    <h2 className="text-xl font-bold mb-1">Top tracks this month</h2>
    <p className="text-sm text-gray-400 mb-6">Only visible to you</p>

    <div className="space-y-3">
      {tracks.map((track) => (
        <TrackItem key={track.id} track={track} />
      ))}
    </div>
  </>
);

const TrackItem = ({ track }) => (
  <div className="grid grid-cols-12 items-center hover:bg-[#1a1a1a] p-3 rounded">
    <span className="col-span-1 text-gray-400">{track.id}</span>

    <div className="col-span-6 flex gap-3">
      <img src={track.img} className="w-10 h-10 rounded" />
      <div>
        <p>{track.title}</p>
        <p className="text-xs text-gray-400">{track.artist}</p>
      </div>
    </div>

    <span className="col-span-3 text-gray-400">{track.album}</span>
    <span className="col-span-2 text-right text-gray-400">
      {track.duration}
    </span>
  </div>
);

const IconButton = ({ icon, ...props }) => (
  <button
    {...props}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] transition"
  >
    <i className={icon}></i>
  </button>
);

const Dropdown = ({ children }) => (
  <div className="absolute right-0 mt-2 w-48 bg-[#1f1f1f] rounded-md p-2 shadow-lg z-50">
    {children}
  </div>
);

const DropdownItem = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`w-full text-left px-3 py-2 hover:bg-[#2a2a2a] rounded ${className}`}
  >
    {children}
  </button>
);

export default UserProfile;