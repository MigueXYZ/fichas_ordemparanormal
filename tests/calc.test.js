import assert from 'node:assert/strict';
import { personagemVazio } from '../src/engine/character.js';
import { calcMaximos, calcDefesa, calcPericias, pontosRestantes, calcPePorRodada, grauMaximoPorNex } from '../src/engine/calc.js';

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

console.log('Cálculos da ficha\n');

teste('atributos: 4 pontos por distribuir no início', () => {
  const p = personagemVazio();
  assert.equal(pontosRestantes(p.atributos), 4);
});

teste('atributos: baixar um a 0 devolve 1 ponto', () => {
  const p = personagemVazio();
  p.atributos.for = 0;
  assert.equal(pontosRestantes(p.atributos), 5);
});

teste('Combatente NEX 5% com atributos a 1 -> 21 PV / 12 SAN / 3 PE (print oficial)', () => {
  const p = personagemVazio();
  p.classeId = 'combatente';
  const m = calcMaximos(p);
  assert.deepEqual(m, { pv: 21, san: 12, pe: 3 });
});

teste('Combatente NEX 10% soma um passo de progressão', () => {
  const p = personagemVazio();
  p.classeId = 'combatente';
  p.nex = 10;
  const m = calcMaximos(p);
  assert.deepEqual(m, { pv: 21 + 5, san: 12 + 3, pe: 3 + 3 });
});

teste('Ocultista NEX 5% com VIG 2 / PRE 3', () => {
  const p = personagemVazio();
  p.classeId = 'ocultista';
  p.atributos.vig = 2;
  p.atributos.pre = 3;
  const m = calcMaximos(p);
  assert.deepEqual(m, { pv: 14, san: 20, pe: 7 });
});

teste('defesa = 10 + AGI (print: 11 com AGI 1)', () => {
  const p = personagemVazio();
  assert.equal(calcDefesa(p), 11);
});

teste('defesa soma equipamento e outros', () => {
  const p = personagemVazio();
  p.atributos.agi = 3;
  p.defesaEquipamento = 5;
  p.defesaOutros = 2;
  assert.equal(calcDefesa(p), 20);
});

teste('perícia treinada dá +5 e marca as somente-treinadas', () => {
  const p = personagemVazio();
  p.atributos.int = 2;
  p.pericias.ciencias.grau = 'treinado';
  const linhas = calcPericias(p);
  const ciencias = linhas.find((l) => l.id === 'ciencias');
  const ocultismo = linhas.find((l) => l.id === 'ocultismo');
  assert.equal(ciencias.dados, 2);
  assert.equal(ciencias.bonus, 5);
  assert.equal(ciencias.bloqueada, false);
  assert.equal(ocultismo.bloqueada, true);
});

teste('penalidade de carga só afeta perícias marcadas com +', () => {
  const p = personagemVazio();
  p.penalidadeCarga = 5;
  const linhas = calcPericias(p);
  assert.equal(linhas.find((l) => l.id === 'furtividade').bonus, -5);
  assert.equal(linhas.find((l) => l.id === 'atletismo').bonus, 0);
});

teste('PE por rodada = NEX / 5, mínimo 1', () => {
  assert.equal(calcPePorRodada(5), 1);
  assert.equal(calcPePorRodada(45), 9);
  assert.equal(calcPePorRodada(99), 19);
});

teste('grau máximo de treino limitado pelo NEX', () => {
  assert.equal(grauMaximoPorNex(5).id, 'treinado');
  assert.equal(grauMaximoPorNex(40).id, 'veterano');
  assert.equal(grauMaximoPorNex(75).id, 'expert');
});

console.log(`\n${passou} testes ok`);
