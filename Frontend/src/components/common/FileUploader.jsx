import React, { useRef, useState } from "react";

const FileUploader = (
    { label, accept, onFileSelect, preview, previewType, placeholder },
) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (file) => {
        if (file && file.type.match(accept.replace("*", ".*"))) {
            onFileSelect(file);
        } else {
            alert(`Please select a valid ${accept} file`);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    return (
        <div
            className={`relative border-2 border-dashed rounded-lg p-4 md:p-6 text-center ${
                isDragging
                    ? "border-[#1DB954] bg-[#1DB954]/5"
                    : "border-white/10 bg-white/2"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={(e) =>
                    e.target.files[0] && handleFileChange(e.target.files[0])}
                className="hidden"
            />

            {previewType === "image" && preview
                ? (
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                        <img
                            src={preview}
                            alt="Cover preview"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover shadow-lg border border-white/10"
                        />
                        <button
                            onClick={() => onFileSelect(null)}
                            className="text-xs font-medium text-gray-400 hover:text-red-400"
                        >
                            Remove
                        </button>
                    </div>
                )
                : previewType === "audio" && preview
                ? (
                    <div className="flex items-center justify-between gap-2 md:gap-3 p-3 md:p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-linear-to-br from-[#1DB954] to-[#1ed760] rounded-lg flex items-center justify-center shrink-0">
                                <svg
                                    className="w-5 h-5 md:w-6 md:h-6 text-black"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                            <div className="text-left min-w-0">
                                <p className="text-xs md:text-sm font-bold text-white truncate">
                                    {preview.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {preview.size}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => onFileSelect(null)}
                            className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-400/10 shrink-0"
                        >
                            <svg
                                className="w-4 h-4 md:w-5 md:h-5"
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
                )
                : (
                    <div
                        onClick={() => fileInputRef.current.click()}
                        className="cursor-pointer py-2"
                    >
                        <div className="flex justify-center mb-2 md:mb-3">
                            <div className="p-2.5 md:p-3 bg-[#1DB954]/10 rounded-lg">
                                <svg
                                    className="w-6 h-6 md:w-8 md:h-8 text-[#1DB954]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs md:text-sm font-bold text-white">
                            {label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {placeholder}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                            or drag & drop
                        </p>
                    </div>
                )}
        </div>
    );
};

export default FileUploader;
