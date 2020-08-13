import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lr-edit-nickname-dialog',
  template: `
    <h1 mat-dialog-title>Edit nickname</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="outline">
        <mat-label>Nickname</mat-label>
        <input cdkFocusInitial matInput type="text" [(ngModel)]="data" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-stroked-button color="accent" mat-dialog-close>
        Cancel
      </button>
      <button mat-flat-button color="primary" [mat-dialog-close]="data">
        Change
      </button>
    </div>
  `,
  styleUrls: ['../styles/dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNicknameDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
}
