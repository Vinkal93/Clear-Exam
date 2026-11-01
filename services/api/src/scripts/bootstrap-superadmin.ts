/**
 * ClearExam Super Admin Bootstrap CLI Script
 *
 * Usage:
 *   npx tsx src/scripts/bootstrap-superadmin.ts --uid <FIREBASE_UID> [--email <EMAIL>] [--dry-run]
 *
 * Security:
 *   - Runs exclusively via trusted server shell.
 *   - No public HTTP endpoints exposed.
 *   - Logs an authoritative security audit record.
 */

import { getFirebaseAuth, getFirestore } from '../lib/firebase';
import { logAuditEvent } from '../lib/audit';

function parseArgs() {
  const args = process.argv.slice(2);
  let uid: string | undefined;
  let email: string | undefined;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--uid' && args[i + 1]) {
      uid = args[i + 1];
      i++;
    } else if (args[i] === '--email' && args[i + 1]) {
      email = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    }
  }

  return { uid, email, dryRun };
}

async function main() {
  const { uid, email, dryRun } = parseArgs();

  if (!uid) {
    console.error('Error: --uid is required.');
    console.error('Usage: npx tsx src/scripts/bootstrap-superadmin.ts --uid <FIREBASE_UID> [--email <EMAIL>] [--dry-run]');
    process.exit(1);
  }

  console.log('----------------------------------------------------');
  console.log('ClearExam Super Admin Provisioning Tool');
  console.log('Target UID:   ', uid);
  console.log('Target Email: ', email || '(Not specified)');
  console.log('Dry Run Mode: ', dryRun ? 'YES (No changes will be applied)' : 'NO (Live Execution)');
  console.log('----------------------------------------------------');

  if (dryRun) {
    console.log('[DRY-RUN PREVIEW] Would set Firebase Auth Custom Claims: { role: "SUPER_ADMIN" }');
    console.log(`[DRY-RUN PREVIEW] Would upsert Firestore document: /users/${uid} with role: SUPER_ADMIN`);
    console.log('[DRY-RUN PREVIEW] Would write audit log event: BOOTSTRAP_SUPER_ADMIN');
    console.log('Dry run completed. Re-run without --dry-run to commit changes.');
    process.exit(0);
  }

  const auth = getFirebaseAuth();
  const db = getFirestore();

  console.log('1. Setting Firebase Auth Custom Claims...');
  await auth.setCustomUserClaims(uid, { role: 'SUPER_ADMIN' });
  console.log('   Custom claims set successfully.');

  console.log('2. Updating Firestore user profile...');
  const userDocRef = db.collection('users').doc(uid);
  const now = new Date().toISOString();
  await userDocRef.set({
    uid,
    email: email || null,
    role: 'SUPER_ADMIN',
    displayName: 'Super Admin',
    updatedAt: now,
    createdAt: now
  }, { merge: true });
  console.log('   Firestore user document updated.');

  console.log('3. Writing immutable audit log...');
  await logAuditEvent({
    actorUid: 'SYSTEM_BOOTSTRAP_CLI',
    actorRole: 'SUPER_ADMIN',
    action: 'BOOTSTRAP_SUPER_ADMIN',
    targetUid: uid,
    details: {
      email: email || null,
      method: 'CLI_BOOTSTRAP'
    }
  });
  console.log('   Audit log recorded.');

  console.log('SUCCESS: User', uid, 'has been elevated to SUPER_ADMIN.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal bootstrap failure:', err);
  process.exit(1);
});
