import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import Footer from "../../../components/common/Footer";
import EditProfileModal from "../../../components/ui/EditProfileModal";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileMenu from "../../../components/profile/ProfileMenu";
import TrackList from "../../../components/profile/TrackList";

import { useProfile } from "../../../hooks/useProfile";

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

const StickyHeader = ({ name }) => (
  <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md px-6 py-3 border-b border-zinc-800">
    <h2 className="text-white font-semibold text-lg truncate">
      {name}
    </h2>
  </div>
);

const ProfileSkeleton = () => (
  <div className="flex-1 h-[calc(100vh-86px)] overflow-y-auto bg-zinc-900 rounded-lg flex flex-col no-scrollbar animate-pulse">
    <div className="bg-linear-to-b from-[#3a3a3a] to-black px-6 py-10">
      <div className="flex items-center gap-6">
        <div className="w-32 h-32 rounded-full bg-zinc-700/60" />
        <div className="space-y-3">
          <div className="h-3 w-14 rounded bg-zinc-700/60" />
          <div className="h-8 w-52 rounded bg-zinc-700/60" />
        </div>
      </div>
    </div>

    <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 sm:py-8 bg-black text-white">
      <div className="flex justify-end gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-zinc-800" />
        <div className="w-10 h-10 rounded-full bg-zinc-800" />
      </div>

      <div className="h-6 w-52 rounded bg-zinc-800 mb-2" />
      <div className="h-4 w-36 rounded bg-zinc-800 mb-6" />

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-md p-3 bg-zinc-900/80"
          >
            <div className="w-12 h-12 rounded bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/5 rounded bg-zinc-800" />
              <div className="h-3 w-1/3 rounded bg-zinc-800" />
            </div>
            <div className="h-3 w-12 rounded bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>

    <div className="h-16 bg-zinc-900 border-t border-zinc-800" />
  </div>
);

const UserProfile = () => {
  const scrollRef = useRef(null);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  const { getProfile, updateProfile } = useProfile();
  const user = useSelector((state) => state.profile.profile);

  const [profileImg, setProfileImg] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (!user) return;

    // Keep the edit form in sync with the latest profile returned by the API.
    setName(user.displayName || user.username || "");
    setProfileImg(user.avatar || null);
    setProfileFile(null);
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isVisible =
        el.scrollTop > SCROLL_THRESHOLD;

      setShowSticky(isVisible);
    };

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const submitProfileUpdate = useCallback(
    async ({ nextName, nextFile, closeModal = false }) => {
      const trimmedName = (nextName || "").trim();
      const currentName =
        (user?.displayName || user?.username || "").trim();
      const hasNameChange = !!trimmedName && trimmedName !== currentName;
      const hasFileChange = !!nextFile;

      if (!hasNameChange && !hasFileChange) {
        if (closeModal) setIsEditOpen(false);
        return;
      }

      // The backend expects multipart data for both display name and avatar updates.
      const payload = new FormData();
      if (hasNameChange) payload.append("displayName", trimmedName);
      if (hasFileChange) payload.append("profile", nextFile);

      setIsSaving(true);

      const result = await updateProfile(payload);

      if (result.success) {
        setProfileFile(null);
        if (closeModal) setIsEditOpen(false);
      }

      setIsSaving(false);
    },
    [updateProfile, user]
  );

  const handleImageUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Show the selected image immediately while the upload is still in flight.
      const imageUrl = URL.createObjectURL(file);
      setProfileImg(imageUrl);
      setProfileFile(file);
      setIsAvatarUploading(true);

      try {
        await submitProfileUpdate({
          nextName: name,
          nextFile: file,
        });
      } finally {
        setIsAvatarUploading(false);
      }
    },
    [name, submitProfileUpdate]);

  const handleModalImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImg(imageUrl);
    setProfileFile(file);
  }, []);

  const handleSaveProfile = useCallback(async () => {
    await submitProfileUpdate({
      nextName: name,
      nextFile: profileFile,
      closeModal: true,
    });
  }, [name, profileFile, submitProfileUpdate]);

  const handleEditOpen = useCallback(() => {
    setIsEditOpen(true);
    setOpenMenu(false);
  }, []);

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 h-[calc(100vh-86px)] overflow-y-auto bg-zinc-900 rounded-lg flex flex-col no-scrollbar"
    >
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        name={name}
        setName={setName}
        profileImg={profileImg || user.avatar}
        onImageChange={handleModalImageUpload}
        onSave={handleSaveProfile}
        isSaving={isSaving}
      />

      {showSticky && (
        <StickyHeader
          name={user.displayName || user.username}
        />
      )}

      <ProfileHeader
        user={{
          ...user,
          avatar: profileImg || user.avatar,
        }}
        fileInputRef={fileInputRef}
        onUpload={handleImageUpload}
        isUploading={isAvatarUploading}
      />

      <div className="flex-1 px-4 sm:px-6 md:px-10 py-6 sm:py-8 bg-black text-white">
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

export default UserProfile;