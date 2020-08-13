import { INote } from './note';

export interface IUser {
  _id: string; // This is not the usual ObjectId - it's the auth0 ID
  nickname: string;
  notes: INote[];
}

export const getUserNickname = (user?: IUser | string) => (typeof user === 'object' ? user.nickname : undefined);
export const getUserId = (user?: IUser | string) => (typeof user === 'string' ? user : user?._id);

// Checks whether or not
// We don't need to worry about `getUserId` returning undefined, as me._id cannot be undefined.
export const isPosterMe = (me: IUser, poster?: IUser | string) => getUserId(poster) === me._id;
