import { gql } from 'apollo-angular';
import { Fragment } from './fragment';

const noteAdded = gql`
  subscription NoteAdded {
    noteAdded {
      ...NoteData
    }
  }
  ${Fragment.note}
`;
const noteUpdated = gql`
  subscription NoteUpdated {
    noteUpdated {
      ...NoteData
    }
  }
  ${Fragment.note}
`;
const noteRemoved = gql`
  subscription NoteRemoved {
    noteRemoved
  }
`;

export const Subscription = { noteAdded, noteUpdated, noteRemoved };
