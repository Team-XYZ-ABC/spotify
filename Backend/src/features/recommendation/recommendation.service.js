import * as recommendationDao from "./recommendation.dao.js";
import * as userDao from "../user/user.dao.js";
import TrackModel from "../track/track.model.js";
import { signImages } from "../../utils/media-url.util.js";
import { parsePagination } from "../../utils/pagination.util.js";

const ARTIST_LOOKUP = {
    $lookup: {
        from: "artists",
        localField: "primaryArtist",
        foreignField: "_id",
        as: "artistInfo",
    },
};
const ARTIST_NAME_FIELD = {
    $addFields: {
        primaryArtistName: {
            $ifNull: [{ $arrayElemAt: ["$artistInfo.stageName", 0] }, "Unknown"],
        },
    },
};

const buildPaginated = async ({ basePipeline, query }) => {
    const { page, limit, skip } = parsePagination(query);
    const dataPipeline = [
        ...basePipeline,
        ARTIST_LOOKUP,
        ARTIST_NAME_FIELD,
        { $project: { artistInfo: 0 } },
        { $skip: skip },
        { $limit: limit },
    ];
    const countPipeline = [...basePipeline, { $count: "total" }];

    const [tracks, totalResult] = await Promise.all([
        recommendationDao.aggregateTracks(dataPipeline),
        recommendationDao.aggregateTracks(countPipeline),
    ]);
    const total = totalResult[0]?.total || 0;
    const data = await signImages(tracks);
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + limit < total,
        },
    };
};

const recommendedForYou = async (query, userId) => {
    let basePipeline = [];
    if (userId) {
        const user = await userDao.findById(userId, {
            select: "likedTracks",
            lean: true,
        });
        const likedIds = user?.likedTracks || [];
        if (likedIds.length > 0) {
            const likedTracks = await TrackModel.find({ _id: { $in: likedIds } })
                .select("genres")
                .lean();
            const genreSet = [...new Set(likedTracks.flatMap((t) => t.genres || []))];
            if (genreSet.length > 0) {
                basePipeline = [
                    {
                        $match: {
                            isPublished: true,
                            genres: { $in: genreSet },
                            _id: { $nin: likedIds },
                        },
                    },
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
    if (basePipeline.length === 0) {
        basePipeline = [
            { $match: { isPublished: true } },
            { $sort: { playCount: -1, createdAt: -1 } },
        ];
    }
    return buildPaginated({ basePipeline, query });
};

const popular = (query) => {
    const basePipeline = [
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
    ];
    return buildPaginated({ basePipeline, query });
};

const episodesYouMightLike = async (query, userId) => {
    let excludeIds = [];
    if (userId) {
        const user = await userDao.findById(userId, {
            select: "likedTracks",
            lean: true,
        });
        excludeIds = user?.likedTracks || [];
    }
    const matchStage = {
        isPublished: true,
        ...(excludeIds.length > 0 && { _id: { $nin: excludeIds } }),
    };
    const basePipeline = [
        { $match: matchStage },
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
                                                86400000,
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
    ];
    return buildPaginated({ basePipeline, query });
};

const featuredCharts = (query) => {
    const genre = query.genre || null;
    const matchStage = {
        isPublished: true,
        ...(genre && { genres: genre }),
    };
    const basePipeline = [
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
    ];
    return buildPaginated({ basePipeline, query });
};

export default { recommendedForYou, popular, episodesYouMightLike, featuredCharts };
