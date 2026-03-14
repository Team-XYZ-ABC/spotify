import { Router } from "express";
import { getArtistRecommendations, getDailyMix, getDiscoverWeekly, getTrackRecommendations } from "../controllers/recommendation.controller.js";

const recommendationRouter = Router();

recommendationRouter.get("/discover-weekly", getDiscoverWeekly);

recommendationRouter.get("/daily-mix", getDailyMix);

recommendationRouter.get("/artist/:artistId", getArtistRecommendations);

recommendationRouter.get("/track/:trackId", getTrackRecommendations);

export default recommendationRouter;