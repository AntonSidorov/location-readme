import { TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthInterceptorService } from './auth.interceptor.service';

describe('AuthInterceptorService', () => {
  let service: AuthInterceptorService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ApolloTestingModule, RouterTestingModule, HttpClientTestingModule] });
    service = TestBed.inject(AuthInterceptorService);
    controller = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('headers should create an Authorization header if jwt present', () =>
    expect(service.headers('abc123')).toEqual({ Authorization: 'Bearer abc123' }));
  it('headers should not create any headers if jwt not present', () => expect(service.headers()).toEqual({}));
  it('headers should not create any headers if jwt not present', () => expect(service.headers()).toEqual({}));
});
