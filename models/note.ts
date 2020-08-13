import { IUser } from './user';
import { ICoordinate } from './coordinate';

// The base interface has an optional _id - should only be undefined for adding new notes
export interface INoteWithoutId extends ICoordinate {
  _id?: string;
  note: string;
  // These aren't in the spec - they are optional
  funny?: number;
  helpful?: number;
  // link to the user if they exist. string is the _id
  user?: IUser | string;
}

// This tells typescript that _id MUST be present
export type INote = INoteWithoutId & Required<Pick<INoteWithoutId, '_id'>>;

// Utility
export const noteFromCoordinate = (p: ICoordinate): INoteWithoutId => ({ ...p, note: '' });
export const noteHasId = (n: INoteWithoutId): n is INote => n._id !== undefined;
