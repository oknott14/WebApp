import { NgModule } from "@angular/core";
import { AppRoutingModule } from "../app-routing.module";
import { PlaylistComponent } from './playlist/playlist.component';
import { MusicComponent } from './music.component';
import { MusicHomeComponent } from './home/home.component';
//import { TrackComponent } from './track/track.component';
import { TrackTableComponent } from './track/track-table/track-table.component';
import { SpotifyPlayerComponent } from './spotify-player/player-toolbar/spotify-player.component';
import { MaterialModule } from "../material.module";
import { QueueDialog } from "./spotify-player/queue-dialog/queue-dialog.component";
import { TrackPaneComponent } from "./track/track-pane/track-pane.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "../auth/auth.interceptor";

@NgModule({
    declarations: [
        MusicComponent,
        MusicHomeComponent,
        //TrackComponent,
        PlaylistComponent,
        TrackTableComponent,
        SpotifyPlayerComponent,
        QueueDialog,
        TrackPaneComponent
    ],
    imports: [
        MaterialModule,
        AppRoutingModule,
    ],
    providers: [{
        provide : HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi   : true,
    }],
    bootstrap: [MusicComponent],
})
export class MusicModule {};