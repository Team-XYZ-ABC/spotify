import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRecommendationSection } from "@/features/recommendation/services/recommendation.service";

/**
 * useRecommendationSection
 *
 * Manages paginated data for a single feed section.
 * Supports:
 *  - initial load of `limit` items
 *  - loadMore() to append the next page
 *  - hasMore flag for infinite-scroll sentinel
 *
 * @param {string} section   API section key ("recommended" | "popular" | "episodes" | "featured-charts")
 * @param {number} limit     items per page (default 10)
 * @param {object} [extra]   extra query params forwarded to the API
 */
const useRecommendationSection = (section, limit = 10, extra = {}) => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    // stable ref so loadMore doesn't recreate on every render
    const pageRef = useRef(page);
    pageRef.current = page;

    const fetchPage = useCallback(
        async (pageNum) => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetchRecommendationSection(section, pageNum, limit, extra);
                const newItems = res?.data || [];
                setItems((prev) => (pageNum === 1 ? newItems : [...prev, ...newItems]));
                setHasMore(res?.pagination?.hasMore ?? false);
                setPage(pageNum);
            } catch (err) {
                setError(err?.message || "Failed to load");
            } finally {
                setLoading(false);
                setInitialLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [section, limit, JSON.stringify(extra)]
    );

    // initial fetch
    useEffect(() => {
        setItems([]);
        setPage(1);
        setHasMore(true);
        setInitialLoading(true);
        fetchPage(1);
    }, [fetchPage]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchPage(pageRef.current + 1);
        }
    }, [loading, hasMore, fetchPage]);

    return { items, loading, initialLoading, error, hasMore, loadMore };
};

export default useRecommendationSection;
