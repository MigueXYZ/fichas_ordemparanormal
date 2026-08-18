const especialista = {
  id: 'especialista',
  nome: 'Especialista',
  descricao: [
    'Um agente que confia mais em esperteza do que em força bruta. Um especialista se vale de conhecimento técnico, raciocínio rápido ou mesmo lábia para resolver mistérios e enfrentar o paranormal.',
    'Cientistas, inventores, pesquisadores e técnicos de vários tipos são exemplos de especialistas, que são tão variados quanto as áreas do conhecimento e da tecnologia. Alguns ainda preferem estudar engenharia social e se tornam excelentes espiões infiltrados, ou mesmo estudam técnicas especiais de combate como artes marciais e tiro a distância, aliando conhecimento técnico e habilidade.',
    'O que une todos os especialistas é sua incrível capacidade de aprender e improvisar usando seu intelecto e conhecimento avançado, que pode tirar o grupo todo dos mais diversos tipos de enrascadas.',
    'Especialistas Famosos: Aaron, Arthur Cervero, Rubens Naluti, Elizabeth Webber, Samuel Norte, Chizue Akechi.',
  ].join('\n\n'),
  livro: 'Livro Base',

  progressao: {
    pv: { inicial: 16, somaAtributo: 'vig', porNex: 3, porNexSomaAtributo: 'vig' },
    san: { inicial: 16, somaAtributo: null, porNex: 4, porNexSomaAtributo: null },
    pe: { inicial: 3, somaAtributo: 'pre', porNex: 3, porNexSomaAtributo: 'pre' },
  },

  pericias: {
    obrigatorias: [],
    escolhas: [],
    livres: { base: 7, somaAtributo: 'int' },
    nota: 'Uma quantidade de perícias à sua escolha igual a 7 + Intelecto.',
  },

  proficiencias: ['Armas simples', 'Proteções leves'],

  tabelaNex: [
    { nex: 5, habilidades: ['Eclético', 'Perito (2 PE, +1d6)'] },
    { nex: 10, habilidades: ['Habilidade de trilha'] },
    { nex: 15, habilidades: ['Poder de especialista'] },
    { nex: 20, habilidades: ['Aumento de atributo'] },
    { nex: 25, habilidades: ['Perito (3 PE, +1d8)'] },
    { nex: 30, habilidades: ['Poder de especialista'] },
    { nex: 35, habilidades: ['Grau de treinamento'] },
    { nex: 40, habilidades: ['Engenhosidade (veterano)', 'Habilidade de trilha'] },
    { nex: 45, habilidades: ['Poder de especialista'] },
    { nex: 50, habilidades: ['Aumento de atributo', 'Versatilidade'] },
    { nex: 55, habilidades: ['Perito (4 PE, +1d10)'] },
    { nex: 60, habilidades: ['Poder de especialista'] },
    { nex: 65, habilidades: ['Habilidade de trilha'] },
    { nex: 70, habilidades: ['Grau de treinamento'] },
    { nex: 75, habilidades: ['Engenhosidade (expert)', 'Poder de especialista'] },
    { nex: 80, habilidades: ['Aumento de atributo'] },
    { nex: 85, habilidades: ['Perito (5 PE, +1d12)'] },
    { nex: 90, habilidades: ['Poder de especialista'] },
    { nex: 95, habilidades: ['Aumento de atributo'] },
    { nex: 99, habilidades: ['Habilidade de trilha'] },
  ],

  habilidades: [
    {
      nome: 'Eclético',
      nex: 5,
      descricao: 'Quando faz um teste de uma perícia, você pode gastar 2 PE para receber os benefícios de ser treinado nesta perícia.',
    },
    {
      nome: 'Perito',
      nex: 5,
      descricao: 'Escolha duas perícias nas quais você é treinado (exceto Luta e Pontaria). Quando faz um teste de uma dessas perícias, você pode gastar 2 PE para somar +1d6 no resultado do teste. Conforme avança de NEX, você pode gastar +1 PE para aumentar o dado de bônus (veja a Tabela 1.4). Por exemplo, em NEX 55%, pode gastar 4 PE para receber +1d10 no teste.',
    },
    {
      nome: 'Habilidade de Trilha',
      nex: 10,
      descricao: 'Em NEX 10% você escolhe uma das trilhas de especialista disponíveis e recebe o primeiro poder da trilha escolhida. Você recebe um novo poder da trilha escolhida respectivamente em NEX 40%, 65% e 99%. Veja a descrição das trilhas nas páginas 30 e 31.',
    },
    {
      nome: 'Poder de Especialista',
      nex: 15,
      descricao: 'Em NEX 15%, você recebe um poder de especialista à sua escolha. Você recebe um novo poder de especialista em NEX 30% e a cada 15% de NEX subsequentes, conforme indicado na tabela. Veja a lista de poderes a seguir.',
    },
    {
      nome: 'Aumento de Atributo',
      nex: 20,
      descricao: 'Em NEX 20%, e novamente em NEX 50%, 80% e 95%, aumente um atributo a sua escolha em +1. Você não pode aumentar um atributo além de 5 desta forma.',
    },
    {
      nome: 'Grau de Treinamento',
      nex: 35,
      descricao: 'Em NEX 35%, e novamente em NEX 70%, escolha um número de perícias treinadas igual a 5 + Int. Seu grau de treinamento nessas perícias aumenta em um (de treinado para veterano ou de veterano para expert).',
    },
    {
      nome: 'Engenhosidade',
      nex: 40,
      descricao: 'Em NEX 40%, quando usa sua habilidade Eclético, você pode gastar 2 PE adicionais para receber os benefícios de ser veterano na perícia. Em NEX 75%, pode gastar 4 PE adicionais para receber os benefícios de ser expert na perícia.',
    },
    {
      nome: 'Versatilidade',
      nex: 50,
      descricao: 'Em NEX 50%, escolha entre receber um poder de especialista ou o primeiro poder de uma trilha de especialista que não a sua.',
    },
  ],

  poderes: [
    {
      id: 'artista-marcial',
      nome: 'Artista Marcial',
      descricao: 'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'balistica-avancada',
      nome: 'Balística Avançada',
      descricao: 'Você recebe proficiência com armas táticas de fogo e +2 em rolagens de dano com armas de fogo.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'conhecimento-aplicado',
      nome: 'Conhecimento Aplicado',
      descricao: 'Quando faz um teste de perícia (exceto Luta e Pontaria), você pode gastar 2 PE para mudar o atributo-base da perícia para Int.',
      prerequisito: 'Int 2.',
      livro: 'Livro Base',
    },
    {
      id: 'hacker',
      nome: 'Hacker',
      descricao: 'Você recebe +5 em testes de Tecnologia para invadir sistemas e diminui o tempo necessário para hackear qualquer sistema para uma ação completa.',
      prerequisito: 'Treinado em Tecnologia.',
      livro: 'Livro Base',
    },
    {
      id: 'maos-rapidas',
      nome: 'Mãos Rápidas',
      descricao: 'Ao fazer um teste de Crime, você pode pagar 1 PE para fazê-lo como uma ação livre.',
      prerequisito: 'Agi 3, treinado em Crime.',
      livro: 'Livro Base',
    },
    {
      id: 'mochila-de-utilidades',
      nome: 'Mochila de Utilidades',
      descricao: 'Um item a sua escolha (exceto armas) conta como uma categoria abaixo e ocupa 1 espaço a menos.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'movimento-tatico',
      nome: 'Movimento Tático',
      descricao: 'Você pode gastar 1 PE para ignorar a penalidade em deslocamento por terreno difícil e por escalar até o final do turno.',
      prerequisito: 'Treinado em Atletismo.',
      livro: 'Livro Base',
    },
    {
      id: 'na-trilha-certa',
      nome: 'Na Trilha Certa',
      descricao: 'Sempre que tiver sucesso em um teste para procurar pistas, você pode gastar 1 PE para receber +O no próximo teste. Os custos e os bônus são cumulativos (se passar num segundo teste, pode pagar 2 PE para receber um total de +OO no próximo teste, e assim por diante).',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'nerd',
      nome: 'Nerd',
      descricao: 'Você é um repositório de conhecimento útil (e inútil). Uma vez por cena, pode gastar 2 PE para fazer um teste de Atualidades (DT 20). Se passar, recebe uma informação útil para essa cena (se for uma investigação, uma dica para uma pista; se for um combate, uma fraqueza de um inimigo, e assim por diante). A fonte da informação pode ser desde um livro antigo que você leu na biblioteca até um episódio de sua série de ficção favorita.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'ninja-urbano',
      nome: 'Ninja Urbano',
      descricao: 'Você recebe proficiência com armas táticas de ataque corpo a corpo e de disparo (exceto de fogo) e +2 em rolagens de dano com armas de corpo a corpo e de disparo.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'pensamento-agil',
      nome: 'Pensamento Ágil',
      descricao: 'Uma vez por rodada, durante uma cena de investigação, você pode gastar 2 PE para fazer uma ação de procurar pistas adicional.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'perito-em-explosivos',
      nome: 'Perito em Explosivos',
      descricao: 'Você soma seu Intelecto na DT para resistir aos seus explosivos e pode excluir dos efeitos da explosão um número de alvos igual ao seu valor de Intelecto.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'primeira-impressao',
      nome: 'Primeira Impressão',
      descricao: 'Você recebe +OO no primeiro teste de Diplomacia, Enganação, Intimidação ou Intuição que fizer em uma cena.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'transcender',
      nome: 'Transcender',
      descricao: 'Escolha um poder paranormal (veja a página 114). Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.',
      prerequisito: '',
      livro: 'Livro Base',
    },
    {
      id: 'treinamento-em-pericia',
      nome: 'Treinamento em Perícia',
      descricao: 'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.',
      prerequisito: '',
      livro: 'Livro Base',
    },

    {
      id: 'acolher-o-terror',
      nome: 'Acolher o Terror',
      descricao: 'Você já sofreu tanto medo que às vezes aceitar o terror é como voltar para casa. Você pode se entregar para o medo (veja p. 88) uma vez por sessão de jogo adicional.',
      prerequisito: '',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'contatos-oportunos',
      nome: 'Contatos Oportunos',
      descricao: 'Ao longo de sua vida, você fez amizades úteis com pessoas de vários tipos em muitos lugares. Você pode usar uma ação de interlúdio para acionar seus contatos locais. Você recebe um aliado de um tipo à sua escolha (veja OPRPG, p. 170), que lhe acompanha até o fim da missão ou até ser dispensado. Você só pode ter um desses aliados por vez, e o mestre tem a palavra final sobre a disponibilidade de cada aliado.',
      prerequisito: 'Treinado em Crime.',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'disfarce-sutil',
      nome: 'Disfarce Sutil',
      descricao: 'Você sabe como se disfarçar rapidamente, usando pequenos detalhes para alterar sua aparência. Quando faz um disfarce em si mesmo usando Enganação, você pode gastar 1 PE para se disfarçar como uma ação completa e sem necessidade de um kit de disfarces (se usar um kit, recebe +5 no teste).',
      prerequisito: 'Pre 2, treinado em Enganação.',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'esconderijo-desesperado',
      nome: 'Esconderijo Desesperado',
      descricao: 'Você já esteve diante de coisas que não podem ser derrotadas e aprendeu da forma mais trágica que às vezes se esconder é a única chance de vitória. Você não sofre –O em testes de Furtividade por se mover ao seu deslocamento normal. Além disso, em cenas de furtividade (veja p. 92), sempre que passa em um teste para esconder-se, sua visibilidade diminui em –2 (em vez de apenas –1).',
      prerequisito: '',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'especialista-diletante',
      nome: 'Especialista Diletante',
      descricao: 'A vida lhe ensinou que todo tipo de conhecimento pode ser útil. Você aprende um poder que não pertença à sua classe (exceto poderes de trilha ou paranormais), à sua escolha, cujos pré-requisitos possa cumprir.',
      prerequisito: 'NEX 30%.',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'flashback',
      nome: 'Flashback',
      descricao: 'Um novo trauma recente desbloqueia um conhecimento adormecido. Talvez fosse uma memória enterrada fundo em sua mente, ou uma habilidade desenvolvida por seu cérebro como um mecanismo de defesa. Escolha uma origem que não seja a sua. Você recebe o poder dessa origem.',
      prerequisito: '',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'leitura-fria',
      nome: 'Leitura Fria',
      descricao: 'Você estudou técnicas de “leitura fria”, a capacidade de analisar e compreender uma pessoa através de suas mais sutis reações. Uma vez em cada interlúdio, se passar alguns minutos interagindo com uma pessoa, ou mesmo observando-a no mesmo ambiente, você pode fazer três perguntas pessoais sobre ela, tais como “Qual seu filme favorito?”, “Qual sua profissão?” “Tem algum animal de estimação?”. O mestre pode responder com a verdade ou se negar a responder, mas, para cada pergunta não respondida, você recebe 2 PE temporários que duram até o fim da missão. Esse poder só pode ser usado uma vez em cada pessoa, e apenas em NPCs.',
      prerequisito: 'Treinado em Intuição.',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'maos-firmes',
      nome: 'Mãos Firmes',
      descricao: 'Quando há um caçador à espreita, derrubar sequer uma agulha pode ser o suficiente para revelar sua localização. E você não quer que isso aconteça. Quando faz um teste de Furtividade para esconder-se ou para executar uma ação discreta que envolva manipular um objeto (como em uma cena de furtividade), você pode gastar 2 PE para receber +O nesse teste.',
      prerequisito: 'Treinado em Furtividade.',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'plano-de-fuga',
      nome: 'Plano de Fuga',
      descricao: 'A todo momento você está criando cenários imaginários e possibilidades na sua mente, pensando em estratégias que usaria para escapar de perseguidores. Você pode usar Intelecto no lugar de Força para a ação criar obstáculos (p. 90) em uma perseguição. Além disso, uma vez por cena, pode gastar 2 PE para dispensar o teste e ser bem-sucedido nesta ação.',
      prerequisito: '',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'remoer-memorias',
      nome: 'Remoer Memórias',
      descricao: 'Sua mente está constantemente revivendo memórias do passado, sejam elas boas ou ruins. Uma vez por cena, quando faz um teste de perícia baseada em Intelecto ou Presença, você pode gastar 2 PE para substituir esse teste por um teste de Intelecto com DT 15.',
      prerequisito: 'Int 1.',
      livro: 'Sobrevivendo ao Horror',
    },
    {
      id: 'resistir-a-pressao',
      nome: 'Resistir à Pressão',
      descricao: 'A ansiedade de correr contra o relógio o deixa mais eficiente. Uma vez por cena de investigação, você pode gastar 5 PE para coordenar os esforços de seus companheiros. A urgência da investigação aumenta em 1 rodada, e durante esta rodada adicional todos os personagens (incluindo você) recebem +2 em testes de perícia.',
      prerequisito: 'Treinado em Investigação.',
      livro: 'Sobrevivendo ao Horror',
    },
  ],

  trilhas: [
    {
      id: 'atirador-de-elite',
      nome: 'Atirador de Elite',
      descricao: 'Um tiro, uma morte. Ao contrário dos combatentes, você é perito em neutralizar ameaças de longe, terminando uma briga antes mesmo que ela comece. Você trata sua arma como uma ferramenta de precisão, sendo capaz de executar façanhas incríveis.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Mira de Elite',
          descricao: 'Você recebe proficiência com armas de fogo que usam balas longas e soma seu Intelecto em rolagens de dano com essas armas.',
        },
        {
          nex: 40,
          nome: 'Disparo Letal',
          descricao: 'Quando faz a ação mirar você pode gastar 1 PE para aumentar em +2 a margem de ameaça do próximo ataque que fizer até o final de seu próximo turno.',
        },
        {
          nex: 65,
          nome: 'Disparo Impactante',
          descricao: 'Se estiver usando uma arma de fogo com calibre grosso você pode gastar 2 PE para fazer as manobras derrubar, desarmar, empurrar ou quebrar usando um ataque à distância.',
        },
        {
          nex: 99,
          nome: 'Atirar para Matar',
          descricao: 'Quando faz um acerto crítico com uma arma de fogo, você causa dano máximo, sem precisar rolar dados.',
        },
      ],
    },
    {
      id: 'infiltrador',
      nome: 'Infiltrador',
      descricao: 'Você é um perito em infiltração e sabe neutralizar alvos desprevenidos sem causar alarde. Combinando talento acrobático, destreza manual e conhecimento técnico você é capaz de superar qualquer barreira de defesa, mesmo quando a missão parece impossível.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Ataque Furtivo',
          descricao: 'Você sabe atingir os pontos vitais de um inimigo distraído. Uma vez por rodada, quando atinge um alvo desprevenido com um ataque corpo a corpo ou em alcance curto, ou um alvo que você esteja flanqueando, você pode gastar 1 PE para causar +1d6 pontos de dano do mesmo tipo da arma. Em NEX 40% o dano adicional aumenta para +2d6, em NEX 65% aumenta para +3d6 e em NEX 99% aumenta para +4d6.',
        },
        {
          nex: 40,
          nome: 'Gatuno',
          descricao: 'Você recebe +5 em Atletismo e Crime e pode percorrer seu deslocamento normal quando se esconder sem penalidade (veja a perícia Furtividade).',
        },
        {
          nex: 65,
          nome: 'Assassinar',
          descricao: 'Você pode gastar uma ação de movimento e 3 PE para analisar um alvo em alcance curto. Até o fim de seu próximo turno, seu primeiro Ataque Furtivo que causar dano a ele tem seus dados de dano extras dessa habilidade dobrados. Além disso, se sofrer dano de seu ataque, o alvo fica inconsciente ou morrendo, à sua escolha (Fortitude DT Agi evita).',
        },
        {
          nex: 99,
          nome: 'Sombra Fugaz',
          descricao: 'Quando faz um teste de Furtividade após atacar ou fazer outra ação chamativa, você pode gastar 3 PE para não sofrer a penalidade de –OOO no teste.',
        },
      ],
    },
    {
      id: 'medico-de-campo',
      nome: 'Médico de Campo',
      descricao: 'Você é treinado em técnicas de primeiros socorros e tratamento de emergência, o que torna você um membro valioso para qualquer grupo de agentes. Ao contrário dos profissionais de saúde convencionais, você está acostumado com o campo de batalha e sabe tomar decisões rápidas no meio do caos.\n\nEspecial: para escolher esta trilha, você precisa ser treinado em Medicina. Para usar as habilidades desta trilha, você precisa possuir um kit de medicina.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Paramédico',
          descricao: 'Você pode usar uma ação padrão e 2 PE para curar 2d10 pontos de vida de si mesmo ou de um aliado adjacente. Você pode curar +1d10 PV respectivamente em NEX 40%, 65% e 99%, gastando +1 PE por dado adicional de cura.',
        },
        {
          nex: 40,
          nome: 'Equipe de Trauma',
          descricao: 'Você pode usar uma ação padrão e 2 PE para remover uma condição negativa (exceto morrendo) de um aliado adjacente.',
        },
        {
          nex: 65,
          nome: 'Resgate',
          descricao: 'Uma vez por rodada, se estiver em alcance curto de um aliado machucado ou morrendo, você pode se aproximar do aliado com uma ação livre (desde que seja capaz de fazê-lo usando seu deslocamento normal). Além disso, sempre que curar PV ou remover condições do aliado, você e o aliado recebem +5 na Defesa até o início de seu próximo turno. Por fim, para você, o total de espaços ocupados por carregar um personagem é reduzido pela metade.',
        },
        {
          nex: 99,
          nome: 'Reanimação',
          descricao: 'Uma vez por cena, você pode gastar uma ação completa e 10 PE para trazer de volta à vida um personagem que tenha morrido na mesma cena (exceto morte por dano massivo).',
        },
      ],
    },
    {
      id: 'negociador',
      nome: 'Negociador',
      descricao: 'Você é um diplomata habilidoso e consegue influenciar outras pessoas, seja por lábia ou intimidação. Sua capacidade de avaliar situações com rapidez e eficiência pode tirar o grupo de apuros que nem a mais poderosa das armas poderia resolver.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Eloquência',
          descricao: 'Você pode usar uma ação completa e 1 PE por alvo em alcance curto para afetar outros personagens com sua fala. Faça um teste de Diplomacia, Enganação ou Intimidação contra a Vontade dos alvos. Se você vencer, os alvos ficam fascinados enquanto você se concentrar (uma ação padrão por rodada). Um alvo hostil ou que esteja envolvido em combate recebe +5 em seu teste de resistência e tem direito a um novo teste por rodada, sempre que você se concentrar. Um personagem que passar no teste fica imune a este efeito por um dia.',
        },
        {
          nex: 40,
          nome: 'Discurso Motivador',
          descricao: 'Você pode gastar uma ação padrão e 4 PE para inspirar seus aliados com suas palavras. Você e todos os seus aliados em alcance curto ganham +O em testes de perícia até o fim da cena. A partir de NEX 65%, você pode gastar 8 PE para fornecer um bônus total de +OO.',
        },
        {
          nex: 65,
          nome: 'Eu Conheço um Cara',
          descricao: 'Uma vez por missão, você pode ativar sua rede de contatos para pedir um favor, como por exemplo trocar todo o equipamento do seu grupo (como se tivesse uma segunda fase de preparação de missão), conseguir um local de descanso ou mesmo ser resgatado de uma cena. O mestre tem a palavra final de quando é possível usar essa habilidade e quais favores podem ser obtidos.',
        },
        {
          nex: 99,
          nome: 'Truque de Mestre',
          descricao: 'Acostumado a uma vida de fingimento e manipulação, você pode gastar 5 PE para simular o efeito de qualquer habilidade que você tenha visto um de seus aliados usar durante a cena. Você ignora os pré-requisitos da habilidade, mas ainda precisa pagar todos os seus custos, incluindo ações, PE e materiais, e ela usa os seus parâmetros de jogo, como se você estivesse usando a habilidade em questão.',
        },
      ],
    },
    {
      id: 'tecnico',
      nome: 'Técnico',
      descricao: 'Sua principal habilidade é a manutenção e reparo do valioso equipamento que seu time carrega em missão. Seu conhecimento técnico também permite que improvise ferramentas com o que tiver à disposição e sabote os itens usados por seus inimigos.',
      livro: 'Livro Base',
      poderes: [
        {
          nex: 10,
          nome: 'Inventário Otimizado',
          descricao: 'Você soma seu Intelecto à sua Força para calcular sua capacidade de carga. Por exemplo, se você tem Força 1 e Intelecto 3, seu inventário tem 20 espaços.',
        },
        {
          nex: 40,
          nome: 'Remendão',
          descricao: 'Você pode gastar uma ação completa e 1 PE para remover a condição quebrado de um equipamento adjacente até o final da cena. Além disso, qualquer equipamento geral tem sua categoria reduzida em I para você.',
        },
        {
          nex: 65,
          nome: 'Improvisar',
          descricao: 'Você pode improvisar equipamentos com materiais ao seu redor. Escolha um equipamento geral e gaste uma ação completa e 2 PE, mais 2 PE por categoria do item escolhido. Você cria uma versão funcional do equipamento, que segue suas regras de espaço e categoria como normal. Ao final da cena, seu equipamento improvisado se torna inútil.',
        },
        {
          nex: 99,
          nome: 'Preparado para Tudo',
          descricao: 'Você sempre tem o que precisa para qualquer situação. Sempre que precisar de um item qualquer (exceto armas), pode gastar uma ação de movimento e 3 PE por categoria do item para lembrar que colocou ele no fundo da bolsa! Depois de encontrado, o item segue normalmente as regras de inventário.',
        },
      ],
    },
    {
      id: 'bibliotecario',
      nome: 'Bibliotecário',
      descricao: 'Poucas pessoas lêem tanto quanto você, mas diferente do que imaginam, passar a vida cercado de conhecimento não o torna menos apto. Na verdade, seu vasto conhecimento é muitas vezes a única solução para situações desesperadoras. Alguém precisa ser a chave dos segredos. Alguém precisa saber, mesmo que isso signifique perder.',
      livro: 'Sobrevivendo ao Horror',
      poderes: [
        {
          nex: 10,
          nome: 'Conhecimento Prático',
          descricao: 'Você pode se lembrar de muitas informações úteis de suas leituras. Quando faz um teste de perícia (exceto Luta e Pontaria), você pode gastar 2 PE para mudar o atributo-base da perícia para Int. Se possuir o poder Conhecimento Aplicado, em vez disso seu custo é reduzido em –1 PE.',
        },
        {
          nex: 40,
          nome: 'Leitor Contumaz',
          descricao: 'Você consome livros de forma obstinada. Cada dado de bônus que você recebe pela ação de interlúdio ler aumenta para 1d8 e você pode aplicar esse bônus em testes de qualquer perícia. Além disso, quando usa este bônus em um teste, você pode gastar 2 PE para aumentá-lo em +1 dado (de 1d8 para 2d8).',
        },
        {
          nex: 65,
          nome: 'Rato de Biblioteca',
          descricao: 'Acostumado com bibliotecas, você sabe como extrair informações de qualquer lugar repleto de livros. Se estiver em um ambiente com muitos livros (como uma livraria, uma biblioteca ou um antiquário), você pode gastar alguns minutos (ou, se estiver em uma cena de investigação, uma rodada) para receber os benefícios de uma ação de interlúdio à sua escolha entre ler e revisar caso. Você só pode usar essa habilidade uma vez por cena.',
        },
        {
          nex: 99,
          nome: 'A Força do Saber',
          descricao: 'Tanto tempo passado entre livros e textos fortaleceu sua mente. Seu Intelecto aumenta em +1 e você soma o valor desse atributo em seu total de PE. Além disso, escolha uma perícia qualquer. Você troca o atributo-base dessa perícia para Intelecto.',
        },
      ],
    },
    {
      id: 'muambeiro',
      nome: 'Muambeiro',
      descricao: 'Você sempre foi bom em lidar com equipamentos, e aprendeu como produzir ou encontrar, os itens certos em qualquer ocasião. Esse talento pode ser fundamental para manter todos em sua equipe vivos.',
      livro: 'Sobrevivendo ao Horror',
      poderes: [
        {
          nex: 10,
          nome: 'Mascate',
          descricao: 'Você aprendeu um ofício útil e desenvolveu métodos para ter sempre à mão o que precisa para praticá-lo. Você recebe treinamento em uma Profissão à sua escolha entre armeiro, engenheiro ou químico, e recebe +5 em sua capacidade de carga. Além disso, quando fabrica um item improvisado a DT é reduzida em –10 (em vez de –5).',
        },
        {
          nex: 40,
          nome: 'Fabricação Própria',
          descricao: 'Você desenvolveu suas próprias técnicas para fabricar equipamentos rapidamente. Você leva apenas metade do tempo para fabricar itens mundanos. Ou seja, com uma ação de manutenção pode fabricar duas munições, explosivos e demais consumíveis, e precisa de apenas uma ação de manutenção para armas, proteções e demais equipamentos gerais (itens modificados ou paranormais não são afetados por esta habilidade).',
        },
        {
          nex: 65,
          nome: 'Laboratório de Campo',
          descricao: 'Sua habilidade em reparar e fabricar itens permite que você lide com a complexidade de dispositivos paranormais. Você recebe treinamento em uma Profissão à sua escolha entre armeiro, engenheiro ou químico ou, se já for treinado em uma dessas perícias, recebe +5 nela. Além disso, você pode usar fabricação em campo para fabricar e consertar itens paranormais (fabricar um item paranormal exige três ações de interlúdio que não precisam ser consecutivas, veja p. 94).',
        },
        {
          nex: 99,
          nome: 'Achado Conveniente',
          descricao: 'Entre protótipos e itens encontrados durante a missão, sua mochila sempre pode ter a ferramenta certa para a ocasião. Você pode gastar uma ação completa e 5 PE para “produzir” um item de até categoria III (exceto itens paranormais). O item pode ser um protótipo em que você estava trabalhando, um item encontrado anteriormente na missão ou qualquer outra justificativa aprovada pelo mestre. O item permanece em funcionamento até o fim da cena, quando então deixa de funcionar permanentemente (fica sem energia ou munição, uma peça fundamental se gasta ou quebra etc).',
        },
      ],
    },
    {
      id: 'perseverante',
      nome: 'Perseverante',
      descricao: 'Você sabe que é um sobrevivente. Talvez tenha sido o único a escapar com vida de uma grande tragédia, ou simplesmente possua o espírito necessário para perseverar onde todos os outros caíram. Em filmes de terror, os monstros e assassinos costumam pegar suas vítimas isoladas uma a uma com facilidade, até se depararem com uma protagonista resiliente e que parece nunca desistir. Seja por experiência ou instinto, você tem certeza que se estivesse em um desses filmes, seria o último sobrevivente a sair vivo no final.',
      livro: 'Sobrevivendo ao Horror',
      poderes: [
        {
          nex: 10,
          nome: 'Soluções Improvisadas',
          descricao: 'Você não é um sobrevivente à toa. Quando as coisas dão errado, você consegue pensar em alguma solução inusitada. Você pode gastar 2 PE para rolar novamente 1 dos dados de um teste recém-realizado (apenas uma vez por teste) e ficar com o melhor resultado entre as duas rolagens.',
        },
        {
          nex: 40,
          nome: 'Fuga Obstinada',
          descricao: 'Seu instinto de sobrevivência lhe impulsiona para desprender as mais desesperadas fugas. Você recebe +O em testes de perícia para fugir de um inimigo (seja em uma perseguição ou não). Além disso, em cenas de perseguição, se você for a presa, pode acumular até 4 falhas antes de ser pego.',
        },
        {
          nex: 65,
          nome: 'Determinação Inquestionável',
          descricao: 'Nos momentos mais sombrios, você consegue encontrar em seu interior a força para perseverar. Uma vez por cena, você pode gastar 5 PE e uma ação padrão para remover uma condição de medo, mental ou de paralisia que esteja lhe afligindo. A critério do mestre, certas condições, como paralisia causada por uma doença, não podem ser removidas por essa habilidade.',
        },
        {
          nex: 99,
          nome: 'Só Mais um Passo...',
          descricao: 'Você não chegou até aqui para morrer, e fará qualquer coisa para escapar com vida. Uma vez por rodada, quando sofre dano que reduziria seus PV a 0, você pode gastar 5 PE para, em vez disso, ficar com 1 PV. Esta habilidade não funciona contra dano massivo.',
        },
      ],
    },
  ],
};

export const poderesPorId = Object.fromEntries(
  especialista.poderes.map((p) => [p.id, p]),
);

export const trilhasPorId = Object.fromEntries(
  especialista.trilhas.map((t) => [t.id, t]),
);

export default especialista;
