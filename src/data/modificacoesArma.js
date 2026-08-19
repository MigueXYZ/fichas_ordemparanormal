// MODIFICAÇÕES PARA ARMAS — Livro Base, cap. 3.
// Cada modificação aumenta a categoria da arma em I. Modificações iguais não
// se acumulam. `efeitos` é o que a app aplica sozinha aos números da arma.

export const MODIFICACOES_ARMA = [
  {
    id: 'certeira', nome: 'Certeira', tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Fabricada para ser mais precisa e balanceada, a arma fornece +2 nos testes de ataque.',
    efeitos: { ataque: 2 },
  },
  {
    id: 'cruel', nome: 'Cruel', tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'A lâmina é especialmente afiada ou foi fabricada com materiais mais densos. Fornece +2 nas rolagens de dano.',
    efeitos: { dano: 2 },
  },
  {
    id: 'discreta', nome: 'Discreta', tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Chama menos atenção e ocupa menos espaço: +5 em testes para ser ocultada e reduz o espaço em –1.',
    efeitos: { espacos: -1 },
  },
  {
    id: 'perigosa', nome: 'Perigosa', tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'A lâmina é afiada como uma navalha ou foi fabricada com materiais maciços. Aumenta a margem de ameaça em +2.',
    efeitos: { margem: 2 },
  },
  {
    id: 'tatica', nome: 'Tática', tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Cabo texturizado, bandoleira e outros acessórios: podes sacar a arma como ação livre.',
    efeitos: {},
  },
  {
    id: 'alongada', nome: 'Alongada', tipos: ['fogo'],
    texto: 'Cano mais longo, que aumenta a precisão dos disparos: +2 nos testes de ataque.',
    efeitos: { ataque: 2 },
  },
  {
    id: 'calibre-grosso', nome: 'Calibre Grosso', tipos: ['fogo'],
    texto: 'Dispara munição de maior calibre: aumenta o dano em mais um dado do mesmo tipo. Exige munição de calibre grosso.',
    efeitos: { dadosDano: 1 },
  },
  {
    id: 'compensador', nome: 'Compensador', tipos: ['fogo'],
    texto: 'Apenas para armas automáticas. Anula a penalidade em testes de ataque por disparar rajadas.',
    efeitos: {},
  },
  {
    id: 'ferrolho-automatico', nome: 'Ferrolho Automático', tipos: ['fogo'],
    texto: 'O mecanismo é modificado para disparar várias vezes em sequência. A arma torna-se automática.',
    efeitos: {},
  },
  {
    id: 'mira-laser', nome: 'Mira Laser', tipos: ['fogo'],
    texto: 'Um laser interno cria um retículo luminoso. Aumenta a margem de ameaça em +2.',
    efeitos: { margem: 2 },
  },
  {
    id: 'mira-telescopica', nome: 'Mira Telescópica', tipos: ['fogo'],
    texto: 'Luneta com marcações. Aumenta o alcance da arma em uma categoria e permite Ataque Furtivo em qualquer alcance.',
    efeitos: { alcanceCategoria: 1 },
  },
  {
    id: 'silenciador', nome: 'Silenciador', tipos: ['fogo'],
    texto: 'Reduz em –OO a penalidade em Furtividade para te esconderes no mesmo turno em que atacaste.',
    efeitos: {},
  },
  {
    id: 'visao-de-calor', nome: 'Visão de Calor', tipos: ['fogo'],
    texto: 'Mira com infravermelhos. Ao disparar, ignoras qualquer camuflagem do alvo.',
    efeitos: {},
  },
  {
    id: 'explosiva', nome: 'Munição Explosiva', tipos: ['fogo'],
    texto: 'Balas com uma gota de mercúrio ou glicerina que explodem ao atingir o alvo: +2d6 de dano. Só em balas curtas e longas.',
    efeitos: { danoExtra: '2d6' },
  },
];

export const MODIFICACOES_ARMA_POR_ID = Object.fromEntries(MODIFICACOES_ARMA.map((m) => [m.id, m]));

export const ALCANCES = ['Curto', 'Médio', 'Longo', 'Extremo'];

/** Aplica as modificações escolhidas aos números base da arma. */
export function aplicarModificacoes(arma) {
  const mods = (arma.modificacoes || []).map((id) => MODIFICACOES_ARMA_POR_ID[id]).filter(Boolean);
  const soma = (campo) => mods.reduce((t, m) => t + (m.efeitos[campo] || 0), 0);
  const extras = mods.map((m) => m.efeitos.danoExtra).filter(Boolean);

  const alcanceBase = ALCANCES.indexOf(arma.alcance);
  const saltos = soma('alcanceCategoria');
  const alcance = alcanceBase >= 0 && saltos
    ? ALCANCES[Math.min(alcanceBase + saltos, ALCANCES.length - 1)]
    : arma.alcance;

  return {
    ataque: soma('ataque'),
    dano: soma('dano'),
    margem: soma('margem'),
    dadosDano: soma('dadosDano'),
    espacos: soma('espacos'),
    danoExtra: extras,
    alcance,
    categoriaExtra: mods.length,   // cada modificação sobe a categoria em I
    lista: mods,
  };
}
