import { Component, OnInit, Input } from '@angular/core';
import { Track } from '../../spotify.modules'
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TrackService } from '../track.service';

function Required(target: object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get() {
        throw new Error(`Attribute ${propertyKey} is required`);
      },
      set(value) {
        Object.defineProperty(target, propertyKey, {
          value,
          writable: true,
          configurable: true,
        });
      },
      configurable: true
    });
  }

@Component({
    selector: 'track-table[tracks]',
    templateUrl: './track-table.component.html',
    styleUrls: ['./track-table.component.css']
})
export class TrackTableComponent implements OnInit {
    @Input() @Required tracks: Track [] = [];
    public displayedColumns = ['actions', 'image', 'info', 'album', 'duration'];
    private sub: Subscription = new Subscription();
    constructor(private trackService: TrackService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        
    }

    playSong(track: Track) {
      this.trackService.playSong(track.album.uri, [track.uri]);
    }

    queueSong(uri: string) {
      this.trackService.queueSong(uri);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

