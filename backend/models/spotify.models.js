const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const playlistSchema = mongoose.Schema({
    spotifyId: {type: String, required: false, unique: true },
    name: {type: String, required: true },
    description: { type: String, required: false },
    owner: {type: String, required: true },
    imageUrls: [{type: String, required: true }],
    uri: {type: String, required: true },
    numTracks: {type: Number, required: true },
});

playlistSchema.plugin(uniqueValidator)
exports.Playlist = mongoose.model('Playlist', playlistSchema);

const trackSchema = mongoose.Schema({
    spotifyId: {type: String, required: true },
    uri: {type: String, required: true },
    analysisId: {type: String, required: true},
    name: {type: String, required: true },
    album: {type: Object, required: true },
    imageUrls: [{type: String, required: true }],
    artists: [{type: Object, required: true }],
    duration: {type: Number, required: true },
    explicit: {type: Boolean, required: true },
    popularity: {type: String, required: true },
    trackNumber: {type: Number, required: true },
    danceability: {type: Number, required: true },
    energy: {type: Number, required: true },
    key: {type: Number, required: true },
    loudness: {type: Number, required: true },
    mode: {type: Number, required: true },
    speechiness: {type: Number, required: true },
    acousticness: {type: Number, required: true },
    instrumentalness: {type: Number, required: true },
    liveness: {type: Number, required: true },
    valence: {type: Number, required: true },
    tempo: {type: Number, required: true },
    time_signature: {type: Number, required: true },
});
trackSchema.plugin(uniqueValidator);
exports.Track = mongoose.model('Track', trackSchema);
/*
const albumSchema = mongoose.Schema({
    id: {type: String, required: false },
    name: {type: String, required: true },
    album_type: {type: String, required: true },
    artists: {type: Array, required: true }, 
    external_urls: {type: Array, required: true },
    href: {type: String, required: true },
    image_url: {type: string, required: true },
    release_date: {type: String, required: true },
    total_tracks: {type: Number, required: true },
    type: {type: String, required: true },
    uri: {type: String, required: true },
});
exports.Album = mongoose.model('Album', albumSchema);

const artistSchema = mongoose.Schema({
    id: {type: String, required: true },
    name: {type: String, required: true },
    type: {type: String, required: true },
    exrernal_urls: {type: Array, required: true },
    href: {type: String, required: true },
    uri: {type: String, required: true },
});
exports.Artist = mongoose.Schema('Artist', artistSchema);
*/