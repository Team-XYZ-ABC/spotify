import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/auth.slice'
import profileReducer from "./slices/profile.slice"


const store = configureStore({
    reducer: {
        user: userReducer,
        profile: profileReducer
    }
})

export default store