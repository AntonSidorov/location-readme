import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { BehaviorSubject, of } from 'rxjs';

import { mockDataset } from '../models';
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
    auth.isAuthenticated$ = () => s.asObservable();
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updateNickname should call the API', fakeAsync(() => {
    const spyApi = spyOn(api, 'updateNickname$').and.returnValue(of(true));
    service.updateNickname('new nickname');
    tick(1);
    expect(spyApi).toHaveBeenCalled();
  }));

  it('user$ calls API if authenticated', fakeAsync(() => {
    const subscriber = jasmine.createSpy('subscriber');
    spyOn(auth, 'isAuthenticated$').and.returnValue(of(true));
    spyOn(api, 'user$').and.returnValue(of(mockDataset.users[0]));
    service.user$.subscribe(subscriber);

    s.next(true);
    tick(1);
    expect(subscriber).toHaveBeenCalledWith(mockDataset.users[0]);
  }));
});
