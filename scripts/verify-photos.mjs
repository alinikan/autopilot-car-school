import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const origin = new URL(process.argv[2] || 'https://autopilot-car-school.vercel.app');
if (!['http:', 'https:'].includes(origin.protocol) || origin.username || origin.password)
  throw new Error('Use an HTTP(S) app origin without credentials.');
const photos = Object.values(
  JSON.parse(await readFile(new URL('src/content/photos/manifest.json', root), 'utf8')),
);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const failures = [];
let next = 0,
  passed = 0;
async function worker() {
  while (next < photos.length) {
    const photo = photos[next++];
    try {
      const local = await readFile(new URL('public/cars/' + photo.file, root));
      const response = await fetch(new URL('/cars/' + photo.file, origin), {
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      if (!response.headers.get('content-type')?.startsWith('image/webp'))
        throw new Error('Unexpected content type');
      const remote = Buffer.from(await response.arrayBuffer());
      if (hash(local) !== hash(remote))
        throw new Error('Deployed bytes differ from the local asset');
      passed++;
    } catch (error) {
      failures.push({ id: photo.id, error: error.message });
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(
  JSON.stringify({ origin: origin.origin, checked: photos.length, passed, failures }, null, 2),
);
if (failures.length) process.exitCode = 1;
