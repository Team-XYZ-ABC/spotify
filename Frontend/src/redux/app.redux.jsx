import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/auth.slice'
import profileReducer from "./slices/profile.slice"
import playlistReducer from "./slices/playlist.slice"
import playerReducer from "./slices/player.slice"

const store = configureStore({
    reducer: {
        user: userReducer,
        profile: profileReducer,
        playlist: playlistReducer,
        player: playerReducer,
    }
})

export default store