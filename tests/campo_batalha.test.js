import assert from 'node:assert/strict';
import {
  danoNoCombatente, parcelasDeRolagem, poolIniciativa, avaliarBalanco, resumoRolagem,
  serializarCombate, desserializarCombate, ehCriaturaParanormal,
} from '../src/engine/campoBatalha.js';
import { parseCriticoTexto, prepararAtaques } from '../src/engine/combateAtaques.js';

console.log('Testes do Campo de Batalha (dano, iniciativa, registo, guardar)\n');

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

const zumbi = {
  id: 'z', nome: 'Zumbi', pv: { atual: 60, max: 60, temp: 0 }, san: null,
  ficha: {
    tipo: 'ameaca', descritores: ['Sangue'], resistencias: ['Balístico, corte, impacto e perfuração 5', 'sangue'],
    vulnerabilidades: ['Morte'], imunidades: ['Imune a doenças e venenos'],
  },
};

teste('Resistência com número desconta; sem número corta a metade', () => {
  const r = danoNoCombatente(zumbi, [{ valor: 12, tipoId: 'balistico' }, { valor: 9, tipoId: 'sangue' }]);
  assert.equal(r.totalLiquidoPv, 7 + 4, '12−5 = 7 e 9 → ½ = 4');
  assert.equal(r.novoPvAtual, 60 - 11);
});

teste('Vulnerabilidade dobra o dano; imunidade anula', () => {
  const r = danoNoCombatente(zumbi, [{ valor: 10, tipoId: 'morte' }, { valor: 8, tipoId: 'quimico' }]);
  assert.equal(r.totalLiquidoPv, 20);
  assert.ok(r.notas.some((n) => /Vulnerável a Morte/.test(n)) && r.notas.some((n) => /Imune/.test(n)));
});

teste('Dano mental: criatura paranormal imune; pessoa sem SAN perde PV; agente perde SAN', () => {
  assert.ok(ehCriaturaParanormal(zumbi.ficha));
  assert.equal(danoNoCombatente(zumbi, [{ valor: 10, tipoId: 'mental' }]).totalLiquidoPv, 0);
  const pessoa = { pv: { atual: 20, max: 20 }, san: null, ficha: { tipo: 'npc', fichaLivre: true, resistencias: [] } };
  const rp = danoNoCombatente(pessoa, [{ valor: 6, tipoId: 'mental' }]);
  assert.equal(rp.novoPvAtual, 14, 'ameaças da Realidade: dano mental reduz PV');
  const agente = { pv: { atual: 20, max: 20 }, san: { atual: 30, max: 30 }, ficha: { resistencias: [] } };
  const ra = danoNoCombatente(agente, [{ valor: 6, tipoId: 'mental' }]);
  assert.equal(ra.novoSanAtual, 24);
  assert.equal(ra.novoPvAtual, 20);
});

teste('PV temporários absorvem primeiro', () => {
  const c = { pv: { atual: 10, max: 20, temp: 5 }, ficha: {} };
  const r = danoNoCombatente(c, [{ valor: 8, tipoId: 'corte' }]);
  assert.equal(r.novoPvTemp, 0);
  assert.equal(r.novoPvAtual, 7);
});

teste('Dano rolado com vários tipos vira várias parcelas', () => {
  const p = parcelasDeRolagem({ total: 14, partes: [{ total: 9, tipoDano: 'Corte' }, { total: 5, tipoDano: 'Sangue' }] });
  assert.deepEqual(p, [{ valor: 9, tipoId: 'corte' }, { valor: 5, tipoId: 'sangue' }]);
});

teste('Iniciativa é um teste: dados e bónus da ficha', () => {
  assert.deepEqual(poolIniciativa({ ficha: { tipo: 'ameaca', sentidos: { iniciativa: '3d20+10' } } }), { dados: 3, bonus: 10 });
  assert.deepEqual(poolIniciativa({ ficha: { fichaLivre: true, pericias: [{ nome: 'Iniciativa', dados: 2, bonus: 5 }] } }), { dados: 2, bonus: 5 });
  assert.deepEqual(poolIniciativa({ agi: 2 }), { dados: 2, bonus: 0 });
});

teste('Crítico das ações lido do texto e usado ao atacar', () => {
  assert.deepEqual(parseCriticoTexto('19/x3'), { margem: 19, multiplicador: 3 });
  assert.deepEqual(parseCriticoTexto('x4'), { margem: 20, multiplicador: 4 });
  const ataques = prepararAtaques({ nome: 'Z', tipo: 'ameaca', ficha: { acoes: [
    { tipo: 'Padrão', nome: 'Garras', teste: '2d20+5', dano: '1d8+3 corte', critico: '19/x2' },
    { tipo: 'Movimento', nome: 'Investida', descricao: 'Só regra' },
  ] } });
  assert.equal(ataques.length, 1, 'ações sem teste nem dano não aparecem como ataques');
  const { acerto, dano } = ataques[0].rolar();
  assert.equal(acerto.margem, 19);
  assert.ok(dano.total > 0);
});

teste('Balanço do encontro pela razão VD/NEX', () => {
  assert.equal(avaliarBalanco(100, 100).texto, 'Equilibrado');
  assert.equal(avaliarBalanco(100, 40).texto, 'Muito fácil');
  assert.equal(avaliarBalanco(100, 200).texto, 'Mortal');
  assert.equal(avaliarBalanco(100, 0).nivel, 'vazio');
});

teste('Resumo de rolagem para o registo', () => {
  const r = resumoRolagem({ tipo: 'teste', nome: 'Luta', dados: 2, rolagens: [14, 7], bonus: 5, total: 19 });
  assert.equal(r.conta, '2d20 [14, 7] + 5');
  assert.equal(r.total, 19);
});

teste('Guardar combate: fichas guardadas por referência, recuperadas pelo id', () => {
  const estado = { rodada: 2, turnoIndex: 1, equipas: [], combatentes: [
    { id: 'a', nome: 'Agente', ficha: { id: 'f1', nome: 'Agente', imagem: 'data:...' } },
    { id: 'b', nome: 'Ligado', codigo: 'X1', ficha: { nome: 'Remoto' } },
  ] };
  const txt = serializarCombate(estado, [{ id: 1 }]);
  assert.ok(!txt.includes('data:...'), 'sem imagens repetidas');
  const volta = desserializarCombate(txt, { f1: { id: 'f1', nome: 'Agente (atual)' } });
  assert.equal(volta.estado.combatentes[0].ficha.nome, 'Agente (atual)');
  assert.equal(volta.estado.combatentes[1].ficha.nome, 'Remoto');
  assert.equal(volta.estado.rodada, 2);
  assert.equal(volta.registo.length, 1);
});

console.log(`\n${passou} testes passaram!`);
