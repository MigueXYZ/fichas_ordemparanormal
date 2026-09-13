// Ameaças Avulsas — Arquivos Secretos 03, fichas de Caíto (p.38-41) e Suellen (p.102-105).
// Texto verbatim do PDF "as03_clean.txt". Nada foi resumido, traduzido ou inventado nas
// regras/ações; a "flavorText" é uma síntese curta (1 frase) da lore de cada personagem,
// tal como consta no livro.
//
// Convenção do glifo de dado "O" (pool de d20): "O" sozinho = '1d20+0'; "O+5" = '1d20+5';
// "2O+5" = '2d20+5'. Ambas as fichas são "PESSOA" (sem Presença Perturbadora, NEX ou
// descritores paranormais impressos) e nenhuma delas traz um ritual com tag explícita de
// "<Descritor> <círculo>" — a menção de Caíto à "força do Sangue" em sua habilidade
// Ódio Suprimido é só narrativa (flavor), não um ritual etiquetado, então descritores: []
// para os dois, por política do projeto de só contar tags explícitas de ritual.
//
// Verificação de conexão com as outras tramas de AS03 (pedida explicitamente, não presumida):
// - Caíto: a bio dele (p.38-40) começa logo após a ficha de Cindy/PSIKOLERA (p.37) e o
//   texto de introdução da trama de Escarlata/Ana Delgado (p.43-46). A bio de Caíto NÃO
//   menciona Cindy, Andrei, PSIKOLERA, Giovanni Opspor, Escarlata, Ana ou os Pássaros/
//   B.I.R.D.S. em nenhum ponto — é uma vinheta isolada sobre um golpista narcisista com
//   gastrosquise congênita. Confirmado: standalone, sem vínculo com as outras tramas de AS03.
// - Suellen: a ficha de "Harpia" (p.95-101, Santiago Luis Borges, líder d'Os Pássaros/
//   B.I.R.D.S.) aparece na página imediatamente anterior à bio de Suellen (p.102-104) só por
//   ordem editorial do capítulo de Hexatombe — mas a seção de Suellen começa com seu próprio
//   cabeçalho "SUELLEN" e sua bio não cita Harpia, Corvo, Coruja, Papagaio, Pomba, B.I.R.D.S.
//   nem qualquer nome do PSIKOLERA ou de Escarlata. O único "harpia" citado no texto dela é
//   uma ave de rapina literal (o animal, comprado para revenda) que a paralisa e a leva a um
//   traficante de animais misterioso — não o personagem "Harpia". Confirmado: standalone, sem
//   vínculo com as outras tramas de AS03. (A página seguinte à ficha dela, p.107, já é o texto
//   de encerramento do capítulo de Hexatombe, reforçando que a seção dela é autocontida.)
//
// Nenhum GAP foi necessário — as duas fichas têm todos os campos de regra usados aqui
// impressos no livro.

export const AMEACAS_AS03_AVULSAS = [
  {
    id: 'as03-caito',
    nome: 'Caíto Rocha',
    vd: 20,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Nascido com uma grave gastrosquise e criado entre exames e terapias que nunca o "consertaram", Caíto se tornou um golpista virtual de narcisismo extremo e psicopatia, capaz de explodir em surtos de violência alimentados pelo Sangue.',
    sentidos: { percepcao: '1d20+5', iniciativa: '2d20+5' },
    defesa: 17,
    testes: { fortitude: '1d20+0', reflexos: '2d20+5', vontade: '1d20+5' },
    pv: 20, pvMachucado: 10,
    atributos: { agi: 2, for: 1, int: 2, pre: 1, vig: 1 },
    pericias: [
      { nome: 'Furtividade', dados: 2, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    descritores: [],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Disparo de Pistola', detalhe: 'À distância x2, curto', teste: '2d20+5', critico: 18, dano: '1d12+5 balístico' },
      { tipo: 'Completa', nome: 'Ódio Suprimido', descricao: 'Caíto "explode" de raiva, gritando, correndo e saltando para cima de quem estiver em seu caminho. A força do Sangue impulsiona seu ímpeto violento. Qualquer ser em alcance curto deve fazer um teste de Fortitude e um teste de Reflexos (ambos contra DT 20). Se falhar no teste de Fortitude: a pessoa é chutada e mordida por Caíto, ficando caída e sofrendo 1d4+6 pontos de dano de impacto. Se falhar no teste de Reflexos: a pessoa é atingida por um disparo da pistola de Caíto, sofrendo 1d12+5 pontos de dano balístico. Depois da explosão, Caíto cai no chão, chorando e tremendo (fica exausto até o fim da cena).' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 41 },
  },
  {
    id: 'as03-suellen',
    nome: 'Suellen',
    vd: 20,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Criança doente criada pela avó dona de uma pet shop, que lhe ensinou a tratar animais como mercadoria, Suellen cresceu em uma adulta cruel capaz de submeter suas vítimas a um prazer avassalador e incapacitante.',
    sentidos: { percepcao: '2d20+5', iniciativa: '1d20+5' },
    defesa: 15,
    testes: { fortitude: '2d20+5', reflexos: '2d20+5', vontade: '2d20+5' },
    pv: 30, pvMachucado: 15,
    atributos: { agi: 1, for: 2, int: 2, pre: 2, vig: 2 },
    pericias: [
      { nome: 'Adestramento', dados: 2, bonus: 10 },
      { nome: 'Atualidades', dados: 2, bonus: 10 },
      { nome: 'Enganação', dados: 2, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    descritores: [],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Golpe com Cutelo', detalhe: 'Corpo a corpo', teste: '2d20+5', dano: '1d8+5 corte' },
      { tipo: 'Padrão', nome: 'Estimular Hedonismo', descricao: 'Suellen faz uma pessoa em alcance curto ser tomada por uma onda de prazer insana. O alvo pode fazer um teste de Vontade (DT 20) para evitar. Se falhar, todos os sentidos e alertas biológicos do alvo (como reflexos de urgência ou dor) só transmitem prazer, euforia, alegria intensa e viciante. O alvo perde qualquer senso de autopreservação, ficando indefeso por 1 rodada.' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 105 },
  },
];
