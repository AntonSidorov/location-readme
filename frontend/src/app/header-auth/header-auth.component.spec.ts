import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderAuthComponent } from './header-auth.component';

describe('HeaderAuthComponent', () => {
  let component: HeaderAuthComponent;
  let fixture: ComponentFixture<HeaderAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderAuthComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderAuthComponent);
    component = fixture.componentInstance;
    component.user = undefined;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.loggedIn).toBe(false);
  });
  it('loggedIn should be true if user is not falsy', () => {
    component.user = {} as any;
    expect(component.loggedIn).toBe(true);
  });
});
