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
  query,
  where,
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  catchError,
  of,
  tap,
} from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);
  private readonly authService = inject(AuthService);

  private readonly userId$: Observable<string | null>;

  private allUserBillsSubject = new BehaviorSubject<any[]>([]);
  allUserBills$ = this.allUserBillsSubject.asObservable();

  constructor() {
    this.userId$ = this.authService.getUserId();
    this.loadAllUserBills();
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

  // Balances

  private loadAllUserBills(): void {
    this.withUserId((userId) => {
      return runInInjectionContext(this.injector, () => {
        const collectionRef = collection(this.firestore, 'bills');
        const q = query(collectionRef, where('userId', '==', userId));

        return collectionData(q, { idField: 'id' }).pipe(
          catchError((error) => {
            console.error('Error fetching bills:', error);
            return of([]);
          }),
          tap((bills) => {
            this.allUserBillsSubject.next(bills);
          })
        );
      });
    }).subscribe();
  }
}
