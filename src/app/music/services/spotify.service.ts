import { Injectable } from '@angular/core';
import { SpotifyHttpResponse } from '../../models/spotify.models';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class SpotifyService {
    private static rootUrl: string = "http://localhost:2267/api/spotify";
    constructor(private http: HttpClient){}
    
    private checkResponse<t>(response: any){
        if (response === undefined) {
            throw new Error("Hm, something went wrong");
        }else if (response.success) {
            return response.data;
        } else {
            return null;
        }
    }

    protected get<t>(path: string, id?: string) {
        var url = SpotifyService.rootUrl + path;
        if (id) {
            url += `/${id}`;
        }
        return this.http.get<SpotifyHttpResponse>(url).pipe(map(response => {
            return this.checkResponse<t>(response);
        }))  
    }

    protected post<t>(path: string, body: object) {
        let url = SpotifyService.rootUrl + path;
        return this.http.post<SpotifyHttpResponse>(url, body).pipe(map(response => {
            return this.checkResponse<t>(response);
        }));
    }

    protected put<t>(path: string, body: object) {
        let url = SpotifyService.rootUrl + path;
        return this.http.post<SpotifyHttpResponse>(url, body).pipe(map(response => {
            return this.checkResponse<t>(response);
        }))
    }
}