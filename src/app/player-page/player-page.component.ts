import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Device, Track } from 'src/app/models/spotify.models';
import { PlayerService } from '../music/services/player.service';
import { QueueDialog } from '../music/spotify-player/queue-dialog/queue-dialog.component';


@Component({
    selector: 'player-page',
    templateUrl: './player-page.component.html',
    styleUrls: ['./player-page.component.css']
})
export class PlayerPageComponent implements OnInit {
    track?: Track;
    isPlaying = false;
    shuffle = false;
    queue: Track [] = [];
    devices: Device [] = [];
    track_completion: number = 0;
    recentTracks: Track [] = [];
    size = ['md', 'sm']
    private sub: Subscription = new Subscription();
    constructor(private player: PlayerService,
        private dialog: MatDialog) {}

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
            this.isPlaying = info.is_playing;
            this.shuffle = info.shuffle_state;
        }))
        this.sub.add(this.player.getTrackProgressListener().subscribe(progress => this.track_completion = progress));
        this.sub.add(this.player.getrecentTracksUpdatedListener().subscribe(tracks => this.recentTracks = tracks));
    }

    playTrack() {
        if (this.track)
            this.player.playTrack(this.track, this.track.album.uri);
    }

    pauseTrack() {
        if (this.track)
            this.player.pauseTrack();
    }

    skipPrevious() {
        this.player.previousTrack();
    }

    skipNext() {
        this.player.nextTrack();
    }

    setShuffle() {
        this.player.changeShuffleState();
    }

    showQueue() {
        const dialogRef = this.dialog.open(QueueDialog, {
            width: '80%',
            height: '80%',
        });
    
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

6