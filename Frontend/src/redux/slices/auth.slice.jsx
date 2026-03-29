import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },

        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        logout: (state) => {
            state.user = null;
        }
    }
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;

export default authSlice.reducer;