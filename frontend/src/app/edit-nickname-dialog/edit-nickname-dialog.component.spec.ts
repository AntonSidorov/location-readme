import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditNicknameDialogComponent } from './edit-nickname-dialog.component';

describe('EditNicknameDialogComponent', () => {
  let component: EditNicknameDialogComponent;
  let fixture: ComponentFixture<EditNicknameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditNicknameDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: 'User one' }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNicknameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.data).toEqual('User one');
  });
});
