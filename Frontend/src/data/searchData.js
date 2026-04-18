// Dummy Users (from your schema)
export const dummyUsers = [
  {
    _id: { $oid: "69e37f7c72735a4a60c445fe" },
    displayName: "Suryakumar Sirvi",
    username: "suryakumarsirvi",
    avatar: "https://ik.imagekit.io/alkama/PR2B_v1_XksyfkZ7z.webp",
    role: "artist",
  },
  {
    _id: { $oid: "69e37f955d71831c233ea79b" },
    displayName: "Shivangi Gupta",
    username: "shivangi23",
    avatar: "https://ik.imagekit.io/alkama/a22b7661-1ecc-4f9c-bf64-a1c816d063d9_kPEFB-6I2.png",
    role: "listener",
  },
  {
    _id: { $oid: "69e37f7393636d2070066e4f" },
    displayName: "Amit Sharma",
    username: "amit_music",
    avatar: "https://picsum.photos/200?user=3",
    role: "artist",
  },
];

// Dummy Artists (extended from users with artist role)
export const dummyArtists = [
  {
    _id: { $oid: "69e37f7d72735a4a60c44600" },
    user: { $oid: "69e37f7c72735a4a60c445fe" },
    verified: true,
    followersCount: 1200,
  },
  {
    _id: { $oid: "69e37f7d72735a4a60c44601" },
    user: { $oid: "69e37f7393636d2070066e4f" },
    verified: false,
    followersCount: 560,
  },
];

// Dummy Tracks (from your TrackData array, enhanced)
export const dummyTracks = [
  {
    _id: { $oid: "661111111111111111111001" },
    title: "Kesariya",
    duration: 180,
    audioUrl: "/songs/kesariya.mp3",
    coverImage: "https://picsum.photos/300?1",
    artists: ["Arijit Singh"],
    primaryArtist: { $oid: "69e37f7393636d2070066e4f" },
  },
  {
    _id: { $oid: "661111111111111111111002" },
    title: "Brown Munde",
    duration: 200,
    audioUrl: "/songs/brown_munde.mp3",
    coverImage: "https://picsum.photos/300?2",
    artists: ["AP Dhillon"],
    primaryArtist: { $oid: "69e37f7c72735a4a60c445fe" },
  },
  {
    _id: { $oid: "661111111111111111111003" },
    title: "Tum Hi Ho",
    duration: 190,
    audioUrl: "/songs/tum_hi_ho.mp3",
    coverImage: "https://picsum.photos/300?3",
    artists: ["Arijit Singh"],
  },
  {
    _id: { $oid: "661111111111111111111004" },
    title: "Night Changes",
    duration: 210,
    audioUrl: "/songs/night_changes.mp3",
    coverImage: "https://picsum.photos/300?4",
    artists: ["One Direction"],
  },
  {
    _id: { $oid: "661111111111111111111005" },
    title: "Channa Mereya",
    duration: 175,
    audioUrl: "/songs/channa_mereya.mp3",
    coverImage: "https://picsum.photos/300?5",
    artists: ["Arijit Singh"],
  },
  {
    _id: { $oid: "69e38cb66b30d360eb92aac3" },
    title: "Motivational Anthem",
    duration: 210,
    coverImage: "https://picsum.photos/300?motivate",
    artists: ["Unknown"],
  },
];

// Dummy Albums
export const dummyAlbums = [
  {
    _id: { $oid: "69e38cb66b30d360eb92aac0" },
    title: "Motivational Songs",
    description: "gym, yoga songs",
    coverImage: "https://i.pinimg.com/736x/b1/e9/c8/b1e9c85112657ed9c8cbcc9a87fb4d38.jpg",
    artist: { $oid: "69e37f7c72735a4a60c445fe" },
    type: "album",
    totalTracks: 8,
  },
  {
    _id: { $oid: "69e38cb66b30d360eb92aac1" },
    title: "Romantic Melodies",
    coverImage: "https://picsum.photos/300?romantic",
    artist: { $oid: "69e37f7393636d2070066e4f" },
    type: "album",
  },
  {
    _id: { $oid: "69e38cb66b30d360eb92aac2" },
    title: "Punjabi Hits 2025",
    coverImage: "https://picsum.photos/300?punjabi",
    artist: { $oid: "69e37f7c72735a4a60c445fe" },
    type: "album",
  },
];

// Dummy Playlists (for text suggestions)
export const dummyPlaylists = [
  {
    _id: { $oid: "69e381b3617af2b726e48e8b" },
    name: "Motivational Songs",
    description: "gym, yoga songs",
    coverImage: "https://i.pinimg.com/736x/b1/e9/c8/b1e9c85112657ed9c8cbcc9a87fb4d38.jpg",
    owner: { $oid: "69e37f7c72735a4a60c445fe" },
  },
  {
    _id: { $oid: "69e381b3617af2b726e48e8c" },
    name: "Workout Beats",
    coverImage: "https://picsum.photos/300?workout",
    owner: { $oid: "69e37f7393636d2070066e4f" },
  },
];