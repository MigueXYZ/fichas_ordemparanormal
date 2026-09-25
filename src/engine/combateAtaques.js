// Lógica partilhada da "caixa de atacar / dar dano" usada no Rastreador de
// Combate e nos Cartões de Batalha — para não repetir a mesma coisa nos dois
// sítios. Lê os ataques de um agente (armas do inventário) ou de uma ameaça
// (ações do esquema do Livro Base) e devolve-os já prontos a rolar.
import { rolarAtaque, rolarDano, rolarAtaqueCompleto } from './dados.js';
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

/** Lê "19/x3", "x3" ou "18" (o "Crítico" de uma ação) → { margem, multiplicador }. */
export function parseCriticoTexto(txt) {
  const t = String(txt || '').replace(/\s/g, '').toLowerCase();
  const margem = t.match(/^(\d+)/);
  const mult = t.match(/x(\d+)/);
  return { margem: margem ? Number(margem[1]) : 20, multiplicador: mult ? Number(mult[1]) : 2 };
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

  // Ameaças, ocultistas gerados e NPCs de ficha livre (ver engine/fichaLivre.js)
  // atacam pelas ações escritas na ficha, não por armas de inventário.
  if (unidade.tipo === 'ameaca' || ficha.fichaLivre === true || (unidade.tipo === 'npc' && unidade.subtipo === 'ocultista')) {
    // só as ações que se rolam (teste e/ou dano); as outras são regras escritas
    return acoesDeAmeaca(ficha)
      .filter((acao) => String(acao.teste || '').trim() || String(acao.dano || '').trim())
      .map((acao, i) => {
        const crit = parseCriticoTexto(acao.critico);
        return {
          id: acao.nome ? `${acao.nome}-${i}` : `acao-${i}`,
          nome: acao.nome || 'Ação',
          detalhe: [acao.detalhe, acao.teste && `Teste ${acao.teste}`, acao.dano && `Dano ${acao.dano}`].filter(Boolean).join(' · '),
          temTeste: Boolean(parseTesteTexto(acao.teste)),
          rolar: () => {
            const testeParsed = parseTesteTexto(acao.teste);
            const acerto = testeParsed
              ? rolarAtaque({ nome: `${nomeUnidade} — ${acao.nome}`, dados: testeParsed.dados, bonus: testeParsed.bonus, margem: crit.margem })
              : null;
            const danoParsed = parseDanoTexto(acao.dano);
            const dano = danoParsed
              ? rolarDano({ nome: `${nomeUnidade} — ${acao.nome} — dano`, dano: danoParsed.dano, tipoDano: danoParsed.tipoDano, critico: acerto?.critico, multiplicador: crit.multiplicador })
              : null;
            return { acerto, dano };
          },
        };
      });
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
