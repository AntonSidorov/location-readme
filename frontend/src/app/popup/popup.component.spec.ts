import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mockDataset } from '../models';
import { PopupComponent } from './popup.component';

// This comment passes through information and has no logic.
// Testing it is defined is sufficient
describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    // Those should be by the same user
    component.note = mockDataset.notes[0];
    component.user = mockDataset.users[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('postedBy should return undefined for mock notes', () => expect(component.postedBy).toBe(undefined));
  it('isMyNote should return true for first user/note combo', () => expect(component.isMyNote).toBe(true));
  it('isMyNote should return false for second user/first note combo', () => {
    component.note = mockDataset.notes[0];
    component.user = mockDataset.users[1];
    expect(component.isMyNote).toBe(false);
  });
  it('searchClick should call emit on the event emitter.', () => {
    component.searchUser = jasmine.createSpyObj('searchUser', ['emit']);
    component.searchClick();
    expect(component.searchUser.emit).toHaveBeenCalledTimes(1);
  });
});
