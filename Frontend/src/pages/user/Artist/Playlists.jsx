import React, { useState, useEffect } from "react";

const initialUserPlaylists = [
  {
    id: "p1",
    title: "Chill Lo-Fi Beats",
    description: "Relaxing hip hop beats for studying",
    cover: "https://picsum.photos/id/100/300/300",
    songCount: 42,
    creator: "you",
    createdAt: "2024-01-15",
    isPublic: true,
  },
  {
    id: "p2",
    title: "Workout Motivation",
    description: "High energy tracks to push harder",
    cover: "https://picsum.photos/id/101/300/300",
    songCount: 28,
    creator: "you",
    createdAt: "2024-02-20",
    isPublic: false,
  },
  {
    id: "p3",
    title: "90s Nostalgia",
    description: "Best of 90s pop, rock & hip hop",
    cover: "https://picsum.photos/id/102/300/300",
    songCount: 55,
    creator: "you",
    createdAt: "2024-03-05",
    isPublic: true,
  },
];

const initialRecommendedPlaylists = [
  {
    id: "r1",
    title: "Top Hits Global",
    description: "The biggest songs right now",
    cover: "https://picsum.photos/id/103/300/300",
    songCount: 50,
    creator: "Spotify",
    followers: 1250000,
  },
  {
    id: "r2",
    title: "Jazz Vibes",
    description: "Smooth jazz & bossa nova",
    cover: "https://picsum.photos/id/104/300/300",
    songCount: 38,
    creator: "Spotify",
    followers: 890000,
  },
  {
    id: "r3",
    title: "Indie Essentials",
    description: "The best of independent music",
    cover: "https://picsum.photos/id/105/300/300",
    songCount: 45,
    creator: "Spotify",
    followers: 620000,
  },
];

const Playlists = () => {
  const [userPlaylists, setUserPlaylists] = useState(initialUserPlaylists);
  const [recommendedPlaylists, setRecommendedPlaylists] = useState(initialRecommendedPlaylists);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, a-z, songCount
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [deletingPlaylist, setDeletingPlaylist] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const filteredUserPlaylists = userPlaylists
    .filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "a-z") return a.title.localeCompare(b.title);
      if (sortBy === "songCount") return b.songCount - a.songCount;
      return 0;
    });

  const filteredRecommended = recommendedPlaylists.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleCreatePlaylist = (newPlaylist) => {
    const playlistWithId = {
      ...newPlaylist,
      id: `p${Date.now()}`,
      creator: "you",
      createdAt: new Date().toISOString().split("T")[0],
      songCount: 0,
    };
    setUserPlaylists([playlistWithId, ...userPlaylists]);
    showToast(`"${newPlaylist.title}" created`, "success");
    setShowCreateModal(false);
  };

  const handleEditPlaylist = (updated) => {
    setUserPlaylists(
      userPlaylists.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
    showToast(`"${updated.title}" updated`, "success");
    setEditingPlaylist(null);
  };

  const handleDeletePlaylist = () => {
    if (deletingPlaylist) {
      setUserPlaylists(userPlaylists.filter((p) => p.id !== deletingPlaylist.id));
      showToast(`"${deletingPlaylist.title}" deleted`, "error");
      setDeletingPlaylist(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1f1f1f] to-[#121212] text-white">
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fadeUp">
          <div className={`px-5 py-3 rounded-full shadow-lg flex items-center gap-2 ${
            toast.type === "success" ? "bg-green-500 text-black" : "bg-red-500 text-white"
          }`}>
            <i className={toast.type === "success" ? "ri-checkbox-circle-line" : "ri-alert-line"}></i>
            {toast.message}
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Your Library
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {userPlaylists.length} playlists • {recommendedPlaylists.length} recommendations
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold py-2.5 px-6 rounded-full transition-all hover:scale-105 shadow-lg"
          >
            <i className="ri-add-line text-xl"></i>
            <span>Create Playlist</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-2 border-b border-white/10">
          <div className="relative w-full sm:w-80">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search playlists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1f1f1f] border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1f1f1f] rounded-full px-3 py-1.5 border border-gray-700">
              <i className="ri-sort-asc line text-gray-400"></i>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="a-z">A - Z</option>
                <option value="songCount">Most songs</option>
              </select>
            </div>
            <div className="flex items-center bg-[#1f1f1f] rounded-full p-1 border border-gray-700">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-full transition ${viewMode === "grid" ? "bg-green-500 text-black" : "text-gray-400"}`}
              >
                <i className="ri-grid-line text-lg"></i>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-full transition ${viewMode === "list" ? "bg-green-500 text-black" : "text-gray-400"}`}
              >
                <i className="ri-list-unordered"></i>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-8">
            <SkeletonSection title="Your Playlists" count={4} viewMode={viewMode} />
            <SkeletonSection title="Recommended for You" count={3} viewMode={viewMode} />
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Your Playlists</h2>
                {filteredUserPlaylists.length === 0 && searchTerm && (
                  <span className="text-sm text-gray-400">No matching playlists</span>
                )}
              </div>
              {filteredUserPlaylists.length === 0 && !searchTerm && (
                <div className="text-center py-12 bg-[#181818] rounded-xl">
                  <i className="ri-play-list-2-line text-5xl text-gray-600"></i>
                  <p className="text-gray-400 mt-2">No playlists yet. Create your first one!</p>
                </div>
              )}
              <PlaylistGrid
                playlists={filteredUserPlaylists}
                viewMode={viewMode}
                editable={true}
                onEdit={(playlist) => setEditingPlaylist(playlist)}
                onDelete={(playlist) => setDeletingPlaylist(playlist)}
              />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
              {filteredRecommended.length === 0 && searchTerm && (
                <div className="text-center py-8 text-gray-400">No recommendations match your search</div>
              )}
              <PlaylistGrid
                playlists={filteredRecommended}
                viewMode={viewMode}
                editable={false}
              />
            </section>
          </div>
        )}
      </div>

      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreatePlaylist}
      />
      <EditPlaylistModal
        playlist={editingPlaylist}
        onClose={() => setEditingPlaylist(null)}
        onSave={handleEditPlaylist}
      />
      <DeleteConfirmModal
        playlist={deletingPlaylist}
        onConfirm={handleDeletePlaylist}
        onCancel={() => setDeletingPlaylist(null)}
      />

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fadeUp {
          animation: fadeUp 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

const PlaylistGrid = ({ playlists, viewMode, editable, onEdit, onDelete }) => {
  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {playlists.map((playlist) => (
          <PlaylistListItem
            key={playlist.id}
            playlist={playlist}
            editable={editable}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 auto-rows-fr">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          editable={editable}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const PlaylistCard = ({ playlist, editable, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="group bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-all duration-300 cursor-pointer relative">
      <div className="relative mb-4">
        <img
          src={playlist.cover}
          alt={playlist.title}
          className="w-full aspect-square object-cover rounded-md shadow-md group-hover:shadow-xl transition-shadow"
        />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-green-500 rounded-full p-2.5 shadow-lg hover:scale-105 transition-transform">
            <i className="ri-play-fill text-black text-xl"></i>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-base truncate pr-6">{playlist.title}</h3>
          {editable && (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="text-gray-400 hover:text-white transition"
              >
                <i className="ri-more-2-fill"></i>
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 bg-[#282828] rounded-md shadow-lg py-1 z-10 w-32 text-sm">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(playlist); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2"
                  >
                    <i className="ri-edit-line"></i> Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(playlist); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-red-400 flex items-center gap-2"
                  >
                    <i className="ri-delete-bin-line"></i> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{playlist.description}</p>
        <div className="flex items-center gap-3 text-gray-500 text-xs mt-2">
          <div className="flex items-center gap-1">
            <i className="ri-music-2-line"></i>
            <span>{playlist.songCount} songs</span>
          </div>
          {playlist.creator !== "you" && playlist.followers && (
            <div className="flex items-center gap-1">
              <i className="ri-user-heart-line"></i>
              <span>{playlist.followers.toLocaleString()}</span>
            </div>
          )}
          {playlist.creator === "you" && !playlist.isPublic && (
            <i className="ri-lock-line" title="Private"></i>
          )}
        </div>
      </div>
    </div>
  );
};

const PlaylistListItem = ({ playlist, editable, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="flex items-center gap-4 bg-[#181818] hover:bg-[#282828] rounded-lg p-3 transition group">
      <img src={playlist.cover} alt={playlist.title} className="w-12 h-12 rounded-md object-cover" />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{playlist.title}</h4>
        <p className="text-gray-400 text-xs truncate">{playlist.description}</p>
      </div>
      <div className="text-gray-400 text-sm hidden sm:block">
        {playlist.songCount} songs
      </div>
      {editable && (
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1">
            <i className="ri-more-2-fill"></i>
          </button>
          {showMenu && (
            <div className="absolute right-0 top-6 bg-[#282828] rounded-md shadow-lg py-1 z-10 w-28 text-sm">
              <button onClick={() => { onEdit(playlist); setShowMenu(false); }} className="w-full text-left px-3 py-1.5 hover:bg-white/10">Edit</button>
              <button onClick={() => { onDelete(playlist); setShowMenu(false); }} className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-red-400">Delete</button>
            </div>
          )}
        </div>
      )}
      <button className="opacity-0 group-hover:opacity-100 transition">
        <i className="ri-play-circle-fill text-green-500 text-2xl"></i>
      </button>
    </div>
  );
};

const SkeletonSection = ({ title, count, viewMode }) => (
  <div>
    <div className="h-7 w-48 bg-gray-800 rounded animate-pulse mb-4"></div>
    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" : "space-y-2"}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-[#181818] rounded-lg p-4 animate-pulse">
          <div className="w-full aspect-square bg-gray-700 rounded-md mb-3"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

const CreatePlaylistModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("https://picsum.photos/id/100/300/300");
  const [isPublic, setIsPublic] = useState(true);

  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, description, cover, isPublic });
    setTitle("");
    setDescription("");
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-xl max-w-md w-full p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Create new playlist</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" autoFocus required />
          <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white resize-none" rows={2} />
          <div className="flex items-center justify-between">
            <span className="text-sm">Public playlist</span>
            <button type="button" onClick={() => setIsPublic(!isPublic)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${isPublic ? "bg-green-500" : "bg-gray-600"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isPublic ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-black rounded-full font-semibold">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditPlaylistModal = ({ playlist, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title);
      setDescription(playlist.description || "");
      setIsPublic(playlist.isPublic !== undefined ? playlist.isPublic : true);
    }
  }, [playlist]);
  if (!playlist) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ ...playlist, title, description, isPublic });
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-xl max-w-md w-full p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Edit playlist</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white resize-none" rows={2} />
          <div className="flex items-center justify-between">
            <span className="text-sm">Public playlist</span>
            <button type="button" onClick={() => setIsPublic(!isPublic)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${isPublic ? "bg-green-500" : "bg-gray-600"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isPublic ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-black rounded-full font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ playlist, onConfirm, onCancel }) => {
  if (!playlist) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-xl max-w-sm w-full p-6 border border-gray-800 text-center">
        <i className="ri-delete-bin-line text-4xl text-red-400 mb-3 block"></i>
        <h3 className="text-lg font-bold">Delete "{playlist.title}"?</h3>
        <p className="text-gray-400 text-sm mt-1">This action cannot be undone.</p>
        <div className="flex justify-center gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-full">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Playlists;