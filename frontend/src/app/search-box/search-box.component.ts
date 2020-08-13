import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lr-search-box[query]',
  template: `
    <img class="logo" src="/assets/logo.svg" alt="Logo" />
    <mat-form-field class="search" appearance="outline">
      <mat-label>Search notes...</mat-label>
      <input
        matInput
        type="text"
        placeholder="For example, try 'lost'"
        [(ngModel)]="query"
        (ngModelChange)="search.emit(query)"
        (focus)="searchFocused.emit()"
      />
      <button *ngIf="query" mat-icon-button matSuffix (click)="clear()"><mat-icon>clear</mat-icon></button>
    </mat-form-field>
  `,
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  @Input()
  query: string;

  @Output()
  search = new EventEmitter<string>();

  @Output()
  searchFocused = new EventEmitter();

  clear() {
    this.query = '';
    this.search.emit(this.query);
  }
}
