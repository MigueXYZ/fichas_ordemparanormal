// Lógica partilhada da "caixa de atacar / dar dano" usada no Rastreador de
// Combate e nos Cartões de Batalha — para não repetir a mesma coisa nos dois
// sítios. Lê os ataques de um agente (armas do inventário) ou de uma ameaça
// (ações do esquema do Livro Base) e devolve-os já prontos a rolar.
import { rolarTeste, rolarDano, rolarAtaqueCompleto } from './dados.js';
import { estatisticasArma } from './armas.js';

/** Lê "3d20+10" (o "Teste" de uma ação de ameaça) e devolve {dados,bonus}, ou null. */
export function parseTesteTexto(txt) {
  const m = String(txt || '').replace(/\s/g, '').match(/^(-?\d+)d20([+-]\d+)?/i);
  if (!m) return null;
  return { dados: Number(m[1]), bonus: Number(m[2] || 0) };
}

/** Lê "2d12+10 impacto" (o "Dano" de uma ação de ameaça) e devolve {dano,tipoDano}, ou null. */
export function parseDanoTexto(txt) {
  const m = String(txt || '').trim().match(/^(\d*d\d+(?:[+-]\d+)?)\s*(.*)$/i);
  if (!m) return null;
  return { dano: m[1], tipoDano: m[2] || null };
}

/** As ações de uma ameaça — já migradas do esquema antigo (`ataque` único) para
 * o novo (`acoes`, array), tal como o FichaAmeaca faz ao editar. */
export function acoesDeAmeaca(a) {
  if (Array.isArray(a?.acoes) && a.acoes.length) return a.acoes;
  if (a?.ataque) {
    return [{
      tipo: 'Padrão',
      nome: a.ataque.nome || 'Agredir',
      detalhe: a.ataque.tipo || '',
      teste: a.ataque.teste || '',
      dano: a.ataque.dano || '',
      critico: a.ataque.critico || '',
    }];
  }
  return [];
}

/**
 * Prepara os ataques de uma unidade (agente ou ameaça) num formato comum:
 * {id, nome, detalhe, rolar()} — rolar() devolve {acerto, dano}, cada um já
 * um resultado pronto para passar a onRolar(). `unidade` é
 * {nome, tipo: 'agente'|'ameaca'|'npc', subtipo, ficha}; sem `ficha` (criada
 * à mão) não há ataques.
 */
export function prepararAtaques(unidade) {
  const ficha = unidade?.ficha;
  if (!ficha) return [];
  const nomeUnidade = unidade.nome || ficha.nome || '';

  if (unidade.tipo === 'ameaca' || (unidade.tipo === 'npc' && unidade.subtipo === 'ocultista')) {
    return acoesDeAmeaca(ficha).map((acao, i) => ({
      id: acao.nome ? `${acao.nome}-${i}` : `acao-${i}`,
      nome: acao.nome || 'Ação',
      detalhe: acao.detalhe || '',
      rolar: () => {
        const testeParsed = parseTesteTexto(acao.teste);
        const acerto = testeParsed
          ? rolarTeste({ nome: `${nomeUnidade} — ${acao.nome}`, dados: testeParsed.dados, bonus: testeParsed.bonus })
          : null;
        const danoParsed = parseDanoTexto(acao.dano);
        const dano = danoParsed
          ? rolarDano({ nome: `${nomeUnidade} — ${acao.nome} — dano`, dano: danoParsed.dano, tipoDano: danoParsed.tipoDano, critico: acerto?.critico })
          : null;
        return { acerto, dano };
      },
    }));
  }

  // Agente / NPC de agente: armas do inventário, com os números finais já
  // calculados para este personagem (perícia, atributos, modificações, etc.)
  const armas = Array.isArray(ficha.ataques) ? ficha.ataques : [];
  return armas.map((arma, i) => ({
    id: arma._monstruosoId || `${arma.nome}-${i}`,
    nome: arma.nome || 'Ataque',
    detalhe: [arma.tipo, arma.alcance].filter(Boolean).join(' · '),
    rolar: () => {
      const e = estatisticasArma(ficha, arma);
      const r = rolarAtaqueCompleto({
        nome: `${nomeUnidade} — ${arma.nome}`,
        dados: e.dados,
        bonusAtaque: e.bonusAtaque,
        dadosExtraAtaque: e.dadosExtraAtaque,
        dano: e.dano,
        bonusDano: e.bonusDano,
        extras: e.extras,
        margem: e.margem,
        multiplicador: e.multiplicador,
      });
      return { acerto: r, dano: r.dano };
    },
  }));
}
