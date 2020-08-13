import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBoxComponent } from './search-box.component';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBoxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    component.query = '';
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit an event and set query on clear', () => {
    component.query = 'test';
    // Make sure the query is set.
    expect(component.query).toBe('test');
    component.search = jasmine.createSpyObj('search', ['emit']);
    component.clear();
    expect(component.query).toBe('');
    expect(component.search.emit).toHaveBeenCalledTimes(1);
  });
});
