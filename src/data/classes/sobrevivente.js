// Classe SOBREVIVENTE — livro "Sobrevivendo ao Horror" (pp. 30-32).
// Texto verbatim do livro. A evolução desta classe mede-se em ESTÁGIOS (1 a 5),
// não em NEX: os campos `nex` abaixo guardam o número do estágio.

export default {
  id: 'sobrevivente',
  nome: 'Sobrevivente',
  descricao: `Sobrevivendo ao Horror traz uma nova classe específica para histórias de terror: o sobrevivente. Esta classe representa pessoas comuns que se veem em meio a ameaças terríveis, como assassinos psicopatas, mansões amaldiçoadas, cultos macabros ou mesmo criaturas do Outro Lado.

Como indivíduos normais, sobreviventes são muito mais fracos que combatentes, especialistas ou ocultistas, que possuem treinamento especial. Em outras palavras, esta nova classe não é equilibrada com as três classes originais! Isso é de propósito, para oferecer uma experiência de jogo diferente. Usando o sobrevivente, os jogadores se sentirão na pele de pessoas comuns que, frente à ameaças de terror, precisam tentar fugir ou se esconder.

JOGANDO DE SOBREVIVENTE

Você é uma pessoa comum. O que você faz da vida provavelmente será definido por sua origem: universitário, atleta, artista, operário, executivo etc. Note que ser um indivíduo normal não faz de você “inútil”! Não ser um agente de uma organização secreta não significa que você não possua suas próprias habilidades. Você inclusive pode ter uma profissão que lide com situações perigosas, como bombeiro ou socorrista. Porém, frente a ameaças realmente aterradoras, sua reação provavelmente será de medo, e seu objetivo será fugir, se esconder ou se proteger — enfim, reações naturais, baseadas no instinto de preservação que todo mundo possui. Você pode tentar ações heroicas, como salvar alguém mais fraco ou até mesmo ficar para trás para que outros fujam. A história está repleta de exemplos de pessoas que, em situações extremas, tomaram atitudes nobres e corajosas! Apenas não espere vencer uma criatura paranormal frente a frente…

Por fim, jogar de sobrevivente não significa que você precisará fugir o tempo inteiro ou que nunca poderá ter uma vitória contra o mal. Apenas que você precisará entender quais são suas ferramentas — não necessariamente armas e poderes, mas esperteza, tenacidade e coragem. E lembrar que, às vezes, apenas sobreviver já é uma vitória.

Para criar um sobrevivente, use as regras a seguir.

Crie um Conceito. Como normal. Porém, lembre-se de que você ainda não conhece o paranormal e ainda não teve contato com a Ordem.

Escolha seus Atributos. Você começa com cada atributo em 1. Porém, por não ter passado pelo treinamento de agente, recebe apenas 3 pontos para distribuir, em vez de 4. Você ainda pode reduzir um único atributo para 0 para receber 1 ponto adicional.

Escolha sua Origem. Como normal. Note que, como você ainda não ingressou na Ordem, sua origem pode representar o que você faz hoje.

Escolha sua Classe. Você deve escolher a classe sobrevivente, descrita a seguir. Personagens sobreviventes possuem NEX 0% (ou nível 0, se estiver usando a regra opcional de Nível de Experiência da p. 98) e sua evolução é medida em estágios. Um sobrevivente começa no estágio 1 e, no fim de cada missão, sobe um estágio, em vez de aumentar seu NEX ou nível.

Escolha seu Equipamento. Não use o sistema de patentes. Em vez disso, escolha um item de categoria I e quantos itens de categoria 0 quiser, desde que sejam itens que você pudesse ter por sua origem. Por exemplo, um civil dificilmente teria acesso a granadas.

Limite de PE. Como um sobrevivente, seu limite de PE é sempre 1, em qualquer estágio. Entretanto, você sempre pode usar pelo menos uma habilidade em seu custo mínimo por turno.`,
  livro: 'Sobrevivendo ao Horror',
  progressao: {
    // "PONTOS DE VIDA 8 + Vig / A cada novo estágio +2"
    pv:  { inicial: 8, somaAtributo: 'vig', porNex: 2, porNexSomaAtributo: null },
    // "Sanidade 8 / A cada novo estágio +2"
    san: { inicial: 8, somaAtributo: null,  porNex: 2, porNexSomaAtributo: null },
    // "PONTOS DE ESFORÇO 2 + Pre / A cada novo estágio +1"
    pe:  { inicial: 2, somaAtributo: 'pre', porNex: 1, porNexSomaAtributo: null },
  },
  pericias: {
    obrigatorias: [],
    escolhas: [],
    livres: { base: 1, somaAtributo: 'int' },
    nota: 'Escolha 1 + Intelecto perícias',
  },
  proficiencias: ['Armas simples'],
  // TABELA 1.2: SOBREVIVENTE — coluna "Estágio". Limite de PE é sempre 1.
  tabelaNex: [
    { nex: 1, habilidades: ['Empenho'] },
    { nex: 2, habilidades: ['Trilha (1º habilidade)'] },
    { nex: 3, habilidades: ['Aumento de atributo'] },
    { nex: 4, habilidades: ['Trilha (2º habilidade)'] },
    { nex: 5, habilidades: ['Cicatrizado'] },
  ],
  habilidades: [
    {
      nome: 'Empenho',
      nex: 1,
      descricao: 'Você pode não ter treinamento especial, mas compensa com dedicação e esforço. Quando faz um teste de perícia, você pode gastar 1 PE para receber +2 nesse teste.',
    },
    {
      nome: 'Trilha',
      nex: 2,
      descricao: 'No 2º estágio, você escolhe uma das trilhas de sobrevivente (durão, esperto ou esotérico) e recebe o primeiro poder da trilha escolhida. No 4º estágio, você recebe o segundo (e último) poder dela.',
    },
    {
      nome: 'Aumento de Atributo',
      nex: 3,
      descricao: 'No 3º estágio, aumente um atributo a sua escolha em +1. Você não pode aumentar um atributo desta forma além de 3. Note que, se você aumentar Vigor, aumentará seus PV; se aumentar Presença, aumentará seus PE, e, se aumentar Intelecto, ganhará uma nova perícia treinada.',
    },
    {
      nome: 'Cicatrizado',
      nex: 5,
      descricao: 'No 5º estágio, você já viu — e sobreviveu — a sua cota de horrores. Isso deixou marcas em seu corpo e sua mente, mas também o deixou mais forte. Escolha um tipo de perigo paranormal que seu personagem já enfrentou, de um elemento específico (Sangue, Morte…). Você possui algum trauma em relação a esse perigo e sofre –O em testes de resistência contra ele. Contudo, uma vez por sessão de jogo você pode se esforçar ao máximo para não se deixar cair ou se abater. Como uma reação, você pode sacrificar 1 PV permanentemente para ignorar um dano mental ou gasto de PE, ou pode sacrificar permanentemente 1 PE para reduzir um dano físico à metade.',
    },
  ],
  // O livro não lista poderes de classe para o sobrevivente (os poderes que se
  // seguem no capítulo são "Poderes Gerais", acessíveis a todas as classes).
  poderes: [],
  trilhas: [
    {
      id: 'durao',
      nome: 'Durão',
      descricao: 'Você é um indivíduo resistente, que consegue defender a si mesmo ou aos outros em situações de perigo. Pode ser um atleta, segurança, trabalhador da construção civil etc.',
      livro: 'Sobrevivendo ao Horror',
      poderes: [
        {
          nex: 2,
          nome: 'Durão',
          descricao: 'Você recebe +4 PV. Quando subir para o 3º estágio, recebe +2 PV.',
        },
        {
          nex: 4,
          nome: 'Pancada Forte',
          descricao: 'Quando faz um ataque, você pode gastar 1 PE para receber +O no teste de ataque. Se você se tornar um combatente (veja “Treinamento Especial”, a seguir), perde esta habilidade, mas reduz o custo de ativação de Ataque Especial em –1 PE.',
        },
      ],
    },
    {
      id: 'esperto',
      nome: 'Esperto',
      descricao: 'Você é um estudante, técnico, engenheiro ou outra pessoa equipada com conhecimento, inteligência e persuasão.',
      livro: 'Sobrevivendo ao Horror',
      poderes: [
        {
          nex: 2,
          nome: 'Esperto',
          descricao: 'Você se torna treinado em uma perícia adicional a sua escolha.',
        },
        {
          nex: 4,
          nome: 'Entendido',
          descricao: 'Escolha duas perícias nas quais você é treinado (exceto Luta e Pontaria). Quando faz um teste de uma dessas perícias, você pode gastar 1 PE para somar +1d4 no resultado do teste. Se você se tornar um especialista (veja “Treinamento Especial”, a seguir), perde esta habilidade, mas reduz o custo de ativação de Perito em –1 PE.',
        },
      ],
    },
    {
      id: 'esoterico',
      nome: 'Esotérico',
      descricao: 'Você é uma pessoa ligada a aspectos espirituais do mundo, como religiões, astrologia e cartomancia, ou apenas possui um sexto sentido em relação ao paranormal e ao Outro Lado.',
      livro: 'Sobrevivendo ao Horror',
      poderes: [
        {
          nex: 2,
          nome: 'Esotérico',
          descricao: 'Você pode gastar uma ação padrão e 1 PE para sentir energias paranormais em alcance curto. Isso pode dar alguma pista em uma investigação ou alertá-lo de algum perigo iminente. O mestre dirá quais informações você consegue obter, se houver.',
        },
        {
          nex: 4,
          nome: 'Iniciado',
          descricao: 'Você aprende e pode conjurar um ritual de 1º círculo a sua escolha. Se você se tornar um ocultista (veja “Treinamento Especial”, a seguir), soma este ritual aos três rituais que aprende com Escolhido pelo Outro Lado.',
        },
      ],
    },
  ],
};
