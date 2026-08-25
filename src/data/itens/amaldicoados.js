// ITENS AMALDIÇOADOS / PARANORMAIS
//
// Fontes:
//   - Livro Base (cap. 5, "Itens Amaldiçoados", p. 144-151)
//   - Sobrevivendo ao Horror ("Novos Itens Amaldiçoados", p. 57-61)
//   - Arquivos Secretos 1 ("Itens Paranormais" / "Itens Amaldiçoados", p. 54-55)
//   - Arquivos Secretos 3 ("Itens Paranormais" / "Itens Amaldiçoados", p. 113-115)
//   - Arquivos Secretos 4 ("Itens", p. 70)
//
// Schema de cada entrada:
// {
//   id, nome,
//   elemento: 'sangue' | 'morte' | 'energia' | 'conhecimento' | 'medo' | null,
//   categoria: número (I=1, II=2, ...) ou null se não indicada,
//   tipo: 'Arma' | 'Proteção' | 'Acessório' | 'Especial' | 'Item Amaldiçoado' | 'Item Paranormal',
//   maldicao: true se for uma maldição aplicável a um item (Livro Base), false se for um item próprio,
//   espacos: número ou null,
//   descricao: verbatim,
//   livro,
// }

// Regras gerais dos itens amaldiçoados, verbatim do Livro Base.
export const REGRAS_AMALDICOADOS = `ITENS AMALDIÇOADOS

Alguns objetos carregam a influência do Outro Lado, sendo capazes de criar manifestações paranormais. Conhecidos como itens amaldiçoados, tais objetos são extremamente raros e muito cobiçados por pessoas e organizações com conhecimento sobre o Outro Lado.

Itens amaldiçoados são divididos em dois grupos: armas, proteções e acessórios; e itens especiais. Armas, proteções e acessórios amaldiçoados possuem uma ou mais maldições. Maldições funcionam como modificações — fornecem um benefício ao item ao custo de aumentar sua categoria. Já itens especiais possuem mecânicas próprias, que variam conforme o item.

IDENTIFICANDO ITENS AMALDIÇOADOS

Alguns itens amaldiçoados parecem comuns, sem nada de especial. Outros são visivelmente afetados pelo paranormal: são cobertos de sigilos brilhantes, emitem sons estranhos ou mesmo se movem sozinhos de forma bizarra. O mestre decide como cada item se parece.

Alguns itens amaldiçoados trazem inscrições indicando seus poderes. Outros não trazem qualquer pista sobre seu funcionamento. Itens amaldiçoados adquiridos através da Ordem (veja abaixo) terão seus poderes conhecidos pelos agentes. Já itens amaldiçoados encontrados durante missões podem ou não ter seu funcionamento explicado, de acordo com o mestre. Nesses casos, os poderes podem ser identificados com a perícia Ocultismo ou com a velha tentativa e erro. Você pode disparar uma pistola amaldiçoada para testar seus efeitos, apenas tome cuidado com o alvo que vai escolher…

ADQUIRINDO ITENS AMALDIÇOADOS

Apesar de serem inestimáveis, a Ordem possui alguns itens amaldiçoados em seu arsenal, e os disponibiliza para agentes de alta patente.

Você pode escolher armas, proteções e acessórios amaldiçoados da mesma forma que escolhe itens modificados. Um item pode ter mais de uma maldição, mas não pode ter maldições de elementos opressores e maldições iguais não se acumulam. A primeira maldição de um item aumenta sua categoria em II; maldições subsequentes aumentam sua categoria em I. Um mesmo item pode ter modificações e maldições e bônus fornecidos por modificações e maldições se acumulam, assim como seus ajustes de categoria.

Você pode escolher itens amaldiçoados especiais como equipamento mundano, apenas considerando a categoria deles em seu limite de equipamento.

Independente de suas categorias, itens amaldiçoados são liberados apenas para agentes especiais, oficiais de operações e agentes de elite.

USANDO ITENS AMALDIÇOADOS

Armas e proteções funcionam automaticamente: basta empunhar ou vestir o item para que seus poderes funcionem. Itens especiais devem ser ativados, de acordo com sua descrição. Acessórios existem em ambos os tipos — alguns funcionam automaticamente quando empunhados ou vestidos, outros devem ser ativados, de acordo com sua descrição. Via de regra, itens que precisam ser ativados precisam antes ser identificados (veja a perícia Ocultismo).

Para itens que exigem um teste de resistência do alvo, use o mesmo cálculo de DT de habilidades (veja a página 78), usando Presença como atributo.

Conjurar rituais a partir de itens não exige gestos ou componentes ritualísticos. Você pode usar versões avançadas do ritual, mas precisa pagar o custo adicional delas (mesmo quando o ritual básico puder ser conjurado sem custo) e cumprir quaisquer pré-requisitos.

LIMITE DE ITENS AMALDIÇOADOS

Itens amaldiçoados seguem a mesma regra de limites de uso (veja a página 51) e ocupam o mesmo espaço de inventário que itens mundanos do mesmo tipo — uma espingarda amaldiçoada, por exemplo, ocupa o mesmo que uma espingarda comum: 2 espaços.

Bônus de itens amaldiçoados não se acumulam. Usar um utensílio do Carisma e um vestuário do Carisma concederá +1 em Presença, não +2.

DESTRUINDO ITENS AMALDIÇOADOS

Para determinar as características de um item amaldiçoado, veja a seção “Quebrando Objetos”, na página 90, para as características de um item normal do mesmo tipo. Itens amaldiçoados recebem +10 PV e +10 em sua RD para cada maldição que possuem. Por exemplo, um revólver (que normalmente tem PV 5 e RD 10) com duas maldições tem PV 25 e RD 30.

Um item amaldiçoado que não esteja sendo usado faz seus próprios testes de resistência, com um modificador de +10 para cada maldição que possuir. Se estiver sendo usado, pode escolher entre seu modificador ou o do portador.

O PREÇO DA MALDIÇÃO

Itens amaldiçoados oferecem grande poder por um preço. As forças que alimentam estes itens são impregnadas com um elemento específico, e impõem ao usuário uma penalidade cumulativa, conforme este elemento.

Uma vez que um agente aceite um item amaldiçoado, a distância física não é impeditivo para o preço da maldição. A influência negativa de um item amaldiçoado só pode ser encerrada após algum tempo afastado do item (ou seja, apenas entre missões).

CONHECIMENTO. Sempre que falha em um teste baseado em Intelecto, para cada maldição de Conhecimento em seus itens, você perde 2 pontos de Sanidade.

ENERGIA. Sempre que falha em um teste baseado em Agilidade, para cada maldição de Energia em seus itens, você perde 2 pontos de Sanidade.

MORTE. Sempre que falha em um teste baseado em Presença, para cada maldição de Morte em seus itens, você perde 2 pontos de Sanidade.

SANGUE. Sempre que falha em um teste baseado em Força ou Vigor, para cada maldição de Sangue em seus itens, você perde 2 pontos de Sanidade.

MEDO. Cada item de Medo possui um preço específico, determinado pelo mestre, e que pode mudar de portador a portador.

ITENS AMALDIÇOADOS ESPECIAIS

Objetos variados, cada um com suas próprias regras. Exceto quando indicado o contrário, contam como itens de categoria II e ocupam 1 espaço. Para efeitos relacionados à sua quantidade de maldições (como pontos de vida e preço da maldição), contam como possuindo uma maldição.`;

export const ITENS_AMALDICOADOS = [
  // ————————————————————————————————————————————————————————————
  // LIVRO BASE — MALDIÇÕES PARA ARMAS
  // ————————————————————————————————————————————————————————————
  {
    id: 'antielemento',
    nome: 'Antielemento',
    elemento: 'conhecimento',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'A arma é letal contra criaturas de um elemento. Quando ataca uma criatura desse elemento, você pode gastar 2 PE. Se fizer isso e acertar o ataque, causa +4d8 pontos de dano. Para determinar o elemento aleatoriamente, role 1d4: 1) Conhecimento; 2) Energia; 3) Morte; 4) Sangue.',
    livro: 'Livro Base',
  },
  {
    id: 'ritualistica',
    nome: 'Ritualística',
    elemento: 'conhecimento',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'Você pode armazenar na arma um ritual que tenha como alvo um ser ou que afete uma área, gastando os PE como se tivesse conjurado o ritual normalmente. O ritual não gera efeito na hora; em vez disso, fica guardado no item. Quando acerta um ataque com a arma, você pode descarregar o ritual armazenado como uma ação livre. O alvo do ritual, ou o centro da área dele, é o ser atingido. Uma vez que o ritual seja descarregado, outro pode ser armazenado.',
    livro: 'Livro Base',
  },
  {
    id: 'senciente',
    nome: 'Senciente',
    elemento: 'conhecimento',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'Você pode gastar uma ação de movimento e 2 PE para imbuir a arma com uma fagulha de sua consciência. A arma flutua ao seu lado e, uma vez por rodada, ataca um ser em alcance curto (ou no alcance da arma, o que for maior) a sua escolha, com as mesmas estatísticas que teria se você a estivesse empunhando. Você pode gastar 1 PE no início de cada um de seus turnos para manter esse efeito. Se não o fizer, a arma cai no chão. Você pode usar uma ação de movimento para apanhar a arma no ar caso precise. Soltar a arma para que volte a flutuar para ativar a maldição é uma ação livre.',
    livro: 'Livro Base',
  },
  {
    id: 'empuxo',
    nome: 'Empuxo',
    elemento: 'energia',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'Com a capacidade de gerar uma descarga momentânea de Energia, a arma ganha a capacidade de ser arremessada em alcance curto (se já podia ser arremessada, seu alcance aumenta em uma categoria) e causa mais um dado de dano do mesmo tipo quando usada dessa forma. Após efetuar um ataque à distância com a arma, ela volta voando para você no mesmo turno. Pegar a arma é uma reação. Somente armas corpo a corpo podem receber essa maldição.',
    livro: 'Livro Base',
  },
  {
    id: 'energetica',
    nome: 'Energética',
    elemento: 'energia',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'Você pode gastar 2 PE por ataque para transformar a arma (exceto seu cabo ou empunhadura) ou a munição disparada pela arma em Energia pura. Durante este ataque, a arma fornece +5 em testes de ataque, ignora resistência a dano e converte todo o dano causado para Energia. Armas corpo a corpo emanam luz como uma lâmpada; munição toma uma forma plasmática iluminada como feixes de luz.',
    livro: 'Livro Base',
  },
  {
    id: 'vibrante',
    nome: 'Vibrante',
    elemento: 'energia',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'A arma vibra constantemente com um fluxo de Energia. Você recebe a habilidade Ataque Extra da trilha operações especiais do combatente. Se já a possui, em vez disso o custo para usá-la diminui em –1 PE.',
    livro: 'Livro Base',
  },
  {
    id: 'consumidora',
    nome: 'Consumidora',
    elemento: 'morte',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'A arma drena a entropia de seres, deixando alvos atingidos lentos até o final da cena. Quando ataca, você pode gastar 2 PE. Se fizer isso e acertar o ataque, o alvo fica imóvel por uma rodada.',
    livro: 'Livro Base',
  },
  {
    id: 'erosiva',
    nome: 'Erosiva',
    elemento: 'morte',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'A arma acelera o envelhecimento dos alvos, causando +1d8 pontos de dano de Morte. Quando ataca, você pode gastar 2 PE. Se fizer isso e acertar o ataque, a vítima sofre 2d4 pontos de dano de Morte no início de seus turnos pelas próximas duas rodadas.',
    livro: 'Livro Base',
  },
  {
    id: 'repulsora',
    nome: 'Repulsora',
    elemento: 'morte',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'A arma gera uma aura similar a uma fumaça espiralada que desacelera ataques vindos em sua direção, fornecendo +2 de Defesa enquanto estiver empunhada. Quando você faz um bloqueio, pode gastar 2 PE. Se fizer isso, recebe um bônus adicional de +5 em Defesa.',
    livro: 'Livro Base',
  },
  {
    id: 'lancinante',
    nome: 'Lancinante',
    elemento: 'sangue',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'A arma inflige ferimentos terríveis, causando +1d8 de dano de Sangue. Este dado é multiplicado em acertos críticos. Por exemplo, se a arma possuir crítico x3, em um acerto crítico o dano adicional de lancinante vira +3d8.',
    livro: 'Livro Base',
  },
  {
    id: 'predadora',
    nome: 'Predadora',
    elemento: 'sangue',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'A arma tem sede de sangue e persegue seus alvos, anulando penalidades por camuflagem e cobertura (mas não cobertura total). Caso a arma seja de ataque à distância, seu alcance também aumenta em uma categoria. Além disso, a margem de ameaça da arma duplica. Por exemplo, um fuzil de caça predador tem margem de ameaça 17. Efeitos que duplicam a margem de ameaça são aplicados antes de quaisquer efeitos que a aumentem.',
    livro: 'Livro Base',
  },
  {
    id: 'sanguinaria',
    nome: 'Sanguinária',
    elemento: 'sangue',
    categoria: null,
    tipo: 'Arma',
    maldicao: true,
    espacos: null,
    descricao:
      'Os ferimentos causados pela arma se rasgam além da área acertada. Um ser atingido fica sangrando. Sangramento causado pela arma é cumulativo — um ser atingido duas vezes sofre 2d6 pontos de dano de sangramento por rodada. Além disso, quando você faz um acerto crítico com a arma ela drena o sangue derramado, o que deixa o alvo fraco e concede a você 2d10 pontos de vida temporários.',
    livro: 'Livro Base',
  },

  // ————————————————————————————————————————————————————————————
  // LIVRO BASE — MALDIÇÕES PARA PROTEÇÕES
  // ————————————————————————————————————————————————————————————
  {
    id: 'abascanta',
    nome: 'Abascanta',
    elemento: 'conhecimento',
    categoria: null,
    tipo: 'Proteção',
    maldicao: true,
    espacos: null,
    descricao:
      'Você recebe +5 em testes de resistência contra rituais. Uma vez por cena, quando você é alvo de um ritual, pode gastar uma reação e PE igual ao custo dele para refleti-lo de volta ao conjurador. As características do ritual (efeitos, DT…) se mantêm, mas você toma quaisquer decisões exigidas por ele.',
    livro: 'Livro Base',
  },
  {
    id: 'profetica',
    nome: 'Profética',
    elemento: 'conhecimento',
    categoria: null,
    tipo: 'Proteção',
    maldicao: true,
    espacos: null,
    descricao:
      'A proteção concede vislumbres de um possível futuro imediato. Você recebe resistência a Conhecimento 10 e pode gastar 2 PE para rolar novamente um teste de resistência uma vez.',
    livro: 'Livro Base',
  },
  {
    id: 'sombria',
    nome: 'Sombria',
    elemento: 'conhecimento',
    categoria: null,
    tipo: 'Proteção',
    maldicao: true,
    espacos: null,
    descricao:
      'A proteção confunde os sentidos. Você recebe +5 em Furtividade e ignora a penalidade de carga em testes dessa perícia. Além disso, você pode gastar uma ação de movimento e 1 PE para fazer o item adquirir a aparência de uma roupa comum, mas mantendo suas propriedades (bônus na Defesa, espaço ocupado, penalidade em perícias…).',
    livro: 'Livro Base',
  },
  {
    id: 'cinetica',
    nome: 'Cinética',
    elemento: 'energia',
    categoria: null,
    tipo: 'Proteção',
    maldicao: true,
    espacos: null,
    descricao:
      'A proteção produz uma barreira invisível que desvia ataques, concedendo +2 em Defesa e resistência a dano 2 (para proteção leve ou escudo) ou 5 (para proteção pesada).',
    livro: 'Livro Base',
  },
  {
    id: 'lepida',
    nome: 'Lépida',
    elemento: 'energia',
    categoria: null,
    tipo: 'Proteção',
    maldicao: true,
    espacos: null,
    descricao:
      'A proteção amplifica sua mobilidade, concedendo +10 em testes de Atletismo e +3m de deslocamento. Você pode gastar 2 PE para se mover de forma sobrenatural. Até o final do turno, você ignora terreno difícil, recebe deslocamento de escalada igual a seu deslocamento terrestre e fica imune a dano por queda de até 9m.',
    livro: 'Livro Base',
  },
  {
    id: 'voltaica',
    nome: 'Voltaica',
    elemento: 'energia',
    categoria: null,
    tipo: 'Proteção',
    maldicao: true,
    espacos: null,
    descricao:
      'Você recebe resistência a Energia 10 e pode gastar uma ação de movimento e 2 PE para fazer a proteção emitir arcos de Energia até o fim da cena. Se fizer isso, no fim de cada um de seus turnos você causa 2d6 pontos de dano de Energia em todos os seres adjacentes.',
    livro: 'Livro Base',
  },
  {
    id: 'letargica',
    nome: 'Letárgica',
    elemento: 'morte',
    categoria: null,
    tipo: 'Proteção',
    maldicao: true,
    espacos: null,
    descricao:
      'A proteção desacelera ataques perigosos, concedendo +2 em Defesa. Além disso, você recebe 25% de chance (para proteção leve ou escudo) e 50% de chance (para pesada) de ignorar o dano extra de acertos críticos e ataques furtivos.',
    livro: 'Livro Base',
  },
  {
    id: 'repulsiva',
    nome: 'Repulsiva',
    elemento: 'morte',
    categoria: null,
    tipo: 'Proteção',
    maldicao: true,
    espacos: null,
    descricao:
      'Você recebe resistência a Morte 10 e pode gastar uma ação de movimento e 2 PE para cobrir seu corpo com uma camada de Lodo preto até o final da cena. Se fizer isso, qualquer ser que o ataque em corpo a corpo sofre 2d8 pontos de dano de Morte.',
    livro: 'Livro Base',
  },
  {
    id: 'regenerativa',
    nome: 'Regenerativa',
    elemento: 'sangue',
    categoria: null,
    tipo: 'Proteção',
    maldicao: true,
    espacos: null,
    descricao:
      'A proteção melhora sua capacidade de resistência e regeneração. Você recebe resistência a Sangue 10 e pode gastar uma ação de movimento e 1 PE para recuperar 1d12 pontos de vida.',
    livro: 'Livro Base',
  },
  {
    id: 'sadica',
    nome: 'Sádica',
    elemento: 'sangue',
    categoria: null,
    tipo: 'Proteção',
    maldicao: true,
    espacos: null,
    descricao:
      'No início de seu turno, você recebe +1 em testes de ataque e rolagens de dano para cada 10 pontos de dano que sofreu desde o fim de seu último turno. Por exemplo, se tiver sofrido 45 pontos de dano, recebe +4 em testes de ataque e rolagens de dano.',
    livro: 'Livro Base',
  },

  // ————————————————————————————————————————————————————————————
  // LIVRO BASE — MALDIÇÕES PARA ACESSÓRIOS
  // (podem ser aplicadas a utensílios e vestuários)
  // ————————————————————————————————————————————————————————————
  {
    id: 'carisma',
    nome: 'Carisma',
    elemento: 'conhecimento',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao:
      'O acessório gera uma aura que torna você mais carismático e autoconfiante. Você recebe +1 em Presença (este aumento não fornece PE adicionais).',
    livro: 'Livro Base',
  },
  {
    id: 'conjuracao',
    nome: 'Conjuração',
    elemento: 'conhecimento',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao:
      'O acessório tem um ritual de 1º círculo. Se estiver empunhando o item, você pode conjurar o ritual como se o conhecesse. Caso conheça o ritual, seu custo diminui em –1 PE.',
    livro: 'Livro Base',
  },
  {
    id: 'escudo-mental',
    nome: 'Escudo Mental',
    elemento: 'conhecimento',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao: 'O acessório gera uma barreira psíquica. Você recebe resistência mental 10.',
    livro: 'Livro Base',
  },
  {
    id: 'reflexao',
    nome: 'Reflexão',
    elemento: 'conhecimento',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao:
      'Uma vez por rodada, quando você é alvo de um ritual, pode gastar PE igual ao custo dele para refleti-lo de volta ao seu conjurador. As características do ritual (efeitos, DT…) se mantêm, mas você toma quaisquer decisões exigidas por ele.',
    livro: 'Livro Base',
  },
  {
    id: 'sagacidade',
    nome: 'Sagacidade',
    elemento: 'conhecimento',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao:
      'Sua mente é acelerada pelas forças do Conhecimento, fornecendo a você +1 em Intelecto (este aumento não fornece perícias).',
    livro: 'Livro Base',
  },
  {
    id: 'defesa',
    nome: 'Defesa',
    elemento: 'energia',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao: 'Uma barreira de energia invisível gerada por este acessório fornece +5 de Defesa.',
    livro: 'Livro Base',
  },
  {
    id: 'destreza',
    nome: 'Destreza',
    elemento: 'energia',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao:
      'Este acessório aprimora sua coordenação e velocidade, fornecendo +1 em Agilidade.',
    livro: 'Livro Base',
  },
  {
    id: 'potencia',
    nome: 'Potência',
    elemento: 'energia',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao:
      'Este acessório aumenta a DT contra suas habilidades, poderes e rituais em +1.',
    livro: 'Livro Base',
  },
  {
    id: 'esforco-adicional',
    nome: 'Esforço Adicional',
    elemento: 'morte',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao: 'Este acessório fornece +5 PE. Este efeito só se ativa após um dia de uso.',
    livro: 'Livro Base',
  },
  {
    id: 'disposicao',
    nome: 'Disposição',
    elemento: 'sangue',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao: 'Valendo-se do poder do Sangue, você recebe +1 em Vigor.',
    livro: 'Livro Base',
  },
  {
    id: 'pujanca',
    nome: 'Pujança',
    elemento: 'sangue',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao: 'O acessório aumenta sua potência muscular, fornecendo +1 em Força.',
    livro: 'Livro Base',
  },
  {
    id: 'vitalidade',
    nome: 'Vitalidade',
    elemento: 'sangue',
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao: 'Este acessório fornece +15 PV. Este efeito só se ativa após um dia de uso.',
    livro: 'Livro Base',
  },
  {
    id: 'protecao-elemental',
    nome: 'Proteção Elemental',
    elemento: null, // listada em [VARIA]: o elemento é o da resistência escolhida
    categoria: null,
    tipo: 'Acessório',
    maldicao: true,
    espacos: null,
    descricao:
      'Você recebe resistência 10 contra um elemento. Este acessório conta como um item do elemento contra o qual fornece resistência.',
    livro: 'Livro Base',
  },

  // ————————————————————————————————————————————————————————————
  // LIVRO BASE — ITENS AMALDIÇOADOS ESPECIAIS
  // "Exceto quando indicado o contrário, contam como itens de categoria II
  //  e ocupam 1 espaço."
  // ————————————————————————————————————————————————————————————
  {
    id: 'coracao-pulsante',
    nome: 'Coração Pulsante',
    elemento: 'sangue',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um coração humano banhado em Sangue, pulsando como se ainda estivesse dentro de um corpo. Se estiver empunhando o coração pulsante e sofrer dano, você pode gastar uma reação para espremer o item e reduzir esse dano pela metade. Sempre que usa o coração, você deve fazer um teste de Fortitude (DT 15 + 5 por uso adicional no mesmo dia). Se falhar, o item é destruído. Como o coração continua pulsando incessantemente com Sangue, qualquer compartimento em que estiver deve ser drenado uma vez por dia, caso contrário o Sangue poderá escorrer e danificar outros objetos com os quais entrar em contato.',
    livro: 'Livro Base',
  },
  {
    id: 'coroa-de-espinhos',
    nome: 'Coroa de Espinhos',
    elemento: 'sangue',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Uma coroa, colar ou pulseira feita de um material que lembra os espinhos de uma roseira banhados em Sangue. Uma vez por rodada, você pode usar uma reação para transformar qualquer dano mental que fosse sofrer em dano de Sangue, mas não consegue mais recuperar sanidade por descanso enquanto estiver vestindo o item. É preciso vestir o item por uma semana para ativar seus efeitos.',
    livro: 'Livro Base',
  },
  {
    id: 'frasco-de-vitalidade',
    nome: 'Frasco de Vitalidade',
    elemento: 'sangue',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Este pequeno recipiente de vidro possui uma tampa de metal gravada com um selo de Sangue. Você pode gastar 1 minuto e sofrer até 20 pontos de dano para encher o frasco com seu próprio sangue. Enquanto estiver no recipiente, seu sangue se mantém fresco. Você pode gastar uma ação padrão para beber o conteúdo do frasco e recuperar a mesma quantidade de PV que armazenou nele, mas deve passar em um teste de Fortitude (DT 20) para não ficar enjoado por uma rodada.',
    livro: 'Livro Base',
  },
  {
    id: 'perola-de-sangue',
    nome: 'Pérola de Sangue',
    elemento: 'sangue',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Uma esfera de aproximadamente 2cm de diâmetro, lisa e reluzente como uma pérola, mas de cor vermelho-vivo. Você pode gastar uma ação de movimento para forçar a pérola de Sangue contra a sua pele e absorvê-la, recebendo uma injeção de adrenalina que fornece +5 em testes de Agilidade, Força e Vigor e testes baseados nesses atributos até o final da cena. Ao final da cena, você precisa fazer um teste de Fortitude (DT 20). Se falhar, fica fatigado até o final do dia. Se falhar por 5 ou mais, sofre uma parada cardíaca e fica morrendo. Se morrer dessa forma, você se torna uma criatura de Sangue de VD similar ao seu NEX, à escolha do mestre.',
    livro: 'Livro Base',
  },
  {
    id: 'punhos-enraivecidos',
    nome: 'Punhos Enraivecidos',
    elemento: 'sangue',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um par de soqueiras feitas de um metal vermelho vivo e gravado com vários símbolos de Sangue. Seus ataques desarmados passam a causar 1d8 pontos de dano de Sangue. Sempre que acerta um ataque desarmado, pode fazer outro ataque desarmado contra o mesmo alvo, pagando 2 PE por cada ataque já realizado no turno. Ou seja, pode fazer o primeiro ataque extra gastando 2 PE, um segundo ataque extra gastando mais 4 PE e assim por diante, até errar um ataque ou não ter mais pontos de esforço.',
    livro: 'Livro Base',
  },
  {
    id: 'seringa-de-transfiguracao',
    nome: 'Seringa de Transfiguração',
    elemento: 'sangue',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Esta seringa é feita de um material estranho e de aparência orgânica, cheio de veias pulsantes. Você pode gastar uma ação padrão para sugar o sangue de um alvo adjacente e encher a seringa (se o alvo não for voluntário, você precisa acertá-lo com um ataque corpo a corpo). Se houver sangue na seringa, você pode gastar uma ação padrão para injetá-lo em qualquer outra pessoa adjacente, que terá sua aparência transfigurada para a do dono do sangue, como se estivesse sob efeito do ritual Distorcer Aparência, com duração aumentada para um dia. Quando o efeito acabar, o alvo deve rolar 1d6. Em um resultado 1, o processo de voltar à sua aparência é especialmente traumático, danificando seus músculos e órgãos e fazendo com que perca 1 PV permanentemente.',
    livro: 'Livro Base',
  },
  {
    id: 'amarras-mortais',
    nome: 'Amarras Mortais',
    elemento: 'morte',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um par de correntes de ferro negro que se enrolam nos antebraços do usuário como um bracelete. Uma vez por rodada, você pode gastar uma ação padrão e 2 PE para usar a manobra agarrar contra um alvo Grande ou menor em alcance curto, recebendo +10 em seu teste oposto. Você também pode usar uma ação de movimento para puxar um alvo agarrado para perto, deixando-o adjacente.',
    livro: 'Livro Base',
  },
  {
    id: 'casaco-de-lodo',
    nome: 'Casaco de Lodo',
    elemento: 'morte',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um sobretudo preto fosco que tem uma cor inexplicavelmente opaca, como se absorvesse a luz por completo. Essa vestimenta é na verdade feita de Lodo ativo, protegendo o usuário contra ataques ao amortecer o impacto deles. O usuário recebe resistência a corte, impacto, Morte e perfuração 5, mas recebe vulnerabilidade a dano balístico e de Energia.',
    livro: 'Livro Base',
  },
  {
    id: 'coletora',
    nome: 'Coletora',
    elemento: 'morte',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Este punhal possui a lâmina completamente negra e a empunhadura em espiral. Você pode gastar uma ação completa para apunhalar uma pessoa que esteja morrendo. Ao fazer isso, você mata o alvo e a Coletora absorve os resquícios do tempo de vida dela, armazenando 1d8 PE. O punhal pode armazenar um total de 20 PE, que você pode usar como se fossem seus desde que esteja portando a adaga a pelo menos uma semana. Enquanto portar a adaga, você é acometido por pesadelos sobre o sofrimento final de suas vítimas e sempre tem condições de descanso ruins, independente de onde ou como descansar.',
    livro: 'Livro Base',
  },
  {
    id: 'cranio-espiral',
    nome: 'Crânio Espiral',
    elemento: 'morte',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um crânio envelhecido, apodrecido e distorcido em um formato espiral. Lodo escorre de seus olhos vazios, como lágrimas negras. Uma vez por rodada, se estiver empunhando o crânio, você pode gastar uma ação livre para ativá-lo. Quando faz isso, você recebe uma ação padrão adicional na rodada. Sempre que usa o crânio, você deve fazer um teste de Vontade (DT 15 + 5 por uso adicional no mesmo dia). Se falhar, você recebe os benefícios do item, mas envelhece 1d4 anos e não pode mais usá-lo nesse dia.',
    livro: 'Livro Base',
  },
  {
    id: 'frasco-de-lodo',
    nome: 'Frasco de Lodo',
    elemento: 'morte',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um pequeno frasco contendo Lodo da Morte. Aplicar o conteúdo do frasco em um ferimento é uma ação padrão. Se aplicado em um ferimento recente (sofrido até uma rodada atrás) o Lodo recupera 6d8+20 pontos de vida. Caso a ferida seja anterior à rodada passada, role um dado: em um resultado par, o Lodo recupera 3d8+10 PV; em um resultado ímpar, a ferida infecciona, causando 3d8+10 pontos de dano de Morte. O frasco possui Lodo para uma única ativação.',
    livro: 'Livro Base',
  },
  {
    id: 'vislumbre-do-fim',
    nome: 'Vislumbre do Fim',
    elemento: 'morte',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um par de óculos escuros repleto de símbolos e espirais em sua armação metálica. Você pode gastar uma ação de movimento para se concentrar em um ser que esteja vendo e obter informações sobre a morte dele. Em pessoas comuns, essa informação se traduz em um contador de tempo, que pode se alterar conforme as ações de um Marcado modificam seu futuro. Em Marcados ou criaturas, essas informações se traduzem na informação de qual é o pior valor de resistência do alvo (entre Fortitude, Reflexos ou Vontade) e de quaisquer vulnerabilidades que o alvo possua.',
    livro: 'Livro Base',
  },
  {
    id: 'aneis-do-elo-mental',
    nome: 'Anéis do Elo Mental',
    elemento: 'conhecimento',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um par de anéis dourados, cada um contendo um dos símbolos do ritual Ligação Telepática. Os anéis devem ser usados por duas pessoas por 24h para serem ativados. Após esse período, os dois são conectados por um ritual de Invadir Mente (ligação telepática) que dura enquanto estiverem usando os anéis. Enquanto a ligação estiver ativa, as duas pessoas fazem testes de Vontade usando a melhor quantidade de dados e bônus entre as duas. Porém, qualquer dano mental sofrido por uma delas será sofrido pela outra (ou seja, se numa rodada ambas sofrerem 10 pontos de dano mental, cada uma irá perder 20 pontos de sanidade) e qualquer condição mental ou de medo que afetar uma delas automaticamente afetará a outra.',
    livro: 'Livro Base',
  },
  {
    id: 'lanterna-reveladora',
    nome: 'Lanterna Reveladora',
    elemento: 'conhecimento',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Uma lanterna dourada decorada com sigilos do Outro Lado. Ativar a lanterna gasta uma ação padrão e 1 PE. Ela fica ligada por uma cena e emite luz com as propriedades do ritual Terceiro Olho. A luz da lanterna incomoda criaturas de Sangue. Se elas foram iluminadas pela luz dela, irão atacá-lo em detrimento de quaisquer outros alvos na mesma categoria de alcance.',
    livro: 'Livro Base',
  },
  {
    id: 'mascara-das-pessoas-nas-sombras',
    nome: 'Máscara das Pessoas nas Sombras',
    elemento: 'conhecimento',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Principal ferramenta e marca registrada da Seita das Máscaras, esse item quando usado por alguém que não pertence à Seita ainda carrega grande poder. O usuário recebe resistência a Conhecimento 10 e pode gastar uma ação de movimento e 2 PE para “entrar” em uma sombra adjacente e se transportar instantaneamente para outra sombra que possa ver em alcance médio. Vestir a Máscara é como assinar um acordo e pode ter consequências severas se seu portador despertar o interesse da mente única das Máscaras…',
    livro: 'Livro Base',
  },
  {
    id: 'municao-jurada',
    nome: 'Munição Jurada',
    elemento: 'conhecimento',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Uma bala de arma de fogo com um sigilo gravado. O usuário pode fazer um ritual de uma hora para vincular essa munição a um ser que conheça. Se usada contra esse ser, a bala fornece +10 no teste de ataque, dobra a margem de ameaça da arma e causa +6d12 pontos de dano de Conhecimento. Possuir uma munição jurada deixa o usuário obcecado em abater seu alvo, impondo –2 em Defesa e em testes de ataque contra quaisquer outros alvos.',
    livro: 'Livro Base',
  },
  {
    id: 'pergaminho-da-pertinacia',
    nome: 'Pergaminho da Pertinácia',
    elemento: 'conhecimento',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um pergaminho amarelado e antigo. Mesmo enrolado, é possível vislumbrar sigilos dourados brilhando na parte interior. Você pode gastar uma ação padrão para encarar os sigilos do Outro Lado inscritos no pergaminho, recebendo 5 PE temporários até o fim da cena. Sempre que usa este item, você deve fazer um teste de Ocultismo (DT 15 + 5 por uso adicional no mesmo dia). Se falhar, o pergaminho se desfaz.',
    livro: 'Livro Base',
  },
  {
    id: 'arcabuz-dos-moretti',
    nome: 'Arcabuz dos Moretti',
    elemento: 'energia',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Uma arma muito antiga, reminiscente do século XV, mas que de alguma forma ainda se mantém funcionando perfeitamente, apesar das rachaduras que cercam toda a superfície do objeto e emitem uma suave luz rosada do interior de suas fissuras. Em seu cabo de madeira está gravado um selo contendo a letra M. O arcabuz é uma arma simples, de fogo e de uma mão que fornece +2 em testes de ataque. Sempre que dispara esta arma, o usuário deve rolar 1d6 junto com o teste de ataque. O resultado do d6 define qual o dano da arma nesse disparo: 1) 2d4, 2) 2d6, 3) 2d8, 4) 2d10, 5) 2d12, 6) 2d20. A arma tem alcance curto, crítico x3 e não precisa de munição.',
    livro: 'Livro Base',
  },
  {
    id: 'bateria-reversa',
    nome: 'Bateria Reversa',
    elemento: 'energia',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Uma pequena bateria elétrica repleta de sigilos paranormais. Você pode gastar uma ação padrão e 2 PE para fazer a bateria absorver a carga de qualquer dispositivo eletrônico em alcance curto — celular, notebook ou mesmo um automóvel —, fazendo-o ficar automaticamente descarregado. Se a bateria estiver cheia, você pode gastar uma ação padrão para transferir a carga dela para um dispositivo eletrônico descarregado em alcance curto, que é instantaneamente reenergizado. Sempre que usa a bateria, você deve fazer um teste de Ocultismo (DT 15 + 5 por uso adicional no mesmo dia). Se falhar, ela explode, causando 12d6 pontos de dano de Energia em todos os seres a até 3 metros.',
    livro: 'Livro Base',
  },
  {
    id: 'peitoral-da-segunda-chance',
    nome: 'Peitoral da Segunda Chance',
    elemento: 'energia',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um dispositivo que pode ser vestido como um pequeno colete que pode ser prendido ao redor do peito, contendo uma peça central em cima do coração formada por um amontoado de partes eletrônicas seguradas por fios metálicos entrelaçados, passando por baixo dos braços e levando até um fecho na parte das costas. Se você for reduzido a 0 pontos de vida, o colete automaticamente gasta 5 PE seus para reanimá-lo com 4d10 PV através de um surto de Energia por todo o seu corpo. A reanimação falha se você não tiver PE suficiente. Cada vez que o item é ativado, existe uma chance (1 em 1d10) da descarga energética ser forte demais e matá-lo instantaneamente, transformando seu corpo e equipamento em plasma de Energia pura (exceto pelo colete).',
    livro: 'Livro Base',
  },
  {
    id: 'relogio-de-arnaldo',
    nome: 'Relógio de Arnaldo',
    elemento: 'energia',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um relógio de ouro, meio manchado e com um aspecto levemente queimado no exterior. Ao abrir, é possível enxergar a foto de um homem de barba e óculos ao lado de uma criança simpática, também segurando um relógio de ouro. Uma vez por rodada, você pode gastar 1 PE para rolar novamente qualquer dado com o resultado 1. O custo para usar o relógio aumenta em +1 para cada vez que for ativado no mesmo dia. Este é um item único (apenas um agente pode escolhê-lo).',
    livro: 'Livro Base',
  },
  {
    id: 'talisma-da-sorte',
    nome: 'Talismã da Sorte',
    elemento: 'energia',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Uma moeda, pé de coelho ou qualquer outro badulaque modificado por um ritual. Sempre que você estiver vestindo o talismã e sofrer dano, pode gastar uma reação e 3 PE para rolar 1d4. Em um resultado 2 ou 3, você evita completamente o dano. Em um resultado 4, você evita o dano, mas o talismã queima e vira cinzas. Por fim, em um resultado 1, a sorte se reverte em azar: em vez de evitar o dano, você sofre o dobro do dano que sofreria e o talismã queima e vira cinzas.',
    livro: 'Livro Base',
  },
  {
    id: 'teclado-de-conexao-neural',
    nome: 'Teclado de Conexão Neural',
    elemento: 'energia',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um teclado USB coberto de glifos de Energia. Sempre que você plugar o teclado a um computador (uma ação de movimento), o item irá gerar ondas eletromagnéticas que enviam os sinais do sistema direto para as sinapses de seu cérebro, efetivamente conectando a sua mente com a máquina. Você pode usar o computador sem nenhum impedimento tecnológico ou de idioma, recebe +10 em testes para hackear e gasta metade do tempo normal para localizar arquivos. Porém, devido ao estresse que seu cérebro sofre por se conectar diretamente a um sistema digital, você sofre 1d6 pontos de dano mental por rodada que usar o teclado.',
    livro: 'Livro Base',
  },
  {
    id: 'tela-do-pesadelo',
    nome: 'Tela do Pesadelo',
    elemento: 'energia',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Este dispositivo com tela (celular, tablet, TV…) contém diversos sigilos minúsculos em suas bordas. Você pode gastar uma ação padrão e 2 PE para ativar a tela. A próxima pessoa que tocá-la verá uma imagem horrível saindo da tela e avançando contra ela. A imagem é apenas uma ilusão, mas os traumas que ela causa são reais! A pessoa deve fazer um teste de Vontade (DT determinada pelo usuário da tela +5). Se falhar, fica atordoada, sofre 4d6 pontos de dano mental e precisa repetir o teste na próxima rodada. O efeito continua até a pessoa passar no teste ou enlouquecer (ou outra pessoa destruir a tela). Uma vez que gere esse efeito, a tela fica inerte até você ativá-la novamente.',
    livro: 'Livro Base',
  },
  {
    id: 'veiculo-energizado',
    nome: 'Veículo Energizado',
    elemento: 'energia',
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'O motor deste veículo foi modificado paranormalmente para não precisar de combustível. Além disso, um motorista pode gastar uma reação e fazer um teste de Pilotagem (DT 25) para fazer o carro e seus ocupantes assumirem uma forma de energia pura por um instante, suficiente para evitar colidir com um objeto, atravessando-o como se fossem incorpóreos.',
    livro: 'Livro Base',
  },
  {
    id: 'jaqueta-de-verissimo',
    nome: 'Jaqueta de Veríssimo',
    elemento: 'medo',
    categoria: 4,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Uma jaqueta de estilo aviador feita de couro marrom com a gola forrada de pele branca. Esta vestimenta de aparência comum já foi usada por vários agentes importantes e experientes da Ordem, e presenciou inúmeras batalhas e sacrifícios. Ao longo de sua história, a jaqueta foi passada de um agente para o outro como presente ou herança diversas vezes. Você recebe resistência a dano paranormal 15. Além disso, sempre que um aliado adjacente for sofrer dano de qualquer tipo, você pode gastar uma reação e 2 PE para se tornar o alvo do dano no lugar. Este é um item único (apenas um agente pode escolhê-la) de categoria IV.',
    livro: 'Livro Base',
  },
  {
    id: 'dedo-decepado',
    nome: 'Dedo Decepado',
    elemento: null, // [VARIA]: "O elemento do poder define o elemento da maldição."
    categoria: 2,
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Este item grotesco é um dedo decepado e seco de alguém com alto nível de exposição paranormal. Você recebe um poder paranormal que o dono do dedo possuía. O elemento do poder define o elemento da maldição. Sempre que usar as ações dormir ou relaxar em um interlúdio, role 1d4. Em um resultado 1, você é assombrado por memórias do dono do dedo e não recupera nenhum PV, PE ou sanidade. Além disso, ser visto usando esse item causa uma penalidade de –10 em testes de Diplomacia e pode causar reações severas de NPCs, a critério do mestre. Você precisa vestir o item por uma semana para que seu efeito comece a funcionar.',
    livro: 'Livro Base',
  },
  {
    id: 'selos-paranormais',
    nome: 'Selos Paranormais',
    elemento: null, // [VARIA]: depende do ritual inscrito
    categoria: null, // "A categoria de um selo é igual ao círculo do ritual contido nele"
    tipo: 'Especial',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um conjunto de sigilos gravados em um objeto pequeno, como um pergaminho, moeda, pedra preciosa, osso humano… Cada selo contém um ritual. Para ativar um selo, você deve empunhá-lo e ler os sigilos em voz alta. Isso exige uma ação padrão ou a ação necessária para conjurar o ritual, o que for maior. Você também deve conhecer o ritual inscrito nele ou passar em um teste de Ocultismo (CD 20 + custo em PE do ritual). Quando o selo é ativado, o ritual é conjurado e o selo se desfaz em cinzas. Você sofre os efeitos das regras “O Custo do Paranormal” e “Invocando o Medo” (veja a página 121), caso aplicáveis, e toma quaisquer decisões exigidas pelo ritual, como se o tivesse conjurado você mesmo. Caso conheça o ritual, você pode aplicar quaisquer habilidades que possua que se aplicariam aos seus próprios rituais, e pode usar versões avançadas dele, pagando o custo adicional em pontos de esforço (e apenas o custo adicional). Você não precisa de componentes ritualísticos para ativar um selo, o que o torna um objeto bastante útil para ocultistas em certas situações. A categoria de um selo é igual ao círculo do ritual contido nele: categoria I para rituais de 1º círculo, categoria II para rituais de 2º círculo, e assim por diante.',
    livro: 'Livro Base',
  },

  // ————————————————————————————————————————————————————————————
  // SOBREVIVENDO AO HORROR — NOVOS ITENS AMALDIÇOADOS
  // (elemento, categoria e espaços da Tabela 1.6)
  // ————————————————————————————————————————————————————————————
  {
    id: 'conector-de-membros',
    nome: 'Conector de Membros',
    elemento: 'sangue',
    categoria: 3,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Ninguém sabe que tipo de “cientista louco” desenvolveu esse aparato, composto por dois aneis metálicos de tamanhos adaptáveis, banhados em símbolos de Sangue e conectados por uma sanfona de tecido humano. Você pode usar esse item e uma ação padrão para reconectar um braço, perna ou cabeça decepados de uma pessoa ou animal, desde que o ferimento tenha ocorrido em até três rodadas. Reconectar a parte perdida não cura PV mas, se o alvo estava morrendo ou morto, ele perde estas condições e fica inconsciente e com 1 PV. Se o conector for removido, a parte é novamente decepada e não poderá ser reconectada por este item novamente. Quando é usado, o conector tem uma chance de 25% de conceder uma fagulha de “vida própria” à parte reconectada. Se isso acontecer e a parte for uma perna, o alvo ficará lento, pois o membro tentará andar em outras direções por conta prória. Se a parte for um braço, o alvo sofrerá uma penalidade de –O em testes que exijam o uso daquele braço, pois o membro tentará tatear ao redor ou até mesmo atrapalhar a ação. Por fim, se a parte era a cabeça, no início de cada cena de grande tensão (como um combate ou uma perseguição), o alvo tem 25% de chance de ficar confuso. Há boatos de que estes efeitos podem ser removidos da parte reconectada, mas não se sabe exatamente como.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'dose-da-praga',
    nome: 'Dose d’A Praga',
    elemento: 'sangue',
    categoria: 3,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um pequeno frasco de vidro reforçado contendo um líquido espesso vermelho que se rebate violentamente contra as paredes da sua pequena prisão. Você pode gastar uma ação padrão para abrir o frasco e fazer com que você ou um ser adjacente fique sob efeito dos poderes paranormais Arma de Sangue, Sangue de Ferro e Sangue Vivo até o fim da cena. Quando o efeito se encerra, o ser deve fazer um teste de Fortitude (DT 20 + 5 por dose anterior desde o último interlúdio). Se falhar, sofre 2d4 pontos de dano mental e mantém os poderes até o fim da próxima cena, ficando também sob efeito do ritual Ódio Incontrolável.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'mandibula-agonizante',
    nome: 'Mandíbula Agonizante',
    elemento: 'sangue',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'A parte inferior de um crânio, ainda com músculos e símbolos pintados com sangue, que emite sons perturbadores, como se estivesse sendo torturado. Você pode gastar uma ação padrão para pressionar a mandíbula, fazendo-a sentir mais dor, e arremessá-la em um ponto à sua escolha em alcance médio. O item começará a agonizar e gritar muito alto, acobertando qualquer outro som em um raio de 30 metros até o fim da cena. Se usar esse item em uma cena de furtividade (p. 92), você passa automaticamente em um teste para distrair. Criaturas de Sangue, em especial, são fortemente atraídas pelos gritos da mandíbula, e precisam passar em um teste de Vontade (DT 35) para evitar ir até ela e comê-la. No fim da cena, a mandíbula para de gritar, volta a agonizar baixinho e só pode ser usada novamente após descansar por uma cena.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'retalho-tenebroso',
    nome: 'Retalho Tenebroso',
    elemento: 'sangue',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Este pedaço de carne retangular com pele e alguns pelos bestiais esparsos é impregnado de instintos primais. Você pode gastar uma ação padrão para aplicá-lo sobre seu rosto como se fosse uma máscara. Se fizer isso, recebe faro e visão no escuro, mas sofre vulnerabilidade a Morte e –2O em testes de perícias para interação social, como Diplomacia e Enganação. Além disso, conforme permanece em seu rosto, as energias do retalho parecem impregná-lo em fúria; para cada dia em sequencia com o retalho tenebroso, você recebe um bônus cumulativo de +1 em rolagens de dano. Esse poder, entretanto, tem um custo, pois o retalho lentamente tenta se alimentar de sua carne; ao final de cada dia, você perde 1d6 pontos de vida (Fortitude DT 15, +5 a cada teste adicional em sequencia, evita). Para remover o retalho você deve gastar uma ação padrão e passar em um teste de Fortitude (como acima). Se falhar, perde 1d6 pontos de vida. A perda de vida causada pelo retalho só pode ser recuperada após ele ser removido. O retalho se solta automaticamente se a pessoa em que estiver aplicado morrer.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'ampulheta-do-tempo-sofrido',
    nome: 'Ampulheta do Tempo Sofrido',
    elemento: 'morte',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Uma ampulheta de madeira trabalhada, com areia negra em seu interior. Quando é girada, os grãos assumem formas vagamente humanoides, que erguem os braços em desespero conforme são sugadas para a parte inferior do dispositivo. Se estiver empunhando a ampulheta do tempo sofrido, você pode gastar 5 PE para receber imediatamente os benefícios de uma ação de interlúdio a sua escolha. Uma vez que tenha usado a ampulheta, você não pode usá-la novamente até gastar uma ação de interlúdio para devolver o tempo que a Morte lhe emprestou.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'injecao-de-lodo',
    nome: 'Injeção de Lodo',
    elemento: 'morte',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 0.5,
    descricao:
      'Uma velha seringa de bronze enferrujado com uma grande agulha preenchida com o Lodo preto da Morte, que escorre sutilmente para fora. Você pode gastar uma ação padrão e o conteúdo da seringa para injetar o Lodo em você ou um ser adjacente voluntário. Até o fim da cena o ser recebe vulnerabilidade a dano balístico e de Energia mas, na próxima vez em que for reduzido a 0 PV nesta mesma cena, em vez disso é reduzido a 1 PV.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'instantaneo-mortal',
    nome: 'Instantâneo Mortal',
    elemento: 'morte',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 0.5,
    descricao:
      'Este item é uma fotografia que retrata um dos últimos momentos de uma pessoa antes de sua morte (como um condenado sendo preparado para a forca ou um paciente terminal prestes a expirar). Existem diversas versões deste item, algumas uma simples foto em papel, outras um quadro adornado por uma sólida moldura ou mesmo uma imagem digital. Cada instantâneo mortal retrata pessoas diferentes, em circunstâncias de morte variadas. Se estiver empunhando um instantâneo mortal e fizer um teste de perícia para procurar pistas, você pode olhar fixamente para a imagem e gastar 1 PE. Se o teste for de uma perícia relacionada às circunstâncias de morte da fotografia, a imagem da pessoa irá se mover discretamente, apontando em uma direção útil para o teste (efetivamente concedendo +O no teste). Por exemplo, um teste de Crime para encontrar uma pista pode receber o bônus se você estiver segurando um instantâneo mortal com a imagem de um criminoso. O mestre tem a palavra final sobre as perícias que se relacionam a um determinado instantâneo mortal.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'projetil-de-lodo',
    nome: 'Projétil de Lodo',
    elemento: 'morte',
    categoria: null, // Tabela 1.6: versão curta = I, versão longa = II
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um projétil forjado por mãos habilidosas que empregaram o Lodo como parte do processo de fundição do metal, fazendo com que ele carregue a Morte consigo — literalmente. Forjar uma dessas munições é um trabalho árduo, mas o resultado é uma ferramenta poderosa contra criaturas de Sangue. Projéteis de Lodo podem ser encontrados em versões curtas e longas. Usar um projétil de Lodo troca todo o dano da arma para Morte. Entretanto, ao fim da cena, a arma se degrada, sendo consumida pelo tempo até ser completamente desfeita.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'radio-chiador',
    nome: 'Rádio Chiador',
    elemento: 'morte',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um pequeno rádio gravador de bolso que já captou o áudio de inúmeras vidas se esvaindo. É como se estivesse constantemente empoeirado e pela sua aparência sequer deveria estar funcionando, mas um chiado perturbador e constante pode ser escutado vindo de dentro. Funciona com pilhas que duram doze horas antes de se tornarem Lodo preto. Enquanto estiver ligado, emite chiados estáticos se houver qualquer criatura Paranormal em alcance extremo. O chiado se torna mais alto conforme a proximidade de um destes elementos, o que permite estimar sua direção e categoria de alcance aproximadas. Criaturas Paranormais tendem a se sentir atraídas pelo chiado uma vez que possam ouvi-lo. As funções normais do rádio gravador não funcionam, mas ele pode ficar desligado para não emitir barulho.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'camera-obscura',
    nome: 'Câmera Obscura',
    elemento: 'conhecimento',
    categoria: 3,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Uma das versões mais antigas e usadas de todas as câmeras de aura paranormal. Reza a lenda de que essa Polaroid Model 95 capturou tantas auras que se tornou incrivelmente poderosa contra criaturas fantasmagóricas. Esta versão de câmera de aura paranormal possui a modificação lente de revelação paranormal, mas a DT para resistir a seu efeito aumenta em +10. Além disso, se falhar, a criatura também sofre 6d6 pontos de dano de frio conforme partes de sua forma são inexistidas. Apenas criaturas com alguma habilidade de invisibilidade, incorporeidade ou camuflagem sofrem esse dano.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'enxame-fantasmagorico',
    nome: 'Enxame Fantasmagórico',
    elemento: 'conhecimento',
    categoria: 3,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um manto leve e quase invisível composto de traças e mariposas esbranquiçadas que foi tecido por algum bruxo de séculos passados. Enquanto estiver vestido, este manto amaldiçoado deixa seu usuário invisível (veja p. 125). Contudo, o usuário se torna o alimento das traças e mariposas que formam a veste; enquanto estiver vestindo o manto, você sofre 1 ponto de dano mental no início de cada um de seus turnos. Esse dano mental ignora todo tipo de resistência a dano.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'repositorio-do-fracasso',
    nome: 'Repositório do Fracasso',
    elemento: 'conhecimento',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Esta pequena caixinha de madeira se assemelha a um antigo porta-joias. Seu exterior, entretanto, é decorado com figuras espectrais que expressam um desespero profundo. Sempre que uma criatura Paranormal em alcance médio faz um teste, para cada resultado 1 nos d20 desse teste, o repositório do fracasso recebe uma carga, até um máximo de 6 cargas. Uma vez por rodada, você pode consumir uma dessas cargas para recuperar 1d4 PE. Sempre que faz isso, entretanto, você sofre uma penalidade cumulativa de –1 em Vontade até seu próximo interlúdio.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'tabula-do-saber-custoso',
    nome: 'Tábula do Saber Custoso',
    elemento: 'conhecimento',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Esta pequena tábula, marcada com sigilos de Conhecimento, fornece conhecimento do Outro Lado às custas da integridade da mente de seu usuário. Se estiver empunhando a Tábula do Saber Custoso, você pode usá-la para receber os benefícios de ser treinado em uma perícia por um único teste. Se fizer isso, você perde uma quantidade de pontos de Sanidade igual ao seu valor no atributo-chave dessa perícia.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'arreio-neural',
    nome: 'Arreio Neural',
    elemento: 'energia',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Este conjunto de correias de couro e fivelas metálicas pode ser fixado à cabeça de uma pessoa de forma semelhante à cabeçada de um cavalo, expondo sua arcada dentária e mantendo seus olhos abertos. Um aparato amaldiçoado da era Vitoriana, este dispositivo converte certas correntes em estímulos cerebrais. Se estiver usando o arreio neural, sempre que sofre 5 ou mais pontos de dano de eletricidade ou Energia, você recupera 1 PE. Você pode recuperar um máximo de PE desta forma igual ao dobro do seu Vigor no mesmo dia.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'centrifugador-existencial',
    nome: 'Centrifugador Existencial',
    elemento: 'energia',
    categoria: 3,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Este pequeno dispositivo formado por dois círculos de cobre concêntricos foi criado por um inventor desconhecido do século XVII. Você pode gastar uma ação padrão e 3 PE para ativar o dispositivo, o que faz com que os dois círculos girem rapidamente em sentidos opostos. Quando isso acontece, você é dividido em duas possibilidades de futuro e recebe um turno adicional na última contagem de iniciativa desta rodada, estando brevemente em dois lugares ao mesmo tempo. Ambas as versões de você são consideradas sua “versão verdadeira”, mas você deve sortear qual delas irá se dissipar ao final da rodada. Efeitos que afetarem qualquer uma das versões durante a rodada seguem afetando seu personagem, se aplicáveis. O seu “outro você” não é considerado outra pessoa adicional para qualquer efeito de jogo. Sempre que usa este item, você deve fazer um teste de Ocultismo (DT 15 + 5 por uso adicional no mesmo dia). Se falhar, você é separado em nível energético e perde metade de seus atributos (arredondado para baixo). Você recupera 1 ponto de cada atributo ao final de cada interlúdio.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'espelho-refletor',
    nome: 'Espelho Refletor',
    elemento: 'energia',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Esta pequena placa metálica foi adquirida de corpos de criaturas como o Ciborgue, e polida ritualisticamente até se tornar reflexiva. Um espelho refletor pode ser usado para refletir imagens em ângulos impossíveis; você pode gastar uma ação de movimento para observar um ponto ou ser fora de seu ângulo de visão em alcance médio; quando faz isso você recebe +O em Percepção e tem uma chance de enxergar mesmo objetos e seres com cobertura total. Além disso, quando sofre dano de Energia, você pode sacrificar o espelho para evitar esse dano e refleti-lo de volta à sua origem.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'fuzil-alheio',
    nome: 'Fuzil Alheio',
    elemento: 'energia',
    categoria: 4,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 2,
    descricao:
      'Com o ir e vir do Estrangeiro e seus Alheios, certas ferramentas alienígenas ficaram para trás. Entre elas, armas paranormais adquiridas por agentes de limpeza após a derrota de alguns desses monstros de “outro mundo”. Esta arma é um fuzil de precisão com mira telescópica e mira laser, que causa dano de Energia e não precisa de munição.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'a-primeira-adaga',
    nome: 'A Primeira Adaga',
    elemento: 'medo',
    categoria: 3,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Por milênios, adagas se tornaram um símbolo ritualístico poderoso, sendo associadas à conjuração de rituais e armas de ocultistas. Contudo, todo mito tem uma origem. Este item amaldiçoado é a primeira adaga que já foi usada em um ritual. Apesar de ser a origem de uma das idealizações mais profundas do ocultismo humano, esta arma não impressiona à primeira vista. É uma lâmina de pedra polida e cabo de madeira tão primitiva quanto os primeiros sacrifícios humanos para entidades sobrenaturais. Entretanto, qualquer um treinado em Ocultismo reconhece o horror que ela representa. Se for empregada como um componente ritualístico, ela concede ao ritual os efeitos dos catalisadores ampliador, perturbador, potencializador e prolongador (p. 44). Além disso, o tempo de conjuração do ritual se torna 1 rodada (isso se aplica mesmo com as regras opcionais Conjuração Complexa e Combate Narrativo). Contudo, o poder fornecido pela adaga tem um preço; o conjurador perde uma quantidade de pontos de vida igual à metade de seus PV totais (esta perda conta como dano para efeitos de calcular dano massivo; veja OPRPG, p. 88). É possível usar uma vítima de sacrifício para pagar esse preço em vida, mas isso é um ato de extrema crueldade ou desespero.',
    livro: 'Sobrevivendo ao Horror',
  },

  // ————————————————————————————————————————————————————————————
  // ARQUIVOS SECRETOS 1 — ITENS PARANORMAIS
  // ————————————————————————————————————————————————————————————
  {
    id: 'agrupador-ritualistico',
    nome: 'Agrupador Ritualístico',
    elemento: null,
    categoria: 2,
    tipo: 'Item Paranormal',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um item pequeno — não maior que uma faca — e de aparência variada. Você pode gastar uma ação padrão para prender um componente ou um catalisador nele, e pode ter até quatro desses itens presos nele. Componentes e catalisadores presos no agrupador contam como empunhados, desde que o agrupador esteja sendo empunhado. Se você estiver empunhando o agrupador ritualístico, todos os componentes e catalisadores presos nele também contam como empunhados. Ocultistas usam este item para segurar vários componentes e catalisadores com uma só mão.',
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'amuleto-sinalizador-de-elemento',
    nome: 'Amuleto Sinalizador de <Elemento>',
    elemento: null, // o elemento é escolhido na aquisição (exceto Medo)
    categoria: 2,
    tipo: 'Item Paranormal',
    maldicao: false,
    espacos: 1,
    descricao:
      'Ao adquirir este amuleto preso a um cordão ou corrente, escolha um elemento (exceto Medo). Este item vestido emite um tênue sinal — pinga gotas vermelhas para Sangue, larga um rastro de fumaça para Morte (como um incenso), emite luz dourada para Conhecimento e muda de cor bruscamente para Energia — quando uma criatura do elemento respectivo entra em alcance longo dele, mesmo tendo paredes ou outros objetos no caminho.',
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'rubra',
    nome: 'Rubra',
    elemento: null,
    categoria: 2,
    tipo: 'Item Paranormal',
    maldicao: false,
    espacos: 1,
    descricao:
      'Esta droga paranormal tem a aparência de um pó viscoso vermelho amarronzado. Você pode gastar uma ação de movimento para esfregar uma dose de rubra em uma ferida aberta (precisa estar com pelo menos 1 ponto de dano). Se fizer isso, a droga é absorvida e você recebe +5 em testes baseados em Força, Agilidade e Vigor e 10 pontos de vida temporários. No fim da cena, os bônus terminam e, a menos que consuma outra dose de rubra, você perde 1d3 pontos de atributos físicos (role 1d6 para cada ponto perdido; 1 - 2 Força, 3 - 4 Agilidade, 5 - 6 Vigor). Os pontos retornam após dormir em uma cena de interlúdio. Sempre que usa a droga, você deve fazer um teste de Vontade (DT 15 +2 para cada vez além da primeira que tiver usado a droga). Se falhar, fica insano por 1d3 rodadas, durante as quais vai tentar atacar os seres mais próximos de você, independente de quem sejam (ou gastar suas ações se aproximando deles, caso não consiga atacá-los de onde estiver). Se falhar no teste de Vontade por 10 ou mais, sua mente é destruída pela droga. Seu personagem passa a tentar atacar de forma animalesca qualquer pessoa próxima a ele, sem esperanças de voltar ao que era, e, se estiver em um local no qual a Membrana esteja fragilizada, pode até mesmo se tornar uma criatura do Outro Lado.',
    livro: 'Arquivos Secretos 1',
  },

  // ————————————————————————————————————————————————————————————
  // ARQUIVOS SECRETOS 1 — ITENS AMALDIÇOADOS (SANGUE)
  // ————————————————————————————————————————————————————————————
  {
    id: 'arpao-do-pescador',
    nome: 'Arpão do Pescador',
    elemento: 'sangue',
    categoria: 3,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um arpão de pesca rústico, sujo de sangue originado de um pacto com o Diabo. É uma arma simples corpo a corpo e de uma mão, que pode ser arremessada em alcance curto. Ela causa 1d8 pontos de dano de perfuração mais 1d12 pontos de dano de Sangue e tem crítico 20/x3. Se acertar um ataque de arremesso com o arpão, você dificulta a movimentação do alvo. Ele fica lento até remover o arpão de seu corpo, o que exige gastar uma ação padrão e passar em um teste de Atletismo (DT For).',
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'combustivel-de-sangue',
    nome: 'Combustível de Sangue',
    elemento: 'sangue',
    categoria: 3,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Um tanque com combustível inflamável misturado com Sangue. Fabricar um combustível desse é um trabalho grotesco, mas o resultado é uma ferramenta poderosa contra criaturas de Conhecimento. Você pode gastar o Combustível de Sangue como munição para lança-chamas ou para encher galões. Fazer isso troca todo o dano do lança-chamas ou do galão (veja SaH, p. 41) para Sangue e aumenta todos os dados de dano em uma categoria (d6 vira d8, por exemplo).',
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'marreta-transtornada',
    nome: 'Marreta Transtornada',
    elemento: 'sangue',
    categoria: 4,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 2,
    descricao:
      'Uma marreta banhada em fluidos humanos e enrolada em espinhos foi amaldiçoada 6 vezes, através de 6 sacrifícios humanos, ao longo de 6 rituais de Sangue. Ela foi adorada, admirada e alimentada como um bebê do inferno. Uma arma tática corpo a corpo e de duas mãos. Ela causa 2d10 pontos de dano de impacto mais 2d12 pontos de dano de Sangue e tem crítico 20/x4, mas sempre que você empunha ou ataca com a arma, perde 1d6 PV. Quando faz um acerto crítico com essa arma, o alvo deve fazer um teste de Fortitude (DT For). Se falhar, algum osso na parte atingida se quebra, deixando o alvo fraco até receber cuidados prolongados em uma cena de interlúdio. Se ficar fraco novamente por causa desta arma, em vez disso, o alvo fica debilitado.',
    livro: 'Arquivos Secretos 1',
  },

  // ————————————————————————————————————————————————————————————
  // ARQUIVOS SECRETOS 3 — ITENS PARANORMAIS
  // ————————————————————————————————————————————————————————————
  {
    id: 'cranio-dominador',
    nome: 'Crânio Dominador',
    elemento: null,
    categoria: 3,
    tipo: 'Item Paranormal',
    maldicao: false,
    espacos: 1,
    descricao:
      'O crânio nefasto de quem outrora conheceu a submissão, agora tomado pela podridão e pelas correntes que o aprisionavam em vida, transbordando o desejo de retribuir cada gota de sofrimento. Se estiver empunhando este item, você pode gastar uma ação padrão e 2 PE para invocar correntes que envolvem até dois alvos em alcance curto. Eles ficam paralisados (Reflexos DT Pre evita). A única forma de se libertar é com o rompimento da corrente (Defesa 10, RD 10, 20 PV). O crânio não pode ser usado novamente por 24 horas e quando voltar a ser útil, as correntes já existentes desaparecem.',
    livro: 'Arquivos Secretos 3',
  },
  {
    id: 'gaiola-do-corvo',
    nome: 'Gaiola do Corvo',
    elemento: null,
    categoria: 4,
    tipo: 'Item Paranormal',
    maldicao: false,
    espacos: 2,
    descricao:
      'Uma gaiola de pássaros feita de ossos e originada da morte daquele que perdeu sua liberdade. Dentro dela, uma nuvem de cinzas inquieta sussurra os lamentos daqueles que se foram. Se estiver empunhando este item, você pode gastar uma ação padrão para colocá-lo no chão e abrir sua portinhola. Ao fazer isso, todo o solo em um raio de 18m da gaiola é tomado por Lodo e se torna terreno difícil. No começo de toda rodada, aqueles que se encontrarem no Lodo sofrem 3d10 pontos de dano de Morte (Fortitude DT Vig reduz à metade). Se alguém ficar morrendo enquanto está no Lodo, seu corpo é consumido, transformado em cinzas e levado para dentro da gaiola, onde permanecerá para sempre. Após isso, a gaiola se fecha e seus efeitos acabam. É possível fechar a gaiola a qualquer momento como ação padrão.',
    livro: 'Arquivos Secretos 3',
  },

  // ————————————————————————————————————————————————————————————
  // ARQUIVOS SECRETOS 3 — ITENS AMALDIÇOADOS
  // ————————————————————————————————————————————————————————————
  {
    id: 'camiseta-psikolera',
    nome: 'Camiseta Psikolera',
    elemento: 'sangue',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Manchada de sangue dos vários mosh pits na qual já esteve presente, uma simples merch de uma banda se torna um símbolo de resistência e adrenalina. Quanto mais ela se suja, mais você se deleita. Se estiver machucado enquanto usa esta vestimenta, todas as suas rolagens de dano causam +2d8 pontos de dano de Sangue.',
    livro: 'Arquivos Secretos 3',
  },
  {
    id: 'dupla-obsessiva',
    nome: 'Dupla Obsessiva',
    elemento: 'sangue',
    categoria: 3,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 2,
    descricao:
      'Maça e florete. Essa dupla de armas enferrujadas parecem não conseguir ficar longe uma da outra, obcecadas por si mesmas e seu único propósito: proteger aqueles que amam com fervor. A maça é uma arma tática corpo a corpo e de uma mão. Ela causa 2d4 pontos de dano de perfuração mais 1d6 pontos de dano de Sangue, multiplicado em caso de acerto crítico, e tem crítico 20/x3. O florete é uma arma tática ágil corpo a corpo e de uma mão. Ela causa 1d6 pontos de dano de perfuração mais 2d4 pontos de dano de Sangue, multiplicado em caso de acerto crítico, e tem crítico 18/x2. Se estiver empunhando as duas armas, pode gastar uma ação padrão para realizar dois ataques, um com cada arma. Além disso, se um aliado em alcance curto de você for alvo de um ataque, você pode gastar 2 PE como reação para se tornar o alvo do ataque. Se fizer isso e a fonte do ataque estiver em alcance corpo a corpo, você pode gastar 2 PE para atacar a fonte com a maça.',
    livro: 'Arquivos Secretos 3',
  },
  {
    id: 'armaduras-dos-couracas',
    nome: 'Armaduras dos Couraças',
    elemento: 'sangue',
    categoria: 3,
    tipo: 'Proteção',
    maldicao: false,
    espacos: 0,
    descricao:
      'As armaduras dos Couraças, chamadas de Armaduras de Guevara, contam como proteções pesadas amaldiçoadas de Sangue com aparências diversas e as seguintes características específicas: Defesa: +10, além de +1 para cada semana usando a armadura até o limite de +20. Categoria: III. Espaços: a armadura se movimenta com vontade própria, não pesando sobre o usuário e ocupando 0 espaços. Proficiência: a armadura se adapta ao alvo, dispensando a necessidade de ser proficiente em proteções pesadas. Resistências: usuário recebe RD balístico, impacto, perfuração 5, Sangue 10. Vulnerabilidade: usuário fica vulnerável a Morte. Especial: uma pessoa que toque uma dessas armaduras precisa fazer um teste de Vontade (role 6d6 para determinar a DT). Se falhar, um desejo incontrolável força a pessoa a equipá-la. Se passar, pode escolher equipá-la ou não. Uma pessoa equipada com a armadura precisa fazer um teste de Fortitude (DT 6d6). Se falhar, o Sangue poderá, inesperadamente, controlar a pessoa como e quando achar melhor. Se passar, fica imune ao controle do Sangue. Tentar tirar a armadura equipada é quase impossível. Um dos métodos envolve o usuário sofrer dano de Morte até ficar com 0 PV e ser removido de dentro da proteção maldita. Independente de sucessos ou falhas, todos os testes envolvendo a armadura devem ser repetidos após uma semana ou no início de uma nova missão (o que acontecer primeiro).',
    livro: 'Arquivos Secretos 3',
  },

  // ————————————————————————————————————————————————————————————
  // ARQUIVOS SECRETOS 4 — ITEM AMALDIÇOADO
  // ————————————————————————————————————————————————————————————
  {
    id: 'granada-ctrl-c-ctrl-v',
    nome: 'Granada Ctrl+C Ctrl+V',
    elemento: 'energia',
    categoria: 2,
    tipo: 'Item Amaldiçoado',
    maldicao: false,
    espacos: 1,
    descricao:
      'Uma granada de fragmentação transparente envolta por fios de cobre que parece tremeluzir e ameaçar uma explosão a cada segundo. Este item é uma granada. Para usá-lo, você precisa empunhá-lo e então gastar uma ação padrão para arremessá-lo em um ponto à sua escolha em alcance médio. Ele afeta um raio de 6m a partir do ponto de impacto, espalhando fragmentos de Energia. Seres na área sofrem 8d6 pontos de dano de Energia (Reflexos DT Agi reduz à metade). Quando esta granada explodir, role 1d4. Se o resultado for par, a explosão gera uma segunda granada idêntica que explode em outro espaço à sua escolha dentro da área de efeito da granada original. O processo se repete até a quarta explosão ou até que o d4 dê ímpar (o que acontecer primeiro).',
    livro: 'Arquivos Secretos 4',
  },
];

export const ITENS_AMALDICOADOS_POR_ID = Object.fromEntries(
  ITENS_AMALDICOADOS.map((i) => [i.id, i]),
);
