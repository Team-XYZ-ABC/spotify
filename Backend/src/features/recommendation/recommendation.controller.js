import asyncHandler from "../../core/http/async-handler.js";
import recommendationService from "./recommendation.service.js";
import ApiError from "../../core/http/api-error.js";

const okPaginated = (res, payload) =>
    res.status(200).json({ success: true, ...payload });

export const getRecommendedForYou = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.user?.id;
    const data = await recommendationService.recommendedForYou(req.query, userId);
    return okPaginated(res, data);
});

export const getPopular = asyncHandler(async (req, res) => {
    const data = await recommendationService.popular(req.query);
    return okPaginated(res, data);
});

export const getEpisodesYouMightLike = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.user?.id;
    const data = await recommendationService.episodesYouMightLike(
        req.query,
        userId
    );
    return okPaginated(res, data);
});

export const getFeaturedCharts = asyncHandler(async (req, res) => {
    const data = await recommendationService.featuredCharts(req.query);
    return okPaginated(res, data);
});

// Legacy aliases
export const getDiscoverWeekly = getRecommendedForYou;
export const getDailyMix = getPopular;

export const getArtistRecommendations = asyncHandler(async () => {
    throw ApiError.notImplemented();
});
export const getTrackRecommendations = asyncHandler(async () => {
    throw ApiError.notImplemented();
});
