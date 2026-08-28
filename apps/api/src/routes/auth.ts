import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';
import { supabaseAdmin } from '../db/client.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

router.post('/signup', validateBody(signupSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  // Client is responsible for clearing the token. We can optionally invalidate it if using session ids.
  res.json({ success: true, data: { message: 'Logged out' } });
});

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      user: req.user,
      orgId: req.orgId
    }
  });
});

export default router;
