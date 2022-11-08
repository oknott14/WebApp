import { Component, OnInit } from "@angular/core";
import { Track } from "src/app/models/spotify.models";
import { PlaylistService } from "../../services/playlist.service";

@Component({
    selector: 'tag-tracks',
    templateUrl: './tag-track.component.html',
    //styleUrls: ['./track-table.component.css']
})
export class TagTrackComponent implements OnInit{
    tracks: Track [] = [];

    constructor(){}

    ngOnInit(): void {
        
    }    
}