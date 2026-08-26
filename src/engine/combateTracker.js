// Motor do Rastreador de Combate & Iniciativa Multilateral (Multi-Equipas / Múltiplos Lados)
// Regras Oficiais de Ordem Paranormal RPG:
// - Iniciativa: d20 + Agilidade (e bónus de treino/habilidades se houver).
// - Ordem dos turnos: Decrescente pelo valor da Iniciativa. Empates desempatam por Agilidade.
// - Efeitos temporários: Duração em rodadas que decresce a cada nova rodada.
// - Suporte a 2, 3 ou mais lados/facções em confronto, calculando o VD total de cada lado.

export function novoIdCombatente() {
  return 'c-' + Math.random().toString(36).substring(2, 9);
}

export function novoIdEquipa() {
  return 'eq-' + Math.random().toString(36).substring(2, 9);
}

export const CORES_EQUIPAS = [
  '#38bdf8', // Azul ciano
  '#ef4444', // Vermelho Sangue
  '#c084fc', // Roxo Energia / Conhecimento
  '#eab308', // Dourado
  '#22c55e', // Verde
  '#f97316', // Laranja
  '#ec4899', // Rosa
  '#94a3b8', // Cinza Morte
];

export const EQUIPAS_PADRAO = [
  { id: 'equipa-1', nome: 'Lado 1 · Agentes da Ordem', cor: '#38bdf8' },
  { id: 'equipa-2', nome: 'Lado 2 · Ameaças Paranormais', cor: '#ef4444' },
];

export function estadoCombateVazio() {
  return {
    rodada: 1,
    turnoIndex: 0,
    emAndamento: false,
    equipas: [...EQUIPAS_PADRAO],
    combatentes: [],
    efeitosExpirados: [], // notificações de efeitos que expiraram nesta rodada
  };
}

/**
 * Ordena combatentes por Iniciativa decrescente, desempatando por Agilidade.
 */
export function ordenarCombatentes(combatentes) {
  return [...combatentes].sort((a, b) => {
    const iniA = a.iniciativa ?? -999;
    const iniB = b.iniciativa ?? -999;
    if (iniB !== iniA) return iniB - iniA;
    const agiA = Number(a.agi || 0);
    const agiB = Number(b.agi || 0);
    if (agiB !== agiA) return agiB - agiA;
    return (a.nome || '').localeCompare(b.nome || '');
  });
}

/**
 * Rola 1d20 + Agilidade (ou bónus de Iniciativa) para um combatente.
 */
export function rolarIniciativa(agi = 0, bonus = 0) {
  const d20 = Math.floor(Math.random() * 20) + 1;
  const mod = Number(agi || 0) + Number(bonus || 0);
  return {
    d20,
    mod,
    total: d20 + mod,
    critico: d20 === 20,
    desastre: d20 === 1,
  };
}

/**
 * Rola iniciativa para todos os combatentes (ou apenas para os que ainda não rolaram).
 */
export function rolarIniciativaGeral(estado, apenasSemIniciativa = false) {
  const novosCombatentes = estado.combatentes.map((c) => {
    if (apenasSemIniciativa && c.iniciativa !== null && c.iniciativa !== undefined) {
      return c;
    }
    const rolo = rolarIniciativa(c.agi || 0, c.bonusIniciativa || 0);
    return {
      ...c,
      iniciativa: rolo.total,
      iniciativaRolada: true,
      ultimaRolagemIni: rolo,
    };
  });

  const ordenados = ordenarCombatentes(novosCombatentes);
  return {
    ...estado,
    combatentes: ordenados,
    turnoIndex: 0,
  };
}

/**
 * Avança para o próximo turno do combate. Se completar a volta, avança a rodada
 * e reduz a duração dos efeitos temporários ativos.
 */
export function proximoTurno(estado) {
  if (estado.combatentes.length === 0) return estado;

  let novoTurnoIndex = estado.turnoIndex + 1;
  let novaRodada = estado.rodada;
  let efeitosExpirados = [];
  let combatentesAtualizados = estado.combatentes;

  if (novoTurnoIndex >= estado.combatentes.length) {
    novoTurnoIndex = 0;
    novaRodada += 1;

    // Avançar rodada: decrementar efeitos temporários
    combatentesAtualizados = estado.combatentes.map((c) => {
      const novosEfeitos = [];
      for (const ef of c.efeitos || []) {
        if (ef.duracao === 'permanente') {
          novosEfeitos.push(ef);
        } else {
          const novaDuracao = Number(ef.duracao || 1) - 1;
          if (novaDuracao <= 0) {
            efeitosExpirados.push({
              combatenteId: c.id,
              combatenteNome: c.nome,
              efeitoNome: ef.nome,
              rodada: novaRodada,
            });
          } else {
            novosEfeitos.push({ ...ef, duracao: novaDuracao });
          }
        }
      }
      return { ...c, efeitos: novosEfeitos };
    });
  }

  return {
    ...estado,
    rodada: novaRodada,
    turnoIndex: novoTurnoIndex,
    combatentes: combatentesAtualizados,
    efeitosExpirados,
    emAndamento: true,
  };
}

/**
 * Volta para o turno anterior.
 */
export function turnoAnterior(estado) {
  if (estado.combatentes.length === 0) return estado;

  let novoTurnoIndex = estado.turnoIndex - 1;
  let novaRodada = estado.rodada;

  if (novoTurnoIndex < 0) {
    if (novaRodada > 1) {
      novaRodada -= 1;
      novoTurnoIndex = estado.combatentes.length - 1;
    } else {
      novoTurnoIndex = 0;
    }
  }

  return {
    ...estado,
    rodada: novaRodada,
    turnoIndex: novoTurnoIndex,
  };
}

/**
 * Adiciona um novo combatente ao tracker com equipa e VD/NEX associados.
 */
export function adicionarCombatente(estado, combatente) {
  const equipasAtuais = estado.equipas || EQUIPAS_PADRAO;
  const primeiraEquipaId = equipasAtuais[0]?.id || 'equipa-1';
  const segundaEquipaId = equipasAtuais[1]?.id || primeiraEquipaId;

  const equipaPadrao = combatente.tipo === 'agente' ? primeiraEquipaId : segundaEquipaId;
  const equipaId = combatente.equipaId || equipaPadrao;

  const c = {
    id: combatente.id || novoIdCombatente(),
    nome: combatente.nome || 'Combatente',
    tipo: combatente.tipo || 'npc', // 'agente' | 'ameaca' | 'npc'
    subtipo: combatente.subtipo || combatente.tipo || 'npc',
    equipaId,
    vd: Number(combatente.vd || (combatente.tipo === 'agente' ? 0 : 20)),
    nex: Number(combatente.nex || (combatente.tipo === 'agente' ? 20 : 0)),
    codigo: combatente.codigo || null,
    iniciativa: combatente.iniciativa ?? null,
    agi: Number(combatente.agi ?? 1),
    bonusIniciativa: Number(combatente.bonusIniciativa || 0),
    pv: {
      atual: Number(combatente.pv?.atual ?? combatente.pvAtual ?? 20),
      max: Number(combatente.pv?.max ?? combatente.pvMax ?? 20),
      temp: Number(combatente.pv?.temp ?? combatente.pvTemp ?? 0),
    },
    san: combatente.san ? {
      atual: Number(combatente.san.atual ?? combatente.sanAtual ?? 10),
      max: Number(combatente.san.max ?? combatente.sanMax ?? 10),
      temp: Number(combatente.san.temp ?? 0),
    } : null,
    pe: combatente.pe ? {
      atual: Number(combatente.pe.atual ?? combatente.peAtual ?? 5),
      max: Number(combatente.pe.max ?? combatente.peMax ?? 5),
      temp: Number(combatente.pe.temp ?? 0),
    } : null,
    defesa: Number(combatente.defesa || 10),
    condicoes: Array.isArray(combatente.condicoes) ? [...combatente.condicoes] : [],
    efeitos: Array.isArray(combatente.efeitos) ? [...combatente.efeitos] : [],
  };

  const lista = ordenarCombatentes([...(estado.combatentes || []), c]);
  return {
    ...estado,
    equipas: equipasAtuais,
    combatentes: lista,
  };
}

/**
 * Remove um combatente do tracker.
 */
export function removerCombatente(estado, id) {
  const lista = estado.combatentes.filter((c) => c.id !== id);
  let novoIndex = estado.turnoIndex;
  if (novoIndex >= lista.length) {
    novoIndex = Math.max(0, lista.length - 1);
  }
  return {
    ...estado,
    combatentes: lista,
    turnoIndex: novoIndex,
  };
}

/**
 * Edita campos de um combatente.
 */
export function editarCombatente(estado, id, alteracoes) {
  const novosCombatentes = estado.combatentes.map((c) => {
    if (c.id !== id) return c;
    return {
      ...c,
      ...alteracoes,
      pv: alteracoes.pv ? { ...c.pv, ...alteracoes.pv } : c.pv,
      san: alteracoes.san && c.san ? { ...c.san, ...alteracoes.san } : c.san,
      pe: alteracoes.pe && c.pe ? { ...c.pe, ...alteracoes.pe } : c.pe,
    };
  });

  const ordenados = alteracoes.iniciativa !== undefined ? ordenarCombatentes(novosCombatentes) : novosCombatentes;

  return {
    ...estado,
    combatentes: ordenados,
  };
}

/**
 * Adiciona uma nova equipa/lado à batalha multilateral.
 */
export function adicionarEquipa(estado, { nome, cor } = {}) {
  const equipas = estado.equipas || [];
  const idx = equipas.length + 1;
  const novaEquipa = {
    id: novoIdEquipa(),
    nome: nome || `Lado ${idx} · Facção ${idx}`,
    cor: cor || CORES_EQUIPAS[idx % CORES_EQUIPAS.length],
  };
  return {
    ...estado,
    equipas: [...equipas, novaEquipa],
  };
}

/**
 * Remove uma equipa. Os combatentes dessa equipa são movidos para a primeira equipa restante.
 */
export function removerEquipa(estado, equipaId) {
  const equipasRestantes = (estado.equipas || []).filter((e) => e.id !== equipaId);
  if (equipasRestantes.length === 0) return estado;

  const primeiraEquipaId = equipasRestantes[0].id;
  const combatentesAtualizados = (estado.combatentes || []).map((c) => {
    if (c.equipaId === equipaId) {
      return { ...c, equipaId: primeiraEquipaId };
    }
    return c;
  });

  return {
    ...estado,
    equipas: equipasRestantes,
    combatentes: combatentesAtualizados,
  };
}

/**
 * Edita nome ou cor de uma equipa.
 */
export function editarEquipa(estado, equipaId, alteracoes) {
  const novasEquipas = (estado.equipas || []).map((e) => {
    if (e.id !== equipaId) return e;
    return { ...e, ...alteracoes };
  });
  return {
    ...estado,
    equipas: novasEquipas,
  };
}

/**
 * Move um combatente para outra equipa.
 */
export function mudarEquipaCombatente(estado, combatenteId, novaEquipaId) {
  return editarCombatente(estado, combatenteId, { equipaId: novaEquipaId });
}

/**
 * Adiciona um efeito temporário a um combatente.
 */
export function adicionarEfeitoCombatente(estado, combatenteId, { nome, duracao }) {
  const novoEfeito = {
    id: 'ef-' + Math.random().toString(36).substring(2, 9),
    nome,
    duracao: duracao === 'permanente' ? 'permanente' : Number(duracao) || 1,
  };

  return editarCombatente(estado, combatenteId, {
    efeitos: [...(estado.combatentes.find((c) => c.id === combatenteId)?.efeitos || []), novoEfeito],
  });
}

/**
 * Remove um efeito temporário de um combatente.
 */
export function removerEfeitoCombatente(estado, combatenteId, efeitoId) {
  const c = estado.combatentes.find((x) => x.id === combatenteId);
  if (!c) return estado;

  const novosEfeitos = (c.efeitos || []).filter((e) => e.id !== efeitoId);
  return editarCombatente(estado, combatenteId, { efeitos: novosEfeitos });
}

/**
 * Alterna uma condição (adiciona ou remove).
 */
export function alternarCondicaoCombatente(estado, combatenteId, condicaoId) {
  const c = estado.combatentes.find((x) => x.id === combatenteId);
  if (!c) return estado;

  const jaTem = (c.condicoes || []).includes(condicaoId);
  const novasCondicoes = jaTem
    ? (c.condicoes || []).filter((x) => x !== condicaoId)
    : [...(c.condicoes || []), condicaoId];

  return editarCombatente(estado, combatenteId, { condicoes: novasCondicoes });
}
