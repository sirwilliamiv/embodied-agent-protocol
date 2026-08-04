/* Compiles every schema and validates examples/ against the envelope. */
import { readFileSync, readdirSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ajv = new Ajv2020({ strict: false });
addFormats(ajv);

let failed = 0;
const ok = (name: string, cond: boolean, detail = ''): void => {
  console.log((cond ? 'PASS' : 'FAIL') + '  ' + name + (cond ? '' : '  ' + detail));
  if (!cond) failed++;
};

const schemas: Record<string, { $id: string }> = {};
for (const f of readdirSync('schemas')) {
  const s = JSON.parse(readFileSync('schemas/' + f, 'utf8')) as { $id: string };
  schemas[f] = s;
  try { ajv.addSchema(s); ok('schema compiles: ' + f, true); }
  catch (e) { ok('schema compiles: ' + f, false, (e as Error).message); }
}

const envelope = ajv.getSchema(schemas['envelope.schema.json']!.$id);
if (!envelope) throw new Error('envelope schema not registered');
for (const f of readdirSync('examples')) {
  const lines = readFileSync('examples/' + f, 'utf8').trim().split('\n');
  lines.forEach((line, i) => {
    const msg = JSON.parse(line) as { type?: string };
    ok(`${f}:${i + 1} ${msg.type}`, envelope(msg) === true, JSON.stringify(envelope.errors));
  });
}

console.log(failed ? `\n${failed} FAILURE(S)` : '\nSPEC VALID');
process.exit(failed ? 1 : 0);
