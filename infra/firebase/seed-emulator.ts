/**
 * ClearExam Local Emulator Bootstrap Script
 * Populates clean baseline collections into Firestore emulator.
 * DO NOT RUN AGAINST PRODUCTION.
 */

import * as admin from 'firebase-admin';

process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';

if (!process.env.FIRESTORE_EMULATOR_HOST.includes('localhost') && !process.env.FIRESTORE_EMULATOR_HOST.includes('127.0.0.1')) {
  console.error('FATAL: Attempted to run seed script without local emulator host!');
  process.exit(1);
}

admin.initializeApp({
  projectId: 'clearexam-dev'
});

const db = admin.firestore();

async function seed() {
  console.log('Seeding baseline collections in Firestore Emulator...');

  // 1. Initial system settings
  await db.collection('system_settings').doc('global').set({
    maintenanceMode: false,
    minAndroidAppVersion: '1.0.0',
    currentVersion: '1.0.0',
    updatedAt: new Date().toISOString()
  });

  console.log('Bootstrap completed successfully.');
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
