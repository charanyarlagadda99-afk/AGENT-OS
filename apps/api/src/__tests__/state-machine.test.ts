import { describe, it, expect } from 'vitest';
import { validateTransition } from '../agents/runtime/state-machine.js';

describe('State Machine Transitions', () => {
  it('should allow valid agent state transitions', () => {
    expect(validateTransition('agent', 'IDLE', 'PLANNING')).toBe(true);
    expect(validateTransition('agent', 'PLANNING', 'RUNNING')).toBe(true);
    expect(validateTransition('agent', 'RUNNING', 'PAUSED')).toBe(true);
    expect(validateTransition('agent', 'PAUSED', 'RUNNING')).toBe(true);
    expect(validateTransition('agent', 'RUNNING', 'COMPLETED')).toBe(true);
  });

  it('should reject invalid agent state transitions', () => {
    expect(validateTransition('agent', 'IDLE', 'COMPLETED')).toBe(false);
    expect(validateTransition('agent', 'COMPLETED', 'RUNNING')).toBe(true); // Re-running completed agent
  });

  it('should allow valid mission state transitions', () => {
    expect(validateTransition('mission', 'QUEUED', 'PLANNING')).toBe(true);
    expect(validateTransition('mission', 'PLANNING', 'RUNNING')).toBe(true);
    expect(validateTransition('mission', 'RUNNING', 'VERIFYING')).toBe(true);
    expect(validateTransition('mission', 'VERIFYING', 'COMPLETED')).toBe(true);
  });
});
