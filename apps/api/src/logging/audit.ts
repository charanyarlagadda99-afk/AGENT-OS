import { supabaseAdmin } from '../db/client.js';
import { logger } from './logger.js';

export async function logAudit(
  action: string,
  resourceType: string,
  resourceId: string,
  actorId: string,
  orgId: string,
  metadata?: Record<string, any>
) {
  try {
    const { error } = await supabaseAdmin.from('audit_logs').insert({
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      actor_id: actorId,
      org_id: orgId,
      metadata
    });

    if (error) {
      logger.error('Failed to write audit log', error, { action, resourceId });
    }
  } catch (error) {
    logger.error('Exception writing audit log', error, { action, resourceId });
  }
}
