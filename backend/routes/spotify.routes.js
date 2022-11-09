const express = require('express');
const auth = require('../api/auth.api');
const spotifyApi = require('../api/spotify.api'); 
const router = express.Router();

//PUBLIC accessable
router.get('/redir', spotifyApi.updateTokens())

//AUTHORIZATION
router.use(auth.verifyToken());

//PRIVATE (Sign On Required)
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

//Spotify AUTHORIZATION
router.get('/wait-for-authorization', (req, res, next) => {
    spotifyApi.waitForAuth().then((resp) => res.json(resp));
});

module.exports = router;

