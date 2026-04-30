import ApiError from "../../core/http/api-error.js";

class AlbumService {
    async createAlbum() {
        throw ApiError.notImplemented();
    }
    async getAlbum() {
        throw ApiError.notImplemented();
    }
    async updateAlbum() {
        throw ApiError.notImplemented();
    }
    async deleteAlbum() {
        throw ApiError.notImplemented();
    }
    async getAlbumTracks() {
        throw ApiError.notImplemented();
    }
    async getArtistAlbums() {
        throw ApiError.notImplemented();
    }
}

export default new AlbumService();
