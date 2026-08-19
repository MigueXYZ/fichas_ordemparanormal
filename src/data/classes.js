// CLASSES — agregador. O conteúdo de cada classe está em src/data/classes/.
import combatente from './classes/combatente.js';
import especialista from './classes/especialista.js';
import ocultista from './classes/ocultista.js';
import sobrevivente from './classes/sobrevivente.js';
import { trilhasExtraDaClasse } from './extra/index.js';

/**
 * As trilhas dos Arquivos Secretos entram aqui, para não haver duas listas.
 * A do Livro Base e a de Sobrevivendo ao Horror já vêm dentro de cada classe.
 */
function comTrilhasExtra(classe) {
  const extra = trilhasExtraDaClasse(classe.id);
  if (!extra.length) return classe;
  const jaLa = new Set((classe.trilhas || []).map((t) => t.id));
  return { ...classe, trilhas: [...(classe.trilhas || []), ...extra.filter((t) => !jaLa.has(t.id))] };
}

export const CLASSES = [combatente, especialista, ocultista, sobrevivente].map(comTrilhasExtra);

export const CLASSES_POR_ID = Object.fromEntries(CLASSES.map((c) => [c.id, c]));

/** Todas as trilhas, com a classe a que pertencem. */
export const TRILHAS = CLASSES.flatMap((c) =>
  (c.trilhas || []).map((t) => ({ ...t, classeId: c.id, classeNome: c.nome }))
);

export const TRILHAS_POR_ID = Object.fromEntries(TRILHAS.map((t) => [t.id, t]));

/** Poderes de todas as classes, marcados com a classe de origem. */
export const PODERES_DE_CLASSE = CLASSES.flatMap((c) =>
  (c.poderes || []).map((p) => ({ ...p, classeId: c.id, classeNome: c.nome, tipo: 'classe' }))
);

export function trilhasDaClasse(classeId) {
  return CLASSES_POR_ID[classeId]?.trilhas || [];
}

/** Habilidades que a classe concede num dado NEX (linha da tabela de progressão). */
export function habilidadesNoNex(classeId, nex) {
  const c = CLASSES_POR_ID[classeId];
  if (!c) return [];
  return (c.tabelaNex || []).filter((l) => Number(l.nex) <= Number(nex));
}

export default CLASSES;
