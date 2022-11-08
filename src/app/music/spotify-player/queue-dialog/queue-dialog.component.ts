import { Component, OnInit } from '@angular/core';
import { Track } from '../../../models/spotify.models'
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'gueue-dialog',
    templateUrl: './queue-dialog.component.html',
    styleUrls: ['./queue-dialog.component.css']
})
export class QueueDialog implements OnInit {
    public tracks: Track [] = [];
    public context: string = '';
    private sub: Subscription = new Subscription();
    constructor(private player: PlayerService,
        public dialogRef: MatDialogRef<QueueDialog>) {}
    
    ngOnInit(): void {
        this.player.getQueue();
        this.sub.add(this.player.getQueueUpdatedListener().subscribe(queue => {
            this.tracks = queue;
        }))
        this.sub.add(this.player.getContextUpdatedListener().subscribe(context => {
            this.context = context
        }));
    }

    close() {
        this.dialogRef.close();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
