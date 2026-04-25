import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useProfile } from "@hooks/useProfile";

const SCROLL_THRESHOLD = 120;

export const useProfileContainer = () => {
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
        setName(user.displayName || user.username || "");
        setProfileImg(user.avatar || null);
        setProfileFile(null);
    }, [user]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () =>
            setShowSticky(el.scrollTop > SCROLL_THRESHOLD);

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    const submitProfileUpdate = useCallback(
        async ({ nextName, nextFile, closeModal = false }) => {
            const trimmedName = (nextName || "").trim();
            const currentName =
                (user?.displayName || user?.username || "").trim();

            const hasNameChange =
                !!trimmedName && trimmedName !== currentName;

            const hasFileChange = !!nextFile;

            if (!hasNameChange && !hasFileChange) {
                if (closeModal) setIsEditOpen(false);
                return;
            }

            const payload = {};
            if (hasNameChange) payload.displayName = trimmedName;
            if (hasFileChange) payload.avatarFile = nextFile;

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

    const handleImageUpload = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
    }, [name, submitProfileUpdate]);

    const handleModalImageUpload = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setProfileImg(imageUrl);
        setProfileFile(file);
    }, []);

    const handleSaveProfile = useCallback(() => {
        return submitProfileUpdate({
            nextName: name,
            nextFile: profileFile,
            closeModal: true,
        });
    }, [name, profileFile, submitProfileUpdate]);

    const handleEditOpen = useCallback(() => {
        setIsEditOpen(true);
        setOpenMenu(false);
    }, []);

    return {
        scrollRef,
        menuRef,
        fileInputRef,
        user,
        profileImg,
        name,
        setName,
        isSaving,
        isAvatarUploading,
        openMenu,
        setOpenMenu,
        isEditOpen,
        setIsEditOpen,
        showSticky,
        handleImageUpload,
        handleModalImageUpload,
        handleSaveProfile,
        handleEditOpen,
    };
};