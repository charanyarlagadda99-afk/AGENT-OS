import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req: Request, res: Response) => {
  try {
    let query = req.supabase!.from('approvals').select('*').eq('org_id', req.orgId);
    if (req.query.status) {
      query = query.eq('status', req.query.status);
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('approvals').select('*').eq('id', req.params.id).eq('org_id', req.orgId).single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

const approvalActionSchema = z.object({
  reason: z.string().optional()
});

router.post('/:id/approve', validateBody(approvalActionSchema), async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!
      .from('approvals')
      .update({ status: 'approved', reason: req.body.reason, resolved_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .eq('org_id', req.orgId)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/:id/reject', validateBody(approvalActionSchema), async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!
      .from('approvals')
      .update({ status: 'rejected', reason: req.body.reason, resolved_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .eq('org_id', req.orgId)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
