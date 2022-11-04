const express = require('express');
const spotifyApi = require('../api/spotify.api'); 
const router = express.Router();

//PLAYLISTS
router.get('/user/playlists', spotifyApi.getUserPlaylists());
router.get('/playlist/:id', spotifyApi.getPlaylist());
router.get('/playlist/:id/tracks', spotifyApi.getPlaylistTracks());

//PLAYBACK
router.get('/devices', spotifyApi.getDevices());
router.get('/playback-state', spotifyApi.getPlaybackState());
router.get('/queue', spotifyApi.getQueue())
router.post('/queue', spotifyApi.queueSong())
router.post('/play/:deviceId', spotifyApi.playSong())

//AUTHORIZATION
router.get('/wait-for-authorization', (req, res, next) => {
    spotifyApi.waitForAuth().then((resp) => res.json(resp));
});
router.get('/redir', spotifyApi.updateTokens())

module.exports = router;

