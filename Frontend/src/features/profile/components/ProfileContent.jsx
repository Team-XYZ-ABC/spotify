import Footer from "@/shared/components/common/Footer";
import EditProfileModal from "@/shared/components/ui/EditProfileModal";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import ProfileMenu from "@/features/profile/components/ProfileMenu";
import TrackList from "@/features/profile/components/TrackList";
import StickyHeader from "@/features/profile/components/StickyHeader";

const ProfileContent = ({
    user,
    profileImg,
    fileInputRef,
    isAvatarUploading,
    handleImageUpload,
    showSticky,
    name,
    isEditOpen,
    setIsEditOpen,
    setName,
    handleModalImageUpload,
    handleSaveProfile,
    isSaving,
    menuRef,
    openMenu,
    setOpenMenu,
    handleEditOpen,
    tracks,
}) => {
    return (
        <>
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
                <StickyHeader name={user.displayName || user.username} />
            )}

            <ProfileHeader
                user={{ ...user, avatar: profileImg || user.avatar }}
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
        </>
    );
};

export default ProfileContent;