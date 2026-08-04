/* Compiles every schema, validates examples/ against the envelope, and
   asserts the const maps in eap.ts exactly match the schema enums. */
import { readFileSync, readdirSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { ENUM_BINDINGS, SCHEMA_FILE, type SchemaFile } from './eap.ts';

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

const knownFiles = new Set<string>(Object.values(SCHEMA_FILE));
ok('SCHEMA_FILE covers schemas/', [...knownFiles].sort().join() === Object.keys(schemas).sort().join(),
  `map: ${[...knownFiles].sort().join()} dir: ${Object.keys(schemas).sort().join()}`);

const atPointer = (doc: unknown, pointer: string): unknown =>
  pointer.split('/').slice(1).reduce<unknown>(
    (o, key) => (o as Record<string, unknown> | undefined)?.[key.replaceAll('~1', '/').replaceAll('~0', '~')],
    doc,
  );

for (const b of ENUM_BINDINGS) {
  const found = atPointer(schemas[b.file], b.pointer);
  const schemaValues = Array.isArray(found) ? found : [found];
  const same = JSON.stringify([...b.values].sort()) === JSON.stringify([...schemaValues].sort());
  ok(`enum in sync: ${b.name}`, same, `eap.ts: ${b.values.join()} schema: ${schemaValues.join()}`);
}

const envelopeSchema = schemas[SCHEMA_FILE.envelope];
if (!envelopeSchema) throw new Error('envelope schema missing from schemas/');
const envelope = ajv.getSchema(envelopeSchema.$id);
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
