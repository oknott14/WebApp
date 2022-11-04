import { Component, OnInit, Input } from '@angular/core';
import { Track, Album, Image, Artist } from '../../../models/spotify.models'
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

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
    @Input('context') context_uri?: string;
    @Input() @Required tracks: Track [] = [];
    public displayedColumns = ['actions', 'image', 'info', 'album', 'duration'];
    private sub: Subscription = new Subscription();
    constructor(private player: PlayerService,
      private route: ActivatedRoute) {}

    ngOnInit(): void {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
      });
    }

    playSong(track: Track) {
      if (this.context_uri) {
        this.player.playSong(track, this.context_uri);
      }
    }

    queueSong(track: Track) {
      this.player.queueSong(track);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

