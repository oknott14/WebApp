import { NgModule } from "@angular/core";
import { AppRoutingModule } from "../app-routing.module";
import { PlaylistComponent } from './playlist/playlist.component';
import { SpotifyAuthComponent, SpotifyAuthDialog } from './spotifyAuth/spotifyAuth.component';
import { MusicComponent } from './music.component';
import { MusicHomeComponent } from './home/home.component';
import { TrackComponent } from './track/track.component';
import { TrackTableComponent } from './track/track-table/track-table.component';
import { SpotifyPlayerComponent } from './spotify-player/spotify-player.component';
import { MaterialModule } from "../material.module";

@NgModule({
    declarations: [
        MusicComponent,
        MusicHomeComponent,
        TrackComponent,
        PlaylistComponent,
        SpotifyAuthComponent,
        SpotifyAuthDialog,
        TrackTableComponent,
        SpotifyPlayerComponent,
    ],
    imports: [
        MaterialModule,
        AppRoutingModule
    ],
    bootstrap: [MusicComponent],
})
export class MusicModule {};