import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
        ]),
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit valid form', () => {
    const registerForm = {
      email: 'cedric@studio.com',
      firstName: 'Cedric',
      lastName: 'Faraud',
      password: 'password',
    };
    mockAuthService.register = jest.fn(() => of(registerForm));
    component.form.patchValue(registerForm);
    component.submit();
    expect(component.form.valid).toBeTruthy();
    expect(mockAuthService.register).toHaveBeenCalledWith(registerForm);
  });

  it('should not submit invalid form', () => {
    const registerForm = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    };
    mockAuthService.register = jest
      .fn()
      .mockReturnValue(throwError('Invalid form'));
    component.form.patchValue(registerForm);
    component.submit();
    expect(component.form.valid).toBeFalsy();
  });
});
