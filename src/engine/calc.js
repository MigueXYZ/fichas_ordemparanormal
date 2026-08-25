import { PERICIAS, GRAUS_TREINO } from '../data/pericias.js';
import { CLASSES_POR_ID } from '../data/classes.js';
import { PATENTES_POR_ID, CATEGORIAS, categoriaRomana, patentePorPrestigio } from '../data/patentes.js';
import { PROGRESSAO_PD, ALTERACOES_GERAIS } from '../data/regrasOpcionais.js';
import {
  efeitosDiarios as efeitosDiariosMonstruoso, atributosEfetivos as atributosEfetivosMonstruoso,
  periciasTreinadasAtivas as periciasTreinadasAtivasMonstruoso, resistenciaTextoAtual as resistenciaTextoAtualMonstruoso,
  elementoAtual as elementoAtualMonstruoso, classeMonstruosa, efetivamenteAtivo as efetivamenteAtivoMonstruoso,
  patamarAtual as patamarAtualMonstruoso,
} from './monstruoso.js';
import { ATRIBUTO_DO_ELEMENTO } from '../data/monstruoso.js';
import { PROTECOES } from '../data/itens.js';

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
  const nex = nexEfetivo(personagem);

  // Trilha do Monstruoso: enquanto a etapa ritualística de hoje estiver em
  // efeito (ou o Combatente já tiver tudo permanente, aos 99%), os atributos
  // já vêm com os bónus/penalidades da trilha somados (atributosEfetivos), e
  // o atributo do elemento escolhido pode substituir Presença para calcular
  // PE (a partir de que patamar depende da classe — ver data/monstruoso.js).
  // Ver engine/monstruoso.js (efeitosDiarios/atributosEfetivos) para a regra.
  const efMonstruoso = efeitosDiariosMonstruoso(personagem, nex);

  const a = atributosEfetivosMonstruoso(personagem, nex);
  if (efMonstruoso.peAtributo) a.pre = a[efMonstruoso.peAtributo];

  const semSanidade = Boolean(personagem.regras?.semSanidade);
  if (!classe) return { pv: 0, san: 0, pe: 0, pd: 0, semSanidade };

  // Os máximos de PV/Sanidade/Esforço são SEMPRE calculados automaticamente
  // (Vigor/Presença efetivos, Trilha do Monstruoso, NEX, etc. — tudo ao
  // vivo, nunca precisa de intervenção manual). Um ajuste fixo por talento,
  // item ou maldição soma-se por cima com pvExtra/sanExtra/peExtra — nunca
  // substitui o automático, para nunca "prender" o máximo desatualizado.
  const pv = calcRecurso(classe.progressao.pv, a, nex) + Number(personagem.pvExtra || 0);

  if (semSanidade) {
    const pd = calcRecurso(PROGRESSAO_PD[classe.id], a, nex) + Number(personagem.pdExtra || 0) + bonusPeExposicao(personagem);
    return { pv, san: 0, pe: 0, pd, semSanidade: true };
  }

  const san = calcRecurso(classe.progressao.san, a, nex) + Number(personagem.sanExtra || 0);
  const pe = calcRecurso(classe.progressao.pe, a, nex) + Number(personagem.peExtra || 0) + bonusPeExposicao(personagem);

  return { pv, san, pe, pd: 0, semSanidade: false };
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
  const flatPericia = {};
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

  // Trilha do Monstruoso: penalidades/bónus de perícia da etapa de hoje.
  // Dado (pool) e número plano (flat) são coisas diferentes — ver o
  // cabeçalho de engine/monstruoso.js — por isso vêm em sacos separados.
  const nex = nexEfetivo(personagem);
  const efMonstruoso = efeitosDiariosMonstruoso(personagem, nex);
  for (const [per, val] of Object.entries(efMonstruoso.dadosPericia)) {
    dadosPericia[per] = (dadosPericia[per] || 0) + val;
  }
  for (const [per, val] of Object.entries(efMonstruoso.flatPericia)) {
    flatPericia[per] = (flatPericia[per] || 0) + val;
  }
  if (efMonstruoso.defesaExtra) penalidadeDefesa += efMonstruoso.defesaExtra;

  return { condicoes: conds, penalidadeDefesa, dadosGeral, dadosAttr, dadosPericia, flatPericia, deslocamentoEfeito, monstruoso: efMonstruoso };
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

  finalDesloc += conds.monstruoso.deslocamentoExtra || 0;
  return finalDesloc;
}

/**
 * Bónus de Defesa das Proteções marcadas (checkboxes de `personagem.protecao`
 * — ids de `PROTECOES`, ver data/itens/geral.js). Substitui o antigo campo
 * "Equipamento" escrito à mão: a Defesa passa a somar sozinha o que a
 * Proteção Leve/Pesada/Escudo já dá no livro, sem precisar de intervenção
 * manual — ao contrário do Bloqueio/Esquiva, a Defesa não tem um valor à
 * mão que substitua o cálculo.
 */
export function defesaDasProtecoes(personagem) {
  const marcadas = Array.isArray(personagem.protecao) ? personagem.protecao : [];
  return PROTECOES
    .filter((p) => marcadas.includes(p.id))
    .reduce((total, p) => total + (Number(p.defesa) || 0), 0);
}

export function calcDefesa(personagem) {
  const conds = calcPenalidadesCondicoes(personagem);
  const carga = calcCarga(personagem);
  const penalidadeCarga = carga.sobrecarregado ? -5 : 0;
  const nex = nexEfetivo(personagem);
  const a = atributosEfetivosMonstruoso(personagem, nex);
  return (
    10 +
    Number(a.agi || 0) +
    defesaDasProtecoes(personagem) +
    Number(personagem.defesaOutros || 0) +
    conds.penalidadeDefesa +
    penalidadeCarga
  );
}

/**
 * DT para resistir a um ritual — "calculada como a DT de qualquer
 * habilidade... usando como atributo Presença" (Livro Base, pág. 78):
 * 10 + bónus de NEX (posição no NEX_TRACK, 1 no 1º degrau 5% até 20 no
 * último 99%) + Presença. Ex.: Presença 3, NEX 5% -> 14 (10+1+3);
 * Presença 5, NEX 99% -> 35 (10+20+5).
 */
export function calcDtRitual(personagem) {
  return detalheDtRitual(personagem).total;
}

/** Mesmo cálculo de `calcDtRitual`, mas devolve as parcelas para mostrar a conta (tooltip). */
export function detalheDtRitual(personagem) {
  const nex = nexEfetivo(personagem);
  const a = atributosEfetivosMonstruoso(personagem, nex);
  const bonusNex = nexIndex(nex) + 1;
  // Especialista/Ocultista da Trilha do Monstruoso, desde os 10%: o atributo
  // do elemento escolhido passa a valer no lugar de Presença — não só para
  // os PE (já automatizado em calcMaximos), mas também para a DT dos
  // rituais (ver PE_POR_ATRIBUTO_DESDE em data/monstruoso.js — mesmo
  // patamar, mesmo atributo, é a mesma regra a aplicar-se a duas contas).
  const atributoDt = efeitosDiariosMonstruoso(personagem, nex).peAtributo;
  const presenca = Number((atributoDt ? a[atributoDt] : a.pre) || 0);
  return { nex, bonusNex, presenca, atributoDt, total: 10 + bonusNex + presenca };
}

export function calcDefesas(personagem) {
  const pericias = calcPericias(personagem);
  const bonusDe = (id) => pericias.find((p) => p.id === id) || { treino: 0, bonus: 0 };
  const fortitude = bonusDe('fortitude');
  const reflexos = bonusDe('reflexos');
  const defesaAuto = calcDefesa(personagem);
  const nex = nexEfetivo(personagem);

  const manual = (v) => (v === null || v === undefined || v === '' ? null : Number(v));
  const defesaManual = manual(personagem.defesaManual);
  const defesa = defesaManual !== null ? defesaManual : defesaAuto;
  const bloqueioManual = manual(personagem.bloqueioManual);
  const esquivaManual = manual(personagem.esquivaManual);

  // RD da Trilha do Monstruoso: só a do Especialista-Sangue (drenagem "Ser
  // Testado", 40%+) é GERAL (o livro não lhe associa nenhum tipo de dano —
  // só o dano extra é "de Sangue", a resistência em si cobre qualquer coisa)
  // — por isso é a única que soma a sério ao Bloqueio (que já É a RD desta
  // ficha). A do Combatente só cobre tipos específicos por elemento; como a
  // ficha não guarda tipos de dano, fica de fora da soma e aparece só como
  // nota (ver `trilhaTexto`), para não fingir que protege de tudo.
  const rdTrilhaGeral = efeitosDiariosMonstruoso(personagem, nex).resistenciaDano || 0;
  const trilhaTexto = resistenciaTextoAtualMonstruoso(personagem, nex);

  // Combatente-Energia (desde os 10%, "Ser Testado"): "soma sua Agilidade na
  // RD recebida por um bloqueio bem-sucedido" (data/classes/combatente.js) —
  // ao contrário da resistência elemental (que é só de tipos específicos e
  // fica de fora, ver nota acima), este bónus é geral e soma a sério ao
  // Bloqueio, tal como o bloqueioExtra manual.
  const agiBloqueioEnergia = (
    classeMonstruosa(personagem) === 'combatente'
    && elementoAtualMonstruoso(personagem) === 'Energia'
    && patamarAtualMonstruoso(nex) >= 10
    && efetivamenteAtivoMonstruoso(personagem, nex)
  ) ? Number(atributosEfetivosMonstruoso(personagem, nex).agi || 0) : 0;

  const bloqueioAuto = fortitude.bonus + Number(personagem.bloqueioExtra || 0) + rdTrilhaGeral + agiBloqueioEnergia;
  const esquivaAuto = defesa + reflexos.bonus + Number(personagem.esquivaExtra || 0);

  return {
    defesa,
    defesaAuto,
    defesaManual: defesaManual !== null,
    bloqueio: {
      disponivel: bloqueioManual !== null || fortitude.treino > 0 || rdTrilhaGeral > 0 || agiBloqueioEnergia > 0,
      manual: bloqueioManual !== null,
      valor: bloqueioManual !== null ? bloqueioManual : bloqueioAuto,
      auto: bloqueioAuto,
      base: fortitude.bonus,
      trilha: rdTrilhaGeral,
      trilhaTexto,
      agiEnergia: agiBloqueioEnergia,
      formula: 'RD = bónus de Fortitude'
        + (rdTrilhaGeral ? ` + ${rdTrilhaGeral} da Trilha do Monstruoso` : '')
        + (agiBloqueioEnergia ? ` + ${agiBloqueioEnergia} de Agilidade (Combatente-Energia)` : ''),
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

/** Posição de um grau na escala Destreinado < Treinado < Veterano < Expert (para comparar "sobe ou não"). */
function ordemGrau(grauId) {
  const idx = GRAUS_TREINO.findIndex((g) => g.id === grauId);
  return idx === -1 ? 0 : idx;
}

export function calcPericias(personagem) {
  const carga = calcCarga(personagem);
  const penalidadeCarga = carga.penalidade + (Number(personagem.penalidadeCarga) || 0);
  const conds = calcPenalidadesCondicoes(personagem);
  const nex = nexEfetivo(personagem);
  const a = atributosEfetivosMonstruoso(personagem, nex);
  // Treino concedido pela trilha do Monstruoso (Ocultismo desde 10%; e as
  // perícias livres do Especialista/Conhecimento, 2 desde 10% / 3 desde
  // 99%, essas também a Expert desde os 99%) — só está em efeito enquanto a
  // etapa de hoje está ativa (regra-mãe).
  const treinoMonstruoso = periciasTreinadasAtivasMonstruoso(personagem, nex);
  // "Soma o atributo em testes baseados nesse atributo" da drenagem "Ser
  // Testado" do Especialista-Conhecimento (40%+): é um dado FIXO somado ao
  // TOTAL do teste (não à pool), por isso não entra em `monstruoso`
  // (bónus plano) — aplica-se só às perícias cujo atributo em uso É o do
  // elemento (para Conhecimento, Intelecto), tal como o livro descreve
  // ("em testes baseados em Intelecto").
  const elementoMonstruoso = elementoAtualMonstruoso(personagem);
  const attrAlvoBonusGenerico = elementoMonstruoso ? ATRIBUTO_DO_ELEMENTO[elementoMonstruoso] : null;
  const bonusGenericoMonstruoso = conds.monstruoso.testeBonusDadoGenerico;

  const atingidas = alteracoesAtingidas(personagem).map((a) => a.id);
  const exp = personagem.exposicao || {};
  const ocultismoLivre = atingidas.includes('p25');
  const penalizadas = new Set([
    ocultismoLivre ? exp.penalidade25 : null,
    atingidas.includes('p35') ? exp.penalidade35 : null,
  ].filter(Boolean));

  return PERICIAS.map((p) => {
    const estado = personagem.pericias?.[p.id] || { grau: 'destreinado', outros: 0 };
    const treinoForcado = estado.grau === 'destreinado' && treinoMonstruoso.forcar.has(p.id);
    // Aos 99%, as perícias livres do Especialista-Conhecimento sobem a
    // Expert (a trilha substitui o próprio grau que ela deu em Ser
    // Experimentado) — nunca desce um grau que a jogadora já tenha a sério.
    const expertForcado = Boolean(treinoMonstruoso.expertForcado?.has(p.id)) && ordemGrau(estado.grau) < ordemGrau('expert');
    const grauEfetivo = expertForcado ? 'expert' : (treinoForcado ? 'treinado' : estado.grau);
    const treino = bonusGrau(grauEfetivo);
    const outros = Number(estado.outros || 0);
    const penalidade = p.carga ? penalidadeCarga : 0;
    // A trilha do Monstruoso pode trocar o atributo-chave de uma perícia
    // nomeada (ex.: Combatente Conhecimento 40%: Enganação passa a usar
    // Intelecto) — só quando a jogadora não trocou o atributo à mão.
    const attr = estado.attr || conds.monstruoso.atributoPericia?.[p.id] || p.attr;
    const exposicao =
      (ocultismoLivre && p.id === 'ocultismo' && treino > 0 ? 2 : 0) -
      (penalizadas.has(p.id) ? 5 : 0);
    const desbloqueada = ocultismoLivre && p.id === 'ocultismo';

    const dadosBase = Number(a[attr] || 0);
    const penalidadeDados = conds.dadosGeral + (conds.dadosAttr[attr] || 0) + (conds.dadosPericia[p.id] || 0);
    // NÃO fazer Math.max(0, ...) aqui: um atributo 0 (ou já negativo por
    // penalidade) que leva mais penalidade de dado tem de continuar a
    // descer — é isso que faz a pool de "pior de N" crescer em vez de
    // ficar sempre presa em 2 dados (ver quantidadeDados em engine/dados.js).
    const dados = dadosBase + penalidadeDados;
    const monstruoso = (conds.flatPericia[p.id] || 0) + (treinoMonstruoso.flatExtra[p.id] || 0);
    const dadosExtra = bonusGenericoMonstruoso && attr === attrAlvoBonusGenerico
      ? [`${bonusGenericoMonstruoso.quantidade}d${bonusGenericoMonstruoso.faces}`]
      : [];

    return {
      ...p, attr, attrPadrao: p.attr, attrTrocado: attr !== p.attr,
      grau: grauEfetivo, dados, dadosBase, treino, outros, penalidade, exposicao, monstruoso,
      treinadaPeloMonstruoso: treinoForcado, expertPeloMonstruoso: expertForcado,
      dadosExtra, dadosExtraDescricao: dadosExtra.length ? `Trilha do Monstruoso: +${bonusGenericoMonstruoso.quantidade}d${bonusGenericoMonstruoso.faces} ${bonusGenericoMonstruoso.descricao}` : null,
      bonus: treino + outros + exposicao + monstruoso - penalidade,
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
  const nex = nexEfetivo(personagem);
  const forca = Number(atributosEfetivosMonstruoso(personagem, nex).for || 0);
  const base = forca <= 0 ? 2 : forca * 5;
  return base + bonusDeCarga(personagem);
}

export function espacosDasArmas(personagem) {
  return (personagem.ataques || []).reduce((t, a) => t + (Number(a.espacos) || 0), 0);
}

export function calcCarga(personagem) {
  const max = calcCargaMaxima(personagem);
  const dosItens = (personagem.inventario || []).reduce((t, i) => t + (Number(i.espacos) || 0) * (Number(i.quantidade) || 1), 0);
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
    if (cat) usados[cat] = (usados[cat] || 0) + (Number(item.quantidade) || 1);
  }
  for (const arma of personagem.ataques || []) {
    const cat = categoriaRomana(arma.categoria);
    if (cat) usados[cat] = (usados[cat] || 0) + 1;
  }
  const linhas = CATEGORIAS.map((cat) => ({
    categoria: cat, limite: cat === '0' ? Infinity : patente.itens[cat] ?? 0, usados: usados[cat] || 0,
  }));
  return { patente, linhas, excedeu: linhas.some((l) => l.usados > l.limite) };
}