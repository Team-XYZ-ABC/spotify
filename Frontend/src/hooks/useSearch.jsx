import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { dummyUsers, dummyArtists, dummyTracks, dummyAlbums, dummyPlaylists } from "../data/searchData";

// Helper to get user object for an artist
const getUserByArtistId = (artistId) => {
  const artist = dummyArtists.find(a => a.user.$oid === artistId);
  if (!artist) return null;
  return dummyUsers.find(u => u._id.$oid === artist.user.$oid);
};

export const useSearch = (query) => {
  const [results, setResults] = useState({
    textSuggestions: [],
    artistSuggestions: [],
    albumSuggestions: [],
    trackSuggestions: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = useCallback((searchTerm) => {
    if (!searchTerm.trim()) {
      setResults({ textSuggestions: [], artistSuggestions: [], albumSuggestions: [], trackSuggestions: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const term = searchTerm.toLowerCase();

    // ---- Text Suggestions (from combined pool) ----
    const textPool = [
      ...dummyUsers.map(u => ({ type: "user", name: u.displayName, data: u })),
      ...dummyAlbums.map(a => ({ type: "album", name: a.title, data: a })),
      ...dummyTracks.map(t => ({ type: "track", name: t.title, data: t })),
      ...dummyPlaylists.map(p => ({ type: "playlist", name: p.name, data: p })),
    ];

    let matches = textPool.filter(item => item.name.toLowerCase().includes(term));
    // Check for exact match
    const exactMatch = matches.find(item => item.name.toLowerCase() === term);
    let textSuggestions = [];
    if (exactMatch) {
      textSuggestions = [exactMatch];
    } else {
      textSuggestions = matches.slice(0, 4);
    }

    // ---- Artist Suggestions (up to 2) ----
    const artistMatches = dummyArtists
      .map(artist => {
        const user = getUserByArtistId(artist.user.$oid);
        if (!user) return null;
        const displayName = user.displayName;
        const username = user.username;
        if (displayName.toLowerCase().includes(term) || username.toLowerCase().includes(term)) {
          return { ...artist, user };
        }
        return null;
      })
      .filter(Boolean);
    const artistSuggestions = artistMatches.slice(0, 2);

    // ---- Album Suggestions (up to 2) ----
    const albumMatches = dummyAlbums.filter(album => album.title.toLowerCase().includes(term));
    const albumSuggestions = albumMatches.slice(0, 2);

    // ---- Track Suggestions (up to 2) ----
    const trackMatches = dummyTracks.filter(track => track.title.toLowerCase().includes(term));
    const trackSuggestions = trackMatches.slice(0, 2);

    setResults({
      textSuggestions,
      artistSuggestions,
      albumSuggestions,
      trackSuggestions,
    });
    setIsLoading(false);
  }, []);

  const debouncedSearch = useCallback(debounce(performSearch, 300), [performSearch]);

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  return { results, isLoading };
};