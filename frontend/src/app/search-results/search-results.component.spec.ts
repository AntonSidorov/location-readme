import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultComponent } from '../search-result/search-result.component';
import { SearchResultsComponent } from './search-results.component';

import { mockDataset } from '../models';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultsComponent, SearchResultComponent],
      imports: [NoopAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    component.notes = mockDataset.notes;
    component.query = '';
    component.loading = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hasItems behaves correctly', () => {
    component.notes = [];
    expect(component.hasItems).toBe(false);
    component.notes = mockDataset.notes;
    expect(component.hasItems).toBe(true);
  });

  describe('views are distinguished correctly', () => {
    it('should be none when not searching', () => {
      expect(component.isEmptyView).toBe(false);
      expect(component.isLoadingView).toBe(false);
      expect(component.isResultView).toBe(false);
    });
    it('should show none even if loading (not searching)', () => {
      component.loading = true;
      // No changes as the query is evaluated first - No point showing a loader if the user isn't searching
      expect(component.isEmptyView).toBe(false);
      expect(component.isLoadingView).toBe(false);
      expect(component.isResultView).toBe(false);
    });
    it('should show loading when query and loading are both present', () => {
      component.query = 'test';
      component.loading = true;
      expect(component.isEmptyView).toBe(false);
      expect(component.isLoadingView).toBe(true);
      expect(component.isResultView).toBe(false);
    });
    it('should show results when loaded', () => {
      component.query = 'test';
      component.loading = false;
      expect(component.isEmptyView).toBe(false);
      expect(component.isLoadingView).toBe(false);
      expect(component.isResultView).toBe(true);
    });
    it('should show empty when loaded and array empty', () => {
      component.query = 'test';
      component.loading = false;
      component.notes = [];
      expect(component.isEmptyView).toBe(true);
      expect(component.isLoadingView).toBe(false);
      expect(component.isResultView).toBe(false);
    });
  });
});
