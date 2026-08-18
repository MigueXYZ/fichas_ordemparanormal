// OCULTISTA — extraído de Ordem Paranormal RPG (Livro Base, cap. 1) e
// Sobrevivendo ao Horror (novos poderes e novas trilhas de ocultista).
// Texto verbatim das fontes; nada foi resumido nem inventado.

const classe = {
  id: 'ocultista',
  nome: 'Ocultista',
  descricao:
    'O Outro Lado é misterioso, perigoso e, de certa forma, cativante. Muitos estudiosos das entidades se perdem em seus reinos obscuros em busca de poder, mas existem aqueles que visam compreender e dominar os mistérios paranormais para usá-los para combater o próprio Outro Lado. Esse tipo de agente não é apenas um conhecedor do oculto, como também possui talento para se conectar com elementos paranormais.\n\n' +
    'Ao contrário da crendice popular, ocultistas não são intrinsecamente malignos. Seria como dizer que o cientista que inventou a pólvora é culpado pelo assassino que disparou o revólver. Para a Ordem, o paranormal é uma força que pode ser usada para os mais diversos propósitos, de acordo com a intenção de seu usuário.\n\n' +
    'Ocultistas aplicam seu conhecimento acadêmico e suas capacidades de conjuração de rituais em missões para investigar e combater o paranormal em todas as suas formas, principalmente quando munição convencional não é o suficiente para lidar com a tarefa.\n\n' +
    'Ocultistas Famosos: Agatha Volkomenn, Dante, Arnaldo Fritz, Marc Menet, Kian.',
  livro: 'Livro Base',

  progressao: {
    pv: { inicial: 12, somaAtributo: 'vig', porNex: 2, porNexSomaAtributo: 'vig' },
    san: { inicial: 20, somaAtributo: null, porNex: 5, porNexSomaAtributo: null },
    pe: { inicial: 4, somaAtributo: 'pre', porNex: 4, porNexSomaAtributo: 'pre' },
  },

  pericias: {
    obrigatorias: ['ocultismo', 'vontade'],
    escolhas: [],
    livres: { base: 3, somaAtributo: 'int' },
    nota: 'Ocultismo e Vontade, mais uma quantidade de perícias a sua escolha igual a 3 + Intelecto.',
  },

  proficiencias: ['Armas simples'],

  // Regras de rituais do ocultista (habilidade "Escolhido pelo Outro Lado").
  // O livro NÃO traz uma tabela de rituais conhecidos por NEX: traz o círculo
  // máximo desbloqueado por NEX + uma regra de aquisição (3 rituais de 1º
  // círculo no início, +1 ritual por avanço de NEX).
  rituaisConhecidos: {
    iniciais: { 1: 3 },
    porAvancoDeNex: 1,
    regra:
      'Você começa com três rituais de 1º círculo. Sempre que avança de NEX, aprende um ritual de qualquer círculo que possa lançar. Esses rituais não contam no seu limite de rituais conhecidos. Veja o Capítulo 5 para as regras de rituais.',
    circulosPorNex: [
      { nex: 5, circuloMaximo: 1 },
      { nex: 25, circuloMaximo: 2 },
      { nex: 55, circuloMaximo: 3 },
      { nex: 85, circuloMaximo: 4 },
    ],
  },

  tabelaNex: [
    { nex: 5, habilidades: ['Escolhido pelo Outro Lado (1º círculo)'] },
    { nex: 10, habilidades: ['Habilidade de trilha'] },
    { nex: 15, habilidades: ['Poder de ocultista'] },
    { nex: 20, habilidades: ['Aumento de atributo'] },
    { nex: 25, habilidades: ['Escolhido pelo Outro Lado (2º círculo)'] },
    { nex: 30, habilidades: ['Poder de ocultista'] },
    { nex: 35, habilidades: ['Grau de treinamento'] },
    { nex: 40, habilidades: ['Habilidade de trilha'] },
    { nex: 45, habilidades: ['Poder de ocultista'] },
    { nex: 50, habilidades: ['Aumento de atributo', 'Versatilidade'] },
    { nex: 55, habilidades: ['Escolhido pelo Outro Lado (3º círculo)'] },
    { nex: 60, habilidades: ['Poder de ocultista'] },
    { nex: 65, habilidades: ['Habilidade de trilha'] },
    { nex: 70, habilidades: ['Grau de treinamento'] },
    { nex: 75, habilidades: ['Poder de ocultista'] },
    { nex: 80, habilidades: ['Aumento de atributo'] },
    { nex: 85, habilidades: ['Escolhido pelo Outro Lado (4º círculo)'] },
    { nex: 90, habilidades: ['Poder de ocultista'] },
    { nex: 95, habilidades: ['Aumento de atributo'] },
    { nex: 99, habilidades: ['Habilidade de trilha'] },
  ],

  habilidades: [
    {
      nome: 'Escolhido pelo Outro Lado',
      nex: 5,
      descricao:
        'Você teve uma experiência paranormal e foi marcado pelo Outro Lado, absorvendo o conhecimento e poder necessários para realizar rituais. Você pode lançar rituais de 1º círculo. À medida que aumenta seu NEX, pode lançar rituais de círculos maiores (2º círculo em NEX 25%, 3º círculo em NEX 55% e 4º círculo em NEX 85%). Você começa com três rituais de 1º círculo. Sempre que avança de NEX, aprende um ritual de qualquer círculo que possa lançar. Esses rituais não contam no seu limite de rituais conhecidos. Veja o Capítulo 5 para as regras de rituais.',
    },
    {
      nome: 'Habilidade de Trilha',
      nex: 10,
      descricao:
        'Em NEX 10% você escolhe uma das trilhas de ocultista disponíveis e recebe o primeiro poder da trilha escolhida. Você recebe um novo poder da trilha escolhida respectivamente em NEX 40%, 65% e 99%. Veja a descrição das trilhas nas páginas 34 e 35.',
    },
    {
      nome: 'Poder de Ocultista',
      nex: 15,
      descricao:
        'Em NEX 15%, você recebe um poder de ocultista à sua escolha. Você recebe um novo poder de ocultista em NEX 30% e a cada 15% de NEX subsequentes, conforme indicado na tabela. Veja a lista de poderes a seguir.',
    },
    {
      nome: 'Aumento de Atributo',
      nex: 20,
      descricao:
        'Em NEX 20%, e novamente em NEX 50%, 80% e 95%, aumente um atributo a sua escolha em +1. Você não pode aumentar um atributo além de 5 desta forma.',
    },
    {
      nome: 'Grau de Treinamento',
      nex: 35,
      descricao:
        'Em NEX 35%, e novamente em NEX 70%, escolha um número de perícias treinadas igual a 3 + Int. Seu grau de treinamento nessas perícias aumenta em um (de treinado para veterano ou de veterano para expert).',
    },
    {
      nome: 'Versatilidade',
      nex: 50,
      descricao:
        'Em NEX 50%, escolha entre receber um poder de ocultista ou o primeiro poder de uma trilha de ocultista que não a sua.',
    },
  ],

  poderes: [
    {
      id: 'camuflar-ocultismo',
      nome: 'Camuflar Ocultismo',
      descricao:
        'Você pode gastar uma ação livre para esconder símbolos e sigilos que estejam desenhados ou gravados em objetos ou em sua pele, tornando-os invisíveis para outras pessoas além de você mesmo. Além disso, quando lança um ritual, pode gastar +2 PE para lançá-lo sem usar componentes ritualísticos e sem gesticular (o que permite conjurar um ritual com as mãos presas), usando apenas concentração. Outros seres só perceberão que você lançou um ritual se passarem num teste de Ocultismo (DT 25).',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'criar-selo',
      nome: 'Criar Selo',
      descricao:
        'Você sabe fabricar selos paranormais de rituais que conheça (veja a página 151). Fabricar um selo gasta uma ação de interlúdio e um número de PE iguais ao custo de conjurar o ritual. Você pode ter um número máximo de selos criados ao mesmo tempo igual à sua Presença.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'envolto-em-misterio',
      nome: 'Envolto em Mistério',
      descricao:
        'Sua aparência e postura assombrosas o permitem manipular e assustar pessoas ignorantes ou supersticiosas. O mestre define o que exatamente você pode fazer e quem se encaixa nessa descrição. Como regra geral, você recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Ocultismo.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'especialista-em-elemento',
      nome: 'Especialista em Elemento',
      descricao:
        'Escolha um elemento. A DT para resistir aos seus rituais desse elemento aumenta em +2.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'ferramentas-paranormais',
      nome: 'Ferramentas Paranormais',
      descricao:
        'Você reduz a categoria de um item paranormal em I e pode ativar itens paranormais sem pagar seu custo em PE.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'fluxo-de-poder',
      nome: 'Fluxo de Poder',
      descricao:
        'Você pode manter dois efeitos sustentados de rituais ativos ao mesmo tempo com apenas uma ação livre, pagando o custo de cada efeito separadamente. Pré-requisito: NEX 60%.',
      prerequisito: 'NEX 60%',
      livro: 'Livro Base',
    },
    {
      id: 'guiado-pelo-paranormal',
      nome: 'Guiado pelo Paranormal',
      descricao:
        'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'identificacao-paranormal',
      nome: 'Identificação Paranormal',
      descricao:
        'Você recebe +10 em testes de Ocultismo para identificar criaturas, objetos ou rituais.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'improvisar-componentes',
      nome: 'Improvisar Componentes',
      descricao:
        'Uma vez por cena, você pode gastar uma ação completa para fazer um teste de Investigação (DT 15). Se passar, encontra objetos que podem servir como componentes ritualísticos de um elemento à sua escolha. O mestre define se é possível usar esse poder na cena atual.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'intuicao-paranormal',
      nome: 'Intuição Paranormal',
      descricao:
        'Sempre que usa a ação facilitar investigação, você soma seu Intelecto ou Presença no teste (à sua escolha).',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'mestre-em-elemento',
      nome: 'Mestre em Elemento',
      descricao:
        'Escolha um elemento. O custo para lançar rituais desse elemento diminui em –1 PE. Pré-requisitos: Especialista em Elemento no elemento escolhido, NEX 45%.',
      prerequisito: 'Especialista em Elemento no elemento escolhido, NEX 45%',
      livro: 'Livro Base',
    },
    {
      id: 'ritual-potente',
      nome: 'Ritual Potente',
      descricao:
        'Você soma seu Intelecto nas rolagens de dano ou nos efeitos de cura de seus rituais. Pré-requisito: Int 2.',
      prerequisito: 'Int 2',
      livro: 'Livro Base',
    },
    {
      id: 'ritual-predileto',
      nome: 'Ritual Predileto',
      descricao:
        'Escolha um ritual que você conhece. Você reduz em –1 PE o custo do ritual. Essa redução se acumula com reduções fornecidas por outras fontes.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'tatuagem-ritualistica',
      nome: 'Tatuagem Ritualística',
      descricao:
        'Símbolos marcados em sua pele reduzem em –1 PE o custo de rituais de alcance pessoal que têm você como alvo.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'transcender',
      nome: 'Transcender',
      descricao:
        'Escolha um poder paranormal (veja a página 114). Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'treinamento-em-pericia',
      nome: 'Treinamento em Perícia',
      descricao:
        'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.',
      prerequisito: '',
      livro: 'Livro Base',
    },

    // --- Sobrevivendo ao Horror ---
    {
      id: 'deixe-os-sussurros-guiarem',
      nome: 'Deixe os Sussurros Guiarem',
      descricao:
        'Você sabe abrir sua mente para os sussurros do Paranormal, vozes que lhe guiam às custas de sua Sanidade. Uma vez por cena, você pode gastar 2 PE e uma rodada para receber +2 em testes de perícia para investigação até o fim da cena. Entretanto, enquanto este poder estiver ativo, sempre que falha em um teste de perícia, você perde 1 ponto de Sanidade.',
      prerequisito: '',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'dominio-esoterico',
      nome: 'Domínio Esotérico',
      descricao:
        'Você estudou a fundo a complexidade de catalisadores esotéricos e aprendeu a combinar suas propriedades paranormais. Ao lançar um ritual, você pode combinar os efeitos de até dois catalisadores ritualísticos diferentes ao mesmo tempo. Pré-requisito: Int 3.',
      prerequisito: 'Int 3',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'estalos-macabros',
      nome: 'Estalos Macabros',
      descricao:
        'Você sabe colidir pequenos objetos amaldiçoados para gerar distrações fortuitas em momentos de necessidade. Quando faz uma ação para atrapalhar a atenção de outro ser (como distrair em uma cena de furtividade ou fintar em combate), você pode gastar 1 PE para usar Ocultismo em vez da perícia original. Se o alvo da sua distração for uma pessoa ou animal, você recebe +5 no teste.',
      prerequisito: '',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'minha-dor-me-impulsiona',
      nome: 'Minha Dor me Impulsiona',
      descricao:
        'Você está acostumado com sacrifícios dolorosos e aprendeu a transformar sua dor em impulso físico. Quando faz um teste de Acrobacia, Atletismo ou Furtividade, você pode gastar 1 PE para receber +1d6 no teste. Você só pode usar este poder se estiver com pelo menos 5 pontos de dano em seus PV. Pré-requisito: Vig 2.',
      prerequisito: 'Vig 2',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'nos-olhos-do-monstro',
      nome: 'Nos Olhos do Monstro',
      descricao:
        'Por mais assustador que seja encarar o paranormal, fazer isso pode fornecer a chave para escapar dele com vida. Se estiver em uma cena envolvendo uma criatura paranormal, você pode gastar uma rodada e 3 PE para encarar essa criatura (você precisa ser capaz de ver os olhos ou o mais próximo de um “rosto” da criatura, definido pelo mestre). Se fizer isso, você recebe +5 em testes contra a criatura (exceto testes de ataque) até o fim da cena.',
      prerequisito: '',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'olhar-sinistro',
      nome: 'Olhar Sinistro',
      descricao:
        'Aquilo que para outros é quase uma ciência, para você é a imposição da própria vontade. Você pode usar Presença no lugar de Intelecto para Ocultismo e pode usar esta perícia para coagir (veja Intimidação). Pré-requisito: Pre 1.',
      prerequisito: 'Pre 1',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'sentido-premonitorio',
      nome: 'Sentido Premonitório',
      descricao:
        'Sua exposição paranormal dá outros significados para arrepios e calafrios. Você pode gastar 3 PE para ativar um sentido premonitório. Enquanto seu sentido estiver ativo, você tem um déjà vu do futuro próximo (equivalente a uma rodada). Entre outras coisas, você sabe com uma rodada de antecedência quando a urgência de uma investigação vai acabar, se irá ocorrer um evento na investigação e qual será ele (o mestre rola antecipadamente o evento) e sabe quais ações seus inimigos irão tomar em cenas de furtividade e perseguição (essencialmente, você pode decidir suas próprias ações após ver o resultado das rolagens dos demais envolvidos na cena). O mestre pode aprovar outros usos criativos deste poder. Devido à natureza acelerada e caótica de um combate, este poder não tem efeito nestas cenas. Para manter seu sentido ativado, você deve gastar 1 PE no início de cada rodada.',
      prerequisito: '',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'sincronia-paranormal',
      nome: 'Sincronia Paranormal',
      descricao:
        'A exposição Paranormal de momentos terríveis que você compartilhou com seus aliados criou uma conexão invisível de Medo entre vocês, como uma linha entrelaçada dos seus destinos. Você pode gastar uma ação padrão e 2 PE para estabelecer uma sincronia mental com qualquer número de personagens, em alcance médio, com os quais você já tenha sobrevivido a pelo menos um encontro com o Paranormal. Essa sincronia é uma conexão inconsciente, e não permite uma troca clara de informações; em termos de regras, no início de cada rodada em que a sincronia estiver em efeito você pode distribuir uma quantidade de O de bônus igual à sua Presença entre os demais participantes. Estes dados podem ser usados em testes de perícias baseadas em Intelecto ou Presença e desaparecem no final de cada rodada. Manter a sincronia custa 1 PE no início de cada rodada. Pré-requisito: Pre 2.',
      prerequisito: 'Pre 2',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'tracado-conjuratorio',
      nome: 'Traçado Conjuratório',
      descricao:
        'Você conhece versões de proteção e fortalecimento de vários símbolos paranormais, e pode usá-los para reforçar seus rituais. Você pode gastar 1 PE e uma ação completa traçando um símbolo paranormal no chão que ocupa um quadrado de 1,5m. Enquanto estiver dentro desse símbolo, você recebe +2 em testes de Ocultismo e de resistência e a DT para resistir aos seus rituais aumenta em +2. O símbolo dura até o fim da cena.',
      prerequisito: '',
      livro: 'Sobrevivendo ao Horror',
    },
  ],

  trilhas: [
    {
      id: 'conduite',
      nome: 'Conduíte',
      descricao:
        'Você domina os aspectos fundamentais da conjuração de rituais e é capaz de aumentar o alcance e velocidade de suas conjurações. Conforme sua conexão com as entidades paranormais aumenta você se torna capaz de interferir com os rituais de outros ocultistas.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Ampliar Ritual',
          descricao:
            'Quando lança um ritual, você pode gastar +2 PE para aumentar seu alcance em um passo (de curto para médio, de médio para longo ou de longo para extremo) ou dobrar sua área de efeito.',
        },
        {
          nex: 40,
          nome: 'Acelerar Ritual',
          descricao:
            'Uma vez por rodada, você pode aumentar o custo de um ritual em 4 PE para conjurá-lo como uma ação livre.',
        },
        {
          nex: 65,
          nome: 'Anular Ritual',
          descricao:
            'Quando for alvo de um ritual, você pode gastar uma quantidade de PE igual ao custo pago por esse ritual e fazer um teste oposto de Ocultismo contra o conjurador. Se vencer, você anula o ritual, cancelando todos os seus efeitos.',
        },
        {
          nex: 99,
          nome: 'Canalizar o Medo',
          descricao: 'Você aprende o ritual Canalizar o Medo.',
        },
      ],
    },
    {
      id: 'flagelador',
      nome: 'Flagelador',
      descricao:
        'Dor é um poderoso catalisador paranormal e você aprendeu a transformá-la em poder para seus rituais. Quando se torna especialmente poderoso, consegue usar a dor e o sofrimento de seus inimigos como instrumento de seus rituais ocultistas.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Poder do Flagelo',
          descricao:
            'Ao conjurar um ritual, você pode gastar seus próprios pontos de vida para pagar o custo em pontos de esforço, à taxa de 2 PV por PE pago. Pontos de vida gastos dessa forma só podem ser recuperados com descanso.',
        },
        {
          nex: 40,
          nome: 'Abraçar a Dor',
          descricao:
            'Sempre que sofrer dano não paranormal, você pode gastar uma reação e 2 PE para reduzir esse dano à metade.',
        },
        {
          nex: 65,
          nome: 'Absorver Agonia',
          descricao:
            'Sempre que reduz um ou mais inimigos a 0 PV com um ritual, você recebe uma quantidade de PE temporários igual ao círculo do ritual utilizado. Por exemplo, se ativar esse poder com um ritual de 2º círculo, receberá 2 PE.',
        },
        {
          nex: 99,
          nome: 'Medo Tangível',
          descricao: 'Você aprende o ritual Medo Tangível.',
        },
      ],
    },
    {
      id: 'graduado',
      nome: 'Graduado',
      descricao:
        'Você foca seus estudos em se tornar um conjurador versátil e poderoso, conhecendo mais rituais que os outros ocultistas e sendo capaz de torná-los mais difíceis de serem resistidos. Seu objetivo é desvendar e dominar os segredos do Outro Lado, custe o que custar.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Saber Ampliado',
          descricao:
            'Você aprende um ritual de 1º círculo. Toda vez que ganha acesso a um novo círculo, aprende um ritual adicional daquele círculo. Esses rituais não contam no seu limite de rituais.',
        },
        {
          nex: 40,
          nome: 'Grimório Ritualístico',
          descricao:
            'Você cria um grimório especial, que armazena rituais que sua mente não seria capaz de guardar. Você aprende uma quantidade de rituais de 1º ou 2º círculos igual ao seu Intelecto. Quando ganha acesso a um novo círculo, pode incluir um novo ritual desse círculo em seu grimório. Esses rituais não contam em seu limite de rituais conhecidos. Para conjurar um ritual armazenado em seu grimório, você precisa antes empunhar o grimório e gastar uma ação completa o folheando para relembrar o ritual. O grimório ocupa 1 espaço em seu inventário. Se perdê-lo, você pode replicá-lo com duas ações de interlúdio.',
        },
        {
          nex: 65,
          nome: 'Rituais Eficientes',
          descricao: 'A DT para resistir a todos os seus rituais aumenta em +5.',
        },
        {
          nex: 99,
          nome: 'Conhecendo o Medo',
          descricao: 'Você aprende o ritual Conhecendo o Medo.',
        },
      ],
    },
    {
      id: 'intuitivo',
      nome: 'Intuitivo',
      descricao:
        'Assim como combatentes treinam seus corpos para resistir a traumas físicos, você preparou sua mente para resistir aos efeitos do Outro Lado. Seu foco e força de vontade fazem com que você expanda os limites de suas capacidades paranormais.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Mente Sã',
          descricao:
            'Você compreende melhor as entidades do Outro Lado, e passa a ser menos abalado por seus efeitos. Você recebe resistência paranormal +5 (+5 em testes de resistência contra efeitos paranormais).',
        },
        {
          nex: 40,
          nome: 'Presença Poderosa',
          descricao:
            'Sua resiliência mental faz com que você possa extrair mais do Outro Lado. Você adiciona sua Presença ao seu limite de PE por turno, mas apenas para conjurar rituais (não para DT).',
        },
        {
          nex: 65,
          nome: 'Inabalável',
          descricao:
            'Você recebe resistência a dano mental e paranormal 10. Além disso, quando é alvo de um efeito paranormal que permite um teste de Vontade para reduzir o dano à metade, você não sofre dano algum se passar.',
        },
        {
          nex: 99,
          nome: 'Presença do Medo',
          descricao: 'Você aprende o ritual Presença do Medo.',
        },
      ],
    },
    {
      id: 'lamina-paranormal',
      nome: 'Lâmina Paranormal',
      descricao:
        'Alguns ocultistas preferem ficar fechados em suas bibliotecas estudando livros e rituais. Outros preferem investigar fenômenos paranormais em sua fonte. Já você, prefere usar o paranormal como uma arma. Você aprendeu e dominou técnicas de luta mesclando suas habilidades de conjuração com suas capacidades de combate.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Lâmina Maldita',
          descricao:
            'Você aprende o ritual Amaldiçoar Arma. Se já o conhece, seu custo é reduzido em –1 PE. Além disso, quando conjura esse ritual, você pode usar Ocultismo, em vez de Luta ou Pontaria, para testes de ataque com a arma amaldiçoada.',
        },
        {
          nex: 40,
          nome: 'Gladiador Paranormal',
          descricao:
            'Sempre que acerta um ataque corpo a corpo em um inimigo, você recebe 2 PE temporários. Você pode ganhar um máximo de PE temporários por cena igual ao seu limite de PE. PE temporários desaparecem no final da cena.',
        },
        {
          nex: 65,
          nome: 'Conjuração Marcial',
          descricao:
            'Uma vez por rodada, quando você lança um ritual com execução de uma ação padrão, pode gastar 2 PE para fazer um ataque corpo a corpo como uma ação livre.',
        },
        {
          nex: 99,
          nome: 'Lâmina do Medo',
          descricao: 'Você aprende o ritual Lâmina do Medo.',
        },
      ],
    },

    // --- Sobrevivendo ao Horror ---
    {
      id: 'exorcista',
      nome: 'Exorcista',
      descricao:
        'Da escuridão da noite, quando as sombras se tornam mais densas, emerge um chamado desesperado. Um grito sufocado pela presença maligna que assola uma alma atormentada. É então que o exorcista se ergue para enfrentar o paranormal. Com sua fé como escudo e suas palavras como espada, independente de sua religião ou crença, você mergulha na escuridão, onde a Realidade e o Outro Lado travam uma batalha pelo medo humano.',
      livro: 'Sobrevivendo ao Horror',
      poderes: [
        {
          nex: 10,
          nome: 'Revelação do Mal',
          descricao:
            'Qualquer que seja sua fé, seus estudos teológicos o prepararam para perceber os sinais do paranormal. Você recebe treinamento em Religião ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, pode usar essa perícia no lugar de Investigação e Percepção para notar e encontrar seres, rastros ou pistas que tenham traços paranormais e no lugar de Ocultismo.',
        },
        {
          nex: 40,
          nome: 'Poder da Fé',
          descricao:
            'Sua fé e o estudo de suas doutrinas religiosas alimentam suas defesas mentais e espirituais. Você se torna veterano em Religião ou, se já for veterano, recebe +O nessa perícia. Quando falha em um teste de resistência, você pode gastar 2 PE para repetir o teste usando Religião, mas deve aceitar o resultado da segunda rolagem, mesmo que seja menor que a primeira.',
        },
        {
          nex: 65,
          nome: 'Parareligiosidade',
          descricao:
            'Você conjura rituais com uma intensidade tão fervorosa que potencializa seus efeitos. Quando conjura um ritual, você pode gastar +2 PE para adicionar a ele um efeito equivalente ao de um catalisador ritualístico a sua escolha.',
        },
        {
          nex: 99,
          nome: 'Chagas da Resistência',
          descricao:
            'Por meio de sua fé, sua mente consegue extrair forças de seu corpo para suportar qualquer agressão. Quando sua Sanidade é reduzida a 0, você pode gastar 10 PV para, em vez disso, ficar com SAN 1.',
        },
      ],
    },
    {
      id: 'possuido',
      nome: 'Possuído',
      descricao:
        'Você nunca quis contato com o Outro Lado, mas ele parece ter especialmente escolhido você para perseguir. Desde que consegue lembrar, você estava predestinado a essa maldição, como se o paranormal estivesse crescendo em seu interior antes mesmo de seu nascimento… E assim, você foi empurrado para uma batalha sem fim… Sem opção, só lhe resta lutar, enquanto o paranormal dentro de você aflora cada vez mais.',
      livro: 'Sobrevivendo ao Horror',
      poderes: [
        {
          nex: 10,
          nome: 'Poder Não Desejado',
          descricao:
            'Você sente o paranormal tomando forma em seu interior. Ele oferece um poder assustador, mas ao mesmo tempo exige que você siga o caminho que ele escolheu. Sempre que receber um novo poder de ocultista, em vez disso você recebe o poder Transcender. Entretanto, você possui uma reserva paranormal alimentada pela presença em seu interior. Essa reserva é representada por pontos de possessão (PP); seu total de PP é igual a 3, mais 2 pontos para cada poder Transcender que possui. O limite de PP que você pode gastar por turno é igual à sua Presença; para cada PP gasto, você recupera 10 PV ou 2 PE. Você recupera 1 PP a cada ação de interlúdio dormir.',
        },
        {
          nex: 40,
          nome: 'As Sombras Dentro de Mim',
          descricao:
            'Cada vez mais a Entidade cresce dentro de você, tomando seus músculos e guiando seus movimentos. Sua recuperação de PP aumenta para 2 por ação dormir. Além disso, você pode gastar 2 PE para permitir que sua Entidade controle temporariamente seus músculos. Você assume uma postura desnatural que permite movimentos bizarros e silenciosos; você recebe +O em Acrobacia, Atletismo e Furtividade por uma rodada e, se estiver em uma cena de furtividade (veja p. 92), nesta rodada o aumento em sua visibilidade por qualquer ação é reduzido em –1.',
        },
        {
          nex: 65,
          nome: 'Ele Me Ensina',
          descricao:
            'Mais do que apenas uma força, o paranormal lentamente se torna uma voz, sussurrando segredos em sua mente. Escolha entre transcender ou receber o primeiro poder de uma trilha de ocultista que não a sua. Você precisa atender os pré-requisitos do poder.',
        },
        {
          nex: 99,
          nome: 'Tornamo-nos Um',
          descricao:
            'Desabrochando em seu interior, o paranormal se manifesta como uma dádiva poderosa. Baseado no elemento com que tem afinidade, você recebe um dos poderes a seguir.\n\n' +
            'Presente da Obsessão (Sangue). Uma vez por rodada, você pode gastar 6 PE para recuperar 50 PV. Quando faz isso, até o início do seu próximo turno, os bônus por treinamento em suas perícias baseadas em Força e Vigor, e em Intimidação, mudam para +35. As demais perícias baseadas em Presença mudam para –10. Você pode ativar esse poder mesmo inconsciente.\n\n' +
            'Presente do Tempo (Morte). Uma vez por rodada, você pode gastar 6 PE para receber um turno adicional na última contagem de iniciativa da rodada. Você pode ativar essa habilidade mesmo inconsciente.\n\n' +
            'Presente do Saber (Conhecimento). Uma vez por cena, você pode gastar 6 PE para reescrever uma fração de seu próprio ser. Você recebe um poder qualquer até o fim da cena. Você deve cumprir os pré-requisitos do poder escolhido, e não pode escolher poderes de trilha de NEX 99%. A cada vez que usa este poder, você deve fazer um teste de Vontade (DT 15 + 5 para cada vez que usou este poder na mesma missão). Se falhar, perde 1d6 pontos de Sanidade para cada vez que usou esse poder nesta missão.\n\n' +
            'Presente do Espaço (Energia). Uma vez por rodada, você pode gastar 6 PE para se teletransportar para outro ponto em alcance médio. Você não precisa conhecer o local para onde vai nem precisa vê-lo, mas se teletransportar-se para um espaço ocupado vai ser arremessado para o espaço disponível mais próximo.',
        },
      ],
    },
    {
      id: 'parapsicologo',
      nome: 'Parapsicólogo',
      descricao:
        'Você esteve em um meio de pessoas dedicadas a cuidar da mente humana… Mas, quando descobriu a maior ameaça para a nossa psique, descobriu também que seus colegas não passavam de tolos céticos. Quando você falou sobre o paranormal, eles apenas riram. Desprezado pela academia, você decidiu perseguir a verdade sozinho. Afinal, a diferença entre o remédio e o veneno é a dosagem. Se o paranormal pode ser usado para perturbar, também pode ser usado para sanar. Ele só precisa ser estudado, analisado e aplicado por alguém competente como você, mesmo que isso custe sua vida.\n\nEspecial: para escolher esta trilha, você precisa ser treinado em Profissão (psicólogo).',
      livro: 'Sobrevivendo ao Horror',
      poderes: [
        {
          nex: 10,
          nome: 'Terapia',
          descricao:
            'Por meio de seus estudos parapsicológicos, você começa a compreender os efeitos do paranormal sobre a mente humana. Você pode usar Profissão (psicólogo) como Diplomacia. Além disso, uma vez por rodada, quando você ou um aliado em alcance curto falha em um teste de resistência contra um efeito que causa dano mental, você pode gastar 2 PE para fazer um teste de Profissão (psicólogo) e usar o resultado desse teste no lugar do teste de resistência falho. Se já possuir esta habilidade, em vez disso seu custo é reduzido em –1 PE e você recebe +2 em Profissão (psicólogo).',
        },
        {
          nex: 40,
          nome: 'Palavras-chave',
          descricao:
            'Combinando psicologia e estudos do Outro Lado, você desenvolveu técnicas e sabe o que dizer para restaurar a sanidade de seus pacientes. Quando passa em um teste de perícia para acalmar (veja OPRPG, p. 44), você pode gastar uma quantidade de pontos de esforço até seu limite de PE. Para cada 1 PE gasto desta forma, a pessoa que está sendo tratada recupera 1 ponto de Sanidade (ou 1 PD, se estiver usando a regra “Jogando sem Sanidade” da p. 104).',
        },
        {
          nex: 65,
          nome: 'Reprogramação Mental',
          descricao:
            'Ignorando os avisos de cautela de seus pares, você descobriu como hipnotizar e manipular a mente humana para reprogramar suas capacidades. Você pode gastar 5 PE e uma ação de interlúdio para manipular o cérebro de outra pessoa voluntária em alcance curto (essa pessoa também gasta sua ação de interlúdio). Até o próximo interlúdio, a pessoa recebe, à escolha dela, um poder geral, um poder da própria classe ou o primeiro poder de uma trilha que não a dela, acreditando que isso sempre fez parte de sua vida. A pessoa precisa cumprir os pré-requisitos do poder escolhido.',
        },
        {
          nex: 99,
          nome: 'A Sanidade Está Lá Fora',
          descricao:
            'Graças aos seus estudos, a capacidade de curar a mente humana de (quase) todas as mazelas está ao seu alcance. Você pode gastar uma ação de movimento e 5 PE para remover todas as condições de medo ou mentais de uma pessoa adjacente (incluindo você mesmo).',
        },
      ],
    },
  ],
};

export const PODERES_POR_ID = Object.fromEntries(classe.poderes.map((p) => [p.id, p]));
export const TRILHAS_POR_ID = Object.fromEntries(classe.trilhas.map((t) => [t.id, t]));

export default classe;
