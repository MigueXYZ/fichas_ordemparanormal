import assert from 'node:assert/strict';
import { personagemVazio } from '../src/engine/character.js';
import { calcPericias } from '../src/engine/calc.js';

console.log('Teste de Ocultismo +7 para Monstruoso já treinado em Ocultismo\n');

const p = personagemVazio();
p.classeId = 'ocultista'; // Já treinado em Ocultismo (grau: 'treinado', treino = 5)
p.trilhaId = 'monstruoso-ocultista';
p.monstruosoElemento = 'Sangue';
p.nex = 10;
p.pericias.ocultismo = { grau: 'treinado', outros: 0 };

const pericias = calcPericias(p);
const ocu = pericias.find((x) => x.id === 'ocultismo');

console.log('Ocultismo da personagem:', {
  grau: ocu.grau,
  treino: ocu.treino,
  monstruoso: ocu.monstruoso,
  bonus: ocu.bonus,
});

assert.equal(ocu.treino, 5, 'Bónus base de treino deve ser 5');
assert.equal(ocu.monstruoso, 2, 'Monstruoso deve conceder +2 extra por já ser treinado');
assert.equal(ocu.bonus, 7, 'Total de Ocultismo deve ser +7 (+5 de treino + 2 de Monstruoso)');

console.log('\nTeste confirmado com sucesso: Ocultismo fica exatamente com +7!');
