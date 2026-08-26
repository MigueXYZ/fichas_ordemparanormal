import assert from 'node:assert/strict';
import { gerarFicha, gerarNpcAgente, gerarAmeaca } from '../src/engine/geradores.js';
import { personagemVazio } from '../src/engine/character.js';
import { calcPericias } from '../src/engine/calc.js';

console.log('Testes do Gerador Expandido de Agentes, NPCs e Criaturas\n');

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

teste('Geração de agente com classe, trilha e origem específicas atribui habilidades, poderes e rituais de acordo com o NEX', () => {
  const p = gerarFicha({
    nex: 50,
    classeId: 'ocultista',
    trilhaId: 'graduado',
    origemId: 'academico',
  });

  assert.equal(p.classeId, 'ocultista');
  assert.equal(p.trilhaId, 'graduado');
  assert.equal(p.origemId, 'academico');

  // Habilidades de Classe, Origem e Trilha
  assert.ok(p.habilidades.length > 0, 'Deve conter habilidades geradas');
  assert.ok(p.habilidades.some((h) => h.origem.includes('Trilha')), 'Deve conter habilidades da trilha Graduado');
  assert.ok(p.habilidades.some((h) => h.origem.includes('Origem')), 'Deve conter poder de Académico');

  // Poderes de NEX (NEX 50% ganha poderes de classe)
  assert.ok(p.poderes.length >= 3, 'Deve conter poderes de classe escolhidos para NEX 50%');

  // Rituais para Ocultista
  assert.ok(p.rituais.length >= 6, 'Ocultista NEX 50% deve possuir múltiplos rituais gerados');
  assert.ok(p.rituais.some((r) => r.circulo <= 3), 'Deve conter rituais até 3º círculo');

  // Comportamento, Aparência e Dica de RP
  assert.ok(p.comportamento && p.comportamento.length > 5, 'Deve conter comportamento estranho/fora do comum');
  assert.ok(p.aparencia && p.aparencia.length > 5, 'Deve conter descrição visual marcante');
  assert.ok(p.dicaRp && p.dicaRp.length > 5, 'Deve conter dica de interpretação');
});

teste('Geração de ameaça / criatura atribui habilidades especiais e detalhes narrativos de RP', () => {
  const a = gerarAmeaca({ vd: 100, arquetipo: 'sangue' });

  assert.ok(a.habilidades.length >= 2, 'Ameaça de VD 100 deve receber habilidades especiais');
  assert.ok(a.comportamento && a.comportamento.length > 5, 'Deve conter comportamento sinistro da criatura');
  assert.ok(a.aparencia && a.aparencia.length > 5, 'Deve conter descrição visual da criatura');
  assert.ok(a.dicaRp && a.dicaRp.length > 5, 'Deve conter dica de narração para o Mestre');
});

teste('Confirmação mecânica: Personagem já treinado em Ocultismo que escolhe Monstruoso fica com exatamente +7', () => {
  const p = personagemVazio();
  p.classeId = 'ocultista';
  p.trilhaId = 'monstruoso-ocultista';
  p.monstruosoElemento = 'Sangue';
  p.nex = 10;
  p.pericias.ocultismo = { grau: 'treinado', outros: 0 };

  const pericias = calcPericias(p);
  const ocu = pericias.find((x) => x.id === 'ocultismo');

  assert.equal(ocu.treino, 5, 'Treino base é 5');
  assert.equal(ocu.monstruoso, 2, 'Monstruoso dá +2 por já ser treinado');
  assert.equal(ocu.bonus, 7, 'Total de bónus de Ocultismo é exatamente +7');
});

console.log(`\n${passou} testes passaram!`);
