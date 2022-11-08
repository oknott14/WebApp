import { Component, OnInit, Input } from '@angular/core';
import { Track } from '../../../models/spotify.models'

@Component({
    selector: 'track-pane',
    templateUrl: './track-pane.component.html',
    styleUrls: ['./track-pane.component.css']
})
export class TrackPaneComponent {
    @Input('track') track?: Track;
    @Input('height') height: string = '100%';
}

