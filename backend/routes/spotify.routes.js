const express = require('express');
const auth = require('../api/auth.api');
const spotifyApi = require('../api/spotify.api'); 
const errorResponse = require('../shared/http.responses').errorResponse
const router = express.Router();


router.use(auth.verifyToken());

//AUTH ROUTES
router.get('/authorization-link', spotifyApi.getAuthUrl())
router.post('/update-tokens', spotifyApi.updateTokens())
//SPOUTIFY AUTHORIZATION
router.use((req, res, next) => {
    if (req.user.spotify_token_expiration > new Date().valueOf()) {
        res.status(401).json(errorResponse("Spotify is not authorized", {tokenProvided: false, err: 'Token expired'}, 1))
    }
    
    next();
});

//PLAYLISTS
router.get('/user/playlists', spotifyApi.getUserPlaylists());
router.get('/playlist/:id', spotifyApi.getPlaylist());
router.get('/playlist/:id/tracks', spotifyApi.getPlaylistTracks());

//PLAYBACK
router.get('/devices', spotifyApi.getDevices());
router.get('/playback-state', spotifyApi.getPlaybackState());
router.get('/queue', spotifyApi.getQueue());
router.post('/queue', spotifyApi.queueSong());
router.post('/play/:deviceId', spotifyApi.playTrack());
router.post('/pause', spotifyApi.pauseTrack());
router.post('/next-track', spotifyApi.nextTrack());
router.post('/previous-track', spotifyApi.previousTrack());
router.post('/set-shuffle', spotifyApi.setShuffleState());
router.get('/recent-tracks', spotifyApi.recentTracks());

//TRACK ANALYSIS
router.get('/track/:trackId/audio-features', spotifyApi.getTrackAudioFeatures);

module.exports = router;

