const SpotifyWebApi = require('./spotifyWeb.api');
const responses = require('../shared/http.responses');
const { updateUserSpotifyTokens } = require('../controllers/user.controller');
const db = require('../controllers/spotify.controller');
const spotifyApi = SpotifyWebApi.spotifyApi;
const authUrl = () => spotifyApi.createAuthorizeURL(SpotifyWebApi.Scopes);

exports.initSpotify = function() {
    const message = (msg) => `Initializing spotify ${msg}`;
    return async function (req, res, next) {
        try {
            console.log(message(''));
            let creds = SpotifyWebApi.createCredentials(req.user.spotify_access_token, req.user.spotify_refresh_token);
            spotifyApi.setCredentials(creds)
            console.log(message('succeded'));
            next();
        } catch (error) {  
            console.log(message('failed'));
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        }
    }

}

exports.getUserPlaylists = function () {
    const message = (msg) => `User Playlists ${msg}`;
    return async function(req, res, next) {
        console.log(message("requested"));
        try {
            //TODO: switch to active user spotify profile
            let data = await spotifyApi.getUserPlaylists(req.user.spotify_username);
            return res.status(200).json(responses.successResponse(data.body.items, message("succeded")));
        } catch(err) {
            console.log(message("failed"))
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        }
    }
}

exports.getPlaylist = function () {
    return async function (req, res, next) {
        const message = (msg) => `Playlist ${msg}`;
        console.log("playlist requested")
        spotifyApi.getPlaylist(req.params.id).then(data => {
            return res.status(200).json(responses.successResponse(data.body, message("succeded")));
        }).catch(err => {
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        })
    }
}

exports.getPlaylistTracks = function () {
    return async function (req, res, next) {
        const message = (msg) => `Tracks ${msg}`;
        console.log(message('requested'))
        await spotifyApi.getPlaylistTracks(req.params.id, {
            limit: req.query.limit || 20, 
            offset: req.query.offset || 0
        }).then(async (data) => {
            let tracks = data.body.items.map(item => item.track.id)
            return db.getTracks(tracks);
        }).then(tracks => {
            return res.status(200).json(responses.successResponse(tracks, message('success')));
        }).catch((err) => {
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        })
    }
}

exports.getDevices = function () {
    return async function (req, res, next) {
        const message = (msg) => `Devices ${msg}`;
        console.log(message('requested'))
        spotifyApi.getMyDevices().then((data) => {
            return res.status(200).json(responses.successResponse(data.body.devices, message("succeded")));
        }).catch(err => {
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        });
    }
}

exports.getPlaybackState = function () {
    return async function (req, res, next) {
        const message = (msg) => `Playback State ${msg}`;
        console.log(message('requested'))
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            return res.status(200).json(responses.successResponse(data, message("succeded")));
        }).catch(err => {
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        })
    }
}

exports.getQueue = function() {
    return async function(req, res, next) {
        const message = (msg) => `Queue ${msg}`;
        console.log(message('requested'))
        spotifyApi.getQueue().then(data => {
            return data.body.queue.map(track => stripTrack(track));
        }).then(queue => {
            return res.status(200).json(responses.successResponse(queue, message("succeded")));
        }).catch(err => {
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        })  
    }
}

exports.queueSong = function() {
    return async function (req, res, next) { //what is this supposed to be??
        const message = (msg) => `Queue Song ${msg}`;
        console.log(message('requested'))
        return await spotifyApi.queueSong(req.body.uri, req.body.device_id).then((data) => {
            return res.status(200).json(responses.successResponse(data, message("succeded")))
        }).catch(err => {
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        });
    }
}

exports.playTrack = function() {
    return async function (req, res, next) {
        const message = (msg) => `Play track ${msg}`;
        console.log(message('requested'))
        spotifyApi.startOrResumeSong(req.params.device_id, req.body).then(data => {
            return res.status(200).json(responses.successResponse(data, message("succeded")))
        }).catch(err => {
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        })
    }
}

exports.pauseTrack = function() {
    return async function (req, res, next) {
        const message = (msg) => `Pause ${msg}`;
        console.log(message('requested'))
        spotifyApi.pause().then((data) => {
            return res.status(200).json(responses.successResponse(data, message("succeded")))
        }).catch(err => {
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        })
    }
}

exports.nextTrack = function() {
    return async function(req, res, next) {
        const message = (msg) => `Skip to next ${msg}`;
        console.log(message('requested'))
        spotifyApi.skipToNext().then((data) => {
            return res.status(200).json(responses.successResponse(data, message("succeded")))
        }).catch(err => {
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        })
    }
}

exports.previousTrack = function() {
    return async function(req, res, next) {
        const message = (msg) => `Skip to previous ${msg}`;
        console.log(message('requested'))
        spotifyApi.skipToPrevious().then((data) => {
            return res.status(200).json(responses.successResponse(data, message("succeded")))
        }).catch(err => {
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        })
    }
}

exports.setShuffleState = function () {
    return async function(req, res, next) {
        const message = (msg) => `Toggle Shuffle ${msg}`;
        console.log(message('requested'))
        spotifyApi.setShuffle(req.body.shuffle_state).then(() => {
            return res.status(200).json(responses.successResponse(req.body.shuffle_state, message("succeded")));
        }).catch(err => {
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        })
    }
}

exports.recentTracks = function () {
    return async function(req, res, next) {
        const message = (msg) => `Recent Tracks ${msg}`;
        console.log(message('requested'))
        spotifyApi.getMyRecentlyPlayedTracks({
            limit : 20
          }).then(data => {
            res.status(200).json(responses.successResponse(data.body.items, message("succeded")));
          }).catch(err => {
            console.log("Failed to get recemt tracks");
            return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
        })
    }
}

//TRACK ANALYSIS
exports.getTrackAudioFeatures = async function(req, res) {
    const message = (msg) => `Audio features ${msg}`;
    console.log(message("requested"));
    
    spotifyApi.getAudioFeaturesForTrack(req.params.trackId).then(data => {
        return res.status(200).json(responses.successResponse(data, message("succeded")));
    }).catch(err => {
        return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
    })
}

//AUTHORIZATION
exports.getAuthUrl = function () {
    console.log('Getting auth url')
    return async function (req, res) {      
        try {
            const creds = SpotifyWebApi.createCredentials(req.user.spotify_access_token, req.user.spotify_refresh_token)  
            spotifyApi.setCredentials(creds)
            res.status(200).json(responses.successResponse({authUrl: authUrl()}));
        } catch (err) {
            res.status(403).json(responses.errorResponse("get Auth Url failed", err, 1));
        }
    }
}

exports.updateTokens = function() {
    return async function (req, res, next) {
        const message = (msg) => `Updating spotify tokens ${msg}`;
        console.log(message(''))
        spotifyApi.getMe().then(() => { //Auth already granted
            console.log(message("canceled - auth already granted"))
            return res.status(200).json(responses.successResponse(undefined, message('succeded')));
        }).catch(() => { //Auth not granted
            return spotifyApi.authorizationCodeGrant(req.body.code).then((data) => {
                console.log(data);
                console.log(message("succeded"));
                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);

                updateUserSpotifyTokens(req.user._id, data.body['access_token'], data.body['refresh_token'], data.body['expires_in']).then(() => {
                    console.log(message(" -> updating user info"))
                    return res.status(200).json(responses.successResponse(undefined, message('succeded')));
                });
                
            }).catch((err) => {
                console.log(err);
                console.log(message("failed"));
                return res.status(401).json(responses.errorResponse(message("failed"), err, 1));
            });
        })
    }
}

exports.checkAuthorization = async function() {
    return spotifyApi.getMe()
}

exports.setCredentials = async function(accessToken, refreshToken) {
    let creds = SpotifyWebApi.createCredentials(accessToken, refreshToken);
    return spotifyApi.setCredentials(creds);
}

exports.getTokens = async function () {
    return spotifyApi.getAccessToken().then(accessToken => {
        return spotifyApi.getRefreshToken().then(refreshToken => {
            return {access_token: accessToken, refresh_token: refreshToken}
        })
    })
}

//HELPER METHODS
function stripPlaylist(playlist, userId) {
    let _playlist = {};
    _playlist.spotifyId = playlist.id;
    _playlist.name = playlist.name;
    _playlist.uri = playlist.uri;
    _playlist.description = playlist.description;
    _playlist.owner = userId;
    _playlist.imageUrls = playlist.images.map(image => stripImage(image));
    _playlist.numTracks = playlist.tracks.total;
    return _playlist;
}
function stripTrack(track) {
    let _track = {}
    _track.spotifyId = track.id;
    _track.uri = track.uri;
    _track.name = track.name;
    _track.album = {
        id: track.album.id,
        name: track.album.name,
        uri: track.album.uri,
    }
    _track.imageUrls = track.album.images.map(image => stripImage(image));
    _track.artists = track.artists.map(artist => stripArtist(artist));
    _track.explicit = track.explicit;
    _track.popularity = track.popularity;
    _track.trackNumber = track.track_number;
    _track.duration = track.duration_ms;
    return _track;
}

function addTrackAudioFeatures(track, features) {
    delete features.type;
    delete features.track_href;
    delete features.analysis_url;
    delete features.duration_ms;
    features.analysisId = features.id;
    delete features.id;
    return Object.assign(track, features);
}

function stripArtist(artist) {
    return {
        id: artist.id,
        name: artist.name,
        uri: artist.uri
    }
}

function stripImage(image) {
    return image.url
}