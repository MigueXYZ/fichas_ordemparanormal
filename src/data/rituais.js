// RITUAIS — agregador dos ficheiros extraídos dos livros.
import { RITUAIS_PARTE1 } from './rituais/parte1.js';
import { RITUAIS_PARTE2 } from './rituais/parte2.js';
import { RITUAIS_AS04 } from './rituais/as04.js';

// Alguns rituais têm mais do que um elemento possível (o elemento é escolhido
// ao aprender). Guardamos a lista em `elementos` e usamos 'variavel' no campo simples.
function normalizar(r) {
  const partes = String(r.elemento || '').split(',').map((x) => x.trim()).filter(Boolean);
  if (partes.length <= 1) return { ...r, elementos: partes };
  return { ...r, elemento: 'variavel', elementos: partes };
}

export const RITUAIS = [...RITUAIS_PARTE1, ...RITUAIS_PARTE2, ...RITUAIS_AS04]
  .map(normalizar)
  .sort((a, b) => a.circulo - b.circulo || a.nome.localeCompare(b.nome, 'pt'));

export const RITUAIS_POR_ID = Object.fromEntries(RITUAIS.map((r) => [r.id, r]));

export const ELEMENTOS = [
  // cores tiradas da arte oficial dos símbolos (ver public/img/sigilo-*.png)
  { id: 'sangue', nome: 'Sangue', cor: '#c8202a', pdf: 'sangue' },
  { id: 'morte', nome: 'Morte', cor: '#969ba1', pdf: 'morte' },
  { id: 'energia', nome: 'Energia', cor: '#a15cd8', pdf: 'energia' },
  { id: 'conhecimento', nome: 'Conhecimento', cor: '#d8b53c', pdf: 'conhecimento' },
  { id: 'medo', nome: 'Medo', cor: '#e6e6ea', pdf: null },
  { id: 'variavel', nome: 'Variável (à escolha)', cor: '#9b9ba6', pdf: null },
];

/** Ordem em que os símbolos aparecem no ecrã inicial, da esquerda para a direita. */
export const ORDEM_ELEMENTOS = ['sangue', 'morte', 'medo', 'conhecimento', 'energia'];

export const CIRCULOS = [1, 2, 3, 4];

/** Círculo máximo de ritual conjurável no NEX indicado (1º/2º/3º/4º). */
export function circuloMaximoPorNex(nex) {
  const n = Number(nex) || 5;
  if (n >= 75) return 4;
  if (n >= 50) return 3;
  if (n >= 25) return 2;
  return 1;
}

export function rituaisFiltrados({ circulo = null, elemento = null, texto = '' } = {}) {
  const t = texto.trim().toLowerCase();
  return RITUAIS.filter(
    (r) =>
      (circulo === null || r.circulo === circulo) &&
      (elemento === null || String(r.elemento).includes(elemento)) &&
      (!t || r.nome.toLowerCase().includes(t) || (r.descricao || '').toLowerCase().includes(t))
  );
}

export default RITUAIS;
