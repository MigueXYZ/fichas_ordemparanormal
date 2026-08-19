// ITENS — agregador de armas, proteções, equipamento geral e itens amaldiçoados.
import { ARMAS } from './itens/armas.js';
import { ITENS_GERAIS, PROTECOES, GRUPOS_ITENS_GERAIS, MODIFICACOES_PROTECAO, MODIFICACOES_ACESSORIO } from './itens/geral.js';
import { ITENS_AMALDICOADOS } from './itens/amaldicoados.js';

export { ARMAS, ITENS_GERAIS, PROTECOES, ITENS_AMALDICOADOS, GRUPOS_ITENS_GERAIS, MODIFICACOES_PROTECAO, MODIFICACOES_ACESSORIO };

// atenção: alguns itens já trazem um campo `tipo` do livro (ex.: proteção "Leve",
// item amaldiçoado "Arma"). Guardamos esse valor em `subtipo` para não o perder.
const comTipo = (lista, tipo) => lista.map((i) => ({ ...i, subtipo: i.tipo ?? null, tipo }));

// alguns itens aparecem em mais do que uma lista dos livros (as granadas, por
// exemplo, estão nas armas e no equipamento geral). Ficamos com a primeira
// ocorrência e completamos os campos que faltarem com a segunda.
function juntar(...listas) {
  const porId = new Map();
  for (const item of listas.flat()) {
    const existente = porId.get(item.id);
    if (!existente) {
      porId.set(item.id, { ...item, chave: `${item.tipo}:${item.id}` });
      continue;
    }
    for (const [campo, valor] of Object.entries(item)) {
      if (existente[campo] === null || existente[campo] === undefined || existente[campo] === '') {
        existente[campo] = valor;
      }
    }
  }
  return [...porId.values()];
}

/** Catálogo único para os seletores da app. */
export const ITENS = juntar(
  comTipo(ARMAS, 'arma'),
  comTipo(PROTECOES, 'protecao'),
  comTipo(ITENS_GERAIS, 'geral'),
  comTipo(ITENS_AMALDICOADOS, 'amaldicoado'),
);

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
