// CLASSES — agregador. O conteúdo de cada classe está em src/data/classes/.
import combatente from './classes/combatente.js';
import especialista from './classes/especialista.js';
import ocultista from './classes/ocultista.js';
import sobrevivente from './classes/sobrevivente.js';

export const CLASSES = [combatente, especialista, ocultista, sobrevivente];

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
