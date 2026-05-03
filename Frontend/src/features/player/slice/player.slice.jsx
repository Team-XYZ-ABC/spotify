import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentTrack: null, // { id, title, artist, image, audioUrl, duration, durationSeconds }
    queue: [],
    queueIndex: -1,
    isPlaying: false,
    shuffleEnabled: false,
    repeatMode: "off", // "off" | "one" | "all"
};

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        // Load a track (and optionally its queue context)
        loadTrack(state, action) {
            const { track, queue, index } = action.payload;
            state.currentTrack = track;
            if (queue?.length) {
                state.queue = queue;
                state.queueIndex = index ?? 0;
            } else if (!state.queue.length) {
                state.queue = [track];
                state.queueIndex = 0;
            }
            state.isPlaying = true;
        },

        setPlaying(state, action) {
            state.isPlaying = action.payload;
        },

        // Jump to a specific queue position
        setQueueIndex(state, action) {
            const idx = action.payload;
            if (idx >= 0 && idx < state.queue.length) {
                state.queueIndex = idx;
                state.currentTrack = state.queue[idx];
                state.isPlaying = true;
            }
        },

        toggleShuffle(state) {
            state.shuffleEnabled = !state.shuffleEnabled;
        },

        cycleRepeat(state) {
            const modes = ["off", "one", "all"];
            const current = modes.indexOf(state.repeatMode);
            state.repeatMode = modes[(current + 1) % modes.length];
        },
    },
});

export const { loadTrack, setPlaying, setQueueIndex, toggleShuffle, cycleRepeat } =
    playerSlice.actions;

export default playerSlice.reducer;
