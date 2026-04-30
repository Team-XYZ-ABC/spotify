import asyncHandler from "../../core/http/async-handler.js";
import searchService from "./search.service.js";

export const searchAll = asyncHandler(async (req, res) => {
    const data = await searchService.searchAll(String(req.query.q || ""));
    res.json(data);
});

export const searchTracks = asyncHandler(async (req, res) => {
    const tracks = await searchService.searchTracks(String(req.query.q || ""));
    res.json({ tracks });
});

export const searchArtists = asyncHandler(async (req, res) => {
    const artists = await searchService.searchArtists(String(req.query.q || ""));
    res.json({ artists });
});

export const searchAlbums = asyncHandler(async (req, res) => {
    const albums = await searchService.searchAlbums(String(req.query.q || ""));
    res.json({ albums });
});
