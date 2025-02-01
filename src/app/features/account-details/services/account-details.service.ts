import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import { Firestore, doc, docData, getDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountDetailsService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  getAccountDataById(accountId: string): Observable<any> {
    return runInInjectionContext(this.injector, () =>
      docData(doc(this.firestore, `accounts/${accountId}`))
    );
  }

  existAccountId(accountId: string): Observable<boolean> {
    return runInInjectionContext(this.injector, () => {
      const docRef = doc(this.firestore, `accounts/${accountId}`);
      return from(getDoc(docRef)).pipe(map((docSnap) => docSnap.exists()));
    });
  }
}
