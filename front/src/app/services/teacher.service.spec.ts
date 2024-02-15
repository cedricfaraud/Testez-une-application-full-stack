import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';

import { TeacherService } from './teacher.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('TeacherService', () => {
  let service: TeacherService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(TeacherService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all teachers', () => {
    service.all().subscribe((teachers) => {
      expect(teachers).toBeTruthy();
      const req = httpTestingController.expectOne('api/teacher');
      expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    });
  });

  it('should get one specific teacher', () => {
    service.detail('1').subscribe((teacher) => {
      expect(teacher).toBeTruthy();
      const req = httpTestingController.expectOne('api/teacher/1');
      expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    });
  });
});
