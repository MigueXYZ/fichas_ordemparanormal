/**
 * Soma dos efeitos dos rituais ATIVOS na ficha.
 *
 * Só entram rituais que (a) estejam ligados no interruptor Ativo/Inativo e
 * (b) tenham uma entrada em `data/rituaisEfeitos.js` marcada `alvo: 'voce'`.
 * Ver o cabeçalho desse ficheiro para o porquê da separação.
 */
import { EFEITOS_RITUAIS } from '../data/rituaisEfeitos.js';
import { ativoDoRitual } from './rituais.js';
import { rituaisAtivos as rituaisDaTrilha } from './monstruoso.js';

const VAZIO = {
  defesaExtra: 0, deslocamentoExtra: 0, periciasBonus: {}, dadosPericia: {},
  ataqueCorpoACorpo: { ataque: 0, dano: 0 }, atributos: {}, linhas: [],
};

/**
 * Todos os rituais que a personagem tem à mão: os próprios mais os
 * concedidos pela Trilha do Monstruoso (esses são derivados a cada render).
 */
function todosOsRituais(personagem, nex) {
  return [...(personagem?.rituais || []), ...rituaisDaTrilha(personagem, nex)];
}

export function efeitosRituaisAtivos(personagem, nex) {
  if (!personagem) return VAZIO;
  const defesa = { valor: 0 };
  const periciasBonus = {};
  const atributos = {};
  const dadosPericia = {};
  const ataqueCorpoACorpo = { ataque: 0, dano: 0 };
  let deslocamentoExtra = 0;
  const linhas = [];

  for (const r of todosOsRituais(personagem, nex)) {
    if (!ativoDoRitual(personagem, r)) continue;
    const ef = EFEITOS_RITUAIS[r?.id];
    if (!ef || ef.alvo !== 'voce' || !ef.ativo) continue;
    for (const e of ef.ativo) {
      if (e.tipo === 'defesa') { defesa.valor += e.valor; linhas.push(`${r.nome}: +${e.valor} Defesa`); }
      else if (e.tipo === 'pericia') { periciasBonus[e.pericia] = (periciasBonus[e.pericia] || 0) + e.valor; linhas.push(`${r.nome}: +${e.valor} nessa perícia`); }
      else if (e.tipo === 'deslocamento') { deslocamentoExtra += e.valor; linhas.push(`${r.nome}: +${e.valor}m de deslocamento`); }
      else if (e.tipo === 'atributo') { atributos[e.atributo] = (atributos[e.atributo] || 0) + e.valor; linhas.push(`${r.nome}: +${e.valor} ${e.atributo.toUpperCase()}`); }
      else if (e.tipo === 'dadosPericia') { dadosPericia[e.pericia] = (dadosPericia[e.pericia] || 0) + e.dados; linhas.push(`${r.nome}: ${e.dados} dado(s) nessa perícia`); }
      else if (e.tipo === 'ataqueCorpoACorpo') {
        ataqueCorpoACorpo.ataque += e.ataque || 0;
        ataqueCorpoACorpo.dano += e.dano || 0;
        linhas.push(`${r.nome}: +${e.ataque} em ataque e +${e.dano} no dano corpo a corpo`);
      }
    }
  }
  return { defesaExtra: defesa.valor, deslocamentoExtra, periciasBonus, dadosPericia, ataqueCorpoACorpo, atributos, linhas };
}

/**
 * Bónus que UMA arma ganha de rituais ativos ligados a ela (Arma Atroz).
 * A arma é identificada pelo nome, guardado em `r.armaAlvo` na conjuração.
 */
export function efeitosRituaisNaArma(personagem, nex, arma) {
  const saida = { ataque: 0, margem: 0 };
  if (!personagem || !arma?.nome) return saida;
  const alvo = String(arma.nome).trim().toLowerCase();
  for (const r of todosOsRituais(personagem, nex)) {
    if (!ativoDoRitual(personagem, r)) continue;
    const ef = EFEITOS_RITUAIS[r?.id];
    if (!ef?.naArma) continue;
    if (String(r.armaAlvo || '').trim().toLowerCase() !== alvo) continue;
    saida.ataque += ef.naArma.ataque || 0;
    saida.margem += ef.naArma.margem || 0;
  }
  return saida;
}
