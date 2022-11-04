import { Component, OnInit, Input } from '@angular/core';
import { Playlist, Track } from '../../models/spotify.models'
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'track-container',
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
    @Input('track') track?: Track;
    private sub: Subscription = new Subscription();
    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

