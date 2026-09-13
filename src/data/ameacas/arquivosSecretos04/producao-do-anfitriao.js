// A Produção do Anfitrião — Arquivos Secretos 04 (p.55-61). Três fichas de "PESSOA"
// genéricas para membros da equipe de produção do Anfitrião (o boss de Energia do
// Livro Base, cap.7, p.278) — Assistente de Produção, Produtor e Diretor — mais uma
// criatura paranormal única, o Simulacro.EXE (consciências presas em telas digitais,
// amálgama de Energia e Conhecimento).
//
// Texto verbatim do PDF "Arquivos-Secretos-04-Verdadeiro.pdf". Nada foi resumido,
// traduzido ou inventado nas regras/ações; a "flavorText" é uma síntese curta da
// introdução do livro para cada ficha.
//
// Nota sobre o glifo de dado: o livro usa um símbolo "O" para representar 1d20 em
// pools de dados (ex.: "3O+20" = 3d20+20; "O+5" solto = "1d20+5"). Todos os valores
// abaixo já foram convertidos para a notação "NdX+B" padrão do resto do compêndio.
//
// GAP: a página 58 (que deveria introduzir o Simulacro.EXE) contém texto de
// preenchimento "Lorem ipsum" não substituído pela editora ("NOVA CRIATURA DE
// ENERGIA Lorem ipsm dolor sit amet, consectetr adipiscing elit...") — um erro de
// diagramação do próprio livro, não nosso. Não foi usado como flavorText; a síntese
// abaixo vem das páginas 59-60, que têm texto real sobre a criatura.
//
// Nota sobre o atributo Força do Simulacro.EXE: o livro imprime "FOR -" (sem
// pontuação numérica) em vez de um valor — comum em criaturas incorpóreas/digitais
// deste sistema. Não há convenção estabelecida no resto do compêndio para este caso,
// então o campo foi deixado como `null` (em vez de inventar um 0 ou outro número),
// com este comentário a explicar o porquê.
//
// Sobre "Forma Evolutiva" do Simulacro.EXE: o livro não dá fichas completas separadas
// para os estágios Krypto/Vvorm/Botnetz — só uma lista de alterações (delta) em cima
// da ficha base "troyan" (VD32). Por isso ficou como UMA entrada no compêndio, com a
// evolução documentada na íntegra dentro da habilidade "Forma Evolutiva", em vez de
// inventarmos 3 fichas extra com dados que o livro não fornece por completo.

export const AMEACAS_AS04_PRODUCAO = [
  {
    id: 'as04-assistente-de-producao',
    nome: 'Assistente de Produção',
    vd: 40,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: [],
    flavorText: 'Um funcionário raso da Produção do Anfitrião, equipado com máscara de gás e capaz de pequenos rituais de Energia para sabotar tecnologia e criar "coincidências".',
    sentidos: { percepcao: '2d20+5', iniciativa: '1d20+5' },
    defesa: 14,
    testes: { fortitude: '1d20+5', reflexos: '1d20+5', vontade: '2d20+5' },
    pv: 20, pvMachucado: 10,
    atributos: { agi: 1, for: 1, int: 3, pre: 2, vig: 1 },
    pericias: [
      { nome: 'Ciências', dados: 3, bonus: 5 },
      { nome: 'Investigação', dados: 3, bonus: 5 },
      { nome: 'Ocultismo', dados: 3, bonus: 5 },
      { nome: 'Profissão', dados: 3, bonus: 5 },
      { nome: 'Tecnologia', dados: 3, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Máscara de Gás', descricao: 'Uma máscara com filtro que cobre o rosto inteiro. Fornece +10 em testes de Fortitude contra efeitos que dependam de respiração.' },
      { nome: 'Rituais (DT 15)', descricao: 'O assistente de produção pode conjurar os rituais a seguir sem pagar seu custo de PE, até um limite de 3 PE por conjuração, usando a ação apropriada.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pancada', detalhe: 'Corpo a corpo', teste: '1d20+5', dano: '1d4+5 impacto' },
      { tipo: 'Padrão', nome: 'Agredir — Pistola', detalhe: 'À distância, curto', teste: '1d20+5', critico: 18, dano: '1d12+5 balístico' },
      { tipo: 'Padrão', nome: 'Ritual — Amaldiçoar Tecnologia (Energia 1)', descricao: 'O assistente de produção imbui 1 acessório ou arma de fogo com Energia, fazendo-o funcionar acima de sua capacidade até o fim da cena. O item recebe uma modificação à escolha dele.' },
      { tipo: 'Padrão', nome: 'Ritual — Coincidência Forçada (Energia 1)', descricao: 'O assistente de produção manipula os caminhos do caos para que 1 ser em alcance curto tenha mais sorte até o fim da cena. O alvo recebe +2 em testes de perícias.' },
      { tipo: 'Padrão', nome: 'Ritual — Eletrocussão (Energia 1)', descricao: 'O assistente de produção manifesta e dispara uma corrente elétrica contra 1 ser ou objeto em alcance curto. Se usado contra um ser, ele sofre 3d6 pontos de dano de eletricidade e fica vulnerável por uma rodada (Fortitude reduz dano à metade e evita condição). Se usado contra objetos eletrônicos, este ritual causa o dobro de dano e ignora resistência.' },
    ],
    fonte: { livro: 'Arquivos Secretos 04', pagina: 55 },
  },
  {
    id: 'as04-produtor',
    nome: 'Produtor',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: [],
    flavorText: 'Um membro de escalão intermediário da Produção do Anfitrião, armado com um "Martelo Meteoro USB" improvisado de celular e cabo USB, capaz de rituais de Energia mais fortes.',
    sentidos: { percepcao: '1d20+5', iniciativa: '2d20+10' },
    defesa: 20,
    testes: { fortitude: '3d20+10', reflexos: '2d20+10', vontade: '1d20+5' },
    pv: 100, pvMachucado: 50,
    atributos: { agi: 2, for: 2, int: 2, pre: 1, vig: 3 },
    pericias: [
      { nome: 'Atletismo', dados: 2, bonus: 10 },
      { nome: 'Crime', dados: 2, bonus: 10 },
      { nome: 'Ocultismo', dados: 2, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Martelo Meteoro USB', descricao: 'O produtor consegue fazer de um celular e um cabo USB uma arma destrutiva de Energia. A arma tem alcance corpo a corpo de 6m, fornece +2 em manobras de combate e pode causar dano de impacto ou Energia à escolha do produtor.' },
      { nome: 'Máscara de Gás', descricao: 'Uma máscara com filtro que cobre o rosto inteiro. Fornece +10 em testes de Fortitude contra efeitos que dependam de respiração.' },
      { nome: 'Rituais (DT 20)', descricao: 'O produtor pode conjurar os rituais a seguir sem pagar seu custo de PE, até um limite de 6 PE por conjuração, usando a ação apropriada.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Martelo Meteoro USB', detalhe: 'Corpo a corpo x2', teste: '2d20+10', critico: 'x3', dano: '1d12+10 impacto ou Energia' },
      { tipo: 'Padrão', nome: 'Ritual — Chamas do Caos (Energia 2)', descricao: 'O produtor manipula o calor e o fogo em alcance curto até o fim da cena. Ao conjurar o ritual, ele escolhe um dos vários efeitos para usar. O uso mais comum do produtor é para Chamejar: uma arma corpo a corpo causa +1d6 pontos de dano de fogo. Mas ele pode fazer outras coisas (veja OPRPG, p. 126).' },
      { tipo: 'Padrão', nome: 'Ritual — Eletrocussão Discente (Energia 1)', descricao: 'O produtor dispara um poderoso raio que causa 6d6 pontos de dano de Energia em todos os seres e objetos livres em uma linha de 30m (Fortitude reduz o dano à metade).' },
      { tipo: 'Padrão', nome: 'Ritual — Tela de Ruído Discente (Energia 2)', descricao: 'O produtor cria uma película de Energia que recobre seu corpo e absorve energia cinética até o fim da cena. Ele recebe 60 PV temporários, mas apenas contra dano balístico, de corte, de impacto ou de perfuração. Alternativamente, ele pode conjurar este ritual como uma reação quando sofrer dano, recebendo resistência 30 apenas contra esse dano. O produtor só pode usar esse ritual três vezes por cena.' },
    ],
    fonte: { livro: 'Arquivos Secretos 04', pagina: 56 },
  },
  {
    id: 'as04-diretor',
    nome: 'Diretor',
    vd: 200,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: [],
    flavorText: 'O escalão mais alto da Produção do Anfitrião presente neste livro: um conjurador de Energia devastador, com ataques elétricos poderosos e rituais capazes de se teletransportar e anular rituais alheios numa área.',
    sentidos: { percepcao: '4d20+15', iniciativa: '3d20+10' },
    defesa: 28,
    testes: { fortitude: '3d20+15', reflexos: '3d20+10', vontade: '4d20+15' },
    pv: 280, pvMachucado: 140,
    atributos: { agi: 3, for: 3, int: 3, pre: 4, vig: 3 },
    pericias: [
      { nome: 'Atletismo', dados: 3, bonus: 15 },
      { nome: 'Crime', dados: 3, bonus: 10 },
      { nome: 'Enganação', dados: 4, bonus: 15 },
      { nome: 'Intimidação', dados: 4, bonus: 15 },
      { nome: 'Ocultismo', dados: 3, bonus: 10 },
      { nome: 'Tecnologia', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Máscara de Gás', descricao: 'Uma máscara com filtro que cobre o rosto inteiro. Fornece +10 em testes de Fortitude contra efeitos que dependam de respiração.' },
      { nome: 'Rituais (DT 29)', descricao: 'O diretor pode conjurar os rituais a seguir sem pagar seu custo de PE, até um limite de 10 PE por conjuração, usando a ação apropriada.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Murro Eletrificado', detalhe: 'Corpo a corpo x3', teste: '3d20+20', dano: '4d8+20 eletricidade' },
      { tipo: 'Padrão', nome: 'Agredir — Carga Eletrificada', detalhe: 'À distância x3, curto', teste: '3d20+20', dano: '4d8+20 eletricidade' },
      { tipo: 'Padrão', nome: 'Ritual — Coincidência Forçada Verdadeiro (Energia 1)', descricao: 'O diretor manipula os caminhos do caos para que aliados à sua escolha em alcance curto tenham mais sorte até o fim da cena. Os alvos recebem +5 em testes de perícias.' },
      { tipo: 'Padrão', nome: 'Ritual — Dissonância Acústica (Energia 2)', descricao: 'O diretor manipula a vibração do ar, criando uma esfera de dissonância sonora com 6m de raio em alcance médio. Enquanto estiverem na área, todos os seres ficam surdos. Essa dissonância impede que seres dentro da área conjurem rituais.' },
      { tipo: 'Padrão', nome: 'Ritual — Eletrocussão Verdadeiro (Energia 1)', descricao: 'O diretor dispara poderosos relâmpagos que causam 8d6 pontos de dano de Energia (Fortitude reduz o dano à metade). Ele pode atingir um relâmpago em cada ser à sua escolha em alcance curto.' },
      { tipo: 'Padrão', nome: 'Ritual — Salto Fantasma (Energia 3)', descricao: 'O corpo do diretor se transforma momentaneamente em Energia pura e viaja até outro ponto em alcance médio. Ele não precisa perceber nem ter linha de efeito ao seu destino, podendo apenas imaginá-lo, desde que já tenha observado o local de alguma forma (em pessoa, por fotografia, por vídeo…). Por exemplo, pode se transportar 3m adiante para ultrapassar uma porta fechada. Uma vez transportado, ele não pode agir pelo resto do seu turno. Este ritual não permite que ele apareça dentro de um corpo sólido; se o ponto de chegada não tem espaço livre, ele ressurge na área vazia mais próxima.' },
      { tipo: 'Padrão', nome: 'Ritual — Tela de Ruído Discente (Energia 2)', descricao: 'O diretor cria uma película de Energia que recobre seu corpo e absorve energia cinética até o fim da cena. Ele recebe 60 PV temporários, mas apenas contra dano balístico, de corte, de impacto ou de perfuração. Alternativamente, ele pode conjurar este ritual como uma reação quando sofrer dano, recebendo resistência 30 apenas contra esse dano. O diretor só pode usar esse ritual três vezes por cena.' },
    ],
    fonte: { livro: 'Arquivos Secretos 04', pagina: 57 },
  },
  {
    id: 'as04-simulacro-exe',
    nome: 'Simulacro.EXE',
    vd: 32,
    categoria: 'Ameaça Paranormal',
    tamanho: 'Minúsculo',
    descritores: ['Energia', 'Conhecimento'],
    flavorText: 'Consciências de vítimas do Jogo do Anfitrião, presas em telas digitais, que se alimentam de atenção e emoções alheias e evoluem de pequenos vírus (troyan) a redes-zumbi inteiras (botnetz) conforme corrompem mais gente.',
    presencaPerturbadora: { dt: 15, dano: '2d6 mental', nex: 30 },
    sentidos: { percepcao: '1d20+5', iniciativa: '1d20+5' },
    defesa: 10,
    testes: { fortitude: '1d20+5', reflexos: '1d20+5', vontade: '1d20+5' },
    pv: 70, pvMachucado: 35,
    imunidades: ['Dano (exceto Conhecimento)'],
    vulnerabilidades: ['Conhecimento'],
    // O livro imprime "FOR -" (sem valor numérico) para este atributo — comum em
    // criaturas incorpóreas/digitais. Deixado como null em vez de inventado; ver
    // nota completa no cabeçalho do ficheiro.
    atributos: { agi: 1, for: null, int: 1, pre: 1, vig: 1 },
    deslocamento: '0m | 0',
    habilidades: [
      { nome: 'Forma Evolutiva', descricao: 'O simulacro está em constante evolução. Essas mudanças são narrativas e ficam a critério do mestre conforme a história, mas se refletem na ficha do simulacro que, no momento, se encontra no estágio troyan. A cada evolução, a ficha sofre as seguintes alterações: Krypto — o VD aumenta para 64; os PV mudam para 100; a Defesa muda para 20; todos os testes mudam para 1d20+10; o tamanho muda para Pequeno. Vvorm — o VD aumenta para 128; os PV mudam para 200; a Defesa muda para 30; todos os atributos, exceto Força, mudam para 2; todos os testes mudam para 2d20+15; o tamanho muda para Médio. Botnetz — o VD aumenta para 256; os PV mudam para 500; a Defesa muda para 40; todos os atributos, exceto Força, mudam para 3; todos os testes mudam para 3d20+20; o tamanho muda para Grande.' },
      { nome: 'Intangibilidade Digital', descricao: 'O simulacro é incorpóreo, intangível e só pode ser afetado por efeitos de Conhecimento. Além disso, a menos que ele se revele (usando Perturbação Digital, por exemplo), perceber que há um simulacro em um aparelho eletrônico exige um teste de Ocultismo (DT 4d10).' },
      { nome: 'Exorcismo Digital', descricao: 'Além de dano de Conhecimento, outra forma de dar fim ao simulacro (e paz para a pessoa que se tornou um) é através de uma liturgia paranormal feita por, pelo menos, dois personagens treinados em Ocultismo ou Religião. Um deles precisa ficar encarando a tela em que o simulacro está e sobrevivendo à criatura enquanto o outro exorciza. É necessário sucesso total em um teste estendido de Ocultismo (DT 4d10, 3 sucessos), em que o sucesso no primeiro teste impede o simulacro de saltar para outro aparelho. Para a liturgia começar a ser feita, é necessário que não tenha nenhum aparelho ligado (exceto onde o simulacro está) em um raio de 9m da criatura e sigilos de Conhecimento precisam estar escritos em algum objeto analógico, também em um raio de 9m do simulacro. No final da liturgia, a criatura é presa dentro do objeto e então, basta destruí-lo para dar fim a ela. Se o teste estendido for uma falha total, o simulacro escapa para a internet paranormalmente e precisa ser encontrado novamente.' },
    ],
    acoes: [
      { tipo: 'Movimento', nome: 'Saltar', descricao: 'O simulacro troyan consegue se transportar paranormalmente para qualquer aparelho eletrônico em alcance curto. Se for krypto, o alcance muda para médio; se for vvorm, muda para longo; se for botnetz, muda para extremo.' },
      { tipo: 'Padrão', nome: 'Perturbação Digital', descricao: 'O simulacro pode perturbar pessoas de muitas formas (assustando, irritando, atraindo para problemas, prejudicando o financeiro, criando confusões, apavorando através de cada tela que a pessoa olhar etc.). Para isso, o alvo precisa ser uma pessoa que está olhando para algo enquadrado (aba de internet, um post de rede social, telas de eletrônicos etc.). Independentemente da distância, o simulacro troyan perturba 1 pessoa causando 2d6 pontos de dano mental (Vontade DT 3d10 reduz à metade). Se for krypto, muda para 3d6 pontos de dano mental (Vontade DT 4d10 reduz à metade) em até 2 pessoas; se for vvorm, muda para 4d6 pontos de dano mental (Vontade DT 5d10 reduz à metade) em até 3 pessoas; se for botnetz, muda para 6d8 pontos de dano mental (Vontade DT 6d10 reduz à metade) em até 4 pessoas. Uma pessoa que fique insana por causa dessa habilidade tem 50% de chance (1 a 50 em 1d100) de morrer imediatamente ou 50% de chance (51 a 100 em 1d100) de ser transportada para o Jogo do Anfitrião (ela deixa de ficar insana e fica com 1 ponto de sanidade, pronta para jogar).' },
    ],
    fonte: { livro: 'Arquivos Secretos 04', pagina: 61 },
  },
];
