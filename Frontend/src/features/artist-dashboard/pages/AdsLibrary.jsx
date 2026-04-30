import React, { useState, useEffect } from "react";

// ---------- Mock Data ----------
const initialCampaigns = [
  {
    id: "c1",
    name: "Summer Sale Blast",
    type: "Display",
    budget: 2500,
    spent: 1240,
    impressions: 125000,
    clicks: 4200,
    ctr: 3.36,
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    image: "https://picsum.photos/id/20/300/300",
  },
  {
    id: "c2",
    name: "New Album Launch",
    type: "Audio",
    budget: 5000,
    spent: 2750,
    impressions: 89000,
    clicks: 3100,
    ctr: 3.48,
    status: "active",
    startDate: "2024-07-15",
    endDate: "2024-09-15",
    image: "https://picsum.photos/id/29/300/300",
  },
  {
    id: "c3",
    name: "Holiday Special",
    type: "Video",
    budget: 8000,
    spent: 8000,
    impressions: 210000,
    clicks: 9800,
    ctr: 4.67,
    status: "ended",
    startDate: "2023-12-01",
    endDate: "2024-01-15",
    image: "https://picsum.photos/id/30/300/300",
  },
  {
    id: "c4",
    name: "Podcast Sponsorship",
    type: "Audio",
    budget: 3000,
    spent: 1800,
    impressions: 45000,
    clicks: 1950,
    ctr: 4.33,
    status: "paused",
    startDate: "2024-05-10",
    endDate: "2024-07-10",
    image: "https://picsum.photos/id/31/300/300",
  },
  {
    id: "c5",
    name: "Brand Awareness",
    type: "Display",
    budget: 10000,
    spent: 4200,
    impressions: 320000,
    clicks: 11200,
    ctr: 3.5,
    status: "active",
    startDate: "2024-04-01",
    endDate: "2024-10-01",
    image: "https://picsum.photos/id/32/300/300",
  },
];

// ---------- Main Component ----------
const AdsLibrary = () => {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, paused, ended
  const [filterType, setFilterType] = useState("all"); // all, display, audio, video
  const [sortBy, setSortBy] = useState("newest"); // newest, budget, spent, ctr, impressions
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [deletingCampaign, setDeletingCampaign] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Stats summary
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const avgCTR = (totalClicks / totalImpressions * 100).toFixed(2);

  // Filtering and sorting
  const filteredCampaigns = campaigns
    .filter((c) => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "all" || c.status === filterStatus) &&
      (filterType === "all" || c.type.toLowerCase() === filterType.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.startDate) - new Date(a.startDate);
        case "budget": return b.budget - a.budget;
        case "spent": return b.spent - a.spent;
        case "ctr": return b.ctr - a.ctr;
        case "impressions": return b.impressions - a.impressions;
        default: return 0;
      }
    });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleCreateCampaign = (newCampaign) => {
    const campaignWithId = {
      ...newCampaign,
      id: `c${Date.now()}`,
      spent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
    };
    setCampaigns([campaignWithId, ...campaigns]);
    showToast(`"${newCampaign.name}" created`, "success");
    setShowCreateModal(false);
  };

  const handleEditCampaign = (updated) => {
    setCampaigns(campaigns.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
    showToast(`"${updated.name}" updated`, "success");
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = () => {
    if (deletingCampaign) {
      setCampaigns(campaigns.filter((c) => c.id !== deletingCampaign.id));
      showToast(`"${deletingCampaign.name}" deleted`, "error");
      setDeletingCampaign(null);
    }
  };

  const handleDuplicate = (campaign) => {
    const duplicated = {
      ...campaign,
      id: `c${Date.now()}`,
      name: `${campaign.name} (Copy)`,
      spent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      status: "paused",
      startDate: new Date().toISOString().split("T")[0],
    };
    setCampaigns([duplicated, ...campaigns]);
    showToast(`"${duplicated.name}" created`, "success");
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

      <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-400 mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Ads Library
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage your ad campaigns • {campaigns.length} total
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold py-2.5 px-6 rounded-full transition-all hover:scale-105 shadow-lg"
          >
            <i className="ri-add-line text-xl"></i>
            <span>New Campaign</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon="ri-money-dollar-circle-line" label="Total Budget" value={`$${totalBudget.toLocaleString()}`} color="green" />
          <StatCard icon="ri-bar-chart-2-line" label="Total Spent" value={`$${totalSpent.toLocaleString()}`} color="blue" />
          <StatCard icon="ri-eye-line" label="Impressions" value={totalImpressions.toLocaleString()} color="purple" />
          <StatCard icon="ri-cursor-line" label="Clicks" value={totalClicks.toLocaleString()} color="orange" />
          <StatCard icon="ri-percent-line" label="Avg. CTR" value={`${avgCTR}%`} color="yellow" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-2 border-b border-white/10">
          <div className="relative w-full sm:w-80">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1f1f1f] border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1f1f1f] rounded-full px-3 py-1.5 border border-gray-700">
              <i className="ri-filter-line text-gray-400"></i>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="ended">Ended</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-[#1f1f1f] rounded-full px-3 py-1.5 border border-gray-700">
              <i className="ri-apps-2-line text-gray-400"></i>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All types</option>
                <option value="display">Display</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-[#1f1f1f] rounded-full px-3 py-1.5 border border-gray-700">
              <i className="ri-sort-asc text-gray-400"></i>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="budget">Highest budget</option>
                <option value="spent">Most spent</option>
                <option value="ctr">Highest CTR</option>
                <option value="impressions">Most impressions</option>
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
          <SkeletonSection count={6} viewMode={viewMode} />
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-16 bg-[#181818] rounded-xl">
            <i className="ri-advertisement-line text-5xl text-gray-600"></i>
            <p className="text-gray-400 mt-3">No campaigns found.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 bg-green-500 text-black px-5 py-2 rounded-full text-sm font-semibold"
            >
              Create your first campaign
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-fr">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={() => setEditingCampaign(campaign)}
                onDelete={() => setDeletingCampaign(campaign)}
                onDuplicate={() => handleDuplicate(campaign)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCampaigns.map((campaign) => (
              <CampaignListItem
                key={campaign.id}
                campaign={campaign}
                onEdit={() => setEditingCampaign(campaign)}
                onDelete={() => setDeletingCampaign(campaign)}
                onDuplicate={() => handleDuplicate(campaign)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCampaign}
      />
      <EditCampaignModal
        campaign={editingCampaign}
        onClose={() => setEditingCampaign(null)}
        onSave={handleEditCampaign}
      />
      <DeleteConfirmModal
        campaign={deletingCampaign}
        onConfirm={handleDeleteCampaign}
        onCancel={() => setDeletingCampaign(null)}
      />

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fadeUp { animation: fadeUp 0.2s ease-out; }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    green: "bg-green-500/10 text-green-500",
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    orange: "bg-orange-500/10 text-orange-500",
    yellow: "bg-yellow-500/10 text-yellow-500",
  };
  return (
    <div className="bg-[#181818] rounded-xl p-4 border border-gray-800">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <i className={`${icon} text-lg`}></i>
        </div>
        <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

const CampaignCard = ({ campaign, onEdit, onDelete, onDuplicate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const statusColors = {
    active: "bg-green-500/20 text-green-400",
    paused: "bg-yellow-500/20 text-yellow-400",
    ended: "bg-gray-500/20 text-gray-400",
  };
  const spentPercent = (campaign.spent / campaign.budget) * 100;

  return (
    <div className="group bg-[#181818] rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer relative">
      <div className="p-4">
        <div className="relative mb-3">
          <img
            src={campaign.image}
            alt={campaign.name}
            className="w-full aspect-video object-cover rounded-md"
          />
          <div className="absolute top-2 right-2">
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
              {campaign.status}
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-base truncate pr-6">{campaign.name}</h3>
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="text-gray-400 hover:text-white"
              >
                <i className="ri-more-2-fill"></i>
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 bg-[#282828] rounded-md shadow-lg py-1 z-10 w-32 text-sm">
                  <button onClick={() => { onEdit(); setShowMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2">
                    <i className="ri-edit-line"></i> Edit
                  </button>
                  <button onClick={() => { onDuplicate(); setShowMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2">
                    <i className="ri-file-copy-line"></i> Duplicate
                  </button>
                  <button onClick={() => { onDelete(); setShowMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 text-red-400 flex items-center gap-2">
                    <i className="ri-delete-bin-line"></i> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <i className="ri-apps-2-line text-gray-500 text-xs"></i>
            <span className="text-gray-400 text-xs">{campaign.type}</span>
            <span className="text-gray-600 text-xs">•</span>
            <i className="ri-calendar-line text-gray-500 text-xs"></i>
            <span className="text-gray-400 text-xs">{campaign.startDate.split("-")[0]}</span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Budget</span>
              <span className="text-white">${campaign.budget.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${spentPercent}%` }}></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Spent</span>
              <span className="text-white">${campaign.spent.toLocaleString()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-700">
            <div>
              <p className="text-gray-500 text-xs">Impressions</p>
              <p className="text-sm font-semibold">{campaign.impressions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">CTR</p>
              <p className="text-sm font-semibold">{campaign.ctr}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CampaignListItem = ({ campaign, onEdit, onDelete, onDuplicate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const statusColors = {
    active: "bg-green-500/20 text-green-400",
    paused: "bg-yellow-500/20 text-yellow-400",
    ended: "bg-gray-500/20 text-gray-400",
  };
  return (
    <div className="flex items-center gap-4 bg-[#181818] hover:bg-[#282828] rounded-lg p-3 transition group">
      <img src={campaign.image} alt={campaign.name} className="w-12 h-12 rounded-md object-cover" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold truncate">{campaign.name}</h4>
          <div className={`px-2 py-0.5 rounded-full text-xs ${statusColors[campaign.status]}`}>
            {campaign.status}
          </div>
        </div>
        <p className="text-gray-400 text-xs">{campaign.type} • Started {campaign.startDate}</p>
      </div>
      <div className="hidden md:block text-sm text-gray-300 w-24">
        ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
      </div>
      <div className="hidden sm:block text-sm text-gray-300 w-20">
        {campaign.ctr}% CTR
      </div>
      <div className="relative">
        <button onClick={() => setShowMenu(!showMenu)} className="p-1">
          <i className="ri-more-2-fill"></i>
        </button>
        {showMenu && (
          <div className="absolute right-0 top-6 bg-[#282828] rounded-md shadow-lg py-1 z-10 w-32 text-sm">
            <button onClick={() => { onEdit(); setShowMenu(false); }} className="w-full text-left px-3 py-1.5 hover:bg-white/10">Edit</button>
            <button onClick={() => { onDuplicate(); setShowMenu(false); }} className="w-full text-left px-3 py-1.5 hover:bg-white/10">Duplicate</button>
            <button onClick={() => { onDelete(); setShowMenu(false); }} className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-red-400">Delete</button>
          </div>
        )}
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition">
        <i className="ri-play-circle-fill text-green-500 text-2xl"></i>
      </button>
    </div>
  );
};

const SkeletonSection = ({ count, viewMode }) => (
  <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" : "space-y-2"}>
    {Array(count).fill(0).map((_, i) => (
      <div key={i} className="bg-[#181818] rounded-lg p-4 animate-pulse">
        <div className="w-full aspect-video bg-gray-700 rounded-md mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const CreateCampaignModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("Display");
  const [budget, setBudget] = useState(1000);
  const [status, setStatus] = useState("active");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState("https://picsum.photos/id/20/300/300");

  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, type, budget: Number(budget), status, startDate, endDate, image });
    setName("");
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-xl max-w-md w-full p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Create new campaign</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Campaign name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" autoFocus required />
          <div className="grid grid-cols-2 gap-3">
            <select value={type} onChange={(e) => setType(e.target.value)} className="bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white">
              <option>Display</option>
              <option>Audio</option>
              <option>Video</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white">
              <option>active</option>
              <option>paused</option>
            </select>
          </div>
          <input type="number" placeholder="Budget ($)" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" required />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" />
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

const EditCampaignModal = ({ campaign, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState(0);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setType(campaign.type);
      setBudget(campaign.budget);
      setStatus(campaign.status);
      setStartDate(campaign.startDate);
      setEndDate(campaign.endDate);
    }
  }, [campaign]);

  if (!campaign) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ ...campaign, name, type, budget: Number(budget), status, startDate, endDate });
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-xl max-w-md w-full p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Edit campaign</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" required />
          <div className="grid grid-cols-2 gap-3">
            <select value={type} onChange={(e) => setType(e.target.value)} className="bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white">
              <option>Display</option>
              <option>Audio</option>
              <option>Video</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white">
              <option>active</option>
              <option>paused</option>
              <option>ended</option>
            </select>
          </div>
          <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" required />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white" />
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

const DeleteConfirmModal = ({ campaign, onConfirm, onCancel }) => {
  if (!campaign) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-xl max-w-sm w-full p-6 border border-gray-800 text-center">
        <i className="ri-delete-bin-line text-4xl text-red-400 mb-3 block"></i>
        <h3 className="text-lg font-bold">Delete "{campaign.name}"?</h3>
        <p className="text-gray-400 text-sm mt-1">This action cannot be undone.</p>
        <div className="flex justify-center gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-full">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default AdsLibrary;