require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const WebApiRequest = require('spotify-web-api-node/src/webapi-request');
const HttpManager = require('spotify-web-api-node/src/http-manager');

// const SPOTIFY_CLIENT_ID='bea1410f8a8042b4bea604bbf6fec9e5'
// const SPOTIFY_CLIENT_SECRET='362ed726f089416cb36fd97141b829c9'
// const SPOTIFY_REDIRECT_URI='http://localhost:2267/api/spotify/redir/'
//Spotify Setup Info
const spotifyCredentials = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
}

exports.Scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'app-remote-control',
    'streaming',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-follow-modify',
    'user-follow-read',
    'user-read-playback-position',
    'user-top-read',
    'user-read-recently-played',
    'user-library-modify',
    'user-library-read',
    'user-read-email',
    'user-read-private'
];

const spotifyApi = new SpotifyWebApi(spotifyCredentials);

spotifyApi.getQueue = function(callback) {
  return WebApiRequest.builder(spotifyApi.getAccessToken())
    .withPath('/v1/me/player/queue')
    .withHeaders({ 'Content-Type': 'application/json' })
    .build()
    .execute(HttpManager.get, callback);
}
spotifyApi.queueSong = function(uri, device_id, options, callback) {
    return WebApiRequest.builder(spotifyApi.getAccessToken())
      .withPath('/v1/me/player/queue')
      .withQueryParameters(
        {
          uri: uri,
          device_id: device_id
        },
      ).withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters(options)
      .build()
      .execute(HttpManager.post, callback);
}

spotifyApi.startOrResumeSong = function(device_id, options, callback) {
    return WebApiRequest.builder(spotifyApi.getAccessToken())
      .withPath('/v1/me/player/play')
      .withQueryParameters({ device_id: device_id })
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters(options)
      .build()
      .execute(HttpManager.put, callback);
}

exports.spotifyApi = spotifyApi;