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
  query,
  updateDoc,
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
    {
      id: string;
      selectedYear: number;
      goal: string;
      amount: number;
      index: number;
    }[]
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

        const doc = documents[0] as {
          id: string;
          goal: string[];
          amount: number[];
          selectedYear?: number; // ✅ sicherstellen, dass selectedYear optional ist
        };

        const selectedYear = doc.selectedYear ?? new Date().getFullYear(); // ✅ Fallback: aktuelles Jahr, wenn selectedYear fehlt

        const formattedGoals = doc.goal.map((goal, index) => ({
          id: doc.id,
          selectedYear: selectedYear,
          goal: goal ?? 'Unknown',
          amount: doc.amount[index] ?? 0,
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

        await updateDoc(docRef, { amount: amounts });
      }
    });
  }
}
