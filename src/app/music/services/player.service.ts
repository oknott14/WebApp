import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Device, PlaybackInfo, Track } from '../../models/spotify.models';
import { SpotifyService } from './spotify.service';

@Injectable({providedIn: 'root'})
export class PlayerService extends SpotifyService {
    currentDevice?: Device;
    private context?: string;
    private playbackInfo: PlaybackInfo = {
        current_track: undefined,
        progress_ms: 0,
        duration_ms: 1,
        is_playing: false,
        repeat_state: 'off',
        shuffle_state: false
    }
    devices: Device [] = [];
    queue: Track [] = [];
    private queueUpdated = new Subject<Track []>();
    private devicesUpdated = new Subject<Device []>();
    private playbackUpdated = new Subject<PlaybackInfo>();
    
    
    init() {
        this.getDevices();
        this.getPlaybackState();
        this.getQueue();
    }

    playTrack(track: Track, context_uri: string, position_ms = 0) {
        this.context = context_uri;
        if (this.currentDevice) {
            this.post(`/play/${this.currentDevice.id}`, {
                context_uri: this.context,
                offset: {
                    uri: track.uri,
                },
                position_ms: position_ms,
            }).subscribe(data => {
                this.playbackInfo.current_track = track;
                this.playbackInfo.progress_ms = position_ms;
                this.playbackInfo.duration_ms = track.duration_ms;
                this.playbackInfo.is_playing = true;
                this.updatePlayback();
            });
        } else {
            console.log("No current device, cannot play...")
        }
    }

    pauseTrack() {
        this.post('/pause', {}).subscribe(() => {
            this.playbackInfo.is_playing = false;
            this.updatePlayback();
        })
    }

    nextTrack() {
        this.post('/next-track', {}).subscribe(() => {
            this.getPlaybackState()
        })
    }

    previousTrack() {
        this.post('/previous-track', {}).subscribe(() => {
            this.getPlaybackState();
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

    private getPlaybackInfo(playbackState: any) {
        let info = (({progress_ms, duration_ms, is_playing, repeat_state, shuffle_state}) => 
            ({progress_ms, duration_ms, is_playing, repeat_state, shuffle_state}))(playbackState);
        info.duration_ms = playbackState.item.duration_ms;
        return info;
    }
    //House Keeping
    getPlaybackState() {
        this.get('/playback-state').subscribe(data => {
            this.currentDevice = data.body.device;
            Object.assign(this.playbackInfo, {current_track: data.body.item}, this.getPlaybackInfo(data.body));
            this.updatePlayback();
        });
    }

    getDevices() {
        this.get<Device []>('/devices').subscribe(devices => {
            this.devices = devices;
            this.devicesUpdated.next([...this.devices])
            this.currentDevice = devices.find((device: Device) => device.is_active);
        });
    }

    getQueue() {
        this.get<Track []>('/queue').subscribe(data => {
            this.queue = data.body.queue;
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

    private updatePlayback() {
        this.playbackUpdated.next(Object.assign({}, this.playbackInfo));
    }

}