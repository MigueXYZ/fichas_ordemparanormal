// Arquivos Secretos 4 (Complexo 0413) — trilha e origens.
// Texto verbatim do PDF "ArquivosSecretos04Verdadeiro.pdf" (Pacote #4, Abril/2026,
// seção "Regras Caóticas", pp. 64-65 e 69). Nada foi resumido, traduzido ou inventado.
//
// Aviso de correção: uma versão anterior deste ficheiro (nunca chegou a existir como
// as04.js — as duas entradas erradas viviam soltas em origens.js) continha duas
// "origens" fabricadas ("Antepassado Jurássico" e "Conhecimento Galináceo") que não
// existem em nenhum livro. Foram removidas ao ler o PDF real do pacote.

export const TRILHAS_AS04 = [
  {
    classe: 'especialista',
    id: 'granadeiro-blaster',
    nome: 'Granadeiro Blaster',
    descricao: `Quem pensa que nerds não podem ser assustadores ainda não conhece um nerd de explosivos como você. Quando se trata de enfrentar o paranormal, poder de fogo nunca é o suficiente: granadas, explosivos, bombas, um pouco de pólvora e nitroglicerina ou qualquer outro agente explosivo é mais eficiente quando está nas suas mãos.`,
    livro: 'Arquivos Secretos 4',
    poderes: [
      {
        nex: 10,
        nome: 'Meus bebês',
        descricao: `Se quer um trabalho bem feito, faça você mesmo. Você recebe treinamento em Profissão (químico) e, se já for treinado nessa perícia, recebe +5 nela. Além disso, começa a missão com 1 explosivo autoral (não conta para o seu limite de itens). O número de explosivos autorais no começo da missão aumenta em +1 nos NEX 40%, 65% e 99%. Explosivos autorais são explosivos fabricados por você e você pode produzir mais deles com as regras de Fabricação em Campo (SaH, p. 94).`,
      },
      {
        nex: 40,
        nome: 'Fogo Amigo',
        descricao: `É bom que quem te acompanhe tenha assinado um termo de condições à respeito de seus comportamentos explosivos. Você recebe o poder Perito em Explosivos (OPRPG, p. 30). Se já o tiver, ou o adquirir novamente (é permitido uma única vez), você dobra o valor adicionado para resistir aos seus explosivos e a quantidade de alvos que pode excluir dos seus efeitos. Além disso, a medida da área afetada pelos seus explosivos aumenta em +6m. Por exemplo, uma granada passa a afetar um raio de 12m enquanto uma mina antipessoal passa a afetar um cone de 12m.`,
      },
      {
        nex: 65,
        nome: 'O Calor do Momento',
        descricao: `Não se pode estar preparado para tudo. Quando a hora "H" chegar, o improviso virá à calhar. Você pode gastar uma ação completa e 4 PE para tentar fabricar um explosivo autoral apressadamente. Ele conta com todos os bônus de um explosivo autoral normal, porém tem 25% de chance (1 a 25 em 1d100) de explodir na sua mão quando tentar usá-lo (mesmo em um lança-granadas).`,
      },
      {
        nex: 99,
        nome: 'Memória Muscular',
        descricao: `Suas criações agem quase como uma extensão do seu corpo ou de quem as use. Explosivos autorais fabricados por você podem ser empunhados por qualquer pessoa como ação livre, e você pode gastar 4 PE para usar um explosivo autoral como uma ação de movimento (mesmo em um lança-granadas). Além disso, seus explosivos autorais causam o dobro dos dados de dano.`,
      },
    ],
  },
];

export const ORIGENS_AS04 = [
  {
    id: 'influencer-paranormal',
    nome: 'Influencer Paranormal',
    descricao: `De início, você nunca acreditou nas lendas urbanas e vídeos de fantasmas, então resolveu se aproveitar daqueles que acreditam. Foi produzindo conteúdos falsos e duvidosos para a internet que você descobriu a dura verdade por trás da Membrana.`,
    pericias: ['enganacao', 'tecnologia'],
    periciasLivres: 0,
    periciasNota: '',
    poder: {
      nome: 'Registrar o Paranormal',
      descricao: `Uma vez por cena, você pode gastar uma ação padrão e 2 PE para criar um registro de uma criatura paranormal ou ritual que tenha sido conjurado na mesma cena. A ação padrão deve ser gasta para tirar uma foto, fazer um vídeo ou algum tipo de registro desse tipo. Você recebe +5 em testes contra presença perturbadora de criaturas que tenham sido registradas previamente. Além disso, pode gastar uma ação de interlúdio para memorizar um único ritual registrado, podendo conjurá-lo como se o conhecesse até a próxima cena de interlúdio, desde que tenha o NEX necessário (1º círculo a partir do NEX 5%, 2º círculo a partir do NEX 25%, 3º círculo a partir do NEX 55% e 4º círculo a partir do NEX 85%).`,
    },
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'cacador-de-recompensas',
    nome: 'Caçador de Recompensas',
    descricao: `Sua sede pelo dinheiro fácil sempre te guiou na exploração dos locais mais obscuros. Você sabe muito bem que as situações mais insalubres guardam as melhores recompensas.`,
    pericias: ['crime', 'investigacao'],
    periciasLivres: 0,
    periciasNota: '',
    poder: {
      nome: 'Quem Não Arrisca, Não Petisca',
      descricao: `Você recebe +2 em testes para resistir à condições mentais e de medo. Além disso, caso falhe em algum desses testes, você recebe +1d20 no próximo teste que fizer. Esse bônus termina no fim da cena e não é cumulativo com ele mesmo.`,
    },
    livro: 'Arquivos Secretos 4',
  },
];
