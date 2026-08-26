import { calcPericias, calcPenalidadesCondicoes, nexEfetivo } from './calc.js';
import { efeitosRituaisNaArma } from './rituaisEfeitos.js';
import { aplicarModificacoes, ALCANCES } from '../data/modificacoesArma.js';
import { aplicarMaldicoesArma } from '../data/maldicoes.js';
import { atributosEfetivos } from './monstruoso.js';
import { quantidadeDados } from './dados.js';

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
  const critico = arma.margem
    ? { margem: Number(arma.margem), multiplicador: Number(arma.multiplicador) || 2 }
    : interpretarCritico(arma.critico);

  const maldicoes = aplicarMaldicoesArma(arma, critico.margem);
  const mods = aplicarModificacoes(arma);
  const conds = calcPenalidadesCondicoes(personagem);
  const atributosEf = atributosEfetivos(personagem, nexEfetivo(personagem));

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
    dados = dadosBaseAgi + penAgi;
  }
  dados = dados + dadosAtaquePenalidade;

  const atributoDano = agilAtiva && arma.atributoDano === 'for' ? 'agi' : arma.atributoDano;
  const bonusAtributoDano = atributoDano ? Number(atributosEf[atributoDano] || 0) : 0;

  const corpoACorpo = arma.pericia === 'luta';
  const dadosExtraAtaque = (conds.monstruoso.ataqueBonusDados || [])
    .filter((d) => !d.corpoACorpoApenas || corpoACorpo)
    .map((d) => `${d.quantidade}d${d.faces}`);

  // Ritual Forma Monstruosa (enquanto transformado): "+5 em testes de
  // ataque e rolagens de dano corpo a corpo" — flag ligada/desligada ao
  // conjurar/terminar a transformação em RituaisEmCombate (Abas.jsx).
  const bonusFormaMonstruosa = personagem.formaMonstruosaAtiva && corpoACorpo ? 5 : 0;

  // Rituais ativos: Martírio de Sangue soma a TODOS os ataques corpo a
  // corpo; Arma Atroz soma só à arma escolhida na conjuração.
  const efRit = conds.rituais || { ataqueCorpoACorpo: { ataque: 0, dano: 0 } };
  const bonusRitualCaC = corpoACorpo ? (efRit.ataqueCorpoACorpo?.ataque || 0) : 0;
  const bonusRitualDano = corpoACorpo ? (efRit.ataqueCorpoACorpo?.dano || 0) : 0;
  const naArma = efeitosRituaisNaArma(personagem, nexEfetivo(personagem), arma);

  const alcanceBase = ALCANCES.indexOf(arma.alcance);
  const saltosAlcance = (mods.lista.reduce((t, m) => t + (m.efeitos.alcanceCategoria || 0), 0)) + maldicoes.alcanceCategoria;
  const alcanceFinal = alcanceBase >= 0 && saltosAlcance
    ? ALCANCES[Math.min(alcanceBase + saltosAlcance, ALCANCES.length - 1)]
    : (mods.alcance || arma.alcance);

  const extras = [
    ...(arma.danoExtra || []),
    ...mods.danoExtra,
    ...maldicoes.danosExtras.map((d) => ({ expr: d.valor, elemental: true, tipoDano: d.tipo })),
    ...(maldicoes.danoCriticoMultiplicavel ? [{ expr: maldicoes.danoCriticoMultiplicavel.valor, elemental: true, tipoDano: maldicoes.danoCriticoMultiplicavel.tipo, multiplicaCritico: true }] : []),
    ...conds.monstruoso.danoExtra.map((expr) => ({ expr, elemental: true, tipoDano: 'Sangue' })),
  ];

  return {
    pericia: p,
    dados,
    atributoTeste,
    atributoDano,
    agilAtiva,
    bonusAtaque: p.bonus + (Number(arma.bonus) || 0) + mods.ataque + bonusFormaMonstruosa + bonusRitualCaC + naArma.ataque,
    dadosExtraAtaque,
    dano: somarDados(arma.dano, mods.dadosDano + maldicoes.dadosDano),
    bonusDano: bonusAtributoDano + mods.dano + bonusFormaMonstruosa + bonusRitualDano,
    margem: Math.max(2, critico.margem - mods.margem - maldicoes.margemExtra - naArma.margem),
    multiplicador: critico.multiplicador,
    extras,
    alcance: alcanceFinal,
    espacos: (Number(arma.espacos) || 0) + mods.espacos,
    mods,
    maldicoes,
  };
}

/**
 * Constrói o ataque a partir de um item do catálogo.
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
    maldicoes: item.maldicoes || [],
    notas: item.descricao || '',
  };
}

/** Uma arma é do catálogo de armas, ou um item amaldiçoado que é arma. */
export function ehArma(item) {
  return (
    item?.tipo === 'arma' ||
    item?.grupo === 'Explosivo' ||
    item?.subgrupo === 'Explosivos' ||
    item?.pericia === 'pontaria' ||
    item?.pericia === 'luta' ||
    (item?.tipo === 'amaldicoado' && /arma|explosivo|granada/i.test(item?.subtipo || item?.tipoDano || item?.nome || ''))
  );
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
  return n > 0 ? `${n}d20${sinal}` : `${quantidadeDados(n)}d20 pior${sinal}`;
}
