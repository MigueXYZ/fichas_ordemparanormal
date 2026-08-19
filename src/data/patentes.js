// PATENTE — Livro Base, cap. 3 (Tabela 3.1).
// A patente define o limite de crédito e quantos itens de cada categoria a
// Ordem libera por missão. Categoria 0 é ilimitada (só limitada pela carga).

export const PATENTES = [
  { id: 'recruta',    nome: 'Recruta',              pp: 0,   credito: 'Baixo',     itens: { I: 2, II: 0, III: 0, IV: 0 } },
  { id: 'operador',   nome: 'Operador',             pp: 20,  credito: 'Médio',     itens: { I: 3, II: 1, III: 0, IV: 0 } },
  { id: 'especial',   nome: 'Agente especial',      pp: 50,  credito: 'Médio',     itens: { I: 3, II: 2, III: 1, IV: 0 } },
  { id: 'oficial',    nome: 'Oficial de operações', pp: 100, credito: 'Alto',      itens: { I: 3, II: 3, III: 2, IV: 1 } },
  { id: 'elite',      nome: 'Agente de elite',      pp: 200, credito: 'Ilimitado', itens: { I: 3, II: 3, III: 3, IV: 2 } },
];

export const PATENTES_POR_ID = Object.fromEntries(PATENTES.map((p) => [p.id, p]));

export const CATEGORIAS = ['0', 'I', 'II', 'III', 'IV'];

const ROMANOS = { 0: '0', 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };

/** Aceita 0..4, '0'..'IV' ou null e devolve o número romano usado nas tabelas. */
export function categoriaRomana(valor) {
  if (valor === null || valor === undefined || valor === '') return null;
  const s = String(valor).trim().toUpperCase();
  if (CATEGORIAS.includes(s)) return s;
  const n = Number(s);
  return Number.isFinite(n) ? ROMANOS[n] ?? null : null;
}

/** Patente correspondente a um total de pontos de prestígio. */
export function patentePorPrestigio(pp) {
  const n = Number(pp) || 0;
  let atual = PATENTES[0];
  for (const p of PATENTES) if (n >= p.pp) atual = p;
  return atual;
}

export const PRESTIGIO_POR_MISSAO = [
  { evento: 'Solução do caso', pp: 10 },
  { evento: 'Pista adicional encontrada', pp: 2 },
  { evento: 'Morte de inocente', pp: -2 },
  { evento: 'Morte de membro do grupo', pp: -5 },
];
