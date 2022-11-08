import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({providedIn: 'root'})
export class SpotifyAuthService {
    private static authListener = new Subject<string>();
    constructor() {}

    public auth(url: string) {
        SpotifyAuthService.authListener.next(url);
    }
    
    public getAuthListener() {
        return SpotifyAuthService.authListener.asObservable();
    }
}
