// CLASSE: COMBATENTE
// Fontes: Ordem Paranormal RPG (Livro Base), pp. 24-27
//         Sobrevivendo ao Horror, pp. 14-21
// Textos verbatim do livro. Não editar sem confirmar na fonte.

const combatente = {
  id: 'combatente',
  nome: 'Combatente',
  descricao: `Treinado para lutar com todo tipo de armas, e com a força e a coragem para encarar os perigos de frente. É o tipo de agente que prefere abordagens mais diretas e costuma atirar primeiro e perguntar depois.

Do mercenário especialista em armas de fogo até o perito em espadas, combatentes apresentam uma gama enorme de habilidades e técnicas especiais que aprimoram sua eficiência no campo de batalha, tornando-os membros essenciais em qualquer missão de extermínio. Além de treinar seu corpo, o combatente também é perito em liderar seus aliados em batalha e em cuidar de seu equipamento de combate, sempre preparado para assumir a linha de frente quando a coisa fica feia.

Combatentes Famosos: Senhor Veríssimo, Joui Jouki, Gal, Antônio “Balu” Pontevedra, Tristan Monteiro e Ryder Staten.`,
  livro: 'Livro Base',
  progressao: {
    pv:  { inicial: 20, somaAtributo: 'vig', porNex: 4, porNexSomaAtributo: 'vig' },
    san: { inicial: 12, somaAtributo: null,  porNex: 3, porNexSomaAtributo: null },
    pe:  { inicial: 2,  somaAtributo: 'pre', porNex: 2, porNexSomaAtributo: 'pre' },
  },
  pericias: {
    obrigatorias: [],
    escolhas: [
      { quantidade: 1, entre: ['luta', 'pontaria'] },
      { quantidade: 1, entre: ['fortitude', 'reflexos'] },
    ],
    livres: { base: 1, somaAtributo: 'int' },
    nota: 'Luta ou Pontaria (uma das duas) e Fortitude ou Reflexos (uma das duas), mais uma quantidade de perícias à sua escolha igual a 1 + Intelecto.',
  },
  proficiencias: ['Armas simples', 'Armas táticas', 'Proteções leves'],
  tabelaNex: [
    { nex: 5,  habilidades: ['Ataque especial (2 PE, +5)'] },
    { nex: 10, habilidades: ['Habilidade de trilha'] },
    { nex: 15, habilidades: ['Poder de combatente'] },
    { nex: 20, habilidades: ['Aumento de atributo'] },
    { nex: 25, habilidades: ['Ataque especial (3 PE, +10)'] },
    { nex: 30, habilidades: ['Poder de combatente'] },
    { nex: 35, habilidades: ['Grau de treinamento'] },
    { nex: 40, habilidades: ['Habilidade de trilha'] },
    { nex: 45, habilidades: ['Poder de combatente'] },
    { nex: 50, habilidades: ['Aumento de atributo', 'Versatilidade'] },
    { nex: 55, habilidades: ['Ataque especial (4 PE, +15)'] },
    { nex: 60, habilidades: ['Poder de combatente'] },
    { nex: 65, habilidades: ['Habilidade de trilha'] },
    { nex: 70, habilidades: ['Grau de treinamento'] },
    { nex: 75, habilidades: ['Poder de combatente'] },
    { nex: 80, habilidades: ['Aumento de atributo'] },
    { nex: 85, habilidades: ['Ataque especial (5 PE, +20)'] },
    { nex: 90, habilidades: ['Poder de combatente'] },
    { nex: 95, habilidades: ['Aumento de atributo'] },
    { nex: 99, habilidades: ['Habilidade de trilha'] },
  ],
  habilidades: [
    {
      nome: 'Ataque Especial',
      nex: 5,
      descricao: 'Quando faz um ataque, você pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano. Conforme avança de NEX, você pode gastar +1 PE para receber mais bônus de +5 (veja a Tabela 1.3). Você pode aplicar cada bônus de +5 em ataque ou dano. Por exemplo, em NEX 55%, você pode gastar 4 PE para receber +5 no teste de ataque e +10 na rolagem de dano.',
      livro: 'Livro Base',
    },
    {
      nome: 'Habilidade de Trilha',
      nex: 10,
      descricao: 'Em NEX 10% você escolhe uma das trilhas de combatente e recebe o primeiro poder da trilha escolhida. Você recebe um novo poder da trilha escolhida em NEX 40%, 65% e 99%. Veja a descrição das trilhas nas páginas 26 e 27.',
      livro: 'Livro Base',
    },
    {
      nome: 'Poder de Combatente',
      nex: 15,
      descricao: 'Em NEX 15%, você recebe um poder de combatente à sua escolha. Você recebe um novo poder de combatente em NEX 30% e a cada 15% de NEX subsequentes, conforme indicado na tabela. Veja a lista de poderes a seguir.',
      livro: 'Livro Base',
    },
    {
      nome: 'Aumento de Atributo',
      nex: 20,
      descricao: 'Em NEX 20%, e novamente em NEX 50%, 80% e 95%, aumente um atributo a sua escolha em +1. Você não pode aumentar um atributo além de 5 desta forma.',
      livro: 'Livro Base',
    },
    {
      nome: 'Grau de Treinamento',
      nex: 35,
      descricao: 'Em NEX 35%, e novamente em NEX 70%, escolha um número de perícias treinadas igual a 2 + Int. Seu grau de treinamento nessas perícias aumenta em um (de treinado para veterano ou de veterano para expert).',
      livro: 'Livro Base',
    },
    {
      nome: 'Versatilidade',
      nex: 50,
      descricao: 'Em NEX 50%, escolha entre receber um poder de combatente ou o primeiro poder de uma trilha de combatente que não a sua.',
      livro: 'Livro Base',
    },
  ],
  poderes: [
    {
      id: 'armamento-pesado',
      nome: 'Armamento Pesado',
      descricao: 'Você recebe proficiência com armas pesadas.',
      prerequisito: 'For 2.',
      livro: 'Livro Base',
    },
    {
      id: 'artista-marcial',
      nome: 'Artista Marcial',
      descricao: 'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.',
      prerequisito: null,
      livro: 'Livro Base',
    },
    {
      id: 'ataque-de-oportunidade',
      nome: 'Ataque de Oportunidade',
      descricao: 'Sempre que um ser sair voluntariamente de um espaço adjacente ao seu, você pode gastar uma reação e 1 PE para fazer um ataque corpo a corpo contra ele.',
      prerequisito: null,
      livro: 'Livro Base',
    },
    {
      id: 'combater-com-duas-armas',
      nome: 'Combater com Duas Armas',
      descricao: 'Se estiver empunhando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –O em todos os testes de ataque até o seu próximo turno.',
      prerequisito: 'Agi 3, treinado em Luta ou Pontaria.',
      livro: 'Livro Base',
    },
    {
      id: 'combate-defensivo',
      nome: 'Combate Defensivo',
      descricao: 'Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –O em todos os testes de ataque, mas recebe +5 na Defesa.',
      prerequisito: 'Int 2.',
      livro: 'Livro Base',
    },
    {
      id: 'golpe-demolidor',
      nome: 'Golpe Demolidor',
      descricao: 'Quando usa a manobra quebrar ou ataca um objeto, você pode gastar 1 PE para causar dois dados de dano extra do mesmo tipo de sua arma.',
      prerequisito: 'For 2, treinado em Luta.',
      livro: 'Livro Base',
    },
    {
      id: 'golpe-pesado',
      nome: 'Golpe Pesado',
      descricao: 'O dano de suas armas corpo a corpo aumenta em mais um dado do mesmo tipo.',
      prerequisito: null,
      livro: 'Livro Base',
    },
    {
      id: 'incansavel',
      nome: 'Incansável',
      descricao: 'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional, mas deve usar Força ou Agilidade como atributo-base do teste.',
      prerequisito: null,
      livro: 'Livro Base',
    },
    {
      id: 'presteza-atletica',
      nome: 'Presteza Atlética',
      descricao: 'Quando faz um teste de facilitar a investigação, você pode gastar 1 PE para usar Força ou Agilidade no lugar do atributo-base da perícia. Se passar no teste, o próximo aliado que usar seu bônus também recebe +O no teste.',
      prerequisito: null,
      livro: 'Livro Base',
    },
    {
      id: 'protecao-pesada',
      nome: 'Proteção Pesada',
      descricao: 'Você recebe proficiência com Proteções Pesadas.',
      prerequisito: 'NEX 30%.',
      livro: 'Livro Base',
    },
    {
      id: 'reflexos-defensivos',
      nome: 'Reflexos Defensivos',
      descricao: 'Você recebe +2 em Defesa e em testes de resistência.',
      prerequisito: 'Agi 2.',
      livro: 'Livro Base',
    },
    {
      id: 'saque-rapido',
      nome: 'Saque Rápido',
      descricao: 'Você pode sacar ou guardar itens como uma ação livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de munição, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre.',
      prerequisito: 'Treinado em Iniciativa.',
      livro: 'Livro Base',
    },
    {
      id: 'segurar-o-gatilho',
      nome: 'Segurar o Gatilho',
      descricao: 'Sempre que acerta um ataque com uma arma de fogo, pode fazer outro ataque com a mesma arma contra o mesmo alvo, pagando 2 PE por cada ataque já realizado no turno. Ou seja, pode fazer o primeiro ataque extra gastando 2 PE e, se acertar, pode fazer um segundo ataque extra gastando mais 4 PE e assim por diante, até errar um ataque ou atingir o limite de seus PE por rodada.',
      prerequisito: 'NEX 60%.',
      livro: 'Livro Base',
    },
    {
      id: 'sentido-tatico',
      nome: 'Sentido Tático',
      descricao: 'Você pode gastar uma ação de movimento e 2 PE para analisar o ambiente. Se fizer isso, recebe um bônus em Defesa e em testes de resistência igual ao seu Intelecto até o final da cena.',
      prerequisito: 'Int 2, treinado em Percepção e Tática.',
      livro: 'Livro Base',
    },
    {
      id: 'tanque-de-guerra',
      nome: 'Tanque de Guerra',
      descricao: 'Se estiver usando uma proteção pesada, a Defesa e a resistência a dano que ela fornece aumentam em +2.',
      prerequisito: 'Proteção Pesada.',
      livro: 'Livro Base',
    },
    {
      id: 'tiro-certeiro',
      nome: 'Tiro Certeiro',
      descricao: 'Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar).',
      prerequisito: 'Treinado em Pontaria.',
      livro: 'Livro Base',
    },
    {
      id: 'tiro-de-cobertura',
      nome: 'Tiro de Cobertura',
      descricao: 'Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direção de um personagem no alcance da arma para forçá-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde está e sofre –5 em testes de ataque. A critério do mestre, o alvo recebe +5 no teste de Vontade se estiver em um lugar extremamente perigoso, como uma casa em chamas ou um barco afundando. Este é um efeito de medo.',
      prerequisito: null,
      livro: 'Livro Base',
    },
    {
      id: 'transcender',
      nome: 'Transcender',
      descricao: 'Escolha um poder paranormal (veja a página 114). Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.',
      prerequisito: null,
      livro: 'Livro Base',
    },
    {
      id: 'treinamento-em-pericia',
      nome: 'Treinamento em Perícia',
      descricao: 'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.',
      prerequisito: null,
      livro: 'Livro Base',
    },
    {
      id: 'apego-angustiado',
      nome: 'Apego Angustiado',
      descricao: 'Não importa o quão profundos sejam seus ferimentos, você escolhe a agonia enlouquecedora da dor a perder a consciência diante da própria morte. Você não fica inconsciente por estar morrendo, mas sempre que terminar uma rodada nesta condição e consciente, perde 2 pontos de Sanidade.',
      prerequisito: null,
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'caminho-para-forca',
      nome: 'Caminho para Forca',
      descricao: 'Se for para alguém do seu grupo ser pego, que seja você. Quando usa a ação sacrifício em uma cena de perseguição (p. 90), você pode gastar 1 PE para fornecer +O extra (para um total de +2O) nos testes dos outros personagens e, quando usa a ação chamar atenção em uma cena de furtividade (p. 92), você pode gastar 1 PE para diminuir a visibilidade de todos os seus aliados próximos em –2 (em vez de –1).',
      prerequisito: null,
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'ciente-das-cicatrizes',
      nome: 'Ciente das Cicatrizes',
      descricao: 'Acostumado a manusear armas, você aprendeu também a identificar as marcas que elas deixam. Quando faz um teste para encontrar uma pista relacionada a armas ou ferimentos (como um teste para necropsia ou para identificar uma arma amaldiçoada), você pode usar Luta ou Pontaria no lugar da perícia original.',
      prerequisito: 'Treinado em Luta ou Pontaria.',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'correria-desesperada',
      nome: 'Correria Desesperada',
      descricao: 'Você já esteve diante de coisas que não podem ser derrotadas e aprendeu da forma mais trágica que às vezes fugir é a única chance de vitória. Você recebe +3m em seu deslocamento e +O em testes de perícia para fugir em uma perseguição (veja p. 90).',
      prerequisito: null,
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'engolir-o-choro',
      nome: 'Engolir o Choro',
      descricao: 'Mesmo ferido, você não vai emitir um pio até que a ameaça se afaste. Você não sofre penalidades por condições em testes de perícia para fugir e em testes de Furtividade.',
      prerequisito: null,
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'instinto-de-fuga',
      nome: 'Instinto de Fuga',
      descricao: 'Sabendo que nem toda batalha pode ser vencida, você desenvolveu um sexto sentido para prever quando é hora de fugir. Quando uma cena de perseguição (ou semelhante) tem início, você recebe +2 em todos os testes de perícia que fizer durante a cena.',
      prerequisito: 'Treinado em Intuição.',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'mochileiro',
      nome: 'Mochileiro',
      descricao: 'Você já precisou pegar a estrada para escapar de perseguidores o suficiente para saber como carregar tudo que precisa. Seu limite de carga aumenta em 5 espaços e você pode se beneficiar de uma vestimenta adicional.',
      prerequisito: 'Vig 2.',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'paranoia-defensiva',
      nome: 'Paranoia Defensiva',
      descricao: 'Você sabe que eles estão lá fora, e fará tudo ao seu alcance para mantê-los assim. Uma vez por cena, você pode gastar uma rodada e 3 PE. Se fizer isso, você e cada aliado presente escolhe entre receber +5 na Defesa contra o próximo ataque que sofrer na cena ou receber um bônus de +5 em um único teste de perícia feito até o fim da cena.',
      prerequisito: null,
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'sacrificar-os-joelhos',
      nome: 'Sacrificar os Joelhos',
      descricao: 'Diante de algo que não pode ser vencido, você abre mão da autopreservação para superar seus limites de fuga. Uma vez por cena de perseguição (p. 90), quando faz a ação esforço extra, você pode gastar 2 PE para passar automaticamente no teste de perícia.',
      prerequisito: 'Treinado em Atletismo.',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'sem-tempo-irmao',
      nome: 'Sem Tempo, Irmão',
      descricao: 'Você sabe que pistas são importantes, mas com o paranormal podendo surgir a qualquer momento, cada segundo conta. Uma vez por cena de investigação, quando usa a ação facilitar investigação (OPRPG, p. 80), você pode prestar ajuda de forma apressada e descuidada. Você passa automaticamente no teste para auxiliar seus aliados, mas faz uma rolagem adicional na tabela de eventos de investigação (p. 82).',
      prerequisito: null,
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'valentao',
      nome: 'Valentão',
      descricao: 'Em algum momento, a vida lhe ensinou que a brutalidade pode ser amedrontadora, e agora esse é seu principal idioma. Você pode usar Força no lugar de Presença para Intimidação. Além disso, uma vez por cena, pode gastar 1 PE para fazer um teste de Intimidação para assustar como uma ação livre.',
      prerequisito: null,
      livro: 'Sobrevivendo ao Horror',
    },
  ],
  trilhas: [
    {
      id: 'aniquilador',
      nome: 'Aniquilador',
      descricao: 'Você é treinado para abater alvos com eficiência e velocidade. Suas armas são suas melhores amigas e você cuida tão bem delas quanto de seus companheiros de equipe. Talvez até melhor.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'A Favorita',
          descricao: 'Escolha uma arma para ser sua favorita, como katana ou fuzil de assalto. A categoria da arma escolhida é reduzida em I.',
        },
        {
          nex: 40,
          nome: 'Técnica Secreta',
          descricao: `A categoria da arma favorita passa a ser reduzida em II. Quando faz um ataque com ela, você pode gastar 2 PE para executar um dos efeitos abaixo como parte do ataque. Você pode adicionar mais efeitos gastando +2 PE por efeito adicional.

Amplo. O ataque pode atingir um alvo adicional em seu alcance e adjacente ao original (use o mesmo teste de ataque para ambos).

Destruidor. Aumenta o multiplicador de crítico da arma em +1.`,
        },
        {
          nex: 65,
          nome: 'Técnica Sublime',
          descricao: `Você adiciona os seguintes efeitos à lista de sua Técnica Secreta:

Letal. Aumenta a margem de ameaça em +2. Você pode escolher este efeito duas vezes para aumentar a margem de ameaça em +5.

Perfurante. Ignora até 5 pontos de resistência a dano de qualquer tipo do alvo.`,
        },
        {
          nex: 99,
          nome: 'Máquina de Matar',
          descricao: 'A categoria da arma favorita passa a ser reduzida em III, ela recebe +2 na margem de ameaça e seu dano aumenta em um dado do mesmo tipo.',
        },
      ],
    },
    {
      id: 'comandante-de-campo',
      nome: 'Comandante de Campo',
      descricao: 'Sem um oficial uma batalha não passa de uma briga de bar. Você é treinado para coordenar e auxiliar seus companheiros em combate, tomando decisões rápidas e tirando melhor proveito da situação e do talento de seus aliados.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Inspirar Confiança',
          descricao: 'Sua liderança inspira seus aliados. Você pode gastar uma reação e 2 PE para fazer um aliado em alcance curto rolar novamente um teste recém realizado.',
        },
        {
          nex: 40,
          nome: 'Estrategista',
          descricao: 'Você pode direcionar aliados em alcance curto. Gaste uma ação padrão e 1 PE por aliado que quiser direcionar (limitado pelo seu Intelecto). No próximo turno dos aliados afetados, eles ganham uma ação de movimento adicional.',
        },
        {
          nex: 65,
          nome: 'Brecha na Guarda',
          descricao: 'Uma vez por rodada, quando um aliado causar dano em um inimigo que esteja em seu alcance curto, você pode gastar uma reação e 2 PE para que você ou outro aliado em alcance curto faça um ataque adicional contra o mesmo inimigo. Além disso, o alcance de inspirar confiança e estrategista aumenta para médio.',
        },
        {
          nex: 99,
          nome: 'Oficial Comandante',
          descricao: 'Você pode gastar uma ação padrão e 5 PE para que cada aliado que você possa ver em alcance médio receba uma ação padrão adicional no próximo turno dele.',
        },
      ],
    },
    {
      id: 'guerreiro',
      nome: 'Guerreiro',
      descricao: 'Você treinou sua musculatura e movimentos a ponto de transformar seu corpo em uma verdadeira arma. Com golpes corpo a corpo tão poderosos quanto uma bala, você enfrenta inimigos sem medo.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Técnica Letal',
          descricao: 'Você recebe um aumento de +2 na margem de ameaça com todos os seus ataques corpo a corpo.',
        },
        {
          nex: 40,
          nome: 'Revidar',
          descricao: 'Sempre que bloquear um ataque, você pode gastar uma reação e 2 PE para fazer um ataque corpo a corpo no inimigo que o atacou.',
        },
        {
          nex: 65,
          nome: 'Força Opressora',
          descricao: 'Quando acerta um ataque corpo a corpo, você pode gastar 1 PE para realizar uma manobra derrubar ou empurrar contra o alvo do ataque como ação livre. Se escolher empurrar, recebe um bônus de +5 para cada 10 pontos de dano que causou no alvo. Se escolher derrubar e vencer no teste oposto, você pode gastar 1 PE para fazer um ataque adicional contra o alvo caído.',
        },
        {
          nex: 99,
          nome: 'Potência Máxima',
          descricao: 'Quando usa seu Ataque Especial com armas corpo a corpo, todos os bônus numéricos são dobrados. Por exemplo, se usar 5 PE para receber +5 no ataque e +15 no dano, você recebe +10 no ataque e +30 no dano.',
        },
      ],
    },
    {
      id: 'operacoes-especiais',
      nome: 'Operações Especiais',
      descricao: 'Você é um combatente eficaz. Suas ações são calculadas e otimizadas, sempre antevendo os movimentos inimigos e se posicionando da maneira mais inteligente no campo de batalha.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Iniciativa Aprimorada',
          descricao: 'Você recebe +5 em Iniciativa e uma ação de movimento adicional na primeira rodada.',
        },
        {
          nex: 40,
          nome: 'Ataque Extra',
          descricao: 'Uma vez por rodada, quando faz um ataque, você pode gastar 2 PE para fazer um ataque adicional.',
        },
        {
          nex: 65,
          nome: 'Surto de Adrenalina',
          descricao: 'Uma vez por rodada, você pode gastar 5 PE para realizar uma ação padrão ou de movimento adicional.',
        },
        {
          nex: 99,
          nome: 'Sempre Alerta',
          descricao: 'Você recebe uma ação padrão adicional no início de cada cena de combate.',
        },
      ],
    },
    {
      id: 'tropa-de-choque',
      nome: 'Tropa de Choque',
      descricao: 'Você é duro na queda. Treinou seu corpo para resistir a traumas físicos, tornando-o praticamente inquebrável, e por isso não teme se colocar entre seus aliados e o perigo.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Casca Grossa',
          descricao: 'Você recebe +1 PV para cada 5% de NEX e, quando faz um bloqueio, soma seu Vigor na resistência a dano recebida.',
        },
        {
          nex: 40,
          nome: 'Cai Dentro',
          descricao: 'Sempre que um oponente em alcance curto ataca um de seus aliados, você pode gastar uma reação e 1 PE para fazer com que esse oponente faça um teste de Vontade (DT Vig). Se falhar, o oponente deve atacar você em vez de seu aliado. Este poder só funciona se você puder ser efetivamente atacado e estiver no alcance do ataque (por exemplo, adjacente a um oponente atacando em corpo a corpo ou dentro do alcance de uma arma de ataque à distância). Um oponente que passe no teste de Vontade não pode ser afetado por seu poder Cai Dentro até o final da cena.',
        },
        {
          nex: 65,
          nome: 'Duro de Matar',
          descricao: 'Ao sofrer dano não paranormal, você pode gastar uma reação e 2 PE para reduzir esse dano à metade. Em NEX 85%, você pode usar esta habilidade para reduzir dano paranormal.',
        },
        {
          nex: 99,
          nome: 'Inquebrável',
          descricao: 'Enquanto estiver machucado, você recebe +5 na Defesa e resistência a dano 5. Enquanto estiver morrendo, em vez do normal, você não fica indefeso e ainda pode realizar ações. Você ainda segue as regras de morte normalmente.',
        },
      ],
    },
    {
      id: 'agente-secreto',
      nome: 'Agente Secreto',
      descricao: 'Às vezes, um governo precisa lidar com um problema de forma discreta — por precisar operar fora de sua jurisdição, para não assustar a população ou por vários outros motivos. Quando esse é o caso, usam-se agentes secretos, indivíduos treinados para trabalhar sozinhos ou em pequenos grupos, que contam apenas com suas próprias habilidades, determinação e sorrisos carismáticos. Você se tornou um desses agentes e, por suas capacidades, foi escolhido para a missão mais confidencial de todas — trabalhar com a Ordo Realitas para proteger a humanidade contra o Outro Lado.',
      livro: 'Sobrevivendo ao Horror',
      poderes: [
        {
          nex: 10,
          nome: 'Carteirada',
          descricao: 'Escolha uma perícia entre Diplomacia ou Enganação. Você recebe treinamento na perícia escolhida ou, se já for treinado, recebe +2 nela. Como parte do esforço conjunto da sua agência e da Ordem, no início de cada missão você recebe documentos que lhe fornecem privilégios jurídicos especiais. Esses documentos podem incluir a sua identidade verdadeira ou não, e podem ser individuais ou incluir os demais membros da sua equipe (conforme apropriado à missão). Os benefícios específicos desses documentos ficam a critério do mestre, mas em geral incluem acesso a locais restritos ou proibidos, permissão para portar armas de fogo e autoridade para assumir a jurisdição de investigações da polícia. Pessoas comuns não conseguem perceber que seus documentos são falsos, mas membros de agências de segurança ou indivíduos veteranos em Crime podem desconfiar de sua veracidade. Os documentos contam como itens operacionais que não ocupam espaço — mas cuidado para não perdê-los em locais onde novos não podem ser fornecidos!',
        },
        {
          nex: 40,
          nome: 'O Sorriso',
          descricao: 'Em seu trabalho como agente, você aprendeu que se manter contido com um sorriso “sincero” e palavras gentis são ferramentas muito eficientes em uma investigação. Você recebe +2 em Diplomacia e Enganação e, quando falha em um teste de uma dessas perícias, pode gastar 2 PE para repetir a rolagem (apenas uma vez por teste), mas deve aceitar o novo resultado, mesmo que seja pior que o primeiro. Por fim, uma vez por cena, você pode fazer um teste de Diplomacia para acalmar a si mesmo.',
        },
        {
          nex: 65,
          nome: 'Método Investigativo',
          descricao: 'Acostumado a vasculhar locais em segredo, você aprendeu a ser rápido ou “controlar a situação” antes que coisas ruins aconteçam. A urgência de qualquer cena de investigação em que você esteja presente aumenta em 1 rodada. Além disso, quando o mestre faz uma rolagem na tabela de eventos de investigação, você pode gastar 2 PE para transformar o resultado em “sem evento”. Você pode usar este efeito mais de uma vez na mesma cena, mas a cada uso adicional seu custo aumenta em +2 PE.',
        },
        {
          nex: 99,
          nome: 'Multifacetado',
          descricao: 'Viver sob vários disfarces tem sido útil, mas você faz isso há tanto tempo que talvez nem se lembre mais quem é de verdade. Essas habilidades que surgem quando você precisa foram aprendidas em disfarces anteriores, ou são apenas sua mente buscando uma saída? Uma vez por cena, você pode gastar 5 pontos de Sanidade para receber todas as habilidades de até NEX 65% de uma trilha de combatente ou especialista à sua escolha (você deve cumprir quaisquer pré-requisitos específicos da trilha). Você pode usar essas habilidades até o fim da cena, mas não pode escolher a mesma trilha mais de uma vez na mesma missão. Os pontos de Sanidade gastos para ativar essa habilidade só podem ser recuperados ao fim da missão.',
        },
      ],
    },
    {
      id: 'cacador',
      nome: 'Caçador',
      descricao: 'Em um mundo cheio de predadores sobrenaturais, você decidiu não ser mais uma presa. Valendo-se de relatos de segunda mão, notícias de jornais e relatórios de incidentes inexplicáveis, você reúne informações sobre como caçar as coisas que espreitam na escuridão.',
      livro: 'Sobrevivendo ao Horror',
      poderes: [
        {
          nex: 10,
          nome: 'Rastrear o Paranormal',
          descricao: 'Você estudou criaturas paranormais o suficiente para saber como identificar seus sinais e seguir seus rastros. Você recebe treinamento em Sobrevivência ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, pode usar essa perícia no lugar de Ocultismo para identificar criaturas e no lugar de Investigação e Percepção para perceber e encontrar rastros, pistas e criaturas que tenham traços paranormais.',
        },
        {
          nex: 40,
          nome: 'Estudar Fraquezas',
          descricao: 'Você acredita que todo ser, mesmo aqueles do Outro Lado, tem uma fraqueza. E você vai encontrá-la… você precisa! Você pode gastar uma ação de interlúdio estudando as fraquezas de um ser específico, como uma criatura paranormal ou um membro de um culto. Para isso, você precisa de uma pista diretamente ligada ao ser, como uma parte do seu corpo ou de suas vestes. Ao fim dos estudos, você recebe uma informação útil sobre o ser. Isso pode ser uma característica relevante (“a criatura é do elemento Sangue”) ou uma informação sobre seus hábitos (“apesar de matar qualquer coisa, ela parece preferir idosos”). Além das informações, para cada pista você recebe +1 em testes de perícia contra a criatura até o fim da missão. Cada pista fornece apenas uma informação e, a critério do mestre, informações diferentes podem exigir pistas específicas.',
        },
        {
          nex: 65,
          nome: 'Atacar das Sombras',
          descricao: 'Você aprende a usar as sombras contra o Paranormal. Você não sofre a penalidade de –O em testes de Furtividade por se mover ao seu deslocamento normal e, se estiver usando uma arma que não faça barulho (como uma faca ou um arco), a penalidade que você sofre em Furtividade por atacar na mesma rodada é reduzida para –O. Além disso, sua visibilidade inicial em cenas de furtividade (veja p. 92) é sempre 1 ponto abaixo da inicial (podendo ser negativa).',
        },
        {
          nex: 99,
          nome: 'Estudar a Presa',
          descricao: 'Você sabe que eles são mais fortes e que para derrotá-los precisará revelar todos os seus segredos. Quando usa Estudar Fraquezas contra uma criatura paranormal ou um cultista, você pode transformar o tipo desse ser em sua “presa”. Contra seres desse tipo, você recebe +O em testes de perícia, +1 na margem de ameaça e no multiplicador de crítico e resistência a dano 5. Você só pode ter um tipo de ser como presa ao mesmo tempo.',
        },
      ],
    },
    {
      id: 'monstruoso',
      nome: 'Monstruoso',
      descricao: `Muito se fala sobre os ocultistas escolherem o caminho de tornarem sua mente uma porta para o paranormal, na tentativa de usá-lo contra ele mesmo, mas de vez em quando, um combatente é corajoso ou insano o bastante para fazer o mesmo com seu corpo. Você propositalmente desfigura e altera seu corpo para que as Entidades o invadam com maior intensidade; contudo, para sua infelicidade, os métodos para isso costumam ser brutais. Combatentes dessa trilha que chegam aos níveis mais altos de exposição inevitavelmente perdem o controle e se tornam inimigos da Ordem.`,
      livro: 'Sobrevivendo ao Horror',
      especial: 'Especial: esta trilha usa a “Progressão de NEX” apresentada na regra opcional Nível de Experiência e Nível de Exposição (p. 98), mesmo que esta regra em si não esteja sendo usada. O personagem recebe todas as alterações apropriadas ao seu NEX descritas na progressão e, se a regra de Nível de Experiência estiver em uso, recebe o dobro de NEX sempre que se expõe ao paranormal.',
      nota: `MONSTRUOSA TRANSFORMAÇÃO
Apesar dos alertas e resultados anteriores desastrosos, a tentação de usar o paranormal contra si mesmo é muito grande. Alguns agentes, movidos por orgulho, ingenuidade ou desespero, acabam seguindo esse caminho, acreditando que com eles “será diferente”, e que eles serão aqueles que conseguirão fitar as Entidades e usar seu poder para o bem.

Eles sempre estão errados.

A trilha monstruoso representa uma busca por poder contra o Outro Lado que fatalmente se volta contra o personagem, e cobra o maior dos preços: a perda gradual da humanidade. Quando o personagem atinge NEX 75%, se torna permanentemente perturbado. Suas ações já não são mais aceitas pela Ordem, que vai banir e potencialmente caçar o ex-agente. Um personagem nessa situação ainda pode auxiliar seus antigos colegas, mas perde todo o suporte da Ordem, incluindo acesso a equipamentos (considere que ele começa cada missão com equipamento equivalente a uma patente um nível inferior à sua, conseguido por conta própria).

Quando o personagem atinge NEX 99%, entretanto, sua situação se torna ainda mais severa: sua mente e seu corpo estão no limiar de serem completamente consumidos pelo Outro Lado. Nesse ponto, sua Sanidade é reduzida a 1. Por fim, sempre que ficar enlouquecendo, em vez de sofrer um efeito de insanidade (veja OPRPG, p.111), o personagem fica confuso (a condição se encerra normalmente ou quando o personagem não está mais enlouquecendo). Se um personagem Monstruoso enlouquecer com 99% de NEX, se torna permanentemente uma criatura do Outro Lado.

Se estiver usando a regra opcional Jogando sem Sanidade (p. 104), em vez disso considere que o personagem está sempre perturbado e fica enlouquecendo (e confuso) sempre que perde 1 ponto de determinação por qualquer efeito (exceto por pagar custos de habilidades e itens).`,
      poderes: [
        {
          nex: 10,
          nome: 'Ser Amaldiçoado',
          descricao: `Em suas veias corre uma maldição paranormal que aos poucos o está transformando em um monstro. Você se torna treinado em Ocultismo (se já for treinado, em vez disso recebe +2 nessa perícia). Escolha um elemento paranormal entre Sangue, Morte, Conhecimento ou Energia. Uma vez por dia, você precisa executar uma etapa ritualística desse elemento (por exemplo, beber sangue humano para Sangue, inalar cinzas de mortos para Morte, tatuar palavras que causam medo para Conhecimento ou receber choques de cabos elétricos para Energia). Se fizer isso, até o fim do dia você recebe os efeitos descritos a seguir, conforme o elemento escolhido. Caso contrário, você sofre de fome e sede nesse dia (OPRPG, p. 292). Por fim, se adquirir afinidade com um elemento, deverá escolher aquele selecionado para esta habilidade.

SANGUE Suas presas ficam protuberantes e seus olhos se tornam vermelhos. Você recebe resistência a balístico e Sangue 5 e faro e, quando faz um contra-ataque bem-sucedido, soma seu Vigor na rolagem de dano, mas sofre –O em Ciências e Intuição.

MORTE Você fica pálido e seu metabolismo se torna bem mais lento. Você recebe resistência a perfuração e Morte 5 e imunidade a fadiga e soma sua Força em seu total de pontos de vida, mas sofre –O em Diplomacia e Enganação.

CONHECIMENTO Seus olhos são banhados em um dourado sobrenatural. Você recebe resistência a balístico e Conhecimento 5 e visão no escuro e soma seu Intelecto na Defesa, mas sofre –O em Atletismo e Acrobacia.

ENERGIA Sua pele ganha cicatrizes de queimaduras elétricas com múltiplas cores. Você recebe resistência a corte, eletricidade, fogo e Energia 5 e soma sua Agilidade na RD recebida por um bloqueio bem-sucedido, mas sofre –O em Investigação e Percepção.`,
        },
        {
          nex: 40,
          nome: 'Ser Macabro',
          descricao: `Conforme sua humanidade é substituída pela Entidade, as mudanças em seu corpo e mente se intensificam. A resistência a dano que você recebe por executar a etapa ritualística de seu elemento aumenta para 10, enquanto a penalidade em perícias aumenta para –2O. Por fim, quando executa sua etapa ritualística, você recebe os efeitos adicionais incluídos na descrição de seu elemento, a seguir.

SANGUE Você veste poucas roupas, expondo o máximo de sua pele sensível ao ambiente que puder. Seu corpo já está repleto de cicatrizes e feridas, muitas causadas por você mesmo para saborear a dor. Devorar qualquer coisa que não seja carne ou sangue não é capaz de conter sua fome. Você pode usar Força para calcular seus pontos de esforço (em vez de Presença). Além disso, pode gastar uma ação de movimento e 1 ou mais PE (limitado por sua Força) para recuperar 1d8 PV por PE gasto.

MORTE Roupas modernas e complexas não parecem fazer sentido pra você. Seus trajes são anacrônicos e simples, às vezes adornado de cristais, esqueletos de pequenas criaturas pendurados, pedras, raízes e plantas mortas. Você recebe +O em Intimidação e pode usar Vigor para calcular seus pontos de esforço (em vez de Presença). Além disso, morre se iniciar quatro turnos morrendo na mesma cena (e não apenas três) e não precisa mais comer ou beber para viver, mas ainda sofre da fome paranormal causada por essa trilha.

CONHECIMENTO Você está sempre vestindo joias de ouro puro ou roupas com ouro em suas linhas. Seu corpo está quase inteiramente coberto de palavras que evocam medo, como famosas últimas frases ou pedidos de socorro. Você já sabe que é superior a todos eles. Seu Intelecto aumenta em +1. Além disso, você pode usar Intelecto como atributo-chave para Enganação e para calcular seus pontos de esforço (em vez de Presença).

ENERGIA Você está sempre vestindo roupas complexas e modernas, com luzes brilhantes e dispositivos conectados a baterias e à sua pele para receber pequenos choques estimulantes. Você pode usar Agilidade como atributo-chave para calcular seus pontos de esforço (em vez de Presença). Além disso, quando acerta um ataque corpo a corpo, pode gastar 1 ou mais PE (limitado por sua Agilidade). Se fizer isso, seu ataque causa +1d6 pontos de dano de Energia para cada 1 PE gasto.`,
        },
        {
          nex: 65,
          nome: 'Ser Assustador',
          descricao: `Como um parasita, você sente a Entidade andar por todo o seu corpo, fazendo de você uma morada. A resistência a dano que você recebe por executar a etapa ritualística de seu elemento aumenta para 15, mas sua Presença é reduzida permanentemente em 1. Por fim, quando executa sua etapa ritualística, você recebe os seguintes efeitos adicionais associados ao seu elemento.

SANGUE Você dilacerou seus próprios órgãos sensitivos, como olhos, nariz e orelhas, para que possa sentir com total intensidade o sabor e a dor da sua existência. Arames farpados e lâminas enroladas em seu corpo permitem que você não pare de sentir. A esse ponto, a palavra “não” já parece ser um conceito inútil para suas decisões: você está disposto a aceitar tudo, provar de tudo, sofrer tudo. Você tem 50% de chance de ignorar o dano adicional de um acerto crítico ou ataque furtivo. Além disso, recebe uma arma natural de mordida (dano 1d8, crítico x2, perfuração). Uma vez por rodada, quando usa a ação agredir para atacar com outra arma, você pode gastar 1 PE para fazer um ataque corpo a corpo extra com a mordida.

MORTE O Lodo preto da Morte faz parte do seu consumo diário, ele se espalha pelo seu organismo apodrecendo seu sistema, mantendo-o vivo através da morte. Não é incomum você ser considerado um “acumulador de lixo”: é difícil diferenciar um animal vivo de um galho morto, pois perante a Morte todas as coisas são iguais. No início de cada turno em que estiver morrendo, você pode fazer um teste de Vigor (DT 15). Se passar, encerra a condição morrendo e acorda com 1 PV. Além disso, sempre que faz um acerto crítico em combate ou reduz um inimigo a 0 PV, você recupera 2 PE.

CONHECIMENTO Você injeta e ingere ouro líquido esporadicamente e não há mais espaço para tatuagens. Ler, reler e escrever novos registros faz parte da sua rotina extremamente organizada e metódica. Você pode deixar de ser treinado em uma de suas perícias para receber um número de dados de bônus igual ao seu Intelecto. Até o fim da cena, sempre que fizer um teste, você pode gastar um desses dados de bônus para receber +O nesse teste. Você recupera todas as perícias treinadas perdidas dessa forma ao final de seu próximo interlúdio.

ENERGIA A intensidade dos choques aumenta, além de ter conectado em suas veias pequenos tubos para gotejamento de ácido. Respirar através de uma máscara de gás para inalar alucinógenos a todo momento deixa tudo mais divertido, colorido e caótico. Sua resistência a dano passa a se aplicar também a dano químico. Além disso, você pode extrair energia de fontes elétricas; para isso, deve gastar uma ação de movimento e tocar uma fonte de eletricidade. Você recupera uma quantidade de PE conforme o tipo de fonte: 1d4 PE para um dispositivo portátil, como um tablet ou celular, 2d4 PE para um dispositivo grande, como uma moto ou um carro elétrico, e 4d4 para uma fonte do tamanho de uma casa. Usar este efeito descarrega completamente a fonte e sobrecarrega seus circuitos, que se tornam incapazes de transmitir energia.`,
        },
        {
          nex: 99,
          nome: 'Ser Aterrorizante',
          descricao: `Você foi transformado no habitat perfeito para a entidade que reside no interior de seu corpo e mente. Os efeitos por executar sua etapa ritualística se tornam permanentes (mas você ainda precisa executá-la para evitar sentir fome e sede) e você passa a ser considerado uma criatura paranormal para efeitos de habilidades e itens. Além disso, a resistência a dano que você recebe por essa trilha aumenta para 20 e você recebe os seguintes efeitos adicionais associados ao seu elemento.

SANGUE Você se move como uma criatura bestial; não existe sensibilidade ou empatia. Apenas o instinto e a necessidade de consumir mais. Se o resultado é devorar, essa é a decisão correta. Pensamentos são esporádicos e raros, como pequenos sustos de humanidade que são engolidos pelo fluxo que banha o Outro Lado. Seu Intelecto diminui em –1 e sua Força aumenta em +1. Sempre que causa dano com sua mordida em um ser, você recupera 5 PV (esse ganho também é multiplicado em um acerto crítico). Além disso, você aprende o ritual Forma Monstruosa. Entretanto, seu desejo de assumir essa forma pode sobrepujar sua própria vontade; sempre que sofre dano, você deve fazer um teste de Vontade (DT 10 + o dano sofrido). Se falhar e não estiver sob efeito de Forma Monstruosa, sua próxima ação padrão deve ser conjurar esse ritual (se não puder, você perde a ação).

MORTE Você está morto, mas ainda é forçado a existir. Sua aparência é a de um cadáver apodrecido, todos os seus órgãos foram consumidos pela Morte e, por dedicar sua existência inteira à entidade, você se tornou imortal. Preso na eternidade de cada segundo, você ainda é arrastado pela Realidade pela percepção alheia, pois mesmo que sua mente tenha se tornado o próprio tempo, todas as coisas precisam de um fim. Sua Presença diminui em –1 e seu Vigor aumenta em +1. Você recebe imunidade a dano de Morte e se torna imortal (se morrer, você volta à vida no dia seguinte, sendo “restaurado” pelo Lodo). Entretanto, se for reduzido a 0 PV por dano de fogo ou Energia, seu Lodo é destruído e você não retorna à vida. Por fim, você aprende o ritual Fim Inevitável.

CONHECIMENTO Sua boca desapareceu após você costurá-la com fios dourados, pois ninguém é digno do seu ensinamento. Seus olhos aumentaram e ficaram mais profundos, com escleras negras. Todos os seus membros se alongaram e ficaram mais finos. Suas tatuagens e textos se converteram em sigilos do Outro Lado. A verdade que você deve esquecer está atrás de uma porta dourada, e você consegue enxergá-la, mas sabe que ao abri-la, irá perder tudo. Sua Força diminui em –1 e seu Intelecto aumenta em +1. Além disso, você recebe Percepção às Cegas e aprende um ritual de Conhecimento de 4º círculo a sua escolha. Entretanto, sempre que conjura esse ritual, você perde a memória de tudo que vivenciou desde o início da cena.

ENERGIA Tudo faz parte de você e você é tudo. Você se tornou uma metamorfose ambulante, assumindo uma forma plasmática que não pode ser descrita nem como líquida, sólida ou gasosa. Seu corpo flutua alguns centímetros acima do chão e não é mais possível segurar objetos, afinal tudo que você toca também se torna parte de você enquanto está em contato. Seus traços físicos mudam constantemente e você não pode ser mais descrito com apenas uma aparência definitiva. Decisões lógicas não fazem mais parte da sua vida, o Caos é inevitável. Sua Força diminui em –1 e sua Agilidade aumenta em +1. Você pode pairar a 1,5m do chão com deslocamento 12m (o que permite que ignore terreno difícil e o torna imune a dano por queda), pode passar por qualquer espaço por onde uma criatura Minúscula poderia passar e se torna imune a condições de paralisia de origem física (como ser agarrado ou enredado). Por fim, você aprende o ritual Deflagração de Energia. Entretanto, você não pode mais se beneficiar de itens vestidos e, por não ter corpo físico, só consegue manipular objetos com sua mente; você pode manipular um objeto dessa forma por vez, e apenas objetos que poderia manipular com suas duas mãos.`,
        },
      ],
    },
  ],
};

export default combatente;

// Índices por id
export const PODERES_COMBATENTE_POR_ID = Object.fromEntries(
  combatente.poderes.map((p) => [p.id, p]),
);

export const TRILHAS_COMBATENTE_POR_ID = Object.fromEntries(
  combatente.trilhas.map((t) => [t.id, t]),
);
