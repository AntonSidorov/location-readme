import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// This sevice will intercept the HTTP requests before they are made and add the JWT token if it is present.
@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
  // Needs a return type signature because typescript tries to narrow it down too much
  headers = (jwt?: string): { [key: string]: string } => (jwt ? { Authorization: `Bearer ${jwt}` } : {});

  isGraphQLUrl(url: string) {
    return url.includes(environment.backend);
  }

  constructor(private auth: AuthService) {}

  // Testing the behaviour of angular interceptors is not very helpful
  // We are already testing all the logic above
  /* istanbul ignore next */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isGraphQLUrl(req.url)) {
      return next.handle(req);
    }

    return this.auth.jwt$.pipe(mergeMap((jwt) => next.handle(req.clone({ setHeaders: this.headers(jwt) }))));
  }
}
