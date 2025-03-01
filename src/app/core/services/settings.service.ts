import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);
  private readonly authService = inject(AuthService);

  private readonly userId$: Observable<string | null>;

  constructor() {
    this.userId$ = this.authService.getUserId();
  }

  // Auxiliary method for repeated logic with userId$
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

  getAllSettings() {
    return this.withUserId((userId) =>
      runInInjectionContext(this.injector, () => {
        const accountsRef = collection(this.firestore, 'settings');
        const q = query(accountsRef, where('userId', '==', userId));

        return collectionData(q, { idField: 'id' }).pipe(
          switchMap((settings: any[]) => {
            if (settings && settings.length > 0) {
              return of(settings[0]);
            } else {
              return of(null);
            }
          }),
          catchError((error) => {
            console.error('Failed to fetch settings:', error);
            return of(null);
          })
        );
      })
    );
  }

  saveSettings(key: string, value: string): Observable<void> {
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
    return from(
      runInInjectionContext(this.injector, async () => {
        const q = query(
          collection(this.firestore, 'settings'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) throw new Error('No settings found for the user.');
        return snapshot.docs.map((doc) => ({ docRef: doc.ref }));
      })
    );
  }
}
