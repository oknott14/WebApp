import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class SpotifyAuthService {
    private url_prefix = 'http://localhost:2267/api/spotify';
    private static authListener = new Subject<string>();
    private static authorizing = false;
    private static redirectUrl?: string;
    constructor(private router: Router, private http: HttpClient) {}

    public setRedirectUrl(redirectUrl: string) {
        if (!SpotifyAuthService.authorizing) {
            SpotifyAuthService.authorizing = true;
            window.sessionStorage.setItem("redirectUrl", redirectUrl);
            //this.router.navigateByUrl('music/spotify/authorize')
        }
    }

    sendToken(code: string) {
        this.http.post(this.url_prefix + '/update-tokens', {code: code}).subscribe(data => {
            SpotifyAuthService.authorizing = false;
            const redirectUrl = window.sessionStorage.getItem('redirectUrl');
            if (redirectUrl) {
                this.router.navigateByUrl(redirectUrl);
            } else {
                this.router.navigateByUrl('/music/home');
            } 
        });
    }

    getUrl() {
        return this.http.get(this.url_prefix + '/authorization-link');
    }
    
    public getAuthListener() {
        return SpotifyAuthService.authListener.asObservable();
    }
}
