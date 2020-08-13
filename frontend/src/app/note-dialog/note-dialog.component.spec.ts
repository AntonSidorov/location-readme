import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mockDataset, noteFromCoordinate } from '../models';
import { NoteDialogComponent } from './note-dialog.component';

describe('NoteDialogComponent (add)', () => {
  let component: NoteDialogComponent;
  let fixture: ComponentFixture<NoteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: noteFromCoordinate({ lat: -1, lng: -2 }) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.data).toEqual({ lat: -1, lng: -2, note: '' });
    expect(component.isNew).toBe(true);
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Add a new note');
  });
});

describe('NoteDialogComponent (edit)', () => {
  let component: NoteDialogComponent;
  let fixture: ComponentFixture<NoteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockDataset.notes[2] }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.data).toEqual({
      _id: '3',
      lat: -37.837626,
      lng: 144.912649,
      note: 'Nice park.',
      funny: 0,
      helpful: 1,
      user: '5f2d16fd81da7bf5d128c337',
    });
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Edit note');
  });
});
