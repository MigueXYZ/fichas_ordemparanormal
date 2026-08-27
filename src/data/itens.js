// ITENS — agregador de armas, proteções, equipamento geral e itens amaldiçoados.
import { ARMAS } from './itens/armas.js';
import { ITENS_GERAIS, PROTECOES, GRUPOS_ITENS_GERAIS, MODIFICACOES_PROTECAO, MODIFICACOES_ACESSORIO, MODIFICACOES_GRANADA } from './itens/geral.js';
import { ITENS_AMALDICOADOS } from './itens/amaldicoados.js';

export { ARMAS, ITENS_GERAIS, PROTECOES, ITENS_AMALDICOADOS, GRUPOS_ITENS_GERAIS, MODIFICACOES_PROTECAO, MODIFICACOES_ACESSORIO, MODIFICACOES_GRANADA };

function determinarTipoItem(item, tipoPadrao) {
  if (tipoPadrao === 'arma' || (item.grupo && String(item.grupo).toLowerCase().includes('arma')) || item.pericia === 'pontaria' || item.pericia === 'luta') {
    return 'arma';
  }
  if (tipoPadrao === 'protecao' || item.grupo === 'Proteções' || item.tipo === 'Leve' || item.tipo === 'Pesada' || item.tipo === 'Escudo') {
    return 'protecao';
  }
  if (
    tipoPadrao === 'amaldicoado' ||
    item.grupo === 'Itens Paranormais' ||
    item.grupo === 'Catalisadores Ritualísticos de (Elemento)' ||
    item.elemento
  ) {
    return 'amaldicoado';
  }
  return 'geral';
}

const comTipo = (lista, tipoPadrao) =>
  lista.map((i) => {
    const tipoFinal = determinarTipoItem(i, tipoPadrao);
    return {
      ...i,
      subtipo: i.tipo ?? null,
      tipo: tipoFinal,
    };
  });

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
  comTipo(ITENS_AMALDICOADOS.filter((i) => i.maldicao !== true), 'amaldicoado'),
);

export const ITENS_POR_ID = Object.fromEntries(ITENS.map((i) => [i.id, i]));

export const TIPOS_ITEM = [
  { id: 'geral', nome: 'Equipamento Geral' },
  { id: 'protecao', nome: 'Proteções' },
  { id: 'amaldicoado', nome: 'Itens Amaldiçoados e Paranormais' },
  { id: 'arma', nome: 'Armas' },
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

export const PROFICIENCIAS_OP = ['Armas simples', 'Armas táticas', 'Armas pesadas', 'Proteções leves', 'Proteções pesadas'];

export function itensFiltrados({ tipo = null, texto = '' } = {}) {
  const t = texto.trim().toLowerCase();
  return ITENS.filter(
    (i) => (tipo === null || i.tipo === tipo) && (!t || i.nome.toLowerCase().includes(t))
  );
}

export default ITENS;
