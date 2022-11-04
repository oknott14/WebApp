import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Playlist, Track } from '../../models/spotify.models';
import { SpotifyService } from './spotify.service';

@Injectable({providedIn: 'root'})
export class PlaylistService extends SpotifyService {
    private playListUpdated = new Subject<Playlist>();
    private tracksUpdated = new Subject<Track []>();
    private playlist?: Playlist;
    private tracks: Track[] = [];

    getPlaylist(id: string) {
        this.get<Playlist>(`/playlist/${id}`).subscribe(playlist => {
            this.playlist = playlist
            this.playListUpdated.next(Object.assign({}, this.playlist))
        })
    }

    getTracks(id: string) {
        this.get<Track []>(`/playlist/${id}/tracks`).subscribe(tracks => {
            this.tracks = tracks.map((track: any) => track.track);
            this.tracksUpdated.next([...this.tracks]);
        })
    }
    
    getPlaylistUpdateListener() {
        return this.playListUpdated.asObservable();
    }
    
    getTracksUpdatedListener() {
        return this.tracksUpdated.asObservable();
    }
}