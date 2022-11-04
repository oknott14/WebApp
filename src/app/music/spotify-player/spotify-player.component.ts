import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Track } from 'src/app/models/spotify.models';
import { PlayerService } from '../services/player.service';


@Component({
    selector: 'spotify-player',
    templateUrl: './spotify-player.component.html',
    styleUrls: ['./spotify-player.component.css']
})
export class SpotifyPlayerComponent implements OnInit {
    track?: Track;
    queue: Track [] = [];
    private sub: Subscription = new Subscription();
    constructor(private player: PlayerService) {}

    ngOnInit(): void {
        this.player.init();
        /*this.sub.add(this.player.getPlaybackUpdatedListener().subscribe(playbackInfo => {
            console.log("playback changed");
            this.track = playbackInfo.track;
            this.queue = playbackInfo.queue;
        }))*/
    }
}

