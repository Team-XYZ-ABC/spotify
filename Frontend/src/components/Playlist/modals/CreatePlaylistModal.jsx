import React, { useState } from "react";

const CreatePlaylistModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name.trim()) {
            setError("Playlist name is required");
            return;
        }

        setError("");

        await onSubmit({
            name: name.trim(),
            description: description.trim(),
            coverImage: coverImage.trim(),
        });

        setName("");
        setDescription("");
        setCoverImage("");
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#121212] p-6 text-white shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Create playlist</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full w-10 h-10 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm text-zinc-300">Playlist name</label>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            maxLength={120}
                            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-white/30"
                            placeholder="My focus mix"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm text-zinc-300">Description</label>
                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            maxLength={500}
                            rows={3}
                            className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-white/30"
                            placeholder="Write a short description"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm text-zinc-300">Cover image URL</label>
                        <input
                            value={coverImage}
                            onChange={(event) => setCoverImage(event.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-white/30"
                            placeholder="https://..."
                        />
                    </div>

                    {error && <p className="text-sm text-rose-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-full bg-[#1ed760] px-4 py-2.5 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Creating..." : "Create playlist"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylistModal;
