import { useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { searchService } from "@/features/search/services/search.service";
import { setLoading, setResults } from "@/features/search/slice/search.slice";

export const useSearch = (query) => {
  const dispatch = useDispatch();

  const results = useSelector((state) => state.search.results);
  const isLoading = useSelector((state) => state.search.loading);

  const performSearch = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      dispatch(setResults({
        tracks: [],
        artists: [],
        albums: [],
        textSuggestions: []
      }));
      return;
    }

    try {
      dispatch(setLoading());

      const data = await searchService(searchTerm);

      let finalData = {
        tracks: data.tracks || [],
        artists: data.artists || [],
        albums: data.albums || [],
        textSuggestions: []
      };

      // 🔥 textSuggestions handling
      if (data.textSuggestions) {
        finalData.textSuggestions = data.textSuggestions;
      } else {
        const combined = [
          ...finalData.tracks.map(t => ({ name: t.title, type: "track" })),
          ...finalData.artists.map(a => ({ name: a.stageName, type: "artist" })),
          ...finalData.albums.map(a => ({ name: a.title, type: "album" }))
        ];

        const lowerQ = searchTerm.toLowerCase();
        combined.sort((a, b) => {
          const aName = (a.name || "").toLowerCase();
          const bName = (b.name || "").toLowerCase();
          
          const aScore = aName === lowerQ ? 3 : (aName.startsWith(lowerQ) ? 2 : (aName.includes(lowerQ) ? 1 : 0));
          const bScore = bName === lowerQ ? 3 : (bName.startsWith(lowerQ) ? 2 : (bName.includes(lowerQ) ? 1 : 0));
          
          if (aScore !== bScore) return bScore - aScore;
          return aName.length - bName.length;
        });

        const uniqueSuggestions = [];
        const seen = new Set();
        for (const item of combined) {
          if (!seen.has(item.name)) {
            seen.add(item.name);
            uniqueSuggestions.push(item);
          }
        }
        finalData.textSuggestions = uniqueSuggestions.slice(0, 5);
      }

      dispatch(setResults(finalData));

    } catch (error) {
      console.error("Search error:", error);
    }
  }, [dispatch]);

  const debouncedSearch = useCallback(
    debounce(performSearch, 300),
    [performSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  return { results, isLoading };
};