import { Component, OnInit, Input } from '@angular/core';
//import { Spotify } from 'angular-spotify';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
    selector: 'spotify-player',
    templateUrl: './spotify-player.component.html',
    //styleUrls: ['./spotify-player.component.css']
})
export class SpotifyPlayerComponent implements OnInit {
    player: any;
    constructor(private http: HttpClient) {}
    ngOnInit(): void {
        const url = 'http://localhost:2267/api/spotify/queue';
        const uri = 'spotify:track:0oH0OIeKJSAT5bdFkbz20A'
        
    }
}

