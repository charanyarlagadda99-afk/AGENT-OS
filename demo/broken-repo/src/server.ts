// BUG 1: 'cors' is imported but NOT in package.json dependencies
import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/users.js';
import { taskRouter } from './routes/tasks.js';

const app = express();

app.use(cors());
app.use(express.json());

// BUG 2: Missing environment variable validation
const PORT = process.env.PORT;

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

app.get('/health', (_req, res) => {
  // BUG 3: Wrong status code — 201 for a health check should be 200
  res.status(201).json({ status: 'ok' });
});

// BUG 4: PORT could be undefined — no default fallback
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
