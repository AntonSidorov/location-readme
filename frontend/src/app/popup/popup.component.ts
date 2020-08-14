import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { areUsersSame, getUserNickname, INote, IUser } from '../models';

@Component({
  selector: 'lr-popup[note][user]',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent {
  @Input() note: INote;
  @Input() user: IUser | undefined;

  @Output()
  searchUser = new EventEmitter<string>();

  @Output()
  funny = new EventEmitter<void>();
  @Output()
  helpful = new EventEmitter<void>();

  @Output()
  edit = new EventEmitter<void>();
  @Output()
  delete = new EventEmitter<void>();

  get postedBy(): string | undefined {
    return getUserNickname(this.note.user);
  }

  get isMyNote(): boolean {
    return areUsersSame(this.note.user, this.user);
  }

  // Given the possible change in logic/complexity - this is separate from other calls
  // Search could work better if we emit the ID instead. This can definitely be improved
  searchClick = () => this.searchUser.emit(this.postedBy);
}
