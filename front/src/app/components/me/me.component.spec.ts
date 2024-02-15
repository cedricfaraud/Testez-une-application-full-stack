import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { expect, jest } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Me', () => {
    let mockRouter: any;
    let mockMatSnackBar!: MatSnackBar;

    let mockUserService: any = {
      getById: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    };

    let mockComponent: MeComponent = new MeComponent(
      mockRouter as Router,
      mockSessionService as SessionService,
      mockMatSnackBar as MatSnackBar,
      mockUserService as UserService
    );

    it('Displays user data', () => {
      let user: User | undefined;

      // Expected user information data
      user = {
        id: 1,
        email: 'email@studio.com',
        lastName: 'Cedric',
        firstName: 'Faraud',
        admin: true,
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockComponent.ngOnInit();

      expect(mockUserService.getById).toHaveBeenCalledTimes(1);
      expect(mockUserService.getById).toHaveBeenCalledWith(
        mockSessionService.sessionInformation.id.toString()
      );

      mockUserService.getById.mockReturnValue(of(user));
    });
  });
});
