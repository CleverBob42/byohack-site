// Prints a Runtime.evaluate expression for the Wix editor tab (izeus.org site). It replaces only the
// "// >>> izeus-support" ... "// <<< izeus-support" block in the shared backend/http-functions.js (or
// appends it), leaving every other project's code untouched. Wix autosaves code files; publish afterwards.
import { readFileSync } from 'node:fs';

const block = readFileSync(new URL('izeus-support-block.js', import.meta.url), 'utf8').trim();

async function sync(block, name) {
  const m = monaco.editor.getModels().find((x) => x.uri.path === '/backend/http-functions.js');
  if (!m) return 'missing backend/http-functions.js';
  const cur = m.getValue();
  const re = new RegExp(`// >>> ${name}\\b[\\s\\S]*?// <<< ${name}\\b`);
  const next = re.test(cur) ? cur.replace(re, () => block) : `${cur.trimEnd()}\n\n${block}\n`;
  const outside = (s) => s.replace(re, '').trim();
  if (outside(next) !== outside(cur)) return `aborted: code outside the ${name} block would change`;
  m.pushEditOperations([], [{ range: m.getFullModelRange(), text: next }], () => null);
  await new Promise((r) => setTimeout(r, 6000));
  const exports = [...m.getValue().matchAll(/export (?:async )?function (\w+)/g)].map((x) => x[1]);
  return JSON.stringify({ len: m.getValue().length, ok: m.getValue() === next, exports });
}

process.stdout.write(`(${sync.toString()})(${JSON.stringify(block)}, 'izeus-support')`);
