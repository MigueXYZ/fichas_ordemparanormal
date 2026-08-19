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
      'Jaqueta de couro pesada ou um colete de kevlar. Essa proteção é tipicamente usada por seguranças e policiais.',
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
  { id: 'explosivos', nome: 'Explosivos', descricao: 'Granadas e bombas antipessoais.' },
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
  {
    id: 'granada-de-atordoamento',
    nome: 'Granada de Atordoamento',
    grupo: 'Explosivos',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Também chamadas de flash-bang, por criarem um estouro barulhento e luminoso. Seres na área ficam atordoados por 1 rodada (Fortitude DT Agi reduz para ofuscado e surdo por uma rodada).',
    livro: 'Livro Base',
  },
  {
    id: 'granada-de-fragmentacao',
    nome: 'Granada de Fragmentação',
    grupo: 'Explosivos',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Espalha fragmentos perfurantes. Seres na área sofrem 8d6 pontos de dano de perfuração (Reflexos DT Agi reduz à metade).',
    livro: 'Livro Base',
  },
  {
    id: 'granada-de-fumaca',
    nome: 'Granada de Fumaça',
    grupo: 'Explosivos',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Produz uma fumaça espessa e escura. Seres na área ficam cegos e sob camuflagem total. A fumaça dura 2 rodadas.',
    livro: 'Livro Base',
  },
  {
    id: 'granada-incendiaria',
    nome: 'Granada Incendiária',
    grupo: 'Explosivos',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Espalha labaredas incandescentes. Seres na área sofrem 6d6 pontos de dano de fogo e ficam em chamas (Reflexos DT Agi reduz o dano à metade e evita a condição em chamas).',
    livro: 'Livro Base',
  },
  {
    id: 'mina-antipessoal',
    nome: 'Mina Antipessoal',
    grupo: 'Explosivos',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Esta mina é ativada por controle remoto. Se você estiver a até alcance longo dela, pode gastar uma ação padrão para detoná-la. Ao explodir, a mina dispara centenas de bolas de aço em um cone de 6m, causando 12d6 pontos de dano de perfuração em todos os seres na área (Reflexos DT Int reduz à metade). Você define a direção do cone quando posiciona a mina no chão. Instalar a mina exige uma ação completa e um teste de Tática contra DT 15. Caso falhe, você gasta a mina, mas ela não funciona. Encontrar uma mina instalada exige um teste de Percepção (DT igual ao resultado do seu teste para instalá-la).',
    livro: 'Livro Base',
  },

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

  // ---- Livro Base — Itens Paranormais (Tabela 3.10) ----
  {
    id: 'amarras-de-elemento',
    nome: 'Amarras de (Elemento)',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 2,
    espacos: 1,
    descricao:
      'Cordas ou correntes feitas de um elemento paranormal específico. As amarras são preparadas para imobilizar criaturas do Outro Lado que sejam vulneráveis ao elemento que as compõem e podem ser usadas de duas formas. Armadilha. Você gasta as amarras, uma ação completa e 2 PE para preparar uma armadilha de 3x3m. Uma criatura que atravesse o espaço pela primeira vez em seu turno precisa fazer um teste de de Reflexos (DT Int); se falhar, fica imóvel até o final da cena. Mesmo se passar, considera o espaço ocupado pela armadilha como terreno difícil. Laçar. Você gasta uma ação padrão e 1 PE e escolhe uma criatura em alcance curto. Se falhar num teste de Vontade (DT Agi), a criatura fica paralisada até o início de seu próximo turno, quando pode repetir o teste. Manter a criatura enlaçada requer o gasto de 1 PE por rodada.',
    livro: 'Livro Base',
  },
  {
    id: 'camera-de-aura-paranormal',
    nome: 'Câmera de Aura Paranormal',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 2,
    espacos: 1,
    descricao:
      'Esta câmera amaldiçoada com Energia possui sigilos de Conhecimento para capturar auras paranormais. Tirar uma foto gasta uma ação padrão e 1 PE. As fotos são instantâneas e revelam a presença de auras paranormais em pessoas e objetos. As auras são da cor associada ao elemento.',
    livro: 'Livro Base',
  },
  {
    id: 'componentes-ritualisticos-de-elemento',
    nome: 'Componentes Ritualísticos de (Elemento)',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 0,
    espacos: 1,
    descricao:
      'Um conjunto de objetos utilizados em rituais de um elemento entre Sangue, Morte, Conhecimento ou Energia (não existem componentes ritualísticos de Medo). Componentes ritualísticos são necessários para a conjuração de rituais do elemento em questão. Energia: eletricidade, dispositivos tecnológicos (celulares, computadores etc.), circuitos eletrônicos, fontes de calor e luz, pilhas, baterias, cabos de cobre e prata, pólvora, moedas, dados, ímãs… Sangue: órgãos, carne, sangue, animais vivos (para sacrifício), navalhas, agulhas, arame farpado, correntes, metal enferrujado, fluidos corporais… Morte: ossos, dentes, cinzas, fios de cabelo, cristais pretos, relógios, galhos secos, folhas secas, plantas mortas, raízes, areia, poeira, Lodo… Conhecimento: escrituras, papéis, livros, pergaminhos, instrumentos de escrita (lápis, caneta, tinta, giz etc.), pedras preciosas, ouro, cordas, tecido, cristais brancos, vidro, máscaras…',
    livro: 'Livro Base',
  },
  {
    id: 'emissor-de-pulsos-paranormais',
    nome: 'Emissor de Pulsos Paranormais',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 2,
    espacos: 1,
    descricao:
      'Esta pequena caixa coberta de sigilos foi desenvolvida para servir como uma “isca” de criaturas paranormais. Ativar a caixa gasta uma ação completa e 1 PE. A caixa emite um pulso de um elemento definido pelo ativador, que atrai criaturas do mesmo elemento e afasta criaturas do elemento oposto. As criaturas afetadas têm direito a um teste de Vontade (DT Pre) para evitar o efeito.',
    livro: 'Livro Base',
  },
  {
    id: 'escuta-de-ruidos-paranormais',
    nome: 'Escuta de Ruídos Paranormais',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 2,
    espacos: 1,
    descricao:
      'Este microfone funciona como um aparato espião, com a diferença que consegue captar ruídos paranormais. Ativar a escuta gasta uma ação completa e 2 PE e faz com que ela grave ruídos por até 24 horas. Ouvir a escuta fornece +5 em testes de Ocultismo para identificar criatura.',
    livro: 'Livro Base',
  },
  {
    id: 'medidor-de-estabilidade-da-membrana',
    nome: 'Medidor de Estabilidade da Membrana',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: null, // não consta na Tabela 3.10
    espacos: null, // não consta na Tabela 3.10
    descricao:
      'Um dispositivo complexo, composto por diversos medidores — de temperatura, campo magnético, dilatação temporal… Um agente treinado em Ocultismo pode usar o medidor para avaliar o estado da Membrana em uma área (veja a página 97), o que indica a chance de uma entidade se manifestar nela. Um ambiente com valores racionais e constantes ao longo de algumas horas dificilmente originará uma criatura ou manifestação perigosa. Porém, se as leituras apresentarem dados inexplicáveis ou com grandes variações, o lugar poderá conter uma entidade. Apesar de ser um bom indicativo, o medidor não fornece respostas definitivas, já que um ambiente com a Membrana danificada ainda pode não ter sido afetado por manifestações, assim como um lugar com a Membrana protegida por conter uma criatura poderosa vinda de outro lugar.',
    livro: 'Livro Base',
  },
  {
    id: 'scanner-de-manifestacao-paranormal-de-elemento',
    nome: 'Scanner de Manifestação Paranormal de (Elemento)',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 2,
    espacos: 1,
    descricao:
      'Este item é composto por um dispositivo conectado a pequenos objetos amaldiçoados de uma entidade específica e adornado com uma série de sigilos. Ativar o scanner é uma ação padrão. Quando ativado, o scanner consome 1 PE por rodada do usuário, que sempre sabe a direção de todas as manifestações paranormais ativas (rituais, criaturas, itens amaldiçoados etc.) do elemento escolhido em alcance longo. Se o elemento principal de uma criatura for outro, mas ela tiver como complemento o elemento escolhido do scanner, também será detectada.',
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
    id: 'dinamite',
    nome: 'Dinamite',
    grupo: 'Explosivos',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Dinamite é um artefato explosivo à base de nitroglicerina, ajeitado em um bastão com 20 cm de comprimento. Com a mesma ação padrão é possível acender seu pavio com uma das mãos e arremessá-la com a outra em um ponto à sua escolha em alcance médio. A dinamite afeta um raio de 6m a partir do ponto de impacto; seres e objetos soltos na área sofrem 4d6 pontos de dano de impacto e 4d6 pontos de dano de fogo e ficam em chamas (Reflexos DT Agi reduz à metade e evita condição em chamas).',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'explosivo-plastico',
    nome: 'Explosivo Plástico',
    grupo: 'Explosivos',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Essa massa adesiva do tamanho de uma esponja é acompanhada de pinos de ignição e um detonador remoto. Para utilizá-la, você precisa gastar duas rodadas para preparar os pinos e grudar o explosivo em uma superfície. Por fim, você pode detonar o explosivo acionando um detonador (uma ação livre que pode ser feita de alcance longo) ou causando pelo menos 1 ponto de dano de fogo ou eletricidade nele. Quando detonado, o explosivo plástico causa 16d6 pontos de dano de impacto em todos os seres e objetos em um raio de 3m (Reflexos DT Int reduz à metade). Se usado por um especialista em explosivos (alguém treinado em Crime ou uma Profissão adequada, a critério do mestre), causa o dobro de dano em objetos e estruturas e ignora sua RD.',
    livro: 'Sobrevivendo ao Horror',
  },
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
  {
    id: 'granada-de-gas-sonifero',
    nome: 'Granada de Gás Sonífero',
    grupo: 'Explosivos',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Esta granada libera uma fumaça branca que preenche um raio de 6m a partir do ponto de impacto. Seres que comecem seus turnos na área ficam inconscientes e caídos ou, se estiverem envolvidos em atividade física intensa (como combate), ficam exaustos por 1 rodada, depois fatigados (em ambos os casos, Fortitude DT Agi reduz para fatigado por 1d4 rodadas). O gás permanece na área por 2 rodadas.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'granada-de-pem',
    nome: 'Granada de PEM',
    grupo: 'Explosivos',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Esta granada emite um poderoso pulso eletromagnético que desativa todos os equipamentos elétricos em um raio de 18m até o fim da cena. Criaturas de Energia na área sofrem 6d6 pontos de dano de impacto e ficam paralisadas por 1 rodada (apenas uma vez por cena, Fortitude DT Agi reduz à metade e evita a condição).',
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

  // ---- Sobrevivendo ao Horror — Itens Paranormais ----
  {
    id: 'catalisador-ritualistico-ampliador',
    nome: 'Catalisador Ritualístico de (Elemento) — Ampliador',
    grupo: 'Itens Paranormais',
    subgrupo: 'Catalisadores Ritualísticos de (Elemento)',
    categoria: 1,
    espacos: 0.5,
    descricao:
      'Aumenta o alcance do ritual em um passo (apenas de curto para médio, de médio para longo ou de longo para extremo) ou dobra a área de efeito. Por exemplo, uma Dissonância Acústica ampliada tem seu alcance aumentado para longo ou sua área aumentada para 12m de raio.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'catalisador-ritualistico-perturbador',
    nome: 'Catalisador Ritualístico de (Elemento) — Perturbador',
    grupo: 'Itens Paranormais',
    subgrupo: 'Catalisadores Ritualísticos de (Elemento)',
    categoria: 1,
    espacos: 0.5,
    descricao: 'A DT para resistir ao ritual aumenta em +2.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'catalisador-ritualistico-potencializador',
    nome: 'Catalisador Ritualístico de (Elemento) — Potencializador',
    grupo: 'Itens Paranormais',
    subgrupo: 'Catalisadores Ritualísticos de (Elemento)',
    categoria: 1,
    espacos: 0.5,
    descricao: 'O dano do ritual aumenta em um dado do mesmo tipo.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'catalisador-ritualistico-prolongador',
    nome: 'Catalisador Ritualístico de (Elemento) — Prolongador',
    grupo: 'Itens Paranormais',
    subgrupo: 'Catalisadores Ritualísticos de (Elemento)',
    categoria: 1,
    espacos: 0.5,
    descricao:
      'A duração do ritual dobra. Por exemplo, um Distorcer Aparência prolongado tem sua duração aumentada para duas cenas. Não funciona para rituais instantâneos ou sustentados.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'ligacao-direta-infernal',
    nome: 'Ligação Direta Infernal',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 2,
    espacos: 1,
    descricao:
      'Um amontoado de fios de cobre contaminados com Sangue e Energia. Você pode gastar uma ação completa para usar os fios para ligar um veículo automaticamente. Isso faz os fios invadirem os controles do veículo animando-o de forma paranormal; o veículo recebe resistência a dano 20 (cumulativa com qualquer RD que já possua) e imunidade a Sangue, e você recebe +5 em testes de Pilotagem para conduzi-lo. Entretanto, nesse estado o veículo tentará causar o máximo de confusão possível; as consequências de qualquer falha nos testes de Pilotagem são amplificadas a critério do mestre (de forma geral, qualquer dano ou penalidade causado por uma falha é dobrado). Remover a ligação direta infernal de um veículo é uma ação completa.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'medidor-de-condicao-vertebral',
    nome: 'Medidor de Condição Vertebral',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 2,
    espacos: 1,
    descricao:
      'Este item grotesco é uma coluna vertebral sustentada por Lodo de Morte e revestida com cabos e fios de Energia. Para ser usado, deve ser conectado à coluna vertebral, em um procedimento que exige uma ação completa e causa profunda dor e agonia, deixando o usuário atordoado por uma rodada. O medidor conta como uma vestimenta que fornece +2 em Fortitude. Além disso, uma vez conectado ele se ilumina em cores que vão do vermelho, na base, passando por amarelo no centro até verde no topo. Essas cores indicam a saúde do usuário, sendo verde a melhor condição. Além disso, se o usuário estiver sob um efeito paranormal, o item emitirá pulsos de luz lilás. Por fim, as informações fornecidas pelo item concedem um bônus de +5 em testes de Medicina feitos para auxiliar o usuário.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'pe-de-morto',
    nome: 'Pé de Morto',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 2,
    espacos: 1,
    descricao:
      'Estas botas macabras foram costuradas com a pele de cadáveres amaldiçoados pela Morte. Com essa matéria grotesca, a bota mantém os passos do usuário leves e quase inaudíveis, como se ele fosse um fantasma se aproximando sem fazer barulho. Você recebe +5 em Furtividade e, em cenas de furtividade (p. 92), qualquer ação chamativa que envolva apenas se mover (como correr ou saltar) aumenta a visibilidade em apenas +1.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'pendrive-selado',
    nome: 'Pendrive Selado',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 2,
    espacos: 0.5,
    descricao:
      'Este dispositivo está gravado com sigilos dourados de Conhecimento. Graças à proteção desses sigilos, o pen drive não pode ser invadido ou afetado por rituais, seres e efeitos de Energia. Isso mantém seus arquivos protegidos, e permite que ele seja usado para invadir outros dispositivos sem ser contaminado pela entidade. Existem outros modelos de dispositivos selados, como HDs externos e celulares.',
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'valete-da-salvacao',
    nome: 'Valete da Salvação',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 1,
    espacos: 0.5,
    descricao:
      'Assim como um valete servia a seus senhores, esta carta — um valete de ouros pintada de dourado e coberta com sigilos de Conhecimento — serve para salvá-lo de uma situação complicada. Para usá-la, você deve gastar uma ação padrão para atirá-la ao ar. Ela então irá voar em alcance médio, apontando para a melhor rota de fuga dentro deste alcance, e deixará de existir. Se a carta for gasta em uma cena de perseguição (p. 90), você é bem-sucedido em uma ação de cortar caminho.',
    livro: 'Sobrevivendo ao Horror',
  },

  // ---- Arquivos Secretos 3 ----
  {
    id: 'bloody-mary-batizada',
    nome: 'Bloody Mary Batizada',
    grupo: 'Itens Operacionais',
    subgrupo: null,
    categoria: 2,
    espacos: 1,
    descricao:
      'Uma versão especial da bebida Bloody Mary, preparada com “carinho” para expurgar todas as mazelas de um corpo. Se beber, você se livra de uma condição mental e/ou de medo que o esteja afetando. Porém, sofre 2d4 pontos de dano mental.',
    livro: 'Arquivos Secretos 3',
  },
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
  {
    id: 'cranio-dominador',
    nome: 'Crânio Dominador',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 3,
    espacos: 1,
    descricao:
      'O crânio nefasto de quem outrora conheceu a submissão, agora tomado pela podridão e pelas correntes que o aprisionavam em vida, transbordando o desejo de retribuir cada gota de sofrimento. Se estiver empunhando este item, você pode gastar uma ação padrão e 2 PE para invocar correntes que envolvem até dois alvos em alcance curto. Eles ficam paralisados (Reflexos DT Pre evita). A única forma de se libertar é com o rompimento da corrente (Defesa 10, RD 10, 20 PV). O crânio não pode ser usado novamente por 24 horas e quando voltar a ser útil, as correntes já existentes desaparecem.',
    livro: 'Arquivos Secretos 3',
  },
  {
    id: 'gaiola-do-corvo',
    nome: 'Gaiola do Corvo',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 4,
    espacos: 2,
    descricao:
      'Uma gaiola de pássaros feita de ossos e originada da morte daquele que perdeu sua liberdade. Dentro dela, uma nuvem de cinzas inquieta sussurra os lamentos daqueles que se foram. Se estiver empunhando este item, você pode gastar uma ação padrão para colocá-lo no chão e abrir sua portinhola. Ao fazer isso, todo o solo em um raio de 18m da gaiola é tomado por Lodo e se torna terreno difícil. No começo de toda rodada, aqueles que se encontrarem no Lodo sofrem 3d10 pontos de dano de Morte (Fortitude DT Vig reduz à metade). Se alguém ficar morrendo enquanto está no Lodo, seu corpo é consumido, transformado em cinzas e levado para dentro da gaiola, onde permanecerá para sempre. Após isso, a gaiola se fecha e seus efeitos acabam. É possível fechar a gaiola a qualquer momento como ação padrão.',
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
  {
    id: 'carranca-cacadora',
    nome: 'Carranca Caçadora',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 2,
    espacos: 2,
    descricao:
      'Uma cabeça raivosa de proporções animalescas esculpida de um tronco de madeira. Seus olhos são penetrantes e parecem se mover quando se olha pela visão periférica. Quando você coloca algum material relacionado à uma criatura paranormal (roupa rasgada por um zumbi de sangue, cabelo sujo pelo Lodo de um esqueleto de Lodo etc.) na boca da carranca, os olhos dela passam a apontar para um caminho que leva até a criatura relacionada ao material ou ao último lugar em que ela esteve antes de sumir da Realidade (morrer, inexistir etc.). Infelizmente para você, o caminho guiado pela carrança é sempre o mais perigoso. Além disso, o efeito só dura por 10 minutos. Passado esse tempo, a carrança consome o material e para de guiar, nunca mais sendo útil para localizar a mesma criatura (mas ainda pode ser usada para outras criaturas).',
    livro: 'Arquivos Secretos 7',
  },
  {
    id: 'pe-de-coelho',
    nome: 'Pé de Coelho',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'A pata decepada de um pequeno animal que representa uma companhia de sorte e proteção para trapaceiros e patifes, a custo do derramamento do sangue inocente. Este item deve ser vestido como uma vestimenta para ser usado. Uma vez por cena, você pode gastar uma ação de movimento para esfregar a pata com uma mão e soprá-la. Se fizer isso, até o fim da cena, o caos presente na pata fornece +1d4 em todos os seus testes. Entretanto, se o resultado do d4 for ímpar, algum acidente acontece com seu próprio pé (bate o mindinho, um tijolo cai sobre ele, sofre uma leve torção etc.) e você perde 1d4 PV.',
    livro: 'Arquivos Secretos 7',
  },
  {
    id: 'sal-dourado',
    nome: 'Sal Dourado',
    grupo: 'Itens Paranormais',
    subgrupo: null,
    categoria: 1,
    espacos: 1,
    descricao:
      'Arquivos antigos relatam que, em uma missão, agentes da Ordo Realitas conseguiram afastar criaturas de Sangue usando uma receita de sal produzido com ouro usado em rituais de Conhecimento. Não é muito poderosa, mas pode salvar vidas. Para fazer efeito, o sal dourado deve ser colocado formando uma linha em uma porta ou janela (3 usos dessa forma esvaziam o saleiro). Alternativamente, pode ser usado para formar um círculo (1 uso dessa forma esvazia o saleiro). Qualquer criatura de Sangue com VD 80 ou menos que tente cruzar o sal precisa ser bem-sucedida em um teste de Vontade (DT 20). Se passar, a criatura fica frustrada até o fim da cena, mas consegue cruzar o sal normalmente. Se falhar, fica frustrada e não consegue atravessar o sal até o fim da cena.',
    livro: 'Arquivos Secretos 7',
  },
];

export const PROTECOES_POR_ID = Object.fromEntries(PROTECOES.map((p) => [p.id, p]));
export const ITENS_GERAIS_POR_ID = Object.fromEntries(ITENS_GERAIS.map((i) => [i.id, i]));
export const MODIFICACOES_PROTECAO_POR_ID = Object.fromEntries(
  MODIFICACOES_PROTECAO.map((m) => [m.id, m]),
);
export const MODIFICACOES_ACESSORIO_POR_ID = Object.fromEntries(
  MODIFICACOES_ACESSORIO.map((m) => [m.id, m]),
);
