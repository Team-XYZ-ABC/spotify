export const getCurrentPlayback = (req, res) => {
  res.send("GET CURRENT PLAYBACK");
};

export const playTrack = (req, res) => {
  res.send("PLAY TRACK");
};

export const pauseTrack = (req, res) => {
  res.send("PAUSE TRACK");
};

export const nextTrack = (req, res) => {
  res.send("NEXT TRACK");
};

export const previousTrack = (req, res) => {
  res.send("PREVIOUS TRACK");
};

export const addToQueue = (req, res) => {
  res.send("ADD TRACK TO QUEUE");
};

export const getQueue = (req, res) => {
  res.send("GET PLAYER QUEUE");
};