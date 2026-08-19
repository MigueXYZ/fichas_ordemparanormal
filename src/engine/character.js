import { PERICIAS } from '../data/pericias.js';
import { calcMaximos } from './calc.js';
import { REGRAS_POR_OMISSAO } from '../data/regrasOpcionais.js';

export const VERSAO_FICHA = 1;

export function periciasVazias() {
  const o = {};
  for (const p of PERICIAS) o[p.id] = { grau: 'destreinado', outros: 0, attr: null };
  return o;
}

export function personagemVazio() {
  return {
    versao: VERSAO_FICHA,
    nome: '',
    jogador: '',
    nex: 5,
    nivel: 1,               // só conta com a regra opcional "NEX & Experiência"
    regras: { ...REGRAS_POR_OMISSAO },
    exposicao: {},          // escolhas das alterações por NEX (regra opcional)
    patente: '',
    imagem: null,
    token: null,            // imagem do agente, na margem esquerda

    atributos: { for: 1, agi: 1, int: 1, pre: 1, vig: 1 },

    origemId: null,
    origemCustom: null,
    classeId: null,
    trilhaId: null,

    pericias: periciasVazias(),

    pvAtual: null,
    sanAtual: null,
    peAtual: null,
    pdAtual: null,          // regra opcional "Jogando sem Sanidade"
    pvExtra: 0,
    sanExtra: 0,
    peExtra: 0,
    pdExtra: 0,

    defesaEquipamento: 0,
    defesaOutros: 0,
    bloqueioExtra: 0,
    esquivaExtra: 0,
    bloqueioManual: null,   // se preenchido, manda sobre o cálculo automático
    esquivaManual: null,
    protecao: '',
    resistencias: '',
    proficiencias: '',
    deslocamento: 9,
    penalidadeCarga: 0,

    ataques: [],
    habilidades: [],
    rituais: [],
    inventario: [],
    creditoLimite: '',
    pontosPrestigio: '',
    patenteTexto: '',

    descricao: { aparencia: '', personalidade: '', historico: '', objetivo: '' },
    anotacoes: '',
  };
}

/** Depois de mudar classe/NEX/atributos, garante que os atuais não passam do máximo. */
export function normalizarRecursos(p) {
  const max = calcMaximos(p);
  const clamp = (v, m) => (v === null || v === undefined || v > m ? m : Math.max(0, v));
  return {
    ...p,
    pvAtual: clamp(p.pvAtual, max.pv),
    sanAtual: clamp(p.sanAtual, max.san),
    peAtual: clamp(p.peAtual, max.pe),
    pdAtual: clamp(p.pdAtual, max.pd),
  };
}

/**
 * Quando o NEX ou os atributos mudam, os máximos mudam: soma a diferença aos
 * valores atuais (subir de NEX não deve deixar o agente ferido).
 */
export function ajustarRecursos(antes, depois) {
  const a = calcMaximos(antes);
  const d = calcMaximos(depois);
  const mover = (atual, ma, md) => {
    if (atual === null || atual === undefined) return null;
    return Math.max(0, Math.min(atual + (md - ma), md));
  };
  return {
    ...depois,
    pvAtual: mover(depois.pvAtual, a.pv, d.pv),
    sanAtual: mover(depois.sanAtual, a.san, d.san),
    peAtual: mover(depois.peAtual, a.pe, d.pe),
    pdAtual: mover(depois.pdAtual, a.pd, d.pd),
  };
}

export function novoAtaque() {
  return { nome: '', pericia: 'luta', bonus: '', dano: '', critico: '', tipo: '', alcance: '', espacos: '' };
}

export function novoItem() {
  return { nome: '', categoria: '', espacos: '' };
}

export function novaHabilidade() {
  return { nome: '', descricao: '', origem: '' };
}

export function novoRitual() {
  return { nome: '', circulo: 1, elemento: 'energia', execucao: '', alcance: '', alvo: '', duracao: '', resistencia: '', custo: '', descricao: '' };
}
