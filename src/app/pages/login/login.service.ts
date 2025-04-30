import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User } from './interfaces/user.interface';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly MOCK_USERS: User[] = [
    { email: 'admin@demo.com', role: 'admin', password: 'admin123' },   
    { email: 'cliente@demo.com', role: 'cliente', password: 'cliente123',}
  ];

  private readonly _user$ = new BehaviorSubject<User | null>(this.getUserFromStorage());

  get user$(): Observable<User | null> {
    return this._user$.asObservable();
  }

  get currentUser(): User | null {
    return this._user$.value;
  }

  constructor() {}

  login(email: string, password: string): Observable<User> {
    // Simula validación con delay
    const user = this.MOCK_USERS.find(u => u.email === email);
    if (user) {
      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(user));
      this._user$.next(user);
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Credenciales inválidas'));
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    this._user$.next(null);
  }

  private getUserFromStorage(): User | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }
}
