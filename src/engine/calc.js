import { PERICIAS, GRAUS_TREINO } from '../data/pericias.js';
import { CLASSES_POR_ID } from '../data/classes.js';
import { PATENTES_POR_ID, CATEGORIAS, categoriaRomana, patentePorPrestigio } from '../data/patentes.js';

// NEX: 5% é o nível inicial, sobe de 5 em 5 até 95% e termina em 99%.
export const NEX_TRACK = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99];

export function nexIndex(nex) {
  const i = NEX_TRACK.indexOf(Number(nex));
  return i < 0 ? 0 : i;
}

/** Quantas vezes a progressão "por NEX" já foi aplicada (0 em NEX 5%). */
export function passosNex(nex) {
  return nexIndex(nex);
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

export function calcMaximos(personagem) {
  const classe = CLASSES_POR_ID[personagem.classeId];
  const a = personagem.atributos;
  const nex = personagem.nex;
  if (!classe) return { pv: 0, san: 0, pe: 0 };
  return {
    pv: calcRecurso(classe.progressao.pv, a, nex) + Number(personagem.pvExtra || 0),
    san: calcRecurso(classe.progressao.san, a, nex) + Number(personagem.sanExtra || 0),
    pe: calcRecurso(classe.progressao.pe, a, nex) + Number(personagem.peExtra || 0),
  };
}

/** Limite de PE gastos por rodada = valor do NEX dividido por 5 (mínimo 1). */
export function calcPePorRodada(nex) {
  return Math.max(1, Math.floor(Number(nex) / 5));
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

  return {
    defesa,
    bloqueio: {
      disponivel: fortitude.treino > 0,
      valor: fortitude.bonus + Number(personagem.bloqueioExtra || 0),
      base: fortitude.bonus,
      formula: 'RD = bónus de Fortitude',
      requisito: 'Precisa de treino em Fortitude',
    },
    esquiva: {
      disponivel: reflexos.treino > 0,
      valor: defesa + reflexos.bonus + Number(personagem.esquivaExtra || 0),
      base: reflexos.bonus,
      formula: 'Defesa + bónus de Reflexos',
      requisito: 'Precisa de treino em Reflexos',
    },
  };
}

// ---------- Perícias ----------

/**
 * Devolve, para cada perícia: dados (= valor do atributo), bónus de treino,
 * bónus "outros", penalidade de carga e o bónus total.
 */
export function calcPericias(personagem) {
  // a penalidade por sobrecarga é automática; `penalidadeCarga` soma-se a ela
  const carga = calcCarga(personagem);
  const penalidadeCarga = carga.penalidade + (Number(personagem.penalidadeCarga) || 0);
  return PERICIAS.map((p) => {
    const estado = personagem.pericias?.[p.id] || { grau: 'destreinado', outros: 0 };
    const treino = bonusGrau(estado.grau);
    const outros = Number(estado.outros || 0);
    const penalidade = p.carga ? penalidadeCarga : 0;
    // há poderes que trocam o atributo-base de uma perícia; `attr` guarda a troca
    const attr = estado.attr || p.attr;
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
      bonus: treino + outros - penalidade,
      bloqueada: p.treinada && treino === 0,
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
export function calcCargaMaxima(personagem) {
  const forca = Number(personagem.atributos.for || 0);
  return forca <= 0 ? 2 : forca * 5;
}

export function calcCarga(personagem) {
  const max = calcCargaMaxima(personagem);
  const usados = (personagem.inventario || []).reduce((t, i) => t + (Number(i.espacos) || 0), 0);
  return {
    usados,
    max,
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
