/**
 * EFEITOS MECÂNICOS DOS RITUAIS
 *
 * Ficheiro deliberadamente SEPARADO de `data/rituais/*.js`: aqueles são a
 * transcrição do livro e não se lhes toca. Aqui fica só a leitura mecânica de
 * cada ritual — o que a ficha sabe somar sozinha.
 *
 * A chave é o `id` do ritual. Um ritual que não esteja aqui continua a
 * funcionar na app (gasta PE, rola Ocultismo, liga/desliga) — só não soma
 * nada automaticamente. É de propósito: dos 98 rituais, 46 não têm um único
 * número no texto, e inventar efeitos seria pior do que não ter nenhum.
 *
 * Dois tipos de entrada, conforme a duração:
 *
 *   `ativo`  — vale ENQUANTO o ritual estiver ligado no interruptor
 *              Ativo/Inativo (duração Cena, Sustentada, definida). Entra nas
 *              contas da ficha em `engine/rituaisEfeitos.js`.
 *   `dano`   — rola-se uma vez, na conjuração (duração Instantânea). Não fica
 *              guardado em lado nenhum: sai no histórico de rolagens.
 *
 * Efeitos de `ativo` suportados hoje:
 *   { tipo: 'defesa',        valor }
 *   { tipo: 'atributo',      atributo, valor }
 *   { tipo: 'dadosPericia',  pericia, dados }        (pool de d20, não bónus)
 *   { tipo: 'ataqueCorpoACorpo', ataque, dano }
 *   { tipo: 'pericia',       pericia, valor }
 *   { tipo: 'deslocamento',  valor }   (em metros)
 *
 * `alvo: 'voce'` marca os rituais que afetam quem os conjura — só esses podem
 * somar à ficha. Um ritual que dá +5 na Defesa de OUTRA pessoa não pode
 * mexer nesta ficha, e por isso não entra aqui.
 */

export const EFEITOS_RITUAIS = {
  // ---------------------------------------------------------- enquanto ativo
  'armadura-de-sangue': {
    alvo: 'voce',
    ativo: [{ tipo: 'defesa', valor: 5 }],
    nota: '+5 na Defesa enquanto a carapaça durar.',
  },
  embaralhar: {
    alvo: 'voce',
    ativo: [{ tipo: 'defesa', valor: 6 }],
    nota: '+6 na Defesa.',
  },
  'distorcer-aparencia': {
    alvo: 'voce',
    ativo: [{ tipo: 'pericia', pericia: 'enganacao', valor: 10 }],
    nota: '+10 em Enganação — só para disfarce; a ficha soma sempre, tem juízo ao usar.',
  },
  'esconder-dos-olhos': {
    alvo: 'voce',
    ativo: [{ tipo: 'pericia', pericia: 'furtividade', valor: 15 }],
    nota: '+15 em Furtividade (e camuflagem total, que a ficha não modela).',
  },
  mutar: {
    alvo: 'voce',
    ativo: [{ tipo: 'pericia', pericia: 'furtividade', valor: 10 }],
    nota: '+10 em Furtividade.',
  },

  // ------------------------------------------------- ligados a uma arma
  // "1 arma corpo a corpo" — ao conjurar pergunta-se em qual das armas, e o
  // bónus fica só nessa (guardado em `r.armaAlvo`, pelo nome da arma).
  'arma-atroz': {
    escolhaArma: true,
    naArma: { ataque: 2, margem: 1 },
    nota: '+2 em testes de ataque e +1 na margem de ameaça, só na arma escolhida.',
  },

  // Pacote grande. Automatiza-se o que é número; o resto (faro, visão no
  // escuro, cura acelerada 10, o dado extra nos desarmados, não poder
  // conjurar mais, e o fim da personagem) fica na nota — não são coisas que
  // a ficha saiba modelar.
  'martirio-de-sangue': {
    alvo: 'voce',
    ativo: [
      { tipo: 'defesa', valor: 10 },
      { tipo: 'ataqueCorpoACorpo', ataque: 10, dano: 10 },
      { tipo: 'dadosPericia', pericia: 'diplomacia', dados: -3 },
      { tipo: 'dadosPericia', pericia: 'enganacao', dados: -3 },
    ],
    pvTempAoConjurar: 30,
    nota: 'Também dá faro, visão no escuro, cura acelerada 10 e 1 dado extra nos ataques desarmados (letais). Não podes conjurar mais rituais. Quando a cena acabar, perdes a personagem para sempre.',
  },

  // ---------------------------------------------------------------- dano
  // `tipo` é o id de TIPOS_DANO (engine/danoRecetor.js) — é o que dá a cor
  // certa ao total no painel de rolagens. Escrever "Morte" com maiúscula
  // deixa a soma cinzenta.
  decadencia: { dano: { formula: '2d8+2', tipo: 'morte' } },
  esfolar: { dano: { formula: '3d4+3', tipo: 'corte' }, nota: 'O alvo fica sangrando.' },
  eletrocussao: { dano: { formula: '3d6', tipo: 'eletricidade' } },
  'desfazer-sinapses': { dano: { formula: '2d6+2', tipo: 'conhecimento' }, nota: 'O alvo fica frustrado por 1 rodada.' },

  // 6d8 "metade corte, metade Sangue" — a ficha rola o total como Sangue e
  // avisa; separar em dois tipos daria dois totais e baralhava a leitura.
  descarnar: {
    // "6d8 (metade corte, metade Sangue)" — rolam-se as duas metades em
    // separado, cada uma com a sua cor no painel de rolagens.
    dano: { formula: '3d8', tipo: 'corte', extras: [{ expr: '3d8', tipoDano: 'sangue', elemental: true }] },
    nota: 'Hemorragia: no início de cada turno dele, Fortitude ou mais 2d8 de Sangue.',
  },
  hemofagia: {
    dano: { formula: '6d6', tipo: 'sangue' },
    // "recuperando pontos de vida iguais à metade do dano causado" — o que
    // conta é o dano que o alvo SOFREU de facto, depois das resistências
    // dele (e a Fortitude reduz este ritual a metade). Por isso, a seguir à
    // rolagem, abre-se o recetor de dano para confirmar o número final.
    curaMetadeDoDano: true,
    nota: 'Recuperas PV iguais a metade do dano que o alvo sofrer de facto.',
  },
  'miasma-entropico': {
    dano: { formula: '4d8', tipo: 'quimico' },
    nota: 'Em área. Quem passar na Fortitude sofre metade e não fica enjoado.',
  },
  paradoxo: {
    dano: { formula: '6d6', tipo: 'morte' },
    nota: 'Em área, em todos os seres. Fortitude reduz à metade.',
  },
  'conhecendo-o-medo': {
    dano: { formula: '10d6', tipo: 'mental' },
    nota: 'Só quem PASSAR na Vontade é que sofre este dano. Quem falhar fica com a Sanidade a 0 e enlouquecendo.',
  },
  'lamina-do-medo': {
    dano: { formula: '10d8', tipo: 'medo' },
    nota: 'Só quem PASSAR na Fortitude é que sofre este dano (ignora todas as resistências). Quem falhar fica com 0 PV e morrendo.',
  },
};

/** O ritual tem leitura mecânica automatizada? */
export function temEfeitos(ritual) {
  return Boolean(ritual?.id && EFEITOS_RITUAIS[ritual.id]);
}

export function efeitosDe(ritual) {
  return (ritual?.id && EFEITOS_RITUAIS[ritual.id]) || null;
}
