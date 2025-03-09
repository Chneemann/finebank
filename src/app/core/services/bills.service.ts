import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import {
  DocumentData,
  Firestore,
  collection,
  collectionData,
  limit,
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
  map,
} from 'rxjs';
import { AuthService } from './auth.service';
import { BillModel } from '../models/bill.model';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);
  private readonly authService = inject(AuthService);

  private readonly userId$: Observable<string | null>;

  private userBillsSubject = new BehaviorSubject<BillModel[]>([]);
  userBills$ = this.userBillsSubject.asObservable();

  constructor() {
    this.userId$ = this.authService.getUserId();
    this.loadUserBills();
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

  // Bills

  getLimitedUserBills(limitCount: number): Observable<BillModel[]> {
    return this.userBills$.pipe(map((bills) => bills.slice(0, limitCount)));
  }

  private loadUserBills(limitCount?: number): void {
    this.withUserId((userId) => {
      return runInInjectionContext(this.injector, () => {
        const collectionRef = collection(this.firestore, 'bills');

        const q = limitCount
          ? query(
              collectionRef,
              where('userId', '==', userId),
              limit(limitCount)
            )
          : query(collectionRef, where('userId', '==', userId));

        return collectionData(q, { idField: 'id' }).pipe(
          catchError((error) => {
            console.error('Error fetching bills:', error);
            return of([]);
          }),
          map((rawBills: DocumentData[]) =>
            rawBills.map((rawBill) => new BillModel(rawBill))
          ),
          tap((bills: BillModel[]) => {
            this.userBillsSubject.next(bills);
          })
        );
      });
    }).subscribe();
  }
}
