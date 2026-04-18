import Footer from "@components/common/Footer";
import EditProfileModal from "@components/ui/EditProfileModal";
import ProfileHeader from "@components/profile/ProfileHeader";
import ProfileMenu from "@components/profile/ProfileMenu";
import TrackList from "@components/profile/TrackList";
import StickyHeader from "./StickyHeader";

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