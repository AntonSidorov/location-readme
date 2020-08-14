import { gql, PubSub } from 'apollo-server-express';
export const pubsub = new PubSub();

export const ModelTypes = gql`
  type Note {
    _id: ID!
    lat: Float!
    lng: Float!
    note: String!
    funny: Int
    helpful: Int
    user: User
  }

  # 2 separate definitions for note inputs.
  # Would love to know a better way, but this seems to be the intended way
  input NoteInput {
    lat: Float!
    lng: Float!
    note: String!
    funny: Int
    helpful: Int
  }

  input NoteUpdateInput {
    _id: ID!
    lat: Float!
    lng: Float!
    note: String!
    funny: Int
    helpful: Int
  }

  type User {
    _id: ID!
    nickname: String!
    notes: [Note]
  }
`;

const SchemaDefinition = gql`
  type Query {
    notes: [Note]
    search(query: String!): [Note]
    user: User!
  }
  type Mutation {
    addNote(note: NoteInput!): Note!
    updateNote(note: NoteUpdateInput!): Note
    removeNote(id: ID!): Boolean
    updateNickname(nickname: String!): User!
  }
  type Subscription {
    noteAdded: Note
    noteUpdated: Note!
    noteRemoved: ID!
  }
  schema {
    query: Query
    subscription: Subscription
    mutation: Mutation
  }
`;

export const typeDefs = [SchemaDefinition, ModelTypes];
