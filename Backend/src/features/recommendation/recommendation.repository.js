import TrackModel from "../track/track.model.js";

/**
 * Aggregation-based recommendation queries — Mongo-specific by design.
 * A different DB driver would supply its own repository implementation.
 */
class RecommendationRepository {
    aggregateTracks(pipeline) {
        return TrackModel.aggregate(pipeline);
    }
}

export default new RecommendationRepository();
