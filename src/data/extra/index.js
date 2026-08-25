/**
 * Conteúdo dos Arquivos Secretos 1–7, extraído livro a livro (ver os ficheiros
 * as01.js … as07.js, cada um com a proveniência das suas entradas).
 *
 * O pacote 2 e o 6 não trazem trilhas nem origens novas: só têm poderes,
 * itens, rituais e regras. Ficam na mesma como ficheiros vazios documentados,
 * para se saber que foram lidos.
 *
 * Correção: o pacote 4 (Complexo 0413) foi lido antes a partir de uma fonte
 * errada, que levou a duas "origens" inventadas ("Antepassado Jurássico" e
 * "Conhecimento Galináceo", nunca publicadas pela Jambô) a viverem soltas em
 * origens.js. Foram removidas depois de ler o PDF real do pacote — que traz,
 * sim, duas origens novas e uma trilha, agora em as04.js.
 */
import { TRILHAS_AS01, ORIGENS_AS01 } from './as01.js';
import { TRILHAS_AS02, ORIGENS_AS02 } from './as02.js';
import { TRILHAS_AS03, ORIGENS_AS03 } from './as03.js';
import { TRILHAS_AS04, ORIGENS_AS04 } from './as04.js';
import { TRILHAS_AS05, ORIGENS_AS05 } from './as05.js';
import { TRILHAS_AS06, ORIGENS_AS06 } from './as06.js';
import { TRILHAS_AS07, ORIGENS_AS07 } from './as07.js';

export const ORIGENS_EXTRA = [
  ...ORIGENS_AS01, ...ORIGENS_AS02, ...ORIGENS_AS03, ...ORIGENS_AS04,
  ...ORIGENS_AS05, ...ORIGENS_AS06, ...ORIGENS_AS07,
];

/** Todas as trilhas dos suplementos, cada uma com o campo `classe`. */
const TRILHAS_EXTRA = [
  ...TRILHAS_AS01, ...TRILHAS_AS02, ...TRILHAS_AS03, ...TRILHAS_AS04,
  ...TRILHAS_AS05, ...TRILHAS_AS06, ...TRILHAS_AS07,
];

const CLASSES_PRINCIPAIS = ['combatente', 'especialista', 'ocultista'];

/**
 * As trilhas de uma classe, vindas dos suplementos.
 *
 * Uma trilha marcada `classe: 'geral'` pertence às três classes principais —
 * é o caso do Performático (Arquivos Secretos 3): «em termos de regras, ela
 * pertence às três classes e pode ser escolhida por qualquer uma delas (o nome
 * muda para especialista performático ou ocultista performático)». Por isso
 * aparece nas três, com o nome adaptado e um id próprio por classe.
 */
export function trilhasExtraDaClasse(classeId) {
  return TRILHAS_EXTRA.flatMap((t) => {
    if (t.classe === classeId) {
      const { classe, ...resto } = t;
      return [resto];
    }
    if (t.classe === 'geral' && CLASSES_PRINCIPAIS.includes(classeId)) {
      const { classe, ...resto } = t;
      const nomeClasse = { combatente: 'Combatente', especialista: 'Especialista', ocultista: 'Ocultista' }[classeId];
      return [{
        ...resto,
        id: `${resto.id.replace(/^(combatente|especialista|ocultista)-/, '')}-${classeId}`,
        nome: resto.nome.replace(/^(Combatente|Especialista|Ocultista)\s+/, `${nomeClasse} `),
        geral: true,
      }];
    }
    return [];
  });
}

export { TRILHAS_EXTRA };
