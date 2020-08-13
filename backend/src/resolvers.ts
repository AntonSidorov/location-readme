import { INote, parseNote, serializeNote } from './models';
import { IResolvers, PubSub } from 'apollo-server-express';
import { IUser, INoteWithoutId } from './models';
import { ApolloContext } from './context';
import { ObjectId, UpdateWriteOpResult } from 'mongodb';

const pubsub = new PubSub();
const PS_ADD_NOTE = 'ADD_NOTE';
const PS_UPDATE_NOTE = 'UPDATE_NOTE';
const PS_REMOVE_NOTE = 'REMOVE_NOTE';

// Transforms each user into a list of notes and passes the user in each note
// This should be pretty useful if we want to grab the user information like nickname with each note
const mapUserToListOfNotes = (user: IUser): INote[] => user.notes.map((n) => ({ ...n, user: user }));

// Higher order function to take a list of arrays flatten it into an array
export function flatten<T>(acc: T[], v: T[]): T[] {
  return [...acc, ...v];
}

// Small helper to throw an error whenever a userId should be present but isn't
// Also helps the typescript compiler narrow down the type for id to ObjectId
export function assertUserIdDefined(id: string | undefined): id is string {
  if (!id) {
    throw new Error('You need to be signed in to perform this action!');
  }
  return true;
}

export function assertUpdatedOnlyOne(result: UpdateWriteOpResult) {
  if (result.modifiedCount != 1) {
    throw new Error('Something went wrong when adding/updating your note. Please try again');
  }
}

type SearchArgs = { query: string };
type AddNoteArgs = { note: INoteWithoutId };
// _id string is required in update note
type UpdateNoteArgs = { note: INote };
type RemoveNoteArgs = { id: string };
type UpdateNicknameArgs = { nickname: string };

// Resolvers are set up for:
// The root query/mutator/subscriptions. Those MUST be defined as they are the "entrypoint"
// Each defined type (Note, User) - these are optional in a sense, but they allow for some logic in resolving deeper queries
export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    notes: async (_, __, { db }): Promise<INote[]> => {
      // Find all users who have more than 1 note - no point loading other ones.
      const dbResult = await db
        .collection('users')
        .find<IUser>({ 'notes.0': { $exists: true } })
        .toArray();

      return dbResult.map(mapUserToListOfNotes).reduce(flatten, []);
    },
    search: async (_, { query }: SearchArgs, { db }): Promise<INote[]> => {
      const dbResult = await db
        .collection('users')
        .find<IUser>({
          $and: [{ $text: { $search: query } }, { 'notes.0': { $exists: true } }],
        })
        .toArray();
      return dbResult.map(mapUserToListOfNotes).reduce(flatten, []);
    },
    user: async (_, __, { db, userId, userJwt }): Promise<IUser> => {
      if (!userJwt) {
        throw new Error('You need to be authorized to access your profile.');
      }

      let user = await db.collection('users').findOne<IUser | undefined>({ _id: userJwt.sub });
      if (!user) {
        console.log(`User not found, creating. JWT:`, userJwt);
        user = {
          _id: userJwt.sub,
          nickname: userJwt.nickname || userJwt.name || '',
          notes: [],
        };
        const upResult = await db.collection('users').insertOne(user);
        if (upResult.insertedCount < 1) {
          throw new Error('An error occurred when creating your profile. Please try again');
        }
        console.log(`Created user with id: ${user._id}`);
      }
      return user;
    },
  },
  User: {
    notes: (source: IUser): INote[] => source.notes,
  },
  Note: {
    user: async (src: INote, __, { db }): Promise<IUser | undefined> => {
      if (src.user === undefined) {
        return undefined;
      }

      if (typeof src.user === 'string') {
        const user = await db.collection('users').findOne<IUser>({
          _id: src.user,
        });
        return user;
      }
      return src.user;
    },
  },
  Mutation: {
    addNote: async (_, { note }: AddNoteArgs, { db, userId }): Promise<INote> => {
      assertUserIdDefined(userId);

      const n = { ...parseNote(note), funny: 0, helpful: 0 };
      console.log(note);

      const result = await db.collection('users').updateOne({ _id: userId }, { $push: { notes: n } });

      // Updating multiple users would likely indicate something is wrong
      assertUpdatedOnlyOne(result);

      // We have to serialize again as we generated a new ObjectId
      const serialized = serializeNote(n);

      // Publish to subscriptions so other user's markers can automatically update
      await pubsub.publish(PS_ADD_NOTE, { ...serialized, user: userId });
      return serialized;
    },
    updateNote: async (_, { note }: UpdateNoteArgs, { db, userId }): Promise<INote> => {
      assertUserIdDefined(userId);

      const n = parseNote(note);
      console.log(n);
      const result = await db.collection('users').updateOne(
        { _id: userId },
        { $set: { 'notes.$[element]': n } },
        {
          arrayFilters: [{ 'element._id': n._id }],
          upsert: false,
        }
      );

      // Updating multiple users would likely indicate something is wrong
      assertUpdatedOnlyOne(result);

      await pubsub.publish(PS_UPDATE_NOTE, { ...note, user: userId });
      return note;
    },
    removeNote: async (_, { id }: RemoveNoteArgs, { db, userId }): Promise<boolean> => {
      assertUserIdDefined(userId);

      const result = await db
        .collection('users')
        .updateOne({ _id: userId }, { $pull: { notes: { _id: new ObjectId(id) } } });

      if (result.modifiedCount > 0) {
        await pubsub.publish(PS_REMOVE_NOTE, id);
      }
      return result.modifiedCount > 0;
    },
    updateNickname: async (_, { nickname }: UpdateNicknameArgs, { db, userId }) => {
      assertUserIdDefined(userId);

      const result = await db.collection('users').updateOne({ _id: userId }, { $set: { nickname } });

      if (result.modifiedCount < 1) return false;
      return true;
    },
  },
  Subscription: {
    noteAdded: {
      subscribe: () => pubsub.asyncIterator(PS_ADD_NOTE),
      resolve: (v) => v,
    },
    noteRemoved: {
      subscribe: () => pubsub.asyncIterator(PS_REMOVE_NOTE),
      resolve: (v) => v,
    },
    noteUpdated: { subscribe: () => pubsub.asyncIterator(PS_UPDATE_NOTE), resolve: (v) => v },
  },
};
