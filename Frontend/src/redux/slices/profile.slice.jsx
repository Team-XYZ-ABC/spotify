// redux/slices/profile.slice.js

import { createSlice } from "@reduxjs/toolkit";

/**
 * Profile Slice
 * Handles user + artist state
 */
const profileSlice = createSlice({
    name: "profile",

    initialState: {
        profile: null,
        otherUser: null,
        artist: null,
        loading: false,
        error: null,
    },

    reducers: {
        /**
         * Toggle loading state
         */
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        /**
         * Set logged-in user profile
         */
        setProfile: (state, action) => {
            state.profile = action.payload.user;
            state.artist = action.payload.artist || null;
            state.loading = false;
            state.error = null;
        },

        /**
         * Set other user's profile
         */
        setOtherUser: (state, action) => {
            state.otherUser = action.payload.user;
            state.artist = action.payload.artist || null;
            state.loading = false;
        },

        /**
         * Update current user profile
         */
        updateProfileSuccess: (state, action) => {
            // Merge — preserves fields like role, subscription, _id that
            // the update response doesn't return
            state.profile = { ...state.profile, ...action.payload };
            state.loading = false;
        },

        /**
         * Set error state
         */
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        /**
         * Clear profile (logout use-case)
         */
        clearProfile: (state) => {
            state.profile = null;
            state.artist = null;
        },
    },
});

export const {
    setLoading,
    setProfile,
    setOtherUser,
    updateProfileSuccess,
    setError,
    clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;