import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IUser } from '../models';
import { catchWithUndefined } from '../shared';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  unsubscribe$ = new Subject<void>();
  private _nicknameChange$ = new BehaviorSubject(undefined);
  nicknameChange$ = this._nicknameChange$.asObservable();

  // TODO: handle the user changes in the store. Update the nickname when the operation completes and then re-request the user anyways.
  user$: Observable<IUser | undefined> =
    // Any change in the authentication status or the nickname will force this observable to reload again
    combineLatest([this.auth.isAuthenticated$(), this.nicknameChange$]).pipe(
      // After an update - the user doesn't reload instantly - good idea to convert it to a behaviour subject
      switchMap(([v, _]) => (v ? this.api.user$() : of(undefined)))
    );

  constructor(private api: ApiService, private auth: AuthService) {
    this.user$.subscribe();
  }

  async updateNickname(nickname: string) {
    const result = await this.api.updateNickname$({ nickname }).pipe(catchWithUndefined()).toPromise();
    if (!result) {
      console.warn('Updating nickname failed');
    }
    this._nicknameChange$.next(undefined);
  }
}
