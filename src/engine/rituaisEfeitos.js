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

const VAZIO = { defesaExtra: 0, deslocamentoExtra: 0, periciasBonus: {}, linhas: [] };

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
    }
  }
  return { defesaExtra: defesa.valor, deslocamentoExtra, periciasBonus, linhas };
}
