import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Playlist, Track } from '../spotify.modules';
import { SpotifyService } from '../spotify.service';

@Injectable({providedIn: 'root'})
export class PlaylistService extends SpotifyService {
    private playListsUpdated = new Subject<Playlist>();
    private tracksUpdated = new Subject<Track []>();
    private playlist?: Playlist;
    private tracks: Track[] = [];

    getPlaylist(id: string) {
        this.spotifyGetData<Playlist>("http://localhost:2267/api/spotify/playlist?playlistId=" + id, (playlist) => {
            this.playlist = playlist
            this.tracks = this.playlist.tracks.items.map((track: any) => track.track)
            this.playListsUpdated.next(Object.assign({}, this.playlist))
            this.tracksUpdated.next([...this.tracks]);
        })
    }

    getTracks(id: string) {
        this.spotifyGetData<Track []>("http://localhost:2267/api/spotify/playlist/tracks?playlistId=" + id, (tracks) => {

        })
    }
    getPlaylistsUpdateListener() {
        return this.playListsUpdated.asObservable();
    }
    
    getTracksUpdatedListener() {
        return this.tracksUpdated.asObservable();
    }
}