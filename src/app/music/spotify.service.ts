import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SpotifyAuthService } from './spotifyAuth/spotifyAuth.service';

@Injectable({providedIn: 'root'})
export class SpotifyService {
    constructor(private http: HttpClient,
        private authService: SpotifyAuthService){}

    protected spotifyGetData<t>(url: string, subscribeFunction: (data: t) => void){
        this.http.get<{data: t, auth: boolean, authUrl: string, error: any}>(url)
            .subscribe((data) => {
                if (!data.auth) {
                    this.authService.auth(data.authUrl);
                } else {
                    subscribeFunction(data.data);
                }
            })
    }
}