import assert from 'node:assert/strict';
import { PERICIAS } from '../src/data/pericias.js';
import { PERICIAS_TEXTO } from '../src/data/periciasTexto.js';
import { personagemVazio } from '../src/engine/character.js';
import { calcPericias } from '../src/engine/calc.js';

console.log('Testing skill data consistency...');

const p = personagemVazio();
const linhas = calcPericias(p);

assert.equal(linhas.length, 28);

for (const l of linhas) {
  const t = PERICIAS_TEXTO[l.id];
  assert.ok(t, `Missing text for skill id: ${l.id}`);
  assert.ok(t.resumo, `Missing resumo for skill: ${l.nome}`);
  assert.ok(t.texto, `Missing texto for skill: ${l.nome}`);
  assert.ok(Array.isArray(t.usos), `usos must be array for: ${l.nome}`);
  assert.ok(Array.isArray(t.suplementos), `suplementos must be array for: ${l.nome}`);
  console.log(`  ok  ${l.nome} -> ${t.usos.length} usos, ${t.suplementos.length} suplementos`);
}

console.log('\nAll 28 skill datasets verified successfully!');
