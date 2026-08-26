import assert from 'node:assert/strict';
import { ITENS, TIPOS_ITEM } from '../src/data/itens.js';
import { personagemVazio } from '../src/engine/character.js';
import { calcDefesa, calcPericias, defesaDasProtecoes } from '../src/engine/calc.js';

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

console.log('Testes de Vestimentas, Proteções e Filtros de Itens\n');

teste('Filtro de Equipamento Geral NÃO contém itens amaldiçoados/paranormais', () => {
  const itensGerais = ITENS.filter((i) => i.tipo === 'geral');
  for (const item of itensGerais) {
    assert.ok(item.grupo !== 'Itens Paranormais', `Item ${item.nome} não deve ser do grupo Itens Paranormais em geral`);
    assert.ok(!item.elemento, `Item ${item.nome} com elemento não deve estar em geral`);
  }
});

teste('Filtro de Itens Amaldiçoados e Paranormais contém catalisadores e amaldiçoados', () => {
  const itensAmald = ITENS.filter((i) => i.tipo === 'amaldicoado');
  assert.ok(itensAmald.length > 20, 'Deve ter múltiplos itens amaldiçoados e paranormais');
  const cat = itensAmald.find((i) => i.id.includes('catalisador-ritualistico'));
  assert.ok(cat, 'Catalisadores devem estar no filtro de itens amaldiçoados/paranormais');
});

teste('Vestir Proteção no inventário aumenta Defesa automaticamente', () => {
  const p = personagemVazio();
  p.atributos.agi = 1; // 10 + 1 = 11 base
  assert.equal(calcDefesa(p), 11);

  // Adiciona Proteção Leve no inventário e veste
  p.inventario = [
    { nome: 'Proteção Leve', itemId: 'protecao-leve', tipo: 'protecao', defesa: 5, vestido: true, espacos: 2, quantidade: 1 }
  ];
  // Com protecao leve vestida: 10 + 1 + 5 = 16
  assert.equal(calcDefesa(p), 16);

  // Despir proteção leve
  p.inventario[0].vestido = false;
  assert.equal(calcDefesa(p), 11);
});

teste('Vestir Vestimenta (+2 ou +5) no inventário aumenta perícia correspondente (máx 2 vestimentas)', () => {
  const p = personagemVazio();
  p.inventario = [
    { nome: 'Vestimenta Elegante (+2 Diplomacia)', pericia: 'diplomacia', bonus: 2, vestido: true, quantidade: 1 },
    { nome: 'Manto com Glifos (+2 Ocultismo)', pericia: 'ocultismo', bonus: 2, vestido: true, quantidade: 1 },
    { nome: 'Botas Extras (+2 Atletismo)', pericia: 'atletismo', bonus: 2, vestido: false, quantidade: 1 },
  ];

  const pericias = calcPericias(p);
  const dip = pericias.find((x) => x.id === 'diplomacia');
  const ocu = pericias.find((x) => x.id === 'ocultismo');
  const atl = pericias.find((x) => x.id === 'atletismo');

  assert.equal(dip.bonus, 2, 'Diplomacia deve receber +2 da vestimenta vestida');
  assert.equal(ocu.bonus, 2, 'Ocultismo deve receber +2 da vestimenta vestida');
  assert.equal(atl.bonus, 0, 'Atletismo não deve receber bónus pois vestimenta está despida');
});

console.log(`\n${passou} testes passaram!`);
