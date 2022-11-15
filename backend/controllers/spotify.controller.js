const db = require('../models/spotify.models');

exports.addPlaylist = async function(_playlist) {
    return db.Playlist.findOne({spotifyId: _playlist.spotifyId}).then(exists => {
        if (!exists) {        
            const playlist = new db.Playlist(_playlist);
            return playlist.save().then(() => true);
        } else {
            return true;
        }
    })
}
exports.addTrack = async function (_track) {
    return db.Track.findOne({spotifyId: _track.spotifyId}).then(exists => {
        if (!exists) {
            const track = new db.Track(_track);
            return track.save().then(() => true);
        } else {
            return true;
        }
    })
}

exports.getTrack = async function(spotifyId) {
    return db.Track.findOne({spotifyId: spotifyId})
}

exports.getTracks = async function(spotifyIds) {
    return db.Track.find({spotifyId: {$in: spotifyIds}})
}