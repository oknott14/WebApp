import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankingComponent } from './Banking/banking.component';
import { MusicHomeComponent } from './music/home/home.component';
import { MusicComponent } from './music/music.component';
import { PlaylistComponent } from './music/playlist/playlist.component';
import { TagTrackComponent } from './music/track/tag-tracks/tag-track.component';

const routes: Routes = [
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
    path: '',
    redirectTo: 'music/home',
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
