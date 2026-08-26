import assert from 'node:assert/strict';
import {
  estadoCombateVazio,
  adicionarCombatente,
  ordenarCombatentes,
  rolarIniciativaGeral,
  proximoTurno,
  turnoAnterior,
  adicionarEfeitoCombatente,
  alternarCondicaoCombatente,
  editarCombatente,
} from '../src/engine/combateTracker.js';

console.log('Testes do Motor de Rastreador de Combate & Iniciativa\n');

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

teste('Ordenação de combatentes por iniciativa decrescente e desempate por agilidade', () => {
  const c1 = { id: '1', nome: 'Agente A', iniciativa: 15, agi: 2 };
  const c2 = { id: '2', nome: 'Zumbi de Sangue', iniciativa: 22, agi: 1 };
  const c3 = { id: '3', nome: 'Agente B', iniciativa: 15, agi: 4 }; // Mesmo 15 que A, mas Agi 4 > 2
  const c4 = { id: '4', nome: 'Cultista', iniciativa: null, agi: 1 };

  const ordenados = ordenarCombatentes([c1, c2, c3, c4]);
  assert.equal(ordenados[0].id, '2', 'Maior iniciativa (22) vem primeiro');
  assert.equal(ordenados[1].id, '3', 'Empate de 15: Agi 4 vem antes de Agi 2');
  assert.equal(ordenados[2].id, '1', 'Empate de 15: Agi 2');
  assert.equal(ordenados[3].id, '4', 'Sem iniciativa fica no final');
});

teste('Avanço de turnos e progressão de rodadas com decremento de efeitos temporários', () => {
  let estado = estadoCombateVazio();
  estado = adicionarCombatente(estado, { id: 'a1', nome: 'Agente 1', iniciativa: 20 });
  estado = adicionarCombatente(estado, { id: 'a2', nome: 'Monstro 1', iniciativa: 10 });

  // Adicionar efeito temporário com 2 rodadas no Agente 1
  estado = adicionarEfeitoCombatente(estado, 'a1', { nome: 'Invisibilidade', duracao: 2 });
  // Adicionar efeito temporário com 1 rodada no Monstro 1
  estado = adicionarEfeitoCombatente(estado, 'a2', { nome: 'Abalado', duracao: 1 });

  assert.equal(estado.rodada, 1);
  assert.equal(estado.turnoIndex, 0);
  assert.equal(estado.combatentes[0].efeitos[0].duracao, 2);

  // Turno 0 -> Turno 1
  estado = proximoTurno(estado);
  assert.equal(estado.rodada, 1);
  assert.equal(estado.turnoIndex, 1);

  // Turno 1 -> Nova Rodada (Rodada 2, Turno 0)
  estado = proximoTurno(estado);
  assert.equal(estado.rodada, 2);
  assert.equal(estado.turnoIndex, 0);

  // Efeitos devem ter sido reduzidos em 1 rodada
  const ag1 = estado.combatentes.find((c) => c.id === 'a1');
  const ag2 = estado.combatentes.find((c) => c.id === 'a2');
  assert.equal(ag1.efeitos[0].duracao, 1, 'Invisibilidade passou de 2 para 1');
  assert.equal(ag2.efeitos.length, 0, 'Abalado de 1 rodada expirou e foi removido');
  assert.equal(estado.efeitosExpirados.length, 1, 'Notificação de efeito expirado gerada');
  assert.equal(estado.efeitosExpirados[0].efeitoNome, 'Abalado');
});

teste('Rolagem geral de iniciativa preenche e ordena todos os combatentes', () => {
  let estado = estadoCombateVazio();
  estado = adicionarCombatente(estado, { id: '1', nome: 'A', agi: 3 });
  estado = adicionarCombatente(estado, { id: '2', nome: 'B', agi: 1 });

  estado = rolarIniciativaGeral(estado);
  assert.ok(estado.combatentes[0].iniciativa > 0);
  assert.ok(estado.combatentes[1].iniciativa > 0);
  assert.ok(estado.combatentes[0].iniciativa >= estado.combatentes[1].iniciativa);
});

teste('Edição de PV e alternância de condições', () => {
  let estado = estadoCombateVazio();
  estado = adicionarCombatente(estado, { id: '1', nome: 'A', pv: { atual: 20, max: 20, temp: 0 } });

  estado = editarCombatente(estado, '1', { pv: { atual: 12, max: 20, temp: 5 } });
  assert.equal(estado.combatentes[0].pv.atual, 12);
  assert.equal(estado.combatentes[0].pv.temp, 5);

  estado = alternarCondicaoCombatente(estado, '1', 'machucado');
  assert.deepEqual(estado.combatentes[0].condicoes, ['machucado']);
  estado = alternarCondicaoCombatente(estado, '1', 'machucado');
  assert.deepEqual(estado.combatentes[0].condicoes, []);
});

console.log(`\n${passou} testes passaram!`);
