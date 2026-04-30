import * as searchDao from "./search.dao.js";

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

const emptyResults = () => ({
    tracks: [],
    artists: [],
    albums: [],
    textSuggestions: [],
});

const searchAll = async (q) => {
    if (!q) return emptyResults();

    const [rawTracks, rawArtists, rawAlbums] = await searchDao.searchAllSafe(q);

    const [tracks, artists, albums] = await Promise.all([
        Promise.all(rawTracks.map(searchDao.signSearchItem)),
        Promise.all(rawArtists.map(searchDao.signSearchItem)),
        Promise.all(rawAlbums.map(searchDao.signSearchItem)),
    ]);

    return {
        tracks,
        artists,
        albums,
        textSuggestions: buildSuggestions(tracks, artists, albums, q),
    };
};

const searchTracks = (q) => searchDao.searchTracks(q);
const searchArtists = (q) => searchDao.searchArtists(q);
const searchAlbums = (q) => searchDao.searchAlbums(q);

export default { searchAll, searchTracks, searchArtists, searchAlbums };
