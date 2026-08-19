import { calcPericias } from './calc.js';
import { aplicarModificacoes } from '../data/modificacoesArma.js';

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
  const p = pericias.find((x) => x.id === arma.pericia) || { dados: 1, bonus: 0, nome: '' };
  const mods = aplicarModificacoes(arma);

  const critico = arma.margem
    ? { margem: Number(arma.margem), multiplicador: Number(arma.multiplicador) || 2 }
    : interpretarCritico(arma.critico);

  const bonusAtributoDano = arma.atributoDano ? Number(personagem.atributos[arma.atributoDano] || 0) : 0;

  return {
    pericia: p,
    dados: p.dados,
    bonusAtaque: p.bonus + (Number(arma.bonus) || 0) + mods.ataque,
    dano: somarDados(arma.dano, mods.dadosDano),
    bonusDano: bonusAtributoDano + mods.dano,
    margem: Math.max(2, critico.margem - mods.margem),
    multiplicador: critico.multiplicador,
    extras: [...(arma.danoExtra || []), ...mods.danoExtra],
    alcance: mods.alcance || arma.alcance,
    espacos: (Number(arma.espacos) || 0) + mods.espacos,
    mods,
  };
}
