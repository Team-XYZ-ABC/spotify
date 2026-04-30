import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: {
      tracks: [],
      artists: [],
      albums: [],
      textSuggestions: []   // 🔥 ADD THIS
    },
    loading: false
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setResults: (state, action) => {
      state.results = action.payload;
      state.loading = false;
    }
  }
});

export const {setLoading , setResults} = searchSlice.actions;

export default searchSlice.reducer;