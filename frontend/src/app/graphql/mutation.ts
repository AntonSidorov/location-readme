import { gql } from 'apollo-angular';

// Only select _id - doesn't matter what the value is, as the subscription will emit a new value anyways.
const addNote = gql`
  mutation AddNote($note: NoteInput!) {
    addNote(note: $note) {
      _id
    }
  }
`;

const updateNote = gql`
  mutation UpdateNote($note: NoteUpdateInput!) {
    updateNote(note: $note) {
      _id
    }
  }
`;

// The next 2 operations return a primitive - no reason for nesting.
const removeNote = gql`
  mutation RemoveNote($id: ID!) {
    removeNote(id: $id)
  }
`;

// TODO: grab the user object to make sure no delay in updates
const updateNickname = gql`
  mutation UpdateNickname($nickname: String!) {
    updateNickname(nickname: $nickname)
  }
`;

export const Mutation = { addNote, updateNote, removeNote, updateNickname };
