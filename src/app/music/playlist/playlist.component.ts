import { Component, OnInit, Input } from '@angular/core';
import { Playlist, Track } from '../spotify.modules'
import { PlaylistService } from './playlist.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'music-body',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
    public playlist?: Playlist;
    public tracks: Track [] = [];
    private sub: Subscription = new Subscription();
    constructor(private playlistService: PlaylistService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('playlistId')) {
                this.playlistService.getPlaylist(paramMap.get('playlistId') as string)
                this.sub.add(this.playlistService.getPlaylistsUpdateListener().subscribe((playlist) => {
                    this.playlist = playlist;
                }))

                this.sub.add(this.playlistService.getTracksUpdatedListener().subscribe((tracks) => {
                    this.tracks = tracks;
                }))
            }
        })
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

