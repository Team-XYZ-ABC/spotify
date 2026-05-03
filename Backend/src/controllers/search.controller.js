// export const globalSearch = (req, res) => {
//   res.send("GLOBAL SEARCH");
// };

import albumModel from "../models/album.model.js";
import ArtistModel from "../models/artist.model.js";
import TrackModel from "../models/track.model.js";
import { getPresignedGetUrl, getS3KeyFromUrl } from "../services/s3.service.js";

// export const searchTracks = (req, res) => {
//   res.send("SEARCH TRACKS");
// };

// export const searchArtists = (req, res) => {
//   res.send("SEARCH ARTISTS");
// };

// export const searchAlbums = (req, res) => {
//   res.send("SEARCH ALBUMS");
// };

// export const searchPlaylists = (req, res) => {
//   res.send("SEARCH PLAYLISTS");
// };

// export const searchSuggestions = (req, res) => {
//   res.send("SEARCH SUGGESTIONS");
// };


export const searchTracks = async (req, res) => {
  const { q } = req.query;

  const tracks = await TrackModel.aggregate([
    {
      $search: {
        index: "default",
        autocomplete: {
          query: q,
          path: "title",
          fuzzy: { maxEdits: 1 }
        }
      }
    },
    { $limit: 10 }
  ]);

  res.json({ tracks });
};

export const searchArtists = async (req, res) => {
  const { q } = req.query;

  const artists = await ArtistModel.aggregate([
    {
      $search: {
        index: "default",
        autocomplete: {
          query: q,
          path: "name",
          fuzzy: { maxEdits: 1 }
        }
      }
    },
    { $limit: 5 }
  ]);

  res.json({ artists });
};


export const searchAlbums = async (req, res) => {
  const { q } = req.query;

  const albums = await albumModel.aggregate([
    {
      $search: {
        index: "default",
        autocomplete: {
          query: q,
          path: "title",
          fuzzy: { maxEdits: 1 }
        }
      }
    },
    { $limit: 5 }
  ]);

  res.json({ albums });
};

export const searchAll = async (req, res) => {
  const { q } = req.query;

  try {
    if (!q) {
      return res.json({
        tracks: [],
        artists: [],
        albums: [],
        textSuggestions: []
      });
    }

    const [rawTracks, rawArtists, rawAlbums] = await Promise.all([

      // 🎵 Tracks (using Atlas Search)
      TrackModel.aggregate([
        {
          $search: {
            index: "default",
            autocomplete: {
              query: q,
              path: "title",
              fuzzy: { maxEdits: 1 }
            }
          }
        },
        { $limit: 10 }
      ]).catch((err) => { console.error("Track search error:", err.message); return []; }),

      // 🎤 Artists (using Atlas Search)
      ArtistModel.aggregate([
        {
          $search: {
            index: "default",
            autocomplete: {
              query: q,
              path: "stageName",
              fuzzy: { maxEdits: 1 }
            }
          }
        },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
      ]).catch((err) => { console.error("Artist search error:", err.message); return []; }),

      // 💿 Albums (using Atlas Search)
      albumModel.aggregate([
        {
          $search: {
            index: "default",
            autocomplete: {
              query: q,
              path: "title",
              fuzzy: { maxEdits: 1 }
            }
          }
        },
        { $limit: 5 }
      ]).catch((err) => { console.error("Album search error:", err.message); return []; })

    ]);

    // Helper to generate presigned S3 URLs for images
    const signCoverImage = async (item) => {
      const clonedItem = { ...item };
      
      // Sign main coverImage (for tracks, albums, artists)
      let coverImage = clonedItem.coverImage || "";
      const imageKey = clonedItem.coverImageKey || getS3KeyFromUrl(coverImage);
      if (imageKey) {
        try {
          coverImage = await getPresignedGetUrl(imageKey, 86400);
        } catch { }
      }
      clonedItem.coverImage = coverImage;

      // Sign nested user avatar (for artists)
      if (clonedItem.user && typeof clonedItem.user === 'object') {
        let avatar = clonedItem.user.avatar || "";
        const avatarKey = clonedItem.user.avatarKey || getS3KeyFromUrl(avatar);
        if (avatarKey && avatarKey.length > 5) { // Ensure it's a valid key
          try {
            avatar = await getPresignedGetUrl(avatarKey, 86400);
          } catch { }
        }
        clonedItem.user.avatar = avatar;
      }

      return clonedItem;
    };

    const [tracks, artists, albums] = await Promise.all([
      Promise.all(rawTracks.map(signCoverImage)),
      Promise.all(rawArtists.map(signCoverImage)),
      Promise.all(rawAlbums.map(signCoverImage))
    ]);

    const allSugg = [
      ...tracks.map(t => ({ name: t.title, type: "track" })),
      ...artists.map(a => ({ name: a.stageName, type: "artist" })),
      ...albums.map(a => ({ name: a.title, type: "album" }))
    ];

    const lowerQ = q.toLowerCase();
    allSugg.sort((a, b) => {
      const aName = (a.name || "").toLowerCase();
      const bName = (b.name || "").toLowerCase();

      const aScore = aName === lowerQ ? 3 : (aName.startsWith(lowerQ) ? 2 : (aName.includes(lowerQ) ? 1 : 0));
      const bScore = bName === lowerQ ? 3 : (bName.startsWith(lowerQ) ? 2 : (bName.includes(lowerQ) ? 1 : 0));

      if (aScore !== bScore) return bScore - aScore;
      return aName.length - bName.length;
    });

    const uniqueSuggestions = [];
    const seen = new Set();
    for (const item of allSugg) {
      if (!seen.has(item.name)) {
        seen.add(item.name);
        uniqueSuggestions.push(item);
      }
    }

    console.log("QUERY:", q);
    console.log("TRACKS:", tracks.length);
    console.log("ARTISTS:", artists.length);
    console.log("ALBUMS:", albums.length);

    res.json({
      tracks,
      artists,
      albums,
      textSuggestions: uniqueSuggestions.slice(0, 5)
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Search failed" });
  }
};