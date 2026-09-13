// Os Pássaros — Arquivos Secretos 03 (p.74-101). B.I.R.D.S. (Bureau of
// Intervention and Regional Defusion System) é uma organização mercenária
// particular enviada para investigar o ritual Hexatombe; a equipe acaba
// presa dentro dele e é sacrificada. O grupo é descrito como um bando de
// amigos que virou uma família — cada membro usa um codinome de ave.
// Líder: Harpia (Santiago Luis Borges). Equipe: Coruja (Cecília Clemm),
// Corvo (Edgar), Papagaio (Rogério José Canini Sobrinho) e Pomba
// (nome verdadeiro não informado no texto do livro — ver GAP abaixo).
//
// Texto verbatim do livro. Nada foi resumido, traduzido ou inventado nas
// regras/ações; a "flavorText" é uma síntese curta (1 frase) do papel de
// cada um na equipe e, quando o livro dá, do nome verdadeiro.
//
// Convenção do glifo de dado "O" (pool de d20): "O" sozinho = '1d20+0';
// "NO+B" = 'NdN20+B'; um bônus/penalidade solto como "+1O" ou "–2O" vira
// '+1d20' / '–2d20', preservando o sinal exatamente como impresso.
//
// GAP / disclosure: nas fichas de Coruja (p.81) e Corvo (p.88), o livro
// imprime literalmente "RITUAIS (CD20)" / "RITUAIS (CD 20)" — não "DT 20"
// como em todas as outras fichas com rituais deste livro e dos Arquivos
// Secretos anteriores. Tratamos isso como a mesma mecânica de "Rituais
// (DT X)" usada em todo o resto do compêndio (não há outra leitura
// razoável — CD/DT são o mesmo conceito, "Classe de Dificuldade"/
// "Dificuldade de Teste"), mas o valor impresso "CD20"/"CD 20" está
// registrado aqui para não esconder a variação de texto do livro.
//
// GAP: a ficha da Pomba (p.95) lista "Percepção 2O+10" tanto em SENTIDOS
// quanto em PERÍCIAS (com o mesmo valor). Isso está transcrito tal como
// impresso — não foi removido nem "corrigido" para não inventar/assumir
// que é um erro tipográfico do livro.
//
// GAP: o nome verdadeiro de Pomba não é dado no texto-fonte fornecido para
// esta extração; usamos apenas o codinome "Pomba".

export const AMEACAS_AS03_PASSAROS = [
  {
    id: 'as03-harpia',
    nome: 'Harpia',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Santiago Luis Borges, fundador e líder da B.I.R.D.S., o mais forte da equipe em combate direto, comandando suas aves de ataque com um assobio.',
    sentidos: { percepcao: '2d20+10', iniciativa: '3d20+10' },
    defesa: 22,
    testes: { fortitude: '3d20+10', reflexos: '3d20+10', vontade: '2d20+5' },
    pv: 100, pvMachucado: 50,
    atributos: { agi: 3, for: 3, int: 2, pre: 2, vig: 3 },
    pericias: [
      { nome: 'Adestramento', dados: 2, bonus: 10 },
      { nome: 'Atletismo', dados: 3, bonus: 10 },
      { nome: 'Furtividade', dados: 3, bonus: 10 },
      { nome: 'Sobrevivência', dados: 2, bonus: 10 },
      { nome: 'Tática', dados: 2, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Garra do Harpia', detalhe: 'Corpo a corpo x2', teste: '3d20+10', critico: 19, dano: '2d8+10 corte' },
      { tipo: 'Padrão', nome: 'Agredir — Pistola', detalhe: 'À distância x2, curto', teste: '3d20+10', critico: 18, dano: '1d12+10 balístico' },
      { tipo: 'Livre', nome: 'Agarrar', descricao: 'Se acertar um ataque com sua garra, Harpia tenta agarrar o alvo (teste 3d20+15).' },
      { tipo: 'Livre', nome: 'Assobio do Harpia', descricao: 'Uma vez por rodada, Harpia pode assobiar para as aves que adestrou. Elas avançam sobre um alvo em alcance longo e causam um dos efeitos a seguir: Cegar: as aves bicam os olhos. O alvo sofre 3d6 pontos de dano de perfuração e fica cego por 1 rodada (Reflexos DT 20 reduz o dano à metade e evita a condição). Distrair: as aves voam ao redor da cabeça da pessoa. O alvo fica pasmo por 1 rodada (Vontade DT 20 evita; um mesmo alvo só pode sofrer este efeito uma vez por cena). Sangrar: as aves rasgam a pele. O alvo sofre 5d6 pontos de dano de perfuração e fica sangrando (Fortitude DT 20 reduz o dano à metade e evita a condição).' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 101 },
  },
  {
    id: 'as03-coruja',
    nome: 'Coruja',
    vd: 40,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Cecília Clemm, a cientista e "médica" de campo da B.I.R.D.S., combina dardos sedativos de zarabatana com rituais de Sangue e Conhecimento para reforçar a equipe.',
    sentidos: { percepcao: '2d20+10', iniciativa: '3d20+10' },
    defesa: 19,
    testes: { fortitude: '1d20+0', reflexos: '3d20+10', vontade: '2d20+5' },
    pv: 50, pvMachucado: 25,
    atributos: { agi: 3, for: 1, int: 3, pre: 2, vig: 1 },
    pericias: [
      { nome: 'Adestramento', dados: 2, bonus: 10 },
      { nome: 'Atualidades', dados: 3, bonus: 10 },
      { nome: 'Ciências', dados: 3, bonus: 10 },
      { nome: 'Furtividade', dados: 3, bonus: 10 },
      { nome: 'Sobrevivência', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Dardos Sedativos', descricao: 'Um alvo atingido por um dos dardos da Coruja fica sedado (inconsciente) até ser acordado ou até o fim da cena, o que acontecer primeiro (Fortitude DT 20 evita).' },
      // O livro imprime "RITUAIS (CD20)" nesta ficha — ver disclosure no cabeçalho do arquivo.
      { nome: 'Rituais (DT 20)', descricao: 'Coruja pode conjurar os rituais a seguir sem pagar seu custo de PE, até um limite de 4 PE por conjuração, usando a ação apropriada.' },
      { nome: 'Validação de Hipótese', descricao: 'Quando faz um acerto crítico, Coruja recebe +1d20 em testes contra o mesmo alvo.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Tiro de Zarabatana', detalhe: 'À distância, curto', teste: '3d20+10', critico: 19, dano: '1d4+1 perfuração mais sedativo' },
      { tipo: 'Padrão', nome: 'Ritual — Aprimorar Físico (Sangue 2)', descricao: 'Coruja tonifica os músculos e reforça os ligamentos de 1 ser em alcance de toque. O alvo recebe +1 em Agilidade ou Força, à escolha dele, até o fim da cena.' },
      { tipo: 'Padrão', nome: 'Ritual — Aprimorar Mente (Conhecimento 2)', descricao: 'Coruja alimenta com sigilos de Conhecimento a mente de 1 ser em alcance de toque. O alvo recebe +1 em Intelecto ou Presença, à escolha dele, até o fim da cena.' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 81 },
  },
  {
    id: 'as03-corvo',
    nome: 'Corvo',
    vd: 40,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Edgar, o especialista em furtividade e ilusões da B.I.R.D.S., usa rituais de Morte e Conhecimento para desaparecer, iludir e manipular feridas — mesmo depois de morto, seu corpo ainda traz azar aos aliados.',
    sentidos: { percepcao: '2d20+10', iniciativa: '3d20+10' },
    defesa: 18,
    testes: { fortitude: '1d20+5', reflexos: '2d20+5', vontade: '3d20+10' },
    pv: 60, pvMachucado: 30,
    atributos: { agi: 2, for: 1, int: 3, pre: 3, vig: 1 },
    pericias: [
      { nome: 'Adestramento', dados: 3, bonus: 10 },
      { nome: 'Atualidades', dados: 3, bonus: 10 },
      { nome: 'Furtividade', dados: 3, bonus: 10 },
      { nome: 'Ocultismo', dados: 3, bonus: 10 },
      { nome: 'Sobrevivência', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      // O livro imprime "RITUAIS (CD 20)" nesta ficha — ver disclosure no cabeçalho do arquivo.
      { nome: 'Rituais (DT 20)', descricao: 'Corvo pode conjurar os rituais a seguir sem pagar seu custo de PE, até um limite de 4 PE por conjuração, usando a ação apropriada.' },
      { nome: 'Silêncio Fúnebre', descricao: 'Quando Corvo está morto, seu corpo recebe 30 PV temporários e se torna um sinal de mau agouro no campo de batalha. Testes feitos contra aliados do Corvo em um raio de 30m do corpo sofrem –2d20. O efeito dura até o fim da cena ou até os PV temporários zerarem (o que acontecer primeiro).' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pancada', detalhe: 'Corpo a corpo', teste: '1d20+5', dano: '1d4+5 impacto' },
      { tipo: 'Livre', nome: 'Ritual — Esconder os Olhos (Conhecimento 1)', descricao: 'Corvo fica invisível por 1 rodada, incluindo seu equipamento, recebendo camuflagem total e +15 em testes de Furtividade. Como o normal, seres que não possam vê-lo ficam desprevenidos contra seus ataques. O efeito termina se ele faz um ataque ou usa uma habilidade hostil. Ações contra objetos livres não dissipam Esconder dos Olhos (você pode tocar ou apanhar objetos que não estejam sendo segurados por outros seres). Causar dano indiretamente — por exemplo, preparar explosivos para detonar mais tarde — não é considerado um ataque. Objetos soltos voltam a ser visíveis e objetos apanhados por Corvo ficam invisíveis. Luz transportada nunca fica invisível (mesmo que a fonte esteja). Qualquer parte de um item carregado que se estenda além de alcance corpo a corpo natural se torna visível.' },
      { tipo: 'Padrão', nome: 'Ritual — Cicatrização Discente (Morte 1)', descricao: 'Corvo acelera o tempo ao redor das feridas de 1 ser adjacente, que cicatrizam instantaneamente. O alvo recupera 5d8+5 PV, mas envelhece 1 ano automaticamente.' },
      { tipo: 'Padrão', nome: 'Ritual — Definhar Discente (Morte 1)', descricao: 'Corvo dispara uma lufada de cinzas que drena as forças de 1 ser em alcance curto. O alvo fica exausto até o fim da cena (Fortitude DT 15 muda para fatigado).' },
      { tipo: 'Padrão', nome: 'Ritual — Tecer Ilusão Discente (Conhecimento 1)', descricao: 'Corvo cria uma ilusão em alcance médio que se estende a até 8 cubos de 1,5m e dura até o fim da cena. Ela pode ser visual, sonora, tátil, térmica e/ou olfativa. O ritual cria apenas imagens ou sons simples, com volume equivalente à voz de uma pessoa para cada cubo de 1,5m no efeito. Não é possível criar cheiros, texturas ou temperaturas, nem sons complexos, como uma música ou diálogo. Seres e objetos atravessam uma ilusão sem sofrer dano, mas o ritual pode, por exemplo, esconder uma armadilha ou emboscada. A ilusão é dissipada se você sair do alcance.' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 88 },
  },
  {
    id: 'as03-papagaio',
    nome: 'Papagaio',
    vd: 40,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Rogério José Canini Sobrinho, ex-militar carismático da B.I.R.D.S., briga com garrafadas e desarma inimigos, além de asfixiar oponentes com a fumaça do próprio cachimbo.',
    sentidos: { percepcao: '3d20+10', iniciativa: '2d20+10' },
    defesa: 21,
    testes: { fortitude: '1d20+5', reflexos: '2d20+5', vontade: '3d20+10' },
    pv: 60, pvMachucado: 30,
    atributos: { agi: 2, for: 2, int: 1, pre: 3, vig: 2 },
    pericias: [
      { nome: 'Adestramento', dados: 3, bonus: 10 },
      { nome: 'Artes', dados: 3, bonus: 5 },
      { nome: 'Crime', dados: 2, bonus: 10 },
      { nome: 'Diplomacia', dados: 3, bonus: 10 },
      { nome: 'Enganação', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Garrafada', detalhe: 'Corpo a corpo x2', teste: '2d20+10', dano: '1d4+10 impacto' },
      { tipo: 'Padrão', nome: 'Cachimbo do Capeta', descricao: 'Papagaio dá um trago em seu cachimbo e sopra a fumaça na direção de um alvo adjacente. O alvo fica asfixiado e deve gastar uma ação padrão para recuperar o fôlego (Fortitude DT 20 evita).' },
      { tipo: 'Livre', nome: 'Desarmar', descricao: 'Se acertar um ataque com garrafa, Papagaio tenta desarmar o alvo (teste 2d20+15).' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 92 },
  },
  {
    id: 'as03-pomba',
    nome: 'Pomba',
    vd: 40,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'A batedora e navegadora da B.I.R.D.S., ágil e observadora, capaz de repetir a habilidade de um parceiro morto e de disparar à frente do grupo no início de um combate.',
    sentidos: { percepcao: '2d20+10', iniciativa: '2d20+5' },
    defesa: 20,
    testes: { fortitude: '2d20+5', reflexos: '2d20+5', vontade: '2d20+10' },
    pv: 50, pvMachucado: 25,
    atributos: { agi: 2, for: 1, int: 3, pre: 3, vig: 1 },
    pericias: [
      // Percepção listada tanto em SENTIDOS quanto em PERÍCIAS no livro — ver GAP no cabeçalho.
      { nome: 'Percepção', dados: 2, bonus: 10 },
      { nome: 'Intuição', dados: 2, bonus: 10 },
      { nome: 'Atletismo', dados: 1, bonus: 15 },
      { nome: 'Investigação', dados: 2, bonus: 10 },
      { nome: 'Sobrevivência', dados: 2, bonus: 5 },
      { nome: 'Pilotagem', dados: 2, bonus: 5 },
      { nome: 'Furtividade', dados: 2, bonus: 5 },
      { nome: 'Ciências', dados: 2, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Ensinamentos do Ninho', descricao: 'Após presenciar a morte de um aliado, Pomba pode, até o fim da cena, utilizar qualquer habilidade conhecida pelo parceiro falecido uma única vez.' },
      { nome: 'Voe para Longe', descricao: 'Na primeira rodada de um combate, Pomba pode se mover até o dobro de seu deslocamento padrão com uma única ação de movimento.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Ataque com Canivete', detalhe: 'Corpo a corpo x2', teste: '2d20+10', dano: '1d4+5 corte' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 95 },
  },
];
