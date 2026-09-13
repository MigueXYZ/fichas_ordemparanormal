// PSIKOLERA — Arquivos Secretos 03, arco de Hexatombe (p.11, 17, 23, 29, 37).
// Texto verbatim das fichas de "PESSOA MÉDIO" dos 5 integrantes mascarados da banda:
// Alê (teclado), Caio (vocal), Eloy (bateria), Franco (guitarra) e Cindy (baixo).
// Nada foi resumido, traduzido ou inventado nas regras/ações; a "flavorText" é uma
// síntese curta (1-2 frases) da longa biografia em prosa de cada personagem (p.6-36
// do livro — não transcrita aqui, só as fichas de combate importam para o compêndio).
//
// Nota sobre o glifo de dado: o livro usa um símbolo "O" para representar 1d20 em
// pools de dados (ex.: "3O+10" = 3d20+10; "O+10" solto = "1d20+10"; um "O" totalmente
// solto, sem sinal de mais nem número depois, foi convertido para "1d20+0"). Todos os
// valores abaixo já foram convertidos para a notação "NdX+B" padrão do resto do
// compêndio.
//
// "Rituais (DT 20)" (só Alê): assim como nos Transtornados de Arquivos Secretos 01,
// cada ritual concedido pela ficha foi transcrito como uma ação própria ("Ritual — X
// (Descritor N)"), e a regra geral "conjura sem pagar PE, até um limite de X PE por
// conjuração" foi guardada como uma habilidade "Rituais (DT 20)".
//
// "Hora do Show": habilidade idêntica em estrutura para os 5 membros (a máscara dá
// +5 em ataque, +10 na Defesa, +20 PV máximos/atuais, +5 na DT de habilidades, +2
// dados de dano do mesmo tipo e acesso à "Música do Diabo", podendo ser arrancada ou
// quebrada num teste de manobra oposto) — os bullets do livro (com "o"/"oo") foram
// achatados em prosa contínua abaixo, preservando cada número e cláusula, incluindo
// o valor exato do teste de "Arrancar"/"Destruir" impresso em CADA ficha (que é
// sempre igual ao bônus de ataque base do próprio personagem).
//
// "Música do Diabo": o livro só imprime a tabela completa (bónus por nº de membros
// tocando + ordem de entrada) uma única vez, na ficha de Alê (p.11). Nas fichas de
// Caio, Eloy, Franco e Cindy, a habilidade foi transcrita como uma remissão curta
// para a ficha de Alê, em vez de repetir (ou adivinhar) a tabela — mesma convenção
// de remissão de página usada nos Mascarados de Arquivos Secretos 02.
//
// GAP: na ficha de Alê (p.11), a Defesa base impressa é 18 e o PV base impresso é
// 45/22 (Machucado), mas o texto de "Hora do Show" da mesma ficha imprime a Defesa
// final como "(26)" e o PV máximo/atual final como "(90)" — números que não batem
// com a aritmética do próprio bônus da habilidade (+10 na Defesa e +20 PV, que dariam
// 28 e 65, respetivamente). Nas outras 4 fichas do PSIKOLERA essa conta bate
// exatamente (base + bônus = total impresso). Não foi feita nenhuma correção — os
// valores "18" / "45" / "22" (base) e "26" / "90" (Hora do Show) foram transcritos
// tal como impressos no livro, sem adivinhar qual dos dois está errado.

export const AMEACAS_AS03_PSIKOLERA = [
  {
    id: 'as03-ale',
    nome: 'Alê',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Tecladista autista do PSIKOLERA, neta de uma cartomante e responsável por talhar as máscaras rituais de toda a banda; conjura rituais de Morte e Conhecimento com a mesma naturalidade com que toca teclado.',
    sentidos: { percepcao: '3d20+10', iniciativa: '3d20+5' },
    defesa: 18,
    testes: { fortitude: '1d20+0', reflexos: '3d20+5', vontade: '3d20+10' },
    pv: 45, pvMachucado: 22,
    atributos: { agi: 3, for: 1, int: 3, pre: 3, vig: 1 },
    pericias: [
      { nome: 'Artes', dados: 3, bonus: 10 },
      { nome: 'Ocultismo', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    descritores: ['Morte', 'Conhecimento'],
    habilidades: [
      { nome: 'Rituais (DT 20)', descricao: 'Alê pode conjurar os rituais a seguir sem pagar seu custo de PE, até um limite de 6 PE por conjuração, usando a ação apropriada.' },
      { nome: 'Música do Diabo', descricao: 'Usar esta habilidade é uma ação livre, mas ela só pode ser usada se o personagem já estiver de máscara. O personagem começa a tocar sua parte na música. Todos os membros do PSIKOLERA recebem um bônus em dano que varia conforme a quantidade de membros da banda que estiverem tocando. 1 membro: sempre que causa dano, também causa +1d4 pontos de dano do mesmo tipo. 2 membros: aumenta para +1d6. 3 membros: aumenta para +1d8. 4 membros: aumenta para +1d10. 5 membros (todos): aumenta para +1d12. Assim, quando o primeiro tocar, já recebe o bônus de +1d4. Quando o segundo tocar, já recebe o bônus de +1d6 e assim por diante. Eles tocam na seguinte ordem: 1. Franco (guitarra). 2. Cindy (baixo). 3. Alê (teclado). 4. Eloy (bateria). 5. Caio (vocal).' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Cortar com Teclado', detalhe: 'Corpo a corpo x2', teste: '1d20+10', critico: 19, dano: '2d6+10 corte' },
      { tipo: 'Padrão', nome: 'Desfazer Sinapses', descricao: 'As notas dissonantes do teclado sobrecarregam os ouvidos e a mente de um ser em alcance médio. O alvo sofre 3d10+10 pontos de dano de Conhecimento e fica confuso por 1 rodada (Vontade DT 20 reduz à metade e evita condição).' },
      { tipo: 'Padrão', nome: 'Hora do Show', descricao: 'Alê coloca sua máscara e recebe as seguintes alterações: +5 em testes de ataque; +10 na Defesa (26); +20 PV máximos e atuais (90); a DT das habilidades aumenta em +5; quando causa dano, também causa +2 dados de dano do mesmo tipo; pode usar a habilidade Música do Diabo; a máscara pode ser arrancada ou destruída — Arrancar: se Alê perder em uma manobra de desarmar (teste 1d20+10) contra alguém tentando remover sua máscara, ele perde a habilidade Hora do Show; Destruir: se Alê perder em uma manobra de quebrar (teste 1d20+10) contra alguém tentando quebrar sua máscara, o item sofre dano (RD 10 e PV 5) e, se a máscara quebrar, Alê perde a habilidade Hora do Show.' },
      { tipo: 'Padrão', nome: 'Ritual — Cicatrização Discente (Morte 1)', descricao: 'Alê acelera o tempo ao redor das feridas de 1 ser adjacente, que cicatrizam instantaneamente. O alvo recupera 5d8+5 PV, mas envelhece 1 ano automaticamente.' },
      { tipo: 'Padrão', nome: 'Ritual — Proteção Sigilosa (Conhecimento 2)', descricao: 'Alê cobre uma área de 3m de raio em alcance de toque com sigilos de proteção que duram até o fim da cena. Alê e seus aliados dentro da área recebem +5 na Defesa, testes de resistência e Furtividade.' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 11 },
  },
  {
    id: 'as03-caio',
    nome: 'Caio',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Vocalista do PSIKOLERA e ex-fã obcecado que seguia a banda como uma espécie de empregado não solicitado até ser convidado a assumir os vocais; empunha uma espada-microfone em shows cada vez mais violentos.',
    sentidos: { percepcao: '2d20+0', iniciativa: '2d20+5' },
    defesa: 17,
    testes: { fortitude: '2d20+10', reflexos: '2d20+5', vontade: '2d20+0' },
    pv: 60, pvMachucado: 30,
    atributos: { agi: 2, for: 2, int: 1, pre: 2, vig: 2 },
    pericias: [
      { nome: 'Artes', dados: 2, bonus: 10 },
      { nome: 'Atletismo', dados: 2, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    descritores: [],
    habilidades: [
      { nome: 'Música do Diabo', descricao: '(veja a ficha de Alê, Arquivos Secretos 03, p. 11, para o efeito completo — todo membro mascarado do PSIKOLERA pode usá-la.)' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Ataque com Espada', detalhe: 'Corpo a corpo x2', teste: '2d20+10', critico: 19, dano: '2d8+10 corte' },
      { tipo: 'Padrão', nome: 'Berrão', descricao: 'Caio finca a ponta de sua espada no chão e grita no ouvido de um alvo em alcance de toque. O alvo sofre 4d8 pontos de dano de impacto, fica surdo por 1 rodada e solta o que está segurando para tapar os ouvidos. O alvo pode escolher largar o que estiver segurando para tapar os ouvidos (reduz o dano à metade e evita a condição).' },
      { tipo: 'Padrão', nome: 'Corte na Jugular', descricao: 'Caio gira sua espada-microfone na direção da garganta de um ser adjacente. O alvo sofre 2d8+10 pontos de dano de corte e fica sangrando (Reflexos DT 20 reduz à metade e evita condição).' },
      { tipo: 'Padrão', nome: 'Hora do Show', descricao: 'Caio coloca sua máscara e recebe as seguintes alterações: +5 em testes de ataque; +10 na Defesa (27); +20 PV máximos e atuais (80); a DT das habilidades aumenta em +5; quando causa dano, também causa +2 dados de dano do mesmo tipo; pode usar a habilidade Música do Diabo; a máscara pode ser arrancada ou destruída — Arrancar: se Caio perder em uma manobra de desarmar (teste 2d20+10) contra alguém tentando remover sua máscara, ele perde a habilidade Hora do Show; Destruir: se Caio perder em uma manobra de quebrar (teste 2d20+10) contra alguém tentando quebrar sua máscara, o item sofre dano (RD 10 e PV 5) e, se a máscara quebrar, Caio perde a habilidade Hora do Show.' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 17 },
  },
  {
    id: 'as03-eloy',
    nome: 'Eloy',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Baterista do PSIKOLERA (nome artístico Glauber Furtado) e melhor amigo de infância do vocalista original Andrei, cujo desaparecimento o empurrou mais fundo no culto da banda; toca sempre com uma máscara em forma de focinheira.',
    sentidos: { percepcao: '1d20+0', iniciativa: '2d20+5' },
    defesa: 16,
    testes: { fortitude: '3d20+10', reflexos: '2d20+5', vontade: '1d20+0' },
    pv: 70, pvMachucado: 35,
    atributos: { agi: 1, for: 3, int: 1, pre: 1, vig: 3 },
    pericias: [
      { nome: 'Artes', dados: 1, bonus: 10 },
      { nome: 'Atletismo', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    descritores: [],
    habilidades: [
      { nome: 'Música do Diabo', descricao: '(veja a ficha de Alê, Arquivos Secretos 03, p. 11, para o efeito completo — todo membro mascarado do PSIKOLERA pode usá-la.)' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pancada', detalhe: 'Corpo a corpo x2', teste: '3d20+10', critico: 19, dano: '4d4+10 impacto' },
      { tipo: 'Padrão', nome: 'Hora do Show', descricao: 'Eloy coloca sua máscara e recebe as seguintes alterações: +5 em testes de ataque; +10 na Defesa (26); +20 PV máximos e atuais (90); a DT das habilidades aumenta em +5; quando causa dano, também causa +2 dados de dano do mesmo tipo; pode usar a habilidade Música do Diabo; a máscara pode ser arrancada ou destruída — Arrancar: se Eloy perder em uma manobra de desarmar (teste 3d20+10) contra alguém tentando remover sua máscara, ele perde a habilidade Hora do Show; Destruir: se Eloy perder em uma manobra de quebrar (teste 3d20+10) contra alguém tentando quebrar sua máscara, o item sofre dano (RD 10 e PV 5) e, se a máscara quebrar, Eloy perde a habilidade Hora do Show.' },
      { tipo: 'Padrão', nome: 'Moeller Method', descricao: 'Eloy se atira sobre um ser adjacente e começa a espancá-lo como se fosse uma bateria. O alvo precisa fazer um teste de Fortitude (DT 20). Se passar, sofre 2d4+5 pontos de dano de impacto. Se falhar, sofre 4d4+10 pontos de dano de impacto e fica aturdido pela quantidade de golpes, o que permite que Eloy continue batendo! O alvo precisa fazer um novo teste de Fortitude (DT 20); se passar sofre 2d4+5 pontos de dano, mas se falhar sofre 4d4+10 pontos de dano e apanha mais, tendo que fazer um novo teste. O processo se repete até o alvo passar em algum teste ou falhar três vezes seguidas.' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 23 },
  },
  {
    id: 'as03-franco',
    nome: 'Franco',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Guitarrista mais jovem do PSIKOLERA, obcecado por fogo desde criança e sustentado por um líquido paranormal que Alê lhe deu para respirar; transformou a própria guitarra num lança-chamas improvisado.',
    sentidos: { percepcao: '1d20+0', iniciativa: '2d20+5' },
    defesa: 16,
    testes: { fortitude: '2d20+5', reflexos: '2d20+10', vontade: '1d20+0' },
    pv: 55, pvMachucado: 27,
    atributos: { agi: 2, for: 2, int: 1, pre: 1, vig: 2 },
    pericias: [
      { nome: 'Acrobacia', dados: 2, bonus: 10 },
      { nome: 'Artes', dados: 1, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    descritores: [],
    habilidades: [
      { nome: 'Música do Diabo', descricao: '(veja a ficha de Alê, Arquivos Secretos 03, p. 11, para o efeito completo — todo membro mascarado do PSIKOLERA pode usá-la.)' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Bater com Guitarra', detalhe: 'Corpo a corpo x2', teste: '2d20+5', dano: '1d10+5 impacto' },
      { tipo: 'Padrão', nome: 'Hora do Show', descricao: 'Franco coloca sua máscara e recebe as seguintes alterações: +5 em testes de ataque; +10 na Defesa (26); +20 PV máximos e atuais (75); a DT das habilidades aumenta em +5; quando causa dano, também causa +2 dados de dano do mesmo tipo; pode usar a habilidade Música do Diabo; a máscara pode ser arrancada ou destruída — Arrancar: se Franco perder em uma manobra de desarmar (teste 2d20+5) contra alguém tentando remover sua máscara, ele perde a habilidade Hora do Show; Destruir: se Franco perder em uma manobra de quebrar (teste 2d20+5) contra alguém tentando quebrar sua máscara, o item sofre dano (RD 10 e PV 5) e, se a máscara quebrar, Franco perde a habilidade Hora do Show.' },
      { tipo: 'Padrão', nome: 'Imolar', descricao: 'Franco dispara chamas, forçando o lança-chamas ao máximo, em um ser em alcance curto. Role 1d20 e compare o resultado com as opções a seguir: 10 ou mais: o alvo sofre 8d6+10 pontos de dano de fogo e fica em chamas (Reflexos DT 20 reduz à metade e evita a condição). 9 ou menos: o lança-chamas vaza combustível flamejante sobre o próprio Franco, que sofre 4d6 pontos de dano de fogo e fica em chamas.' },
      { tipo: 'Padrão', nome: 'Incinerar', descricao: 'Franco dispara chamas de sua guitarra em um ser em alcance curto. O alvo sofre 6d6+5 pontos de dano de fogo e fica em chamas (Reflexos DT 20 reduz à metade e evita a condição).' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 29 },
  },
  {
    id: 'as03-cindy',
    nome: 'Cindy',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Baixista e líder de fato do PSIKOLERA, que assumiu o controle da banda depois de orquestrar a morte do namorado e vocalista original, Andrei, em troca de um pacto com o empresário oculto Giovanni Opspor.',
    sentidos: { percepcao: '3d20+5', iniciativa: '3d20+10' },
    defesa: 17,
    testes: { fortitude: '1d20+0', reflexos: '3d20+10', vontade: '3d20+5' },
    pv: 50, pvMachucado: 25,
    atributos: { agi: 3, for: 1, int: 2, pre: 3, vig: 1 },
    pericias: [
      { nome: 'Artes', dados: 3, bonus: 10 },
      { nome: 'Enganação', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    descritores: [],
    habilidades: [
      { nome: 'Música do Diabo', descricao: '(veja a ficha de Alê, Arquivos Secretos 03, p. 11, para o efeito completo — todo membro mascarado do PSIKOLERA pode usá-la.)' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pancada com Baixo', detalhe: 'Corpo a corpo x2', teste: '1d20+10', dano: '1d6+10 impacto' },
      { tipo: 'Padrão', nome: 'Agredir — Disparo com Baixo', detalhe: 'À distância x2, médio', teste: '3d20+10', critico: '19/x3', dano: '2d8+10 balístico' },
      { tipo: 'Padrão', nome: 'Hora do Show', descricao: 'Cindy coloca sua máscara e recebe as seguintes alterações: +5 em testes de ataque; +10 na Defesa (27); +20 PV máximos e atuais (70); a DT das habilidades aumenta em +5; quando causa dano, também causa +2 dados de dano do mesmo tipo; pode usar a habilidade Música do Diabo; a máscara pode ser arrancada ou destruída — Arrancar: se Cindy perder em uma manobra de desarmar (teste 1d20+10) contra alguém tentando remover sua máscara, ela perde a habilidade Hora do Show; Destruir: se Cindy perder em uma manobra de quebrar (teste 1d20+10) contra alguém tentando quebrar sua máscara, o item sofre dano (RD 10 e PV 5) e, se a máscara quebrar, Cindy perde a habilidade Hora do Show.' },
      { tipo: 'Padrão', nome: 'Silenciar', descricao: 'Cindy faz sinal de silêncio para um ser em alcance médio. O alvo sofre 2d6 pontos de dano mental e fica trêmulo por 3 rodadas (Vontade DT 20 reduz à metade e muda duração para 1 rodada).' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 37 },
  },
];
