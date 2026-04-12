import React, { useEffect, useRef, useState } from "react";
import Input from "../common/Input";
import ToggleSwitch from "../common/ToggleSwitch";
import FileUploader from "../common/FileUploader";

const UploadSongForm = ({ openUploadTrackForm, setOpenUploadTrackForm }) => {
    const [formData, setFormData] = useState({
        title: "",
        artists: "",
        album: "",
        genres: "",
        lang: "",
        isExplicit: false,
        copyrightOwner: "",
        isrc: "",
        availableCountries: "",
        coverImage: null,
        file: null,
    });

    const [coverPreview, setCoverPreview] = useState(null);
    const [audioFileName, setAudioFileName] = useState("");
    const [audioFileSize, setAudioFileSize] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const modalRef = useRef(null);

    useEffect(() => {
        if (formData.coverImage) {
            const url = URL.createObjectURL(formData.coverImage);
            setCoverPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setCoverPreview(null);
        }
    }, [formData.coverImage]);

    const handleAudioFileChange = (file) => {
        if (file) {
            setAudioFileName(file.name);
            setAudioFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
            handleChange("file", file);
        } else {
            setAudioFileName("");
            setAudioFileSize("");
            handleChange("file", null);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (errorMsg) setErrorMsg("");
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            setErrorMsg("Track title is required");
            return;
        }
        if (!formData.artists.trim()) {
            setErrorMsg("At least one artist is required");
            return;
        }
        if (!formData.file) {
            setErrorMsg("Audio file is required");
            return;
        }

        setIsUploading(true);
        setErrorMsg("");

        const data = new FormData();
        data.append("file", formData.file);
        data.append("title", formData.title);
        data.append(
            "artists",
            JSON.stringify(formData.artists.split(",").map((a) => a.trim())),
        );
        data.append("album", formData.album);
        data.append(
            "genres",
            JSON.stringify(formData.genres.split(",").map((g) => g.trim())),
        );
        data.append("lang", formData.lang);
        data.append("isExplicit", formData.isExplicit);
        data.append("copyrightOwner", formData.copyrightOwner);
        data.append("isrc", formData.isrc);
        data.append(
            "availableCountries",
            JSON.stringify(
                formData.availableCountries.split(",").map((c) => c.trim()),
            ),
        );

        console.log("Submitting:", formData);
        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsUploading(false);
        setOpenUploadTrackForm(false);
        setFormData({
            title: "",
            artists: "",
            album: "",
            genres: "",
            lang: "",
            isExplicit: false,
            copyrightOwner: "",
            isrc: "",
            availableCountries: "",
            coverImage: null,
            file: null,
        });
        setCoverPreview(null);
        setAudioFileName("");
        setAudioFileSize("");
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setOpenUploadTrackForm(false);
        };
        if (openUploadTrackForm) {
            document.addEventListener("keydown", handleEsc);
            return () => document.removeEventListener("keydown", handleEsc);
        }
    }, [openUploadTrackForm, setOpenUploadTrackForm]);

    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setOpenUploadTrackForm(false);
        }
    };

    if (!openUploadTrackForm) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="w-full max-w-3xl h-2/3 bg-[#121212] rounded shadow-2xl overflow-y-auto no-scrollbar animate-fadeInUp"
                style={{ animation: "fadeInUp 0.3s ease-out" }}
            >
                <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-black"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            Upload a track
                        </h2>
                    </div>
                    <button
                        onClick={() => setOpenUploadTrackForm(false)}
                        className="text-gray-400 hover:text-white cursor-pointer transition-colors p-2 rounded-full hover:bg-white/10"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-6 max-h-[80vh] overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-1 md:flex md:flex-col gap-6 mb-6">
                        <div className="space-y-5">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Track details
                            </h3>
                            <div className="flex justify-between gap-4">
                                <Input
                                    label="Title"
                                    value={formData.title}
                                    onChange={(v) => handleChange("title", v)}
                                    placeholder="e.g., Blinding Lights"
                                    required
                                />
                                <Input
                                    label="Artists"
                                    value={formData.artists}
                                    onChange={(v) => handleChange("artists", v)}
                                    placeholder="Separate with commas (e.g., The Weeknd, Daft Punk)"
                                />
                            </div>
                            <div className="flex justify-between gap-4">
                                <Input
                                    label="Album"
                                    value={formData.album}
                                    onChange={(v) => handleChange("album", v)}
                                    placeholder="Album name (optional)"
                                />
                                <Input
                                    label="Genres"
                                    value={formData.genres}
                                    onChange={(v) => handleChange("genres", v)}
                                    placeholder="e.g., Pop, R&B"
                                />
                                <Input
                                    label="Language"
                                    value={formData.lang}
                                    onChange={(v) => handleChange("lang", v)}
                                    placeholder="e.g., English, Spanish"
                                />
                            </div>
                        </div>
                        <div className="space-y-5">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Rights & metadata
                            </h3>
                            <ToggleSwitch
                                label="Explicit Content"
                                checked={formData.isExplicit}
                                onChange={(checked) =>
                                    handleChange("isExplicit", checked)}
                            />
                            <div className="flex justify-between gap-4">
                                <Input
                                    label="Copyright Owner"
                                    value={formData.copyrightOwner}
                                    onChange={(v) =>
                                        handleChange("copyrightOwner", v)}
                                    placeholder="© Copyright holder"
                                />
                                <Input
                                    label="ISRC"
                                    value={formData.isrc}
                                    onChange={(v) => handleChange("isrc", v)}
                                    placeholder="Optional - e.g., USUM12345678"
                                />
                                <Input
                                    label="Available Countries"
                                    value={formData.availableCountries}
                                    onChange={(v) =>
                                        handleChange("availableCountries", v)}
                                    placeholder="Comma-separated country codes (US, GB, JP)"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Cover Art
                            </label>
                            <FileUploader
                                label="Upload cover image"
                                accept="image/*"
                                onFileSelect={(file) =>
                                    handleChange("coverImage", file)}
                                preview={coverPreview}
                                previewType="image"
                                placeholder="JPG or PNG, at least 640x640px"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Audio File
                            </label>
                            <FileUploader
                                label="Upload audio file"
                                accept="audio/*"
                                onFileSelect={handleAudioFileChange}
                                preview={audioFileName
                                    ? {
                                        name: audioFileName,
                                        size: audioFileSize,
                                    }
                                    : null}
                                previewType="audio"
                                placeholder="MP3, FLAC, WAV (max 100MB)"
                            />
                        </div>
                    </div>
                </div>
                {errorMsg && (
                    <div className="mb-5 mx-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded text-sm">
                        {errorMsg}
                    </div>
                )}

                <div className="px-6 py-5 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                    <button
                        onClick={() => setOpenUploadTrackForm(false)}
                        className="px-6 py-2 cursor-pointer rounded-full text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isUploading}
                        className={`px-6 py-2 cursor-pointer rounded-full text-sm font-semibold bg-green-500 text-black transition-all flex items-center gap-2 ${
                            isUploading
                                ? "opacity-70 cursor-not-allowed"
                                : "hover:scale-105 hover:bg-green-400"
                        }`}
                    >
                        {isUploading
                            ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 text-black"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        >
                                        </circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        >
                                        </path>
                                    </svg>
                                    Uploading...
                                </>
                            )
                            : (
                                "Upload track"
                            )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadSongForm;
