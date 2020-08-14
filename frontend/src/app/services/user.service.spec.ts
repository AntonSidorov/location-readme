import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let controller: ApolloTestingController;
  let api: ApiService;
  let auth: AuthService;
  const s = new BehaviorSubject<boolean>(false);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, RouterTestingModule],
    });
    controller = TestBed.inject(ApolloTestingController);
    api = TestBed.inject(ApiService);
    auth = TestBed.inject(AuthService);
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
