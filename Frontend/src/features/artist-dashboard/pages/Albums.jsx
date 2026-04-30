import React, { useState, useEffect } from "react";

const initialUserAlbums = [
  {
    id: "a1",
    title: "Midnight Echoes",
    artist: "You",
    cover: "https://picsum.photos/id/104/300/300",
    releaseDate: "2024-01-20",
    songCount: 12,
    isPublic: true,
  },
  {
    id: "a2",
    title: "Urban Dreams",
    artist: "You",
    cover: "https://picsum.photos/id/106/300/300",
    releaseDate: "2024-02-15",
    songCount: 8,
    isPublic: false,
  },
  {
    id: "a3",
    title: "Acoustic Sessions",
    artist: "You",
    cover: "https://picsum.photos/id/107/300/300",
    releaseDate: "2024-03-10",
    songCount: 10,
    isPublic: true,
  },
];

const initialRecommendedAlbums = [
  {
    id: "r1",
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    cover: "https://picsum.photos/id/108/300/300",
    releaseDate: "1973-03-01",
    songCount: 10,
    listeners: "24M",
  },
  {
    id: "r2",
    title: "Thriller",
    artist: "Michael Jackson",
    cover: "https://picsum.photos/id/109/300/300",
    releaseDate: "1982-11-30",
    songCount: 9,
    listeners: "32M",
  },
  {
    id: "r3",
    title: "Rumours",
    artist: "Fleetwood Mac",
    cover: "https://picsum.photos/id/110/300/300",
    releaseDate: "1977-02-04",
    songCount: 11,
    listeners: "18M",
  },
  {
    id: "r4",
    title: "21",
    artist: "Adele",
    cover: "https://picsum.photos/id/111/300/300",
    releaseDate: "2011-01-24",
    songCount: 11,
    listeners: "31M",
  },
];

const Albums = () => {
  const [userAlbums, setUserAlbums] = useState(initialUserAlbums);
  const [recommendedAlbums, setRecommendedAlbums] = useState(initialRecommendedAlbums);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); 
  const [viewMode, setViewMode] = useState("grid"); 
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [deletingAlbum, setDeletingAlbum] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const filteredUserAlbums = userAlbums
    .filter((a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.artist.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.releaseDate) - new Date(a.releaseDate);
      if (sortBy === "oldest") return new Date(a.releaseDate) - new Date(b.releaseDate);
      if (sortBy === "a-z") return a.title.localeCompare(b.title);
      if (sortBy === "songCount") return b.songCount - a.songCount;
      if (sortBy === "artist") return a.artist.localeCompare(b.artist);
      return 0;
    });

  const filteredRecommended = recommendedAlbums.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.artist.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCreateAlbum = (newAlbum) => {
    const albumWithId = {
      ...newAlbum,
      id: `a${Date.now()}`,
      artist: "You",
      releaseDate: new Date().toISOString().split("T")[0],
      songCount: 0,
    };
    setUserAlbums([albumWithId, ...userAlbums]);
    showToast(`"${newAlbum.title}" created`, "success");
    setShowCreateModal(false);
  };

  const handleEditAlbum = (updated) => {
    setUserAlbums(userAlbums.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)));
    showToast(`"${updated.title}" updated`, "success");
    setEditingAlbum(null);
  };

  const handleDeleteAlbum = () => {
    if (deletingAlbum) {
      setUserAlbums(userAlbums.filter((a) => a.id !== deletingAlbum.id));
      showToast(`"${deletingAlbum.title}" deleted`, "error");
      setDeletingAlbum(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#1f1f1f] to-[#121212] text-white">
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
              Albums
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {userAlbums.length} of your albums • {recommendedAlbums.length} recommendations
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold py-2.5 px-6 rounded-full transition-all hover:scale-105 shadow-lg"
          >
            <i className="ri-add-line text-xl"></i>
            <span>Create Album</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-2 border-b border-white/10">
          <div className="relative w-full sm:w-80">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search albums by title or artist..."
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
                <option value="artist">Artist name</option>
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
            <SkeletonSection title="Your Albums" count={4} viewMode={viewMode} />
            <SkeletonSection title="Recommended Albums" count={4} viewMode={viewMode} />
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Your Albums</h2>
                {filteredUserAlbums.length === 0 && searchTerm && (
                  <span className="text-sm text-gray-400">No matching albums</span>
                )}
              </div>
              {filteredUserAlbums.length === 0 && !searchTerm && (
                <div className="text-center py-12 bg-[#181818] rounded-xl">
                  <i className="ri-album-line text-5xl text-gray-600"></i>
                  <p className="text-gray-400 mt-2">You haven't created any albums yet.</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 bg-green-500 text-black px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    Create your first album
                  </button>
                </div>
              )}
              <AlbumGrid
                albums={filteredUserAlbums}
                viewMode={viewMode}
                editable={true}
                onEdit={(album) => setEditingAlbum(album)}
                onDelete={(album) => setDeletingAlbum(album)}
              />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Recommended Albums</h2>
              {filteredRecommended.length === 0 && searchTerm && (
                <div className="text-center py-8 text-gray-400">No recommendations match your search</div>
              )}
              <AlbumGrid
                albums={filteredRecommended}
                viewMode={viewMode}
                editable={false}
              />
            </section>
          </div>
        )}
      </div>

      <CreateAlbumModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateAlbum}
      />
      <EditAlbumModal
        album={editingAlbum}
        onClose={() => setEditingAlbum(null)}
        onSave={handleEditAlbum}
      />
      <DeleteConfirmModal
        album={deletingAlbum}
        onConfirm={handleDeleteAlbum}
        onCancel={() => setDeletingAlbum(null)}
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

const AlbumGrid = ({ albums, viewMode, editable, onEdit, onDelete }) => {
  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {albums.map((album) => (
          <AlbumListItem
            key={album.id}
            album={album}
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
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          editable={editable}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const AlbumCard = ({ album, editable, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const releaseYear = new Date(album.releaseDate).getFullYear();

  return (
    <div className="group bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-all duration-300 cursor-pointer relative">
      <div className="relative mb-4">
        <img
          src={album.cover}
          alt={album.title}
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
          <h3 className="font-bold text-base truncate pr-6">{album.title}</h3>
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
                    onClick={(e) => { e.stopPropagation(); onEdit(album); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2"
                  >
                    <i className="ri-edit-line"></i> Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(album); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-red-400 flex items-center gap-2"
                  >
                    <i className="ri-delete-bin-line"></i> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm mt-1">{album.artist}</p>
        <div className="flex items-center gap-3 text-gray-500 text-xs mt-2">
          <div className="flex items-center gap-1">
            <i className="ri-music-2-line"></i>
            <span>{album.songCount} songs</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="ri-calendar-line"></i>
            <span>{releaseYear}</span>
          </div>
          {album.listeners && (
            <div className="flex items-center gap-1">
              <i className="ri-headphone-line"></i>
              <span>{album.listeners}</span>
            </div>
          )}
          {editable && !album.isPublic && (
            <i className="ri-lock-line" title="Private"></i>
          )}
        </div>
      </div>
    </div>
  );
};

const AlbumListItem = ({ album, editable, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const releaseYear = new Date(album.releaseDate).getFullYear();

  return (
    <div className="flex items-center gap-4 bg-[#181818] hover:bg-[#282828] rounded-lg p-3 transition group">
      <img src={album.cover} alt={album.title} className="w-12 h-12 rounded-md object-cover" />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{album.title}</h4>
        <p className="text-gray-400 text-xs">{album.artist}</p>
      </div>
      <div className="text-gray-400 text-sm hidden sm:block">
        {album.songCount} songs
      </div>
      <div className="text-gray-500 text-xs hidden md:block">
        {releaseYear}
      </div>
      {editable && (
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1">
            <i className="ri-more-2-fill"></i>
          </button>
          {showMenu && (
            <div className="absolute right-0 top-6 bg-[#282828] rounded-md shadow-lg py-1 z-10 w-28 text-sm">
              <button onClick={() => { onEdit(album); setShowMenu(false); }} className="w-full text-left px-3 py-1.5 hover:bg-white/10">Edit</button>
              <button onClick={() => { onDelete(album); setShowMenu(false); }} className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-red-400">Delete</button>
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

const CreateAlbumModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("https://picsum.photos/id/104/300/300");
  const [isPublic, setIsPublic] = useState(true);

  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, cover, isPublic });
    setTitle("");
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-xl max-w-md w-full p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Create new album</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Album title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" autoFocus required />
          <div className="flex items-center justify-between">
            <span className="text-sm">Public album</span>
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

const EditAlbumModal = ({ album, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  useEffect(() => {
    if (album) {
      setTitle(album.title);
      setIsPublic(album.isPublic !== undefined ? album.isPublic : true);
    }
  }, [album]);
  if (!album) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ ...album, title, isPublic });
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-xl max-w-md w-full p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Edit album</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" required />
          <div className="flex items-center justify-between">
            <span className="text-sm">Public album</span>
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

const DeleteConfirmModal = ({ album, onConfirm, onCancel }) => {
  if (!album) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-xl max-w-sm w-full p-6 border border-gray-800 text-center">
        <i className="ri-delete-bin-line text-4xl text-red-400 mb-3 block"></i>
        <h3 className="text-lg font-bold">Delete "{album.title}"?</h3>
        <p className="text-gray-400 text-sm mt-1">This action cannot be undone.</p>
        <div className="flex justify-center gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-full">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Albums;