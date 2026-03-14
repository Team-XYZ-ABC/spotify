export const createPlaylist = (req, res) => {
  res.send("CREATE PLAYLIST");
};

export const getPlaylist = (req, res) => {
  res.send("GET PLAYLIST");
};

export const updatePlaylist = (req, res) => {
  res.send("UPDATE PLAYLIST");
};

export const deletePlaylist = (req, res) => {
  res.send("DELETE PLAYLIST");
};

export const addTrackToPlaylist = (req, res) => {
  res.send("ADD TRACK TO PLAYLIST");
};

export const removeTrackFromPlaylist = (req, res) => {
  res.send("REMOVE TRACK FROM PLAYLIST");
};

export const getUserPlaylists = (req, res) => {
  res.send("GET USER PLAYLISTS");
};