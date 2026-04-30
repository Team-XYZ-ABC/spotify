import TrackModel from "../models/track.model.js";
import UserModel from "../models/user.model.js";
import { getPresignedGetUrl, getS3KeyFromUrl } from "../services/s3.service.js";

// Attach fresh presigned cover image URLs to a list of tracks
const attachCoverUrls = async (tracks) => {
  return Promise.all(
    tracks.map(async (track) => {
      const t = track.toObject ? track.toObject() : { ...track };
      const key = t.coverImageKey || getS3KeyFromUrl(t.coverImage);
      if (key) {
        t.coverImage = await getPresignedGetUrl(key, 86400);
      }
      return t;
    })
  );
};

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// ── Recommended For You ────────────────────────────────────────────────────────
// Personalised if authenticated: match genres from user's liked tracks.
// Falls back to top-played tracks for unauthenticated users.
export const getRecommendedForYou = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const userId = req.user?._id || req.user?.id;

    let pipeline = [];

    if (userId) {
      // Fetch genres the user has liked
      const user = await UserModel.findById(userId).select("likedTracks").lean();
      const likedIds = user?.likedTracks || [];

      if (likedIds.length > 0) {
        const likedTracks = await TrackModel.find({ _id: { $in: likedIds } })
          .select("genres")
          .lean();
        const genreSet = [...new Set(likedTracks.flatMap((t) => t.genres || []))];

        if (genreSet.length > 0) {
          pipeline = [
            {
              $match: {
                isPublished: true,
                genres: { $in: genreSet },
                _id: { $nin: likedIds },
              },
            },
            // Score: weight by genre overlap count + normalised play count
            {
              $addFields: {
                genreScore: {
                  $size: {
                    $ifNull: [
                      { $setIntersection: ["$genres", genreSet] },
                      [],
                    ],
                  },
                },
              },
            },
            {
              $addFields: {
                score: {
                  $add: [
                    { $multiply: ["$genreScore", 10] },
                    { $divide: [{ $ifNull: ["$playCount", 0] }, 1000] },
                  ],
                },
              },
            },
            { $sort: { score: -1, createdAt: -1 } },
          ];
        }
      }
    }

    // Fallback: sort by playCount
    if (pipeline.length === 0) {
      pipeline = [
        { $match: { isPublished: true } },
        { $sort: { playCount: -1, createdAt: -1 } },
      ];
    }

    pipeline.push(
      {
        $lookup: {
          from: "artists",
          localField: "primaryArtist",
          foreignField: "_id",
          as: "artistInfo",
        },
      },
      {
        $addFields: {
          primaryArtistName: { $ifNull: [{ $arrayElemAt: ["$artistInfo.stageName", 0] }, "Unknown"] },
        },
      },
      { $project: { artistInfo: 0 } },
      { $skip: skip },
      { $limit: limit }
    );

    const [tracks, totalResult] = await Promise.all([
      TrackModel.aggregate(pipeline),
      TrackModel.aggregate([
        ...(pipeline.slice(0, pipeline.length - 2)), // reuse match+sort
        { $count: "total" },
      ]),
    ]);

    const total = totalResult[0]?.total || 0;
    const enriched = await attachCoverUrls(tracks);

    res.status(200).json({
      success: true,
      data: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + limit < total },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Popular ────────────────────────────────────────────────────────────────────
// Top tracks ranked by a weighted score of playCount + likeCount + shareCount.
export const getPopular = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const countPipeline = [
      { $match: { isPublished: true } },
      { $count: "total" },
    ];

    const dataPipeline = [
      { $match: { isPublished: true } },
      {
        $addFields: {
          popularityScore: {
            $add: [
              { $multiply: [{ $ifNull: ["$playCount", 0] }, 1] },
              { $multiply: [{ $ifNull: ["$likeCount", 0] }, 3] },
              { $multiply: [{ $ifNull: ["$shareCount", 0] }, 5] },
            ],
          },
        },
      },
      { $sort: { popularityScore: -1, createdAt: -1 } },
      {
        $lookup: {
          from: "artists",
          localField: "primaryArtist",
          foreignField: "_id",
          as: "artistInfo",
        },
      },
      {
        $addFields: {
          primaryArtistName: { $ifNull: [{ $arrayElemAt: ["$artistInfo.stageName", 0] }, "Unknown"] },
        },
      },
      { $project: { artistInfo: 0, popularityScore: 0 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const [tracks, totalResult] = await Promise.all([
      TrackModel.aggregate(dataPipeline),
      TrackModel.aggregate(countPipeline),
    ]);

    const total = totalResult[0]?.total || 0;
    const enriched = await attachCoverUrls(tracks);

    res.status(200).json({
      success: true,
      data: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + limit < total },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Episodes You Might Like ────────────────────────────────────────────────────
// Tracks the user hasn't heard much — fresh discoveries sorted by recency + likes.
export const getEpisodesYouMightLike = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const userId = req.user?._id || req.user?.id;

    const excludeIds = [];
    if (userId) {
      const user = await UserModel.findById(userId).select("likedTracks").lean();
      (user?.likedTracks || []).forEach((id) => excludeIds.push(id));
    }

    const matchStage = {
      isPublished: true,
      ...(excludeIds.length > 0 && { _id: { $nin: excludeIds } }),
    };

    const dataPipeline = [
      { $match: matchStage },
      // Favour newer, liked tracks the user hasn't seen
      {
        $addFields: {
          freshnessScore: {
            $add: [
              { $multiply: [{ $ifNull: ["$likeCount", 0] }, 2] },
              {
                $divide: [
                  1,
                  {
                    $add: [
                      1,
                      {
                        $divide: [
                          { $subtract: [new Date(), "$createdAt"] },
                          86400000, // ms per day
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      { $sort: { freshnessScore: -1 } },
      {
        $lookup: {
          from: "artists",
          localField: "primaryArtist",
          foreignField: "_id",
          as: "artistInfo",
        },
      },
      {
        $addFields: {
          primaryArtistName: { $ifNull: [{ $arrayElemAt: ["$artistInfo.stageName", 0] }, "Unknown"] },
        },
      },
      { $project: { artistInfo: 0, freshnessScore: 0 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const countPipeline = [{ $match: matchStage }, { $count: "total" }];

    const [tracks, totalResult] = await Promise.all([
      TrackModel.aggregate(dataPipeline),
      TrackModel.aggregate(countPipeline),
    ]);

    const total = totalResult[0]?.total || 0;
    const enriched = await attachCoverUrls(tracks);

    res.status(200).json({
      success: true,
      data: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + limit < total },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Featured Charts ────────────────────────────────────────────────────────────
// Top tracks per genre — returns genre buckets or a flat sorted chart list.
export const getFeaturedCharts = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const genre = req.query.genre || null; // optional genre filter

    const matchStage = {
      isPublished: true,
      ...(genre && { genres: genre }),
    };

    const dataPipeline = [
      { $match: matchStage },
      {
        $addFields: {
          chartScore: {
            $add: [
              { $multiply: [{ $ifNull: ["$playCount", 0] }, 1] },
              { $multiply: [{ $ifNull: ["$likeCount", 0] }, 4] },
              { $multiply: [{ $ifNull: ["$shareCount", 0] }, 6] },
            ],
          },
        },
      },
      { $sort: { chartScore: -1 } },
      {
        $lookup: {
          from: "artists",
          localField: "primaryArtist",
          foreignField: "_id",
          as: "artistInfo",
        },
      },
      {
        $addFields: {
          primaryArtistName: { $ifNull: [{ $arrayElemAt: ["$artistInfo.stageName", 0] }, "Unknown"] },
          topGenre: { $ifNull: [{ $arrayElemAt: ["$genres", 0] }, "Various"] },
        },
      },
      { $project: { artistInfo: 0, chartScore: 0 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const countPipeline = [{ $match: matchStage }, { $count: "total" }];

    const [tracks, totalResult] = await Promise.all([
      TrackModel.aggregate(dataPipeline),
      TrackModel.aggregate(countPipeline),
    ]);

    const total = totalResult[0]?.total || 0;
    const enriched = await attachCoverUrls(tracks);

    res.status(200).json({
      success: true,
      data: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + limit < total },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Legacy stubs kept for backwards compat ────────────────────────────────────
export const getDiscoverWeekly = getRecommendedForYou;
export const getDailyMix = getPopular;
export const getArtistRecommendations = (req, res) => {
  res.status(501).json({ message: "Not implemented" });
};
export const getTrackRecommendations = (req, res) => {
  res.status(501).json({ message: "Not implemented" });
};