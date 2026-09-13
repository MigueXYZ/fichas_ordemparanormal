// Ameaças do Hexatombe (fauna corrompida) — Arquivos Secretos 02, seção "AMEAÇAS DO HEXATOMBE"
// (PDF pages 25-33 do arquivo de origem, correspondendo às páginas impressas 26-32 do livro).
// Texto verbatim do PDF "Arquivos Secretos 02" (Hexatombe). Nada foi resumido, traduzido ou
// inventado nas regras/ações; a "flavorText" é uma síntese curta (1-2 frases) do parágrafo de
// descrição/introdução de cada criatura, quando o livro traz um.
//
// Cada dupla animal-comum -> forma(s) corrompida(s) pelo Sangue segue o padrão do livro:
// Arara-vermelha (mundana) -> Arara-devorada (Sangue, VD 80) -> Arara-infernal (Sangue, VD 120)
// Jaguatirica (mundana) -> Felino-devorado (Sangue, VD 80) -> Felino-infernal (Sangue, VD 120)
//
// Nota sobre o glifo de dado: o livro usa um símbolo "O" (um círculo/grau estilizado) para
// representar 1d20 em pools de dados (ex.: "3O+10" = 3d20+10). Todos os valores abaixo já
// foram convertidos para a notação "NdX+B" padrão do restante do compêndio.
//
// Nota sobre a ficha de Felino-infernal (p. 32): no texto extraído do PDF, o subtítulo
// impresso imediatamente acima da caixa de estatísticas do Felino-infernal está rotulado
// "Arara-infernal" (claramente um erro de diagramação/copiar-colar do livro, já que o
// cabeçalho da página e todo o conteúdo da ficha — VD 120, PV 230, Mordidas/Garras/Pulo do
// Felino/Boca da Loucura/Chicotada Perfurante — são inequivocamente do Felino-infernal, que é
// a evolução do Felino-devorado, não da Arara). Mantivemos o nome correto "Felino-infernal"
// pelo conteúdo e pelo título de seção da página, mas registramos aqui o rótulo estranho para
// que alguém possa conferir contra o PDF original. Da mesma forma, a linha de atributos
// aparece duplicada no texto extraído ("AGI 4 FOR 2 INT 0 PRE 2 VIG 3" e, logo abaixo,
// "AGI 4 INT 0 VIG 3" / "FOR 2 PRE 2") — os dois conjuntos são idênticos, então isso não afeta
// os valores usados abaixo.
//
// Também note-se que, diferente da Arara-devorada, Felino-devorado e Felino-infernal — que têm
// um parágrafo de flavor text próprio antes da ficha —, a Arara-infernal (p. 28) não tem
// nenhum parágrafo de descrição no texto extraído (a área correspondente da página está em
// branco na extração). Por isso o campo "flavorText" foi omitido nessa entrada, em vez de
// inventado.

export const AMEACAS_AS02_ANIMAIS = [
  {
    id: 'as02-arara-vermelha',
    nome: 'Arara-vermelha',
    vd: 10,
    categoria: 'Animal',
    tamanho: 'Pequeno',
    flavorText: 'A arara-vermelha tem plumagem vermelho-vivo na cabeça e no dorso, asas com penas amarelas, esverdeadas e azul profundo, e um bico grande e curvado em marfim claro e preto fosco.',
    sentidos: { percepcao: '2d20+5', iniciativa: '2d20+5' },
    defesa: 12,
    testes: { fortitude: '1d20+0', reflexos: '2d20+5', vontade: '2d20+0' },
    pv: 8, pvMachucado: 4,
    atributos: { agi: 2, for: 1, int: 0, pre: 2, vig: 1 },
    deslocamento: '3m | 2, voo 9m | 6',
    habilidades: [
      { nome: 'E do Nada', descricao: 'O vôo rasante da arara-vermelha é capaz de pegar qualquer um de surpresa. Durante a primeira rodada de combate, todos os seres que agirem após a arara-vermelha na ordem de iniciativa ficam desprevenidos contra ela.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Bicada', detalhe: 'Corpo a corpo', teste: '2d20+5', dano: '1d6+2 perfuração' },
      { tipo: 'Padrão', nome: 'Agredir — Arranhão', detalhe: 'Corpo a corpo x2', teste: '2d20+5', dano: '1d4+2 corte' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 26 },
  },
  {
    id: 'as02-arara-devorada',
    nome: 'Arara-devorada',
    vd: 80,
    categoria: 'Animal',
    descritores: ['Sangue'],
    tamanho: 'Médio',
    flavorText: 'A arara-vermelha corrompida pelo Sangue: maior, com garras nas asas, presas no bico e estacas ósseas rompendo a pele — uma das aves mais belas do Brasil transformada em atrocidade sanguinolenta.',
    presencaPerturbadora: { dt: 20, dano: '3d8 mental', nex: 40 },
    sentidos: { percepcao: '2d20+5', iniciativa: '3d20+10' },
    defesa: 21,
    testes: { fortitude: '2d20+5', reflexos: '3d20+10', vontade: '2d20+0' },
    pv: 120, pvMachucado: 60,
    resistencias: ['Balístico, impacto e perfuração 5', 'Sangue 10'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 3, for: 2, int: 0, pre: 2, vig: 2 },
    deslocamento: '9m | 6, voo 12m | 8',
    habilidades: [
      { nome: 'E do Nada', descricao: 'O vôo rasante da arara-devorada é capaz de pegar qualquer um de surpresa. Durante a primeira rodada de combate, todos os seres que agirem após a arara-devorada na ordem de iniciativa ficam desprevenidos contra ela.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Bicada', detalhe: 'Corpo a corpo', teste: '3d20+5', dano: '1d8+5 perfuração + 1d8 Sangue' },
      { tipo: 'Padrão', nome: 'Agredir — Garras', detalhe: 'Corpo a corpo x2', teste: '3d20+5', dano: '1d6+5 corte' },
      { tipo: 'Livre', nome: 'Agarrão', descricao: 'Se acertar um ataque com suas garras, a arara-devorada pode usar seus braços extras para agarrar a vítima (teste 3d20+7).' },
      { tipo: 'Completa', nome: 'Penas Afiadas', descricao: 'A arara-devorada abre suas asas e solta um grito amedrontador enquanto expele suas penas como uma rajada de lâminas, atingindo todos os seres em um raio de 9m (Reflexos DT 20 evita). Seres atingidos devem rolar 1d6 para descobrir qual cor de pena os atinge: 1-2 Pena vermelha: corta como uma navalha afiada (fica sangrando). 3-4 Pena azul: atrofia os músculos que corta (fica lento até recuperar qualquer quantidade de PV). 5-6 Pena amarela: expele um veneno debilitante (fica fraco até o fim da cena ou ser alvo de um efeito que remova veneno).' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 27 },
  },
  {
    id: 'as02-arara-infernal',
    nome: 'Arara-infernal',
    vd: 120,
    categoria: 'Animal',
    descritores: ['Sangue'],
    tamanho: 'Grande',
    // Sem flavorText: o livro não traz parágrafo de descrição para esta forma (ver nota no
    // topo do arquivo) — nada foi inventado para preencher o campo.
    presencaPerturbadora: { dt: 23, dano: '4d6 mental', nex: 50 },
    sentidos: { percepcao: '2d20+5', iniciativa: '4d20+10' },
    defesa: 26,
    testes: { fortitude: '3d20+10', reflexos: '4d20+10', vontade: '2d20+5' },
    pv: 220, pvMachucado: 110,
    resistencias: ['Balístico, impacto e perfuração 10', 'Sangue 20'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 4, for: 2, int: 0, pre: 2, vig: 3 },
    deslocamento: '12m | 8, voo 15m | 10',
    habilidades: [
      { nome: 'E do Nada', descricao: 'O vôo rasante da arara-infernal é capaz de pegar qualquer um de surpresa. Durante a primeira rodada de combate, todos os seres que agirem após a arara-infernal na ordem de iniciativa ficam desprevenidos contra ela.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Bicada', detalhe: 'Corpo a corpo', teste: '4d20+10', dano: '1d10+10 perfuração + 1d10 Sangue' },
      { tipo: 'Padrão', nome: 'Agredir — Garras', detalhe: 'Corpo a corpo x4', teste: '4d20+10', dano: '1d8+10 corte' },
      { tipo: 'Livre', nome: 'Agarrão', descricao: 'Se acertar um ataque com suas garras, a arara-infernal pode usar seus braços extras para agarrar a vítima (teste 4d20+12).' },
      { tipo: 'Movimento', nome: 'Mastigar', descricao: 'A arara-infernal pode mastigar um ser agarrado por ela com sua bocarra abdominal. O ser sofre 6d10 pontos de dano de Sangue (Fortitude DT 23 reduz à metade). Um ser que fique morrendo por essa habilidade é completamente mastigado e engolido, e a arara-infernal recupera 2d10 PV.' },
      { tipo: 'Completa', nome: 'Penas Afiadas', descricao: 'A arara-infernal abre suas asas e solta um grito amedrontador enquanto expele suas penas como uma rajada de lâminas, atingindo todos os seres em um raio de 9m (Reflexos DT 23 evita). Seres atingidos devem rolar 1d6 para descobrir qual cor de pena os atinge: 1-2 Pena vermelha: corta como uma navalha afiada (perde 2d6 PV e fica sangrando). 3-4 Pena azul: atrofia os músculos que corta (perde 2d6 PV e fica lento até recuperar qualquer quantidade de PV). 5-6 Pena amarela: expele um veneno debilitante (perde 2d6 PV e fica fraco até o fim da cena ou ser alvo de um efeito que remova veneno).' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 28 },
  },
  {
    id: 'as02-jaguatirica',
    nome: 'Jaguatirica',
    vd: 10,
    categoria: 'Animal',
    tamanho: 'Pequeno',
    flavorText: 'Um felino pequeno e esguio, de silhueta alongada, pelagem entre o amarelo-acinzentado e o pardo-claro com manchas escuras, e olhos grandes de íris âmbar ou dourada.',
    sentidos: { percepcao: '1d20+5', iniciativa: '2d20+5' },
    defesa: 13,
    testes: { fortitude: '1d20+0', reflexos: '2d20+5', vontade: '1d20+0' },
    pv: 16, pvMachucado: 8,
    atributos: { agi: 2, for: 1, int: 0, pre: 1, vig: 1 },
    deslocamento: '12m | 8',
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Mordida', detalhe: 'Corpo a corpo', teste: '2d20+5', dano: '1d6+2 corte' },
      { tipo: 'Padrão', nome: 'Agredir — Arranhar', detalhe: 'Corpo a corpo x2', teste: '2d20+5', dano: '1d4+2 corte' },
      { tipo: 'Movimento', nome: 'Pulo do Gato', descricao: 'O gato pula na direção de um alvo em alcance curto. Caso faça uma ação de agredir com mordida ou arranhar no mesmo turno, causa +1d4 pontos de dano adicional. Se o alvo estiver desprevenido, esta habilidade pode ser usada como ação livre uma vez por rodada.' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 30 },
  },
  {
    id: 'as02-felino-devorado',
    nome: 'Felino-devorado',
    vd: 80,
    categoria: 'Animal',
    descritores: ['Sangue'],
    tamanho: 'Médio',
    flavorText: 'A jaguatirica corrompida pelo Sangue: músculos dilatados com veias pulsantes expostas, uma cauda que termina em osso pontiagudo, e a cabeça deformada em duas bocas dentadas com ossos expostos.',
    presencaPerturbadora: { dt: 20, dano: '3d8 mental', nex: 40 },
    sentidos: { percepcao: '2d20+10', iniciativa: '3d20+10' },
    defesa: 23,
    testes: { fortitude: '2d20+5', reflexos: '3d20+10', vontade: '2d20+0' },
    pv: 140, pvMachucado: 70,
    resistencias: ['Balístico, impacto e perfuração 5', 'Sangue 10'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 3, for: 2, int: 0, pre: 2, vig: 2 },
    deslocamento: '12m | 8',
    habilidades: [
      { nome: 'Camuflagem Perversa', descricao: 'Assim como outros predadores da natureza, o felino-devorado molda seu corpo com características que dificultam sua caça e compreensão, como olhos falsos, crânios expostos em locais impossíveis e patas invertidas. Em termos de regras, o felino-devorado está sempre sob efeito de camuflagem leve. Além disso, uma vez por cena, quando for alvo de um acerto crítico, pode ignorar os efeitos críticos e considerá-lo um ataque comum. Finalmente, testes para percebê-lo ou seguir seus rastros recebem penalidade de –1d20.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Mordidas', detalhe: 'Corpo a corpo x2', teste: '3d20+10', dano: '1d8+5 corte + 1d8 Sangue' },
      { tipo: 'Padrão', nome: 'Agredir — Garras', detalhe: 'Corpo a corpo x2', teste: '3d20+10', dano: '1d6+5 corte' },
      { tipo: 'Movimento', nome: 'Pulo do Felino', descricao: 'O felino-devorado pula na direção de um alvo em alcance curto. Caso faça uma ação de agredir com mordidas ou garras no mesmo turno, causa +1d8 pontos de dano adicional. Se o alvo estiver desprevenido, esta habilidade pode ser usada como ação livre uma vez por rodada.' },
      { tipo: 'Padrão', nome: 'Chicotada Perfurante', descricao: 'O felino-devorado usa sua cauda afiada para perfurar e puxar um ser em alcance curto. O alvo sofre 4d8 pontos de dano de Sangue, fica caído e é movido para um espaço desocupado dentro de alcance curto a escolha do felino-devorado (Reflexos DT 20 reduz o dano à metade e evita condição e movimento).' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 31 },
  },
  {
    id: 'as02-felino-infernal',
    nome: 'Felino-infernal',
    vd: 120,
    categoria: 'Animal',
    descritores: ['Sangue'],
    tamanho: 'Grande',
    flavorText: 'A forma mais aterrorizante do felino-devorado: maior, mais forte, com a cauda alongada e as duas bocas dentadas abertas como uma flor diabólica de ossos pontiagudos.',
    presencaPerturbadora: { dt: 23, dano: '4d6 mental', nex: 50 },
    sentidos: { percepcao: '2d20+10', iniciativa: '4d20+10' },
    defesa: 28,
    testes: { fortitude: '3d20+10', reflexos: '4d20+10', vontade: '2d20+5' },
    pv: 230, pvMachucado: 125,
    resistencias: ['Balístico, impacto e perfuração 10', 'Sangue 20'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 4, for: 2, int: 0, pre: 2, vig: 3 },
    deslocamento: '12m | 8',
    habilidades: [
      { nome: 'Camuflagem Perversa', descricao: 'Assim como outros predadores da natureza, o felino-infernal molda seu corpo com características que dificultam sua caça e compreensão, como olhos falsos, crânios expostos em locais impossíveis e patas invertidas. Em termos de regras, o felino-infernal está sempre sob efeito de camuflagem leve. Além disso, uma vez por cena, quando for alvo de um acerto crítico, pode ignorar os efeitos críticos e considerá-lo um ataque comum. Finalmente, testes para percebê-lo ou seguir seus rastros recebem penalidade de –2d20.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Mordidas', detalhe: 'Corpo a corpo x2', teste: '4d20+10', dano: '2d8+5 corte + 2d8 Sangue' },
      { tipo: 'Padrão', nome: 'Agredir — Garras', detalhe: 'Corpo a corpo x2', teste: '4d20+10', dano: '2d6+5 corte' },
      { tipo: 'Movimento', nome: 'Pulo do Felino', descricao: 'O felino-infernal pula na direção de um alvo em alcance curto. Caso faça uma ação de agredir com mordidas ou garras no mesmo turno, causa +2d8 pontos de dano adicional. Se o alvo estiver desprevenido, esta habilidade pode ser usada como ação livre uma vez por rodada.' },
      { tipo: 'Padrão', nome: 'Boca da Loucura', descricao: 'O felino-infernal tenta envolver a cabeça de um ser adjacente com sua própria cabeça dentada. O alvo faz um teste de Reflexos (DT 23). Se falhar, fica agarrado e sofre 4d6 pontos de dano de Sangue e 4d6 pontos de dano mental. Enquanto permanecer agarrado, o alvo sofre o dano novamente no início dos turnos do felino-infernal supremo. Para se soltar, precisa gastar uma ação e passar em um teste de Acrobacia, Atletismo ou Luta (DT 23). Enquanto estiver agarrando um ser, o felino-infernal não pode usar suas mordidas.' },
      { tipo: 'Padrão', nome: 'Chicotada Perfurante', descricao: 'O felino-infernal usa sua cauda afiada para perfurar e puxar um ser em alcance curto. O alvo sofre 6d8 pontos de dano de Sangue, fica caído, sangrando e é movido para um espaço desocupado dentro de alcance curto a escolha do felino-infernal (Reflexos DT 23 reduz o dano à metade e evita condições e movimento).' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 32 },
  },
];
