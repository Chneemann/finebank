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
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { GoalModel } from '../models/goal.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);
  private readonly authService = inject(AuthService);

  private readonly userId$: Observable<string | null>;

  private allGoalsSubject = new BehaviorSubject<GoalModel[]>([]);
  allGoals$ = this.allGoalsSubject.asObservable();

  constructor() {
    this.userId$ = this.authService.getUserId();
    this.loadUserGoals();
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

  // Load Goals

  private loadUserGoals(): void {
    this.withUserId((userId) => {
      return runInInjectionContext(this.injector, () => {
        const collectionRef = collection(this.firestore, 'goals');
        const q = query(collectionRef, where('userId', '==', userId));

        return collectionData(q, { idField: 'id' }).pipe(
          tap((documents) => this.processFetchedGoals(documents, userId))
        );
      });
    }).subscribe();
  }

  private processFetchedGoals(documents: any[], userId: string): void {
    if (!documents.length) {
      this.allGoalsSubject.next([]);
      return;
    }

    const { id, goal, amount, selectedYear } = documents[0];

    const formattedGoals = goal.map((g: string, index: number) => ({
      id,
      selectedYear,
      goal: g,
      amount: amount[index],
      userId,
      index,
    }));

    this.allGoalsSubject.next(formattedGoals);
  }

  // Update Goals
  updateUserGoalAmount(index: number, newAmount: number): Observable<void> {
    return this.withUserId((userId) =>
      this.queryUserGoals(userId).pipe(
        switchMap((goalDocs) => {
          const { docRef, data } = goalDocs[0];
          const amounts = [...(data?.amount ?? [])];
          amounts[index] = newAmount;

          return from(
            runInInjectionContext(this.injector, () =>
              updateDoc(docRef, { amount: amounts })
            )
          );
        }),
        catchError((error) => throwError(() => error))
      )
    );
  }

  updateUserGoalSelectedYear(year: number): Observable<void> {
    return this.withUserId((userId) =>
      this.queryUserGoals(userId).pipe(
        switchMap((goalDocs) =>
          from(
            Promise.all(
              goalDocs.map(({ docRef }) =>
                runInInjectionContext(this.injector, () =>
                  updateDoc(docRef, { selectedYear: +year })
                )
              )
            )
          )
        ),
        map(() => void 0),
        catchError((error) => throwError(() => error))
      )
    );
  }

  // Firestore query helper
  private queryUserGoals(userId: string) {
    return from(
      runInInjectionContext(this.injector, async () => {
        const collectionRef = collection(this.firestore, 'goals');
        const q = query(collectionRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('No goal found for the user.');
        }
        return querySnapshot.docs.map((doc) => ({
          docRef: doc.ref,
          data: doc.data() as { amount?: number[] },
        }));
      })
    );
  }
}
