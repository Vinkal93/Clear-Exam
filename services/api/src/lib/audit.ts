import { getFirestore } from './firebase';
import { logger } from './logger';
import { v4 as uuidv4 } from 'uuid';

export interface AuditEventParams {
  actorUid: string;
  actorRole: string;
  action: string;
  targetUid?: string;
  details: Record<string, unknown>;
  requestId?: string;
}

export async function logAuditEvent(params: AuditEventParams): Promise<void> {
  const auditId = `audit_${uuidv4().replace(/-/g, '')}`;
  const logEntry = {
    id: auditId,
    actorUid: params.actorUid,
    actorRole: params.actorRole,
    action: params.action,
    targetUid: params.targetUid || null,
    details: params.details,
    requestId: params.requestId || null,
    timestamp: new Date().toISOString()
  };

  logger.info({ audit: logEntry }, `SECURITY AUDIT: ${params.action} by ${params.actorUid}`);

  try {
    const db = getFirestore();
    await db.collection('audit_logs').doc(auditId).set(logEntry);
  } catch (error: any) {
    // Audit logs must never crash the service if running in disconnected test mode, but must log critical warning
    logger.error({ err: error.message, audit: logEntry }, 'Failed to persist audit log document to Firestore');
  }
}
