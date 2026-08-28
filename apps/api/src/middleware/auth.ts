import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, createScopedClient } from '../db/client.js';
import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
      supabase?: SupabaseClient;
      orgId?: string;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.DEMO_MODE === 'true') {
    const demoOrgId = '00000000-0000-0000-0000-000000000001';
    req.user = { id: 'demo-user-id', email: 'demo@agentos.io' };
    req.orgId = demoOrgId;
    req.supabase = supabaseAdmin; // For demo, act as admin
    req.token = 'demo-token';
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    // Get user's org
    const { data: memberData } = await supabaseAdmin
      .from('organization_members')
      .select('org_id')
      .eq('user_id', user.id)
      .single();

    req.user = user;
    req.token = token;
    req.supabase = createScopedClient(token);
    req.orgId = memberData?.org_id;
    
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal auth error' });
  }
};
