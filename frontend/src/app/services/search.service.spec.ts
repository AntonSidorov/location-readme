import { TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });
    service = TestBed.inject(SearchService);
    controller = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('search state is reset if results falsy', () => {
    const notesSpy = spyOn((service as any)._notes$, 'next');
    const querySpy = spyOn((service as any)._query$, 'next');
    const showSpy = spyOn((service as any)._showResults$, 'next');

    service.search('');
    expect(notesSpy).toHaveBeenCalledWith([]);
    expect(querySpy).toHaveBeenCalledWith('');
    expect(showSpy).toHaveBeenCalledWith(false);
  });
  it('search query and showResults are updated if the query is a string', () => {
    const notesSpy = spyOn((service as any)._notes$, 'next');
    const querySpy = spyOn((service as any)._query$, 'next');
    const showSpy = spyOn((service as any)._showResults$, 'next');

    service.search('test string');
    expect(notesSpy).not.toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledWith('test string');
    expect(showSpy).toHaveBeenCalledWith(true);
  });

  // TODO: this method overall might be worth removing
  it('showResults calls the BehaviorSubject', () => {
    const showSpy = spyOn((service as any)._showResults$, 'next');
    service.showResults(true);
    expect(showSpy).toHaveBeenCalledWith(true);
  });
});
