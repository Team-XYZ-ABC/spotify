import { Router } from "express";
import { searchAll } from "../controllers/search.controller.js";


const searchRouter = Router();

// searchRouter.get("/", globalSearch);

// searchRouter.get("/tracks", searchTracks);

// searchRouter.get("/artists", searchArtists);

// searchRouter.get("/albums", searchAlbums);

// searchRouter.get("/playlists", searchPlaylists);

// searchRouter.get("/suggestions", searchSuggestions);

searchRouter.get("/" , searchAll)

export default searchRouter;