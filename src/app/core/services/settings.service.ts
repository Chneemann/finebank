import { EnvironmentInjector, inject, Injectable } from '@angular/core';
import {
  Observable,
  from,
  of,
  switchMap,
  catchError,
  throwError,
  BehaviorSubject,
  map,
  tap,
} from 'rxjs';
import {
  Firestore,
  collection,
  query,
  where,
  updateDoc,
  getDocs,
} from '@angular/fire/firestore';
import { runInInjectionContext } from '@angular/core';
import { AuthService } from './auth.service';
import { Settings } from '../models/settings.interface';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);
  private readonly authService = inject(AuthService);

  private readonly userId$: Observable<string | null>;

  private settingsSubject = new BehaviorSubject<Settings>({} as Settings);
  settingsData$ = this.settingsSubject.asObservable();

  constructor() {
    this.userId$ = this.authService.getUserId();
    this.loadInitialSettings();
  }

  private loadInitialSettings(): void {
    this.getAllSettings().subscribe((settings) => {
      this.settingsSubject.next(settings);
    });
  }

  private withUserId<T>(
    operation: (userId: string) => Observable<T>
  ): Observable<T> {
    return this.userId$.pipe(
      switchMap((userId) => {
        if (!userId) {
          return of(null as T);
        }
        return operation(userId);
      }),
      catchError((error) => {
        console.error('Operation failed:', error);
        return of(null as T);
      })
    );
  }

  getAllSettings(): Observable<Settings> {
    return this.withUserId((userId) =>
      runInInjectionContext(this.injector, () => {
        const accountsRef = collection(this.firestore, 'settings');
        const q = query(accountsRef, where('userId', '==', userId));

        return from(getDocs(q)).pipe(
          switchMap((querySnapshot) => {
            if (!querySnapshot.empty) {
              return of(querySnapshot.docs[0].data() as Settings);
            } else {
              return of({} as Settings);
            }
          }),
          catchError((error) => {
            console.error('Failed to fetch settings:', error);
            return of({} as Settings);
          })
        );
      })
    );
  }

  saveSettings(key: string, value: string | number): Observable<void> {
    return this.withUserId((userId) =>
      this.queryUserSettings(userId).pipe(
        switchMap((goalDocs) =>
          goalDocs.length
            ? from(
                Promise.all(
                  goalDocs.map(({ docRef }) =>
                    runInInjectionContext(this.injector, () =>
                      updateDoc(docRef, { [key]: value })
                    )
                  )
                )
              )
            : throwError(() => new Error('No settings found for the user.'))
        ),
        switchMap(() => this.getAllSettings()),
        tap((settings) => this.settingsSubject.next(settings)),
        map(() => undefined),
        catchError((error) =>
          throwError(() => {
            console.error('Error updating settings:', error);
            return error;
          })
        )
      )
    );
  }

  private queryUserSettings(userId: string): Observable<{ docRef: any }[]> {
    return runInInjectionContext(this.injector, () => {
      const accountsRef = collection(this.firestore, 'settings');
      const q = query(accountsRef, where('userId', '==', userId));

      return from(getDocs(q)).pipe(
        map((querySnapshot) => {
          return querySnapshot.docs.map((doc) => ({ docRef: doc.ref }));
        }),
        catchError((error) => {
          console.error('Error querying settings:', error);
          return of([]);
        })
      );
    });
  }
}
