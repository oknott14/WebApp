const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
    id: {type: String, required: false },
    name: {type: String, required: true },
    description: { type: String, required: false },
    owner: {type: Object, required: true },
    collaborative: {type: Boolean, required: true },
    href: {type: String, required: true },
    image_url: {type: String, required: true },
    public: boolean,
    uri: {type: String, required: true },
    primary_color: {type: String, required: true },
    external_urls: {type: Array, required: true },
    snapshot_id: {type: String, required: true },
    tracks: {type: Array, required: true },
    type: {type: String, required: true },
});
exports.Playlist = mongoose.model('Playlist', playlistSchema);

const trackSchema = mongoose.Schema({
    id: {type: String, required: false },
    name: {type: String, required: true },
    image_url: {type: String, required: true },
    album: {type: String, required: true },
    artists: {type: Array, required: true },
    disc_number: {type: String, required: true },
    duration_ms: {type: Number, required: true },
    eppisode: {type: Boolean, required: true },
    explicit: {type: Boolean, required: true },
    external_ids: {type: Array, required: true },
    external_urls: {type: Array, required: true },
    href: {type: String, required: true },
    is_local: {type: Boolean, required: true },
    popularity: {type: String, required: true },
    track: {type: Boolean, required: true },
    track_number: {type: Number, required: true },
    type: {type: String, required: true },
    uri: {type: String, required: true },
});
exports.Track = mongoose.model('Track', trackSchema);

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