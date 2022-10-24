import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MusicService } from './music.service';
import { Playlist } from './spotify.modules';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-music',
    templateUrl: './music.component.html',
    styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {
    public playlists: Playlist [] = [];
    private sub: Subscription = new Subscription();
    constructor(private musicService: MusicService){}

    ngOnInit(): void {
        this.musicService.getPlaylists()
        this.sub.add(this.musicService.getPlaylistsUpdateListener().subscribe((playlists) => {
            this.playlists = playlists;
        }))
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}