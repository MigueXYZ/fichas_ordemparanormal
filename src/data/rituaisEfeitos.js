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

  // ---------------------------------------------------------------- dano
  decadencia: { dano: { formula: '2d8+2', tipo: 'Morte' } },
  esfolar: { dano: { formula: '3d4+3', tipo: 'corte' }, nota: 'O alvo fica sangrando.' },
  eletrocussao: { dano: { formula: '3d6', tipo: 'eletricidade' } },
  'desfazer-sinapses': { dano: { formula: '2d6+2', tipo: 'Conhecimento' }, nota: 'O alvo fica frustrado por 1 rodada.' },
};

/** O ritual tem leitura mecânica automatizada? */
export function temEfeitos(ritual) {
  return Boolean(ritual?.id && EFEITOS_RITUAIS[ritual.id]);
}

export function efeitosDe(ritual) {
  return (ritual?.id && EFEITOS_RITUAIS[ritual.id]) || null;
}
