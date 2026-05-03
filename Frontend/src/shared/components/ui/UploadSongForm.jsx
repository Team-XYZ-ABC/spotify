import React, { useEffect, useState } from "react";
import Input from "@/shared/components/common/Input";
import ToggleSwitch from "@/shared/components/common/ToggleSwitch";
import FileUploader from "@/shared/components/common/FileUploader";
import Dropdown from "@/shared/components/common/Dropdown";
import ConfirmationDialog from "@/shared/components/ui/ConfirmationDialog";
import { COUNTRIES, GENRES, LANGUAGES } from "@/features/search/data/DropDownSuggestions";
import { useTrack } from "@/features/track/hooks/useTrack";

const initialState = {
    title: "",
    artists: "",
    album: "",
    genre: "",
    language: "",
    isExplicit: false,
    copyrightOwner: "",
    isrc: "",
    countries: [],
    releaseDate: "",
    recordLabel: "",
    composer: "",
    producer: "",
    coverImage: null,
    file: null,
};

const UploadSongForm = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState(initialState);
    const [coverPreview, setCoverPreview] = useState(null);
    const [audioFileName, setAudioFileName] = useState("");
    const [audioFileSize, setAudioFileSize] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { uploadTrack, loading, error, uploadProgress, processingProgress } = useTrack();

    const hasUnsavedChanges = () => {
        return (
            formData.title.trim() ||
            formData.artists.trim() ||
            formData.album.trim() ||
            formData.genre ||
            formData.language ||
            formData.coverImage ||
            formData.file
        );
    };

    const handleBackClick = () => {
        if (hasUnsavedChanges()) {
            setShowConfirmation(true);
        } else {
            onClose(false);
        }
    };

    const handleConfirmDiscard = () => {
        setShowConfirmation(false);
        setFormData(initialState);
        setCoverPreview(null);
        setAudioFileName("");
        setAudioFileSize("");
        setErrorMsg("");
        onClose(false);
    };

    useEffect(() => {
        if (formData.coverImage) {
            const url = URL.createObjectURL(formData.coverImage);
            setCoverPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setCoverPreview(null);
        }
    }, [formData.coverImage]);

    useEffect(() => {
        if (error) setErrorMsg(error);
    }, [error]);

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

        try {
            setErrorMsg("");

            await uploadTrack(formData);

            setFormData(initialState);
            setCoverPreview(null);
            setAudioFileName("");
            setAudioFileSize("");

            onClose(false);

        } catch (err) {
            setErrorMsg(err.message || "Upload failed");
        }
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                handleBackClick();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            return () => document.removeEventListener("keydown", handleEsc);
        }
    }, [isOpen, formData]);

    if (!isOpen) return null;

    return (
        <>
            <ConfirmationDialog
                isOpen={showConfirmation}
                onConfirm={handleConfirmDiscard}
                onCancel={() => setShowConfirmation(false)}
            />

            <div className="min-h-screen bg-linear-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#000000] text-white flex flex-col">
                <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3">
                                <button
                                    onClick={handleBackClick}
                                    className="p-1.5 md:p-2 rounded-lg hover:bg-white/10"
                                    title="Go back"
                                >
                                    <svg
                                        className="w-5 h-5 md:w-6 md:h-6 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                                <div className="h-6 md:h-7 w-px bg-white/10">
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 md:w-9 md:h-9 bg-linear-to-br from-[#1DB954] to-[#1ed760] rounded-md flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 md:w-5 md:h-5 text-black"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                        </svg>
                                    </div>
                                    <h1 className="text-base md:text-lg font-bold">
                                        Upload Track
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
                        <div className="mb-8 md:mb-10">
                            <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                                Track Information
                            </h2>
                            <div className="bg-white/2 rounded-xl p-4 md:p-6 border border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    <Input
                                        label="Track Title"
                                        value={formData.title}
                                        onChange={(v) =>
                                            handleChange("title", v)}
                                        placeholder="Your song title"
                                        required
                                    />
                                    <Input
                                        label="Artist(s)"
                                        value={formData.artists}
                                        onChange={(v) =>
                                            handleChange("artists", v)}
                                        placeholder="Separate with commas"
                                        required
                                    />
                                    <Input
                                        label="Album Name"
                                        value={formData.album}
                                        onChange={(v) =>
                                            handleChange("album", v)}
                                        placeholder="Optional"
                                    />
                                    <Dropdown
                                        label="Genre"
                                        value={formData.genre}
                                        onChange={(v) =>
                                            handleChange("genre", v)}
                                        options={GENRES}
                                        placeholder="Select genre"
                                    />
                                    <Dropdown
                                        label="Language"
                                        value={formData.language}
                                        onChange={(v) =>
                                            handleChange("language", v)}
                                        options={LANGUAGES}
                                        placeholder="Select language"
                                    />
                                    <Input
                                        label="Release Date"
                                        type="date"
                                        value={formData.releaseDate}
                                        onChange={(v) =>
                                            handleChange("releaseDate", v)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-8 md:mb-10">
                            <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                                Files & Media
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-white mb-2">
                                        Cover Art
                                        <span className="text-[#1DB954] ml-1">
                                            •
                                        </span>
                                    </label>
                                    <FileUploader
                                        label="Upload cover"
                                        accept="image/*"
                                        onFileSelect={(file) =>
                                            handleChange("coverImage", file)}
                                        preview={coverPreview}
                                        previewType="image"
                                        placeholder="JPG or PNG, 640x640px+"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white mb-2">
                                        Audio File
                                        <span className="text-[#1DB954] ml-1">
                                            •
                                        </span>
                                    </label>
                                    <FileUploader
                                        label="Upload audio"
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

                        <div className="mb-8 md:mb-10">
                            <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                                Rights & Metadata
                            </h2>
                            <div className="bg-white/2 rounded-xl p-4 md:p-6 border border-white/5">
                                <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-white/5">
                                    <ToggleSwitch
                                        label="Explicit Content"
                                        checked={formData.isExplicit}
                                        onChange={(checked) =>
                                            handleChange("isExplicit", checked)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    <Input
                                        label="Copyright Owner"
                                        value={formData.copyrightOwner}
                                        placeholder="© Your name"
                                        onChange={(v) =>
                                            handleChange("copyrightOwner", v)}
                                    />
                                    <Input
                                        label="Record Label"
                                        value={formData.recordLabel}
                                        placeholder="Optional"
                                        onChange={(v) =>
                                            handleChange("recordLabel", v)}
                                    />
                                    <Input
                                        label="ISRC Code"
                                        value={formData.isrc}
                                        placeholder="e.g., USUM12345678"
                                        onChange={(v) =>
                                            handleChange("isrc", v)}
                                    />
                                    <Input
                                        label="Composer/Songwriter"
                                        value={formData.composer}
                                        placeholder="Optional"
                                        onChange={(v) =>
                                            handleChange("composer", v)}
                                    />
                                    <Dropdown
                                        label="Distribution Countries"
                                        value={formData.countries}
                                        onChange={(v) =>
                                            handleChange("countries", v)}
                                        options={COUNTRIES}
                                        placeholder="Select countries"
                                        search={true}
                                    />
                                    <Input
                                        label="Producer"
                                        value={formData.producer}
                                        placeholder="Optional"
                                        onChange={(v) =>
                                            handleChange("producer", v)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {errorMsg && (
                    <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 mb-3 md:mb-4">
                        <div className="bg-linear-to-r from-red-500/10 to-red-600/5 border border-red-500/20 text-red-400 p-3 md:p-4 rounded-lg text-xs md:text-sm font-medium">
                            <div className="flex items-center gap-2 md:gap-3">
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5 text-red-400 shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {errorMsg}
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 mb-3 md:mb-4">
                        <div className="bg-white/3 border border-white/10 rounded-lg p-3 md:p-4 text-xs md:text-sm space-y-2">
                            <div className="flex items-center justify-between text-zinc-300">
                                <span className="capitalize font-semibold">
                                    {processingProgress?.stage === "uploading"
                                        ? "Uploading to S3"
                                        : processingProgress?.stage === "processing"
                                            ? "Transcoding"
                                            : processingProgress?.stage === "chunking"
                                                ? "HLS chunking"
                                                : processingProgress?.stage === "uploading_chunks"
                                                    ? "Publishing chunks"
                                                    : processingProgress?.stage === "ready"
                                                        ? "Ready"
                                                        : "Processing"}
                                </span>
                                <span className="text-zinc-400">
                                    {Math.round(
                                        processingProgress?.progress ?? uploadProgress ?? 0
                                    )}
                                    %
                                </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-[#1DB954] to-[#1ed760] transition-all"
                                    style={{
                                        width: `${Math.round(
                                            processingProgress?.progress ?? uploadProgress ?? 0
                                        )}%`,
                                    }}
                                />
                            </div>
                            {processingProgress?.statusMessage && (
                                <p className="text-zinc-500 text-[11px]">
                                    {processingProgress.statusMessage}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="sticky bottom-0 border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-5 flex justify-between items-center gap-3 md:gap-4">
                        <button
                            onClick={handleBackClick}
                            className="px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold text-gray-300 border border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`px-6 md:px-8 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold bg-linear-to-r from-[#1DB954] to-[#1ed760] text-black flex items-center gap-2 ${loading
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:from-[#1ed760] hover:to-[#22ff64] shadow-lg"
                                }`}
                        >
                            {loading
                                ? (
                                    <>
                                        <svg
                                            className="animate-spin h-4 w-4"
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
                                        Uploading
                                    </>
                                )
                                : (
                                    <>
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                                        </svg>
                                        Upload
                                    </>
                                )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadSongForm;
