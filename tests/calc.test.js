import assert from 'node:assert/strict';
import { personagemVazio } from '../src/engine/character.js';
import { calcMaximos, calcDefesa, calcDefesas, calcPericias, pontosRestantes, calcPePorRodada, grauMaximoPorNex } from '../src/engine/calc.js';

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

// ---- defesas (bloqueio e esquiva) ----
console.log('\nBloqueio e esquiva\n');

teste('bloqueio só existe com treino em Fortitude', () => {
  const p = personagemVazio();
  assert.equal(calcDefesas(p).bloqueio.disponivel, false);
  p.pericias.fortitude.grau = 'treinado';
  const d = calcDefesas(p);
  assert.equal(d.bloqueio.disponivel, true);
  assert.equal(d.bloqueio.valor, 5);           // RD = bónus de Fortitude
});

teste('esquiva = Defesa + bónus de Reflexos, só com treino', () => {
  const p = personagemVazio();
  assert.equal(calcDefesas(p).esquiva.disponivel, false);
  p.pericias.reflexos.grau = 'treinado';
  p.atributos.agi = 3;
  const d = calcDefesas(p);
  assert.equal(d.defesa, 13);
  assert.equal(d.esquiva.valor, 18);           // 13 + 5
});

teste('extras manuais somam a bloqueio e esquiva', () => {
  const p = personagemVazio();
  p.pericias.fortitude.grau = 'treinado';
  p.pericias.reflexos.grau = 'treinado';
  p.bloqueioExtra = 2;
  p.esquivaExtra = 3;
  const d = calcDefesas(p);
  assert.equal(d.bloqueio.valor, 7);
  assert.equal(d.esquiva.valor, 11 + 5 + 3);
});


// ---- carga e patente ----
import { calcCarga, calcItensPorCategoria } from '../src/engine/calc.js';
import { interpretarCritico, somarDados, estatisticasArma } from '../src/engine/armas.js';
import { rolarDano } from '../src/engine/dados.js';

console.log('\nCarga, patente e armas\n');

teste('carga = 5 espaços por ponto de Força (0 -> 2)', () => {
  const p = personagemVazio();
  p.atributos.for = 0;
  assert.equal(calcCarga(p).max, 2);
  p.atributos.for = 3;
  assert.equal(calcCarga(p).max, 15);
});

teste('passar do limite deixa sobrecarregado e penaliza perícias de carga', () => {
  const p = personagemVazio();
  p.atributos.for = 1;               // limite 5
  p.inventario = [{ espacos: 6 }];
  const c = calcCarga(p);
  assert.equal(c.sobrecarregado, true);
  assert.equal(c.penalidade, 5);
  const pericias = calcPericias(p);
  assert.equal(pericias.find((x) => x.id === 'furtividade').bonus, -5);  // tem penalidade de carga
  assert.equal(pericias.find((x) => x.id === 'atletismo').bonus, 0);     // não tem
});

teste('recruta só pode dois itens de categoria I', () => {
  const p = personagemVazio();
  p.inventario = [{ categoria: 'I' }, { categoria: 'I' }, { categoria: 'II' }];
  const r = calcItensPorCategoria(p);
  assert.equal(r.patente.id, 'recruta');
  assert.equal(r.linhas.find((l) => l.categoria === 'I').limite, 2);
  assert.equal(r.excedeu, true);      // o item de categoria II não é permitido
});

teste('lê o crítico como vem no livro', () => {
  assert.deepEqual(interpretarCritico('19/x2'), { margem: 19, multiplicador: 2 });
  assert.deepEqual(interpretarCritico('x3'), { margem: 20, multiplicador: 3 });
  assert.deepEqual(interpretarCritico('18/x3'), { margem: 18, multiplicador: 3 });
});

teste('modificações mexem nos números da arma', () => {
  const p = personagemVazio();
  p.atributos.for = 2;
  p.pericias.luta.grau = 'treinado';
  const arma = { nome: 'Machado', pericia: 'luta', dano: '1d8', margem: 20, multiplicador: 3, atributoDano: 'for', modificacoes: ['certeira', 'perigosa', 'cruel'] };
  const e = estatisticasArma(p, arma);
  assert.equal(e.dados, 2);          // Força 2 -> 2d20
  assert.equal(e.bonusAtaque, 7);    // +5 treino +2 certeira
  assert.equal(e.bonusDano, 4);      // +2 Força +2 cruel
  assert.equal(e.margem, 18);        // 20 - 2 (perigosa)
});

teste('crítico multiplica só os dados da arma', () => {
  const r = rolarDano({ nome: 'x', dano: '2d6', bonus: 5, critico: true, multiplicador: 3, extras: ['1d8'] });
  assert.equal(r.expressao, '6d6');  // 2d6 x3
  assert.equal(r.bonus, 5);          // o bónus não é multiplicado
  assert.equal(r.extras.length, 1);  // nem os dados extra
});

teste('somarDados acrescenta um dado do mesmo tipo', () => {
  assert.equal(somarDados('1d6', 1), '2d6');
  assert.equal(somarDados('2d10+2', 1), '3d10+2');
});


teste('dá para trocar o atributo de uma perícia', () => {
  const p = personagemVazio();
  p.atributos.int = 3;
  p.atributos.pre = 1;
  const antes = calcPericias(p).find((x) => x.id === 'enganacao');
  assert.equal(antes.attr, 'pre');
  assert.equal(antes.dados, 1);
  p.pericias.enganacao.attr = 'int';          // poder que troca PRE por INT
  const depois = calcPericias(p).find((x) => x.id === 'enganacao');
  assert.equal(depois.dados, 3);
  assert.equal(depois.attrTrocado, true);
  assert.equal(depois.attrPadrao, 'pre');
});

console.log(`\n${passou} testes ok`);
