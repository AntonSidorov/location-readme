import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { INoteWithoutId } from '../models';

@Component({
  selector: 'lr-note-dialog',
  templateUrl: 'note-dialog.component.html',
  styleUrls: ['../styles/dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteDialogComponent {
  private _note: INoteWithoutId;

  get isNew(): boolean {
    return this.data._id === undefined;
  }

  // The data from the dialog is readonly.
  // We want to modify the note content so we make a copy.
  get note(): INoteWithoutId {
    if (this._note === undefined) {
      this._note = { ...this.data };
    }
    return this._note;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: INoteWithoutId) {}
}
