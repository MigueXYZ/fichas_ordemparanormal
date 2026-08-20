import { PERICIAS, GRAUS_TREINO } from '../data/pericias.js';
import { CLASSES_POR_ID } from '../data/classes.js';
import { PATENTES_POR_ID, CATEGORIAS, categoriaRomana, patentePorPrestigio } from '../data/patentes.js';
import { PROGRESSAO_PD, ALTERACOES_GERAIS } from '../data/regrasOpcionais.js';

export const NEX_TRACK = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99];

export function degrauNex(nex) {
  const n = Number(nex);
  if (!Number.isFinite(n)) return NEX_TRACK[0];
  let degrau = NEX_TRACK[0];
  for (const v of NEX_TRACK) if (n >= v) degrau = v;
  return degrau;
}

export function nexIndex(nex) {
  return NEX_TRACK.indexOf(degrauNex(nex));
}

export function passosNex(nex) {
  return nexIndex(nex);
}

export function nexEfetivo(personagem) {
  if (personagem?.regras?.nivelSeparado) {
    const nivel = Math.max(1, Math.min(Number(personagem.nivel) || 1, NEX_TRACK.length));
    return NEX_TRACK[nivel - 1];
  }
  return degrauNex(personagem?.nex);
}

export function grauMaximoPorNex(nex) {
  const n = Number(nex) || 5;
  let max = GRAUS_TREINO[0];
  for (const g of GRAUS_TREINO) if (n >= g.nexMinimo) max = g;
  return max;
}

export function bonusGrau(grauId) {
  return GRAUS_TREINO.find((g) => g.id === grauId)?.bonus ?? 0;
}

export function pontosGastos(atributos) {
  return Object.values(atributos).reduce((soma, v) => soma + (Number(v) - 1), 0);
}

export function pontosRestantes(atributos, pontosTotais = 4) {
  return pontosTotais - pontosGastos(atributos);
}

function calcRecurso(regra, atributos, nex) {
  if (!regra) return 0;
  const passos = passosNex(nex);
  const base = regra.inicial + (regra.somaAtributo ? Number(atributos[regra.somaAtributo] || 0) : 0);
  const porNex = regra.porNex + (regra.porNexSomaAtributo ? Number(atributos[regra.porNexSomaAtributo] || 0) : 0);
  return base + porNex * passos;
}

function bonusPeExposicao(personagem) {
  if (!personagem?.regras?.nivelSeparado) return 0;
  if ((Number(personagem.nex) || 0) < 35) return 0;
  const attr = personagem.exposicao?.atributo35;
  return attr ? Number(personagem.atributos?.[attr] || 0) : 0;
}

export function calcMaximos(personagem) {
  const classe = CLASSES_POR_ID[personagem.classeId];
  
  const a = { ...(personagem.atributos || {}) };
  if (personagem.monstruosoAtivo) {
    const el = personagem.monstruosoElemento;
    if (el === 'Sangue') a.pre = a.for;
    else if (el === 'Morte') a.pre = a.vig;
    else if (el === 'Conhecimento') a.pre = a.int;
    else if (el === 'Energia') a.pre = a.agi;
  }

  const nex = nexEfetivo(personagem);
  const semSanidade = Boolean(personagem.regras?.semSanidade);
  if (!classe) return { pv: 0, san: 0, pe: 0, pd: 0, semSanidade };

  const manual = (v) => (v === null || v === undefined || v === '' ? null : Number(v));
  
  const pvManual = manual(personagem.pvMaxManual);
  const sanManual = manual(personagem.sanMaxManual);
  const peManual = manual(personagem.peMaxManual);

  const pvAuto = calcRecurso(classe.progressao.pv, a, nex) + Number(personagem.pvExtra || 0);
  const pv = pvManual !== null ? pvManual : pvAuto;

  if (semSanidade) {
    const pdAuto = calcRecurso(PROGRESSAO_PD[classe.id], a, nex) + Number(personagem.pdExtra || 0) + bonusPeExposicao(personagem);
    const pd = pdAuto;
    return { pv, san: 0, pe: 0, pd, semSanidade: true };
  }

  const sanAuto = calcRecurso(classe.progressao.san, a, nex) + Number(personagem.sanExtra || 0);
  const peAuto = calcRecurso(classe.progressao.pe, a, nex) + Number(personagem.peExtra || 0) + bonusPeExposicao(personagem);

  return {
    pv,
    san: sanManual !== null ? sanManual : sanAuto,
    pe: peManual !== null ? peManual : peAuto,
    pd: 0,
    semSanidade: false,
  };
}

export function calcPePorRodada(personagemOuNex) {
  const nex = typeof personagemOuNex === 'object' && personagemOuNex !== null
    ? nexEfetivo(personagemOuNex)
    : degrauNex(personagemOuNex);
  return Math.max(1, Math.floor(nex / 5));
}

import { CONDICOES_POR_ID } from '../data/condicoes.js';

export function calcPenalidadesCondicoes(personagem) {
  const conds = (personagem?.condicoes || []).map((id) => CONDICOES_POR_ID[id]).filter(Boolean);
  let penalidadeDefesa = 0;
  let dadosGeral = 0;
  const dadosAttr = { for: 0, agi: 0, int: 0, pre: 0, vig: 0 };
  const dadosPericia = {};
  let deslocamentoEfeito = 'normal';

  for (const c of conds) {
    const ef = c.efeitos || {};
    if (ef.defesa) penalidadeDefesa += ef.defesa;
    if (ef.dadosGeral) dadosGeral += ef.dadosGeral;
    if (ef.dadosAttr) {
      for (const [atr, val] of Object.entries(ef.dadosAttr)) {
        if (dadosAttr[atr] !== undefined) dadosAttr[atr] += val;
      }
    }
    if (ef.dadosPericia) {
      for (const [per, val] of Object.entries(ef.dadosPericia)) {
        dadosPericia[per] = (dadosPericia[per] || 0) + val;
      }
    }
    if (ef.deslocamento === 'zero') deslocamentoEfeito = 'zero';
    else if (ef.deslocamento === 1.5 && deslocamentoEfeito !== 'zero') deslocamentoEfeito = 1.5;
    else if (ef.deslocamento === 'metade' && deslocamentoEfeito === 'normal') deslocamentoEfeito = 'metade';
  }

  return { condicoes: conds, penalidadeDefesa, dadosGeral, dadosAttr, dadosPericia, deslocamentoEfeito };
}

export function calcDeslocamento(personagem) {
  const conds = calcPenalidadesCondicoes(personagem);
  const base = Number(personagem?.deslocamento) || 9;
  const carga = calcCarga(personagem);
  const aposCarga = Math.max(0, base - (carga.sobrecarregado ? 3 : 0));

  let finalDesloc = aposCarga;
  if (conds.deslocamentoEfeito === 'zero') finalDesloc = 0;
  else if (conds.deslocamentoEfeito === 1.5) finalDesloc = 1.5;
  else if (conds.deslocamentoEfeito === 'metade') finalDesloc = Math.max(0, Math.floor((aposCarga / 2) / 1.5) * 1.5);

  if (personagem.monstruosoAtivo && personagem.monstruosoElemento === 'Energia') {
    finalDesloc += 6; // Bónus fixo de +6 metros para Energia
  }
  return finalDesloc;
}

export function calcDefesa(personagem) {
  const conds = calcPenalidadesCondicoes(personagem);
  const carga = calcCarga(personagem);
  const penalidadeCarga = carga.sobrecarregado ? -5 : 0;
  return (
    10 +
    Number(personagem.atributos.agi || 0) +
    Number(personagem.defesaEquipamento || 0) +
    Number(personagem.defesaOutros || 0) +
    conds.penalidadeDefesa +
    penalidadeCarga
  );
}

export function calcDefesas(personagem) {
  const pericias = calcPericias(personagem);
  const bonusDe = (id) => pericias.find((p) => p.id === id) || { treino: 0, bonus: 0 };
  const fortitude = bonusDe('fortitude');
  const reflexos = bonusDe('reflexos');
  const defesa = calcDefesa(personagem);

  const manual = (v) => (v === null || v === undefined || v === '' ? null : Number(v));
  const bloqueioManual = manual(personagem.bloqueioManual);
  const esquivaManual = manual(personagem.esquivaManual);

  const bloqueioAuto = fortitude.bonus + Number(personagem.bloqueioExtra || 0);
  const esquivaAuto = defesa + reflexos.bonus + Number(personagem.esquivaExtra || 0);

  return {
    defesa,
    bloqueio: {
      disponivel: bloqueioManual !== null || fortitude.treino > 0,
      manual: bloqueioManual !== null,
      valor: bloqueioManual !== null ? bloqueioManual : bloqueioAuto,
      auto: bloqueioAuto,
      base: fortitude.bonus,
      formula: 'RD = bónus de Fortitude',
      requisito: 'Precisa de treino em Fortitude (ou escreve o valor à mão)',
    },
    esquiva: {
      disponivel: esquivaManual !== null || reflexos.treino > 0,
      manual: esquivaManual !== null,
      valor: esquivaManual !== null ? esquivaManual : esquivaAuto,
      auto: esquivaAuto,
      base: reflexos.bonus,
      formula: 'Defesa + bónus de Reflexos',
      requisito: 'Precisa de treino em Reflexos (ou escreve o valor à mão)',
    },
  };
}

export function alteracoesAtingidas(personagem) {
  if (!personagem?.regras?.nivelSeparado) return [];
  const nex = Number(personagem.nex) || 0;
  return ALTERACOES_GERAIS.filter((a) => nex >= a.nex);
}

export function calcPericias(personagem) {
  const carga = calcCarga(personagem);
  const penalidadeCarga = carga.penalidade + (Number(personagem.penalidadeCarga) || 0);
  const conds = calcPenalidadesCondicoes(personagem);

  const atingidas = alteracoesAtingidas(personagem).map((a) => a.id);
  const exp = personagem.exposicao || {};
  const ocultismoLivre = atingidas.includes('p25');
  const penalizadas = new Set([
    ocultismoLivre ? exp.penalidade25 : null,
    atingidas.includes('p35') ? exp.penalidade35 : null,
  ].filter(Boolean));

  return PERICIAS.map((p) => {
    const estado = personagem.pericias?.[p.id] || { grau: 'destreinado', outros: 0 };
    const treino = bonusGrau(estado.grau);
    const outros = Number(estado.outros || 0);
    const penalidade = p.carga ? penalidadeCarga : 0;
    const attr = estado.attr || p.attr;
    const exposicao =
      (ocultismoLivre && p.id === 'ocultismo' && treino > 0 ? 2 : 0) -
      (penalizadas.has(p.id) ? 5 : 0);
    const desbloqueada = ocultismoLivre && p.id === 'ocultismo';

    const dadosBase = Number(personagem.atributos[attr] || 0);
    const penalidadeDados = conds.dadosGeral + (conds.dadosAttr[attr] || 0) + (conds.dadosPericia[p.id] || 0);
    const dados = Math.max(0, dadosBase + penalidadeDados);

    return {
      ...p, attr, attrPadrao: p.attr, attrTrocado: attr !== p.attr,
      grau: estado.grau, dados, dadosBase, treino, outros, penalidade, exposicao,
      bonus: treino + outros + exposicao - penalidade,
      bloqueada: p.treinada && treino === 0 && !desbloqueada,
    };
  });
}

export function orcamentoPericias(personagem) {
  const classe = CLASSES_POR_ID[personagem.classeId];
  if (!classe?.pericias) return { obrigatorias: [], escolhas: [], livres: 0, nota: '' };
  const p = classe.pericias;
  const livres = p.livres
    ? Number(p.livres.base || 0) + (p.livres.somaAtributo ? Number(personagem.atributos[p.livres.somaAtributo] || 0) : 0)
    : 0;
  return { obrigatorias: p.obrigatorias || [], escolhas: p.escolhas || [], livres, nota: p.nota || '' };
}

export function bonusDeCarga(personagem) {
  const doInventario = (personagem.inventario || [])
    .reduce((t, i) => t + (Number(i.cargaBonus) || 0), 0);
  return doInventario + (Number(personagem.cargaExtra) || 0);
}

export function calcCargaMaxima(personagem) {
  const forca = Number(personagem.atributos.for || 0);
  const base = forca <= 0 ? 2 : forca * 5;
  return base + bonusDeCarga(personagem);
}

export function espacosDasArmas(personagem) {
  return (personagem.ataques || []).reduce((t, a) => t + (Number(a.espacos) || 0), 0);
}

export function calcCarga(personagem) {
  const max = calcCargaMaxima(personagem);
  const dosItens = (personagem.inventario || []).reduce((t, i) => t + (Number(i.espacos) || 0), 0);
  const dasArmas = espacosDasArmas(personagem);
  const usados = dosItens + dasArmas;
  return {
    usados, dosItens, dasArmas, max, bonus: bonusDeCarga(personagem),
    limiteAbsoluto: max * 2, sobrecarregado: usados > max, excedido: usados > max * 2,
    penalidade: usados > max ? 5 : 0, deslocamento: usados > max ? -3 : 0,
  };
}

export function calcItensPorCategoria(personagem) {
  const patente = PATENTES_POR_ID[personagem.patenteId] || patentePorPrestigio(personagem.pontosPrestigio);
  const usados = { 0: 0, I: 0, II: 0, III: 0, IV: 0 };
  for (const item of personagem.inventario || []) {
    const cat = categoriaRomana(item.categoria);
    if (cat) usados[cat] = (usados[cat] || 0) + 1;
  }
  const linhas = CATEGORIAS.map((cat) => ({
    categoria: cat, limite: cat === '0' ? Infinity : patente.itens[cat] ?? 0, usados: usados[cat] || 0,
  }));
  return { patente, linhas, excedeu: linhas.some((l) => l.usados > l.limite) };
}