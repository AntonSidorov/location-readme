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

  it('handleRedirectCallback should be piped from the client', () => {
    const spy = spyOn(service.auth0Client$, 'pipe');
    service.handleRedirectCallback$();
    expect(spy).toHaveBeenCalled();
  });

  it('user$ observable should be piped from isAuthenticated$', () => {
    const spy = spyOn(service, 'isAuthenticated$').and.callThrough();
    service.user$();
    expect(spy).toHaveBeenCalled();
  });
  it('jwt$ observable should be piped from isAuthenticated$', () => {
    const spy = spyOn(service, 'isAuthenticated$').and.callThrough();
    service.jwt$();
    expect(spy).toHaveBeenCalled();
  });
  it('getJwt$ observable should be piped from the client', () => {
    const spy = spyOn(service.auth0Client$, 'pipe').and.callThrough();
    service.getJwt$();
    expect(spy).toHaveBeenCalled();
  });
});
