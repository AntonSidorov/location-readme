import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { INote } from '../models';
import { catchWithUndefined } from '../shared/observable.functions';
import { filterOutFalsy } from '../shared/type.functions';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _query$ = new BehaviorSubject<string>('');
  private _notes$ = new BehaviorSubject<INote[]>([]);
  private _showResults$ = new BehaviorSubject<boolean>(false);

  isLoading$ = this._isLoading$.asObservable();
  query$ = this._query$.asObservable();
  notes$ = this._notes$.asObservable();
  showResults$ = this._showResults$.asObservable();

  unsubscribe$ = new Subject<void>();

  constructor(private api: ApiService) {
    this.query$
      .pipe(
        takeUntil(this.unsubscribe$),
        // Don't want to trigger a search based on ''
        filter(filterOutFalsy),
        tap((_) => this._isLoading$.next(true)),
        switchMap((query) => this.api.searchNote$({ query })),
        tap((notes) => this._notes$.next(notes)),
        catchWithUndefined(),
        // Regardless of error - stop loading.
        tap(() => this._isLoading$.next(false))
      )
      .subscribe();
  }

  search(query: string) {
    if (!query) {
      this._notes$.next([]);
    }

    this._query$.next(query);
    this._showResults$.next(!!query);
  }
  showResults = (show: boolean) => this._showResults$.next(show);
}
