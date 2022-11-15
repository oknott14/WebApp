import { HttpClient } from '@angular/common/http';
import {Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface DialogData {
    url: string
}
@Component({
    selector: 'app-spotify-reauth-dialog',
    templateUrl: './spotifyAuth.dialog.html',
})
export class SpotifyAuthDialog {
    public authPressed = false;
    constructor(public dialogRef: MatDialogRef<SpotifyAuthDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private sanitizer: DomSanitizer, private http: HttpClient) {}

    authorize() {
        this.authPressed = true
        window.location.assign(this.data.url)
    }

    cancel() {
        this.dialogRef.close();
    }
}