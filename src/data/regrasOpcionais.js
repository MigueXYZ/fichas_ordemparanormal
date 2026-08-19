/**
 * Regras opcionais de "Sobrevivendo ao Horror".
 *
 * O próprio livro avisa: «O Livro de Regras de Ordem Paranormal RPG continua
 * sendo a versão padrão e oficial do jogo. (…) as regras opcionais são
 * exatamente isso — opcionais! Use-as apenas se quiser.»
 */

export const REGRAS_OPCIONAIS = [
  {
    id: 'nivelSeparado',
    nome: 'NEX & Experiência',
    resumo: 'Separa o nível de experiência do NEX.',
    pagina: 98,
    texto:
      'O NEX passa a representar só o quanto o agente foi exposto ao Outro Lado. ' +
      'A competência geral passa a ser o nível de experiência, que substitui o NEX ' +
      'em benefícios, pré-requisitos de habilidades de classe (menos poderes ' +
      'paranormais) e efeitos de origens baseados em NEX. 1 nível = 5% de NEX. ' +
      'Todo o personagem começa em nível 1 e sobe um nível de cada vez que subiria ' +
      '5% de NEX. O NEX cresce à parte: +1% por exposição moderada, +2% por ' +
      'exposição profunda, +5% por exposição total, e o círculo do ritual sempre ' +
      'que aprende um ritual. Só por exposição, o NEX não passa dos 99%.',
    efeito: 'Aparece um campo de Nível; as contas passam a usar o nível em vez do NEX.',
  },
  {
    id: 'semSanidade',
    nome: 'Jogando sem Sanidade',
    resumo: 'Junta Sanidade e Esforço em Pontos de Determinação.',
    pagina: 104,
    texto:
      'Personagens deixam de receber PE e Sanidade; em vez disso recebem Pontos de ' +
      'Determinação (PD) conforme a classe. Efeitos que gastariam pontos de esforço ' +
      'gastam PD; efeitos que causam dano mental ou perda de Sanidade aplicam-se aos ' +
      'PD. Todo o dano mental das criaturas baixa um passo por dado (d10→d8, d8→d6…) ' +
      'e o número de dados é reduzido a metade, arredondando para cima.',
    efeito: 'As barras de Sanidade e Esforço dão lugar a uma só barra de Determinação.',
  },
];

/**
 * Pontos de Determinação por classe (Sobrevivendo ao Horror, p. 104).
 * Mesma forma que `progressao` das classes, para reaproveitar o cálculo.
 */
export const PROGRESSAO_PD = {
  // "Combatente. PD Iniciais: 6 + Pre. A cada novo NEX: 3 + Pre."
  combatente: { inicial: 6, somaAtributo: 'pre', porNex: 3, porNexSomaAtributo: 'pre' },
  // "Especialista. PD Iniciais: 8 + Pre. A cada novo NEX: 4 + Pre."
  especialista: { inicial: 8, somaAtributo: 'pre', porNex: 4, porNexSomaAtributo: 'pre' },
  // "Ocultista. PD Iniciais: 10 + Pre. A cada novo NEX: 5 + Pre."
  ocultista: { inicial: 10, somaAtributo: 'pre', porNex: 5, porNexSomaAtributo: 'pre' },
  // "Sobrevivente. PD Iniciais: 4 + Pre. A cada novo estágio: 2." (sem Presença)
  sobrevivente: { inicial: 4, somaAtributo: 'pre', porNex: 2, porNexSomaAtributo: null },
};

/** Estado por omissão: tudo desligado, como o livro manda. */
export const REGRAS_POR_OMISSAO = { nivelSeparado: false, semSanidade: false };

/**
 * Alterações por exposição (Sobrevivendo ao Horror, p. 99–102).
 * Só existem com a regra "NEX & Experiência" ligada, e são cumulativas.
 * As três primeiras mexem nos números, por isso a ficha aplica-as; as de
 * elemento (60/75/90%) ficam como texto, porque dependem de rituais e de
 * condições que a ficha não simula.
 */
export const ALTERACOES_GERAIS = [
  {
    id: 'p25',
    nex: 25,
    titulo: 'Arrepios na espinha',
    texto:
      'Podes fazer testes de Ocultismo mesmo sem seres treinado. Se fores treinado, ' +
      'recebes +2 em Ocultismo. Em troca, sofres −5 numa perícia à tua escolha.',
    escolha: {
      campo: 'penalidade25',
      rotulo: 'Perícia com −5',
      opcoes: ['diplomacia', 'enganacao', 'intimidacao'],
    },
  },
  {
    id: 'p35',
    nex: 35,
    titulo: 'Escolhido pelo Outro Lado',
    texto:
      'Escolhe um atributo (menos Presença): somas esse atributo ao teu total de PE. ' +
      'Em troca, sofres −5 numa perícia à tua escolha.',
    escolha: {
      campo: 'atributo35',
      rotulo: 'Atributo somado ao PE',
      opcoes: ['for', 'agi', 'int', 'vig'],
    },
    escolha2: {
      campo: 'penalidade35',
      rotulo: 'Perícia com −5',
      opcoes: ['atletismo', 'fortitude', 'reflexos'],
    },
  },
  {
    id: 'p50',
    nex: 50,
    titulo: 'Mais Outro Lado do que Realidade',
    texto:
      'Da próxima vez que Transcenderes, ganhas afinidade com um elemento à tua escolha. ' +
      'A partir daí recebes as alterações desse elemento em NEX 60%, 75% e 90%.',
    escolha: {
      campo: 'elemento',
      rotulo: 'Elemento',
      opcoes: ['conhecimento', 'energia', 'morte', 'sangue'],
    },
  },
];

/** Alterações de elemento, resumidas na parte mecânica (p. 100–102). */
export const ALTERACOES_ELEMENTO = {
  sangue: [
    { nex: 60, texto: '+1 dado em Sobrevivência e imunidade a calor e frio extremos. Deixas de poder escolher 10 em testes.' },
    { nex: 75, texto: 'Podes conjurar Aprimorar Físico, só em ti (−1 PE se já o conheces). Sofres −1 dado em Ciências, Medicina e Tecnologia.' },
    { nex: 90, texto: 'A penalidade de NEX 75% sobe para −2 dados. Podes conjurar Forma Monstruosa (−1 PE se já o conheces) e gastar +2 PE para anular as penalidades de Sangue enquanto durar.' },
  ],
  morte: [
    { nex: 60, texto: '+1 dado em Iniciativa e Reflexos, −1 dado em Diplomacia e Intuição.' },
    { nex: 75, texto: 'Podes conjurar Velocidade Mortal (−1 PE). A penalidade de NEX 60% sobe para −2 dados e passa a incluir Enganação e Intimidação.' },
    { nex: 90, texto: 'Não podes ser surpreendido e podes esperar que todos os seres com Iniciativa menor ajam primeiro. Na primeira interação social de cada cena perdes 3 PE.' },
  ],
  conhecimento: [
    { nex: 60, texto: 'Vês auras paranormais, como se estivesses sempre sob o efeito básico de Terceiro Olho (−1 PE se já o conheces). Ficas permanentemente ofuscado.' },
    { nex: 75, texto: 'Percebes perigos como se estivesses sempre sob Detecção de Ameaças (−1 PE). As penalidades de ofuscado sobem para −2 dados.' },
    { nex: 90, texto: 'Fora da escuridão ficas cego em vez de ofuscado. Podes conjurar Vidência (−1 PE) sem precisares de superfície reflexiva.' },
  ],
  energia: [
    { nex: 60, texto: 'Podes conjurar Coincidência Forçada (−1 PE). No início de cada cena rolas 1d6 e apanhas um efeito colateral caótico até ao fim dela.' },
    { nex: 75, texto: 'Podes conjurar Tela de Ruído (−1 PE). Os efeitos colaterais do caos agravam-se.' },
    { nex: 90, texto: 'Podes conjurar Salto Fantasma (−1 PE), não precisas de falar para conjurar e, se escreveres o ritual num aparelho enquanto o conjuras, a DT para lhe resistir sobe +2.' },
  ],
};
