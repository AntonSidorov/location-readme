import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, RouterTestingModule],
    });
    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('ngOnDestroy should emit unsubscribe$', () => {
    const spy = spyOn(service.unsubscribe$, 'next');
    service.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
