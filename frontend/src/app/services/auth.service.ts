import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { BehaviorSubject, combineLatest, from, Observable, of, Subject } from 'rxjs';
import { concatMap, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IUser } from '../models';
import { ApiService } from './api.service';

/*
 * Some of this code is still referencing the quickstart from auth0,
 * but I removed a fair bit of unnecesary code related to routing/synchronous variables
 */

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  constructor(private router: Router, private api: ApiService) {
    // On init - create the client. No reason to kick anything else off.
    this.auth0Client$.pipe(takeUntil(this.unsubscribe$)).subscribe();

    const params = window.location.search;
    // When first loaded - check auth0 authentication status
    this.isAuthenticated$.pipe(takeUntil(this.unsubscribe$)).subscribe();

    // Check if the location at the creation of this service is indicative of a redirect from auth0
    // Not testing this as it comes from the quickstart
    /* istanbul ignore next */
    if (params.includes('code=') && params.includes('state=')) {
      this.handleRedirectCallback$
        .pipe(
          takeUntil(this.unsubscribe$),
          concatMap(() => combineLatest([this.isAuthenticated$])),
          // Given that we just logged in - let the rest of the app know
          tap(([loggedIn]) => this._loggedIn$.next(loggedIn))
        )
        // Given the lack of any routing in this app - just navigate to root
        .subscribe(() => this.router.navigate(['']));
    }
  }
  unsubscribe$ = new Subject<void>();

  private _loggedIn$ = new BehaviorSubject<boolean>(false);
  loggedIn$ = this._loggedIn$.asObservable();

  // Create an observable of Auth0 instance of client
  auth0Client$ = (from(
    createAuth0Client({
      domain: environment.auth0.domain,
      client_id: environment.auth0.client_id,
      redirect_uri: `${window.location.origin}`,
    })
    // Every subscription receives the same shared value
  ) as Observable<Auth0Client>).pipe(shareReplay(1));

  // Take the authenticated value directly from auth0. making it synchronous is pretty pointless.
  isAuthenticated$: Observable<boolean> = this.auth0Client$.pipe(
    concatMap((c: Auth0Client) => from(c.isAuthenticated())),
    tap((v) => this._loggedIn$.next(v))
  );

  // We want to receive an event whenever a redirect from auth0 has been completed
  handleRedirectCallback$ = this.auth0Client$.pipe(concatMap((c: Auth0Client) => from(c.handleRedirectCallback())));

  // Actual observable for loading the JWT
  getJwt$: Observable<string> = this.auth0Client$.pipe(
    concatMap((client) => from(client.getIdTokenClaims())),
    map((v) => v.__raw)
  );

  // Error checking observable for the JWT - will only load if logged in
  // Calling isAuthenticated here, as we always want to know the latest status
  jwt$: Observable<string | undefined> = this.isAuthenticated$.pipe(
    switchMap((v) => (v ? this.getJwt$ : of(undefined)))
  );

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  // Identical to quickstart, not testing
  /* istanbul ignore next */
  login(redirectPath: string = '/') {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log in
      client.loginWithRedirect({
        redirect_uri: `${window.location.origin}`,
        appState: { target: redirectPath },
      });
    });
  }

  /* istanbul ignore next */
  logout() {
    // Ensure Auth0 client instance exists, and log out if so
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.logout({
        client_id: environment.auth0.client_id,
        returnTo: `${window.location.origin}`,
      });
    });
  }
}
