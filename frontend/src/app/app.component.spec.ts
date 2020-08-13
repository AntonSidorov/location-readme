import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { AppComponent } from './app.component';
import { EditNicknameDialogComponent } from './edit-nickname-dialog/edit-nickname-dialog.component';
import { Query, Subscription } from './graphql';
import { mockDataset } from './models';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';

describe('AppComponent', () => {
  let controller: ApolloTestingController;

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, ApolloTestingModule, MatDialogModule, NoopAnimationsModule],
    }).compileComponents();
    controller = TestBed.inject(ApolloTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('trackById should map to _id property', () => {
    expect(component.trackById({ _id: 'abc123' } as any)).toBe('abc123');
    expect(component.trackById({ _id: 123 } as any)).toBe(123 as any);
    expect(component.trackById({ _id: undefined } as any)).toBeUndefined();
  });

  it('openInfoWindow should call try to open the infoWindow', () => {
    component.infoWindow = jasmine.createSpyObj('infoWindow', ['open']);
    component.selectedMarker = 'testString' as any;
    component.openInfoWindow();
    expect(component.infoWindow.open).toHaveBeenCalledWith('testString' as any);
  });

  it('showNote should call the note service', () => {
    // Ideally - setup a mock service and test through that.
    const spy = spyOn((component as any).note, 'showNote');
    component.showNote(mockDataset.notes[5]);
    expect(spy).toHaveBeenCalledWith(mockDataset.notes[5]);
  });

  it('editNote tries to open a dialog', () => {
    const spy = spyOn(component.dialog, 'open').and.callThrough();
    component.editNote(mockDataset.notes[5]);
    expect(spy).toHaveBeenCalledWith(NoteDialogComponent, { data: mockDataset.notes[5] });
  });

  it('saveNote calls editNote if _id present and addNote if not', () => {
    const editSpy = spyOn((component as any).note, 'editNote');
    const addSpy = spyOn((component as any).note, 'addNote');
    const note = { ...mockDataset.notes[5] };
    const { _id, ...note2 } = { ...note };

    component.saveNote(note);
    expect(editSpy).toHaveBeenCalledWith(note);
    expect(addSpy).not.toHaveBeenCalled();

    editSpy.calls.reset();
    addSpy.calls.reset();

    component.saveNote(note2);
    expect(addSpy).toHaveBeenCalledWith(note2);
    expect(editSpy).not.toHaveBeenCalled();
  });

  it('deleteNote calls note service', () => {
    const spy = spyOn((component as any).note, 'removeNote');
    component.deleteNote(mockDataset.notes[3]);
    expect(spy).toHaveBeenCalledWith(mockDataset.notes[3]._id);
  });

  it('changeNickname does not call the dialog if the user is falsy ', () => {
    const spy = spyOn(component.dialog, 'open').and.callThrough();
    component.changeNickname();
    expect(spy).not.toHaveBeenCalled();
  });

  it('changeNickname tries to open a dialog when called with a user', () => {
    const spy = spyOn(component.dialog, 'open').and.callThrough();
    component.changeNickname(mockDataset.users[1]);
    expect(spy).toHaveBeenCalledWith(EditNicknameDialogComponent, { data: mockDataset.users[1].nickname });
  });

  it('onSearch calls search service', () => {
    const spy = spyOn((component as any).search, 'search');
    component.onSearch('test string 123');
    expect(spy).toHaveBeenCalledWith('test string 123');
  });

  it('showResults calls search service', () => {
    const spy = spyOn((component as any).search, 'showResults');
    component.showResults(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('login calls auth service', () => {
    const loginSpy = spyOn((component as any).auth, 'login');
    const logoutSpy = spyOn((component as any).auth, 'logout');
    component.login();
    expect(loginSpy).toHaveBeenCalled();
    expect(logoutSpy).not.toHaveBeenCalled();
  });

  it('logout calls auth service', () => {
    const loginSpy = spyOn((component as any).auth, 'login');
    const logoutSpy = spyOn((component as any).auth, 'logout');
    component.logout();
    expect(loginSpy).not.toHaveBeenCalled();
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('saveNickname calls user service', () => {
    const spy = spyOn((component as any).user, 'updateNickname');
    component.saveNickname('Mr. Bean');
    expect(spy).toHaveBeenCalledWith('Mr. Bean');
  });

  it('markFunny and markHelpful return undefined', () => {
    expect(component.markFunny({} as any)).toBeUndefined();
    expect(component.markHelpful({} as any)).toBeUndefined();
  });

  afterEach(() => {
    controller.expectOne(Query.notes);
    controller.expectOne(Subscription.noteAdded);
    controller.expectOne(Subscription.noteUpdated);
    controller.expectOne(Subscription.noteRemoved);
    controller.verify();
  });
});
