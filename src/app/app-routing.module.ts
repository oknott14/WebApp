import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankingComponent } from './Banking/banking.component';
import { MusicHomeComponent } from './music/home/home.component';
import { MusicComponent } from './music/music.component';
import { PlaylistComponent } from './music/playlist/playlist.component';
import { PlayerPageComponent } from './player-page/player-page.component';
import { TagTrackComponent } from './music/track/tag-tracks/tag-track.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {
    path: 'music/player',
    component: PlayerPageComponent
  },
  {
    path: 'music', 
    component: MusicComponent,
    children: [
      {
        path: 'home',
        component: MusicHomeComponent
      },
      {
        path: 'playlist/:playlistId',
        component: PlaylistComponent
      },
      {
        path: 'untagged',
        component: TagTrackComponent,
      }
    ]
  },
  {
    path: 'banking',
    component: BankingComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'banking',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
