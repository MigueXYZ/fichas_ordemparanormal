import assert from 'node:assert/strict';
import { gerarOcultistaInimigo, vdParaGrupo, ELEMENTOS_CULTISTAS, PATENTES_CULTISTAS } from '../src/engine/geradores.js';

console.log('Testes de Ocultistas Inimigos e Cálculo de VD de Encontros\n');

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

teste('Ocultista gerado é uma pessoa como as do livro: sem classe/trilha, com Conjurador e rituais do livro', () => {
  const o = gerarOcultistaInimigo({ vd: 60, elemento: 'Sangue' });

  assert.equal(o.tipo, 'npc', 'ocultistas vão para o Elenco, não para o Bestiário');
  assert.equal(o.fichaLivre, true);
  assert.equal(o.classe, '', 'sem classe');
  assert.equal(o.trilha, '', 'sem trilha');
  assert.equal(o.nex, '', 'sem NEX');
  assert.equal(o.elementoPrincipal, 'Sangue');
  assert.equal(o.vd, 60);
  assert.equal('sentidos' in o, false, 'NPCs não têm sentidos/presença/enigma');

  // Conjurador (livro: Investido — 2 rituais de 1º e 2 de 2º, limite 5 PE)
  const conj = o.habilidades.find((h) => h.nome === 'Conjurador');
  assert.ok(conj && /limite de 5 PE/.test(conj.descricao) && conj.descricao.includes(`DT para resistir aos seus rituais é ${o.rituais[0].dt}`));
  assert.equal(o.rituais.length, 4, '2 rituais por círculo, até ao 2º');
  assert.deepEqual(o.rituais.map((r) => r.circulo), ['1', '1', '2', '2']);
  assert.ok(o.rituais.every((r) => r.nome && Number(r.dt) >= 15));
  assert.ok(/^\d+d20\+\d+$/.test(o.acoes[0].teste), 'ataque com teste Nd20+B');
  assert.ok(o.pericias.some((p) => p.nome === 'Ocultismo'));
  assert.ok(o.equipamento.length >= 2);

  // Culto e interpretação: motivação, informação e notas do Mestre em branco (dependem da campanha)
  assert.ok(o.culto && o.culto.length > 3);
  assert.ok(o.afiliacao.startsWith(o.culto));
  assert.ok(o.papelCulto && o.breveDescricao.includes('·'));
  for (const k of ['aparencia', 'traco', 'personalidade', 'maneirismos']) assert.ok(o.roleplay[k]?.length > 5, `roleplay.${k} preenchido`);
  for (const k of ['motivacao', 'informacao', 'notasMestre']) assert.equal(o.roleplay[k], '', `roleplay.${k} em branco`);
});

teste('Ocultista: rituais e limite de PE sobem com a patente, como no livro', () => {
  const iniciado = gerarOcultistaInimigo({ vd: 20 });
  assert.equal(iniciado.rituais.length, 2);
  assert.ok(iniciado.rituais.every((r) => r.circulo === '1'));
  assert.ok(/limite de 3 PE/.test(iniciado.habilidades[0].descricao));
  const lider = gerarOcultistaInimigo({ vd: 140 });
  assert.equal(lider.rituais.length, 6);
  assert.ok(/limite de 10 PE/.test(lider.habilidades[0].descricao));
  assert.equal(lider.rituais[0].dt, '25', 'DT 25 como o Líder de Culto (VD 140)');
});

teste('Cálculo de VD para múltiplos agentes e múltiplos inimigos', () => {
  // 4 agentes de NEX 25% = 100% NEX Grupo
  const nexGrupo = 4 * 25; // 100

  const vdFacil = vdParaGrupo(nexGrupo, 'facil'); // 50
  const vdEquilibrado = vdParaGrupo(nexGrupo, 'equilibrado'); // 100
  const vdDificil = vdParaGrupo(nexGrupo, 'dificil'); // 150

  assert.equal(vdFacil, 50, 'VD Fácil para 100% NEX deve ser 50');
  assert.equal(vdEquilibrado, 100, 'VD Equilibrado para 100% NEX deve ser 100');
  assert.equal(vdDificil, 150, 'VD Difícil para 100% NEX deve ser 150');

  // Inimigos: 2x Zumbi de Sangue (VD 20) + 1x Ocultista Fanático (VD 60) = VD Total 100
  const inimigo1 = { vd: 20, qtd: 2 };
  const inimigo2 = { vd: 60, qtd: 1 };
  const totalVD = (inimigo1.vd * inimigo1.qtd) + (inimigo2.vd * inimigo2.qtd);

  assert.equal(totalVD, 100, 'VD Total dos inimigos deve ser 100');
  assert.equal(totalVD === vdEquilibrado, true, 'Encontro deve ser classificado como perfeitamente Equilibrado');
});

console.log(`\n${passou} testes passaram!`);
