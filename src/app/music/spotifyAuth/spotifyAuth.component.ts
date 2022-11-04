import {Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SpotifyAuthService } from '../services/spotifyAuth.service';

@Component({
    selector: 'spotify-auth',
    template: ''
})
export class SpotifyAuthComponent {
    private authSub = new Subscription()
    constructor(private spotifyService: SpotifyAuthService, public dialog: MatDialog) {}

    ngOnInit() {
        this.authSub.add(this.spotifyService.getAuthListener().subscribe((authUrl: string) => {
            this.openDialog(authUrl); //send this url to the dialog
        }))
    }

    openDialog(authUrl: string): void {
        const dialogRef = this.dialog.open(SpotifyAuthDialog, {
            data: {url: authUrl},
            width: 'fit-content',
            height: 'fit-content',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    ngOnDestroy() {
        this.authSub.unsubscribe();
    }
}

interface DialogData {
    url: string
}
@Component({
    selector: 'app-spotify-reauth-dialog',
    templateUrl: './spotifyAuth.component.html',
})
export class SpotifyAuthDialog {
    public authPressed = false;
    private authSub = new Subscription();
    public safeUrl: SafeUrl;
    constructor(public dialogRef: MatDialogRef<SpotifyAuthDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private sanitizer: DomSanitizer) {
            console.log(this.data.url)
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
        }

    authorizeSpotify() {
        this.authPressed = true
        window.open(this.data.url, '_blank');
    }

    cancel() {
        this.dialogRef.close();
    }

    reload() {
        this.dialogRef.close();
        location.reload();
    }
}