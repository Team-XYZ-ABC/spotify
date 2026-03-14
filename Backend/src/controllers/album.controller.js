export const createAlbum = (req, res) => {
  res.send("CREATE ALBUM");
};

export const getAlbum = (req, res) => {
  res.send("GET ALBUM DETAILS");
};

export const updateAlbum = (req, res) => {
  res.send("UPDATE ALBUM");
};

export const deleteAlbum = (req, res) => {
  res.send("DELETE ALBUM");
};

export const getAlbumTracks = (req, res) => {
  res.send("GET ALBUM TRACKS");
};

export const getArtistAlbums = (req, res) => {
  res.send("GET ARTIST ALBUMS");
};
