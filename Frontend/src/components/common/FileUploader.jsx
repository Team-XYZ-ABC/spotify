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
            className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                isDragging
                    ? "border-green-500 bg-green-500/5"
                    : "border-gray-700 bg-[#1a1a1a]"
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
                    <div className="flex flex-col items-center gap-3">
                        <img
                            src={preview}
                            alt="Cover preview"
                            className="w-28 h-28 rounded-lg object-cover shadow-md"
                        />
                        <button
                            onClick={() => onFileSelect(null)}
                            className="text-xs text-gray-400 hover:text-red-400 transition"
                        >
                            Remove
                        </button>
                    </div>
                )
                : previewType === "audio" && preview
                ? (
                    <div className="flex items-center justify-between gap-2 p-2 bg-black/30 rounded-lg">
                        <div className="flex items-center gap-2">
                            <svg
                                className="w-8 h-8 text-green-500"
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
                            <div className="text-left">
                                <p className="text-sm font-medium text-white">
                                    {preview.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {preview.size}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => onFileSelect(null)}
                            className="text-gray-400 hover:text-red-400"
                        >
                            <svg
                                className="w-4 h-4"
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
                        className="cursor-pointer"
                    >
                        <div className="flex justify-center mb-2">
                            <svg
                                className="w-10 h-10 text-gray-500"
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
                        <p className="text-sm font-medium text-gray-300">
                            {label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {placeholder}
                        </p>
                    </div>
                )}
        </div>
    );
};

export default FileUploader;
