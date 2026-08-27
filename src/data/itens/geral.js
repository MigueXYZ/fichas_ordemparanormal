// PROTEÇÕES E EQUIPAMENTO GERAL
// Extraído verbatim dos livros. `categoria` é numérica (0 = categoria 0,
// 1 = I, 2 = II, 3 = III, 4 = IV). `espacos` segue a tabela do livro
// (pode ser 0,5; 0 = não ocupa espaço; null = não informado / variável).

// ---------------------------------------------------------------------------
// PROTEÇÕES (Livro Base, Tabela 3.6)
// ---------------------------------------------------------------------------

export const PENALIDADE_NAO_PROFICIENCIA_PROTECAO =
  'Se você usar uma proteção com a qual não seja proficiente, sofre –OO em testes baseados em Força e Agilidade.';

export const PROTECOES = [
  {
    id: 'protecao-leve',
    nome: 'Proteção Leve',
    tipo: 'Leve',
    categoria: 1,
    defesa: 5,
    espacos: 2,
    rd: null,
    penalidade: null,
    descricao:
      'Um colete de kevlar ou uma jaqueta de couro reforçada. Confortável o suficiente para ser usada sob roupas normais.',
    livro: 'Livro Base',
  },
    {
    id: 'protecao-pesada',
    nome: 'Proteção Pesada',
    tipo: 'Pesada',
    categoria: 2,
    defesa: 10,
    espacos: 5,
    rd: 'Resistência a balístico, corte, impacto e perfuração 2.',
    penalidade: '–5 em testes de perícias que sofrem penalidade de carga.',
    descricao:
      'Equipamento usado por forças especiais da polícia e pelo exército. Consiste de capacete, ombreiras, joelheiras e caneleiras, além de um colete com várias camadas de kevlar. Fornece resistência a balístico, corte, impacto e perfuração 2. No entanto, por ser desconfortável e volumosa, impõe –5 em testes de perícias que sofrem penalidade de carga.',
    livro: 'Livro Base',
  },
  {
    id: 'escudo',
    nome: 'Escudo',
    tipo: 'Escudo',
    categoria: 1,
    defesa: 2,
    espacos: 2,
    rd: null,
    penalidade: null,
    descricao:
      'Um escudo medieval ou moderno, como aqueles usados por tropas de choque. Precisa ser empunhado em uma mão e fornece Defesa +2. Bônus na Defesa fornecido por um escudo acumula com o de uma proteção. Para efeitos de proficiência e penalidade por não proficiência, escudos contam como proteção pesada.',
    livro: 'Livro Base',
  },
];

// Modificações para proteções (Livro Base, Tabela 3.7).
// Cada modificação aumenta a categoria do item em I. Modificações iguais não se acumulam.
export const MODIFICACOES_PROTECAO = [
  {
    id: 'antibombas',
    nome: 'Antibombas',
    efeito: '+5 em testes de resistência contra efeitos de área.',
    descricao:
      'Quimicamente tratada para resistir ao calor e revestida de preenchimentos para amortecer estilhaços. Acompanha um capacete com viseira para proteger da luz e barulho de explosões. Fornece +5 em testes de resistência contra efeitos de área. Só pode ser aplicada em proteções pesadas.',
    livro: 'Livro Base',
  },
  {
    id: 'blindada',
    nome: 'Blindada',
    efeito: 'Aumenta RD para 5 e o espaço em +1.',
    descricao:
      'Reforçada com placas de aço e cerâmica costuradas dentro das camadas de kevlar. Aumenta a resistência a dano para 5 e o espaço ocupado em +1. Só pode ser aplicada em proteções pesadas.',
    livro: 'Livro Base',
  },
  {
    id: 'discreta',
    nome: 'Discreta',
    efeito: '+5 em testes de ocultar e reduz o espaço em –1.',
    descricao:
      'Colete compacto feito com kevlar denso para reduzir o volume. Reduz o número de espaços ocupados em 1, fornece +5 em testes de Crime para ser ocultada e permite que você faça esse teste mesmo que não seja treinado na perícia. Só pode ser aplicada em proteções leves.',
    livro: 'Livro Base',
  },
  {
    id: 'reforcada',
    nome: 'Reforçada',
    efeito: 'Aumenta a Defesa em +2 e o espaço em +1.',
    descricao:
      'Aumenta a Defesa fornecida em +2 e o espaço ocupado em +1. Uma proteção não pode ser reforçada e discreta ao mesmo tempo.',
    livro: 'Livro Base',
  },
];

// ---------------------------------------------------------------------------
// REGRAS GERAIS DE EQUIPAMENTO GERAL (Livro Base)
// ---------------------------------------------------------------------------

export const REGRA_BONUS_ITENS =
  'Vários itens gerais fornecem bônus em perícias. Bônus fornecidos por itens não são cumulativos — por exemplo, um personagem com um utensílio e uma vestimenta que forneçam bônus em Diplomacia recebe o benefício de apenas um dos itens.';

export const REGRA_GRANADAS =
  'Para usar uma granada, você precisa empunhá-la e então gastar uma ação padrão para arremessá-la em um ponto à sua escolha em alcance médio. A granada afeta um raio de 6m a partir do ponto de impacto. O efeito que ela causa varia conforme o tipo de granada.';

export const GRUPOS_ITENS_GERAIS = [
  { id: 'acessorios', nome: 'Acessórios', descricao: 'Auxiliam um agente a usar perícias.' },
    { id: 'itens-operacionais', nome: 'Itens Operacionais', descricao: 'Equipamento variado.' },
  { id: 'itens-paranormais', nome: 'Itens Paranormais', descricao: 'Itens ligados ao Outro Lado.' },
];

// Modificações para acessórios (Livro Base, Tabela 3.9).
// Cada modificação aumenta a categoria do item em I e só pode ser aplicada ao mesmo acessório uma vez.
export const MODIFICACOES_ACESSORIO = [
  {
    id: 'aprimorado',
    nome: 'Aprimorado',
    efeito: 'Aumenta um dos bônus em perícia para +5.',
    descricao:
      'O bônus em perícia concedido pelo acessório aumenta para +5. Se o item tiver função adicional, esta modificação poderá ser escolhida uma segunda vez para esta função.',
    livro: 'Livro Base',
  },
  {
    id: 'discreto',
    nome: 'Discreto',
    efeito: '+5 em testes de ocultar e reduz o espaço em –1.',
    descricao:
      'O item é miniaturizado ou disfarçado como outro item inócuo (como um relógio). Reduz o número de espaços ocupados em 1, fornece +5 em testes de Crime para ser ocultado e permite que você faça esse teste mesmo que não seja treinado na perícia.',
    livro: 'Livro Base',
  },
  {
    id: 'funcao-adicional',
    nome: 'Função adicional',
    efeito: 'Concede +2 a uma perícia adicional.',
    descricao:
      'O acessório fornece +2 em uma perícia adicional à sua escolha, sujeita à aprovação do mestre.',
    livro: 'Livro Base',
  },
  {
    id: 'instrumental',
    nome: 'Instrumental',
    efeito: 'O acessório funciona como um kit de perícia.',
    descricao:
      'O acessório pode ser usado como um kit de perícia específico (escolhido ao aplicar esta modificação).',
    livro: 'Livro Base',
  },
  {
    id: 'bateria-potente',
    nome: 'Bateria Potente',
    efeito:
      'Dobra a duração da bateria e o alcance da luz de lanternas, celulares e notebooks; num taser dobra os usos, aumenta o dano para 1d8 e a DT em +5.',
    descricao:
      'Essa modificação para objetos elétricos aumenta sua eficiência e duração. Se usada em lanternas, celulares e notebooks, dobra a duração da bateria e o alcance da luz projetada. Se usada em um taser, dobra seus usos, aumenta o dano para 1d8 e a DT para resistir a ele em +5. Pode afetar outros objetos, conforme proposta dos jogadores, a critério do mestre.',
    livro: 'Sobrevivendo ao Horror',
  },
];

// Modificações para granadas (Arquivos Secretos 4, p. 71).
// "Cada modificação a seguir aumenta a categoria da granada em I e fornece
// certos benefícios. Modificações iguais não acumulam."
export const MODIFICACOES_GRANADA = [
  {
    id: 'adesiva',
    nome: 'Adesiva',
    descricao:
      'A granada gruda no alvo. Se o alvo for um ser, você precisa fazer um teste de ataque à distância contra a Defesa dele. Se errar, a granada gruda no espaço onde ela está. Se acertar, ela gruda no ser (ele falha automaticamente em qualquer teste de resistência contra a granada). Caso seu efeito não seja instantâneo, a granada se move junto com o alvo até que ele gaste uma ação padrão para removê-la do seu corpo.',
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'dupla',
    nome: 'Dupla',
    descricao:
      'A granada tem um efeito adicional. Ao aplicar essa modificação, você escolhe um efeito de outra granada (exceto itens amaldiçoados) que se ativará junto com o efeito principal. O efeito adicional deve ser diferente do efeito principal.',
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'programada',
    nome: 'Programada',
    descricao:
      'A granada tem um temporizador programado. Após arremessá-la, ou posicioná-la onde desejar e definir em quantos turnos ela explodirá.',
    livro: 'Arquivos Secretos 4',
  },
];

// ---------------------------------------------------------------------------
// ITENS GERAIS
// ---------------------------------------------------------------------------

export const ITENS_GERAIS = [
  // ---- Livro Base — Acessórios (Tabela 3.8) ----
  {
    id: 'kit-de-pericia',
    nome: 'Kit de Perícia',
    grupo: 'Acessórios',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Um conjunto de ferramentas necessárias para algumas perícias ou usos de perícias. Sem o kit, você sofre –5 no teste. Existe um kit de perícia para cada perícia que exige este item.',
    livro: 'Livro Base',
  },
  {
    id: 'utensilio',
    nome: 'Utensílio',
    grupo: 'Acessórios',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Um item comum que tenha uma utilidade específica, como um canivete, uma lupa, um smartphone ou um notebook. Um utensílio fornece +2 em uma perícia (exceto Luta e Pontaria). Por exemplo, um smartphone pode ser usado para acessar a internet e fornecer bônus em Ciências, enquanto um notebook pode ser preparado para invadir sistemas e fornecer bônus em Tecnologia. Você pode inventar itens menos realistas, como um “detector de mentiras portátil” que fornece +2 em Intuição, mas o mestre tem a palavra final se o utensílio é apropriado ou não. Utensílios sempre ocupam 1 espaço e precisam ser empunhados para que o bônus seja aplicado.',
    livro: 'Livro Base',
  },
  {
    id: 'vestimenta',
    nome: 'Vestimenta',
    grupo: 'Acessórios',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Uma peça de vestuário que fornece +2 em uma perícia (exceto Luta ou Pontaria). Por exemplo, um par de botas militares pode fornecer +2 em Atletismo, um terno ou vestido elegante pode fornecer +2 em Diplomacia e um manto com glifos pode fornecer +2 em Ocultismo. Assim como utensílios, o benefício de cada vestimenta deve ser aprovado pelo mestre. Você pode receber os bônus de no máximo duas vestimentas ao mesmo tempo. Vestir ou despir uma vestimenta é uma ação completa.',
    livro: 'Livro Base',
  },

  // ---- Livro Base — Explosivos ----
          
  // ---- Arquivos Secretos 4 — Explosivos ----
    
  // ---- Livro Base — Itens Operacionais ----
  {
    id: 'algemas',
    nome: 'Algemas',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Um par de algemas de aço. Para prender uma pessoa que não esteja indefesa você precisa empunhar a algema, agarrar a pessoa (veja “Manobras de Combate”, no Capítulo 4) e então vencer um novo teste de agarrar contra ela. Você pode prender os dois pulsos da pessoa (–5 em testes que exijam o uso das mãos, impede conjuração) ou um dos pulsos dela em um objeto imóvel adjacente, caso haja, para impedir que ela se mova. Escapar das algemas exige um teste de Acrobacia contra DT 30 (ou ter as chaves…).',
    livro: 'Livro Base',
  },
  {
    id: 'arpeu',
    nome: 'Arpéu',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Um gancho de aço amarrado na ponta de uma corda para se fixar em muros, janelas, parapeitos de prédios… Prender um arpéu exige um teste de Pontaria (DT 15). Subir um muro com a ajuda de uma corda fornece +5 no teste de Atletismo.',
    livro: 'Livro Base',
  },
  {
    id: 'bandoleira',
    nome: 'Bandoleira',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Um cinto com bolsos e alças. Uma vez por rodada, você pode sacar ou guardar um item em seu inventário como uma ação livre.',
    livro: 'Livro Base',
  },
  {
    id: 'binoculos',
    nome: 'Binóculos',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Estes binóculos militares fornecem +5 em testes de Percepção para observar coisas distantes.',
    livro: 'Livro Base',
  },
  {
    id: 'bloqueador-de-sinal',
    nome: 'Bloqueador de Sinal',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Este dispositivo compacto emite ondas que “poluem” a frequência de rádio usada por celulares, impedindo que qualquer aparelho desse tipo em alcance médio se conecte.',
    livro: 'Livro Base',
  },
  {
    id: 'cicatrizante',
    nome: 'Cicatrizante',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Um spray contendo um remédio com potente efeito cicatrizante. Você pode gastar uma ação padrão e este item para curar 2d8+2 PV em você ou em um ser adjacente.',
    livro: 'Livro Base',
  },
  {
    id: 'corda',
    nome: 'Corda',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Um rolo com 10 metros de corda resistente. Possui diversas utilidades: pode ajudar a descer um buraco ou prédio (+5 em testes de Atletismo nessas situações), amarrar pessoas inconscientes etc.',
    livro: 'Livro Base',
  },
  {
    id: 'equipamento-de-sobrevivencia',
    nome: 'Equipamento de Sobrevivência',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 2,
    descricao:
      'Uma mochila com saco de dormir, panelas, GPS e outros itens úteis para sobreviver no mato. Fornece +5 em testes de Sobrevivência para acampar e orientar-se e permite que você faça esses testes sem treinamento.',
    livro: 'Livro Base',
  },
  {
    id: 'lanterna-tatica',
    nome: 'Lanterna Tática',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Ilumina lugares escuros. Além disso, você pode gastar uma ação de movimento para mirar a luz nos olhos de um ser em alcance curto. Ele fica ofuscado por 1 rodada, mas imune à lanterna pelo resto da cena.',
    livro: 'Livro Base',
  },
  {
    id: 'mascara-de-gas',
    nome: 'Máscara de Gás',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Uma máscara com filtro que cobre o rosto inteiro. Fornece +10 em testes de Fortitude contra efeitos que dependam de respiração.',
    livro: 'Livro Base',
  },
  {
    id: 'mochila-militar',
    nome: 'Mochila Militar',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 0, // a tabela marca "*"; a descrição diz que não usa nenhum espaço
    cargaBonus: 2, // "aumenta sua capacidade de carga em 2 espaços"
    descricao:
      'Uma mochila leve e de alta qualidade. Ela não usa nenhum espaço e aumenta sua capacidade de carga em 2 espaços.',
    livro: 'Livro Base',
  },
  {
    id: 'oculos-de-visao-termica',
    nome: 'Óculos de Visão Térmica',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao: 'Estes óculos eliminam a penalidade em testes por camuflagem.',
    livro: 'Livro Base',
  },
  {
    id: 'pe-de-cabra',
    nome: 'Pé de Cabra',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Esta barra de ferro fornece +5 em testes de Força para arrombar portas. Pode ser usada em combate como um bastão.',
    livro: 'Livro Base',
  },
  {
    id: 'pistola-de-dardos',
    nome: 'Pistola de Dardos',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Esta arma dispara dardos com um poderoso sonífero. Para disparar em um ser, faça um ataque à distância contra ele. Se acertá-lo, ele fica inconsciente até o fim da cena (Fortitude DT Agi reduz para desprevenida e lenta por uma rodada). A pistola vem com 2 dardos. Uma caixa adicional com 2 dardos é um item de categoria 0 que ocupa 1 espaço.',
    livro: 'Livro Base',
  },
  {
    id: 'pistola-sinalizadora',
    nome: 'Pistola Sinalizadora',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Esta pistola dispara um sinalizador luminoso, útil para chamar outras pessoas para sua localização. Pode ser usada como uma arma de disparo leve com alcance curto que causa 2d6 pontos de dano de fogo. A pistola vem com 2 cargas. Uma caixa adicional com 2 cargas é um item de categoria 0 que ocupa 1 espaço.',
    livro: 'Livro Base',
  },
  {
    id: 'soqueira',
    nome: 'Soqueira',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Esta peça de metal é usada entre os dedos e permite socos mais perigosos — fornece +1 em rolagens de dano desarmado. Uma soqueira pode receber modificações e maldições de armas corpo a corpo e aplica os efeitos delas em seus ataques desarmados.',
    livro: 'Livro Base',
  },
  {
    id: 'spray-de-pimenta',
    nome: 'Spray de Pimenta',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Este spray dispara um composto químico que causa dor e lacrimação. Você pode gastar uma ação padrão para atingir um ser adjacente. O ser fica cego por 1d4 rodadas (Fortitude DT Agi evita). A carga do spray dura dois usos.',
    livro: 'Livro Base',
  },
  {
    id: 'taser',
    nome: 'Taser',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Um dispositivo de eletrochoque capaz de atordoar ou até incapacitar um alvo. Você pode gastar uma ação padrão para atingir um ser adjacente. O alvo sofre 1d6 pontos de dano de eletricidade e fica atordoado por uma rodada (Fortitude DT Agi evita). A bateria do taser dura dois usos.',
    livro: 'Livro Base',
  },
  {
    id: 'traje-hazmat',
    nome: 'Traje Hazmat',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 2,
    descricao:
      'Uma roupa impermeável e que cobre o corpo inteiro, usada para impedir o contato do usuário com materiais tóxicos. Fornece +5 em testes de resistência contra efeitos ambientais e resistência a químico 10.',
    livro: 'Livro Base',
  },

                
  // ---- Sobrevivendo ao Horror — Acessórios (Tabela 1.5) ----
  {
    id: 'amuleto-sagrado',
    nome: 'Amuleto Sagrado',
    grupo: 'Acessórios',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Um utensílio especial na forma de shimenawa, rosário, fio de contas, contas de oração ou qualquer outro objeto que reforce sua fé e ajude a blindá-lo das desgraças do dia a dia. Ocupa o espaço de um item vestido e fornece +2 em Religião e Vontade.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'celular',
    nome: 'Celular',
    grupo: 'Acessórios',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Um utensílio especial (embora comum hoje em dia). Serve para tirar fotos, gravar áudios e vídeos, acessar a internet e até, veja só, ligar para outras pessoas. Se tiver acesso a internet, fornece +2 em testes de perícia que envolvam adquirir informações. Por fim, possui uma lanterna fraca, mas útil na falta de um equipamento melhor, que ilumina em um cone de 4,5m.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'chave-de-fenda-universal',
    nome: 'Chave de Fenda Universal',
    grupo: 'Acessórios',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Esta ferramenta pode ser considerada um milagre da engenharia humana. Com ela em mãos, você é capaz de resolver quase qualquer problema. Fornece +2 em testes de perícia para criar ou reparar objetos, desde panelas de cozinha até motores de avião. Também fornece o bônus se usada como item de apoio em situações especiais, como lidar com cabos para hackear um servidor.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'chaves',
    nome: 'Chaves',
    grupo: 'Acessórios',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Molhos de chaves (de casa, veículo, cadeados etc.) são itens comuns. Usar o barulho de um molho de chaves para distrair alguém (jogando as chaves, por exemplo) fornece +2 em testes de Furtividade feitos na mesma rodada.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'documentos-falsos',
    nome: 'Documentos Falsos',
    grupo: 'Acessórios',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Um conjunto de documentos (identidade funcional, carteira de habilitação, cartões de crédito etc.) em nome de uma identidade falsa. Você recebe +2 em testes de Diplomacia, Enganação e Intimidação para se passar pela pessoa representada pelos documentos.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'manual-operacional',
    nome: 'Manual Operacional',
    grupo: 'Acessórios',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Um livro com lições práticas sobre um assunto. Existe um manual operacional para cada perícia; gastar uma ação de interlúdio lendo um manual permite que você use essa perícia como se fosse treinado nela até o próximo interlúdio. Um manual operacional aprimorado (veja OPRPG, p. 64) também fornece +5 na perícia. Você só pode receber o benefício de um manual operacional por vez.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'notebook',
    nome: 'Notebook',
    grupo: 'Acessórios',
    subgrupo: null,
    categoria: 0,
    espacos: 2,
    descricao:
      'Um utensílio especial. Como um celular, se tiver acesso a internet fornece +2 em testes de perícia que envolvem adquirir informações. Além disso, por sua tela maior, pode ser usado para entretenimento de forma mais agradável; ao relaxar em cenas de interlúdio, você recupera 1 ponto adicional de Sanidade. A luz do monitor ilumina em um cone de 4,5m. Tablets estão inclusos como uma variação de notebook.',
    livro: 'Sobrevivendo ao Horror',
  },

  // ---- Sobrevivendo ao Horror — Explosivos ----
      {
    id: 'galao-vermelho',
    nome: 'Galão Vermelho',
    grupo: 'Explosivos',
    subgrupo: null,
    categoria: 0,
    espacos: 2,
    descricao:
      'Galões vermelhos, ou marcados com um símbolo de chama, carregam substâncias inflamáveis. Apesar de serem mais frequentes em ambientes industriais, também são encontrados em ambientes inusitados quando menos se espera. Ao sofrer dano de fogo ou balístico, um galão vermelho explode, atingindo uma esfera de 6m de raio. Seres na área sofrem 12d6 pontos de dano de fogo e ficam em chamas (Reflexos DT 25 reduz à metade e evita a condição). A área afetada pelo raio da explosão fica em chamas (1d6 pontos de dano de fogo por rodada em seres e objetos) até ser apagada ou a cena acabar. Veja mais sobre as consequências de um galão vermelho em Fogo e Fumaça (OPRPG, p. 292).',
    livro: 'Sobrevivendo ao Horror',
  },
    
  // ---- Sobrevivendo ao Horror — Itens Operacionais ----
  {
    id: 'alarme-de-movimento',
    nome: 'Alarme de Movimento',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Este pequeno objeto de fácil aquisição pode ser controlado por um dispositivo móvel específico ou um aplicativo de celular. Você pode gastar uma ação completa para posicionar e ativar o alarme; após isso, sempre que houver movimento significativo em um cone de 30m para onde ele foi apontado, ele irá sinalizar o dispositivo de controle. Ao acionar o alarme você pode regular sua sensibilidade ao movimento (como padrão, ele é acionado sempre que um ser Pequeno ou maior se move na área). A sinalização pode ser discreta, apenas no dispositivo, ou barulhenta, acionando um alarme sonoro alto e agudo.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'alimento-energetico',
    nome: 'Alimento Energético',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 2,
    espacos: 1,
    descricao:
      'Existem diversos alimentos e suplementos de alta tecnologia capazes de recuperar as energias mentais de um agente. Você pode gastar uma ação padrão para consumir este item e recuperar 1d4 PE.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'aplicador-de-medicamentos',
    nome: 'Aplicador de Medicamentos',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Essa adaptação portátil de bombas injetoras hospitalares pode ser presa ao redor do braço ou perna para aplicar uma substância, como um cicatrizante ou medicamento, com uma ação de movimento. O aplicador tem espaço para três doses de substâncias (já contabilizadas no espaço do item). Carregar uma dose de uma substância no aplicador é uma ação padrão.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'bracadeira-reforcada',
    nome: 'Braçadeira Reforçada',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Semelhante às proteções usadas em artes marciais e outros esportes de contato, estas braçadeiras ajudam a absorver o impacto ao bloquear golpes com o braço. Elas aumentam em +2 a RD que você recebe por usar um bloqueio.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'cao-adestrado',
    nome: 'Cão Adestrado',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: null, // a tabela marca "–"
    descricao:
      'Um cachorro pode ser um parceiro (e amigo!) valioso para um agente. Um personagem treinado em Adestramento pode usar um cão adestrado como um aliado (veja o quadro abaixo). Um cão corajoso, grande — como um pastor alemão, dobermann, fila brasileiro ou caramelo — e treinado para ajudar em investigação e combate. Veja as regras de aliados em OPRPG, p. 171. Bônus. Você recebe +2 em Investigação e Percepção. Ladrar e Morder. Você pode gastar 1 PE para fazer o cão assumir uma postura defensiva ao seu redor. Você recebe +2 na Defesa por 1 rodada.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'coldre-saque-rapido',
    nome: 'Coldre Saque Rápido',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Este coldre é projetado para que a arma possa ser sacada ou armazenada com um movimento mínimo. Uma vez por rodada, você pode sacar ou guardar uma arma de fogo leve como uma ação livre.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'equipamento-de-escuta',
    nome: 'Equipamento de Escuta',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Este conjunto contém um receptor, com alcance de 90m, e três minúsculos transmissores capazes de captar conversas e outros sons em um raio de 9m. Instalar um transmissor demora alguns minutos e exige um teste de Crime contra DT 20 (uma falha indica que a escuta não irá transmitir). O resultado desse teste é também a DT para outras pessoas encontrarem o transmissor. É possível instalar um transmissor discretamente com outras pessoas presentes; fazer isso é uma ação completa, requer um teste de Furtividade oposto à Percepção dos presentes e aumenta a DT do teste de Crime em +5.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'estrepes',
    nome: 'Estrepes (saco)',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Uma ferramenta medieval cuja utilidade a manteve ativa até os dias de hoje, um estrepe é uma peça de metal com quatro pontas afiadas, construída de modo que uma ponta sempre fique voltada para cima. Usar um saco de estrepes em combate exige uma ação padrão para cobrir um quadrado de 1,5m de lado. Um ser que pise numa área coberta de estrepes sofre 1d4 pontos de dano de perfuração e fica lento por um dia. Em uma cena de perseguição, você pode aplicar os estrepes como parte de sua ação, mas sofre –O em seu teste nessa rodada. Um perseguidor que pise nos estrepes sofre –O em testes de perseguição até o fim da cena. Tanto em combate quanto em perseguição, passar em um teste de Reflexos (DT Agi) evita os estrepes. Os estrepes não afetam seres capazes de resistir a todo o seu dano.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'faixa-de-pregos',
    nome: 'Faixa de Pregos',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 2,
    descricao:
      'Este aparato compacto é uma trilha de hastes metálicas sanfonadas com pregos em toda sua extensão. Utilizado primariamente para parar veículos, pode ser empregado contra outros oponentes. Uma faixa de pregos funciona como estrepes, exceto que ocupa uma linha de 9m. Além disso, veículos com pneus de borracha que passem pela faixa têm seus pneus automaticamente perfurados, o que reduz seu deslocamento pela metade.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'isqueiro',
    nome: 'Isqueiro',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 0.5,
    descricao:
      'Existem isqueiros de vários tipos, desde os sofisticados de metal até os descartáveis de plástico. Todos seguem o mesmo princípio; você pode gastar uma ação de movimento para produzir uma pequena chama. Além de incendiar objetos inflamáveis, emite luz em um raio de 3m.',
    livro: 'Sobrevivendo ao Horror',
  },

  // ---- Sobrevivendo ao Horror — Medicamentos (subgrupo de Itens Operacionais) ----
  {
    id: 'antibiotico',
    nome: 'Antibiótico',
    grupo: 'Itens Operacionais',
    subgrupo: 'Medicamentos',
    categoria: 1,
    espacos: 0.5,
    descricao:
      'Fortalece a imunidade contra vírus e bactérias. Fornece +5 no próximo teste de Fortitude contra efeitos de uma doença feito até o fim do dia.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'antidoto',
    nome: 'Antídoto',
    grupo: 'Itens Operacionais',
    subgrupo: 'Medicamentos',
    categoria: 1,
    espacos: 0.5,
    descricao:
      'Ajuda o corpo a lidar com venenos. Fornece +5 no próximo teste de Fortitude contra efeitos de um veneno até o fim do dia. Um antídoto feito para um veneno específico, em vez disso, remove completamente o veneno.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'antiemetico',
    nome: 'Antiemético',
    grupo: 'Itens Operacionais',
    subgrupo: 'Medicamentos',
    categoria: 1,
    espacos: 0.5,
    descricao:
      'Remove a condição enjoado e fornece +5 em testes para evitar essa condição até o fim da cena. A critério do mestre, pode funcionar contra outras condições causadas por náuseas e vômitos.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'antihistaminico',
    nome: 'Antihistamínico',
    grupo: 'Itens Operacionais',
    subgrupo: 'Medicamentos',
    categoria: 1,
    espacos: 0.5,
    descricao:
      'Reduz reações alérgicas perigosas. Fornece +5 no próximo teste contra efeitos de uma alergia feito até o fim do dia.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'anti-inflamatorio',
    nome: 'Anti-inflamatório',
    grupo: 'Itens Operacionais',
    subgrupo: 'Medicamentos',
    categoria: 1,
    espacos: 0.5,
    descricao:
      'Reduz reações inflamatórias, diminuindo dor e inchaço. Fornece 1d8+2 PV temporários.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'antitermico',
    nome: 'Antitérmico',
    grupo: 'Itens Operacionais',
    subgrupo: 'Medicamentos',
    categoria: 1,
    espacos: 0.5,
    descricao:
      'Reduz reações febris perigosas e alivia dores de cabeça, permitindo um novo teste contra uma condição mental que o usuário esteja sofrendo. Só funciona uma vez por cena.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'broncodilatador',
    nome: 'Broncodilatador',
    grupo: 'Itens Operacionais',
    subgrupo: 'Medicamentos',
    categoria: 1,
    espacos: 0.5,
    descricao:
      'Auxilia na respiração. Fornece +5 em testes para evitar as condições asfixiado ou fatigado feitos até o fim do dia.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'coagulante',
    nome: 'Coagulante',
    grupo: 'Itens Operacionais',
    subgrupo: 'Medicamentos',
    categoria: 1,
    espacos: 0.5,
    descricao:
      'Aumenta a capacidade de coagulação, fornecendo +5 em testes para se estabilizar da condição sangrando feitos até o fim do dia. Se usado em conjunto com um teste de Medicina para remover a condição morrendo, também fornece +5 nesse teste.',
    livro: 'Sobrevivendo ao Horror',
  },

  // ---- Sobrevivendo ao Horror — Itens Operacionais (continuação) ----
  {
    id: 'oculos-de-visao-noturna',
    nome: 'Óculos de Visão Noturna',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Alimentados por uma bateria, estes óculos permitem enxergar no escuro, como se o personagem tivesse visão no escuro. Entretanto, o usuário recebe –O em testes de resistência contra a condição ofuscado e efeitos baseados em luz (como uma granada de atordoamento).',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'oculos-escuros',
    nome: 'Óculos Escuros',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao: 'Um personagem vestindo óculos escuros não pode ser ofuscado.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'pa',
    nome: 'Pá',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 2,
    descricao:
      'Esta pesada ferramenta fornece +5 em testes de Força para cavar buracos e mover detritos. Pode ser usada em combate como um bastão.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'paraquedas',
    nome: 'Paraquedas',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 2,
    descricao:
      'Anula o dano de queda. Personagens com grau de treinamento veterano em Acrobacia, Pilotagem, Reflexos, Tática ou uma Profissão específica sabem usar paraquedas. Caso contrário, ou em quedas muito curtas, usar o paraquedas requer um teste de Reflexos (DT 20). Se falhar, o paraquedas não funciona adequadamente, reduzindo o dano de queda apenas à metade.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'traje-de-mergulho',
    nome: 'Traje de Mergulho',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 1,
    espacos: 2,
    descricao:
      'Uma roupa impermeável e que cobre quase o corpo inteiro, usada para garantir a segurança do mergulhador debaixo d’água. Vem acompanhado de tanque e máscara que garantem 1 hora de oxigênio. Fornece +5 em testes de resistência contra efeitos ambientais e resistência a dano químico 5. Ocupa o espaço de uma vestimenta e vesti-lo ou despi-lo é uma ação completa.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'traje-espacial',
    nome: 'Traje Espacial',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 2,
    espacos: 5,
    descricao:
      'Uma roupa impermeável e que cobre o corpo inteiro, usada para garantir a segurança do astronauta no vácuo do espaço. Possui um suprimento de água e oxigênio de oito horas, e protege contra os raios cósmicos e de minúsculas rochas errantes no espaço. Fornece +10 em testes de resistência contra efeitos ambientais e resistência a dano químico 20. Ocupa o espaço de uma vestimenta e vesti-lo, ou despi-lo, demora duas rodadas.',
    livro: 'Sobrevivendo ao Horror',
  },

                    
  // ---- Arquivos Secretos 3 ----
    {
    id: 'pacoca',
    nome: 'Paçoca',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 0,
    espacos: 0.5,
    descricao:
      'Uma iguaria típica brasileira, muito popular nas festas juninas. Este delicioso doce é feito à base de amendoim torrado e moído, açúcar e farinha de mandioca. Dizem que é impossível comer uma só. A paçoca conta como um prato rápido (OPRPG, p. 93), mas em ocasiões especiais, à critério do mestre, a paçoca pode surpreender: uma vez por dia, ao comer ela, o personagem recupera 1d8+1 PV, PE e SAN.',
    livro: 'Arquivos Secretos 3',
  },
    
  // ---- Arquivos Secretos 5 ----
  {
    id: 'camera-filmadora',
    nome: 'Câmera Filmadora',
    grupo: 'Acessórios',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Uma filmadora antiga que pode capturar aquilo que os nossos olhos, muitas vezes, acabam deixando passar. Este utensílio fornece +2 em testes de Investigação e Percepção, além de poder ser usado como lanterna (ilumina um cone de 9m) ou na função de visão noturna de fósforo verde (funciona como Visão no Escuro, OPRPG, p. 180).',
    livro: 'Arquivos Secretos 5',
  },

  // ---- Arquivos Secretos 7 ----
      ];

export const PROTECOES_POR_ID = Object.fromEntries(PROTECOES.map((p) => [p.id, p]));
export const ITENS_GERAIS_POR_ID = Object.fromEntries(ITENS_GERAIS.map((i) => [i.id, i]));
export const MODIFICACOES_PROTECAO_POR_ID = Object.fromEntries(
  MODIFICACOES_PROTECAO.map((m) => [m.id, m]),
);
export const MODIFICACOES_ACESSORIO_POR_ID = Object.fromEntries(
  MODIFICACOES_ACESSORIO.map((m) => [m.id, m]),
);
export const MODIFICACOES_GRANADA_POR_ID = Object.fromEntries(
  MODIFICACOES_GRANADA.map((m) => [m.id, m]),
);
