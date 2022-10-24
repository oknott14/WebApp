const SpotifyWebApi = require('spotify-web-api-node');
const WebApiRequest = require('../../node_modules/spotify-web-api-node/src/webapi-request');
const HttpManager = require('../../node_modules/spotify-web-api-node/src/http-manager');

const dotenv = require('dotenv');
const SPOTIFY_CLIENT_ID='bea1410f8a8042b4bea604bbf6fec9e5'
const SPOTIFY_CLIENT_SECRET='362ed726f089416cb36fd97141b829c9'
const SPOTIFY_REDIRECT_URI='http://localhost:2267/api/spotify/redir/'
//Spotify Setup Info
const spotifyCredentials = {
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URI
}

const spotifyScopes = ['ugc-image-upload',
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
'user-read-private'];

const spotifyApi = new SpotifyWebApi(spotifyCredentials);

spotifyApi.QueueSong = function(uri, device_id, options, callback) {
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

spotifyApi.StartOrResumeSong = function(device_id, options, callback) {
    return WebApiRequest.builder(spotifyApi.getAccessToken())
      .withPath('/v1/me/player/play')
      // .withQueryParameters(
      //   {
      //     device_id: device_id
      //   },
      // )
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters(options)
      .build()
      .execute(HttpManager.put, callback);
}

exports.spotifyApi = spotifyApi;



exports.spotifyAuthResponse = (err) => {
    return {
        data: Array(0),
        auth: false,
        authUrl: spotifyApi.createAuthorizeURL(spotifyScopes),
        error: err 
    }
}
exports.spotifyDataResponse = (data) => {
    return {
        data: data,
        auth: true,
        authUrl: '',
        error: null,
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