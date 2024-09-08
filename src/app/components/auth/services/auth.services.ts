import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {BehaviorSubject, catchError, map, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:3001/auth';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { email, password }).pipe(
      map((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        this.loggedIn.next(true);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  signup(fullname: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/signup`, { fullname, email, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse):Observable<any> {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.status === 401) {
      errorMessage = 'Email ou mot de passe incorrect';
    }
    else {
      errorMessage = `Erreur du serveur : ${error.status}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  logout() {
    // localStorage.removeItem('access_token');
    // this.loggedIn.next(false);
    // this.router.navigate(['/login']);

    const token = localStorage.getItem('access_token');

    if(token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const email = decodedToken.email;

      this.http.post(`${this.authUrl}/logout`, { email }).subscribe(() => {
        localStorage.removeItem('access_token');
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
      });
    } else {
      this.router.navigate(['/login'])
    }
  }

  public isAuthenticated() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = Date.now() >= payload.exp * 1000;

    return !isExpired;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  public get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
