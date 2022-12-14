import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, last, map, mergeMap} from 'rxjs/operators';
import { SpotifyService } from '../music/services/spotify.service';
import { SpotifyAuthService } from './spotifyAuth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private route: ActivatedRoute, private router: Router, private spotifyAuth : SpotifyAuthService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'x-access-token': `${window.sessionStorage.getItem('token')}`,
      },
    });
    
    return next.handle(req).pipe(map((event: any)  => {
      if (event.type === HttpEventType.Response) {
        console.log(event)
        if (event.ok) {
          return event;//of(event.body);
        } 
      } else {
        return event;
      }
    }),
    catchError((event: any) => {
      switch (event.status) {
        case 401:
          if (event.error.from === 1) {
            this.spotifyAuth.auth(event.error.authUrl);
          } else {
            this.router.navigateByUrl('/login');
          }
          break;
        default:
          if (this.router.url === '/login') {
            return of(event.error)
          }
          this.router.navigateByUrl('/login');
          break;
      }
      return new Observable<any>();
    }));
  }
}