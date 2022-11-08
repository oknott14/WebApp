import { NgModule } from "@angular/core";
import { AppRoutingModule } from "../app-routing.module";
import { PlaylistComponent } from './playlist/playlist.component';
import { SpotifyAuthComponent, SpotifyAuthDialog } from './spotifyAuth/spotifyAuth.component';
import { MusicComponent } from './music.component';
import { MusicHomeComponent } from './home/home.component';
import { TrackComponent } from './track/track.component';
import { TrackTableComponent } from './track/track-table/track-table.component';
import { SpotifyPlayerComponent } from './spotify-player/player-toolbar/spotify-player.component';
import { MaterialModule } from "../material.module";
import { QueueDialog } from "./spotify-player/queue-dialog/queue-dialog.component";
import { TrackPaneComponent } from "./track/track-pane/track-pane.component";

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
        QueueDialog,
        TrackPaneComponent
    ],
    imports: [
        MaterialModule,
        AppRoutingModule,
    ],
    bootstrap: [MusicComponent],
})
export class MusicModule {};