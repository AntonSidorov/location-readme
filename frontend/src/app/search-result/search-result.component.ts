import { Component, Input } from '@angular/core';
import { getUserNickname, INote } from '../models';

const MAX_NOTE_LENGTH = 100;

@Component({
  selector: 'lr-search-result[note]',
  template: `
    <div class="poster">
      <mat-icon>account_circle</mat-icon>
      <h4>{{ nickname }}</h4>
    </div>
    <p>{{ shortNote }}</p>
  `,
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent {
  @Input()
  note: INote;

  get nickname() {
    return getUserNickname(this.note.user) || 'unknown';
  }

  // If the note is too long - cut it down to something that looks less jarring
  get shortNote() {
    return this.note.note.length > MAX_NOTE_LENGTH
      ? `${this.note.note.slice(0, MAX_NOTE_LENGTH - 3)}...`
      : this.note.note;
  }
}
