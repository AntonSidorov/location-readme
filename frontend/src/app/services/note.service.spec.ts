import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { mockDataset } from '../models';
import { NoteService } from './note.service';

describe('NoteService', () => {
  let service: NoteService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });
    service = TestBed.inject(NoteService);
    controller = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('upsert should behave as expected', () => {
    const note = mockDataset.notes[0];
    const note2 = mockDataset.notes[3];

    service.upsertNoteToMap(note);
    expect((service as any)._notesMap$.value).toEqual({ 1: note });

    service.upsertNoteToMap(note2);
    expect((service as any)._notesMap$.value).toEqual({ 1: note, 4: note2 });

    const note3 = { ...note, note: '123456' };

    service.upsertNoteToMap(note3);
    expect((service as any)._notesMap$.value).toEqual({ 1: note3, 4: note2 });
  });

  it('remove from map should behave as expected', () => {
    const note = { ...mockDataset.notes[0], _id: 'string-v1' };
    const note2 = { ...mockDataset.notes[2], _id: 'string-v2' };

    service.upsertNoteToMap(note);
    service.upsertNoteToMap(note2);
    expect((service as any)._notesMap$.value).toEqual({ 'string-v1': note, 'string-v2': note2 });

    service.removeNoteFromMap('snhj lio2');
    expect((service as any)._notesMap$.value).toEqual({ 'string-v1': note, 'string-v2': note2 });

    service.removeNoteFromMap('string-v1');
    expect((service as any)._notesMap$.value).toEqual({ 'string-v2': note2 });
  });

  it('show note emits an id or undefined', () => {
    const spy = spyOn((service as any)._selectedNoteId$, 'next');
    service.showNote();
    expect(spy).toHaveBeenCalledWith(undefined);

    spy.calls.reset();
    service.showNote(mockDataset.notes[1]);
    expect(spy).toHaveBeenCalledWith('2');
  });

  it('add note calls the api', fakeAsync(() => {
    const spy = spyOn((service as any).api, 'addNote$');
    const { _id, ...note } = mockDataset.notes[0];
    service.addNote(note);
    tick();
    expect(spy).toHaveBeenCalledWith({ note });
  }));
  it('edit note calls the api and removes types', fakeAsync(() => {
    const spy = spyOn((service as any).api, 'updateNote$');
    const inNote = { ...mockDataset.notes[0], __typename: 'test' };
    const { __typename, user, ...note } = inNote;
    service.editNote(inNote);
    tick();
    expect(spy).toHaveBeenCalledWith({ note });
  }));
  it('remove note calls the api', fakeAsync(() => {
    const spy = spyOn((service as any).api, 'removeNote$');
    const { _id: id } = mockDataset.notes[0];
    service.removeNote(id);
    tick();
    expect(spy).toHaveBeenCalledWith({ id });
  }));

  it('makeMapFromArray should return a valid map from mock notes', () => {
    const notes = [mockDataset.notes[0], mockDataset.notes[3]];
    expect(service.makeMapFromArray(notes)).toEqual({ 1: mockDataset.notes[0], 4: mockDataset.notes[3] });
  });

  it('isNoteSelected should return the value of the underlying BehaviorSubject', () => {
    (service as any)._selectedNoteId$.next('harry potter');
    expect(service.isNoteSelected()).toBe(true);

    (service as any)._selectedNoteId$.next(undefined);
    expect(service.isNoteSelected()).toBe(false);
  });

  afterAll(() => service.ngOnDestroy());
});
