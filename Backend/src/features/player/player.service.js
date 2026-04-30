import ApiError from "../../core/http/api-error.js";

class PlayerService {
    async getCurrentPlayback() {
        throw ApiError.notImplemented();
    }
    async playTrack() {
        throw ApiError.notImplemented();
    }
    async pauseTrack() {
        throw ApiError.notImplemented();
    }
    async nextTrack() {
        throw ApiError.notImplemented();
    }
    async previousTrack() {
        throw ApiError.notImplemented();
    }
    async addToQueue() {
        throw ApiError.notImplemented();
    }
    async getQueue() {
        throw ApiError.notImplemented();
    }
}

export default new PlayerService();
