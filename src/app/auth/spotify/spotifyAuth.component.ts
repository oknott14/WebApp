import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SpotifyAuthService } from '../../auth/spotifyAuth.service';
import { SpotifyAuthDialog } from './spotifyAuth.dialog';

@Component({
    selector: "spotify-auth",
    templateUrl: "./spotifyAuth.component.html",
    styleUrls: ["./spotifyAuth.component.css"]
})
export class SpotifyAuthComponent {
    constructor(private authService: SpotifyAuthService,
        private route: ActivatedRoute,
        public dialog: MatDialog) {}

    ngOnInit() {
        this.route.queryParamMap.subscribe(params => {
            if (params.has('code')) {
                this.authService.sendToken(params.get('code') as string);
            } else {
                this.authService.getUrl().subscribe((data: any) => {
                    window.location.assign(data.data.authUrl || '/');
                })
            }
        });
    }
}