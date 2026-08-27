import assert from 'node:assert/strict';
import { personagemVazio } from '../src/engine/character.js';
import { calcPericias } from '../src/engine/calc.js';
import { efetivamenteAtivo, ataquesNaturaisAtivos } from '../src/engine/monstruoso.js';

console.log('Testes de Bónus e Debuffs Permanentes de Perícias do Monstruoso\n');

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

teste('Ocultista Monstruoso NEX 10% com etapa inativa (monstruosoAtivoHoje: false) mantém treino em Ocultismo e debuffs em Diplomacia, Enganação e Intuição', () => {
  const p = personagemVazio();
  p.classeId = 'ocultista';
  p.trilhaId = 'monstruoso-ocultista';
  p.monstruosoElemento = 'Sangue';
  p.monstruosoAtivoHoje = false;
  p.nex = 10;

  // Etapa não está ativa
  assert.equal(efetivamenteAtivo(p, p.nex), false, 'Etapa de hoje não deve estar ativa');

  const pericias = calcPericias(p);
  const ocu = pericias.find((x) => x.id === 'ocultismo');
  const dip = pericias.find((x) => x.id === 'diplomacia');
  const eng = pericias.find((x) => x.id === 'enganacao');
  const int = pericias.find((x) => x.id === 'intuicao');

  // Ocultismo deve estar treinado (bónus de treino >= 5)
  assert.equal(ocu.treino, 5, 'Ocultismo deve ser treinado permanentemente');

  // Diplomacia, Enganação e Intuição devem sofrer -2 (NEX 10% Ocultista/Especialista)
  assert.equal(dip.monstruoso, -2, 'Diplomacia deve sofrer -2 permanentemente');
  assert.equal(dip.bonus, -2, 'Total de bônus de Diplomacia deve refletir -2');
  assert.equal(eng.monstruoso, -2, 'Enganação deve sofrer -2 permanentemente');
  assert.equal(int.monstruoso, -2, 'Intuição deve sofrer -2 permanentemente');

  // Armas naturais ou rituais da etapa diária não devem estar ativos
  assert.equal(ataquesNaturaisAtivos(p, p.nex).length, 0, 'Armas naturais da etapa diária não devem aparecer inativas');
});

teste('Combatente Monstruoso NEX 40% com etapa inativa mantém treino em Ocultismo e debuff de -2d em Ciências e Intuição', () => {
  const p = personagemVazio();
  p.classeId = 'combatente';
  p.trilhaId = 'monstruoso';
  p.monstruosoElemento = 'Sangue';
  p.monstruosoAtivoHoje = false;
  p.nex = 40;
  p.atributos.int = 2;
  p.atributos.pre = 2;

  const pericias = calcPericias(p);
  const ocu = pericias.find((x) => x.id === 'ocultismo');
  const cie = pericias.find((x) => x.id === 'ciencias');
  const int = pericias.find((x) => x.id === 'intuicao');

  assert.equal(ocu.treino, 5, 'Ocultismo treinado permanentemente');
  assert.equal(cie.dados, 0, 'Ciências com -2d de penalidade permanente (2 - 2 = 0)');
  assert.equal(int.dados, 0, 'Intuição com -2d de penalidade permanente (2 - 2 = 0)');
});

console.log(`\n${passou} testes passaram!`);
