import { INote } from './note';

export interface IUser {
  _id: string; // This is not the usual ObjectId - it's the auth0 ID
  nickname: string;
  notes: INote[];
}

export const getUserNickname = (user?: IUser | string) => (typeof user === 'object' ? user.nickname : undefined);
export const getUserId = (user?: IUser | string) => (typeof user === 'string' ? user : user?._id);

// Checks whether or not two users are the same
export const areUsersSame = (a?: IUser | string, b?: IUser | string) => {
  if (!a && !b) {
    return false;
  }
  return getUserId(a) === getUserId(b);
};
