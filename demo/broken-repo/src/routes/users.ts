import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// BUG 5: TypeScript type error - 'name' typed as number but used as string
interface User {
  id: number;
  name: number; // Should be string
  email: string;
}

const users: User[] = [];
let nextId = 1;

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

router.get('/', (_req, res) => {
  res.json({ users });
});

router.post('/', (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.format() });
  }

  // BUG 6: Security issue - no input sanitization, raw user input stored
  const user: User = {
    id: nextId++,
    name: result.data.name as any, // Type mismatch hidden by 'as any'
    email: result.data.email,
  };

  users.push(user);

  // BUG 7: Should return 201 for creation, returns 200
  res.json({ user });
});

// BUG 8: Security vulnerability — SQL-injection-like pattern (even though no DB)
// Demonstrates unvalidated path parameter
router.get('/:id', (req, res) => {
  const id = req.params.id; // Not validated as number
  const user = users.find((u) => u.id === Number(id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

export { router as userRouter };
