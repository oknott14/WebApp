import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Device, Track } from 'src/app/models/spotify.models';
import { PlayerService } from '../services/player.service';


@Component({
    selector: 'spotify-player',
    templateUrl: './spotify-player.component.html',
    styleUrls: ['./spotify-player.component.css']
})
export class SpotifyPlayerComponent implements OnInit {
    track?: Track;
    private progress_ms: number = 0;
    private duration_ms: number = 1;
    private progressTracker: any;
    track_completion: number = 0;
    isPlaying = false;
    queue: Track [] = [];
    devices: Device [] = [];
    private sub: Subscription = new Subscription();
    constructor(private player: PlayerService) {}

    ngOnInit(): void {
        this.player.init();
        this.sub.add(this.player.getQueueUpdatedListener().subscribe(queue => {
            this.queue = queue;
        }));
        this.sub.add(this.player.getDevicesUpdatedListener().subscribe(devices => {
            this.devices = devices;
        }))
        this.sub.add(this.player.getPlaybackUpdatedListener().subscribe(info => {
            this.track = info.current_track;
            this.progress_ms = info.progress_ms;
            this.duration_ms = info.duration_ms;
            this.isPlaying = info.is_playing;
            if (this.isPlaying) {
                clearInterval(this.progressTracker);
                this.progressTracker = setInterval(() => this.updateProgress(2000), 2000);
            }
            
        }))
    }

    playTrack() {
        if (this.track)
            this.player.playTrack(this.track, this.track.album.uri, this.progress_ms);
    }


    pauseTrack() {
        if (this.track)
            clearInterval(this.progressTracker);
            this.player.pauseTrack();
    }

    skipPrevious() {
        this.player.previousTrack();
    }

    skipNext() {
        this.player.nextTrack();
        this.track = this.queue.shift();
        this.progress_ms = 0;
        this.duration_ms = this.track?.duration_ms || 1;
        clearInterval(this.progressTracker);
        this.progressTracker = setInterval(() => this.updateProgress(2000), 2000);
        

    }
    private updateProgress(elapsedTime: number) {
        this.progress_ms += elapsedTime;
        this.track_completion = 100 * (this.progress_ms / this.duration_ms);
        if (this.track_completion > 100) {
            this.player.getPlaybackState()
        }
    }

    showQueue() {
        console.log(this.queue)
    }

    private shiftQueue() {
        this.progress_ms = this.progress_ms - this.duration_ms;
            this.track = this.queue.shift();
            this.duration_ms = this.track?.duration_ms as number;
            this.track_completion = this.track_completion = 100 * (this.progress_ms / this.duration_ms);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

