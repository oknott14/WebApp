const SpotifyWebApi = require('./spotifyWeb.api');
const spotifyApi = SpotifyWebApi.spotifyApi;

const spotifyAuthResponse = (err, redirectUrl = undefined) => {
    return {
        data: Array(0),
        success: false,
        authUrl: spotifyApi.createAuthorizeURL(SpotifyWebApi.Scopes),
        requestUrl: redirectUrl,
        error: err
    }
}

const spotifyDataResponse = (data) => {
    return {
        data: data,
        success: true,
        error: null,
    }
}

exports.getUserPlaylists = function () {
    return async function(req, res, next) {
        console.log('playlists requested');
        try {
            let data = await spotifyApi.getUserPlaylists('owen_knott');
            return res.status(200).json(spotifyDataResponse(data.body.items));
        } catch(err) {
            console.log("failed to get playlists")
            return res.status(200).json(spotifyAuthResponse({ message: 'Failed to get playlists', error: err }, req.url));
        }
    }
}

exports.getPlaylist = function () {
    return async function (req, res, next) {
        console.log("playlist requested")
        spotifyApi.getPlaylist(req.params.id).then(data => {
            return res.status(200).json(spotifyDataResponse(data.body));
        }).catch(err => {
            return res.status(500).json(spotifyAuthResponse({message: 'Failed to get playlist', error: err}))
        })
    }
}

exports.getPlaylistTracks = function () {
    return async function (req, res, next) {
        console.log('tracks requested')
        spotifyApi.getPlaylistTracks(req.params.id).then((data) => {
            return res.status(200).json(spotifyDataResponse(data.body.items));
        }).catch((err) => {
            return res.json(spotifyAuthResponse({ message: 'Failed to get playlist\'s tracks', error: err }))
        })
    }
}

exports.getDevices = function () {
    return async function (req, res, next) {
        console.log('getting devices')
        spotifyApi.getMyDevices().then((data) => {
            return res.status(200).json(spotifyDataResponse(data.body.devices));
        }).catch(err => {
            return res.json(spotifyAuthResponse({ message: 'Failed to get devices', error: err }))
        });
    }
}

exports.getPlaybackState = function () {
    return async function (req, res, next) {
        console.log('Playback state requested');
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            return res.status(200).json(spotifyDataResponse(data));
        }).catch(err => {
            return res.status(401).json({message: 'Failed to get playback state', error: err});
        })
    }
}

exports.getQueue = function() {
    return async function(req, res, next) {
        console.log("Queue requested")
        try {
            let queue = await spotifyApi.getQueue();
            return res.status(200).json(spotifyDataResponse(queue));
        } catch (err) {
            return res.status(401).json({message: 'Failed to get queue', error: err});
        }   
    }
}

exports.queueSong = function() {
    return async function (req, res, next) { //what is this supposed to be??
        return await spotifyApi.queueSong(req.body.uri, req.body.device_id).then(
            (f) => {
                console.log(f)
                return res.status(200).json(spotifyDataResponse("ok"))
            }).catch(err => {
                return res.status(401).json({message: 'Failed to add to queue', error: err})
            });
    }
}

exports.playSong = function() {
    return async function (req, res, next) {
        console.log("Request to play track")
        spotifyApi.startOrResumeSong(req.params.device_id, req.body).then(g => {
            console.log("Track Playing")
            return res.status(200).json({message: 'Track playing'})
        }).catch(err => {
            console.log("Failed to play track")
            return res.status(401).json(err)
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