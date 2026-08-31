/**
 * Ganhos ao subir de NEX / nível — engine/subirNex.js.
 */
import assert from 'node:assert/strict';
import { degrausEntre, ganhosDoDegrau, resumoSubida } from '../src/engine/subirNex.js';
import { personagemVazio } from '../src/engine/character.js';
import { CLASSES_POR_ID, TRILHAS_POR_ID } from '../src/data/classes.js';

let n = 0;
function ok(nome, fn) { fn(); n++; console.log('  ok —', nome); }

// ── degrausEntre ────────────────────────────────────────────────────────
ok('um só degrau de 5 para 10', () => {
  assert.deepEqual(degrausEntre(5, 10), [10]);
});
ok('salto de vários degraus lista todos', () => {
  assert.deepEqual(degrausEntre(10, 25), [15, 20, 25]);
});
ok('descer não conta como subida', () => {
  assert.deepEqual(degrausEntre(40, 10), []);
});
ok('ficar igual não conta', () => {
  assert.deepEqual(degrausEntre(40, 40), []);
});
ok('99 é alcançável', () => {
  assert.ok(degrausEntre(95, 99).includes(99));
});

// ── ganhosDoDegrau ──────────────────────────────────────────────────────
const combatente = { ...personagemVazio(), classeId: 'combatente', trilhaId: 'aniquilador' };

ok('a tabela da classe entra no degrau certo', () => {
  const g = ganhosDoDegrau(combatente, 15);
  const esperado = CLASSES_POR_ID.combatente.tabelaNex.find((l) => l.nex === 15).habilidades;
  assert.deepEqual(g.daClasse, esperado);
});

ok('o poder da trilha entra no NEX do poder', () => {
  const g = ganhosDoDegrau(combatente, 10);
  const p = TRILHAS_POR_ID.aniquilador.poderes.find((x) => x.nex === 10);
  assert.equal(g.daTrilha.length, 1);
  assert.equal(g.daTrilha[0].nome, p.nome);
});

ok('um degrau sem poder de trilha não inventa nenhum', () => {
  const g = ganhosDoDegrau(combatente, 20);
  assert.equal(g.daTrilha.length, 0);
});

ok('sem classe nem trilha o degrau fica vazio, não rebenta', () => {
  const g = ganhosDoDegrau(personagemVazio(), 40);
  assert.equal(g.vazio, true);
  assert.deepEqual(g.daClasse, []);
  assert.deepEqual(g.daTrilha, []);
});

ok('Monstruoso traz os efeitos e notas do patamar', () => {
  const p = {
    ...personagemVazio(),
    classeId: 'combatente',
    trilhaId: 'monstruoso',
    monstruosoElemento: 'Sangue',
  };
  const g = ganhosDoDegrau(p, 65);
  assert.ok(g.monstruoso.length > 0, 'esperava linhas do Monstruoso no patamar 65');
  assert.ok(g.monstruoso.some((t) => /mordida/i.test(t)), 'esperava a mordida no 65%');
});

ok('Monstruoso não devolve nada num degrau que não é patamar', () => {
  const p = {
    ...personagemVazio(),
    classeId: 'combatente',
    trilhaId: 'monstruoso',
    monstruosoElemento: 'Sangue',
  };
  assert.deepEqual(ganhosDoDegrau(p, 45).monstruoso, []);
});

// ── resumoSubida ────────────────────────────────────────────────────────
const comAtributos = {
  ...combatente,
  atributos: { for: 2, agi: 1, int: 1, pre: 1, vig: 2 },
};

ok('subir traz resumo com degraus e recursos', () => {
  const r = resumoSubida(comAtributos, 5, 15);
  assert.ok(r, 'esperava resumo');
  assert.deepEqual(r.degraus.map((g) => g.nex), [10, 15]);
  assert.ok(r.recursos.length > 0, 'esperava pelo menos um recurso a subir');
});

ok('PV máximo sobe e o delta bate certo com os valores mostrados', () => {
  const r = resumoSubida(comAtributos, 5, 15);
  const pv = r.recursos.find((x) => x.nome === 'PV máximo');
  assert.ok(pv, 'esperava linha de PV máximo');
  assert.equal(pv.para - pv.de, pv.delta);
  assert.ok(pv.delta > 0);
});

ok('não subir devolve null', () => {
  assert.equal(resumoSubida(comAtributos, 40, 40), null);
  assert.equal(resumoSubida(comAtributos, 40, 20), null);
});

ok('PE por rodada aparece quando muda de degrau de 5 em 5', () => {
  const r = resumoSubida(comAtributos, 5, 10);
  assert.ok(r.recursos.some((x) => x.nome === 'PE por rodada'));
});

ok('com nível separado o resumo diz que foi por nível', () => {
  const p = { ...comAtributos, regras: { nivelSeparado: true }, nivel: 3 };
  const r = resumoSubida(p, 10, 15);
  assert.equal(r.porNivel, true);
});

ok('sem sanidade mostra PD em vez de PE/SAN', () => {
  const p = { ...comAtributos, regras: { semSanidade: true } };
  const r = resumoSubida(p, 5, 15);
  const nomes = r.recursos.map((x) => x.nome);
  assert.ok(nomes.some((x) => x.startsWith('PD')), `esperava PD nos recursos, veio ${nomes.join(', ')}`);
  assert.ok(!nomes.includes('Sanidade máxima'));
});

console.log(`\n${n} testes ok`);
