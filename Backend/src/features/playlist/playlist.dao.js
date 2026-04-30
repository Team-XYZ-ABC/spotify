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

export const create = (data) => PlaylistModel.create(data);

export const findById = (id) => PlaylistModel.findById(id).exec();

export const deleteById = (id) => PlaylistModel.findByIdAndDelete(id).exec();

export const findByIdPopulated = (id) =>
    PlaylistModel.findById(id).populate(playlistPopulate).exec();

export const findForUser = (userId) =>
    PlaylistModel.find({ $or: [{ owner: userId }, { collaborators: userId }] })
        .sort({ updatedAt: -1 })
        .populate(playlistPopulate)
        .exec();

export const updateByIdPopulated = (id, update) =>
    PlaylistModel.findByIdAndUpdate(id, update, { new: true })
        .populate(playlistPopulate)
        .exec();

export const updateWithPipelinePopulated = (filter, pipeline) =>
    PlaylistModel.findOneAndUpdate(filter, pipeline, {
        new: true,
        updatePipeline: true,
    })
        .populate(playlistPopulate)
        .exec();

export const selectTracks = (id) =>
    PlaylistModel.findById(id).select("tracks").exec();
