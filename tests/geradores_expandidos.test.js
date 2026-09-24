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
  assert.ok(a.roleplay.comportamento && a.roleplay.comportamento.length > 5, 'Deve conter comportamento sinistro da criatura');
  assert.ok(a.roleplay.aparencia && a.roleplay.aparencia.length > 5, 'Deve conter descrição visual da criatura');
  assert.ok(a.roleplay.notasMestre && a.roleplay.notasMestre.length > 5, 'Deve conter dica de narração para o Mestre');
});

teste('Ameaça paranormal gerada: bloco oficial completo (presença, sentidos, testes Nd20+B, deslocamento, sem rituais)', () => {
  const a = gerarAmeaca({ vd: 40, categoria: 'criatura', elementos: ['Sangue'] });
  const pool = /^\d+d20\+\d+$/;
  assert.equal(a.tipo, 'ameaca');
  assert.equal(a.fichaLivre, true);
  assert.deepEqual(a.descritores, ['Sangue'], 'descritores = elementos; a forma vai para a categoria');
  assert.equal(a.categoria, 'Criatura');
  assert.deepEqual(a.presencaPerturbadora, { dt: 15, dano: '3d6 mental', nex: 30 }, 'igual à Aberração de Carne (VD 40) do livro');
  assert.ok(pool.test(a.sentidos.percepcao) && pool.test(a.sentidos.iniciativa));
  assert.equal(a.sentidos.visaoNoEscuro, true);
  for (const t of ['fortitude', 'reflexos', 'vontade']) assert.ok(pool.test(a.testes[t]), `${t} em Nd20+B`);
  assert.ok(Number(a.deslocamentos.terrestre) >= 9);
  assert.ok(/^\d+m \| \d+/.test(a.deslocamento));
  assert.equal(a.pvMachucado, Math.round(a.pv / 2));
  assert.ok(a.acoes.every((x) => x.nome.startsWith('Agredir — ') && pool.test(x.teste) && /\d+d\d+\+\d+ \S+/.test(x.dano)));
  assert.equal('rituais' in a, false, 'ameaças não têm rituais');
});

teste('Animal mundano gerado: sem presença perturbadora, com faro', () => {
  const a = gerarAmeaca({ vd: 20, categoria: 'animal' });
  assert.equal(a.presencaPerturbadora, null);
  assert.equal(a.sentidos.extra, 'Faro');
  assert.deepEqual(a.descritores, []);
});

teste('NPC gerado: ficha livre com os números calculados da ficha de agente', () => {
  const n = gerarNpcAgente({ nex: 35, classeId: 'ocultista' });
  assert.equal(n.tipo, 'npc');
  assert.equal(n.fichaLivre, true);
  assert.equal(n.classe, 'Ocultista');
  assert.equal(n.nex, 35);
  assert.ok(n.origem && n.trilha, 'origem e trilha (NEX 35) preenchidas');
  // Defesa pode ficar abaixo de 10 (AGI 0, carga) — vem do cálculo das regras
  assert.ok(n.pv > 0 && n.pe > 0 && n.san > 0 && Number.isFinite(n.defesa) && n.defesa > 0);
  assert.deepEqual(n.pericias.slice(0, 5).map((p) => p.nome), ['Iniciativa', 'Percepção', 'Fortitude', 'Reflexos', 'Vontade']);
  assert.ok(n.pericias.length > 5, 'mais as perícias treinadas');
  assert.ok(n.acoes.length >= 1 && /^-?\d+d20[+-]\d+$/.test(n.acoes[0].teste) && /^\d+\/x\d+$/.test(n.acoes[0].critico));
  assert.ok(n.rituais.length >= 3 && n.rituais.every((r) => r.circulo && r.dt), 'rituais com círculo e DT');
  assert.ok(n.equipamento.length >= 1);
  for (const k of ['aparencia', 'traco', 'personalidade', 'maneirismos', 'motivacao', 'informacao', 'notasMestre']) {
    assert.ok(n.roleplay[k], `roleplay.${k} preenchido`);
  }
  assert.equal('sentidos' in n, false);
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
