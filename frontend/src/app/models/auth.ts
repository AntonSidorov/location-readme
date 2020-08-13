import { IUser } from '@models/index';

export interface AuthStateLoggedIn {
  loggedIn: true;
  user: IUser;
}

export interface AuthStateLoggedOut {
  loggedIn: false;
  user?: undefined;
}

export type AuthState = AuthStateLoggedIn | AuthStateLoggedOut;
