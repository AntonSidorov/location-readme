import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { INote, INoteWithoutId } from '../models';
import { catchWithUndefined } from '../shared';
import { ApiService } from './api.service';

// FIXME: update to RxJS 7 will need replacement of `toPromise`
// This will only be relevant when angular updates the dependency
@Injectable({ providedIn: 'root' })
export class NoteService implements OnDestroy {
  private _notesMap$ = new BehaviorSubject<{ [key: string]: INote }>({});
  private _selectedNoteId$ = new BehaviorSubject<string | undefined>(undefined);

  notes$: Observable<INote[]>;
  selectedNote$: Observable<INote | undefined>;
  unsubscribe$ = new Subject<void>();

  upsertNoteToMap = (note: INote) => this._notesMap$.next({ ...this._notesMap$.value, [note._id]: note });
  removeNoteFromMap = (note: string) => {
    const { [note]: deleted, ...out } = this._notesMap$.value;
    this._notesMap$.next(out);
  };

  constructor(private api: ApiService) {
    this.api.noteAdded$.subscribe(this.upsertNoteToMap);
    this.api.noteUpdated$.subscribe(this.upsertNoteToMap);
    this.api.noteRemoved$.subscribe(this.removeNoteFromMap);

    this.notes$ = this._notesMap$.pipe(map((notesMap) => Object.values(notesMap)));
    this.selectedNote$ = combineLatest([this._selectedNoteId$, this._notesMap$]).pipe(
      map(([id, notes]) => notes[id || ''])
    );

    this.loadNotes();
  }

  ngOnDestroy() {
    // Unsubscribe from all the subscriptions.
    this.unsubscribe$.next();
  }

  async loadNotes() {
    this._notesMap$.next(this.makeMapFromArray(await this.api.notes$().toPromise()));
  }

  makeMapFromArray(notes: INote[]): { [key: string]: INote } {
    return notes.map(({ _id, ...v }) => ({ [_id]: { _id, ...v } })).reduce((acc, v) => ({ ...acc, ...v }), {});
  }

  showNote(note?: INote) {
    this._selectedNoteId$.next(note?._id);
  }

  isNoteSelected = () => this._selectedNoteId$.value !== undefined;

  async addNote(note: INoteWithoutId) {
    await this.api.addNote$({ note }).pipe(catchWithUndefined()).toPromise();
  }

  // GraphQL has a hidden __typename property that is not auto-stripped by the client
  // Mutations will go nuts if they see a variable they don't expect.
  // Because of this I have to add the optional __typename union
  async editNote(n: INote & { __typename?: string }) {
    // Don't send the user back to the API - it already has that info
    const { user, __typename, ...note } = n;
    console.log(n);
    console.log(note);
    await this.api.updateNote$({ note }).pipe(catchWithUndefined()).toPromise();
  }

  async removeNote(id: string) {
    await this.api.removeNote$({ id }).pipe(catchWithUndefined()).toPromise();
  }
}
