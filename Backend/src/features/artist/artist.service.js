import ApiError from "../../core/http/api-error.js";

class ArtistService {
    async getArtist() {
        throw ApiError.notImplemented();
    }
    async getArtistTopTracks() {
        throw ApiError.notImplemented();
    }
    async getArtistAlbums() {
        throw ApiError.notImplemented();
    }
    async getArtistSingles() {
        throw ApiError.notImplemented();
    }
    async getArtistAppearsOn() {
        throw ApiError.notImplemented();
    }
    async getArtistFollowers() {
        throw ApiError.notImplemented();
    }
    async getArtistAnalytics() {
        throw ApiError.notImplemented();
    }
    async updateArtistProfile() {
        throw ApiError.notImplemented();
    }
}

export default new ArtistService();
