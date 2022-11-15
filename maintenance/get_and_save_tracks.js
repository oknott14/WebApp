const axios = require('axios');
const spotifyController = require('../backend/controllers/spotify.controller');
const mongoose = require('mongoose');
const baseUrl = 'http://localhost:2267/api';
const db_uri = 'mongodb+srv://web_app:dQ3ejvThYuPufDMx@cluster0.p4htdb0.mongodb.net/test';

async function main() {
    await mongoose.connect(db_uri).then(async () => {
        let resp = await axios.post(baseUrl + '/user/login', {"email": "oknott2000@gmail.com", "password": "Rangers1234"});
        const user = resp.data.data.id;
        const options = {
            headers: {
                Authorization: `Bearer ${resp.data.data.token}`,
            }
        };

        //Get Playlists
        await axios.get(baseUrl + '/spotify/user/playlists', options).then(resp => {
            return resp.data.data.map(playlist => stripPlaylist(playlist, user));
        }).then(playlists => {
            const promises = playlists.map(playlist => spotifyController.addPlaylist(playlist));
            return Promise.all(promises).then(() => playlists);
        }).then(async playlists => {
            //Get tracks
            for (const playlist of playlists) {
                const limit = 50;
                let promises = [];
                let plTracks = [];
                for (let req = 0; req < (playlist.numTracks / limit); req++) {
                    promises.push(axios.get(baseUrl + `/spotify/playlist/${playlist.spotifyId}/tracks?limit=${limit}&offset=${limit * req}`, options).then(resp => {
                        let data = resp.data.data.items;
                        data = data.filter(item => item.track && item.track !== null);
                        let vals = data.map(data => stripTrack(data.track));
                        plTracks = plTracks.concat(vals);
                    }));
                }
                await Promise.all(promises).then(() => {
                    return plTracks
                }).then(tracks => {
                    let _tracks = []
                    const promises = tracks.map(track => {
                        return axios.get(baseUrl + `/spotify/track/${track.spotifyId}/audio-features`, options).then(resp => {
                            _tracks.push(addTrackAudioFeatures(track, resp.data.data.body));
                        });
                    })
                    return Promise.all(promises).then(() => _tracks)
                }).then(tracks => {
                    const promises = tracks.map(track => {
                        return spotifyController.addTrack(track)
                    })
                    return Promise.all(promises)
                })
            }
        });
    })
    return Promise.resolve();
}

main().then(() => { 
    console.log("success");
    process.exit();
});

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