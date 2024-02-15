import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { of, throwError } from 'rxjs';
import { SessionsModule } from 'src/app/features/sessions/sessions.module';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockSessionService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
    };

    mockSessionService = {
      logIn: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: SessionsModule },
        ]),
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form', () => {
    expect(component.form).toBeTruthy();
  });

  it('should login with correct credentials', () => {
    const loginRequest = { email: 'yoga@studio.com', password: 'test!1234' };
    const sessionInfo = {
      token: 'user',
      type: 'type',
      id: 1,
      username: 'user',
      firstName: 'Cedric',
      lastName: 'Faraud',
      admin: false,
    };
    mockAuthService.login = jest.fn(() => of(sessionInfo));
    component.form.setValue(loginRequest);
    component.submit();
    expect(mockAuthService.login).toHaveBeenCalledWith(loginRequest);
    expect(mockSessionService.logIn).toHaveBeenCalledWith(sessionInfo);
    expect(component.onError).toBeFalsy();
  });

  it('should not login with incorrect email', () => {
    const loginRequest = { email: 'bad@mail.com', password: 'test!1234' };
    component.form.setValue(loginRequest);
    mockAuthService.login = jest
      .fn()
      .mockReturnValue(throwError('Bad credentials'));
    component.submit();
    expect(component.onError).toBe(true);
  });
  it('should not login with incorrect password', () => {
    const loginRequest = { email: 'yoga@studio.com', password: 'badpassword' };
    component.form.setValue(loginRequest);
    mockAuthService.login = jest
      .fn()
      .mockReturnValue(throwError('Bad credentials'));
    component.submit();
    expect(component.onError).toBe(true);
  });
});
