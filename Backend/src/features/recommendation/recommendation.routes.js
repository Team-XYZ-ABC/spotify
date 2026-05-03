import { Router } from "express";
import {
    getRecommendedForYou,
    getPopular,
    getEpisodesYouMightLike,
    getFeaturedCharts,
    getArtistRecommendations,
    getDailyMix,
    getDiscoverWeekly,
    getTrackRecommendations,
} from "./recommendation.controller.js";
import { optionalAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/recommended", optionalAuth, getRecommendedForYou);
router.get("/popular", getPopular);
router.get("/episodes", optionalAuth, getEpisodesYouMightLike);
router.get("/featured-charts", getFeaturedCharts);

// Legacy / placeholder routes
router.get("/discover-weekly", getDiscoverWeekly);
router.get("/daily-mix", getDailyMix);
router.get("/artist/:artistId", getArtistRecommendations);
router.get("/track/:trackId", getTrackRecommendations);

export default router;
