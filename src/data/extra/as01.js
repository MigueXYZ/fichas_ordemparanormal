// Arquivos Secretos 1 (Ritos & Maldições) — trilhas e origens
// Texto verbatim do PDF "Arquivos-Secretos-01-v1-2.pdf" (pp. 43 e 45).
// Nada foi resumido, traduzido ou inventado.

export const TRILHAS_AS01 = [
  {
    classe: 'ocultista',
    id: 'maledictologo',
    nome: 'Maledictólogo',
    // O livro não traz parágrafo de apresentação para esta trilha: a página 45
    // abre direto na habilidade de NEX 10%.
    descricao: '',
    livro: 'Arquivos Secretos 1',
    poderes: [
      {
        nex: 10,
        nome: 'Identificação Macabra',
        descricao: `Compreender o paranormal fica cada vez mais prático com o tempo. Quando faz um teste para identificar item amaldiçoado ou identificar ritual, você pode gastar 1 PE para receber +1d10 neste teste. Além disso, sofre apenas –O para identificar itens amaldiçoados como uma ação completa.`,
      },
      {
        nex: 40,
        nome: 'Compreensão de Maldições',
        descricao: `Você pode gastar uma ação de interlúdio e 3 PE para fazer leituras e rituais de identificação em um item amaldiçoado. Após isso, faça um teste de Ocultismo (DT 10 +5 por categoria do item). Se falhar, você perde 2d4+2 SAN e não pode tentar novamente com o mesmo item.

Se passar e o item amaldiçoado contiver um ritual, você perde 1d4+1 SAN, aprende o ritual e o item é consumido. Esse ritual não conta no seu limite de rituais.

Se passar e o item amaldiçoado não contiver um ritual, você perde 1d4+1 SAN e pode transferir as maldições para outro item ou para um símbolo marcado em seu corpo ou no corpo de um aliado adjacente, como uma tatuagem, e o item amaldiçoado original é consumido. A pessoa tatuada pode usufruir das maldições como se estivesse usando o item, mas a mesma pessoa não pode ter mais do que uma tatuagem desse tipo. Você pode destruir esse símbolo em seu corpo gastando uma ação de interlúdio.`,
      },
      {
        nex: 65,
        nome: 'Reproduzir Maldição',
        descricao: `Sua determinação em usar o Outro Lado contra ele mesmo é maior do que seu medo de enlouquecer. Você pode gastar uma ação de interlúdio e 3 PE para memorizar uma maldição de item com a qual já tenha lidado (por exemplo, um item que já estudou ou usou, ou mesmo um do qual já foi alvo).

Uma vez que tenha memorizado uma maldição, pode gastar uma ação de interlúdio e 3 PE para aplicá-la a um novo item. Para isso, faça um teste de Ocultismo (DT 10 +5 por categoria do item). Se falhar, você perde 2d8+2 SAN. Se passar, você perde 1d8+1 SAN e o novo item recebe a maldição que você havia memorizado até o fim da missão. Maldições aumentam categorias de itens, e nenhum item pode ter categoria maior do que IV.`,
      },
      {
        nex: 99,
        nome: 'Maldição Suprema',
        descricao: `A loucura não o impede de fazer o impensável. Ao usar a habilidade Reproduzir Maldição, você considera o item três categorias efetivas a menos. Por exemplo, um item de categoria IV é considerado de categoria I, permitindo que você aplique maldições até ele voltar à categoria IV.`,
      },
    ],
  },
];

export const ORIGENS_AS01 = [
  {
    id: 'ferido-por-ritual',
    nome: 'Ferido por Ritual',
    descricao: `Você tinha uma vida ordinária, até sofrer os efeitos paranormais de um ritual (escolha entre Sangue, Morte, Conhecimento ou Energia). A partir de então, sua existência mundana foi deturpada pelo Outro Lado.`,
    pericias: ['ocultismo'],
    periciasLivres: 1,
    periciasNota:
      'Ocultismo e 1 perícia definida pelo elemento do ritual (Fortitude para Sangue, Vontade para Morte e Conhecimento ou Reflexos para Energia).',
    poder: {
      nome: 'Mácula Ritualística',
      descricao: `A entidade marcou você com um ritual de 1º círculo a sua escolha do elemento correspondente. Você aprende a conjurar o ritual. Além disso, uma vez por cena, pode conjurá-lo sem gastar PE (mas ainda precisa gastar PE para qualquer efeito adicional, como formas avançadas). Esse ritual não conta no seu limite de rituais conhecidos. Em contrapartida, sofre –O em testes de resistência contra efeitos (como rituais ou poderes paranormais) desse elemento.`,
    },
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'transtornado-arrependido',
    nome: 'Transtornado Arrependido',
    descricao: `Você já caminhou entre os Transtornados. Talvez tenha sido um seguidor cego, seduzido pelas promessas de transcendência por meio da carne e da dor. Talvez tenha conhecido a natureza visceral do culto desde o início e ainda assim escolheu mergulhar no delírio. Seja como for, em algum momento algo rompeu o ciclo. Você se libertou, mas ainda sente o eco dos rituais e a presença do Sangue sussurrando na própria carne.`,
    pericias: ['luta', 'ocultismo'],
    periciasLivres: 0,
    periciasNota: '',
    poder: {
      nome: 'Sofrimento de Sangue',
      descricao: `Eles podem tentar… mas já não dói mais. Você recebe RD 2/mental. Para cada dois rituais de Sangue ou poderes paranormais de Sangue que possua, a RD aumenta em +1. Contudo, a lembrança das desgraças que você viveu causa pesadelos horríveis, que o impedem de repousar tranquilamente. Sua condição de descanso é sempre uma categoria pior (luxuosa se torna confortável, confortável se torna normal e normal se torna precária).`,
    },
    livro: 'Arquivos Secretos 1',
  },
];
