/**
 * Cópia de segurança: exportar tudo e voltar a importar.
 *
 * Corre sem browser — o módulo usa localStorage, Blob e FileReader, por isso
 * o teste finge esses três com o mínimo necessário.
 */
import assert from 'node:assert/strict';

const guardado = new Map();
globalThis.localStorage = {
  getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
  setItem: (k, v) => guardado.set(k, String(v)),
  removeItem: (k) => guardado.delete(k),
};
let ultimoDescarregado = null;
globalThis.Blob = class { constructor(partes) { this.texto = partes.join(''); } };
globalThis.URL = { createObjectURL: (b) => { ultimoDescarregado = b.texto; return 'blob:x'; }, revokeObjectURL() {} };
globalThis.document = {
  createElement: () => ({ click() {}, remove() {}, set href(_v) {}, set download(_v) {} }),
  body: { appendChild() {} },
};
globalThis.FileReader = class {
  readAsText(f) { this.result = f.texto; queueMicrotask(() => this.onload()); }
};

const A = await import('../src/engine/armazenamento.js');

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}
async function testeAsync(nome, fn) {
  try { await fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

const ficha = (nome) => ({ nome, atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 }, pericias: {} });

console.log('\nCópia de segurança');

teste('sem agentes não pede cópia — não há nada a perder', () => {
  guardado.clear();
  assert.equal(A.precisaDeCopia(), false);
});

teste('com agentes e sem cópia nenhuma, pede', () => {
  guardado.clear();
  A.guardarAgente(ficha('Um'));
  assert.equal(A.ultimaCopia(), null);
  assert.equal(A.precisaDeCopia(), true);
});

teste('exportarTudo escreve o pacote com cabeçalho e conta os agentes', () => {
  guardado.clear();
  A.guardarAgente(ficha('Um'));
  A.guardarAgente(ficha('Dois'));
  const n = A.exportarTudo();
  assert.equal(n, 2);
  const pacote = JSON.parse(ultimoDescarregado);
  assert.equal(pacote.tipo, A.TIPO_COPIA);
  assert.equal(pacote.total, 2);
  assert.equal(pacote.agentes.length, 2);
  assert.ok(pacote.guardadoEm);
});

teste('depois de marcar a cópia, deixa de pedir', () => {
  A.marcarCopiaFeita();
  assert.equal(A.precisaDeCopia(), false);
});

teste('uma cópia com mais de 14 dias volta a pedir', () => {
  const ha20dias = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString();
  guardado.set('ordo:ultima-copia', ha20dias);
  assert.equal(A.precisaDeCopia(), true);
});

await testeAsync('repor uma cópia JUNTA aos que já existem, com ids novos', async () => {
  guardado.clear();
  A.guardarAgente(ficha('Um'));
  A.guardarAgente(ficha('Dois'));
  A.exportarTudo();
  const copia = ultimoDescarregado;
  const idsAntes = A.listarAgentes().map((a) => a.id);

  const r = await A.importarCopia({ texto: copia }, 'juntar');
  assert.equal(r.importados, 2);
  assert.equal(A.listarAgentes().length, 4, 'juntou em vez de substituir');
  const idsDepois = A.listarAgentes().map((a) => a.id);
  assert.equal(new Set(idsDepois).size, 4, 'os ids têm de ser todos diferentes');
  idsAntes.forEach((id) => assert.ok(idsDepois.includes(id), 'os antigos não se perdem'));
});

await testeAsync('repor em modo substituir deixa só os do ficheiro', async () => {
  guardado.clear();
  A.guardarAgente(ficha('Antigo'));
  A.exportarTudo();
  const copia = ultimoDescarregado;
  A.guardarAgente(ficha('Outro'));
  assert.equal(A.listarAgentes().length, 2);

  const r = await A.importarCopia({ texto: copia }, 'substituir');
  assert.equal(r.importados, 1);
  assert.deepEqual(A.listarAgentes().map((a) => a.nome), ['Antigo']);
});

await testeAsync('aceita também uma ficha solta e uma lista solta', async () => {
  guardado.clear();
  await A.importarCopia({ texto: JSON.stringify(ficha('Solta')) });
  assert.equal(A.listarAgentes().length, 1);
  await A.importarCopia({ texto: JSON.stringify([ficha('A'), ficha('B')]) });
  assert.equal(A.listarAgentes().length, 3);
});

await testeAsync('recusa lixo em vez de apagar o que lá está', async () => {
  guardado.clear();
  A.guardarAgente(ficha('Importante'));
  await assert.rejects(() => A.importarCopia({ texto: '{"isto":"nao e uma ficha"}' }));
  await assert.rejects(() => A.importarCopia({ texto: 'nao e sequer json' }));
  assert.equal(A.listarAgentes().length, 1, 'o que já lá estava fica intacto');
});

console.log(`\n${passou} testes ok`);
