/**
 * TEMAS POR ELEMENTO
 *
 * Cada elemento paranormal tem a sua própria pele: paleta, mosaico de sigilos
 * no fundo e a entidade que fica à direita do ecrã. A paleta em si vive no CSS
 * (`src/styles.css`, blocos `[data-tema="..."]`) — aqui fica só o que o React
 * precisa de saber: que temas existem, quais estão prontos e que imagens usar.
 *
 * O tema aplica-se pondo `data-tema` no <html> (ver `src/engine/tema.js`).
 * O tema `sangue` é o base: é o que está escrito no `:root`, por isso não
 * precisa de bloco próprio no CSS.
 */

export const TEMAS = [
  {
    id: 'sangue',
    nome: 'Sangue',
    pronto: true,
    entidade: '/img/diabo.webp',
    entidadeNome: 'O Diabo',
  },
  {
    id: 'morte',
    nome: 'Morte',
    pronto: true,
    entidade: '/img/entidade-morte.png',
    entidadeNome: 'A entidade da Morte',
  },
  {
    id: 'medo',
    nome: 'Medo',
    pronto: true,
    entidade: '/img/entidade-medo.png',
    entidadeNome: 'A entidade do Medo',
  },
  {
    id: 'conhecimento',
    nome: 'Conhecimento',
    pronto: true,
    entidade: '/img/entidade-conhecimento.png',
    entidadeNome: 'A entidade do Conhecimento',
  },
  {
    id: 'energia',
    nome: 'Energia',
    pronto: true,
    entidade: '/img/entidade-energia.png',
    entidadeNome: 'A entidade da Energia',
  },
];

export const TEMAS_POR_ID = Object.fromEntries(TEMAS.map((t) => [t.id, t]));

export const TEMA_PADRAO = 'sangue';

/** Os temas que já têm pele feita — os outros ainda não são clicáveis. */
export function temaExiste(id) {
  return Boolean(TEMAS_POR_ID[id]?.pronto);
}
