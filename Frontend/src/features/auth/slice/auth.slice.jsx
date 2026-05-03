import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: false,
    isInitializing: true,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action) => { state.loading = action.payload; },
        setInitializing: (state, action) => { state.isInitializing = action.payload; },
        setError: (state, action) => { 
            state.error = action.payload; 
            state.loading = false; 
            state.isInitializing = false; 
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.isInitializing = false;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isInitializing = false;
        },
    },
});

export const { setUser, setLoading, setInitializing, setError, logout } = authSlice.actions;

export default authSlice.reducer;