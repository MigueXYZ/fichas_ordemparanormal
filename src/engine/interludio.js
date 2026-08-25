import { calcPePorRodada } from './calc.js';

export const CONDICOES_DESCANSO = {
  precaria: {
    id: 'precaria',
    nome: 'Precária',
    mult: 0.5,
    desc: 'No carro ou tenda de acampamento (recuperação pela metade, mín. 1)',
  },
  normal: {
    id: 'normal',
    nome: 'Normal',
    mult: 1,
    desc: 'Quarto simples, com cama e casa de banho funcionais (1× limite de PE)',
  },
  confortavel: {
    id: 'confortavel',
    nome: 'Confortável',
    mult: 2,
    desc: 'Hotel ou pousada 3 estrelas com comodidades (recuperação dobrada)',
  },
  luxuosa: {
    id: 'luxuosa',
    nome: 'Luxuosa',
    mult: 3,
    desc: 'Hotel de luxo, spa e tratamento VIP (recuperação triplicada)',
  },
};

export const PRATOS_ALIMENTACAO = {
  favorito: {
    id: 'favorito',
    nome: 'Prato Favorito',
    desc: 'Se relaxar neste interlúdio, recupera +2 pontos de Sanidade adicionais.',
  },
  nutritivo: {
    id: 'nutritivo',
    nome: 'Prato Nutritivo',
    desc: 'Se dormir neste interlúdio, aumenta a recuperação de PV em 1 nível (ex: Confortável vira Triplicada).',
  },
  energetico: {
    id: 'energetico',
    nome: 'Prato Energético',
    desc: 'Se dormir neste interlúdio, aumenta a recuperação de PE em 1 nível (ex: Confortável vira Triplicada).',
  },
  rapido: {
    id: 'rapido',
    nome: 'Prato Rápido',
    desc: 'Se revisar caso neste interlúdio, recebe +5 no teste de perícia.',
  },
};

export const ACOES_INTERLUDIO = [
  { id: 'dormir', nome: 'Dormir', desc: 'Recupera PV e PE conforme a condição de descanso e limite de PE.' },
  { id: 'relaxar', nome: 'Relaxar', desc: 'Recupera Sanidade (ou Determinação) e beneficia de aliados relaxando.' },
  { id: 'alimentar', nome: 'Alimentar-se', desc: 'Prepara uma refeição especial que potencializa outra ação.' },
  { id: 'exercitar', nome: 'Exercitar-se', desc: 'Ganha um bónus de +1d6 num teste físico (AGI, FOR ou VIG) até ao fim da missão.' },
  { id: 'ler', nome: 'Ler', desc: 'Ganha um bónus de +1d6 num teste mental (INT ou PRE) até ao fim da missão.' },
  { id: 'manutencao', nome: 'Manutenção', desc: 'Conserta um item quebrado, recuperando os seus PV ao máximo.' },
  { id: 'revisar', nome: 'Revisar Caso', desc: 'Estuda anotações e pistas colhidas para descobrir pistas adicionais.' },
];

/**
 * Calcula os efeitos de uma cena de Interlúdio com até 2 ações e sinergias de refeições.
 */
export function calcularInterludio({
  personagem = {},
  max = {},
  condicaoDescansoId = 'normal',
  acoes = ['dormir', 'relaxar'],
  pratoId = 'favorito',
  aliadosRelaxando = 0,
  limparCondicoes = true,
}) {
  const limitePe = calcPePorRodada(personagem);
  const condicao = CONDICOES_DESCANSO[condicaoDescansoId] || CONDICOES_DESCANSO.normal;

  const temDormir = acoes.includes('dormir');
  const temRelaxar = acoes.includes('relaxar');
  const temAlimentar = acoes.includes('alimentar');
  const temExercitar = acoes.includes('exercitar');
  const temLer = acoes.includes('ler');
  const temManutencao = acoes.includes('manutencao');
  const temRevisar = acoes.includes('revisar');

  // Multiplicadores com pratos
  let multPv = condicao.mult;
  let multPe = condicao.mult;
  if (temAlimentar && pratoId === 'nutritivo') {
    multPv += 1;
  }
  if (temAlimentar && pratoId === 'energetico') {
    multPe += 1;
  }

  const pvRecuperado = temDormir ? Math.max(1, Math.floor(limitePe * multPv)) : 0;
  const peRecuperado = temDormir ? Math.max(1, Math.floor(limitePe * multPe)) : 0;

  let sanRecuperado = 0;
  if (temRelaxar) {
    const baseSan = Math.max(1, Math.floor(limitePe * condicao.mult));
    const bonusFavorito = (temAlimentar && pratoId === 'favorito') ? 2 : 0;
    const bonusAliados = Math.max(0, Number(aliadosRelaxando || 0));
    sanRecuperado = baseSan + bonusFavorito + bonusAliados;
  }

  // Valores atuais e novos
  const pvMax = max.pv || 40;
  const pvAtual = personagem.pvAtual ?? pvMax;
  const novoPv = Math.min(pvMax, pvAtual + pvRecuperado);

  const peMax = max.pe || 20;
  const peAtual = personagem.peAtual ?? peMax;
  const novoPe = Math.min(peMax, peAtual + peRecuperado);

  const semSanidade = Boolean(max.semSanidade);
  const sanMax = semSanidade ? (max.pd || 30) : (max.san || 30);
  const sanAtual = semSanidade ? (personagem.pdAtual ?? sanMax) : (personagem.sanAtual ?? sanMax);
  const novoSan = Math.min(sanMax, sanAtual + sanRecuperado);

  // Bónus de dados
  const vigor = Number(personagem.atributos?.VIG || 1);
  const intelecto = Number(personagem.atributos?.INT || 1);

  const bonusExercicioAtual = Number(personagem.bonusExercicio || 0);
  const novoBonusExercicio = temExercitar
    ? Math.min(vigor, bonusExercicioAtual + 1)
    : bonusExercicioAtual;

  const bonusLeituraAtual = Number(personagem.bonusLeitura || 0);
  const novoBonusLeitura = temLer
    ? Math.min(intelecto, bonusLeituraAtual + 1)
    : bonusLeituraAtual;

  const patch = {
    pvAtual: novoPv,
    peAtual: novoPe,
    ...(semSanidade ? { pdAtual: novoSan } : { sanAtual: novoSan }),
    // Remove temporários após um descanso de interlúdio
    pvTemp: 0,
    peTemp: 0,
    ...(semSanidade ? { pdTemp: 0 } : { sanTemp: 0 }),
    bonusExercicio: novoBonusExercicio,
    bonusLeitura: novoBonusLeitura,
    // Combatente-Conhecimento (Trilha do Monstruoso, 65%): a perícia
    // destreinada para abrir o banco de dados de bónus recupera o treino
    // aqui, e o banco esvazia (ver escolherPericiaParaDestreinar em
    // engine/monstruoso.js) — "recupera as perícias treinadas perdidas
    // dessa forma ao final de seu próximo interlúdio", verbatim do livro.
    ...restaurarPericiaMonstruoso(personagem),
  };

  if (limparCondicoes) {
    patch.condicoes = [];
  }

  return {
    limitePe,
    condicao,
    acoes,
    pratoId,
    temDormir,
    temRelaxar,
    temAlimentar,
    temExercitar,
    temLer,
    temManutencao,
    temRevisar,
    pvRecuperado,
    peRecuperado,
    sanRecuperado,
    pvAtual,
    novoPv,
    pvMax,
    peAtual,
    novoPe,
    peMax,
    sanAtual,
    novoSan,
    sanMax,
    semSanidade,
    novoBonusExercicio,
    novoBonusLeitura,
    patch,
  };
}

/**
 * Aplica descanso pleno (recupera 100% de PV, PE, SAN/PD e limpa temporários/condições).
 */
export function aplicarDescansoPleno(personagem, max) {
  const semSanidade = Boolean(max.semSanidade);
  return {
    pvAtual: max.pv || 40,
    peAtual: max.pe || 20,
    ...(semSanidade ? { pdAtual: max.pd || 30 } : { sanAtual: max.san || 30 }),
    pvTemp: 0,
    peTemp: 0,
    pdTemp: 0,
    sanTemp: 0,
    condicoes: [],
    ...restaurarPericiaMonstruoso(personagem),
  };
}

/** Ver nota acima (Combatente-Conhecimento, 65%) — parte comum a interlúdio e descanso pleno. */
function restaurarPericiaMonstruoso(personagem) {
  const id = personagem?.monstruosoPericiaDestreinada;
  if (!id) return {};
  const atual = personagem.pericias?.[id] || {};
  return {
    pericias: { ...(personagem.pericias || {}), [id]: { ...atual, grau: 'treinado' } },
    monstruosoPericiaDestreinada: null,
    monstruosoBancoDados: 0,
    monstruosoBancoPendente: false,
  };
}

/**
 * Limpa apenas pontos temporários e condições ativas sem alterar vida/sanidade atual.
 */
export function aplicarLimpezaCondicoesETemporarios(personagem) {
  return {
    pvTemp: 0,
    peTemp: 0,
    pdTemp: 0,
    sanTemp: 0,
    condicoes: [],
  };
}
