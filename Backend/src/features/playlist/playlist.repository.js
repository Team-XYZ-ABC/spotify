import BaseRepository from "../../core/database/base.repository.js";
import PlaylistModel from "./playlist.model.js";

export const playlistPopulate = [
    { path: "owner", select: "displayName username email avatar avatarKey" },
    { path: "collaborators", select: "displayName username email avatar avatarKey" },
    {
        path: "tracks.track",
        select: "title duration coverImage coverImageKey primaryArtist artists album",
        populate: [
            { path: "primaryArtist", select: "stageName" },
            { path: "artists", select: "stageName" },
            { path: "album", select: "title" },
        ],
    },
];

class PlaylistRepository extends BaseRepository {
    constructor() {
        super(PlaylistModel);
    }

    findByIdPopulated(id) {
        return PlaylistModel.findById(id).populate(playlistPopulate).exec();
    }

    findForUser(userId) {
        return PlaylistModel.find({
            $or: [{ owner: userId }, { collaborators: userId }],
        })
            .sort({ updatedAt: -1 })
            .populate(playlistPopulate)
            .exec();
    }

    updateByIdPopulated(id, update) {
        return PlaylistModel.findByIdAndUpdate(id, update, { new: true })
            .populate(playlistPopulate)
            .exec();
    }

    updateWithPipelinePopulated(filter, pipeline) {
        return PlaylistModel.findOneAndUpdate(filter, pipeline, {
            new: true,
            updatePipeline: true,
        })
            .populate(playlistPopulate)
            .exec();
    }

    selectTracks(id) {
        return PlaylistModel.findById(id).select("tracks").exec();
    }
}

export default new PlaylistRepository();
