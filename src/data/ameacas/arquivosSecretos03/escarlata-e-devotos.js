// Escarlata e os Devotos — Arquivos Secretos 03 (arco Hexatombe), fichas de Escarlata
// (a vilã principal desta seção do livro) e de cinco de suas vítimas/devotos dominados
// por ela através de rituais de Sangue: Ana, Argano, Chispa, Torvo e Miasma.
//
// Texto verbatim do livro "Arquivos Secretos 03". Nada foi resumido, traduzido ou
// inventado nas regras/ações; a "flavorText" é uma síntese curta (1 frase) da biografia
// em prosa de cada personagem (não transcrita aqui — só as fichas de combate importam
// para o compêndio).
//
// Nota sobre o glifo de dado: o livro usa um símbolo "O" para representar 1d20 em pools
// de dados (ex.: "3O+10" = 3d20+10; um "O" solto sem número na frente = 1d20). Todos os
// valores abaixo já foram convertidos para a notação "NdX+B" padrão do restante do
// compêndio.
//
// GAP: nas linhas de SENTIDOS/TESTES de Argano (p.51), o livro imprime "Percepção –2O"
// e "Vontade –2O" — um pool NEGATIVO de 2d20 nos seus próprios testes de Percepção e
// Vontade, algo incomum para uma característica de ficha (diferente de uma penalidade
// pontual de uma habilidade, como o "–1d20" da Motor Frágil de Chispa). Não há como saber
// se é uma decisão de design deliberada (Argano é lento/alienado, mergulhado na fantasia
// do videogame) ou um erro de diagramação do livro; transcrito literalmente como '-2d20',
// sem "consertar".
//
// Todas as fichas são "PESSOA" (não têm Presença Perturbadora nem NEX), mesmo tendo
// resistências/vulnerabilidade e (Ana e Escarlata) rituais de Sangue — segue a mesma
// convenção dos Transtornados de Arquivos Secretos 01. "descritores" só lista os
// elementos de rituais explicitamente marcados na ficha (ex.: "SANGUE 2"); não foi
// inferido a partir do tema/flavor de cada personagem.
//
// Torvo e Miasma não têm linha PERÍCIAS impressa na ficha — campo omitido, não inventado.
// Miasma não tem linhas RESISTÊNCIAS/VULNERABILIDADE impressas — campos omitidos.

export const AMEACAS_AS03_ESCARLATA = [
  {
    id: 'as03-escarlata',
    nome: 'Escarlata',
    vd: 120,
    descritores: ['Sangue'],
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'A dançarina sedutora que domina o Hexatombe desta campanha — nome verdadeiro Camila Perez —, submetendo vítimas com rituais de Sangue, armadura e máscaras vivas até torná-las devotos fanaticamente apaixonados por ela.',
    sentidos: { percepcao: '4d20+10', iniciativa: '3d20+10' },
    defesa: 28,
    testes: { fortitude: '2d20+5', reflexos: '3d20+5', vontade: '4d20+10' },
    pv: 100, pvMachucado: 50,
    resistencias: ['Balístico', 'Impacto', 'Perfuração 5', 'Sangue 10'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 3, for: 2, int: 3, pre: 4, vig: 2 },
    pericias: [
      { nome: 'Atletismo', dados: 2, bonus: 5 },
      { nome: 'Enganação', dados: 4, bonus: 10 },
      { nome: 'Ocultismo', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Dar o Fora', descricao: 'Um ser que tenha se envolvido com Escarlata (veja a habilidade Sedução) pode tentar terminar com ela. Se fizer isso, deve fazer um teste de Vontade (DT 23 + a penalidade de 1d8 ou 2d8, como pela habilidade Dominação). Passou no teste: os efeitos da habilidade Sedução terminam — o ser perde os PE temporários, mas não é mais afetado por Dominação. Falhou: o ser não consegue se livrar dos sentimentos por Escarlata, e ainda fica na bad por ter tentado. Ele sofre 1d6 pontos de dano mental. Ele pode tentar de novo, sofrendo mais dano a cada vez que falhar.' },
      { nome: 'Rituais (DT 23)', descricao: 'Escarlata pode conjurar os rituais a seguir sem pagar seu custo de PE, até um limite de 7 PE por conjuração, usando a ação apropriada.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Rasgar com Garras', detalhe: 'Corpo a corpo x2', teste: '3d20+15', critico: 19, dano: '4d10+10 corte' },
      { tipo: 'Padrão', nome: 'Dominação', descricao: 'Escarlata dá uma ordem a um ser afetado pela habilidade Sedução. Ele deve fazer um teste de Vontade (DT 23). Se falhar, deve obedecer à ordem da melhor forma que puder. Se a ordem durar mais de uma rodada para ser cumprida, o alvo tem direito a um novo teste de resistência por rodada, com um bônus cumulativo de +1 por teste já realizado. Se passar, anula este efeito. Sempre que fizer um teste de resistência contra esta habilidade, o personagem deve rolar 1d8 (se ficou um pouco a fim dela) ou 2d8 (se ficou muito a fim) e aplicar o resultado como uma penalidade no seu teste de resistência!' },
      { tipo: 'Padrão', nome: 'Ritual — Descarnar Discente (Sangue 2)', descricao: 'Escarlata toca um ser. O alvo sofre 10d8 pontos de dano (metade corte, metade Sangue) e hemorragia (Fortitude DT 29 reduz à metade e evita hemorragia). Se sofrer hemorragia, no início de seus turnos, o ser deve fazer um teste de Fortitude (DT 23). Se falhar, sofre 4d8 pontos de dano de Sangue. Se passar, não sofre dano e, se passar em dois testes seguidos, a hemorragia é estancada.' },
      { tipo: 'Padrão', nome: 'Ritual — Flagelo de Sangue Discente (Sangue 2)', descricao: 'Escarlata toca um ser (exceto criaturas de Sangue), gravando uma marca escarificada no corpo dela enquanto profere uma ordem como "não ataque a mim ou meus aliados", "siga-me" ou "não saia desta sala". A marca dura até o fim da cena. A cada rodada que o alvo desobedecer a ordem, a marca inflige uma dor excruciante, que causa 10d6 pontos de dano de Sangue e deixa o alvo enjoado pela rodada (Fortitude DT 23 reduz o dano à metade e evita a condição). Se o alvo passar nesse teste dois turnos seguidos a marca desaparece.' },
      { tipo: 'Padrão', nome: 'Ritual — Hemofagia Discente (Sangue 2)', descricao: 'Escarlata faz um ataque com garras como parte da execução do ritual. Se acertar, além do dano das garras, ela também causa +6d6 pontos de dano de Sangue e recupera PV em quantidade igual à metade do dano total causado.' },
      { tipo: 'Padrão', nome: 'Sedução', descricao: '"Você parece forte. Talvez seja digno de vencer o Hexatombe comigo". Se Escarlata flertar com um personagem, ele deve decidir como se sente em relação a isso: Não ficou a fim dela: nenhum efeito. Ficou um pouco a fim dela: o personagem recebe +1d8 PE temporários, mas fica suscetível à habilidade Dominação. Ambos os efeitos duram até o personagem Dar o Fora em Escarlata. Ficou muito a fim dela: como acima, mas o personagem recebe +2d8 PE temporários.' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 69 },
  },
  {
    id: 'as03-ana',
    nome: 'Ana',
    vd: 100,
    descritores: ['Sangue'],
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Uma devota de Escarlata obcecadamente apaixonada, armada com maça e espada, capaz de conjurar rituais de Sangue e disposta a se vingar de quem matar sua senhora.',
    sentidos: { percepcao: '1d20+5', iniciativa: '2d20+5' },
    defesa: 27,
    testes: { fortitude: '3d20+10', reflexos: '2d20+5', vontade: '1d20+5' },
    pv: 90, pvMachucado: 45,
    resistencias: ['Balístico', 'Impacto', 'Perfuração 5', 'Sangue 10'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 2, for: 3, int: 1, pre: 1, vig: 3 },
    pericias: [
      { nome: 'Atletismo', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Fúria Apaixonada', descricao: 'Se Escarlata morrer, até o fim do combate, mas apenas uma vez por cena, Ana pode gastar uma ação padrão para fazer três ataques (dois com a maça e um com a espada) contra quem a matou. Cada ataque causa +1d10 pontos de dano do mesmo tipo.' },
      { nome: 'Paixão Servil', descricao: 'Se Ana estiver em alcance curto de Escarlata, recebe +1d6 em todos os seus testes e rolagens. Se Escarlata tiver sido atacada desde a última rodada, esse bônus aumenta para +1d10.' },
      { nome: 'Rituais (DT 20)', descricao: 'Ana pode conjurar os rituais a seguir sem pagar seu custo de PE, até um limite de 6 PE por conjuração, usando a ação apropriada.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Maça', detalhe: 'Corpo a corpo', teste: '3d20+15', critico: 'x3', dano: '6d4+10 perfuração' },
      { tipo: 'Padrão', nome: 'Agredir — Espada', detalhe: 'Corpo a corpo', teste: '3d20+15', critico: 19, dano: '4d6+10 corte' },
      { tipo: 'Padrão', nome: 'Ritual — Hemofagia (Sangue 2)', descricao: 'Ana arranca o sangue do corpo de um ser em alcance de toque através da pele dele, causando 6d6 pontos de dano de Sangue (Fortitude reduz à metade). Ela então absorve esse sangue, recuperando pontos de vida iguais à metade do dano causado.' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 47 },
  },
  {
    id: 'as03-argano',
    nome: 'Argano',
    vd: 100,
    descritores: [],
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Um devoto delirante (Zacarías) convencido de que é o vilão de videogame "Argano" de quem tomou o nome, blindado por uma armadura pesadíssima e disposto a sofrer dano no lugar de Escarlata.',
    // nota: "Percepção –2O" e "Vontade –2O" impressos assim no livro — pool negativo de
    // 2d20; ver GAP no cabeçalho do arquivo.
    sentidos: { percepcao: '-2d20', iniciativa: '1d20+5' },
    defesa: 26,
    testes: { fortitude: '4d20+10', reflexos: '1d20+5', vontade: '-2d20' },
    pv: 120, pvMachucado: 60,
    resistencias: ['Balístico', 'Impacto', 'Perfuração 5', 'Sangue 10'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 1, for: 4, int: 1, pre: 0, vig: 4 },
    pericias: [
      { nome: 'Atletismo', dados: 4, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Maça Pesada', detalhe: 'Corpo a corpo', teste: '4d20+15', critico: 'x3', dano: '4d8+20 perfuração' },
      { tipo: 'Reação', nome: 'Guardião', descricao: 'Uma vez por rodada, se Argano estiver em alcance curto da Escarlata, ele sofre um dano direcionado a ela.' },
      { tipo: 'Padrão', nome: 'Erguer Maça', descricao: 'Argano ergue sua maça acima de sua cabeça. Por si só, esta habilidade não faz nada, mas permite que ele use Golpe Arrasador.' },
      { tipo: 'Padrão', nome: 'Golpe Arrasador', descricao: 'Argano desce sua maça, golpeando um ser adjacente de cima para baixo com força devastadora. O alvo sofre 4d12+20 pontos de dano de perfuração (Fortitude DT 21 reduz à metade).' },
      { tipo: 'Completa', nome: 'Esmagar Ossos', descricao: 'Argano se move e passa por cima de um ser em alcance curto, usando o peso de sua armadura para quebrar os ossos dele. A vítima sofre 4d10+20 pontos de dano de perfuração e fica fraca por um dia (Reflexos DT 21 reduz à metade e evita condição). Argano só pode usar esta habilidade em um alvo que esteja caído ou atordoado.' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 51 },
  },
  {
    id: 'as03-chispa',
    nome: 'Chispa',
    vd: 100,
    descritores: [],
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Um devoto de Escarlata (Castel del Toro), ex-piloto de rua mexicano enlutado pela morte do irmão Germán, que luta montado num triciclo armado com espingarda e lança.',
    sentidos: { percepcao: '1d20+10', iniciativa: '3d20+5' },
    defesa: 26,
    testes: { fortitude: '1d20+5', reflexos: '3d20+10', vontade: '1d20+10' },
    pv: 90, pvMachucado: 45,
    resistencias: ['Balístico', 'Impacto', 'Perfuração 5', 'Sangue 10'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 3, for: 1, int: 4, pre: 1, vig: 1 },
    pericias: [
      { nome: 'Pilotagem', dados: 3, bonus: 10 },
      { nome: 'Tecnologia', dados: 4, bonus: 10 },
    ],
    deslocamento: '15m | 10',
    habilidades: [
      { nome: 'Motor Frágil', descricao: 'Um personagem pode tentar atacar o motor na parte de trás do triciclo de Chispa. Ataques contra o motor sofrem –1d20 (por ele ser um alvo pequeno e em constante movimento). O motor tem Defesa 26, RD 5 e 20 PV, e se for destruído, explode em uma nuvem de fumaça, causando 4d6 pontos de dano (metade perfuração e metade fogo) a Chispa. Além disso, Chispa fica imóvel, desprevenido e perde suas habilidades Acelerar e Investida com Lança. Chispa pode consertar seu motor, mas demora 1d4+1 horas para fazer isso.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Tiro de Escopeta', detalhe: 'À distância, curto', teste: '3d20+15', critico: 'x3', dano: '6d6+20 balístico' },
      { tipo: 'Reação', nome: 'Acelerar', descricao: 'Uma vez por rodada, Chispa pode acelerar seu triciclo para escapar de um ataque ou efeito. Ele recebe +5 na Defesa e em testes de resistência contra esse ataque ou efeito.' },
      { tipo: 'Padrão', nome: 'Granada Flamejante', descricao: 'Chispa atira um dispositivo explosivo em alcance curto. Todos os seres a até 3m da explosão sofrem 6d6 pontos de dano de fogo e ficam em chamas (Reflexos DT 21 reduz o dano à metade e evita a condição).' },
      { tipo: 'Completa', nome: 'Investida com Lança', descricao: 'Chispa acelera em direção a um ser em alcance médio para atravessá-lo com sua lança! O alvo pode escolher resistir ou saltar para fora: Se saltar para fora: o alvo faz um teste de Reflexos (DT 21). Se passar, consegue saltar e escapar da lança. Se falhar, não consegue saltar a tempo e é trespassado pela lança, sofrendo 6d8+20 pontos de dano de perfuração. Se resistir: o alvo pode fazer um ataque ou outra ação contra Chispa. Se fizer um ataque, resolva ele normalmente; depois do ataque é trespassado pela lança, sofrendo 6d8+20 pontos de dano de perfuração. Se fizer outra ação (por exemplo, tentar saltar para cima do triciclo de Chispa), deve fazer um teste de perícia (DT 21). Se passar, consegue o que queria; se falhar, não é rápido o bastante e, além de não conseguir, é trespassado pela lança, sofrendo 6d8+20 pontos de dano de perfuração.' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 57 },
  },
  {
    id: 'as03-torvo',
    nome: 'Torvo',
    vd: 20,
    descritores: [],
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'A forma transformada e cativa de Tadeo, arqueólogo espanhol e marido de Camila/Escarlata: praticamente um cadáver animado, mantido vivo como bateria ambulante de componentes ritualísticos para os rituais dela.',
    sentidos: { percepcao: '1d20+0', iniciativa: '1d20+0' },
    defesa: 21,
    testes: { fortitude: '2d20+5', reflexos: '1d20+0', vontade: '1d20+10' },
    pv: 30, pvMachucado: 15,
    resistencias: ['Balístico', 'Impacto', 'Perfuração 5', 'Sangue 10'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 2 },
    deslocamento: '0m | 0',
    habilidades: [
      { nome: 'Fonte de Rituais', descricao: 'Torvo é praticamente um cadáver animado, sendo usado por Escarlata como uma fonte ambulante de componentes ritualísticos. Se Torvo estiver em alcance curto de Escarlata, ela pode arrancar a vida dele sempre que causar dano com um ritual. Se Escarlata fizer isso, seu ritual causa +2d6 pontos de dano do mesmo tipo e Torvo perde 2d6 PV.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Manopla Espinhenta', detalhe: 'Corpo a corpo', teste: '1d20+10', dano: '1d6+5 perfuração' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 63 },
  },
  {
    id: 'as03-miasma',
    nome: 'Miasma',
    vd: 40,
    descritores: [],
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Um devoto-carrasco de Escarlata, armado com correntes, cujo olhar desperta uma obsessão perturbadora por ela — quem resiste a adorá-la sente o impulso incontrolável de se automutilar.',
    sentidos: { percepcao: '1d20+0', iniciativa: '2d20+5' },
    defesa: 18,
    testes: { fortitude: '2d20+5', reflexos: '2d20+0', vontade: '1d20+0' },
    pv: 30, pvMachucado: 15,
    atributos: { agi: 2, for: 2, int: 1, pre: 1, vig: 2 },
    deslocamento: '9m | 6',
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Golpe com Correntes', detalhe: 'Corpo a corpo', teste: '2d20+5', dano: '2d8+5 impacto' },
      { tipo: 'Padrão', nome: 'Despertar Obsessão', descricao: 'Miasma encara uma pessoa em alcance curto. O alvo pode desviar o olhar ou encará-lo de volta: Desviar o olhar: Miasma aproveita que o personagem desviou o olhar para dar uma correntada nele, mesmo à distância, causando 2d8+5 pontos de dano de impacto. Encarar: o alvo deve fazer um teste de Vontade (DT 25). Se passar, nada acontece. Se falhar, seu coração acelera e suas emoções são inundadas pela obsessão perturbadora por Escarlata no olhar de Miasma. Por 1 rodada, o alvo deve gastar todas as suas ações para se aproximar de Escarlata e adorá-la. Se não quiser fazer isso, terá um impulso incontrolável de se automutilar, devendo fazer um ataque contra si mesmo. Uma vez que faça esse ataque, este efeito termina.' },
    ],
    fonte: { livro: 'Arquivos Secretos 03', pagina: 73 },
  },
];
