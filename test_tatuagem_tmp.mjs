import {
  tatuagemAlargada, reducaoTatuagemRitualistica, bonusConcentracaoTatuagem, podeReagirTatuagem,
} from './src/engine/monstruoso.js';

const base = {
  classeId: 'ocultista',
  trilhaId: 'monstruoso-ocultista',
  monstruosoElemento: 'Sangue',
  monstruosoAtivoHoje: true,
  atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 },
  condicoes: [],
};

console.log('--- tatuagemAlargada ---');
console.log('40% ativo (esperado true):', tatuagemAlargada(base, 40));
console.log('10% (esperado false):', tatuagemAlargada(base, 10));
console.log('nao ativo hoje (esperado false):', tatuagemAlargada({ ...base, monstruosoAtivoHoje: false }, 40));
console.log('elemento Morte (esperado false):', tatuagemAlargada({ ...base, monstruosoElemento: 'Morte' }, 40));

const ritualPessoalVoce = { elemento: 'sangue', alcance: 'Pessoal', alvo: 'você' };
const ritualSangueOutro = { elemento: 'sangue', alcance: '9m', alvo: '1 pessoa' };
const ritualMorteOutro = { elemento: 'morte', alcance: '9m', alvo: '1 pessoa' };

console.log('--- reducaoTatuagemRitualistica (40%) ---');
console.log('Pessoal+voce, marcado (esperado 1):', reducaoTatuagemRitualistica(base, 40, ritualPessoalVoce, true));
console.log('Sangue outro alvo, marcado, 40% (esperado 1):', reducaoTatuagemRitualistica(base, 40, ritualSangueOutro, true));
console.log('Sangue outro alvo, marcado, 10% (esperado 0):', reducaoTatuagemRitualistica(base, 10, ritualSangueOutro, true));
console.log('Morte outro alvo, marcado, 40% (esperado 0):', reducaoTatuagemRitualistica(base, 40, ritualMorteOutro, true));
console.log('nao marcado (esperado 0):', reducaoTatuagemRitualistica(base, 40, ritualSangueOutro, false));

console.log('--- bonusConcentracaoTatuagem (40%) ---');
console.log('Sangue marcado, 40% (esperado 5):', bonusConcentracaoTatuagem(base, 40, ritualSangueOutro, true));
console.log('Morte marcado, 40% (esperado 0):', bonusConcentracaoTatuagem(base, 40, ritualMorteOutro, true));
console.log('Sangue marcado, 10% (esperado 0):', bonusConcentracaoTatuagem(base, 10, ritualSangueOutro, true));

console.log('--- podeReagirTatuagem (40%) ---');
console.log('machucado, marcado (esperado true):', podeReagirTatuagem({ ...base, condicoes: ['machucado'] }, 40, ritualSangueOutro, true));
console.log('fadigado (fraco), marcado (esperado true):', podeReagirTatuagem({ ...base, condicoes: ['fraco'] }, 40, ritualSangueOutro, true));
console.log('sem condicao (esperado false):', podeReagirTatuagem(base, 40, ritualSangueOutro, true));
console.log('machucado mas ja usado (esperado false):', podeReagirTatuagem({ ...base, condicoes: ['machucado'], monstruosoReacaoTatuagemUsada: true }, 40, ritualSangueOutro, true));
console.log('machucado, elemento Morte (esperado false):', podeReagirTatuagem({ ...base, condicoes: ['machucado'] }, 40, ritualMorteOutro, true));
console.log('machucado, nao marcado (esperado false):', podeReagirTatuagem({ ...base, condicoes: ['machucado'] }, 40, ritualSangueOutro, false));
