import assert from 'node:assert/strict';
import { ARMAS } from '../src/data/itens/armas.js';
import { ITENS_GERAIS } from '../src/data/itens/geral.js';
import { ITENS } from '../src/data/itens.js';
import { PODERES } from '../src/data/poderes.js';
import { CLASSES, TRILHAS } from '../src/data/classes.js';
import { ORIGENS } from '../src/data/origens.js';
import { ehArma, armaDoItem, estatisticasArma } from '../src/engine/armas.js';
import { personagemVazio } from '../src/engine/character.js';

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

console.log('Testes de Granadas nas Armas e Catálogo Expandido de Habilidades\n');

teste('Todas as granadas e explosivos estão presentes em ARMAS com teste de Pontaria', () => {
  const granadasEsperadas = [
    'granada-de-atordoamento',
    'granada-de-fragmentacao',
    'granada-de-fumaca',
    'granada-incendiaria',
    'mina-antipessoal',
    'granada-de-gas-lacrimogeneo',
    'granada-de-tinta',
    'granada-de-gas-sonifero',
    'granada-de-pem',
    'granada-ctrl-c-ctrl-v',
    'dinamite',
    'explosivo-plastico',
  ];

  for (const gid of granadasEsperadas) {
    const arma = ARMAS.find((a) => a.id === gid);
    assert.ok(arma, `Granada ${gid} deve existir em ARMAS`);
    assert.equal(arma.pericia, 'pontaria', `Granada ${gid} deve usar teste de Pontaria`);
    assert.ok(ehArma(arma), `ehArma deve retornar true para ${gid}`);
  }
});

teste('Granadas foram completamente removidas de ITENS_GERAIS', () => {
  const idsGranadas = [
    'granada-de-atordoamento',
    'granada-de-fragmentacao',
    'granada-de-fumaca',
    'granada-incendiaria',
    'mina-antipessoal',
    'granada-de-gas-lacrimogeneo',
    'granada-de-tinta',
    'granada-de-gas-sonifero',
    'granada-de-pem',
    'dinamite',
    'explosivo-plastico',
  ];

  for (const gid of idsGranadas) {
    const item = ITENS_GERAIS.find((i) => i.id === gid);
    assert.ok(!item, `Granada ${gid} NÃO deve existir em ITENS_GERAIS (deve estar apenas nas Armas)`);
  }
});

teste('estatisticasArma gera teste de Pontaria para granadas sem dano e com dano', () => {
  const p = personagemVazio();
  p.atributos.agi = 3;
  p.pericias.pontaria = { grau: 'treinado', outros: 0 }; // +5 treino

  const gAtord = ARMAS.find((a) => a.id === 'granada-de-atordoamento');
  const armaAtord = armaDoItem(gAtord);
  const statsAtord = estatisticasArma(p, armaAtord);

  assert.equal(statsAtord.dados, 3);
  assert.equal(statsAtord.bonusAtaque, 5);
  assert.equal(statsAtord.pericia.id, 'pontaria');

  const gFrag = ARMAS.find((a) => a.id === 'granada-de-fragmentacao');
  const armaFrag = armaDoItem(gFrag);
  const statsFrag = estatisticasArma(p, armaFrag);

  assert.equal(statsFrag.dados, 3);
  assert.equal(statsFrag.bonusAtaque, 5);
  assert.equal(statsFrag.dano, '8d6');
});

teste('Catálogo de habilidades agrega poderes de todas as classes, trilhas e origens', () => {
  const totalClassesPoderes = CLASSES.reduce((acc, c) => acc + (c.poderes || []).length, 0);
  const totalTrilhasPoderes = TRILHAS.reduce((acc, t) => acc + (t.poderes || []).length, 0);
  const totalOrigensPoderes = ORIGENS.filter((o) => o.poder?.nome).length;

  assert.ok(totalClassesPoderes > 20, 'Deve ter mais de 20 poderes de classes');
  assert.ok(totalTrilhasPoderes > 40, 'Deve ter mais de 40 poderes de trilhas');
  assert.ok(totalOrigensPoderes > 20, 'Deve ter mais de 20 poderes de origens');
});

console.log(`\n${passou} testes passaram!`);
