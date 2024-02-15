import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;
  let mockRoute: any = { snapshot: { paramMap: { get: jest.fn() } } };
  let mockMatSnackBar = { open: jest.fn() };
  let router: Router;
  let mockSessionApiService = {
    delete: jest.fn((sessionId: string) => of({})),
    detail: jest.fn((sessionId: string) => of()),
  }; // mock sessionApiService return empty object

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'sessions', redirectTo: '' }]),
        HttpClientTestingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();
    service = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Delete', () => {
    it('delete session succesful', () => {
      jest.spyOn(router, 'navigate');
      component.delete();
      expect(mockSessionApiService.delete).toHaveBeenCalledTimes(1);
      mockSessionApiService.delete.mockReturnValue(
        of(
          mockMatSnackBar.open('Session deleted !'),
          router.navigate(['sessions'])
        )
      );

      expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session deleted !');
      expect(router.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });
});
