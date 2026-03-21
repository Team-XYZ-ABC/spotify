import { uploadFile } from "../services/storage.services.js";



export const getTrack = (req, res) => {
  res.send("GET TRACK DETAILS");
};

export const streamTrack = (req, res) => {
  res.send("STREAM TRACK");
};

export const likeTrack = (req, res) => {
  res.send("LIKE TRACK");
};

export const unlikeTrack = (req, res) => {
  res.send("UNLIKE TRACK");
};

export const getTrackLyrics = (req, res) => {
  res.send("GET TRACK LYRICS");
};

export const getTrackCredits = (req, res) => {
  res.send("GET TRACK CREDITS");
};

export const getTrackRecommendations = (req, res) => {
  res.send("GET TRACK RECOMMENDATIONS");
};

export const uploadSingle = async (req, res) => {
  try {
    const file = req.file;
    console.log(file)

    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const result = await uploadFile(
      file.buffer,
      file.originalname,
      "uploads/single"
    );

    res.json({
      message: "File uploaded",
      data: result,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file" });
    }

    if (!file.mimetype.startsWith("image")) {
      return res.status(400).json({ message: "Only image allowed" });
    }

    const result = await uploadFile(
      file.buffer,
      file.originalname,
      "uploads/images"
    );

    res.json({ message: "Image uploaded", data: result });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadTrack = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file" });
    }

    if (!file.mimetype.startsWith("audio")) {
      return res.status(400).json({ message: "Only audio allowed" });
    }

    const result = await uploadFile(
      file.buffer,
      file.originalname,
      "uploads/tracks"
    );

    res.json({ message: "Track uploaded", data: result });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadMultiple = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files" });
    }

    const results = [];

    for (let file of files) {
      const uploaded = await uploadFile(
        file.buffer,
        file.originalname,
        "uploads/multiple"
      );
      results.push(uploaded);
    }

    res.json({ message: "Files uploaded", data: results });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrack = (req, res) => {
  res.send("UPDATE TRACK");
};

export const deleteTrack = (req, res) => {
  res.send("DELETE TRACK");
};