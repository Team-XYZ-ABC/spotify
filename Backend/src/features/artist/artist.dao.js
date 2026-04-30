import ArtistModel from "./artist.model.js";

export const create = (data, opts = {}) => {
    if (opts.session) {
        return ArtistModel.create([data], { session: opts.session }).then((arr) => arr[0]);
    }
    return ArtistModel.create(data);
};

export const findByUser = (userId) => ArtistModel.findOne({ user: userId }).exec();
