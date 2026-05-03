import ProfileContent from "@/features/profile/components/ProfileContent";
import ProfileSkeleton from "@/features/profile/components/ProfileSkeleton";
import { useProfileContainer } from "@/features/profile/components/ProfileContainer";

const tracks = [
  {
    id: 1,
    title: "Shararar",
    artist: "Shashwat Sachdev, Jasmine Sandlas",
    album: "Dhurandhar",
    duration: "3:44",
    img: "https://i.pinimg.com/avif/1200x/e2/ef/07/e2ef0764ce6cd12b9f754215c656e63f.avf",
  },
];

const UserProfile = () => {
  const state = useProfileContainer();

  if (!state.user) return <ProfileSkeleton />;

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