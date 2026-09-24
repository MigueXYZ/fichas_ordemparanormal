/**
 * Regras do Campo de Batalha do Modo Mestre, sem React (testáveis à parte):
 * dano recebido com Resistências/Imunidades/Vulnerabilidades, iniciativa
 * como teste de Ordem Paranormal, resumo de rolagens para o registo e
 * guardar/recuperar o combate entre visitas.
 */
import { calcularDanoRecebido, repartirResistenciasFicha, tipoDanoParaId, TIPOS_DANO_POR_ID } from './danoRecetor.js';
import { rolarTeste } from './dados.js';
import { calcPericias } from './calc.js';
import { lerPool } from './fichaLivre.js';

const lista = (v) => (Array.isArray(v) ? v : v ? [String(v)] : []);

/**
 * Criatura paranormal (Livro Base, "Origem Paranormal"): não tem Sanidade e é
 * imune a dano mental. Conta como tal uma ameaça com elemento/descritor ou
 * com Presença Perturbadora; animais e pessoas ("ameaças da Realidade") não.
 */
export function ehCriaturaParanormal(ficha) {
  if (!ficha || ficha.tipo !== 'ameaca') return false;
  if (ficha.presencaPerturbadora) return true;
  const desc = lista(ficha.descritores).map((d) => String(d).toLowerCase());
  return desc.some((d) => ['sangue', 'morte', 'conhecimento', 'energia', 'medo'].includes(d));
}

/** Tipos de dano a que uma linha de texto ("Imune a doenças e venenos", "Balístico") se refere. */
function tiposNoTexto(texto) {
  const t = String(texto || '');
  const ids = new Set();
  for (const pedaco of t.split(/,|\se\s|;/)) {
    const id = tipoDanoParaId(pedaco);
    if (id !== 'geral') ids.add(id);
  }
  if (/f[ií]sico/i.test(t)) ['balistico', 'corte', 'impacto', 'perfuracao'].forEach((id) => ids.add(id));
  return ids;
}

/**
 * Dano sofrido por um combatente, parcela a parcela, com as regras do livro:
 *  - Imunidade ao tipo: 0; Vulnerabilidade: dano dobrado (antes das RD);
 *  - Resistências da ficha (½ sem número, ou "Tipo N" a descontar), pelo
 *    motor do Recetor de Dano (engine/danoRecetor.js);
 *  - Dano mental: tira SAN a quem tem Sanidade; a pessoas e animais (ameaças
 *    da Realidade) tira PV; criaturas paranormais são imunes.
 * `parcelas`: [{ valor, tipoId }]. Devolve o resultado do Recetor de Dano
 * com os novos PV/SAN e `notas` a explicar o que mudou.
 */
export function danoNoCombatente(c, parcelas) {
  const ficha = c?.ficha || {};
  const imunes = new Set(lista(ficha.imunidades).flatMap((l) => [...tiposNoTexto(l)]));
  const vulneraveis = new Set(lista(ficha.vulnerabilidades).flatMap((l) => [...tiposNoTexto(l)]));
  const paranormal = ehCriaturaParanormal(ficha);
  const temSan = Boolean(c?.san && Number.isFinite(Number(c.san.max)));
  const notas = [];

  const ajustadas = (parcelas || []).map((p) => {
    const valor = Math.max(0, Number(p.valor) || 0);
    const tipo = TIPOS_DANO_POR_ID[p.tipoId] ? p.tipoId : 'geral';
    const nome = TIPOS_DANO_POR_ID[tipo].nome;
    if (!valor) return { valor: 0, tipoId: tipo };
    if (tipo === 'mental' && paranormal) { notas.push('Criatura paranormal: imune a dano mental'); return { valor: 0, tipoId: tipo }; }
    if (imunes.has(tipo)) { notas.push(`Imune a ${nome}`); return { valor: 0, tipoId: tipo }; }
    if (vulneraveis.has(tipo)) { notas.push(`Vulnerável a ${nome}: dano dobrado`); return { valor: valor * 2, tipoId: tipo }; }
    return { valor, tipoId: tipo };
  });

  const r = calcularDanoRecebido({
    parcelas: ajustadas,
    personagem: {
      resistencias: lista(ficha.resistencias),
      pvAtual: c?.pv?.atual,
      pvTemp: c?.pv?.temp || 0,
      sanAtual: c?.san?.atual,
    },
    max: { pv: c?.pv?.max, san: c?.san?.max },
  });

  // Sem Sanidade (pessoas/animais): o dano mental sai dos PV
  if (!temSan && r.totalLiquidoSan > 0) {
    notas.push('Sem Sanidade: o dano mental tira PV');
    r.novoPvAtual = Math.max(0, r.novoPvAtual - r.totalLiquidoSan);
    r.totalLiquidoPv += r.totalLiquidoSan;
    r.totalLiquidoSan = 0;
    r.novoSanAtual = r.sanAtual;
  }
  const reducoes = r.detalhesParcelas.filter((d) => d.reducaoTotal > 0)
    .map((d) => `${d.tipo.nome}: −${d.reducaoTotal}${d.resistente ? ' (resistência, ½)' : ''}`);
  if (reducoes.length) notas.push(`Resistências — ${reducoes.join(', ')}`);
  return { ...r, notas };
}

/** O dano rolado, em parcelas por tipo (uma rolagem pode trazer vários tipos). */
export function parcelasDeRolagem(dano) {
  if (!dano) return [];
  const partes = Array.isArray(dano.partes) && dano.partes.length ? dano.partes : [{ total: dano.total, tipoDano: dano.tipoDano }];
  return partes.map((p) => ({ valor: Number(p.total) || 0, tipoId: tipoDanoParaId(p.tipoDano || dano.tipoDano || '') }));
}

/** Resistências de um combatente em texto curto, para mostrar antes de aplicar dano. */
export function resumoDefesasDano(c) {
  const ficha = c?.ficha || {};
  const { meias, flat } = repartirResistenciasFicha(ficha.resistencias);
  const partes = [
    ...[...meias].map((id) => `${TIPOS_DANO_POR_ID[id]?.nome || id} ½`),
    ...Object.entries(flat).map(([id, v]) => `${TIPOS_DANO_POR_ID[id]?.nome || id} ${v}`),
  ];
  return {
    resistencias: partes,
    imunidades: lista(ficha.imunidades),
    vulnerabilidades: lista(ficha.vulnerabilidades),
    imuneMental: ehCriaturaParanormal(ficha),
  };
}

/**
 * Iniciativa em Ordem Paranormal é um teste de perícia: rolam-se tantos d20
 * quanto a Agilidade, fica o maior, soma-se o bónus de Iniciativa. Lê o bónus
 * da ficha: agente (perícias calculadas), ameaça (Sentidos → Iniciativa) ou
 * NPC livre (perícia Iniciativa). Sem ficha: AGI do combatente, sem bónus.
 */
export function poolIniciativa(c) {
  const ficha = c?.ficha;
  const agi = Number(c?.agi ?? ficha?.atributos?.agi ?? 1);
  if (ficha?.tipo === 'ameaca') {
    const p = lerPool(ficha.sentidos?.iniciativa);
    if (p) return p;
  } else if (ficha?.fichaLivre) {
    const per = (ficha.pericias || []).find((x) => String(x.nome).toLowerCase() === 'iniciativa');
    if (per) return { dados: Number(per.dados) || agi, bonus: Number(per.bonus) || 0 };
  } else if (ficha && ficha.atributos) {
    try {
      const per = calcPericias(ficha).find((x) => x.id === 'iniciativa');
      if (per) return { dados: per.dados ?? agi, bonus: per.bonus ?? 0 };
    } catch { /* ficha incompleta: cai no valor por omissão */ }
  }
  return { dados: agi, bonus: Number(c?.bonusIniciativa) || 0 };
}

export function rolarIniciativaDe(c) {
  const p = poolIniciativa(c);
  return rolarTeste({ nome: `${c?.nome || 'Combatente'} — Iniciativa`, dados: p.dados, bonus: p.bonus });
}

/** Balanço do encontro: NEX dos agentes (1º lado) contra o VD dos outros lados. */
export function avaliarBalanco(nexAgentes, vdInimigos) {
  if (vdInimigos <= 0) return { texto: 'Sem inimigos', nivel: 'vazio' };
  if (nexAgentes <= 0) return { texto: 'Sem agentes', nivel: 'vazio' };
  const r = vdInimigos / nexAgentes;
  if (r < 0.5) return { texto: 'Muito fácil', nivel: 'muito-facil' };
  if (r <= 0.75) return { texto: 'Fácil', nivel: 'facil' };
  if (r <= 1.1) return { texto: 'Equilibrado', nivel: 'equilibrado' };
  if (r <= 1.5) return { texto: 'Difícil', nivel: 'dificil' };
  return { texto: 'Mortal', nivel: 'mortal' };
}

/** Uma rolagem (qualquer tipo de engine/dados.js) numa linha para o registo. */
export function resumoRolagem(r) {
  if (!r) return { titulo: 'Rolagem', conta: '', total: '—' };
  const sinal = (b) => (b ? ` ${b > 0 ? '+' : '−'} ${Math.abs(b)}` : '');
  let conta = '';
  if (r.tipo === 'dano' || r.tipo === 'expressao') {
    conta = Array.isArray(r.partes) && r.partes.length
      ? r.partes.map((p) => `${p.expressao}${p.rolagens?.length ? ` [${p.rolagens.join(', ')}]` : ''}${p.tipoDano ? ` ${p.tipoDano}` : ''}`).join(' + ')
      : `${r.expressao || ''} [${(r.rolagens || []).join(', ')}]${sinal(r.bonus)}`;
  } else if (Array.isArray(r.rolagens) && r.rolagens.length) {
    conta = `${r.dados || r.rolagens.length}d20 [${r.rolagens.join(', ')}]${sinal(r.bonus)}`;
  } else {
    conta = r.detalhe || '';
  }
  const titulo = r.nome || 'Rolagem';
  const total = r.total ?? '—';
  const danoJunto = r.tipo === 'ataque' && r.dano ? { total: r.dano.total, conta: resumoRolagem(r.dano).conta } : null;
  return { titulo, conta, total, danoJunto, critico: Boolean(r.critico), falha: Boolean(r.falhaCritica) };
}

/** Uma rolagem vinda de um jogador ligado pelo Hub (formato do overlay). */
export function resumoRolagemJogador(r) {
  if (!r) return null;
  if (r.tipo || r.rolagens) return resumoRolagem(r);
  return {
    titulo: r.nome || r.rotulo || 'Rolagem',
    conta: r.detalhe || (r.dados ? `${r.dados} dados` : ''),
    total: r.total ?? '—',
    critico: Boolean(r.critico),
    falha: Boolean(r.desastre || r.falhaCritica),
  };
}

// ------------------------------------------------------------ guardar combate

const CHAVE_COMBATE = 'ordo:campo-batalha:v1';

/** O combate a guardar: as fichas guardadas no Ordo vão por referência (id),
 * para não repetir imagens pesadas; as outras (jogadores ligados, cópias do
 * compêndio) vão inteiras. */
export function serializarCombate(estado, registo = []) {
  const combatentes = (estado?.combatentes || []).map((c) => {
    if (c.ficha?.id && !c.codigo && !c.fichaPropria) return { ...c, ficha: null, fichaRef: c.ficha.id };
    return c;
  });
  return JSON.stringify({ estado: { ...estado, combatentes }, registo: registo.slice(-150) });
}

export function desserializarCombate(texto, fichasPorId = {}) {
  const dados = JSON.parse(texto);
  const estado = dados?.estado;
  if (!estado || !Array.isArray(estado.combatentes)) return null;
  const combatentes = estado.combatentes.map((c) => {
    if (!c.fichaRef) return c;
    const { fichaRef, ...resto } = c;
    return { ...resto, ficha: fichasPorId[fichaRef] || null };
  });
  return { estado: { ...estado, combatentes }, registo: Array.isArray(dados.registo) ? dados.registo : [] };
}

export function guardarCombateLocal(estado, registo) {
  try { localStorage.setItem(CHAVE_COMBATE, serializarCombate(estado, registo)); return true; } catch { return false; }
}

export function lerCombateLocal(fichasPorId) {
  try {
    const t = localStorage.getItem(CHAVE_COMBATE);
    return t ? desserializarCombate(t, fichasPorId) : null;
  } catch { return null; }
}
