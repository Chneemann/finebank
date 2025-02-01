import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { firebaseConfig } from '../environments/config';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "finebank-f6469", appId: "1:471884420405:web:d5036ae6cc0d8a41db687c", storageBucket: "finebank-f6469.firebasestorage.app", apiKey: "AIzaSyBhTCu7fhjZOBhwp4aeZ9TCGAIZLjtIZso", authDomain: "finebank-f6469.firebaseapp.com", messagingSenderId: "471884420405" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()),
  ],
};
