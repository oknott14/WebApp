import { HttpClient } from "@angular/common/http";
import { ComponentFactoryResolver, Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class TrackService {
    device_id?: string;
    constructor(private http: HttpClient){
        this.getDevice()
    }
    
    getDevice() {
        this.http.get<any>('http://localhost:2267/api/spotify/devices').subscribe(data => {
            this.device_id = data.data[0].id
        })
    }
    playSong(context_uri: string, uris: string[]) {
        console.log('sending')
        this.http.post<any>('http://localhost:2267/api/spotify/play', {device_id: this.device_id, context_uri: context_uri, uri: uris }).subscribe(d => console.log(d));
    }
    queueSong(uri: string) {
        this.http.post<any>('http://localhost:2267/api/spotify/queue', {uri: uri}).subscribe((res) => console.log(res));
    }
}