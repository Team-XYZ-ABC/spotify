import TrackModel from "../track/track.model.js";

export const aggregateTracks = (pipeline) => TrackModel.aggregate(pipeline);
