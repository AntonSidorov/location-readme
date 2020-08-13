import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { IUser } from '../models';

@Component({
  selector: 'lr-header-auth[user]',
  template: `
    <a mat-icon-button class="edit" *ngIf="loggedIn">
      <mat-icon (click)="changeNickname.emit()">account_circle</mat-icon></a
    >
    <a mat-icon-button>
      <mat-icon (click)="loggedIn ? logout.emit() : login.emit()">{{ this.loggedIn ? 'logout' : 'login' }}</mat-icon></a
    >
  `,
  styleUrls: ['./header-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderAuthComponent {
  @Input()
  user: IUser | undefined;

  @Output()
  changeNickname = new EventEmitter<void>();

  @Output()
  login = new EventEmitter<void>();
  @Output()
  logout = new EventEmitter<void>();

  // In the future - maybe style logged in differently?
  @HostBinding('class.logged-in')
  get loggedIn(): boolean {
    return !!this.user;
  }
}
