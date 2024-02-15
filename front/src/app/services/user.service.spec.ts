import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';

import {UserService} from './user.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('UserService', () => {
  let service: UserService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UserService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get one specific user', () => {
    service.getById('1').subscribe((user) => {
      expect(user).toBeTruthy();
      const req = httpTestingController.expectOne('api/user/1');
      expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    });
  });

  it('should delete one specific user', () => {
    service.delete('1').subscribe((user) => {
      expect(user).toBeTruthy();
      const req = httpTestingController.expectOne('api/user/1');
      expect(req.request.method).toEqual('DELETE');
      httpTestingController.verify();
    });
  });
});
