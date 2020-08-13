import { animateChild, query, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { INote, IUser } from '../models';

@Component({
  selector: 'lr-header[user][query][notes][loading]',
  template: `
    <lr-search-box
      [query]="query"
      (search)="search.emit($event)"
      (searchFocused)="searchFocused.emit(true)"
    ></lr-search-box>
    <lr-header-auth
      (login)="login.emit()"
      (logout)="logout.emit()"
      (changeNickname)="changeNickname.emit()"
      [user]="user"
    ></lr-header-auth>
    <lr-search-results
      *ngIf="showSearchResults"
      [query]="query"
      [notes]="notes"
      [loading]="loading"
      (searchSelect)="searchSelect.emit($event); searchFocused.emit(false)"
    ></lr-search-results>
  `,
  styleUrls: ['./header.component.scss'],
  animations: [trigger('search', [transition('* => *', query('*', animateChild()))])],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input()
  user: IUser | undefined;

  @Input()
  query: string;
  @Input()
  notes: INote[];
  @Input()
  loading: boolean;

  @Output()
  login = new EventEmitter<void>();
  @Output()
  logout = new EventEmitter<void>();

  @Output()
  changeNickname = new EventEmitter<void>();

  @Output()
  search = new EventEmitter<string>();
  @Output()
  searchSelect = new EventEmitter<INote>();

  @HostBinding('@search')
  @Input()
  showSearchResults: boolean;

  @Output()
  searchFocused = new EventEmitter<boolean>();
}
