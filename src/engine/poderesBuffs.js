import { CLASSES_POR_ID, TRILHAS_POR_ID } from '../data/classes.js';
import { ORIGENS_POR_ID } from '../data/origens.js';
import { nexEfetivo, passosNex } from './calc.js';
import { poderesAtivos as poderesAtivosMonstruoso } from './monstruoso.js';

function normalizar(txt) {
  return String(txt || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Retorna a lista unificada de todas as habilidades e poderes ativos do personagem:
 * - Habilidades na lista manual (personagem.habilidades)
 * - Poder da Origem
 * - Habilidades de Classe (filtradas pelo NEX atual)
 * - Poderes de Trilha (filtrados pelo NEX atual)
 * - Poderes da Trilha do Monstruoso
 */
export function listarTodasHabilidades(personagem, nexInformado = null) {
  if (!personagem) return [];
  const nex = nexInformado !== null ? nexInformado : nexEfetivo(personagem);

  const classe = CLASSES_POR_ID[personagem.classeId];
  const trilha = personagem.trilhaId ? TRILHAS_POR_ID[personagem.trilhaId] : null;
  const origem = personagem.origemId === '__custom__' ? personagem.origemCustom : ORIGENS_POR_ID[personagem.origemId];

  const manuais = (personagem.habilidades || []).map((h) => ({
    nome: h?.nome || '',
    descricao: h?.descricao || '',
    origem: h?.origem || 'manual',
    fonte: 'Manual',
  }));

  const automaticas = [
    origem?.poder?.nome && { nome: origem.poder.nome, descricao: origem.poder.descricao, fonte: 'Origem' },
    ...(classe?.habilidades || []).filter((h) => !h.nex || Number(h.nex) <= nex).map((h) => ({ ...h, fonte: classe.nome })),
    ...(trilha?.poderes || []).filter((p) => !p.nex || Number(p.nex) <= nex).map((p) => ({ ...p, fonte: trilha.nome })),
    ...poderesAtivosMonstruoso(personagem, nex).map((p) => ({ nome: p.nome, descricao: p.descricao, nex: p.patamar, fonte: 'Trilha do Monstruoso' })),
  ].filter(Boolean);

  return [...manuais, ...automaticas];
}

/**
 * Verifica se o personagem possui uma habilidade/poder oficial pelo nome ou termo-chave.
 */
export function temHabilidade(personagem, nomeOuTermo, nexInformado = null) {
  const termoNorm = normalizar(nomeOuTermo);
  const todas = listarTodasHabilidades(personagem, nexInformado);
  return todas.some((h) => normalizar(h.nome).includes(termoNorm));
}

/**
 * Verifica se o personagem possui a versão com Afinidade do poder.
 */
export function temAfinidadeComPoder(personagem, nomeOuTermo, nexInformado = null) {
  const termoNorm = normalizar(nomeOuTermo);
  const todas = listarTodasHabilidades(personagem, nexInformado);
  return todas.some((h) => {
    const nomeNorm = normalizar(h.nome);
    const descNorm = normalizar(h.descricao);
    if (!nomeNorm.includes(termoNorm)) return false;
    return nomeNorm.includes('afinidade') || descNorm.includes('afinidade');
  });
}

/**
 * Calcula os bónus mecânicos estritamente oficiais concedidos por poderes e habilidades do sistema
 * (Livro Base, Sobrevivendo ao Horror e Arquivos Secretos).
 */
export function calcBuffsPoderes(personagem, nexInformado = null) {
  if (!personagem) {
    return {
      pvExtra: 0,
      peExtra: 0,
      sanExtra: 0,
      defesaExtra: 0,
      esquivaExtra: 0,
      bloqueioExtra: 0,
      deslocamentoExtra: 0,
      cargaExtra: 0,
      periciasTreino: {},
      periciasBonus: {},
      rdGeral: 0,
      rdElementar: {},
    };
  }

  const nex = nexInformado !== null ? nexInformado : nexEfetivo(personagem);
  const passos = passosNex(nex) + 1; // 5% -> 1, 10% -> 2, ..., 99% -> 20
  const protecoes = Array.isArray(personagem.protecao) ? personagem.protecao : [];
  const temProtecaoLeve = protecoes.some((p) => p === 'protecao-leve' || p === 'leve');
  const temProtecaoPesada = protecoes.some((p) => p === 'protecao-pesada' || p === 'pesada');
  const temQualquerProtecao = protecoes.length > 0;
  const atributos = personagem.atributos || {};

  let pvExtra = 0;
  let peExtra = 0;
  let sanExtra = 0;
  let defesaExtra = 0;
  let esquivaExtra = 0;
  let bloqueioExtra = 0;
  let deslocamentoExtra = 0;
  let cargaExtra = 0;
  let rdGeral = 0;
  const rdElementar = {};
  const periciasTreino = {};
  const periciasBonus = {};

  const todas = listarTodasHabilidades(personagem, nex);

  for (const hab of todas) {
    const n = normalizar(hab.nome);
    const d = normalizar(hab.descricao);
    const afinidade = n.includes('afinidade') || d.includes('afinidade');

    // === PONTOS DE VIDA (PV) ===
    // Sangue de Ferro (Livro Base, p. 114): +2 PV por cada 5% de NEX (+4 com afinidade)
    if (n.includes('sangue de ferro')) {
      pvExtra += passos * (afinidade ? 4 : 2);
    }
    // Vitalidade Reforçada (Sobrevivendo ao Horror, p. 36): +1 PV por cada 5% de NEX
    if (n.includes('vitalidade reforcada')) {
      pvExtra += passos * 1;
    }
    // Casca Grossa (Combatente - Tropa de Choque, Livro Base, p. 24): +1 PV por cada 5% de NEX e soma VIG no bloqueio
    if (n.includes('casca grossa')) {
      pvExtra += passos * 1;
      bloqueioExtra += Number(atributos.vig || 0);
    }
    // Calejado (Origem Desgarrado / Mercenário, Livro Base, p. 19 / Sobrevivendo ao Horror): +1 PV por cada 5% de NEX
    if (n.includes('calejado')) {
      pvExtra += passos * 1;
    }

    // === PONTOS DE ESFORÇO (PE) ===
    // Potencial Aprimorado (Livro Base, p. 115): +1 PE por cada 5% de NEX (+2 com afinidade)
    if (n.includes('potencial aprimorado')) {
      peExtra += passos * (afinidade ? 2 : 1);
    }
    // Vontade Inabalável (Sobrevivendo ao Horror, p. 36): +1 PE por cada 10% de NEX
    if (n.includes('vontade inabalavel')) {
      peExtra += Math.floor(passos / 2);
    }
    // Combatente Esforçado (Arquivos Secretos 06, p. 67): +1 PE por cada 5% de NEX
    if (n.includes('combatente esforcado')) {
      peExtra += passos * 1;
    }

    // === DEFESA & ESQUIVA & BLOQUEIO ===
    // Precognição (Livro Base, p. 114): +2 na Defesa e em testes de Esquiva
    if (n.includes('precognicao')) {
      defesaExtra += 2;
      esquivaExtra += 2;
    }
    // Reflexos Defensivos (Combatente, Livro Base, p. 23): +2 na Defesa e em testes de Esquiva
    if (n.includes('reflexos defensivos')) {
      defesaExtra += 2;
      esquivaExtra += 2;
    }
    // Especialista em Proteção Leve (Sobrevivendo ao Horror, p. 34): +2 na Defesa e em Reflexos se usando proteção leve
    if (n.includes('especialista em protecao leve')) {
      if (temProtecaoLeve) {
        defesaExtra += 2;
        esquivaExtra += 2;
        periciasBonus.reflexos = (periciasBonus.reflexos || 0) + 2;
      }
    }
    // Tanque de Guerra (Combatente - Tropa de Choque, Livro Base, p. 24): +2 na Defesa por proteções
    if (n.includes('tanque de guerra')) {
      if (temQualquerProtecao) {
        defesaExtra += 2;
      }
    }
    // Instintos Urbanos (Arquivos Secretos 04, p. 67): +2 na Defesa se não estiver usando proteção pesada
    if (n.includes('instintos urbanos')) {
      if (!temProtecaoPesada) {
        defesaExtra += 2;
      }
      periciasTreino.crime = true;
    }

    // === CARGA & ESPAÇOS ===
    // Inventário Organizado (Sobrevivendo ao Horror, p. 34): você soma seu Intelecto no limite de carga
    if (n.includes('inventario organizado')) {
      cargaExtra += Number(atributos.int || 0) * 2;
    }
    // Força Opressora (Sobrevivendo ao Horror, p. 34): você recebe +2 espaços de carga
    if (n.includes('forca opressora')) {
      cargaExtra += 2;
    }

    // === RESISTÊNCIAS ===
    // Resistir a <Elemento> (Livro Base, p. 114): Resistência 10 contra o elemento escolhido (20 com afinidade)
    if (n.includes('resistir a sangue') || n.includes('resistencia a sangue')) {
      rdElementar.sangue = Math.max(rdElementar.sangue || 0, afinidade ? 20 : 10);
    }
    if (n.includes('resistir a morte') || n.includes('resistencia a morte')) {
      rdElementar.morte = Math.max(rdElementar.morte || 0, afinidade ? 20 : 10);
    }
    if (n.includes('resistir a energia') || n.includes('resistencia a energia')) {
      rdElementar.energia = Math.max(rdElementar.energia || 0, afinidade ? 20 : 10);
    }
    if (n.includes('resistir a conhecimento') || n.includes('resistencia a conhecimento')) {
      rdElementar.conhecimento = Math.max(rdElementar.conhecimento || 0, afinidade ? 20 : 10);
    }

    // === PERÍCIAS TREINADAS CONCEDIDAS ===
    if (n.includes('sentidos agucados')) periciasTreino.percepcao = true;
    if (n.includes('sobrevivencialista')) periciasTreino.sobrevivencia = true;
    if (n.includes('sorrateiro')) periciasTreino.furtividade = true;
    if (n.includes('curiosidade oculta')) periciasTreino.ocultismo = true;
    if (n.includes('farmaceutico de campo')) periciasTreino.medicina = true;
    if (n.includes('rastrear o paranormal')) periciasTreino.sobrevivencia = true;
    if (n.includes('revelacao do mal')) periciasTreino.religiao = true;
    if (n.includes('ser amaldicoado')) periciasTreino.ocultismo = true;
    if (n.includes('medico de campo')) periciasTreino.medicina = true;
    if (n.includes('parapsicologo')) periciasTreino.profissao = true;
  }

  return {
    pvExtra,
    peExtra,
    sanExtra,
    defesaExtra,
    esquivaExtra,
    bloqueioExtra,
    deslocamentoExtra,
    cargaExtra,
    periciasTreino,
    periciasBonus,
    rdGeral,
    rdElementar,
  };
}
