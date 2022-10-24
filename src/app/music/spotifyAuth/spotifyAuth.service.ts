import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class SpotifyAuthService {
    private static authListener = new Subject<string>()
    constructor(private http: HttpClient) {}
 
    protected spotifyGetData<t>(url: string, subscribeFunction: (data: t) => void){
        this.http.get<{data: t, auth: boolean, authUrl: string, error: any}>(url)
            .subscribe((data) => {
                if (!data.auth) {
                    SpotifyAuthService.authListener.next(data.authUrl);
                } else {
                    subscribeFunction(data.data);
                }
            })
    }

    public auth(url: string) {
        SpotifyAuthService.authListener.next(url);
    }
    
    public getAuthListener() {
        return SpotifyAuthService.authListener.asObservable();
    }
}
