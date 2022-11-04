import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Device, Track } from '../../models/spotify.models';
import { SpotifyService } from './spotify.service';

@Injectable({providedIn: 'root'})
export class PlayerService extends SpotifyService {
    currentDevice?: Device;
    devices: Device [] = [];
    currentTrack?: Track;
    queue?: Track [];
    progress_ms: number = 0;
    private playbackUpdated = new Subject();
    
    init() {
        this.getDevices();
        this.getPlaybackState();
        this.getQueue();
    }

    getPlaybackState() {
        this.get('/playback-state').subscribe(data => {
            this.currentDevice = data.body.device;
            this.currentTrack = data.body.item;
            this.progress_ms = data.body.progress_ms;
        });
    }

    getDevices() {
        this.get<Device []>('/devices').subscribe(devices => {
            this.devices = devices;
            this.currentDevice = devices.find((device: Device) => device.is_active);
        });
    }

    getQueue() {
        this.get<Track []>('/queue').subscribe(queue => {
            this.queue = queue;
        })
    }

    getPlaybackUpdatedListener() {
        return this.playbackUpdated.asObservable();
    }

    playSong(track: Track, context_uri: string) {
        console.log(context_uri)
        if (this.currentDevice) {
            this.post(`/play/${this.currentDevice.id}`, {
                context_uri: context_uri,
                offset: {
                    uri: track.uri,
                },
                position_ms: 0,
            }).subscribe(data => console.log(data));
        } else {
            console.log("No current device, cannot play...")
        }
    }

    queueSong(track: Track) {
        if (this.currentDevice) {
            this.post('/queue', {
                uri: track.uri,
                device_id: this.currentDevice,
            }).subscribe(data => console.log(data));
        } else {
            console.log("No current device, cannot queue...")
        }
    }
}