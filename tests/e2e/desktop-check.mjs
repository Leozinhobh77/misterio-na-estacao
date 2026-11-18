// Verificação da janela Electron via CDP (uso manual, não faz parte do vitest).
// Uso: 1) abra release/win-unpacked/*.exe com --remote-debugging-port=9222
//      2) node tests/e2e/desktop-check.mjs
const port = process.env.CDP_PORT || 9222;

const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const page = targets.find(t => t.type === 'page');
if (!page) throw new Error('Nenhuma página Electron encontrada.');

const ws = new WebSocket(page.webSocketDebuggerUrl);
let nextId = 0;
const pending = new Map();
ws.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
};
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

function send(method, params = {}) {
  return new Promise(resolve => {
    const id = ++nextId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.result?.exceptionDetails) throw new Error(response.result.exceptionDetails.text);
  return response.result?.result?.value;
}

const url = await evaluate('location.href');
if (process.env.RESUME === '1') {
  const resumed = await evaluate(`({
    home: !document.querySelector('#home').hidden,
    continueVisible: !document.querySelector('#continue-game').hidden,
    label: document.querySelector('#continue-game').textContent.trim(),
    url: location.href
  })`);
  console.log('retomada:', resumed);
  ws.close();
  if (!resumed.continueVisible) {
    console.error('FALHA: janela reaberta não ofereceu Continuar.');
    process.exit(1);
  }
  console.log('OK: janela reaberta manteve o save local.');
  process.exit(0);
}
const first = await evaluate(`({
  url: location.href,
  title: document.title,
  menu: !!document.querySelector('#new-game'),
  text: document.body.innerText.slice(0, 160)
})`);
console.log('abertura:', first);

await evaluate("document.querySelector('#new-game').click()");
const phase = await evaluate(`({
  game: !document.querySelector('#game').hidden,
  phase: document.querySelector('#phase-title').textContent,
  clues: document.querySelectorAll('#clue-buttons [data-clue]').length,
  canvas: !!document.querySelector('#phaser-host canvas')
})`);
console.log('fase 1:', phase);

await evaluate("document.querySelectorAll('#clue-buttons [data-clue]')[0].click()");
const saved = await evaluate(`(() => {
  const c = JSON.parse(localStorage.getItem('misterio-estacao:campaign:v2'));
  return { phase: c.phase, clues: c.clues, stored: !!c, url: location.href };
})()`);
console.log('save:', saved);

const csp = await evaluate(`(() => {
  const entries = performance.getEntriesByType('resource').map(e => e.name);
  return { external: entries.filter(n => !n.startsWith('app://station/') && !n.startsWith('data:')), total: entries.length };
})()`);
console.log('recursos:', csp);

ws.close();
if (!phase.game || phase.clues !== 4 || !saved.stored) {
  console.error('FALHA: janela desktop não iniciou a fase 1 ou não gravou o save.');
  process.exit(1);
}
console.log('OK: janela Electron abriu, iniciou a fase 1 e salvou a pista.', url);
