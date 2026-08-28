import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root of repository and web app dir
const webDist = path.resolve(__dirname, 'dist');
const rootDir = path.resolve(__dirname, '../..');
const rootDist = path.resolve(rootDir, 'dist');
const nestedDist = path.resolve(__dirname, 'apps/web/dist');
const altRootDist = path.resolve(__dirname, '../dist');

const targets = [webDist, rootDist, nestedDist, altRootDist];

console.log(`Copying dist from ${webDist} to all deployment targets...`);

for (const target of targets) {
  if (target !== webDist || !fs.existsSync(webDist)) {
    try {
      fs.mkdirSync(target, { recursive: true });
      fs.cpSync(webDist, target, { recursive: true });
      console.log(`Successfully synced dist to: ${target}`);
    } catch (err) {
      console.error(`Warning syncing to ${target}:`, err);
    }
  }
}
