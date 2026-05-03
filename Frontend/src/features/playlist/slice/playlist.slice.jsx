import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addCollaboratorsService,
    addTrackService,
    createPlaylistService,
    deletePlaylistService,
    getMyPlaylistsService,
    getPlaylistByIdService,
    removeCollaboratorService,
    removeTrackService,
    reorderTracksService,
    searchCollaboratorsService,
    searchTracksService,
    updatePlaylistService,
} from "@/features/playlist/services/playlist.service";

const getErrorMessage = (error, fallback) => error?.message || fallback;

const upsertPlaylist = (state, playlist) => {
    const index = state.playlists.findIndex((item) => item.id === playlist.id);
    if (index >= 0) {
        state.playlists[index] = playlist;
    } else {
        state.playlists.unshift(playlist);
    }

    if (state.activePlaylist?.id === playlist.id) {
        state.activePlaylist = playlist;
    }
};

export const fetchMyPlaylists = createAsyncThunk(
    "playlist/fetchMyPlaylists",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getMyPlaylistsService();
            return res.playlists || [];
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to fetch playlists"));
        }
    }
);

export const fetchPlaylistById = createAsyncThunk(
    "playlist/fetchPlaylistById",
    async (playlistId, { rejectWithValue }) => {
        try {
            const res = await getPlaylistByIdService(playlistId);
            return res.playlist;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to fetch playlist"));
        }
    }
);

export const createPlaylistThunk = createAsyncThunk(
    "playlist/create",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await createPlaylistService(payload);
            return res.playlist;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to create playlist"));
        }
    }
);

export const updatePlaylistThunk = createAsyncThunk(
    "playlist/update",
    async ({ playlistId, payload }, { rejectWithValue }) => {
        try {
            const res = await updatePlaylistService(playlistId, payload);
            return res.playlist;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to update playlist"));
        }
    }
);

export const deletePlaylistThunk = createAsyncThunk(
    "playlist/delete",
    async (playlistId, { rejectWithValue }) => {
        try {
            await deletePlaylistService(playlistId);
            return playlistId;
        } catch (error) {
            return rejectWithValue({
                playlistId,
                message: getErrorMessage(error, "Failed to delete playlist"),
            });
        }
    }
);

export const addCollaboratorsThunk = createAsyncThunk(
    "playlist/addCollaborators",
    async ({ playlistId, collaboratorIds }, { rejectWithValue }) => {
        try {
            const res = await addCollaboratorsService(playlistId, collaboratorIds);
            return res.playlist;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to add collaborators"));
        }
    }
);

export const removeCollaboratorThunk = createAsyncThunk(
    "playlist/removeCollaborator",
    async ({ playlistId, userId }, { rejectWithValue }) => {
        try {
            const res = await removeCollaboratorService(playlistId, userId);
            return res.playlist;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to remove collaborator"));
        }
    }
);

export const searchCollaboratorsThunk = createAsyncThunk(
    "playlist/searchCollaborators",
    async (query, { rejectWithValue }) => {
        try {
            const res = await searchCollaboratorsService(query);
            return res.users || [];
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to search users"));
        }
    }
);

export const searchTracksThunk = createAsyncThunk(
    "playlist/searchTracks",
    async ({ query, excludePlaylistId }, { rejectWithValue }) => {
        try {
            const res = await searchTracksService(query, excludePlaylistId);
            return res.tracks || [];
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to search tracks"));
        }
    }
);

export const addTrackToPlaylistThunk = createAsyncThunk(
    "playlist/addTrack",
    async ({ playlistId, trackId }, { rejectWithValue }) => {
        try {
            const res = await addTrackService(playlistId, trackId);
            return res.playlist;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to add track"));
        }
    }
);

export const removeTrackFromPlaylistThunk = createAsyncThunk(
    "playlist/removeTrack",
    async ({ playlistId, trackId }, { rejectWithValue }) => {
        try {
            const res = await removeTrackService(playlistId, trackId);
            return res.playlist;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to remove track"));
        }
    }
);

export const reorderPlaylistTracksThunk = createAsyncThunk(
    "playlist/reorderTracks",
    async ({ playlistId, sourceIndex, destinationIndex }, { rejectWithValue }) => {
        try {
            const res = await reorderTracksService(playlistId, sourceIndex, destinationIndex);
            return res.playlist;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to reorder tracks"));
        }
    }
);

const initialState = {
    playlists: [],
    activePlaylist: null,
    trackSuggestions: [],
    collaboratorSearchResults: [],
    loading: false,
    isFetchingDetails: false,
    trackSearchLoading: false,
    collaboratorSearchLoading: false,
    error: null,
    deletedBackup: {},
};

const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        clearPlaylistError: (state) => {
            state.error = null;
        },
        setActivePlaylistFromCache: (state, action) => {
            const playlistId = action.payload;
            state.activePlaylist =
                state.playlists.find((playlist) => playlist.id === playlistId) || null;
        },
        clearTrackSuggestions: (state) => {
            state.trackSuggestions = [];
        },
        clearCollaboratorSearch: (state) => {
            state.collaboratorSearchResults = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyPlaylists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyPlaylists.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists = action.payload;

                if (state.activePlaylist) {
                    state.activePlaylist =
                        state.playlists.find((playlist) => playlist.id === state.activePlaylist.id) ||
                        null;
                }
            })
            .addCase(fetchMyPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch playlists";
            })
            .addCase(fetchPlaylistById.pending, (state) => {
                state.isFetchingDetails = true;
                state.error = null;
            })
            .addCase(fetchPlaylistById.fulfilled, (state, action) => {
                state.isFetchingDetails = false;
                state.activePlaylist = action.payload;
                upsertPlaylist(state, action.payload);
            })
            .addCase(fetchPlaylistById.rejected, (state, action) => {
                state.isFetchingDetails = false;
                state.error = action.payload || "Failed to fetch playlist";
            })
            .addCase(createPlaylistThunk.fulfilled, (state, action) => {
                upsertPlaylist(state, action.payload);
                state.activePlaylist = action.payload;
            })
            .addCase(createPlaylistThunk.rejected, (state, action) => {
                state.error = action.payload || "Failed to create playlist";
            })
            .addCase(updatePlaylistThunk.fulfilled, (state, action) => {
                upsertPlaylist(state, action.payload);
            })
            .addCase(updatePlaylistThunk.rejected, (state, action) => {
                state.error = action.payload || "Failed to update playlist";
            })
            .addCase(deletePlaylistThunk.pending, (state, action) => {
                const playlistId = action.meta.arg;
                const playlistToDelete = state.playlists.find((item) => item.id === playlistId);

                if (playlistToDelete) {
                    state.deletedBackup[playlistId] = playlistToDelete;
                    state.playlists = state.playlists.filter((item) => item.id !== playlistId);

                    if (state.activePlaylist?.id === playlistId) {
                        state.activePlaylist = null;
                    }
                }
            })
            .addCase(deletePlaylistThunk.fulfilled, (state, action) => {
                const playlistId = action.payload;
                delete state.deletedBackup[playlistId];
            })
            .addCase(deletePlaylistThunk.rejected, (state, action) => {
                const payload = action.payload;
                const playlistId = payload?.playlistId;

                if (playlistId && state.deletedBackup[playlistId]) {
                    state.playlists.unshift(state.deletedBackup[playlistId]);
                    delete state.deletedBackup[playlistId];
                }

                state.error = payload?.message || "Failed to delete playlist";
            })
            .addCase(addCollaboratorsThunk.fulfilled, (state, action) => {
                upsertPlaylist(state, action.payload);
            })
            .addCase(addCollaboratorsThunk.rejected, (state, action) => {
                state.error = action.payload || "Failed to add collaborators";
            })
            .addCase(removeCollaboratorThunk.fulfilled, (state, action) => {
                upsertPlaylist(state, action.payload);
            })
            .addCase(removeCollaboratorThunk.rejected, (state, action) => {
                state.error = action.payload || "Failed to remove collaborator";
            })
            .addCase(searchCollaboratorsThunk.pending, (state) => {
                state.collaboratorSearchLoading = true;
            })
            .addCase(searchCollaboratorsThunk.fulfilled, (state, action) => {
                state.collaboratorSearchLoading = false;
                state.collaboratorSearchResults = action.payload;
            })
            .addCase(searchCollaboratorsThunk.rejected, (state, action) => {
                state.collaboratorSearchLoading = false;
                state.error = action.payload || "Failed to search users";
            })
            .addCase(searchTracksThunk.pending, (state) => {
                state.trackSearchLoading = true;
            })
            .addCase(searchTracksThunk.fulfilled, (state, action) => {
                state.trackSearchLoading = false;
                state.trackSuggestions = action.payload;
            })
            .addCase(searchTracksThunk.rejected, (state, action) => {
                state.trackSearchLoading = false;
                state.error = action.payload || "Failed to search tracks";
            })
            .addCase(addTrackToPlaylistThunk.fulfilled, (state, action) => {
                upsertPlaylist(state, action.payload);
                state.trackSuggestions = state.trackSuggestions.filter(
                    (track) => track.id !== action.payload.tracks.slice(-1)[0].id
                );
            })
            .addCase(addTrackToPlaylistThunk.rejected, (state, action) => {
                state.error = action.payload || "Failed to add track";
            })
            .addCase(removeTrackFromPlaylistThunk.fulfilled, (state, action) => {
                upsertPlaylist(state, action.payload);
            })
            .addCase(removeTrackFromPlaylistThunk.rejected, (state, action) => {
                state.error = action.payload || "Failed to remove track";
            })
            .addCase(reorderPlaylistTracksThunk.fulfilled, (state, action) => {
                upsertPlaylist(state, action.payload);
            })
            .addCase(reorderPlaylistTracksThunk.rejected, (state, action) => {
                state.error = action.payload || "Failed to reorder tracks";
            });
    },
});

export const {
    clearPlaylistError,
    setActivePlaylistFromCache,
    clearTrackSuggestions,
    clearCollaboratorSearch,
} = playlistSlice.actions;

export default playlistSlice.reducer;
