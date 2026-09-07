import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { AdminLogin } from '../../models/admin-login';

export interface LoginResponse {
  message: string;
  token: string;
  expiresAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7077/api/Admin/login';

  constructor(
    private http: HttpClient
  ) {}

  login(credentials: AdminLogin): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        this.apiUrl,
        credentials
      )
      .pipe(

        tap(response => {

          localStorage.setItem(
            'jwtToken',
            response.token
          );

          localStorage.setItem(
            'tokenExpiresAt',
            response.expiresAt
          );

        })

      );
  }

  logout(): void {

    localStorage.removeItem(
      'jwtToken'
    );

    localStorage.removeItem(
      'tokenExpiresAt'
    );

  }

  isLoggedIn(): boolean {

    const token =
      localStorage.getItem('jwtToken');

    const expiresAt =
      localStorage.getItem('tokenExpiresAt');

    if (!token || !expiresAt) {

      return false;

    }

    const expiryTime = new Date(expiresAt).getTime();

    // treat a missing/unparsable or elapsed expiry as logged out, and clear the stale session
    if (Number.isNaN(expiryTime) || expiryTime <= Date.now()) {

      this.logout();

      return false;

    }

    return true;

  }

  getToken(): string | null {

    return localStorage.getItem(
      'jwtToken'
    );

  }

}