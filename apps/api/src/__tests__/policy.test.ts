import { describe, it, expect } from 'vitest';
import { classifyCommand, isAllowed } from '../sandbox/policy.js';

describe('Sandbox Policy Engine', () => {
  it('should classify read-only commands', () => {
    expect(classifyCommand('ls -la')).toBe('READ_ONLY');
    expect(classifyCommand('cat package.json')).toBe('READ_ONLY');
    expect(classifyCommand('git status')).toBe('READ_ONLY');
  });

  it('should classify write & build commands', () => {
    expect(classifyCommand('npm test')).toBe('LOW_RISK_WRITE');
    expect(classifyCommand('npm run build')).toBe('LOW_RISK_WRITE');
  });

  it('should detect destructive commands', () => {
    expect(classifyCommand('rm -rf /')).toBe('DESTRUCTIVE');
    expect(classifyCommand('shutdown')).toBe('DESTRUCTIVE');
  });

  it('should enforce allowlist', () => {
    expect(isAllowed('ls')).toBe(true);
    expect(isAllowed('npm test')).toBe(true);
    expect(isAllowed('rm -rf /')).toBe(false);
  });
});
