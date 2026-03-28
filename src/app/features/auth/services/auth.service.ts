import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthResponse, UserAuth } from '../../../core/models/auth.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5125/api/auth';

  currentUser = signal<string | null>(this.getToken());

  login(credentials: UserAuth) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.currentUser.set(response.token);
      }),
    );
  }
  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
