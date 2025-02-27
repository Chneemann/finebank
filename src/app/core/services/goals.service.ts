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
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { GoalModel } from '../models/goal.model';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  private allGoalsSubject = new BehaviorSubject<GoalModel[]>([]);
  allGoals$ = this.allGoalsSubject.asObservable();

  private userId = 'tr7rEUaccEQeSQ3VlNcFADcYp1i21'; // TODO: Placeholder

  constructor() {
    this.loadGoals();
  }

  private loadGoals(): void {
    runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'goals');
      const q = query(collectionRef, where('userId', '==', this.userId));

      collectionData(q, { idField: 'id' }).subscribe((documents) => {
        if (!documents.length) {
          this.allGoalsSubject.next([]);
          return;
        }

        const doc = documents[0] as {
          id: string;
          goal: string[];
          amount: number[];
          selectedYear: number;
          userId: string;
        };

        const formattedGoals = doc.goal.map((goal, index) => ({
          id: doc.id,
          selectedYear: doc.selectedYear,
          goal: goal ?? 'Unknown',
          amount: doc.amount[index] ?? 0,
          userId: this.userId,
          index: index,
        }));

        this.allGoalsSubject.next(formattedGoals);
      });
    });
  }

  async updateGoalAmount(
    docId: string,
    index: number,
    newAmount: number
  ): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const docRef = doc(this.firestore, 'goals', docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as { amount?: number[] };
        const amounts = data?.amount ?? [];

        amounts[index] = newAmount;

        await runInInjectionContext(this.injector, () =>
          updateDoc(docRef, { amount: amounts })
        );
      }
    });
  }

  async updateSelectedYear(year: number): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const collectionRef = collection(this.firestore, 'goals');
      const q = query(collectionRef, where('userId', '==', this.userId));
      const querySnapshot = await getDocs(q);

      await Promise.all(
        querySnapshot.docs.map((doc) =>
          runInInjectionContext(this.injector, () =>
            updateDoc(doc.ref, { selectedYear: year })
          )
        )
      );
    });
  }
}
