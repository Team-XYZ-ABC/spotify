import React, { useEffect, useRef, useState } from "react";
import Footer from "../../../components/common/Footer";
import EditProfileModal from "../../../components/ui/EditProfileModal";
import {Link } from 'react-router'
import { useProfile } from "../../../hooks/useProfile";
import { useSelector } from "react-redux";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileMenu from "../../../components/profile/ProfileMenu";
import TrackList from "../../../components/profile/TrackList";
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

  const {getProfile} = useProfile()
  const user = useSelector(state=>state.profile.profile)
  console.log(user)

  useEffect(()=>{
    getProfile()
  },[])

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
        user={user}
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

export default UserProfile;