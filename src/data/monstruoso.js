// TRILHA DO MONSTRUOSO — camada mecânica (números), separada do texto oficial.
//
// Fontes (verificadas página a página, PDF em mão, na íntegra):
//   Combatente     — Sobrevivendo ao Horror, p. 17-21
//   Especialista   — Arquivos Secretos 7, p. 81-84
//   Ocultista      — Arquivos Secretos 7, p. 85-88
//
// As 3 são estruturalmente DIFERENTES entre si — não é o mesmo texto reescrito
// 3 vezes com números trocados. Combatente ganha resistência a dano (RD) e
// penalidades de perícia por PAR específico por elemento. Especialista ganha
// "soma o atributo em testes desse atributo" + drenar um atributo (não o do
// elemento) para intensificar o efeito. Ocultista não tem RD nem dano extra
// nenhum — é inteiramente sobre marcar rituais na pele (poder "Tatuagem
// Ritualística") e PE. Por isso os campos abaixo não são simétricos entre
// classes; onde uma classe não tem uma mecânica, o campo fica ausente/vazio.
//
// Patamares: 10% / 40% / 65% / 99% (tabela de NEX normal).
//
// REGRA-MÃE (confirmada pelo utilizador): TUDO nesta trilha só está em efeito
// enquanto a etapa ritualística de hoje estiver ativa (`monstruosoAtivoHoje`).
// A ÚNICA exceção são os efeitos que o livro descreve explicitamente como
// "permanente(s)":
//
//   1. -1 Presença aos 65% (as 3 classes, os 4 elementos — texto no parágrafo
//      geral de "Ser Assustador"/"Ser Expurgado"/"Ser Rasgado"). Aos 99%:
//      Especialista e Ocultista perdem MAIS -1 (universal, todos os
//      elementos, total -2). O Combatente NÃO repete a perda no parágrafo
//      geral de "Ser Aterrorizante" (99%) — só o elemento MORTE tem uma
//      segunda perda de -1 Presença (associada a +1 Vigor), no texto
//      específico desse elemento. Os outros 3 elementos do Combatente ficam
//      só no -1 dos 65%. Ver PRESENCA_PERMANENTE_PATAMARES.
//
//   2. Só no Combatente, em "Ser Aterrorizante" (99%): "Os efeitos por
//      executar sua etapa ritualística se tornam permanentes (mas você ainda
//      precisa executá-la para evitar sentir fome e sede)". A partir daqui
//      TUDO o que a trilha dá ao Combatente fica sempre ligado, mesmo sem
//      ativar a etapa nesse dia. Especialista e Ocultista NÃO têm esta frase
//      — para eles é sempre diário, mesmo aos 99%. Ver TUDO_PERMANENTE_DESDE.

export const PATAMARES_MONSTRUOSO = [10, 40, 65, 99];

export const ELEMENTOS_MONSTRUOSO = ['Sangue', 'Morte', 'Conhecimento', 'Energia'];

// Cor de referência de cada elemento — usada na interface para colorir danos,
// resistências e outros textos ligados ao elemento.
export const COR_ELEMENTO = { Sangue: '#c01521', Morte: '#969ba1', Conhecimento: '#d8b53c', Energia: '#a15cd8' };

// Atributo associado a cada elemento (usado em "soma X em testes baseados
// nesse atributo", "usa X para PE", etc.).
export const ATRIBUTO_DO_ELEMENTO = {
  Sangue: 'for',
  Morte: 'vig',
  Conhecimento: 'int',
  Energia: 'agi',
};

// Perícias penalizadas por classe. Combatente pune um PAR diferente por
// elemento; Especialista e Ocultista punem sempre as mesmas 3 (Diplomacia,
// Enganação, Intuição).
export const PERICIAS_PENALIZADAS = {
  combatente: {
    Sangue: ['ciencias', 'intuicao'],
    Morte: ['diplomacia', 'enganacao'],
    Conhecimento: ['atletismo', 'acrobacia'],
    Energia: ['investigacao', 'percepcao'],
  },
  especialista: {
    Sangue: ['diplomacia', 'enganacao', 'intuicao'],
    Morte: ['diplomacia', 'enganacao', 'intuicao'],
    Conhecimento: ['diplomacia', 'enganacao', 'intuicao'],
    Energia: ['diplomacia', 'enganacao', 'intuicao'],
  },
  ocultista: {
    Sangue: ['diplomacia', 'enganacao', 'intuicao'],
    Morte: ['diplomacia', 'enganacao', 'intuicao'],
    Conhecimento: ['diplomacia', 'enganacao', 'intuicao'],
    Energia: ['diplomacia', 'enganacao', 'intuicao'],
  },
};

/**
 * Progressão da penalidade nas perícias acima, por patamar de NEX.
 * Combatente: sempre em dado (-Ø = -1 dado da pool), não sobe mais depois
 * dos 40%. Especialista/Ocultista: começa em número fixo (-2, depois -5) e só
 * nos dois últimos patamares passa a ser penalidade de dado (-Ø, -2Ø).
 */
export const PROGRESSAO_PENALIDADE = {
  combatente: { 10: { dados: -1 }, 40: { dados: -2 }, 65: { dados: -2 }, 99: { dados: -2 } },
  especialista: { 10: { flat: -2 }, 40: { flat: -5 }, 65: { dados: -1 }, 99: { dados: -2 } },
  ocultista: { 10: { flat: -2 }, 40: { flat: -5 }, 65: { dados: -1 }, 99: { dados: -2 } },
};

/**
 * Resistência a dano por executar a etapa ritualística. SÓ o Combatente tem
 * esta RD "genérica" (que sobe com o patamar). O Especialista tem uma RD
 * própria, mas só no elemento Sangue, com uma fórmula completamente diferente
 * (ver DRENAGEM_FORMULA). O Ocultista não tem RD nenhuma.
 *
 * Por pedido explícito: isto NÃO entra em nenhum cálculo de dano/bloqueio —
 * fica só como texto informativo, colorido pelo elemento, no cartão da
 * trilha (mostra-se apenas o patamar atual, nunca patamares futuros).
 */
export const RESISTENCIA_POR_PATAMAR = { 10: 5, 40: 10, 65: 15, 99: 20 };

/** Tipos de dano cobertos pela RD acima, por elemento (Combatente). */
export const RESISTENCIA_TIPOS_COMBATENTE = {
  Sangue: 'balístico e Sangue',
  Morte: 'perfuração e Morte',
  Conhecimento: 'balístico e Conhecimento',
  Energia: 'corte, eletricidade, fogo e Energia',
};

/**
 * Os mesmos tipos de RESISTENCIA_TIPOS_COMBATENTE acima, mas como ids de
 * `TIPOS_DANO` (engine/danoRecetor.js) — usado para somar automaticamente
 * este valor à Redução de Dano da ficha (ver `reducaoDanoTrilhaAtiva` em
 * engine/monstruoso.js). "Resistência a Dano X" no livro é RD fixa (desconta
 * X do dano), não a Resistência (½ dano) da ficha — por pedido explícito do
 * utilizador.
 */
export const RESISTENCIA_TIPOS_COMBATENTE_IDS = {
  Sangue: ['balistico', 'sangue'],
  Morte: ['perfuracao', 'morte'],
  Conhecimento: ['balistico', 'conhecimento'],
  Energia: ['corte', 'eletricidade', 'fogo', 'energia'],
};

/** Energia (Combatente), 65%+: "Resistência a dano passa a cobrir também dano químico" — soma-se a RESISTENCIA_TIPOS_COMBATENTE_IDS.Energia a partir deste patamar. */
export const RESISTENCIA_ENERGIA_QUIMICO_DESDE = 65;

/** O que cada classe recupera ao fazer a etapa ritualística, por patamar. */
export const RECUPERACAO_POR_PATAMAR = {
  combatente: { 10: null, 40: null, 65: null, 99: null }, // Combatente não recupera PV/PE ao fazer a etapa
  especialista: {
    10: { recurso: 'pv', dados: 1, faces: 8, bonus: 1 },
    40: { recurso: 'pv', dados: 2, faces: 8, bonus: 2 },
    65: { recurso: 'pv', dados: 3, faces: 8, bonus: 3 },
    99: { recurso: 'pv', dados: 4, faces: 8, bonus: 4 },
  },
  ocultista: {
    10: { recurso: 'pe', dados: 1, faces: 4, bonus: 0 },
    40: { recurso: 'pe', dados: 1, faces: 6, bonus: 0 },
    65: { recurso: 'pe', dados: 1, faces: 8, bonus: 0 },
    99: { recurso: 'pe', dados: 1, faces: 12, bonus: 0 },
  },
};

/**
 * Consome "Componentes Ritualísticos" do inventário ao fazer a etapa?
 * Combatente (SaH) não pede um item da lista — é uma etapa narrativa (beber
 * sangue, inalar cinzas...). Especialista e Ocultista (AS07) pedem-no
 * explicitamente ("...consome o componente").
 */
export const CONSOME_COMPONENTE = {
  combatente: false,
  especialista: true,
  ocultista: true,
};

/**
 * A partir de que patamar o atributo do elemento passa a determinar os PE
 * (em vez de Presença) — e, para o Especialista/Ocultista, também a DT dos
 * seus rituais (não automatizado, é só nota).
 *
 * Especialista/Ocultista: sempre desde os 10%, nos 4 elementos.
 * Combatente: é POR ELEMENTO, não uma regra única da classe — Sangue, Morte e
 * Conhecimento ganham-no aos 40%; Energia NUNCA o ganha (não está escrito em
 * lado nenhum do texto de Energia, em nenhum patamar).
 */
export const PE_POR_ATRIBUTO_DESDE = {
  combatente: { Sangue: 40, Morte: 40, Conhecimento: 40, Energia: null },
  especialista: { Sangue: 10, Morte: 10, Conhecimento: 10, Energia: 10 },
  ocultista: { Sangue: 10, Morte: 10, Conhecimento: 10, Energia: 10 },
};

/**
 * "Soma o atributo do elemento em testes baseados nesse atributo" — bónus
 * plano (não é dado extra) igual ao valor do atributo, em cima de todas as
 * perícias que já usam esse atributo. SÓ existe no Especialista (10%+, nos 4
 * elementos). O Ocultista NÃO tem esta frase em lado nenhum do seu texto —
 * só tem a troca do atributo de PE/DT e o +1 ponto de atributo.
 */
export const SOMA_ATRIBUTO_EM_PERICIAS = {
  combatente: false,
  especialista: true,
  ocultista: false,
};

/** Desde que patamar (por elemento) a soma acima está em vigor. */
export const SOMA_ATRIBUTO_DESDE = { Sangue: 10, Morte: 10, Conhecimento: 10, Energia: 10 };

/**
 * Efeitos extra do Combatente ligados à etapa do dia, além do padrão
 * atributo/RD/penalidade: Defesa (Conhecimento), um dado de bónus a UMA
 * perícia nomeada (Morte, Intimidação), a troca do atributo que governa UMA
 * perícia nomeada (Conhecimento, Enganação passa a usar Intelecto), e +1
 * turno de tolerância a "morrendo" (Morte). Tudo desde o patamar indicado.
 * Não há nenhum bónus a PV máximo no texto do Combatente — isso só existe na
 * variante do Especialista (PV recuperado ao fazer a etapa, já coberto por
 * RECUPERACAO_POR_PATAMAR).
 */
export const EFEITOS_DIARIOS_COMBATENTE = {
  Morte: {
    dadosPericia: { desde: 40, pericia: 'intimidacao', dados: 1 }, // "+Ø em Intimidação"
    turnosMorrendoExtra: { desde: 40, valor: 1 }, // "morre com 4 turnos morrendo, em vez de 3"
  },
  Conhecimento: {
    defesaSomaAtributo: { desde: 10, atributo: 'int' }, // "soma seu Intelecto na Defesa"
    atributoPericia: { desde: 40, pericia: 'enganacao', atributo: 'int' }, // "usa Intelecto como atributo-chave para Enganação"
  },
};

/**
 * Deslocamento: só a variante de Especialista dá bónus (Energia). Começa em
 * +6m aos 10% e, aos 99% ("Ser Apavorante" substitui "Ser Experimentado"),
 * passa a +12m — não soma, substitui o valor anterior (mesmo padrão da
 * "Ser Testado"/"Ser Apavorante" verificado nas p.81-84 do livro).
 */
export const DESLOCAMENTO_ENERGIA_EXTRA = {
  combatente: { 10: 0 },
  especialista: { 10: 6, 99: 12 },
  ocultista: { 10: 0 },
};

/** O valor de deslocamento extra em vigor num dado patamar (o mais alto já alcançado). */
export function deslocamentoEnergiaExtraAtual(classe, patamar) {
  const tabela = DESLOCAMENTO_ENERGIA_EXTRA[classe] || {};
  let valor = 0;
  for (const p of Object.keys(tabela).map(Number).sort((a, b) => a - b)) {
    if (patamar >= p) valor = tabela[p];
  }
  return valor;
}

/**
 * PV temporários IMEDIATOS do Especialista-Morte — distintos do "+2d8 PV
 * temp. por CENA" da drenagem "Ser Testado" (40%+, ver `efeitosDrenagem` em
 * engine/monstruoso.js). Este é rolado uma vez ao ativar a etapa de hoje
 * ("no início da transformação"), começa em 2d6 aos 10% e sobe para 4d6 aos
 * 99% ("Ser Apavorante" substitui "Ser Experimentado" — mesmo padrão de
 * substituição confirmado nas p.81-84).
 */
export const PV_TEMP_IMEDIATO_MORTE = { 10: { dados: 2, faces: 6 }, 99: { dados: 4, faces: 6 } };

/** A entrada de PV_TEMP_IMEDIATO_MORTE em vigor num dado patamar (a mais alta já alcançada), ou null. */
export function pvTempImediatoMorteAtual(patamar) {
  let atual = null;
  for (const p of Object.keys(PV_TEMP_IMEDIATO_MORTE).map(Number).sort((a, b) => a - b)) {
    if (patamar >= p) atual = PV_TEMP_IMEDIATO_MORTE[p];
  }
  return atual;
}

/**
 * Quantas perícias livres o Especialista-Conhecimento escolhe no total —
 * 2 desde os 10% ("Ser Experimentado"), sobe para 3 aos 99% ("Ser
 * Apavorante" substitui). As 2 primeiras nunca perdem a escolha original ao
 * subir de patamar — só se soma uma 3ª.
 */
export const PERICIAS_LIVRES_CONHECIMENTO_POR_PATAMAR = { 10: 2, 99: 3 };

/** Quantas perícias livres estão desbloqueadas num dado patamar (a mais alta já alcançada). */
export function quantidadePericiasLivresConhecimento(patamar) {
  let n = 0;
  for (const p of Object.keys(PERICIAS_LIVRES_CONHECIMENTO_POR_PATAMAR).map(Number).sort((a, b) => a - b)) {
    if (patamar >= p) n = PERICIAS_LIVRES_CONHECIMENTO_POR_PATAMAR[p];
  }
  return n;
}

/**
 * Grande/Enorme (só Especialista, Sangue): +2 em testes de manobras / -2 em
 * Furtividade desde os 10% ("Grande"); passa a +5/-5 desde os 99% ("Enorme",
 * substitui). "Manobras" não é uma perícia autónoma nesta ficha — fica como
 * nota; a Furtividade É uma perícia e entra como penalidade plana real.
 */
export const TAMANHO_ESPECIALISTA_SANGUE = {
  10: { nome: 'Grande', manobras: 2, furtividade: -2 },
  99: { nome: 'Enorme', manobras: 5, furtividade: -5 },
};

/**
 * Treino/bónus de perícia em Ocultismo, concedido pela etapa de hoje (10%+).
 * `flatSeJaTreinado` é o bónus se a perícia já estiver treinada (na ficha,
 * de verdade) por outra via — nunca os dois ao mesmo tempo: ou a trilha
 * força o treino (0 -> 5), ou soma +2 a quem já é treinado (5 -> 7). As 3
 * classes usam a MESMA regra condicional (por pedido explícito: nunca somar
 * as duas coisas, nunca dar 9).
 */
export const TREINO_INICIAL = {
  combatente: { pericia: 'ocultismo', flatSeJaTreinado: 2 },
  especialista: { pericia: 'ocultismo', flatSeJaTreinado: 2 },
  ocultista: { pericia: 'ocultismo', flatSeJaTreinado: 2 },
};

/**
 * Patamares em que a personagem perde 1 ponto de Presença PERMANENTEMENTE,
 * por classe e elemento (ver nota 1 da regra-mãe acima). Aplica-se uma única
 * vez cada, na primeira vez que a etapa de hoje for ativada depois de
 * atingir esse patamar.
 */
export function patamaresPresencaPermanente(classe, elemento) {
  if (classe === 'combatente') return elemento === 'Morte' ? [65, 99] : [65];
  return [65, 99]; // especialista / ocultista: sempre os dois, nos 4 elementos
}

/**
 * Só o Combatente: a partir deste patamar, TODOS os efeitos da trilha ficam
 * sempre ligados, mesmo sem ativar a etapa de hoje. Especialista e Ocultista
 * não têm este texto — para eles é sempre `null`.
 */
export const TUDO_PERMANENTE_DESDE = {
  combatente: 99,
  especialista: null,
  ocultista: null,
};

/**
 * Efeitos MECÂNICOS por patamar — cada entrada é um número que o motor
 * calcula ao vivo. Efeitos puramente narrativos/situacionais (que a ficha não
 * automatiza — ações que exigem escolha caso a caso, testes de resistência
 * do mestre, etc.) NÃO estão aqui: estão em TEXTOS_POR_PATAMAR, como nota
 * informativa colorida, ao lado destes.
 *
 * tipo:
 *   'atributo'        -> { atributo, delta }
 *   'dados-pericia'   -> { pericia, dados }  (bónus/penalidade de POOL numa perícia nomeada)
 *   'atributo-pericia'-> { pericia, atributo } (troca o atributo-chave dessa perícia)
 *   'flat-pericia'    -> { pericia, flat }   (bónus/penalidade plana numa perícia nomeada)
 *   'ataque-bonus-dado' -> { faces, alvo: 'corpo-a-corpo'|'todos' } (dado extra somado ao TOTAL do teste de ataque, não à pool)
 *   'ataque-natural'  -> { nome, dano, critico, tipoDano }
 *   'ritual'          -> { nome } (fixo, sem escolha)
 *   'ritual-escolha'  -> { elemento, circulo } (a personagem escolhe; a escolha fica guardada)
 *   'pericias-livres' -> { quantidade } (escolher N perícias para treinar; a escolha fica guardada)
 */
export const EFEITOS_POR_PATAMAR = {
  combatente: {
    Sangue: [
      { patamar: 65, tipo: 'ataque-natural', nome: 'Mordida (Monstruoso)', dano: '1d8', critico: '20/x2', tipoDano: 'perfuração' },
      { patamar: 99, tipo: 'atributo', atributo: 'int', delta: -1 },
      { patamar: 99, tipo: 'atributo', atributo: 'for', delta: 1 },
      { patamar: 99, tipo: 'ritual', nome: 'Forma Monstruosa' },
    ],
    Morte: [
      { patamar: 99, tipo: 'atributo', atributo: 'vig', delta: 1 },
      { patamar: 99, tipo: 'atributo', atributo: 'pre', delta: -1 }, // segunda perda, SÓ Morte (ver patamaresPresencaPermanente) — aqui é só o registo do texto; a mutação real de Presença é feita à parte, este delta não entra em atributosEfetivos (Presença nunca é "efetiva", é mutação real)
      { patamar: 99, tipo: 'ritual', nome: 'Fim Inevitável' },
    ],
    Conhecimento: [
      { patamar: 40, tipo: 'atributo', atributo: 'int', delta: 1 },
      { patamar: 99, tipo: 'atributo', atributo: 'for', delta: -1 },
      { patamar: 99, tipo: 'atributo', atributo: 'int', delta: 1 },
      { patamar: 99, tipo: 'ritual-escolha', elemento: 'conhecimento', circulo: 4 },
    ],
    Energia: [
      { patamar: 99, tipo: 'atributo', atributo: 'for', delta: -1 },
      { patamar: 99, tipo: 'atributo', atributo: 'agi', delta: 1 },
      { patamar: 99, tipo: 'ritual', nome: 'Deflagração de Energia' },
    ],
  },
  especialista: {
    Sangue: [
      { patamar: 65, tipo: 'atributo', atributo: 'for', delta: 1 },
      { patamar: 65, tipo: 'ataque-bonus-dado', faces: 8, alvo: 'corpo-a-corpo' }, // "+1d8 em testes de ataques corpo a corpo"
      { patamar: 99, tipo: 'atributo', atributo: 'for', delta: 1 },
      { patamar: 99, tipo: 'ritual', nome: 'Vínculo de Sangue' },
    ],
    Morte: [
      { patamar: 65, tipo: 'atributo', atributo: 'vig', delta: 1 },
      { patamar: 99, tipo: 'atributo', atributo: 'vig', delta: 1 },
      { patamar: 99, tipo: 'ritual', nome: 'Distorção Temporal' },
    ],
    Conhecimento: [
      { patamar: 10, tipo: 'pericias-livres', quantidade: 2 },
      { patamar: 65, tipo: 'atributo', atributo: 'int', delta: 1 },
      // "Ação completa + 3 PE, tocando a cabeça (própria ou de outro) com o
      // braço" — NÃO é uma conjuração normal (sem teste de Ocultismo, sem
      // custo por círculo): por pedido explícito, aparecem na lista de
      // rituais da personagem mas o botão "Conjurar" só desconta 3 PE.
      { patamar: 65, tipo: 'ritual-toque', nome: 'Detecção de Ameaças', custoPe: 3 },
      { patamar: 65, tipo: 'ritual-toque', nome: 'Mergulho Mental', custoPe: 3 },
      { patamar: 99, tipo: 'atributo', atributo: 'int', delta: 1 },
      { patamar: 99, tipo: 'ritual', nome: 'Controle Mental' }, // fixo — não é à escolha
    ],
    Energia: [
      { patamar: 65, tipo: 'atributo', atributo: 'agi', delta: 1 },
      { patamar: 99, tipo: 'atributo', atributo: 'agi', delta: 1 },
      { patamar: 99, tipo: 'ritual', nome: 'Teletransporte' },
    ],
  },
  ocultista: {
    Sangue: [
      { patamar: 10, tipo: 'atributo', atributo: 'for', delta: 1 },
      { patamar: 99, tipo: 'atributo', atributo: 'for', delta: 1 },
      { patamar: 99, tipo: 'ritual-escolha', elemento: 'sangue', circulo: 4 },
      { patamar: 99, tipo: 'ritual-escolha', elemento: 'medo', circulo: 4 },
    ],
    Morte: [
      { patamar: 10, tipo: 'atributo', atributo: 'vig', delta: 1 },
      { patamar: 65, tipo: 'ritual', nome: 'Cicatrização' },
      { patamar: 99, tipo: 'atributo', atributo: 'vig', delta: 1 },
      { patamar: 99, tipo: 'ritual-escolha', elemento: 'morte', circulo: 4 },
      { patamar: 99, tipo: 'ritual-escolha', elemento: 'medo', circulo: 4 },
    ],
    Conhecimento: [
      { patamar: 10, tipo: 'atributo', atributo: 'int', delta: 1 },
      { patamar: 99, tipo: 'atributo', atributo: 'int', delta: 1 },
      { patamar: 99, tipo: 'ritual-escolha', elemento: 'conhecimento', circulo: 4 },
      { patamar: 99, tipo: 'ritual-escolha', elemento: 'medo', circulo: 4 },
    ],
    Energia: [
      { patamar: 10, tipo: 'atributo', atributo: 'agi', delta: 1 },
      { patamar: 99, tipo: 'atributo', atributo: 'agi', delta: 1 },
      { patamar: 99, tipo: 'ritual-escolha', elemento: 'energia', circulo: 4 },
      { patamar: 99, tipo: 'ritual-escolha', elemento: 'medo', circulo: 4 },
    ],
  },
};

/**
 * Notas informativas por patamar — efeitos reais do livro que são situacionais,
 * exigem uma escolha caso a caso, ou dependem de mecânicas que esta ficha não
 * modela (marcar rituais na pele, contra-ataques, testes do mestre, etc.).
 * Mostram-se como texto na caixa de informação, coloridas pelo elemento,
 * exatamente com o mesmo critério de "só o que está ativo agora" das outras
 * entradas — mas nunca entram em nenhum cálculo.
 */
export const TEXTOS_POR_PATAMAR = {
  combatente: {
    Sangue: [
      { patamar: 10, texto: 'Contra-ataque bem-sucedido: soma o Vigor na rolagem de dano.' },
      { patamar: 40, texto: 'Ação de movimento + 1 ou mais PE (limitado pela Força): recupera 1d8 PV por PE gasto.' },
      { patamar: 65, texto: '50% de chance de ignorar o dano adicional de um crítico ou ataque furtivo.' },
      { patamar: 65, texto: '1x/ronda, ao usar Agredir com outra arma: gasta 1 PE para ataque corpo a corpo extra com a mordida.' },
      { patamar: 99, texto: 'Sempre que causa dano com a mordida, recupera 5 PV (x2 em crítico).' },
      { patamar: 99, texto: 'Forma Monstruosa: sempre que sofre dano, teste de Vontade DT 10+dano ou a próxima ação padrão tem de ser conjurar o ritual.' },
    ],
    Morte: [
      { patamar: 10, texto: 'Imunidade a fadiga.' },
      { patamar: 40, texto: 'Não precisa de comer/beber para viver (mas continua a sofrer a fome paranormal da trilha).' },
      { patamar: 65, texto: 'Início de cada turno morrendo: teste de Vigor DT 15 — se passar, acorda com 1 PV.' },
      { patamar: 65, texto: 'Crítico em combate ou reduzir um inimigo a 0 PV: recupera 2 PE.' },
      { patamar: 99, texto: 'Imunidade a dano de Morte. Imortal — se morrer, volta no dia seguinte (a menos que 0 PV venha de fogo ou Energia).' },
    ],
    Conhecimento: [
      { patamar: 10, texto: 'Visão no escuro.' },
      { patamar: 65, texto: 'Pode deixar de ser treinado numa perícia para ganhar um banco de dados de bónus (= Intelecto); recupera as perícias no próximo interlúdio.' },
      { patamar: 99, texto: 'Percepção às Cegas.' },
      { patamar: 99, texto: 'Sempre que conjura o ritual de 4º círculo escolhido, perde a memória de tudo desde o início da cena.' },
    ],
    Energia: [
      { patamar: 10, texto: 'Soma a Agilidade na RD recebida por um bloqueio bem-sucedido.' },
      { patamar: 40, texto: 'Ataque corpo a corpo: gasta 1+ PE (limitado pela Agilidade) por +1d6 de dano de Energia por PE gasto.' },
      { patamar: 65, texto: 'Resistência a dano passa a cobrir também dano químico.' },
      { patamar: 65, texto: 'Ação de movimento + tocar fonte elétrica: recupera PE (1d4 portátil / 2d4 grande / 4d4 do tamanho de uma casa) — descarrega a fonte.' },
      { patamar: 99, texto: 'Flutua a 1,5m, desloc. 12m, ignora terreno difícil e dano de queda; atravessa espaços de criatura Minúscula; imune a paralisia de origem física; só manipula objetos com a mente (um de cada vez).' },
    ],
  },
  especialista: {
    Sangue: [
      { patamar: 40, texto: 'Base: +1d6 dano de Sangue e RD 2 ao fazer o experimento (some com a drenagem abaixo).' },
      { patamar: 65, texto: '1x/ronda, ao atacar com outra arma: gasta 1 PE para ataque desarmado extra com o braço.' },
    ],
    Morte: [
      { patamar: 10, texto: '+2d6 PV temporários (rolados automaticamente ao ativar a etapa de hoje) e ação padrão adicional por cena.' },
      { patamar: 40, texto: 'Base: +1 turno de tolerância a "morrendo" e +2d8 PV temp. no início de cada cena (soma com a drenagem abaixo).' },
      { patamar: 65, texto: 'Ao tocar um item pela 1ª vez: 3 PE para envelhecê-lo (50 de dano de Morte) ou reviver as memórias da última pessoa que o tocou (visão nebulosa de 1 minuto do que ela fez enquanto esteve com o item — não é uma ressurreição).' },
      { patamar: 99, texto: 'Os efeitos de Ser Experimentado mudam: +4d6 PV temporários (em vez de 2d6, rolados automaticamente ao ativar a etapa) e 2 ações padrão adicionais por cena (em vez de 1).' },
    ],
    Conhecimento: [
      { patamar: 40, texto: 'Base: +1d6 em testes baseados em Intelecto ao fazer o experimento (soma com a drenagem abaixo).' },
      { patamar: 65, texto: 'Ação completa + 3 PE, tocando a cabeça (própria ou de outro) com o braço: efeito de Detecção de Ameaças (própria) ou Mergulho Mental por 3 rondas (outro).' },
      { patamar: 99, texto: 'Os efeitos de Ser Experimentado mudam: escolhes 3 perícias treinadas (em vez de 2) e todas ficam em grau Expert (em vez de Treinado).' },
    ],
    Energia: [
      { patamar: 10, texto: '1x/ronda, sacar item como ação livre (cumulativo com bandoleira).' },
      { patamar: 40, texto: 'Base: +1d6 em testes de ataque e +2 na Defesa ao fazer o experimento (soma com a drenagem abaixo).' },
      { patamar: 65, texto: 'Ação de movimento + 2 PE: atravessa superfícies sólidas até o fim da cena (+5 em testes relacionados, a critério do mestre).' },
      { patamar: 65, texto: 'Ação de interlúdio: acopla um item à mão do braço, usando-o sem ocupar a mão.' },
      { patamar: 99, texto: 'Os efeitos de Ser Experimentado mudam: sacar item como ação livre passa a 3x/rodada (em vez de 1x) e o deslocamento extra passa a +12m (em vez de +6m).' },
    ],
  },
  ocultista: {
    Sangue: [
      { patamar: 40, texto: 'Tatuagem Ritualística: rituais de Sangue marcados na pele aplicam-se a todos os alvos ao alcance, não só a si mesmo. 1x/cena, se machucado ou fatigado, conjura um ritual marcado como reação. +5 em testes de concentração com rituais de Sangue marcados.' },
      { patamar: 65, texto: '1x/cena: gasta ação de movimento + 2d8+2 PV para servir sangue a um aliado adjacente — se aceitar, +Ø em testes de Agilidade/Força/Vigor até o fim da cena. DT dos rituais de Sangue marcados +2.' },
      { patamar: 99, texto: 'Conjura rituais de Sangue marcados sem fala, gestos ou componentes.' },
    ],
    Morte: [
      { patamar: 40, texto: 'Tatuagem Ritualística: rituais de Morte marcados aplicam-se a todos os alvos ao alcance. 1x/cena, se morrendo ou com sentidos afetados, conjura um ritual marcado como reação. +5 em testes de concentração com rituais de Morte marcados.' },
      { patamar: 65, texto: 'Rituais de Morte diferentes de Cicatrização podem ser conjurados como ação de movimento. DT dos rituais de Morte marcados +2.' },
      { patamar: 99, texto: 'Conjura rituais de Morte marcados sem fala, gestos ou componentes.' },
    ],
    Conhecimento: [
      { patamar: 40, texto: 'Tatuagem Ritualística: rituais de Conhecimento marcados aplicam-se a todos os alvos ao alcance. 1x/cena, sob condição mental ou de medo, conjura um ritual marcado como reação. +5 em testes de concentração com rituais de Conhecimento marcados.' },
      { patamar: 65, texto: 'Ao conjurar um ritual de Conhecimento: gasta ação de movimento + 2 PE por 5 perguntas sim/não sobre o alvo (ou visão do oculto, se o alvo for a própria personagem). DT dos rituais de Conhecimento marcados +2.' },
      { patamar: 99, texto: 'Conjura rituais de Conhecimento marcados sem fala, gestos ou componentes.' },
    ],
    Energia: [
      { patamar: 40, texto: 'Tatuagem Ritualística: rituais de Energia marcados aplicam-se a todos os alvos ao alcance. 1x/cena, sob paralisia ou sentidos afetados, conjura um ritual marcado como reação. +5 em testes de concentração com rituais de Energia marcados.' },
      { patamar: 65, texto: 'Ao conjurar um ritual de Energia: gasta ação de movimento + 3 PE para teletransportar-se 3m e ganhar Defesa igual ao PE gasto no ritual, por 1 rodada. DT dos rituais de Energia marcados +2.' },
      { patamar: 99, texto: 'Conjura rituais de Energia marcados sem fala, gestos ou componentes.' },
    ],
  },
};

/**
 * Consequências narrativas fixas da trilha (SaH p. 21, "Monstruosa
 * Transformação" — aplicam-se às 3 variantes por igual). Disparam ao ATINGIR
 * o NEX indicado — não dependem da etapa de hoje estar ativa.
 */
export const CONSEQUENCIAS = {
  perturbado: { desde: 75, nota: 'Perturbado (permanente): as suas ações já não são aceites pela Ordem — ela vai bani-lo e pode chegar a caçá-lo. Se ainda ajudar antigos colegas, perde acesso a equipamento da Ordem (equipamento inicial de missão de uma patente abaixo, conseguido por conta própria).' },
  sanidadeMinima: {
    desde: 99,
    valor: 1,
    nota: 'Sanidade reduzida a 1. Sempre que for enlouquecer, fica confuso em vez de sofrer o efeito de insanidade normal. Se enlouquecer com 99% de NEX, torna-se permanentemente uma criatura do Outro Lado.',
    // Regra opcional "Jogando sem Sanidade" (SaH p. 104): não há Sanidade
    // para reduzir — o livro troca o efeito por este, ligado à Determinação.
    notaSemSanidade: 'Com a regra opcional "Jogando sem Sanidade": está sempre perturbado e fica enlouquecendo (e confuso) sempre que perde 1 ponto de Determinação por qualquer efeito, exceto para pagar custos de habilidades e itens. Se enlouquecer com 99% de NEX, torna-se permanentemente uma criatura do Outro Lado.',
  },
};

/**
 * Trilhas correspondentes por classe, para identificar `personagem.trilhaId`.
 */
export const TRILHA_ID_POR_CLASSE = {
  combatente: 'monstruoso',
  especialista: 'monstruoso-especialista',
  ocultista: 'monstruoso-ocultista',
};

/**
 * "Ser Testado" (Especialista, 40%+): drenar pontos de UM atributo (nunca o
 * do próprio elemento) intensifica o efeito enquanto a etapa está ativa — é
 * diário: ao desativar, os pontos voltam. Sangue drena Intelecto, Morte
 * drena Força, Conhecimento drena Agilidade, Energia drena Vigor (está mesmo
 * assim no livro, cruzado).
 */
export const DRENAGEM_ATRIBUTO = {
  Sangue: 'int',
  Morte: 'for',
  Conhecimento: 'agi',
  Energia: 'vig',
};

export const NOME_PODER_POR_PATAMAR = {
  combatente: { 10: 'Ser Amaldiçoado', 40: 'Ser Macabro', 65: 'Ser Assustador', 99: 'Ser Aterrorizante' },
  especialista: { 10: 'Ser Experimentado', 40: 'Ser Testado', 65: 'Ser Expurgado', 99: 'Ser Apavorante' },
  ocultista: { 10: 'Ser Escarificado', 40: 'Ser Perfurado', 65: 'Ser Rasgado', 99: 'Ser Mutilado' },
};
