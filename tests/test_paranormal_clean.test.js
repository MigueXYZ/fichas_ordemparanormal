import assert from 'node:assert/strict';
import { ITENS, TIPOS_ITEM } from '../src/data/itens.js';
import { ITENS_GERAIS } from '../src/data/itens/geral.js';
import { ITENS_AMALDICOADOS } from '../src/data/itens/amaldicoados.js';

console.log('Testing item filtering and catalog isolation...\n');

// 1. Check Equipamento Geral items in ITENS
const itensGerais = ITENS.filter((i) => i.tipo === 'geral');
console.log(`Total Equipamento Geral items: ${itensGerais.length}`);

const invalidInGeral = itensGerais.filter((i) =>
  i.id === 'pe-de-coelho' ||
  i.id === 'sal-dourado' ||
  i.id === 'carranca-cacadora' ||
  i.id === 'gaiola-do-corvo' ||
  i.id === 'cranio-dominador' ||
  i.id.includes('catalisador-ritualistico') ||
  i.id.includes('componentes-ritualisticos') ||
  i.grupo === 'Itens Paranormais'
);

assert.equal(invalidInGeral.length, 0, `Equipamento Geral MUST NOT have paranormal items: ${invalidInGeral.map(i => i.nome).join(', ')}`);
console.log('  ok  Equipamento Geral has 0 paranormal items!');

// 2. Check that pe-de-coelho and sal-dourado exist in ITENS_AMALDICOADOS / tipo amaldicoado
const peDeCoelho = ITENS.find((i) => i.id === 'pe-de-coelho');
assert.ok(peDeCoelho, 'Pé de Coelho must exist in catalog');
assert.equal(peDeCoelho.tipo, 'amaldicoado', 'Pé de Coelho must have tipo amaldicoado');
console.log('  ok  Pé de Coelho is correctly categorized under amaldicoado!');

const salDourado = ITENS.find((i) => i.id === 'sal-dourado');
assert.ok(salDourado, 'Sal Dourado must exist in catalog');
assert.equal(salDourado.tipo, 'amaldicoado', 'Sal Dourado must have tipo amaldicoado');
console.log('  ok  Sal Dourado is correctly categorized under amaldicoado!');

console.log('\nAll item category tests passed 100%!');
