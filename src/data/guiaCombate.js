// GUIA RÁPIDO DE AÇÕES DE COMBATE — Livro Base, cap. 4 "Combate", p. 84-89.
// Resumo de consulta rápida (cheat sheet): só o essencial de cada ação/regra,
// sem substituir o livro para casos especiais. Frases condensadas a partir do
// texto oficial — nada inventado, só encurtado para caber num cartão.

/** No teu turno podes fazer, no máximo, uma destas combinações (mais quantas ações livres e reações quiseres). */
export const COMBINACOES_TURNO = [
  'Uma Ação Padrão + uma Ação de Movimento',
  'OU duas Ações de Movimento',
  'OU uma Ação Completa (abres mão da padrão e da de movimento)',
];

export const ACOES_PADRAO = [
  {
    nome: 'Agredir',
    texto:
      'Ataca com uma arma corpo a corpo (qualquer inimigo a 1,5m) ou à distância (até ao alcance da arma, ' +
      'ou ao dobro sofrendo −1 dado). Atirar contra alguém em combate corpo a corpo dá −1 dado.',
  },
  {
    nome: 'Manobra de Combate',
    texto:
      'Substitui um ataque corpo a corpo (só com arma/ataque desarmado) por Agarrar, Derrubar, Desarmar, ' +
      'Empurrar ou Quebrar — teste de Luta oposto ao alvo. Ver secção "Manobras" abaixo.',
  },
  {
    nome: 'Atropelar',
    texto:
      'Durante um movimento, avanças pelo espaço de um ser. Ele dá passagem ou resiste com teste de manobra ' +
      'oposto; se venceres, cai e continuas o avanço. É ação livre se feita durante uma Investida.',
  },
  { nome: 'Conjurar um Ritual', texto: 'A maioria dos rituais gasta uma Ação Padrão.' },
  {
    nome: 'Fintar',
    texto:
      'Teste de Enganação oposto ao Reflexos de um ser a alcance curto. Se passares, ele fica desprevenido ' +
      'contra o teu próximo ataque, até ao fim do teu próximo turno.',
  },
  {
    nome: 'Preparar',
    texto:
      'Preparas uma ação (padrão, de movimento ou livre) para disparar como reação quando a condição que ' +
      'definiste acontecer, antes do teu próximo turno. Se não a usares, perdes a ação.',
  },
  { nome: 'Usar Habilidade ou Item', texto: 'Algumas habilidades e itens exigem uma Ação Padrão para serem usados.' },
];

export const MANOBRAS_COMBATE = [
  {
    nome: 'Agarrar',
    texto:
      'Só com ataque desarmado. O alvo agarrado fica desprevenido e imóvel, sofre −1 dado nos testes de ' +
      'ataque e só pode atacar com armas leves; solta-se com uma Ação Padrão vencendo um teste de manobra. ' +
      'Enquanto agarras, ficas com uma mão ocupada e andas a metade do deslocamento (arrastando o alvo); ' +
      'podes largá-lo como ação livre. Podes atacar o alvo com a mão livre, ou trocar um ataque por outro ' +
      'teste de manobra — se venceres, causas dano de impacto de ataque desarmado. Um atacante à distância ' +
      'contra um alvo envolvido em Agarrar tem 50% de acertar o alvo errado.',
  },
  {
    nome: 'Derrubar',
    texto:
      'Deixas o alvo Caído — normalmente sem dano. Se venceres o teste oposto por 5+, também o empurras um ' +
      'quadrado à tua escolha; se isso o atirar de um precipício/parapeito, ele pode tentar um teste de ' +
      'Reflexos (DT 20) para se agarrar a uma beirada.',
  },
  {
    nome: 'Desarmar',
    texto:
      'Faz cair um item que o alvo segure (cai no mesmo sítio, salvo exceções). Se venceres por 5+, também o ' +
      'empurras um quadrado à tua escolha.',
  },
  {
    nome: 'Empurrar',
    texto:
      'Empurras o ser 1,5m; por cada 5 pontos de diferença no teste, +1,5m. Podes gastar uma Ação de ' +
      'Movimento para avançar junto com ele (até ao teu deslocamento).',
  },
  { nome: 'Quebrar', texto: 'Atinges um item que o alvo segure — usa as regras de "Quebrando Objetos" (Defesa do objeto + RD).' },
];

export const ACOES_MOVIMENTO = [
  { nome: 'Levantar-se', texto: 'Levantar do chão (ou de uma cama, cadeira…) exige uma Ação de Movimento.' },
  { nome: 'Manipular Item', texto: 'Pegar algo na mochila, abrir/fechar uma porta, atirar uma corda a alguém, etc.' },
  {
    nome: 'Mirar',
    texto:
      'Só se treinado em Pontaria: anula a penalidade de −1 dado em Pontaria contra um alvo em combate ' +
      'corpo a corpo, até ao fim do teu próximo turno.',
  },
  { nome: 'Movimentar-se', texto: 'Percorres uma distância igual ao teu deslocamento (normalmente 9m). Inclui nadar, escalar, etc.' },
  { nome: 'Sacar ou Guardar Item', texto: 'Sacar ou guardar um item. Alguns efeitos deixam fazer isto como ação livre.' },
];

export const ACOES_COMPLETAS = [
  { nome: 'Corrida', texto: 'Corres mais do que o deslocamento normal (perícia Atletismo).' },
  {
    nome: 'Golpe de Misericórdia',
    texto:
      'Golpe letal num oponente adjacente e indefeso: acerto crítico automático. Além do dano, 25% de chance ' +
      'de morte instantânea contra personagens/NPCs importantes, 75% contra NPCs secundários.',
  },
  {
    nome: 'Investida',
    texto:
      'Avanças até ao dobro do deslocamento (mín. 3m) em linha reta e atacas corpo a corpo no fim: +1 dado no ' +
      'ataque, mas −5 na Defesa até ao teu próximo turno. Não é possível em terreno difícil. Podes Atropelar ' +
      'como ação livre durante a Investida (mas não atropelar e atacar o mesmo alvo).',
  },
  { nome: 'Conjurar um Ritual (execução maior)', texto: 'Rituais com execução maior que uma Ação Completa gastam uma Ação Completa por rodada.' },
];

export const ACOES_LIVRES = [
  {
    nome: 'Atrasar',
    texto:
      'Age mais tarde na Iniciativa (podes atrasar até 0 menos o teu bónus de Iniciativa). Ao chegar a essa ' +
      'contagem, tens de agir ou perder o turno.',
  },
  { nome: 'Falar', texto: 'Falar é normalmente ação livre (≈20 palavras). Conjurar rituais/usar habilidades por voz não conta como livre.' },
  { nome: 'Jogar-se no Chão', texto: 'Ficas Caído — sem sofrer dano por te atirares.' },
  {
    nome: 'Largar um Item',
    texto: 'Deixar cair um item é ação livre; largá-lo para acertar algo é Ação Padrão; largá-lo para outro agarrar é Ação de Movimento.',
  },
];

/** Reações — só podes usar UMA destas por rodada, e antes do inimigo rolar o ataque. */
export const ACOES_DEFESA = [
  {
    nome: 'Bloqueio',
    texto: 'Se treinado em Fortitude: alvo de ataque corpo a corpo, gasta uma reação e recebes RD igual ao teu bónus de Fortitude contra esse ataque.',
  },
  {
    nome: 'Esquiva',
    texto: 'Se treinado em Reflexos: alvo de qualquer ataque, gasta uma reação e somas o teu bónus de Reflexos à Defesa contra esse ataque.',
  },
  {
    nome: 'Contra-ataque',
    texto: 'Se treinado em Luta: alvo de ataque corpo a corpo que ERROU, gasta uma reação para atacar esse atacante de volta.',
  },
];

export const COBERTURA_FLANQUEAR = [
  {
    nome: 'Cobertura',
    texto:
      'Atrás de algo que bloqueia o ataque (muro, carro, ser maior): +5 na Defesa. Traça uma linha entre os ' +
      'cantos dos quadrados do atacante e do alvo — se um obstáculo a interrompe, há cobertura.',
  },
  {
    nome: 'Cobertura total',
    texto: 'Os inimigos não te conseguem alcançar (ex.: atrás de uma parede) — impede seres alvo de ataques/habilidades, salvo indicação contrária.',
  },
  {
    nome: 'Flanquear',
    texto:
      'Lutas corpo a corpo contra um alvo e um aliado faz o mesmo do lado oposto (o alvo entre vocês): ambos ' +
      'recebem +1 dado no ataque contra ele. Não é possível flanquear à distância.',
  },
];

/** Tabela 4.4: Situações Especiais (Livro Base, p. 89). */
export const SITUACOES_ATACANTE = [
  { situacao: 'Caído', efeito: '−2 dados' },
  { situacao: 'Cego', efeito: '50% de chance de falha' },
  { situacao: 'Em posição elevada', efeito: '+1 dado' },
  { situacao: 'Flanqueando o alvo', efeito: '+1 dado (só corpo a corpo)' },
  { situacao: 'Invisível', efeito: '+2 dados (não se aplica a alvos cegos)' },
  { situacao: 'Ofuscado', efeito: '−1 dado' },
];

export const SITUACOES_ALVO = [
  { situacao: 'Caído', efeito: '−5 contra ataques corpo a corpo, +5 contra ataques à distância' },
  { situacao: 'Cego', efeito: '−5 na Defesa' },
  { situacao: 'Desprevenido', efeito: '−5 na Defesa' },
  { situacao: 'Sob camuflagem', efeito: '20% de chance de falha' },
  { situacao: 'Sob camuflagem total', efeito: '50% de chance de falha' },
  { situacao: 'Sob cobertura', efeito: '+5 na Defesa' },
  { situacao: 'Sob cobertura total', efeito: 'Não pode ser atacado' },
];
