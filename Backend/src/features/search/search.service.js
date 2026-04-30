import { searchRepository, signSearchItem } from "./search.repository.js";

const buildSuggestions = (tracks, artists, albums, q) => {
    const all = [
        ...tracks.map((t) => ({ name: t.title, type: "track" })),
        ...artists.map((a) => ({ name: a.stageName, type: "artist" })),
        ...albums.map((a) => ({ name: a.title, type: "album" })),
    ];

    const lowerQ = q.toLowerCase();
    all.sort((a, b) => {
        const aN = (a.name || "").toLowerCase();
        const bN = (b.name || "").toLowerCase();
        const score = (n) =>
            n === lowerQ ? 3 : n.startsWith(lowerQ) ? 2 : n.includes(lowerQ) ? 1 : 0;
        const sA = score(aN);
        const sB = score(bN);
        return sA !== sB ? sB - sA : aN.length - bN.length;
    });

    const seen = new Set();
    const out = [];
    for (const item of all) {
        if (item.name && !seen.has(item.name)) {
            seen.add(item.name);
            out.push(item);
        }
    }
    return out.slice(0, 5);
};

class SearchService {
    emptyResults() {
        return { tracks: [], artists: [], albums: [], textSuggestions: [] };
    }

    async searchAll(q) {
        if (!q) return this.emptyResults();

        const [rawTracks, rawArtists, rawAlbums] =
            await searchRepository.searchAllSafe(q);

        const [tracks, artists, albums] = await Promise.all([
            Promise.all(rawTracks.map(signSearchItem)),
            Promise.all(rawArtists.map(signSearchItem)),
            Promise.all(rawAlbums.map(signSearchItem)),
        ]);

        return {
            tracks,
            artists,
            albums,
            textSuggestions: buildSuggestions(tracks, artists, albums, q),
        };
    }

    searchTracks(q) {
        return searchRepository.searchTracks(q);
    }
    searchArtists(q) {
        return searchRepository.searchArtists(q);
    }
    searchAlbums(q) {
        return searchRepository.searchAlbums(q);
    }
}

export default new SearchService();
