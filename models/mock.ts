import { IUser } from './user';
import { INote } from '@models/index';

export interface MockDataset {
  users: IUser[];
  notes: INote[];
}

const notes: INote[] = [
  {
    _id: '1',
    lat: -37.8022739,
    lng: 144.9459015,
    note:
      'This is a very nice building at the university of melbourne. You should visit it sometimes. This note should be very long so we can test some long note trimming features.',
    funny: 0,
    helpful: 0,
    user: '5f2d16fd81da7bf5d128c337',
  },
  {
    _id: '2',
    lat: -44.93535,
    lng: 4.39559,
    note: 'I really enjoyed apple maps taking me here while trying to drive home.',
    funny: 2,
    helpful: 0,
    user: '5f2d16fd81da7bf5d128c337',
  },
  {
    _id: '3',
    lat: -37.837626,
    lng: 144.912649,
    note: 'Nice park.',
    funny: 0,
    helpful: 1,
    user: '5f2d16fd81da7bf5d128c337',
  },
  {
    _id: '4',
    lat: -28.818456,
    lng: 142.355246,
    note: 'Bad weather down here - gets super hot in the day and cold in the nights',
    funny: 0,
    helpful: 0,
    user: '5f2d16fd81da7bf5d128c338',
  },
  {
    _id: '5',
    lat: 48.858253,
    lng: 2.2876487,
    note: '+1 if visited',
    funny: 2,
    helpful: 0,
    user: '5f2d16fd81da7bf5d128c338',
  },
  {
    _id: '6',
    lat: -25.818456,
    lng: 142.355246,
    note: 'Random comment',
    funny: 0,
    helpful: 0,
    user: '5f2d16fd81da7bf5d128c339',
  },
];
const users: IUser[] = [
  {
    _id: '5f2d16fd81da7bf5d128c337',
    nickname: 'Anton',
    notes: notes.filter((v) => v.user === '5f2d16fd81da7bf5d128c337'),
  },
  {
    _id: '5f2d16fd81da7bf5d128c338',
    nickname: 'User number 2',
    notes: notes.filter((v) => v.user === '5f2d16fd81da7bf5d128c338'),
  },
  {
    _id: '5f2d16fd81da7bf5d128c339',
    nickname: 'One note',
    notes: notes.filter((v) => v.user === '5f2d16fd81da7bf5d128c339'),
  },
  {
    _id: '5f2d16fd81da7bf5d128c340',
    nickname: 'User with no notes',
    notes: notes.filter((v) => v.user === '5f2d16fd81da7bf5d128c340'),
  },
];

export const mockDataset: MockDataset = {
  users,
  notes,
};
