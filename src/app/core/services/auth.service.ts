import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);
  }

  getUserId(): Observable<string | null> {
    return this.user$.pipe(map((user) => (user ? user.uid : null)));
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
