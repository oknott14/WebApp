import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Playlist } from './spotify.modules';
import { SpotifyService } from './spotify.service';

@Injectable({providedIn: 'root'})
export class MusicService extends SpotifyService{
    private playListsUpdated = new Subject<Playlist []>();
    private playlist: Playlist[] = [];

    getPlaylists() {
        this.spotifyGetData<Playlist []>("http://localhost:2267/api/spotify/user/playlists", (data) => {
            this.playlist = data
            this.playListsUpdated.next([...this.playlist])
        })
    }
    getPlaylistsUpdateListener() {
        return this.playListsUpdated.asObservable();
    }
}