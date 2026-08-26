import assert from 'node:assert/strict';
import { ARMAS, ITENS } from '../src/data/itens.js';
import { armaDoItem, ehArma, estatisticasArma } from '../src/engine/armas.js';
import { personagemVazio } from '../src/engine/character.js';
import { categoriaRomana } from '../src/data/patentes.js';

console.log('Testes de Granadas e Explosivos de Todos os Livros e Categorias de Armas\n');

const expectedExplosives = [
  { id: 'granada-de-fragmentacao', nome: 'Granada de Fragmentação', cat: 1, dano: '8d6' },
  { id: 'granada-de-atordoamento', nome: 'Granada de Atordoamento', cat: 1, dano: '-' },
  { id: 'granada-de-fumaca', nome: 'Granada de Fumaça', cat: 1, dano: '-' },
  { id: 'granada-incendiaria', nome: 'Granada Incendiária', cat: 1, dano: '6d6' },
  { id: 'mina-antipessoal', nome: 'Mina Antipessoal', cat: 2, dano: '8d6' },
  { id: 'coquetel-molotov', nome: 'Coquetel Molotov', cat: 0, dano: '4d6' },
  { id: 'dinamite', nome: 'Dinamite', cat: 1, dano: '4d6+4d6' },
  { id: 'explosivo-plastico', nome: 'Explosivo Plástico', cat: 2, dano: '16d6' },
  { id: 'galao-vermelho', nome: 'Galão Vermelho', cat: 0, dano: '12d6' },
  { id: 'granada-de-gas-sonifero', nome: 'Granada de Gás Sonífero', cat: 1, dano: '-' },
  { id: 'granada-de-pem', nome: 'Granada de PEM', cat: 1, dano: '6d6' },
  { id: 'granada-de-gas-lacrimogeneo', nome: 'Granada de Gás Lacrimogêneo', cat: 1, dano: '4d6' },
  { id: 'granada-de-tinta', nome: 'Granada de Tinta', cat: 0, dano: '-' },
  { id: 'granada-ctrl-c-ctrl-v', nome: 'Granada Ctrl+C Ctrl+V', cat: 2, dano: '8d6' },
  { id: 'lancador-de-granadas', nome: 'Lançador de Granadas', cat: 2, dano: '-' },
];

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

teste('Todos os 15 explosivos e granadas oficiais estão cadastrados em ARMAS', () => {
  for (const exp of expectedExplosives) {
    const item = ARMAS.find((a) => a.id === exp.id || a.nome.toLowerCase() === exp.nome.toLowerCase());
    assert.ok(item, `Explosivo ${exp.nome} (${exp.id}) deve estar em ARMAS`);
    assert.equal(ehArma(item), true, `${exp.nome} deve ser classificado como arma`);
    assert.equal(item.pericia, 'pontaria', `${exp.nome} deve usar Pontaria`);
    assert.equal(item.categoria, exp.cat, `${exp.nome} deve ter categoria ${exp.cat} (obtido ${item.categoria})`);
  }
});

teste('Armas preservam a categoria ao serem adicionadas à ficha com armaDoItem', () => {
  const p = personagemVazio();
  for (const exp of expectedExplosives) {
    const item = ARMAS.find((a) => a.id === exp.id);
    const armaFicha = armaDoItem(item);
    assert.equal(armaFicha.categoria, exp.cat, `armaDoItem deve manter categoria ${exp.cat} para ${exp.nome}`);
    assert.ok(categoriaRomana(armaFicha.categoria) != null, `categoriaRomana deve resolver a categoria`);
  }
});

teste('Todas as armas do catálogo possuem categoria válida', () => {
  for (const a of ARMAS) {
    assert.ok(a.categoria !== undefined && a.categoria !== null, `Arma ${a.nome} deve ter campo categoria`);
  }
});

console.log(`\n${passou} testes passaram!`);
