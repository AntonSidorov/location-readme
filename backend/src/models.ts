import { INote, INoteWithoutId } from '@models/index';
import { ObjectId } from 'mongodb';
export * from '@models/index';

export type Note = Omit<INote, '_id'> & { _id?: ObjectId };

export const parseNote = (note: INoteWithoutId): Note => ({
  ...note,
  _id: new ObjectId(note._id),
});

export const serializeNote = (note: Note): INote => ({
  ...note,
  _id: note._id?.toHexString(),
});
