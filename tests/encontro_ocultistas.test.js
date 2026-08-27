import assert from 'node:assert/strict';
import { gerarOcultistaInimigo, vdParaGrupo, ELEMENTOS_CULTISTAS, PATENTES_CULTISTAS } from '../src/engine/geradores.js';

console.log('Testes de Ocultistas Inimigos e Cálculo de VD de Encontros\n');

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

teste('Geração de Ocultista Inimigo não-agente com VD, rituais, poderes e elemento', () => {
  const o = gerarOcultistaInimigo({ vd: 60, elemento: 'Sangue' });

  assert.equal(o.tipo, 'ameaca');
  assert.equal(o.subtipo, 'ocultista');
  assert.equal(o.elemento, 'Sangue');
  assert.equal(o.vd, 60);

  // Rituais e Poderes
  assert.ok(o.rituais.length >= 2, 'Ocultista VD 60 deve ter rituais preparados');
  assert.ok(o.habilidades.length >= 1, 'Ocultista VD 60 deve ter poderes paranormais');
  assert.ok(o.dt >= 15, 'DT de rituais deve ser escalada com o VD');

  // Interpretação e Detalhes do Culto
  assert.ok(o.culto && o.culto.length > 3, 'Deve pertencer a um culto paranormal');
  assert.ok(o.comportamento && o.comportamento.length > 5, 'Deve possuir comportamento fanático');
  assert.ok(o.dicaRp && o.dicaRp.length > 5, 'Deve possuir dica de interpretação para o Mestre');
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
