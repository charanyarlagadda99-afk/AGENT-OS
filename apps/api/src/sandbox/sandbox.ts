import { spawn } from 'child_process';
import path from 'path';

export interface ExecuteOptions {
  timeout?: number;
  maxBuffer?: number;
  env?: Record<string, string>;
}

export interface ExecuteResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

export async function executeCommand(command: string, cwd: string, options: ExecuteOptions = {}): Promise<ExecuteResult> {
  const { timeout = 120000, maxBuffer = 1024 * 1024 * 10, env = {} } = options;
  
  // Basic validation to ensure cwd is somewhat safe, assuming workspace check is done earlier
  const normalizedCwd = path.normalize(cwd);
  
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      shell: true,
      cwd: normalizedCwd,
      env: { ...process.env, ...env },
      timeout,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      if (stdout.length > maxBuffer) {
        child.kill();
        reject(new Error('maxBuffer exceeded'));
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (exitCode) => {
      resolve({ stdout, stderr, exitCode });
    });
  });
}
