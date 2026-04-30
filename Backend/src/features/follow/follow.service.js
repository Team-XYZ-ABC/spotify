import ApiError from "../../core/http/api-error.js";

class FollowService {
    async followArtist() {
        throw ApiError.notImplemented();
    }
    async unfollowArtist() {
        throw ApiError.notImplemented();
    }
    async getArtistFollowers() {
        throw ApiError.notImplemented();
    }
}

export default new FollowService();
