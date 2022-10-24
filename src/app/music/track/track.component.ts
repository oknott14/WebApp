import { Component, OnInit, Input } from '@angular/core';
import { Playlist, Track } from '../spotify.modules'
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TrackService } from './track.service';

@Component({
    selector: 'track-container',
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
    @Input('track') track?: Track;
    private sub: Subscription = new Subscription();
    constructor(private trackService: TrackService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

