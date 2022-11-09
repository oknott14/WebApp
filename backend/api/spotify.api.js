const SpotifyWebApi = require('./spotifyWeb.api');
const responses = require('../shared/http.responses');
const spotifyApi = SpotifyWebApi.spotifyApi;
const authUrl = spotifyApi.createAuthorizeURL(SpotifyWebApi.Scopes);

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
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl));
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
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl));
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
            res.status(200).json(responses.successResponse(data.body, message("succeded")))
        }).catch((err) => {
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl))
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
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl))
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
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl))
        })
    }
}

exports.getQueue = function() {
    return async function(req, res, next) {
        const message = (msg) => `Queue ${msg}`;
        console.log(message('requested'))
        try {
            let queue = await spotifyApi.getQueue();
            return res.status(200).json(responses.successResponse(queue, message("succeded")));
        } catch (err) {
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl))
        }   
    }
}

exports.queueSong = function() {
    return async function (req, res, next) { //what is this supposed to be??
        const message = (msg) => `Queue Song ${msg}`;
        console.log(message('requested'))
        return await spotifyApi.queueSong(req.body.uri, req.body.device_id).then(
            (data) => {
                return res.status(200).json(responses.successResponse(data, message("succeded")))
            }).catch(err => {
                return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl))
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
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl))
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
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl))
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
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl))
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
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl))
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
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl))
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
            return res.status(401).json(responses.spotifyErrorResponse(message("failed"), err, authUrl))
        })
    }
}

const _waitForAuth = function(elapsed) { //Not working
    if (elapsed > 20) {
        return false;
    } else if (process.env.SPOTIFY_AUTHORIZED === '0') {
        console.log('waiting');
        return setTimeout(() => _waitForAuth(++elapsed), 1000);
    }
    return true;
}

exports.waitForAuth = async function() { //Not working
    let resp = await _waitForAuth(0);
    if (resp) {
        return spotifyDataResponse("ok");
    } else {
        return spotifyAuthResponse("Please refresh, could not authenticate");
    }
    
}


exports.updateTokens = function() {
    return async function (req, res, next) {
        console.log('Updating Spotify Tokens')
        spotifyApi.authorizationCodeGrant(req.query.code).then((data) => {
                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);
                process.env.SPOTIFY_AUTHORIZED = '1'
            },
            (err) => {
                console.log('Something went wrong!', err);
            }
        );
        
        return res.send('<script>window.close()</script>')
    }
}

/*Authorization from spotify: https://developer.spotify.com/documentation/web-playback-sdk/guide/#playback-control
exports.authorize = function(res) {
    var scope = "streaming \
               user-read-email \
               user-read-private"

  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:3000/auth/callback",
    state: state
  })

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
}*/