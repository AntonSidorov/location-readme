import { gql } from 'apollo-angular';

const user = gql`
  fragment UserData on User {
    _id
    nickname
  }
`;

const note = gql`
  fragment NoteData on Note {
    _id
    lat
    lng
    note
    funny
    helpful
    user {
      ...UserData
    }
  }
  ${user}
`;

export const Fragment = { note, user };
