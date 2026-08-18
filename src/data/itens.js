// ITENS — agregador de armas, proteções, equipamento geral e itens amaldiçoados.
import { ARMAS } from './itens/armas.js';
import { ITENS_GERAIS, PROTECOES, GRUPOS_ITENS_GERAIS, MODIFICACOES_PROTECAO, MODIFICACOES_ACESSORIO } from './itens/geral.js';
import { ITENS_AMALDICOADOS } from './itens/amaldicoados.js';

export { ARMAS, ITENS_GERAIS, PROTECOES, ITENS_AMALDICOADOS, GRUPOS_ITENS_GERAIS, MODIFICACOES_PROTECAO, MODIFICACOES_ACESSORIO };

const comTipo = (lista, tipo) => lista.map((i) => ({ tipo, ...i }));

/** Catálogo único para os seletores da app. */
export const ITENS = [
  ...comTipo(ARMAS, 'arma'),
  ...comTipo(PROTECOES, 'protecao'),
  ...comTipo(ITENS_GERAIS, 'geral'),
  ...comTipo(ITENS_AMALDICOADOS, 'amaldicoado'),
];

export const ITENS_POR_ID = Object.fromEntries(ITENS.map((i) => [i.id, i]));

export const TIPOS_ITEM = [
  { id: 'arma', nome: 'Armas' },
  { id: 'protecao', nome: 'Proteções' },
  { id: 'geral', nome: 'Equipamento Geral' },
  { id: 'amaldicoado', nome: 'Itens Amaldiçoados' },
];

export const TIPOS_DANO = [
  { id: 'balistica', nome: 'Balística', pdf: 'balistica' },
  { id: 'corte', nome: 'Corte', pdf: 'corte' },
  { id: 'impacto', nome: 'Impacto', pdf: 'impacto' },
  { id: 'perfuracao', nome: 'Perfuração', pdf: 'perfuracao' },
  { id: 'mental', nome: 'Mental', pdf: 'mental' },
  { id: 'sangue', nome: 'Sangue', pdf: 'sangue' },
  { id: 'morte', nome: 'Morte', pdf: 'morte' },
  { id: 'energia', nome: 'Energia', pdf: 'energia' },
  { id: 'conhecimento', nome: 'Conhecimento', pdf: 'conhecimento' },
];

export function itensFiltrados({ tipo = null, texto = '' } = {}) {
  const t = texto.trim().toLowerCase();
  return ITENS.filter(
    (i) => (tipo === null || i.tipo === tipo) && (!t || i.nome.toLowerCase().includes(t))
  );
}

export default ITENS;
