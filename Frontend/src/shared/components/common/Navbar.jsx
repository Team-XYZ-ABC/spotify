import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import UserMenuCard from "@/shared/components/ui/UserMenuCard";
import { useSelector } from "react-redux";
import { useSearch } from "@/features/search/hooks/useSearch";
import TextSuggestionResults from "@/features/search/components/TextSuggestionResults";
import ArtistSuggestionResults from "@/features/search/components/ArtistSuggestionResults";
import AlbumSuggestionResults from "@/features/search/components/AlbumSuggestionResults";
import TrackSuggestionResults from "@/features/search/components/TrackSuggestionResults";

const Navbar = ({ toggleSidebar }) => {
  const [showProfile, setShowProfile] = useState(false);
  const user = useSelector((state) => state.user.user);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);
  const profileRef = useRef(null)

  const { results, isLoading } = useSearch(search);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearch(value);
  setShowDropdown(value.trim().length > 0);
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("Search submitted:", search);
      setShowDropdown(false);
      // Navigate to full search results page if needed
    }
  };

  const hasResults =
  (results?.textSuggestions?.length || 0) > 0 ||
  (results?.artists?.length || 0) > 0 ||
  (results?.albums?.length || 0) > 0 ||
  (results?.tracks?.length || 0) > 0;

  return (
    <div className="w-full h-16 flex items-center justify-between px-3 md:px-6 text-white gap-3">
      <div className="flex items-center shrink-0">
        <Link to="/">
          <img src="/img/spotify_logo_white.png" alt="logo" className="h-8 w-8" />
        </Link>
      </div>

      <div className="hidden md:flex items-center justify-center flex-1 min-w-0" ref={searchContainerRef}>
        <div className="flex items-center gap-3 bg-[#121212] px-3 py-2 rounded-full w-full max-w-130 relative">
          <div className="shrink-0 bg-[#1f1f1f] h-10 cursor-pointer w-10 flex items-center justify-center rounded-full">
            <i className="ri-home-5-line text-xl"></i>
          </div>

          <div className="relative flex items-center gap-2 flex-1 min-w-0">
            <i className="ri-search-line text-gray-400 text-lg shrink-0"></i>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => search.trim() && setShowDropdown(true)}
              placeholder="What do you want to play?"
              className="bg-transparent outline-none w-full text-sm placeholder-gray-400 truncate"
            />

            {/* Search Results Dropdown */}
            {showDropdown && search.trim() !== "" && (
              <div className="absolute top-full -left-10 mt-4 p-2 w-[calc(100%+80px)] bg-[#121212] rounded-md shadow-xl z-50 py-2 max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                  <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
                ) : hasResults ? (
                  <>
                    {/* <TextSuggestionResults suggestions={results.textSuggestions} query={search} /> */}
                    <TrackSuggestionResults tracks={results.tracks} query={search} />
                    <AlbumSuggestionResults albums={results.albums} query={search} />
                    <ArtistSuggestionResults artists={results.artists} query={search} />
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-zinc-400">No results found for "{search}"</div>
                )}
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-gray-600 shrink-0"></div>
          <div className="shrink-0">
            <i className="ri-stack-line text-xl cursor-pointer hover:text-white text-gray-300 transition-colors"></i>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="hidden lg:flex items-center gap-4">
          <button className="bg-white cursor-pointer text-black px-4 py-1.5 rounded-full text-sm font-semibold transition-transform hover:scale-[1.03]">
            Explore Premium
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
            <i className="ri-download-line"></i>
            Install App
          </button>
          <i className="ri-notification-3-line text-xl cursor-pointer text-gray-300 hover:text-white transition-colors"></i>
          <i className="ri-group-line text-xl cursor-pointer text-gray-300 hover:text-white transition-colors"></i>
        </div>

        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfile(!showProfile)}
            className="h-9 w-9 md:h-10 md:w-10 flex items-center overflow-hidden justify-center rounded-full bg-zinc-800 font-semibold cursor-pointer text-sm md:text-base"
          >
            {user?.avatar ? (
              <img className="h-full w-full object-cover" src={user.avatar} alt="avatar" />
            ) : (
              <h1>{user?.username?.toUpperCase()?.[0] || "U"}</h1>
            )}
          </div>
          {showProfile && <UserMenuCard setShowProfile={setShowProfile} profileRef={profileRef}/>}
        </div>

        <button onClick={toggleSidebar} className="md:hidden text-2xl">
          ☰
        </button>
      </div>
    </div>
  );
};

export default Navbar;