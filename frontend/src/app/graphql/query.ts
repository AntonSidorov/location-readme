import { gql } from 'apollo-angular';
import { Fragment } from './fragment';

const notes = gql`
  query AllNotes {
    notes {
      ...NoteData
    }
  }
  ${Fragment.note}
`;

const search = gql`
  query Search($query: String!) {
    search(query: $query) {
      ...NoteData
    }
  }
  ${Fragment.note}
`;

const user = gql`
  query MyProfile {
    user {
      ...UserData
    }
  }
  ${Fragment.user}
`;

export const Query = { notes, user, search };
