import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Playlist } from '../../models/spotify.models';
import { SpotifyService } from './spotify.service';

@Injectable({providedIn: 'root'})
export class MusicService extends SpotifyService{
    private playListsUpdated = new Subject<Playlist []>();
    private playlist: Playlist[] = [];

    getPlaylists() {
        this.get<Playlist []>("/user/playlists").subscribe(data => {
            this.playlist = data
            this.playListsUpdated.next([...this.playlist])
        })
    }
    getPlaylistsUpdateListener() {
        return this.playListsUpdated.asObservable();
    }
}