import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { EventEmitter } from 'events';

const router = Router();
router.use(requireAuth);

// Global event emitter for MVP
export const missionStreamEmitter = new EventEmitter();

router.get('/:id/stream', (req: Request, res: Response) => {
  const missionId = req.params.id;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const onEvent = (data: any) => {
    if (data.missionId === missionId) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  missionStreamEmitter.on('mission_event', onEvent);

  const keepAlive = setInterval(() => {
    res.write(':\n\n');
  }, 15000);

  req.on('close', () => {
    missionStreamEmitter.off('mission_event', onEvent);
    clearInterval(keepAlive);
  });
});

export default router;
