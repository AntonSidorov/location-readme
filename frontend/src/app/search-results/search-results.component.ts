import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { INote } from '@models/index';

@Component({
  selector: 'lr-search-results[notes][query][loading]',
  template: `
    <ng-template [ngIf]="isLoadingView">
      <mat-spinner [diameter]="60"></mat-spinner>
    </ng-template>
    <ng-template [ngIf]="isEmptyView">No items found.</ng-template>
    <ng-template [ngIf]="isResultView">
      <lr-search-result
        mat-ripple
        *ngFor="let note of notes"
        [note]="note"
        (click)="searchSelect.emit(note)"
      ></lr-search-result>
    </ng-template>
  `,
  styleUrls: ['./search-results.component.scss'],
  animations: [
    // Simple animation ;)
    // The angular animation framework took me some time to get used to and I haven't used it for some time
    // But essentially:
    // Whenever the property bound to [@notes] changes:
    trigger('notes', [
      // Transition between any state of [@notes] to any other state
      transition('* => *', [
        // Inside this array we can query any descendants of the element with the [@notes] binding
        // In this case that element is the component itself

        // Any elements that are being rendered for the first time - let's try to style them (optional)
        query(':enter', style({ opacity: 0, 'max-height': 0, padding: 0 }), { optional: true }),
        // Those same elements - let's do a staggered appearance
        query(
          ':enter',
          stagger('50ms', [
            animate(
              '.1s ease-in-out',
              keyframes([
                // Where each element transitions nicely from being hidden and above it's intended location
                style({ opacity: 0, transform: 'translateY(-100%)', 'max-height': 0, padding: 0, offset: 0 }),
                style({ opacity: 0.3, transform: 'translateY(-70%)', 'max-height': 0, padding: '*', offset: 0.3 }),
                style({ opacity: 0.7, transform: 'translateY(-30%)', 'max-height': '*', padding: '*', offset: 0.7 }),
                // To being fully visible and where it should be
                style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
              ])
            ),
          ]),
          // Similar to the previous query - optional is required as there might not always be any elemnts
          { optional: true }
        ),
        query(
          ':leave',
          stagger('50ms', [
            animate(
              '.1s ease-in-out',
              keyframes([
                style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
                style({ opacity: 0.7, transform: 'translateY(-30%)', 'max-height': '*', padding: '*', offset: 0.3 }),
                style({ opacity: 0.3, transform: 'translateY(-70%)', 'max-height': 0, padding: '*', offset: 0.7 }),
                style({ opacity: 0, transform: 'translateY(-100%)', 'max-height': 0, padding: 0, offset: 1 }),
              ])
            ),
          ]),
          // Similar to the previous query - optional is required as there might not always be any elemnts
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class SearchResultsComponent {
  @Input()
  @HostBinding('@notes')
  notes: INote[];

  @Input()
  query: string;

  @Input()
  loading: boolean;

  @Output()
  searchSelect = new EventEmitter<INote>();

  @HostBinding('class.has-items')
  get hasItems() {
    return this.notes.length > 0;
  }

  @HostBinding('class.loading')
  get isLoadingView() {
    return !!this.query && this.loading;
  }

  get isResultView() {
    return !!this.query && !this.loading && this.hasItems;
  }

  @HostBinding('class.empty')
  get isEmptyView() {
    return !!this.query && !this.loading && !this.hasItems;
  }
}
