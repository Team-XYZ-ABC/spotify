import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "profile",

    initialState: {
        profile: null,
        otherUser: null,
        artist: null,
        loading: false,
        error: null
    },

    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setProfile: (state, action) => {
            state.profile = action.payload.user;
            state.artist = action.payload.artist || null;
            state.loading = false;
            state.error = null;
        },

        setOtherUser: (state, action) => {
            state.otherUser = action.payload.user;
            state.artist = action.payload.artist || null;
            state.loading = false;
        },

        updateProfileSuccess: (state, action) => {
            state.profile = action.payload;
            state.loading = false;
        },

        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        clearProfile: (state) => {
            state.profile = null;
            state.artist = null;
        }
    }
});

export const {
    setLoading,
    setProfile,
    setOtherUser,
    updateProfileSuccess,
    setError,
    clearProfile
} = profileSlice.actions;

export default profileSlice.reducer;