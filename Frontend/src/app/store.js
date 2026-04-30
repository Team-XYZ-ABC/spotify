import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/features/auth/slice/auth.slice'
import profileReducer from '@/features/profile/slice/profile.slice'
import playlistReducer from '@/features/playlist/slice/playlist.slice'
import playerReducer from '@/features/player/slice/player.slice'
import searchReducer from '@/features/search/slice/search.slice'

const store = configureStore({
    reducer: {
        user: userReducer,
        profile: profileReducer,
        playlist: playlistReducer,
        player: playerReducer,
        search: searchReducer
    }
})

export default store