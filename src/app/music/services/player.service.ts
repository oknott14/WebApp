import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Device, PlaybackInfo, Track } from '../../models/spotify.models';
import { SpotifyService } from './spotify.service';

@Injectable({providedIn: 'root'})
export class PlayerService extends SpotifyService {
    //MOST OF THESE COULD BE STATIC
    private currentDevice?: Device;
    private context?: string;
    private playbackInfo: PlaybackInfo = {
        current_track: undefined,
        progress_ms: 0,
        duration_ms: 1,
        is_playing: false,
        repeat_state: 'off',
        shuffle_state: false
    }
    private progress: number = 0;
    private progressMonitor: any;
    private devices: Device [] = [];
    private queue: Track [] = [];
    private recentTracks: Track [] = [];
    private queueUpdated = new Subject<Track []>();
    private devicesUpdated = new Subject<Device []>();
    private playbackUpdated = new Subject<PlaybackInfo>();
    private trackUpdated = new Subject<Track>();
    private contextUpdated = new Subject<string>();
    private progressUpdated = new Subject<number>();
    private recentTracksUpdated = new Subject<Track []>();
    
    init() {
        this.getDevices();
        this.getPlaybackState();
        this.getQueue();
        this.getRecentTracks();
    }

    playTrack(track: Track, context_uri: string, position_ms = 0) {
        this.updateContext(context_uri);
        if (this.currentDevice) {
            this.put(`/play/${this.currentDevice.id}`, {
                context_uri: this.context,
                offset: {
                    uri: track.uri,
                },
                position_ms: position_ms,
            }).subscribe(data => {
                let prog;
                if (this.playbackInfo.current_track?.id === track.id) {
                    prog = this.playbackInfo.progress_ms;
                } else {
                    prog = 0;
                }
                this.updateTrack(track, prog, true);
                setTimeout(() => this.getQueue(), 1000);
            });
        } else {
            console.log("No current device, cannot play...")
        }
    }

    pauseTrack() {
        this.put('/pause', {}).subscribe(() => {
            this.playbackInfo.is_playing = false;
            this.updatePlayback();
            clearInterval(this.progressMonitor);
        })
    }

    nextTrack() {
        this.post('/next-track', {}).subscribe(() => {
            if (this.queue.length > 0) {
                this.recentTracks.unshift(this.playbackInfo.current_track as Track); //ELIM CAST
                this.recentTracksUpdated.next([...this.recentTracks])
                let track = this.queue.shift() as Track;
                this.updateQueue();
                this.updateTrack(track);
                this.updatePlayback();
            } else {
                console.log("No songs in queue");
            }
        })
    }

    previousTrack() { //GET RECENTLY PLAYED TRACKS TO FILL THE ARRAY
        this.post('/previous-track', {}).subscribe(() => {
            if (this.recentTracks.length > 0) {
                this.queue.unshift(this.playbackInfo.current_track as Track);
                this.updateQueue();
                let track = this.recentTracks.shift() as Track; //ELIM CAST
                this.recentTracksUpdated.next([...this.recentTracks])
                this.updateTrack(track);
            }
        })
    }
      
    queueTrack(track: Track) {
        if (this.currentDevice) {
            this.post('/queue', {
                uri: track.uri,
                device_id: this.currentDevice,
            }).subscribe(data => {
                this.queue.push(track);
                this.queueUpdated.next([...this.queue]);
            });
        } else {
            console.log("No current device, cannot queue...")
        }
    }

    changeShuffleState() {
        this.put('/set-shuffle', {shuffle_state: !this.playbackInfo.shuffle_state}).subscribe(shuffle_state => {
            this.playbackInfo.shuffle_state = shuffle_state;
            this.getQueue();
            this.updatePlayback();
        })
    }

    private startTrackProgress() {
        clearInterval(this.progressMonitor);
        this.progressMonitor = setInterval(() => this.trackProgress(1000), 1000);
    }

    private trackProgress(elapsedTime: number) {
        this.playbackInfo.progress_ms += elapsedTime;
        this.progress = 100 * (this.playbackInfo.progress_ms / this.playbackInfo.duration_ms);
        if (this.progress >= 100) {
            this.updateTrack(this.queue.shift() as Track);
            this.updateQueue();
        }
        this.progressUpdated.next(this.progress);
    }
    
    //House Keeping
    getPlaybackState() {
        this.get('/playback-state').subscribe(data => {
            this.currentDevice = data.body.device;
            Object.assign(this.playbackInfo, {current_track: data.body.item}, this.getPlaybackInfo(data.body));
            if(this.playbackInfo.is_playing) {
                this.startTrackProgress()
            }
            this.updatePlayback();
        });
    }

    private getPlaybackInfo(playbackState: any) {
        let info = (({progress_ms, duration_ms, is_playing, repeat_state, shuffle_state}) => 
            ({progress_ms, duration_ms, is_playing, repeat_state, shuffle_state}))(playbackState);
        info.duration_ms = playbackState.item.duration_ms;
        return info;
    }

    getTrackProgressListener() {
        return this.progressUpdated.asObservable();
    }

    getDevices() {
        this.get<Device []>('/devices').subscribe(devices => {
            this.devices = devices;
            this.devicesUpdated.next([...this.devices])
            this.currentDevice = devices.find((device: Device) => device.is_active);
        });
    }

    getQueue() {
        this.get<Track []>('/queue').subscribe(queue => {
            this.queue = queue.map((q: any) => {
                q.id = q.spotifyId;
                return q;
            });
            this.queueUpdated.next([...this.queue])
        })
    }

    getPlaybackUpdatedListener() {
         return this.playbackUpdated.asObservable();
    }
    
    getQueueUpdatedListener() {
        return this.queueUpdated.asObservable();
    }

    getDevicesUpdatedListener() {
        return this.devicesUpdated.asObservable();
    }

    getContextUpdatedListener() {
        return this.contextUpdated.asObservable();
    }

    getRecentTracks() {
        this.get('/recent-tracks').subscribe(data => {
            this.recentTracks = data.map((info: any) => info.track);
            this.recentTracksUpdated.next([...this.recentTracks])
        })
    }

    getrecentTracksUpdatedListener() {
        return this.recentTracksUpdated.asObservable();
    }

    private updateContext(context: string) {
        this.context = context;
        this.contextUpdated.next(this.context);
    }

    private updatePlayback() {
        this.playbackUpdated.next(Object.assign({}, this.playbackInfo));
    }

    private updateTrack(track: Track, progress_ms = 0, is_playing = true) {
        this.playbackInfo.current_track = track;
        this.playbackInfo.duration_ms = track.duration;
        this.playbackInfo.progress_ms = progress_ms;
        this.playbackInfo.is_playing = is_playing;
        this.updatePlayback();
        this.trackUpdated.next(Object.assign({}, this.playbackInfo.current_track));
        this.startTrackProgress();
    }

    private updateQueue() {
        if (this.queue.length < 10) {
            this.getQueue()
        } else {
            this.queueUpdated.next([...this.queue])
        }
    }
}