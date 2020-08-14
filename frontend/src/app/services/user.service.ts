import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { IUser } from '../models';
import { catchWithUndefined } from '../shared';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  unsubscribe$ = new Subject<void>();

  private _nicknameChange$ = new BehaviorSubject(undefined);
  private _user$ = new BehaviorSubject<IUser | undefined>(undefined);

  nicknameChange$ = this._nicknameChange$.asObservable();
  user$ = this._user$.asObservable();

  constructor(private api: ApiService, private auth: AuthService) {
    combineLatest([this.auth.loggedIn$, this.nicknameChange$])
      .pipe(
        switchMap(([v, _]) => (v ? this.api.user$() : of(undefined))),
        tap((v) => this._user$.next(v))
      )
      .subscribe();
    this.user$.subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  async updateNickname(nickname: string) {
    const result = await this.api.updateNickname$({ nickname }).pipe(catchWithUndefined()).toPromise();
    this._user$.next(result);
    console.log(this._user$.value);
    this._nicknameChange$.next(undefined);
  }
}
