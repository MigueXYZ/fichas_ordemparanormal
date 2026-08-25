import {
  tatuagemAlargadaSangue, reducaoTatuagemRitualistica, bonusConcentracaoTatuagem, podeReagirTatuagemSangue,
} from './src/engine/monstruoso.js';

const base = {
  trilhaId: 'monstruoso-ocultista',
  monstruosoElemento: 'Sangue',
  monstruosoAtivoHoje: true,
  atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 },
  condicoes: [],
};

console.log('--- tatuagemAlargadaSangue ---');
console.log('40% ativo (esperado true):', tatuagemAlargadaSangue(base, 40));
console.log('10% (esperado false):', tatuagemAlargadaSangue(base, 10));
console.log('nao ativo hoje (esperado false):', tatuagemAlargadaSangue({ ...base, monstruosoAtivoHoje: false }, 40));
console.log('elemento Morte (esperado false):', tatuagemAlargadaSangue({ ...base, monstruosoElemento: 'Morte' }, 40));

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

console.log('--- podeReagirTatuagemSangue (40%) ---');
console.log('machucado, marcado (esperado true):', podeReagirTatuagemSangue({ ...base, condicoes: ['machucado'] }, 40, ritualSangueOutro, true));
console.log('fadigado (fraco), marcado (esperado true):', podeReagirTatuagemSangue({ ...base, condicoes: ['fraco'] }, 40, ritualSangueOutro, true));
console.log('sem condicao (esperado false):', podeReagirTatuagemSangue(base, 40, ritualSangueOutro, true));
console.log('machucado mas ja usado (esperado false):', podeReagirTatuagemSangue({ ...base, condicoes: ['machucado'], monstruosoReacaoTatuagemUsada: true }, 40, ritualSangueOutro, true));
console.log('machucado, elemento Morte (esperado false):', podeReagirTatuagemSangue({ ...base, condicoes: ['machucado'] }, 40, ritualMorteOutro, true));
console.log('machucado, nao marcado (esperado false):', podeReagirTatuagemSangue({ ...base, condicoes: ['machucado'] }, 40, ritualSangueOutro, false));
