const express = require('express');
const { spotifyApi, spotifyAuthResponse, spotifyDataResponse } = require('../controllers/spotify')

const router = express.Router();

router.get('/user/playlists', (req, res, next) => {
    console.log('playlists requested');
    spotifyApi.getUserPlaylists('owen_knott').then((data) => {
        res.status(200).json(spotifyDataResponse(data.body.items))
    }).catch((err) => {
        res.json(spotifyAuthResponse({ message: 'Failed to get playlists', error: err }))
    })
})

router.get('/playlist', (req, res, next) => {
    console.log("playlist requested")
    spotifyApi.getPlaylist(req.query.playlistId).then(data => {
        res.status(200).json(spotifyDataResponse(data.body));
    }).catch(err => {
        res.status(500).json(spotifyAuthResponse({message: 'Failed to get playlist', error: err}))
    })
})

router.get('/playlist/tracks', (req, res, next) => {
    console.log('tracks requested')
    spotifyApi.getPlaylistTracks(req.query.playlistId).then((data) => {
        res.status(200).json(spotifyDataResponse(data.body.items));
    }).catch((err) => {
        res.json(spotifyAuthResponse({ message: 'Failed to get playlist\'s tracks', error: err }))
    })
})

router.get('/devices', (req, res, next) => {
    spotifyApi.getMyDevices().then((data) => {
        res.status(200).json(spotifyDataResponse(data.body.devices));
    }).catch(err => {
        res.json(spotifyAuthResponse({ message: 'Failed to get devices', error: err }))
    });
    
})

router.post('/queue', (req, res, next) => {
    spotifyApi.queueSong(req.body.uri, '468dec07e1d916b1d9912414a1ab6760dd56b85d').then((f) => console.log(f.body.queue)).catch(e => console.log(e));
    res.status(200).json({})
})

router.post('/play', (req, res, next) => {
    console.log("Request to play2")
    spotifyApi.StartOrResumeSong(req.body.device_id, {
        context_uri: req.body.context_uri,
        uri: req.body.uris,
    }).then(g => {
        res.status(200).json({message: 'Track playing'})
    }).catch(err => {
        console.log(err)
        res.status(401).json(err)
    })
    
})

router.get('/redir', (req, res) => {
    console.log('Auth redirected')
    spotifyApi.authorizationCodeGrant(req.query.code).then(
        function(data) {
            console.log('The token expires in Im a bitch boy ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
            console.log('The refresh token is ' + data.body['refresh_token']);
    
            // Set the access token on the API object to use it in later calls
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);
        },
        function(err) {
            console.log('Something went wrong!', err);
        }
    );
    res.send('<script>window.close()</script>')
})

module.exports = router;