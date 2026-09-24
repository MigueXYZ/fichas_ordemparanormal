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

  assert.ok(a.habilidades.length >= 1, 'Ameaça de VD 100 deve receber habilidades especiais');
  assert.ok(a.roleplay.comportamento && a.roleplay.comportamento.length > 5, 'Deve conter comportamento sinistro da criatura');
  assert.ok(a.roleplay.aparencia && a.roleplay.aparencia.length > 5, 'Deve conter descrição visual da criatura');
  assert.equal(a.roleplay.notasMestre, '', 'como narrar fica em branco — depende da campanha');
});

teste('Nomes das criaturas geradas não têm lugares (servem qualquer campanha)', () => {
  const nomes = Array.from({ length: 80 }, () => gerarAmeaca({ vd: 40 }).nome);
  assert.ok(nomes.every((n) => !/\b(do|da|das|dos) (Beco|Cave|Convento|Ria|Mosteiro|Serra|Metro|Cais|Mata|Aqueduto|Minas|Cemitério|Fábrica|Farol)\b/.test(n)), nomes.join(', '));
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
  const ataques = a.acoes.filter((x) => x.teste);
  assert.ok(ataques.length >= 1, 'pelo menos um ataque');
  assert.ok(ataques.every((x) => x.nome.startsWith('Agredir — ') && pool.test(x.teste) && /\d+d\d+\+\d+ \S+/.test(x.dano)));
  assert.ok(a.acoes.filter((x) => !x.teste).every((x) => x.descricao && !/\{[A-Z_]+\}/.test(x.descricao)), 'ações especiais com regra escrita e marcadores preenchidos');
  assert.equal('rituais' in a, false, 'ameaças não têm rituais');
});

teste('Criaturas variam: número de habilidades e ações, e tipos de ação além de Padrão', () => {
  const lote = Array.from({ length: 60 }, () => gerarAmeaca({ vd: 120, elementos: ['Morte'] }));
  const nHab = new Set(lote.map((a) => a.habilidades.length));
  const nAcoes = new Set(lote.map((a) => a.acoes.length));
  const tipos = new Set(lote.flatMap((a) => a.acoes.map((x) => x.tipo)));
  assert.ok(nHab.size >= 2, 'o número de habilidades varia');
  assert.ok(nAcoes.size >= 2, 'o número de ações varia');
  assert.ok(tipos.size >= 3, `há ações de vários tipos (${[...tipos]})`);
  const pequenas = Array.from({ length: 60 }, () => gerarAmeaca({ vd: 20 }));
  assert.ok(pequenas.some((a) => a.habilidades.length === 0), 'uma criatura pequena pode não ter habilidades');
});

teste('NPC gerado não sai com perícias a mais (como as Pessoas do livro: 1 a 3 além dos testes)', () => {
  for (let i = 0; i < 30; i++) {
    const n = gerarNpcAgente({ vd: 10 });
    assert.ok(n.pericias.length <= 5 + 2, `VD 10: no máximo 5 testes + 2 perícias (saiu ${n.pericias.length})`);
    const grande = gerarNpcAgente({ vd: 200 });
    assert.ok(grande.pericias.length <= 5 + 3);
  }
});

teste('Animal mundano gerado: sem presença perturbadora, com faro', () => {
  const a = gerarAmeaca({ vd: 20, categoria: 'animal' });
  assert.equal(a.presencaPerturbadora, null);
  assert.equal(a.sentidos.extra, 'Faro');
  assert.deepEqual(a.descritores, []);
});

teste('NPC gerado: uma Pessoa do livro — sem classe, trilha nem NEX, números do VD', () => {
  const n = gerarNpcAgente({ vd: 80, perfilId: 'detetive' });
  assert.equal(n.tipo, 'npc');
  assert.equal(n.fichaLivre, true);
  for (const k of ['classe', 'trilha', 'origem', 'nex']) assert.equal(n[k], '', `sem ${k}`);
  assert.equal(n.vd, 80);
  assert.equal(n.perfilId, 'detetive');
  // Assassino (VD 80) do livro: Defesa 26, PV 90 — a escala anda por aí
  assert.ok(n.defesa >= 20 && n.defesa <= 26, `Defesa ${n.defesa}`);
  assert.ok(n.pv >= 60 && n.pv <= 95, `PV ${n.pv}`);
  assert.deepEqual(n.pericias.slice(0, 5).map((p) => p.nome), ['Iniciativa', 'Percepção', 'Fortitude', 'Reflexos', 'Vontade']);
  assert.ok(n.pericias.some((p) => p.nome === 'Investigação'), 'a perícia principal do perfil');
  assert.ok(n.acoes.length >= 1 && /^\d+d20\+\d+$/.test(n.acoes[0].teste) && /^\d+\/x\d+$/.test(n.acoes[0].critico));
  assert.deepEqual(n.rituais, [], 'um NPC comum não conjura rituais');
  assert.ok(n.equipamento.length >= 1);
  for (const k of ['aparencia', 'traco', 'personalidade', 'maneirismos']) assert.ok(n.roleplay[k], `roleplay.${k} preenchido`);
  for (const k of ['motivacao', 'informacao', 'notasMestre']) assert.equal(n.roleplay[k], '', `roleplay.${k} em branco`);
  assert.equal('sentidos' in n, false);
});

teste('NPC gerado: habilidades próprias, balanceadas pelo VD', () => {
  const todas = Array.from({ length: 80 }, () => gerarNpcAgente({ vd: 120 }));
  const nomes = todas.flatMap((n) => [...n.habilidades, ...n.acoes.filter((a) => !a.teste)].map((h) => h.nome));
  assert.ok(new Set(nomes).size >= 15, 'habilidades variadas entre perfis');
  assert.ok(todas.every((n) => !/\{[A-Z0-9_]+\}/.test(JSON.stringify(n))), 'marcadores todos preenchidos');
  // Um NPC de VD 10 não recebe habilidades de VD alto (ex.: Ordens, VD 100)
  const fracos = Array.from({ length: 80 }, () => gerarNpcAgente({ vd: 10 }));
  assert.ok(fracos.every((n) => [...n.habilidades, ...n.acoes].length <= 3));
  assert.ok(!fracos.some((n) => n.acoes.some((a) => a.nome === 'Ordens')));
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
