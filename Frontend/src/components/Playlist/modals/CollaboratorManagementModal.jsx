import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCollaboratorSearch } from "../../../redux/slices/playlist.slice";

const MAX_COLLABORATORS = 10;

const CollaboratorManagementModal = ({
    isOpen,
    onClose,
    playlist,
    searchResults,
    isSearching,
    onSearch,
    onAddCollaborators,
    onRemoveCollaborator,
    isSubmitting,
}) => {
    const [query, setQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isOpen) return;
        if (!query) {
            dispatch(clearCollaboratorSearch())
            return;
        }

        const timeout = setTimeout(() => {
            onSearch(query.trim());
        }, 300);

        return () => clearTimeout(timeout);
    }, [isOpen, onSearch, query]);

    const currentCollaboratorIds = useMemo(
        () => new Set((playlist?.collaborators || []).map((user) => user.id)),
        [playlist]
    );

    const canAddMore = (playlist?.collaborators?.length || 0) + selectedIds.length < MAX_COLLABORATORS;

    if (!isOpen || !playlist) return null;

    const toggleUser = (userId) => {
        if (!canAddMore && !selectedIds.includes(userId)) {
            return;
        }

        setSelectedIds((current) =>
            current.includes(userId)
                ? current.filter((id) => id !== userId)
                : [...current, userId]
        );
    };

    const handleAdd = async () => {
        if (selectedIds.length === 0) return;
        await onAddCollaborators(selectedIds);
        setSelectedIds([]);
        setQuery("")
    };

    return (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#121212] p-6 text-white shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Manage collaborators</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full w-10 h-10 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-zinc-300">Current collaborators</h3>
                        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                            {(playlist.collaborators || []).length === 0 ? (
                                <p className="rounded-lg border border-dashed border-white/10 p-3 text-sm text-zinc-400">
                                    No collaborators added yet.
                                </p>
                            ) : (
                                playlist.collaborators.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">{user.displayName || user.username}</p>
                                            <p className="truncate text-xs text-zinc-400">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => onRemoveCollaborator(user.id)}
                                            className="rounded-full w-10 h-10 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                                        >
                                            <i className="ri-user-unfollow-line"></i>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-zinc-300">Add collaborators</h3>
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-white/30"
                            placeholder="Search username or email"
                        />

                        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                            {isSearching ? (
                                <p className="text-sm text-zinc-400">Searching...</p>
                            ) : (
                                (() => {
                                    const users = searchResults.filter(
                                        (user) => !currentCollaboratorIds.has(user.id)
                                    );

                                    if (!query.trim()) {
                                        return (
                                            <p className="rounded-lg border border-dashed border-white/10 p-3 text-sm text-zinc-400">
                                                Start typing username, display name or email.
                                            </p>
                                        );
                                    }

                                    if (!users.length) {
                                        return (
                                            <p className="rounded-lg border border-dashed border-white/10 p-3 text-sm text-zinc-400">
                                                No users found for this search.
                                            </p>
                                        );
                                    }

                                    return users.map((user) => (
                                        <button
                                            key={user.id}
                                            onClick={() => toggleUser(user.id)}
                                            className={`w-full rounded-lg border px-3 py-2 text-left transition ${selectedIds.includes(user.id)
                                                ? "border-[#1ed760] bg-[#1ed760]/10"
                                                : "border-white/10 bg-white/5 hover:bg-white/10"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.displayName || user.username}
                                                        className="h-9 w-9 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold uppercase">
                                                        {(user.displayName || user.username || "U").charAt(0)}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">{user.displayName || user.username}</p>
                                                    <p className="truncate text-xs text-zinc-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ));
                                })()
                            )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span>
                                {(playlist.collaborators || []).length}/{MAX_COLLABORATORS} collaborators
                            </span>
                            <span>{selectedIds.length} selected</span>
                        </div>

                        <button
                            onClick={handleAdd}
                            disabled={selectedIds.length === 0 || isSubmitting}
                            className="w-full rounded-full bg-[#1ed760] px-4 py-2.5 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Saving..." : "Add selected collaborators"}
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CollaboratorManagementModal;
