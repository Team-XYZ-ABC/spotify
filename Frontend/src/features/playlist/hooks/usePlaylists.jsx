import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addCollaboratorsThunk,
    addTrackToPlaylistThunk,
    clearCollaboratorSearch,
    clearPlaylistError,
    clearTrackSuggestions,
    createPlaylistThunk,
    deletePlaylistThunk,
    fetchMyPlaylists,
    fetchPlaylistById,
    removeCollaboratorThunk,
    removeTrackFromPlaylistThunk,
    reorderPlaylistTracksThunk,
    searchCollaboratorsThunk,
    searchTracksThunk,
    updatePlaylistThunk,
} from "@/features/playlist/slice/playlist.slice";

const usePlaylists = () => {
    const dispatch = useDispatch();

    const {
        playlists,
        activePlaylist,
        trackSuggestions,
        collaboratorSearchResults,
        loading,
        isFetchingDetails,
        trackSearchLoading,
        collaboratorSearchLoading,
        error,
    } = useSelector((state) => state.playlist);

    const loadPlaylists = useCallback(
        () => dispatch(fetchMyPlaylists()).unwrap(),
        [dispatch]
    );

    const loadPlaylistById = useCallback(
        (playlistId) => dispatch(fetchPlaylistById(playlistId)).unwrap(),
        [dispatch]
    );

    const createPlaylist = useCallback(
        (payload) => dispatch(createPlaylistThunk(payload)).unwrap(),
        [dispatch]
    );

    const updatePlaylist = useCallback(
        (playlistId, payload) =>
            dispatch(updatePlaylistThunk({ playlistId, payload })).unwrap(),
        [dispatch]
    );

    const renamePlaylist = useCallback(
        async (playlistId, name) => {
            if (!name?.trim()) {
                return false;
            }

            await dispatch(
                updatePlaylistThunk({
                    playlistId,
                    payload: { name: name.trim() },
                })
            ).unwrap();

            return true;
        },
        [dispatch]
    );

    const deletePlaylist = useCallback(
        (playlistId) => dispatch(deletePlaylistThunk(playlistId)).unwrap(),
        [dispatch]
    );

    const addCollaborators = useCallback(
        (playlistId, collaboratorIds) =>
            dispatch(addCollaboratorsThunk({ playlistId, collaboratorIds })).unwrap(),
        [dispatch]
    );

    const removeCollaborator = useCallback(
        (playlistId, userId) =>
            dispatch(removeCollaboratorThunk({ playlistId, userId })).unwrap(),
        [dispatch]
    );

    const searchCollaborators = useCallback(
        (query) => dispatch(searchCollaboratorsThunk(query)).unwrap(),
        [dispatch]
    );

    const searchTracks = useCallback(
        (query, excludePlaylistId) =>
            dispatch(searchTracksThunk({ query, excludePlaylistId })).unwrap(),
        [dispatch]
    );

    const addTrackToPlaylist = useCallback(
        (playlistId, trackOrTrackId) => {
            const trackId =
                typeof trackOrTrackId === "string" ? trackOrTrackId : trackOrTrackId?.id;

            return dispatch(addTrackToPlaylistThunk({ playlistId, trackId })).unwrap();
        },
        [dispatch]
    );

    const removeTrackFromPlaylist = useCallback(
        (playlistId, trackId) =>
            dispatch(removeTrackFromPlaylistThunk({ playlistId, trackId })).unwrap(),
        [dispatch]
    );

    const reorderTracks = useCallback(
        (playlistId, sourceIndex, destinationIndex) =>
            dispatch(
                reorderPlaylistTracksThunk({ playlistId, sourceIndex, destinationIndex })
            ).unwrap(),
        [dispatch]
    );

    const getPlaylistById = useCallback(
        (playlistId) => playlists.find((playlist) => playlist.id === playlistId),
        [playlists]
    );

    const clearError = useCallback(() => {
        dispatch(clearPlaylistError());
    }, [dispatch]);

    const clearSuggestions = useCallback(() => {
        dispatch(clearTrackSuggestions());
    }, [dispatch]);

    const clearCollaboratorResults = useCallback(() => {
        dispatch(clearCollaboratorSearch());
    }, [dispatch]);

    return {
        playlists,
        activePlaylist,
        trackSuggestions,
        collaboratorSearchResults,
        loading,
        isFetchingDetails,
        trackSearchLoading,
        collaboratorSearchLoading,
        error,
        loadPlaylists,
        loadPlaylistById,
        createPlaylist,
        updatePlaylist,
        renamePlaylist,
        deletePlaylist,
        addCollaborators,
        removeCollaborator,
        searchCollaborators,
        searchTracks,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        reorderTracks,
        getPlaylistById,
        clearError,
        clearSuggestions,
        clearCollaboratorResults,
    };
};

export default usePlaylists;