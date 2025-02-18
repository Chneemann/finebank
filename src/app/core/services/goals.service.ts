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
  doc,
  docData,
  query,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  private allGoalsSubject = new BehaviorSubject<
    { goal: string; amount: number }[]
  >([]);
  allGoals$ = this.allGoalsSubject.asObservable();

  constructor() {
    this.loadGoals('lsui7823kmbndks9037hjdsd'); // TODO: Placeholder
  }

  private loadGoals(currentUserId: string): void {
    runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'goals');
      const q = query(collectionRef, where('userId', '==', currentUserId));

      collectionData(q, { idField: 'id' }).subscribe((documents) => {
        if (!documents.length) {
          this.allGoalsSubject.next([]);
          return;
        }

        const doc = documents[0] as { goal: string[]; amount: number[] };

        const formattedGoals = doc.goal.map((goal, index) => ({
          goal,
          amount: doc.amount[index] ?? 0,
        }));

        this.allGoalsSubject.next(formattedGoals);
      });
    });
  }
}
