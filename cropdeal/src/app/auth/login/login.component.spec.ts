import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

// Mock Router
const mockRouter = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

// Mock AuthService
const mockAuthService = {
  setToken: jasmine.createSpy('setToken')
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoginComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

//   it('should store token and navigate to farmer-home on FARMER login', () => {
//   const fakeJwt = `header.${btoa(JSON.stringify({ role: 'FARMER' }))}.signature`;

//   spyOn(window, 'alert'); // avoid real alerts
//   spyOn(component['router'], 'navigateByUrl');

//   component.userObj = { email: 'test@farm.com', password: '123456' };
//   component.onLogin();

//   const req = httpMock.expectOne('http://localhost:8000/user/login');
//   expect(req.request.method).toBe('POST');

//   req.flush({ token: fakeJwt });

//   expect(localStorage.getItem('jwtToken')).toBe(fakeJwt);
//   expect(mockAuthService.setToken).toHaveBeenCalledWith(fakeJwt);
//   expect(component['router'].navigateByUrl).toHaveBeenCalledWith('/farmer-home');
// });


  it('should alert login failed if no token returned', () => {
    spyOn(window, 'alert');

    component.userObj = { email: 'wrong@user.com', password: 'badpass' };
    component.onLogin();

    const req = httpMock.expectOne('http://localhost:8000/user/login');
    req.flush({}, { status: 200, statusText: 'OK' });

    expect(window.alert).toHaveBeenCalledWith('Login failed');
  });

  it('should alert on login error response', () => {
    spyOn(window, 'alert');

    component.userObj = { email: 'error@user.com', password: 'badpass' };
    component.onLogin();

    const req = httpMock.expectOne('http://localhost:8000/user/login');
    req.flush({ message: 'Error' }, { status: 401, statusText: 'Unauthorized' });

    expect(window.alert).toHaveBeenCalledWith('Login failed.');
  });
});
