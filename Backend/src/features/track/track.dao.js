import TrackModel from "./track.model.js";

export const create = (data) => TrackModel.create(data);

export const findById = (id, opts = {}) => {
    let q = TrackModel.findById(id);
    if (opts.select) q = q.select(opts.select);
    return q.exec();
};

export const updateById = (id, data) =>
    TrackModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();

export const updateStatus = (id, { status, progress, statusMessage, hls }) => {
    const update = {};
    if (status !== undefined) update.status = status;
    if (progress !== undefined) update.progress = progress;
    if (statusMessage !== undefined) update.statusMessage = statusMessage;
    if (hls !== undefined) update.hls = hls;
    return TrackModel.findByIdAndUpdate(id, update, { new: true }).exec();
};

export const deleteById = (id) => TrackModel.findByIdAndDelete(id).exec();

export const findWithArtistAndAlbum = (id) =>
    TrackModel.findById(id)
        .populate("artists", "name")
        .populate("album", "title")
        .exec();

export const findByArtist = (primaryArtist) =>
    TrackModel.find({ primaryArtist })
        .sort({ createdAt: -1 })
        .select(
            "title artists album genres lang isExplicit copyrightOwner isrc availableCountries duration coverImage coverImageKey status progress statusMessage hls createdAt updatedAt"
        )
        .lean()
        .exec();

export const searchByTitle = (query, limit = 20) => {
    const filter = query ? { title: new RegExp(query, "i") } : {};
    return TrackModel.find(filter)
        .select("title duration coverImage coverImageKey primaryArtist artists album")
        .populate("primaryArtist", "stageName")
        .populate("artists", "stageName")
        .populate("album", "title")
        .limit(limit)
        .exec();
};

export const aggregate = (pipeline) => TrackModel.aggregate(pipeline);
