import assert from 'node:assert/strict';
import {
  estadoCombateVazio,
  adicionarEquipa,
  removerEquipa,
  adicionarCombatente,
  mudarEquipaCombatente,
  rolarIniciativaGeral,
  proximoTurno,
} from '../src/engine/combateTracker.js';

console.log('Testes do Rastreador de Combate Multilateral (3+ Equipas/Lados)\n');

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

teste('Criação e gestão de 3 equipas em confronto multilateral', () => {
  let est = estadoCombateVazio();
  assert.equal(est.equipas.length, 2, 'Inicia com 2 equipas padrão');

  // Adicionar uma 3ª equipa (ex: Culto da Máscara)
  est = adicionarEquipa(est, { nome: 'Lado 3 · Culto da Máscara', cor: '#c084fc' });
  assert.equal(est.equipas.length, 3, 'Deve conter 3 equipas');
  assert.equal(est.equipas[2].nome, 'Lado 3 · Culto da Máscara');
});

teste('Adição de combatentes a diferentes equipas e cálculo de VD por equipa', () => {
  let est = estadoCombateVazio();
  est = adicionarEquipa(est, { nome: 'Lado 3 · Terceira Facção' });

  // Equipa 1 (Agentes): 2 agentes de NEX 25% = 50%
  est = adicionarCombatente(est, { nome: 'Agente 1', tipo: 'agente', nex: 25, equipaId: est.equipas[0].id });
  est = adicionarCombatente(est, { nome: 'Agente 2', tipo: 'agente', nex: 25, equipaId: est.equipas[0].id });

  // Equipa 2 (Criaturas): 2 Zumbis de Sangue (VD 20 cada) = VD 40
  est = adicionarCombatente(est, { nome: 'Zumbi 1', tipo: 'ameaca', vd: 20, equipaId: est.equipas[1].id });
  est = adicionarCombatente(est, { nome: 'Zumbi 2', tipo: 'ameaca', vd: 20, equipaId: est.equipas[1].id });

  // Equipa 3 (Ocultistas): 1 Ocultista Fanático (VD 60) = VD 60
  est = adicionarCombatente(est, { nome: 'Ocultista Fanático', tipo: 'npc', subtipo: 'ocultista', vd: 60, equipaId: est.equipas[2].id });

  assert.equal(est.combatentes.length, 5, 'Deve haver 5 combatentes');

  // Calcular VD por equipa
  const vdEq1 = est.combatentes.filter((c) => c.equipaId === est.equipas[0].id).reduce((s, c) => s + (c.nex || 0), 0);
  const vdEq2 = est.combatentes.filter((c) => c.equipaId === est.equipas[1].id).reduce((s, c) => s + (c.vd || 0), 0);
  const vdEq3 = est.combatentes.filter((c) => c.equipaId === est.equipas[2].id).reduce((s, c) => s + (c.vd || 0), 0);

  assert.equal(vdEq1, 50, 'Equipa 1 deve ter NEX total 50');
  assert.equal(vdEq2, 40, 'Equipa 2 deve ter VD total 40');
  assert.equal(vdEq3, 60, 'Equipa 3 deve ter VD total 60');
});

teste('Mudança de equipa / lado de um combatente (Drag and drop / Seletor)', () => {
  let est = estadoCombateVazio();
  est = adicionarEquipa(est, { nome: 'Lado 3' });
  est = adicionarCombatente(est, { id: 'c-teste', nome: 'Cultista Traidor', tipo: 'npc', vd: 40, equipaId: est.equipas[1].id });

  assert.equal(est.combatentes[0].equipaId, est.equipas[1].id);

  // Mover para a Equipa 3
  est = mudarEquipaCombatente(est, 'c-teste', est.equipas[2].id);
  assert.equal(est.combatentes[0].equipaId, est.equipas[2].id, 'Combatente deve ter mudado para a equipa 3');
});

console.log(`\n${passou} testes passaram!`);
