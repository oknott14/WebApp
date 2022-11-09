import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { MatListItem } from '@angular/material/list';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root'})
export class AuthService {
    constructor(private http: HttpClient, private router: Router){
    }
    
    createUser(email: string, password: string, name: string, spotify_user_id?: string) {
        const user: User = {email: email, password: password, name: name, spotify_user_id: spotify_user_id};
        this.http.post<any>("http://localhost:2267/api/user/create", user).subscribe(resp => {
            console.log(resp);
        })
    }

    login(email: string, password: string) {
        const authData: any = {email: email, password: password};
        this.http.post<any>("http://localhost:2267/api/user/login", authData).subscribe(resp => {
            if (resp.success) {
                console.log(resp)
                window.sessionStorage.setItem('userId', resp.data.id);
                window.sessionStorage.setItem('token', resp.data.token);
                this.router.navigateByUrl('/music/home');
            }
        })
    }
}