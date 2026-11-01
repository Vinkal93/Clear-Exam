import * as admin from 'firebase-admin';
import { env } from '../config/env';
import { logger } from './logger';

let initialized = false;

export function getFirebaseAdmin(): typeof admin {
  if (!initialized) {
    if (admin.apps.length === 0) {
      if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
          })
        });
        logger.info({ projectId: env.FIREBASE_PROJECT_ID }, 'Firebase Admin initialized via service account credentials');
      } else {
        // Fallback for local emulator or Google Cloud default credentials
        admin.initializeApp({
          projectId: env.FIREBASE_PROJECT_ID
        });
        logger.info({ projectId: env.FIREBASE_PROJECT_ID }, 'Firebase Admin initialized with default/emulator credentials');
      }
    }
    initialized = true;
  }
  return admin;
}

export function getFirestore(): admin.firestore.Firestore {
  return getFirebaseAdmin().firestore();
}

export function getFirebaseAuth(): admin.auth.Auth {
  return getFirebaseAdmin().auth();
}
