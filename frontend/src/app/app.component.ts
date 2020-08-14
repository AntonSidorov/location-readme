import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { delay, filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { EditNicknameDialogComponent } from './edit-nickname-dialog/edit-nickname-dialog.component';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';

import { AuthService } from './services/auth.service';
import { GeolocationService } from './services/geolocation.service';
import { NoteService } from './services/note.service';
import { SearchService } from './services/search.service';
import { UserService } from './services/user.service';

import { INote, INoteWithoutId, IUser, noteFromCoordinate, noteHasId } from './models';
import { filterOutFalsy } from './shared/type.functions';

@Component({
  selector: 'lr-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private auth: AuthService,
    private geo: GeolocationService,
    private note: NoteService,
    private user: UserService,
    private search: SearchService,
    public dialog: MatDialog
  ) {}
  unsubscribe$ = new Subject<void>();

  user$ = this.user.user$;

  query$ = this.search.query$;
  searchResults$ = this.search.notes$;
  searchLoading$ = this.search.isLoading$;
  showSearchResults$ = this.search.showResults$;

  // the anonymous function is self-explanatory
  /* istanbul ignore next */
  notes$ = this.query$.pipe(switchMap((v) => (!!v ? this.searchResults$ : this.note.notes$)));
  selectedNote$ = this.note.selectedNote$;

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild('selectedMarker')
  selectedMarker: MapMarker;

  mapOptions: google.maps.MapOptions = { disableDefaultUI: true, minZoom: 3 };
  centerOptions: google.maps.MarkerOptions = { icon: { url: './assets/current-location.svg' } };
  options: google.maps.MarkerOptions = { icon: { url: './assets/note.svg' } };

  melbourne: google.maps.LatLngLiteral = { lat: -37.8022739, lng: 144.9459015 };

  currentPosition$: Observable<google.maps.LatLngLiteral> = this.geo.current$;
  initialCenter$ = this.currentPosition$.pipe(take(1));

  newNote = noteFromCoordinate;
  trackById = (n: INote) => n._id;

  openInfoWindow = () => this.infoWindow.open(this.selectedMarker);

  onSearch = (query: string) => this.search.search(query);
  // Double check this logic
  showResults = (show: boolean) => this.search.showResults(show);

  login = () => this.auth.login();
  logout = () => this.auth.logout();
  saveNickname = (nickname: string) => this.user.updateNickname(nickname);

  showNote = (note: INote) => this.note.showNote(note);
  saveNote = (note: INoteWithoutId) => (noteHasId(note) ? this.note.editNote(note) : this.note.addNote(note));
  deleteNote = ({ _id }: INote) => this.note.removeNote(_id);

  markFunny = (_note: INote) => undefined;
  markHelpful = (_note: INote) => undefined;

  ngOnInit() {
    this.selectedNote$
      // This subscription gets processed before the (| async) pipe is processed in the template
      // To make sure the popup is shown at the right location, a delay of 0 is added.
      .pipe(filter(filterOutFalsy), takeUntil(this.unsubscribe$), delay(0))
      .subscribe(this.openInfoWindow);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  editNote(note: INoteWithoutId): void {
    this.dialog
      .open(NoteDialogComponent, { data: note })
      .afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        // Cancellations do not matter
        filter(filterOutFalsy),
        tap(this.saveNote)
      )
      .subscribe();
  }

  changeNickname(user?: IUser): void {
    if (!user) {
      return;
    }
    this.dialog
      .open(EditNicknameDialogComponent, {
        data: user.nickname,
      })
      .afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        // Make sure the string isn't falsy/empty - don't want empty nicknames being set
        filter(filterOutFalsy),
        tap(this.saveNickname)
      )
      .subscribe();
  }

  // Need to figure out the logic first before writing tests for this
  /* istanbul ignore next */
  mapClick(event: google.maps.IconMouseEvent, user: IUser | undefined) {
    // If the user clicks on a map
    // And they are logged in
    // And they are not clicking on a point of interest in a google map
    // And there is no currently open popup
    // Then let them make a note at the clicked location
    if (user !== undefined && event.placeId === undefined && !this.note.isNoteSelected()) {
      this.editNote(noteFromCoordinate({ lat: event.latLng.lat(), lng: event.latLng.lng() }));
    }
    this.infoWindow.close();
    this.showResults(false);
    this.note.showNote();
  }
}
