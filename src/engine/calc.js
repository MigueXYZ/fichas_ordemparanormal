import { PERICIAS, GRAUS_TREINO } from '../data/pericias.js';
import { CLASSES_POR_ID } from '../data/classes.js';
import { PATENTES_POR_ID, CATEGORIAS, categoriaRomana, patentePorPrestigio } from '../data/patentes.js';
import { PROGRESSAO_PD, ALTERACOES_GERAIS } from '../data/regrasOpcionais.js';

// NEX: 5% é o nível inicial, sobe de 5 em 5 até 95% e termina em 99%.
export const NEX_TRACK = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99];

/**
 * O NEX pode ser escrito à mão (há origens e eventos que dão 1%, 2% ou 3% de
 * cada vez). As contas usam sempre o degrau da tabela imediatamente ABAIXO do
 * valor escrito: 8% conta como 5%, 23% como 20%, 97% como 95%.
 */
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

/** Quantas vezes a progressão "por NEX" já foi aplicada (0 em NEX 5%). */
export function passosNex(nex) {
  return nexIndex(nex);
}

/**
 * O NEX que manda nas contas.
 * Com a regra opcional "NEX & Experiência" (Sobrevivendo ao Horror, p. 98) o
 * NEX passa a medir só a exposição ao Outro Lado e é o NÍVEL que define
 * benefícios, habilidades e trilhas — 1 nível = 5% de NEX.
 */
export function nexEfetivo(personagem) {
  if (personagem?.regras?.nivelSeparado) {
    const nivel = Math.max(1, Math.min(Number(personagem.nivel) || 1, NEX_TRACK.length));
    return NEX_TRACK[nivel - 1];
  }
  return degrauNex(personagem?.nex);
}

/** Grau de treino máximo permitido pelo NEX atual. */
export function grauMaximoPorNex(nex) {
  const n = Number(nex) || 5;
  let max = GRAUS_TREINO[0];
  for (const g of GRAUS_TREINO) if (n >= g.nexMinimo) max = g;
  return max;
}

export function bonusGrau(grauId) {
  return GRAUS_TREINO.find((g) => g.id === grauId)?.bonus ?? 0;
}

// ---------- Atributos ----------

/**
 * Pontos gastos na compra de atributos, segundo a regra de criação:
 * todos começam a 1; subir custa 1 ponto por ponto; baixar até 0 devolve 1.
 */
export function pontosGastos(atributos) {
  return Object.values(atributos).reduce((soma, v) => soma + (Number(v) - 1), 0);
}

export function pontosRestantes(atributos, pontosTotais = 4) {
  return pontosTotais - pontosGastos(atributos);
}

// ---------- Recursos (PV / SAN / PE) ----------

function calcRecurso(regra, atributos, nex) {
  if (!regra) return 0;
  const passos = passosNex(nex);
  const base = regra.inicial + (regra.somaAtributo ? Number(atributos[regra.somaAtributo] || 0) : 0);
  const porNex = regra.porNex + (regra.porNexSomaAtributo ? Number(atributos[regra.porNexSomaAtributo] || 0) : 0);
  return base + porNex * passos;
}

/** NEX 35% da regra de exposição: o atributo escolhido soma-se ao total de PE. */
function bonusPeExposicao(personagem) {
  if (!personagem?.regras?.nivelSeparado) return 0;
  if ((Number(personagem.nex) || 0) < 35) return 0;
  const attr = personagem.exposicao?.atributo35;
  return attr ? Number(personagem.atributos?.[attr] || 0) : 0;
}

export function calcMaximos(personagem) {
  const classe = CLASSES_POR_ID[personagem.classeId];
  const a = personagem.atributos;
  const nex = nexEfetivo(personagem);
  const semSanidade = Boolean(personagem.regras?.semSanidade);
  if (!classe) return { pv: 0, san: 0, pe: 0, pd: 0, semSanidade };

  const pv = calcRecurso(classe.progressao.pv, a, nex) + Number(personagem.pvExtra || 0);

  // Regra opcional "Jogando sem Sanidade": Sanidade e Esforço fundem-se em
  // Pontos de Determinação (Sobrevivendo ao Horror, p. 104).
  if (semSanidade) {
    const pd = calcRecurso(PROGRESSAO_PD[classe.id], a, nex) + Number(personagem.pdExtra || 0) + bonusPeExposicao(personagem);
    return { pv, san: 0, pe: 0, pd, semSanidade: true };
  }

  return {
    pv,
    san: calcRecurso(classe.progressao.san, a, nex) + Number(personagem.sanExtra || 0),
    pe: calcRecurso(classe.progressao.pe, a, nex) + Number(personagem.peExtra || 0) + bonusPeExposicao(personagem),
    pd: 0,
    semSanidade: false,
  };
}

/**
 * Limite de PE (ou PD) gastos por rodada = NEX a dividir por 5, mínimo 1.
 * Aceita tanto o personagem como um número solto.
 */
export function calcPePorRodada(personagemOuNex) {
  const nex = typeof personagemOuNex === 'object' && personagemOuNex !== null
    ? nexEfetivo(personagemOuNex)
    : degrauNex(personagemOuNex);
  return Math.max(1, Math.floor(nex / 5));
}

// ---------- Defesa ----------

export function calcDefesa(personagem) {
  return (
    10 +
    Number(personagem.atributos.agi || 0) +
    Number(personagem.defesaEquipamento || 0) +
    Number(personagem.defesaOutros || 0)
  );
}

/**
 * Bloqueio e Esquiva são ações especiais de defesa (Livro Base, cap. 4):
 *  - Bloqueio: só se treinado em Fortitude. Dá RD igual ao bónus de Fortitude.
 *  - Esquiva: só se treinado em Reflexos. Soma o bónus de Reflexos à Defesa.
 * Ambos aceitam um extra manual para casos que as regras não cobrem.
 */
export function calcDefesas(personagem) {
  const pericias = calcPericias(personagem);
  const bonusDe = (id) => pericias.find((p) => p.id === id) || { treino: 0, bonus: 0 };
  const fortitude = bonusDe('fortitude');
  const reflexos = bonusDe('reflexos');
  const defesa = calcDefesa(personagem);

  // O jogador pode escrever o valor à mão (há poderes e situações que fogem à
  // fórmula). Se `bloqueioManual`/`esquivaManual` estiverem preenchidos, mandam eles.
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

// ---------- Perícias ----------

/**
 * Alterações por exposição já atingidas (só com a regra "NEX & Experiência").
 * Contam pelo NEX escrito, que aí passa a medir mesmo a exposição.
 */
export function alteracoesAtingidas(personagem) {
  if (!personagem?.regras?.nivelSeparado) return [];
  const nex = Number(personagem.nex) || 0;
  return ALTERACOES_GERAIS.filter((a) => nex >= a.nex);
}

/**
 * Devolve, para cada perícia: dados (= valor do atributo), bónus de treino,
 * bónus "outros", penalidade de carga e o bónus total.
 */
export function calcPericias(personagem) {
  // a penalidade por sobrecarga é automática; `penalidadeCarga` soma-se a ela
  const carga = calcCarga(personagem);
  const penalidadeCarga = carga.penalidade + (Number(personagem.penalidadeCarga) || 0);

  // alterações por exposição (Sobrevivendo ao Horror, p. 99)
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
    // há poderes que trocam o atributo-base de uma perícia; `attr` guarda a troca
    const attr = estado.attr || p.attr;
    const exposicao =
      (ocultismoLivre && p.id === 'ocultismo' && treino > 0 ? 2 : 0) -
      (penalizadas.has(p.id) ? 5 : 0);
    const desbloqueada = ocultismoLivre && p.id === 'ocultismo';
    return {
      ...p,
      attr,
      attrPadrao: p.attr,
      attrTrocado: attr !== p.attr,
      grau: estado.grau,
      dados: Number(personagem.atributos[attr] || 0),
      treino,
      outros,
      penalidade,
      exposicao,
      bonus: treino + outros + exposicao - penalidade,
      bloqueada: p.treinada && treino === 0 && !desbloqueada,
    };
  });
}

// ---------- Perícias concedidas pela classe ----------

/**
 * Quantas perícias a classe deixa escolher: as fixas, as escolhas entre pares
 * (ex.: Luta ou Pontaria) e as livres (ex.: 1 + Intelecto).
 */
export function orcamentoPericias(personagem) {
  const classe = CLASSES_POR_ID[personagem.classeId];
  if (!classe?.pericias) return { obrigatorias: [], escolhas: [], livres: 0, nota: '' };
  const p = classe.pericias;
  const livres = p.livres
    ? Number(p.livres.base || 0) + (p.livres.somaAtributo ? Number(personagem.atributos[p.livres.somaAtributo] || 0) : 0)
    : 0;
  return {
    obrigatorias: p.obrigatorias || [],
    escolhas: p.escolhas || [],
    livres,
    nota: p.nota || '',
  };
}

// ---------- Carga ----------

/**
 * Capacidade de carga (Livro Base, cap. 3): 5 espaços por ponto de Força.
 * Com Força 0 são apenas 2 espaços. Passar do limite deixa-te sobrecarregado
 * (–5 em Defesa e em perícias com penalidade de carga, –3m de deslocamento) e
 * não podes passar do dobro do limite.
 */
/** Itens que aumentam o limite de carga em vez de o gastar (ex.: Mochila Militar). */
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

/** Espaços ocupados pelas armas. Uma arma pesa quer esteja na mão quer na mochila. */
export function espacosDasArmas(personagem) {
  return (personagem.ataques || []).reduce((t, a) => t + (Number(a.espacos) || 0), 0);
}

export function calcCarga(personagem) {
  const max = calcCargaMaxima(personagem);
  const dosItens = (personagem.inventario || []).reduce((t, i) => t + (Number(i.espacos) || 0), 0);
  const dasArmas = espacosDasArmas(personagem);
  const usados = dosItens + dasArmas;
  return {
    usados,
    dosItens,
    dasArmas,
    max,
    bonus: bonusDeCarga(personagem),
    limiteAbsoluto: max * 2,
    sobrecarregado: usados > max,
    excedido: usados > max * 2,
    penalidade: usados > max ? 5 : 0,
    deslocamento: usados > max ? -3 : 0,
  };
}

// ---------- Patente ----------

/** Quantos itens de cada categoria a patente permite e quantos já estão usados. */
export function calcItensPorCategoria(personagem) {
  const patente = PATENTES_POR_ID[personagem.patenteId] || patentePorPrestigio(personagem.pontosPrestigio);
  const usados = { 0: 0, I: 0, II: 0, III: 0, IV: 0 };
  for (const item of personagem.inventario || []) {
    const cat = categoriaRomana(item.categoria);
    if (cat) usados[cat] = (usados[cat] || 0) + 1;
  }
  const linhas = CATEGORIAS.map((cat) => ({
    categoria: cat,
    limite: cat === '0' ? Infinity : patente.itens[cat] ?? 0,
    usados: usados[cat] || 0,
  }));
  return { patente, linhas, excedeu: linhas.some((l) => l.usados > l.limite) };
}
