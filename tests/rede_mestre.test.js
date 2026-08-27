import assert from 'node:assert/strict';
import { normalizarCodigo } from '../src/overlay/transporte.js';

console.log('Testes da Camada de Rede do Mestre\n');

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

teste('Normalização de códigos de sala de jogadores', () => {
  assert.equal(normalizarCodigo('  OP-JOAO  '), 'op-joao');
  assert.equal(normalizarCodigo('sala@teste!123'), 'sala-teste-123');
  assert.equal(normalizarCodigo(''), 'mesa');
  assert.equal(normalizarCodigo(null), 'mesa');
});

console.log(`\n${passou} testes passaram!`);
