import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { mockDataset } from '../models';
import { SearchResultComponent } from './search-result.component';

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    component.note = mockDataset.notes[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a misformed note normally', () => {
    expect(component.nickname).toEqual('unknown');
    expect(component.shortNote.length).toEqual(100);
    expect(component.shortNote.slice(97, 100)).toEqual('...');
  });

  it('should display the nickname when the note has a proper user', () => {
    component.note = { ...mockDataset.notes[2], user: mockDataset.users[0] };
    fixture.detectChanges();
    expect(component.nickname).toEqual('Anton');
    expect(component.shortNote).toEqual('Nice park.');

    // Every now and then - test the rendered HTML
    // Just to keep angular honest ;)
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.poster h4').textContent).toContain('Anton');
    expect(compiled.querySelector('p').textContent).toContain('Nice park.');
  });
});
