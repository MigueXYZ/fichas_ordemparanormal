import { calcPericias, calcPenalidadesCondicoes, nexEfetivo } from './calc.js';
import { aplicarModificacoes } from '../data/modificacoesArma.js';
import { atributosEfetivos } from './monstruoso.js';

/** Lê o crítico como vem nos livros: "x2", "19/x2", "19", "18/x3". */
export function interpretarCritico(texto) {
  const s = String(texto || '').toLowerCase().replace(/\s/g, '');
  const margem = s.match(/(\d{2})\s*(?:\/|$)/);
  const mult = s.match(/x\s*(\d)/);
  return {
    margem: margem ? Number(margem[1]) : 20,
    multiplicador: mult ? Number(mult[1]) : 2,
  };
}

/** Soma um dado do mesmo tipo à expressão de dano ("1d6" + 1 -> "2d6"). */
export function somarDados(expr, quantos) {
  const m = String(expr || '').replace(/\s/g, '').toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!m || !quantos) return expr;
  return `${Number(m[1] || 1) + quantos}d${m[2]}${m[3] || ''}`;
}

/**
 * Números finais de uma arma para este personagem: dados e bónus do teste de
 * ataque, expressão de dano já com modificações, margem de crítico e extras.
 */
export function estatisticasArma(personagem, arma) {
  const pericias = calcPericias(personagem);
  const p = pericias.find((x) => x.id === arma.pericia) || { dados: 1, bonus: 0, nome: '', attr: 'for' };
  const mods = aplicarModificacoes(arma);
  const conds = calcPenalidadesCondicoes(personagem);
  // Atributos "efetivos" (já com os bónus/penalidades ao vivo da Trilha do
  // Monstruoso somados) — para que uma Força/Agilidade concedida pela
  // trilha também conte nos testes de ataque e nas rolagens de dano.
  const atributosEf = atributosEfetivos(personagem, nexEfetivo(personagem));

  const critico = arma.margem
    ? { margem: Number(arma.margem), multiplicador: Number(arma.multiplicador) || 2 }
    : interpretarCritico(arma.critico);

  /*
   * Armas ágeis (Livro Base, "Habilidades de Armas"): facas, punhais, cajados,
   * nunchakus, floretes e katanas «permitem que você aplique sua Agilidade em
   * vez de sua Força em testes de ataque e rolagens de dano realizadas com elas».
   * Só faz diferença quando o teste ia mesmo por Força — se já trocaste o
   * atributo da perícia à mão, essa escolha manda.
   */
  const agilAtiva = Boolean(arma.agil) && p.attr === 'for';
  const atributoTeste = agilAtiva ? 'agi' : p.attr;

  let dadosAtaquePenalidade = 0;
  for (const c of conds.condicoes) {
    if (c.efeitos?.dadosAtaque) dadosAtaquePenalidade += c.efeitos.dadosAtaque;
    if (c.efeitos?.dadosAtaqueCorpoACorpo && arma.pericia === 'luta') {
      dadosAtaquePenalidade += c.efeitos.dadosAtaqueCorpoACorpo;
    }
  }

  let dados = p.dados;
  if (agilAtiva) {
    const dadosBaseAgi = Number(atributosEf.agi || 0);
    const penAgi = conds.dadosGeral + (conds.dadosAttr['agi'] || 0) + (conds.dadosPericia[arma.pericia] || 0);
    dados = Math.max(0, dadosBaseAgi + penAgi);
  }
  dados = Math.max(0, dados + dadosAtaquePenalidade);

  const atributoDano = agilAtiva && arma.atributoDano === 'for' ? 'agi' : arma.atributoDano;
  const bonusAtributoDano = atributoDano ? Number(atributosEf[atributoDano] || 0) : 0;

  // Dados extra somados ao TOTAL do teste de ataque (não à pool de d20) —
  // ex.: Especialista Sangue 65%+, "+1d8 em testes de ataques corpo a
  // corpo". "Corpo a corpo" aqui é a perícia de Luta (por oposição a
  // Pontaria); quem não pede "corpoACorpoApenas" soma sempre (ex.: o bónus
  // de Energia via drenagem, que é "em testes de ataque" sem restrição).
  const corpoACorpo = arma.pericia === 'luta';
  const dadosExtraAtaque = (conds.monstruoso.ataqueBonusDados || [])
    .filter((d) => !d.corpoACorpoApenas || corpoACorpo)
    .map((d) => `${d.quantidade}d${d.faces}`);

  return {
    pericia: p,
    dados,
    atributoTeste: agilAtiva ? 'agi' : p.attr,
    atributoDano,
    agilAtiva,
    bonusAtaque: p.bonus + (Number(arma.bonus) || 0) + mods.ataque,
    dadosExtraAtaque,
    dano: somarDados(arma.dano, mods.dadosDano),
    bonusDano: bonusAtributoDano + mods.dano,
    margem: Math.max(2, critico.margem - mods.margem),
    multiplicador: critico.multiplicador,
    // O dano extra da Trilha do Monstruoso é marcado `elemental` para a
    // interface o colorir à parte na conta do dano (ver rolarDano em
    // engine/dados.js) — o dano da arma e das modificações fica normal.
    extras: [
      ...(arma.danoExtra || []),
      ...mods.danoExtra,
      ...conds.monstruoso.danoExtra.map((expr) => ({ expr, elemental: true })),
    ],
    alcance: mods.alcance || arma.alcance,
    espacos: (Number(arma.espacos) || 0) + mods.espacos,
    mods,
  };
}

/**
 * Constrói o ataque a partir de um item do catálogo. Serve tanto ao separador
 * de Combate como ao Inventário — uma arma escolhida em qualquer um dos dois
 * acaba na mesma lista, por isso conta sempre para a carga.
 */
export function armaDoItem(item) {
  const c = interpretarCritico(item.critico);
  const corpoACorpo = !item.alcance || /corpo/i.test(item.grupo || '');
  return {
    nome: item.nome,
    agil: ehAgil(item),
    pericia: item.pericia || (corpoACorpo ? 'luta' : 'pontaria'),
    bonus: 0,
    dano: item.dano || '',
    margem: c.margem,
    multiplicador: c.multiplicador,
    tipo: item.tipoDano || '',
    alcance: item.alcance || '',
    espacos: item.espacos ?? 1,
    categoria: item.categoria ?? '',
    atributoDano: corpoACorpo ? 'for' : '',
    equipado: true,
    danoExtra: [],
    modificacoes: [],
    notas: item.descricao || '',
  };
}

/** Uma arma é do catálogo de armas, ou um item amaldiçoado que é arma. */
export function ehArma(item) {
  return item?.tipo === 'arma' || (item?.tipo === 'amaldicoado' && /arma/i.test(item?.subtipo || ''));
}

/** A tabela de armas marca as ágeis em `propriedades`; a descrição também o diz. */
export function ehAgil(item) {
  if (item?.agil) return true;
  if ((item?.propriedades || []).some((x) => /ágil|agil/i.test(x))) return true;
  return /arma\s+(tática\s+)?ágil|é uma arma ágil/i.test(item?.descricao || '');
}

/**
 * Como se lê o teste de ataque. Com o atributo a 0 rolam-se 2 dados e fica o
 * PIOR — escrever "0d20" não dizia nada a ninguém.
 */
export function formulaTeste(dados, bonus) {
  const n = Number(dados) || 0;
  const b = Number(bonus) || 0;
  const sinal = b === 0 ? '' : ` ${b > 0 ? '+' : '−'}${Math.abs(b)}`;
  return n > 0 ? `${n}d20${sinal}` : `2d20 pior${sinal}`;
}
