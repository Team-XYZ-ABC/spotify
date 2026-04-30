import ApiError from "../../core/http/api-error.js";

class LibraryService {
    async getLikedTracks() {
        throw ApiError.notImplemented();
    }
    async likeTrack() {
        throw ApiError.notImplemented();
    }
    async unlikeTrack() {
        throw ApiError.notImplemented();
    }
}

export default new LibraryService();
