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
    tags: [],
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
    pvTemp: 0,      // pontos temporários: levam com o dano antes dos normais
    peTemp: 0,
    pdTemp: 0,
    sanTemp: 0,     // NOVO: Sanidade temporária

    condicoes: [],          // ids de CONDICOES (data/condicoes.js) ativas
    turnosMorrendo: 0,      // condição "morrendo": turnos começados a 0 PV nesta cena (3 = morre)
    tenacidadeTestes: 0,    // poder Tenacidade: testes de Fortitude já feitos nesta cena (DT 20 + 10 por anterior)

    defesaOutros: 0,
    bloqueioExtra: 0,
    esquivaExtra: 0,
    defesaManual: null,     // se preenchido, manda sobre o cálculo automático — igual a bloqueio/esquiva
    bloqueioManual: null,
    esquivaManual: null,
    protecao: [],           // ids de PROTECOES marcados (checkboxes) — a Defesa soma-os sozinha
    resistencias: [],       // Resistências (checkboxes): id puro (ex.: "sangue") = sem número, esse dano fica a metade (arredondado p/ baixo); "Nome N" (ex.: "Sangue 5") = com número, desconta N ao dano em vez da metade — ver engine/danoRecetor.js → repartirResistenciasFicha
    proficiencias: [],      // etiquetas de PROFICIENCIAS_OP marcadas (checkboxes)
    deslocamento: 9,
    penalidadeCarga: 0,

    ataques: [],
    habilidades: [],
    rituais: [],
    inventario: [],

    // Trilha do Monstruoso (Combatente/Especialista/Ocultista) — ver
    // engine/monstruoso.js e data/monstruoso.js. Tudo nesta trilha é diário
    // (só existe enquanto monstruosoAtivoHoje) exceto o que é explicitamente
    // permanente no livro — ver os dois campos marcados abaixo.
    monstruosoElemento: null,        // Sangue | Morte | Conhecimento | Energia — escolha permanente
    monstruosoAtivoHoje: false,      // fez a etapa ritualística hoje?
    monstruosoDrenagem: 0,           // "Ser Testado" (Especialista, 40%+): pontos drenados hoje (volta a 0 ao desativar)
    monstruosoEscolhas: { periciasConhecimento: [], rituais: {} }, // escolhas permanentes que a trilha pede (rituais à escolha, perícias livres)
    monstruosoPresencaPerdida: [],   // PERMANENTE: patamares (65/99) em que já perdeu 1 Presença; nunca reverte

    creditoLimite: '',
    pontosPrestigio: '',
    patenteTexto: '',

    descricao: { aparencia: '', personalidade: '', historico: '', objetivo: '' },
    anotacoes: '',
  };
}

/**
 * Verifica se o personagem ainda está exatamente como personagemVazio() o
 * deixou — ou seja, se o jogador abriu "criar novo agente" e fechou sem
 * mexer em nada. Só olha para os campos que o assistente deixa preencher
 * (nome, atributos, origem, classe, ...); campos técnicos como `id` ou
 * `historico` ficam de fora — comparar tudo seria frágil.
 */
export function personagemEhRascunhoVazio(p) {
  if (!p) return true;
  const vazio = personagemVazio();
  const atributosIguais = Object.keys(vazio.atributos).every(
    (k) => Number(p.atributos?.[k] ?? vazio.atributos[k]) === vazio.atributos[k]
  );
  const descricaoVazia = Object.keys(vazio.descricao).every((k) => !p.descricao?.[k]);
  return (
    !p.nome?.trim() &&
    !p.jogador?.trim() &&
    Number(p.nex) === vazio.nex &&
    !p.origemId &&
    !p.origemCustom &&
    !p.classeId &&
    !p.trilhaId &&
    atributosIguais &&
    !(p.tags && p.tags.length) &&
    !p.imagem &&
    !p.token &&
    !p.patente?.trim() &&
    !p.creditoLimite?.trim?.() &&
    !p.pontosPrestigio?.trim?.() &&
    !p.patenteTexto?.trim?.() &&
    !p.anotacoes?.trim() &&
    descricaoVazia
  );
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

/** Procura um poder pelo nome em `personagem.habilidades` (lista de texto livre — não há id). */
export function temPoder(personagem, nome) {
  const alvo = nome.trim().toLowerCase();
  return (personagem.habilidades || []).some((h) => (h.nome || '').trim().toLowerCase() === alvo);
}
