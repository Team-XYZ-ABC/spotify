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
} from "../controllers/recommendation.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

// Optional auth: attaches req.user if a valid token is present but never rejects
const optionalAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return next();
    isAuthenticated(req, res, next);
};

const recommendationRouter = Router();

// ── Feed sections ─────────────────────────────────────────────────────────────
// GET /api/v1/recommendations/recommended?page=1&limit=10
recommendationRouter.get("/recommended", optionalAuth, getRecommendedForYou);

// GET /api/v1/recommendations/popular?page=1&limit=10
recommendationRouter.get("/popular", getPopular);

// GET /api/v1/recommendations/episodes?page=1&limit=10
recommendationRouter.get("/episodes", optionalAuth, getEpisodesYouMightLike);

// GET /api/v1/recommendations/featured-charts?page=1&limit=10&genre=Pop
recommendationRouter.get("/featured-charts", getFeaturedCharts);

// ── Legacy routes ─────────────────────────────────────────────────────────────
recommendationRouter.get("/discover-weekly", getDiscoverWeekly);
recommendationRouter.get("/daily-mix", getDailyMix);
recommendationRouter.get("/artist/:artistId", getArtistRecommendations);
recommendationRouter.get("/track/:trackId", getTrackRecommendations);

export default recommendationRouter;