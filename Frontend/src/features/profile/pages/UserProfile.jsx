import React from "react";
import ProfileContent from "@/features/profile/components/ProfileContent";
import ProfileSkeleton from "@/features/profile/components/ProfileSkeleton";
import { useProfileContainer } from "@/features/profile/components/ProfileContainer";
import useRecommendationSection from "@/features/recommendation/hooks/useRecommendationSection";

const UserProfile = () => {
  const state = useProfileContainer();
  const { items: popularItems } = useRecommendationSection("popular", 5);

  if (!state.user) return <ProfileSkeleton />;

  const tracks = popularItems.length > 0 ? popularItems.map((t, idx) => ({
    id: String(t._id?.$oid || t._id || t.id || idx + 1),
    trackId: String(t._id?.$oid || t._id || t.id || ""),
    title: t.title || "Unknown Track",
    artist: t.primaryArtistName || (Array.isArray(t.artists) ? t.artists.join(", ") : t.artists?.[0] ?? "Unknown Artist"),
    album: t.albumName || "Single",
    duration: t.duration || "3:30",
    img: t.coverImage || t.image || "https://i.pinimg.com/avif/1200x/e2/ef/07/e2ef0764ce6cd12b9f754215c656e63f.avf",
  })) : [
    {
      id: "1",
      trackId: "",
      title: "No tracks available",
      artist: "Explore some music first!",
      album: "-",
      duration: "0:00",
      img: "https://i.pinimg.com/avif/1200x/e2/ef/07/e2ef0764ce6cd12b9f754215c656e63f.avf",
    }
  ];

  return (
    <div
      ref={state.scrollRef}
      className="flex-1 h-[calc(100vh-86px)] overflow-y-auto bg-zinc-900 rounded-lg flex flex-col no-scrollbar"
    >
      <ProfileContent {...state} tracks={tracks} />
    </div>
  );
};

export default UserProfile;