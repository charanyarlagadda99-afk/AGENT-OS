import { describe, it, expect } from 'vitest';

describe('User API', () => {
  it('should validate user input', () => {
    const input = { name: '', email: 'invalid' };
    // BUG: Test expects wrong thing — name min length is 1, this should fail
    expect(input.name.length).toBeGreaterThan(0); // This will FAIL
  });

  it('should create a user', () => {
    const user = { id: 1, name: 'Test', email: 'test@example.com' };
    expect(user.name).toBe('Test');
    expect(user.email).toContain('@');
  });

  it('should return 201 for created resource', () => {
    const statusCode = 200; // BUG: Should be 201
    expect(statusCode).toBe(201); // This will FAIL
  });
});

describe('Task API', () => {
  it('should create a task', () => {
    const task = { id: 1, title: 'Fix bugs', completed: false };
    expect(task.title).toBeDefined();
    expect(task.completed).toBe(false);
  });

  it('should mark task as complete', () => {
    const task = { id: 1, title: 'Fix bugs', completed: true };
    expect(task.completed).toBe(true);
  });
});
