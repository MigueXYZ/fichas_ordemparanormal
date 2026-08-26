import assert from 'node:assert/strict';
import { personagemVazio } from '../src/engine/character.js';
import { calcMaximos, calcDefesa, calcDefesas, calcDeslocamento, calcDeslocamentos, calcCargaMaxima, calcPericias } from '../src/engine/calc.js';
import { calcBuffsPoderes } from '../src/engine/poderesBuffs.js';

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

console.log('Testes de Buffs Oficiais de Habilidades e Poderes\n');

teste('Sangue de Ferro (Livro Base): +2 PV para cada 5% de NEX (NEX 5% = +2 PV, NEX 50% = +20 PV)', () => {
  const p = personagemVazio();
  p.classeId = 'combatente';
  p.nex = 5;
  const m1 = calcMaximos(p);
  p.habilidades = [{ nome: 'Sangue de Ferro', descricao: 'Você recebe +2 PV para cada 5% de NEX.' }];
  const m2 = calcMaximos(p);
  assert.equal(m2.pv, m1.pv + 2);

  p.nex = 50;
  const m3_sem = calcMaximos({ ...p, habilidades: [] });
  const m3_com = calcMaximos(p);
  assert.equal(m3_com.pv, m3_sem.pv + 20);
});

teste('Sangue de Ferro (Afinidade): +4 PV para cada 5% de NEX', () => {
  const p = personagemVazio();
  p.classeId = 'combatente';
  p.nex = 50;
  const m_sem = calcMaximos(p);
  p.habilidades = [{ nome: 'Sangue de Ferro (Afinidade)', descricao: 'Afinidade: +2 PV para cada 5% adicionais' }];
  const m_com = calcMaximos(p);
  assert.equal(m_com.pv, m_sem.pv + 40);
});

teste('Vitalidade Reforçada (Sobrevivendo ao Horror): +1 PV por 5% NEX', () => {
  const p = personagemVazio();
  p.classeId = 'especialista';
  p.nex = 20; // 4 passos -> +4 PV
  const m_sem = calcMaximos(p);
  p.habilidades = [{ nome: 'Vitalidade Reforçada', descricao: '+1 PV por 5% NEX' }];
  const m_com = calcMaximos(p);
  assert.equal(m_com.pv, m_sem.pv + 4);
});

teste('Potencial Aprimorado (Livro Base): +1 PE por 5% NEX (+2 com afinidade)', () => {
  const p = personagemVazio();
  p.classeId = 'ocultista';
  p.nex = 20; // 4 passos -> +4 PE
  const m_sem = calcMaximos(p);
  p.habilidades = [{ nome: 'Potencial Aprimorado', descricao: '+1 PE para cada 5% de NEX' }];
  const m_com = calcMaximos(p);
  assert.equal(m_com.pe, m_sem.pe + 4);

  p.habilidades = [{ nome: 'Potencial Aprimorado (Afinidade)', descricao: 'Afinidade: +1 PE adicional' }];
  const m_com_af = calcMaximos(p);
  assert.equal(m_com_af.pe, m_sem.pe + 8);
});

teste('Vontade Inabalável (Sobrevivendo ao Horror): +1 PE para cada 10% de NEX', () => {
  const p = personagemVazio();
  p.classeId = 'especialista';
  p.nex = 20; // 4 passos de 5% = 2 passos de 10% -> +2 PE
  const m_sem = calcMaximos(p);
  p.habilidades = [{ nome: 'Vontade Inabalável', descricao: '+1 PE para cada 10% de NEX' }];
  const m_com = calcMaximos(p);
  assert.equal(m_com.pe, m_sem.pe + 2);
});

teste('Combatente Esforçado (Arquivos Secretos 06): +1 PE para cada 5% de NEX', () => {
  const p = personagemVazio();
  p.classeId = 'combatente';
  p.nex = 15; // 3 passos -> +3 PE
  const m_sem = calcMaximos(p);
  p.habilidades = [{ nome: 'Combatente Esforçado', descricao: '+1 PE para cada NEX' }];
  const m_com = calcMaximos(p);
  assert.equal(m_com.pe, m_sem.pe + 3);
});

teste('Defesa e Esquiva: Precognição (+2 Def / +2 Esq) e Reflexos Defensivos (+2 Def / +2 Esq)', () => {
  const p = personagemVazio();
  p.atributos.agi = 2; // Defesa base 12
  assert.equal(calcDefesa(p), 12);

  p.habilidades = [{ nome: 'Precognição', descricao: '+2 na Defesa e em testes de Esquiva' }];
  assert.equal(calcDefesa(p), 14);

  p.habilidades.push({ nome: 'Reflexos Defensivos', descricao: '+2 na Defesa e Esquiva' });
  assert.equal(calcDefesa(p), 16);
});

teste('Especialista em Proteção Leve (Sobrevivendo ao Horror): +2 Defesa com proteção leve', () => {
  const p = personagemVazio();
  p.atributos.agi = 1;
  p.protecao = ['protecao-leve']; // 10 base + 1 agi + 5 leve = 16
  assert.equal(calcDefesa(p), 16);

  p.habilidades = [{ nome: 'Especialista em Proteção Leve', descricao: '+2 na Defesa com proteção leve' }];
  assert.equal(calcDefesa(p), 18);
});

teste('Casca Grossa (Combatente): soma VIG no Bloqueio e +1 PV por 5% NEX', () => {
  const p = personagemVazio();
  p.classeId = 'combatente';
  p.atributos.vig = 3;
  p.nex = 10;
  p.pericias.fortitude = { grau: 'treinado', outros: 0 }; // bonus Fortitude = 5
  p.habilidades = [{ nome: 'Casca Grossa', descricao: '+1 PV por 5% NEX e soma VIG no bloqueio' }];
  
  const def = calcDefesas(p);
  assert.equal(def.bloqueio.valor, 5 + 3); // 5 de fortitude + 3 de VIG
});

teste('Perícias treinadas concedidas por poderes oficiais (Curiosidade Oculta, Sentidos Aguçados, Sorrateiro)', () => {
  const p = personagemVazio();
  p.habilidades = [
    { nome: 'Curiosidade Oculta', descricao: 'Você recebe treinamento em Ocultismo' },
    { nome: 'Sentidos Aguçados', descricao: 'Você recebe treinamento em Percepção' },
  ];

  const pericias = calcPericias(p);
  const oc = pericias.find((x) => x.id === 'ocultismo');
  const pe = pericias.find((x) => x.id === 'percepcao');

  assert.equal(oc.grau, 'treinado');
  assert.equal(oc.treino, 5);
  assert.equal(pe.grau, 'treinado');
  assert.equal(pe.treino, 5);
});

console.log(`\n${passou} testes de buffs passaram!`);
