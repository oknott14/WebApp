import { Component, OnInit, Input } from '@angular/core';
import { Playlist, Track } from '../../models/spotify.models'
import { PlaylistService } from '../services/playlist.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'music-body',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
    private playlistId: string = '';
    public playlist?: Playlist;
    public tracks: Track [] = [];
    private sub: Subscription = new Subscription();
    constructor(private playlistService: PlaylistService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('playlistId')) {
                this.playlistId = paramMap.get('playlistId') as string;
                
                this.playlistService.getPlaylist(this.playlistId)
                this.sub.add(this.playlistService.getPlaylistUpdateListener().subscribe((playlist: Playlist) => {
                    this.playlist = playlist;
                }))

                this.playlistService.getTracks(this.playlistId)
                this.sub.add(this.playlistService.getTracksUpdatedListener().subscribe((tracks: Track []) => {
                    this.tracks = tracks;
                }))
            }
        })
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

