// Os Mascarados (parte 1) — Arquivos Secretos 02, seção "Os Mascarados" (PDF pages 36-53,
// páginas impressas 36-53 do livro). Texto verbatim do PDF "Arquivos Secretos 02" (Hexatombe).
// Nada foi resumido, traduzido ou inventado nas regras/ações; a "flavorText" é uma síntese
// curta (1-2 frases) da longa biografia em prosa de cada personagem (não transcrita aqui — só
// as fichas de combate importam para o compêndio).
//
// Cada Mascarado tem DUAS fichas: a identidade "PESSOA" mundana (VD menor) e o alter-ego que
// desperta quando a "intenção assassina" da pessoa acorda (VD maior, nome próprio, mesmos
// atributos e a mesma progressão de perícias da forma-base, escaladas, mais uma habilidade
// "PODER DE INTENÇÃO"). O livro cruza as duas fichas com "(veja a ficha X, p. N)" — esse texto
// foi transcrito literalmente, cross-reference de página incluída.
//
// Trio coberto nesta parte 1 (a quarta dupla, Kemi, começa na página seguinte e fica de fora
// deste arquivo):
//   Jonas Aguiar (VD 80, p.39)      -> Mutilador Noturno (VD 140, p.40)
//   Dalmo Magno  (VD 80, p.45)      -> Colosso           (VD 140, p.46)
//   Jae-Yoon     (VD 80, p.51)      -> X                 (VD 140, p.52)
//
// Nota sobre o glifo de dado: o livro usa um símbolo "O" para representar 1d20 em pools de
// dados (ex.: "3O+10" = 3d20+10; "+O" solto dentro de uma frase = "+1d20"). Todos os valores
// abaixo já foram convertidos para a notação "NdX+B" padrão do restante do compêndio.
//
// Nota sobre os ATRIBUTOS: ao contrário de outras fichas de criatura do livro (que imprimem
// "AGI X INT Y VIG Z" / "FOR A PRE B" como texto simples), as fichas dos Mascarados usam uma
// caixa gráfica em formato de pentágono, e o extrator de PDF devolve apenas os números soltos,
// sem rótulo, intercalados com o texto da coluna vizinha. Reconstruímos a grade comparando a
// posição de cada número (1 valor logo após "DESLOCAMENTO"/"VONTADE", depois 2 valores próximos
// da lista de PERÍCIAS, depois mais 2 valores próximos da primeira habilidade) com o layout
// "AGI (topo) / FOR e INT (meio) / PRE e VIG (base)" confirmado em outras páginas do mesmo PDF
// com rótulos visíveis, e conferimos a leitura batendo os números da forma-base contra os da
// forma transformada de cada personagem (que devem ser idênticos, já que a transformação não
// altera atributos) — em todos os três pares os cinco números batem exatamente, o que confirma
// o mapeamento usado abaixo.
//
// "Predador Perfeito" (habilidade do Mutilador Noturno, p.40): o texto extraído mostra
// "PREDADOR PERFEITO O" (a letra/glifo "O" aparece colada ao fim do nome, sem operador antes
// dela e sem nenhum tipo de ação — PADRÃO/LIVRE/etc. — precedendo o título, ao contrário de
// todas as outras habilidades da ficha). Não há como saber com segurança o que esse "O" solto
// representa (ruído de diagramação? um ícone de ação recortado?), então ele foi OMITIDO da
// transcrição abaixo em vez de adivinhado — o efeito da habilidade ("Mutilador pode fazer uma
// ação padrão adicional por rodada.") está completo e não depende desse glifo.
// GAP: glifo "O" solto após o título "PREDADOR PERFEITO" (p.40) não identificado, omitido.

export const AMEACAS_AS02_MASCARADOS_1 = [
  {
    id: 'as02-jonas-aguiar',
    nome: 'Jonas Aguiar',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Um policial de Inquisidor do Vale criado desde criança por um casal de assassinos disfarçados de pais adotivos, treinado a distinguir os "puros" dos "impuros" até se tornar ele mesmo um caçador implacável — e matar a própria mãe adotiva em nome da "verdadeira justiça".',
    sentidos: { percepcao: '1d20+5', iniciativa: '2d20+5' },
    defesa: 21,
    testes: { fortitude: '2d20+5', reflexos: '2d20+5', vontade: '1d20+5' },
    pv: 120, pvMachucado: 60,
    atributos: { agi: 2, for: 3, int: 1, pre: 2, vig: 2 },
    pericias: [
      { nome: 'Adestramento', dados: 2, bonus: 5 },
      { nome: 'Atletismo', dados: 3, bonus: 10 },
      { nome: 'Crime', dados: 2, bonus: 5 },
      { nome: 'Enganação', dados: 2, bonus: 5 },
      { nome: 'Furtividade', dados: 2, bonus: 5 },
      { nome: 'Investigação', dados: 1, bonus: 5 },
      { nome: 'Pilotagem', dados: 2, bonus: 5 },
      { nome: 'Sobrevivência', dados: 1, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Machado', detalhe: 'Corpo a corpo x2', teste: '3d20+10', critico: 'x3', dano: '1d8+10 corte + 1d8 Sangue (multiplica em caso de crítico) e fica sangrando' },
      { tipo: 'Padrão', nome: 'Agredir — Revólver', detalhe: 'À distância x2, curto', teste: '2d20+10', critico: '19/x3', dano: '2d6+10 balístico' },
      { tipo: 'Padrão', nome: 'Intenção Assassina', descricao: 'Jonas desperta sua intenção assassina (veja a ficha Mutilador Noturno, p. 40).' },
      { tipo: 'Padrão', nome: 'Predador de Sangue', descricao: 'Jonas memoriza o odor de uma vítima, recebendo +1d20 em testes para rastreá-la, percebê-la e atacá-la. Ele precisa de uma fonte do odor da vítima (como um pedaço rasgado da roupa) para usar este poder e só pode memorizar uma vítima por vez.' },
      { tipo: 'Reação', nome: 'Revidar', descricao: 'Uma vez por rodada, quando um ataque contra Jonas erra, ele pode fazer um ataque corpo a corpo contra o atacante.' },
      { tipo: 'Livre', nome: 'Golpe Cruel', descricao: 'Uma vez por rodada, ao atacar, Jonas pode aplicar um golpe cruel para receber +5 no teste de ataque e na rolagem de dano.' },
      { tipo: 'Reação', nome: 'Poder de Intenção', descricao: 'Quando Jonas for ferido três vezes, (cada ferimento precisa causar pelo menos 5 pontos de dano), ele pode ativar este poder para receber RD 25. Entretanto, enquanto este poder estiver ativo, Jonas perde 5 PV no início de seus turnos.' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 39 },
  },
  {
    id: 'as02-mutilador-noturno',
    nome: 'Mutilador Noturno',
    vd: 140,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'A intenção assassina que consome Jonas Aguiar quando ele mata: uma versão mais violenta e brutal do policial, com machado e revólver, que precisa derramar sangue antes do fim da cena ou volta a adormecer.',
    sentidos: { percepcao: '1d20+10', iniciativa: '2d20+10' },
    defesa: 29,
    testes: { fortitude: '2d20+10', reflexos: '2d20+10', vontade: '1d20+10' },
    pv: 260, pvMachucado: 130,
    atributos: { agi: 2, for: 3, int: 1, pre: 2, vig: 2 },
    pericias: [
      { nome: 'Adestramento', dados: 2, bonus: 10 },
      { nome: 'Atletismo', dados: 3, bonus: 15 },
      { nome: 'Crime', dados: 2, bonus: 10 },
      { nome: 'Enganação', dados: 2, bonus: 10 },
      { nome: 'Furtividade', dados: 2, bonus: 10 },
      { nome: 'Investigação', dados: 1, bonus: 10 },
      { nome: 'Pilotagem', dados: 2, bonus: 10 },
      { nome: 'Sobrevivência', dados: 1, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Predador Perfeito', descricao: 'Mutilador pode fazer uma ação padrão adicional por rodada.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Machado', detalhe: 'Corpo a corpo x2', teste: '3d20+15', critico: 'x3', dano: '1d8+20 corte + 2d8 Sangue (multiplica em caso de crítico) e fica sangrando' },
      { tipo: 'Padrão', nome: 'Agredir — Revólver', detalhe: 'À distância x2, curto', teste: '2d20+15', critico: '19/x3', dano: '3d6+20 balístico' },
      { tipo: 'Padrão', nome: 'Intenção Assassina', descricao: 'O Mutilador adormece sua intenção assassina (veja a ficha Jonas Aguiar, p. 39) e não pode usá-la novamente até dormir.' },
      { tipo: 'Padrão', nome: 'Predador Sanguinário', descricao: 'O Mutilador memoriza o odor de uma vítima, recebendo +1d20 em testes para rastreá-la, percebê-la e atacá-la. Ele precisa de uma fonte do odor da vítima (como um pedaço rasgado da roupa) para usar este poder e só pode memorizar uma vítima por vez.' },
      { tipo: 'Reação', nome: 'Revidar Violento', descricao: 'Duas vezes por rodada, quando um ataque corpo a corpo contra o Mutilador erra, ele pode fazer um ataque corpo a corpo contra o atacante.' },
      { tipo: 'Livre', nome: 'Golpe Mutilador', descricao: 'Uma vez por rodada, ao atacar, o Mutilador pode aplicar um golpe cruel para receber +5 no teste de ataque e +10 na rolagem de dano.' },
      { tipo: 'Reação', nome: 'Poder de Intenção', descricao: 'Quando Jonas for ferido três vezes, (cada ferimento precisa causar pelo menos 5 pontos de dano), ele pode ativar este poder para receber RD 25. Entretanto, enquanto este poder estiver ativo, Jonas perde 5 PV no início de seus turnos.' },
    ],
    notas: 'Enquanto estiver nessa forma, Jonas se torna o Mutilador Noturno, sendo consumido por sua intenção assassina. A transformação não tem limite de duração, mas se Jonas não matar uma pessoa até o fim da cena, sua intenção assassina adormece e ele não pode usá-la até dormir.',
    fonte: { livro: 'Arquivos Secretos 02', pagina: 40 },
  },
  {
    id: 'as02-dalmo-magno',
    nome: 'Dalmo Magno',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Um ex-cobrador e motorista de ônibus que recorreu a lutas clandestinas para pagar o tratamento da filha doente, e acabou viciado pela violência da arena até se perder completamente nela.',
    sentidos: { percepcao: '1d20+5', iniciativa: '1d20+5' },
    defesa: 23,
    testes: { fortitude: '3d20+10', reflexos: '1d20+5', vontade: '1d20+5' },
    pv: 140, pvMachucado: 70,
    atributos: { agi: 1, for: 4, int: 1, pre: 1, vig: 3 },
    pericias: [
      { nome: 'Atletismo', dados: 4, bonus: 10 },
      { nome: 'Intimidação', dados: 1, bonus: 10 },
      { nome: 'Pilotagem', dados: 1, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Lutador de Arena', descricao: 'Dalmo recebe +5 em testes de manobras de combate (incluindo para resistir a elas).' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pancada', detalhe: 'Corpo a corpo x2', teste: '4d20+10', dano: '2d6+10 impacto + 1d10 Energia' },
      { tipo: 'Padrão', nome: 'Intenção Assassina', descricao: 'Dalmo desperta sua intenção assassina (veja a ficha Colosso, p. 46).' },
      { tipo: 'Reação', nome: 'Corpo Fechado', descricao: 'Uma vez por rodada, quando sofre dano, Dalmo pode levantar sua guarda e receber RD 10 contra o dano sofrido.' },
      { tipo: 'Reação', nome: 'Pressão Atmosférica', descricao: 'Uma vez por rodada, quando acerta um ataque corpo a corpo em um alvo agarrado, Dalmo gera uma pressão destruidora. Ele causa +1d10 pontos de dano de Energia e o alvo fica atordoado por uma rodada (Fort DT 20 evita a condição). Um mesmo ser só pode ser atordoado por esta habilidade uma vez por cena.' },
      { tipo: 'Livre', nome: 'Golpes de Arena', descricao: 'Uma vez por rodada, quando acerta um ataque corpo a corpo, Dalmo pode fazer um ataque de pancada adicional ou uma manobra de combate contra o mesmo alvo.' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 45 },
  },
  {
    id: 'as02-colosso',
    nome: 'Colosso',
    vd: 140,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'A intenção assassina que toma conta de Dalmo Magno dentro do ringue: um lutador monstruosamente forte, equipado com elmo e manoplas amaldiçoados, que esmaga adversários sob uma pressão atmosférica devastadora.',
    sentidos: { percepcao: '1d20+10', iniciativa: '1d20+10' },
    defesa: 31,
    testes: { fortitude: '3d20+15', reflexos: '1d20+10', vontade: '1d20+10' },
    pv: 280, pvMachucado: 140,
    atributos: { agi: 1, for: 4, int: 1, pre: 1, vig: 3 },
    pericias: [
      { nome: 'Atletismo', dados: 4, bonus: 15 },
      { nome: 'Intimidação', dados: 1, bonus: 15 },
      { nome: 'Pilotagem', dados: 1, bonus: 15 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Campeão de Arena', descricao: 'Colosso recebe +10 em testes de manobras de combate (incluindo para resistir a elas).' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pancada', detalhe: 'Corpo a corpo x2', teste: '4d20+15', dano: '4d6+20 impacto' },
      { tipo: 'Padrão', nome: 'Intenção Assassina', descricao: 'Colosso adormece sua intenção assassina (veja a ficha Dalmo Magno, p. 45) e não pode usá-la novamente até dormir.' },
      { tipo: 'Reação', nome: 'Campo de Pressão', descricao: 'Uma vez por rodada, quando sofre dano, Colosso pode levantar sua guarda e receber RD 15 contra o dano sofrido.' },
      { tipo: 'Reação', nome: 'Implosão Atmosférica', descricao: 'Uma vez por rodada, quando acerta um ataque corpo a corpo em um alvo agarrado, Colosso gera uma pressão destruidora. Ele causa +1d10 pontos de dano de Energia e o alvo fica atordoado por uma rodada (Fort DT 24 evita a condição), caído e sangrando. Um mesmo ser só pode ser atordoado por esta habilidade uma vez por cena.' },
      { tipo: 'Livre', nome: 'Golpes de Jaula', descricao: 'Uma vez por rodada, quando acerta um ataque corpo a corpo, Colosso pode fazer um ataque de pancada adicional ou uma manobra de combate contra o mesmo alvo. Se Colosso acertar o ataque adicional ou a manobra de combate, além do efeito, causa 1d10 pontos de dano de impacto.' },
    ],
    notas: 'Enquanto estiver nessa forma, Dalmo se torna o Colosso, sendo consumido por sua intenção assassina. A transformação não tem limite de duração, mas se Dalmo não matar uma pessoa até o fim da cena, sua intenção assassina adormece e ele não pode usá-la até dormir.',
    fonte: { livro: 'Arquivos Secretos 02', pagina: 46 },
  },
  {
    id: 'as02-jae-yoon',
    nome: 'Jae-Yoon',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Filha isolada e sufocada por um pai magnata coreano que marcava cada pedido negado com um X vermelho, Jae explodiu numa noite de raiva e descobriu prazer em matar, tornando-se a serial killer misteriosa conhecida como X antes de ser recrutada por Aguiar para os Transtornados.',
    sentidos: { percepcao: '1d20+5', iniciativa: '3d20+10' },
    defesa: 22,
    testes: { fortitude: '1d20+5', reflexos: '3d20+10', vontade: '1d20+5' },
    pv: 100, pvMachucado: 50,
    atributos: { agi: 3, for: 2, int: 3, pre: 1, vig: 1 },
    pericias: [
      { nome: 'Acrobacia', dados: 3, bonus: 5 },
      { nome: 'Atletismo', dados: 2, bonus: 5 },
      { nome: 'Crime', dados: 3, bonus: 10 },
      { nome: 'Enganação', dados: 1, bonus: 10 },
      { nome: 'Furtividade', dados: 3, bonus: 10 },
      { nome: 'Investigação', dados: 3, bonus: 10 },
      { nome: 'Tecnologia', dados: 3, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Punhal', detalhe: 'Corpo a corpo x2', teste: '3d20+10', critico: '19/x2', dano: '2d4+10 perfuração + 1d6 Conhecimento' },
      { tipo: 'Padrão', nome: 'Intenção Assassina', descricao: 'Jae desperta sua intenção assassina (veja a ficha X, p. 52).' },
      { tipo: 'Completa', nome: 'Zona dos Sussurros', descricao: 'Jae gasta algum tempo para marcar uma área equivalente a um cômodo com vários "X". Para áreas maiores, podem ser necessários mais usos dessa habilidade. Nessa área, Jae recebe +5 em testes de ataque e não sofre penalidade por fazer testes de Furtividade após atacar ou fazer outras ações chamativas. Jae pode ter no máximo três áreas X criadas; se criar uma quarta, uma das anteriores desaparece.' },
      { tipo: 'Reação', nome: 'Esquiva Tática', descricao: 'Uma vez por rodada, quando sofre um ataque, Jae pode se esquivar, recebendo +10 na Defesa.' },
      { tipo: 'Reação', nome: 'Perito', descricao: 'Uma vez por rodada, quando faz um teste de uma perícia em que é treinado, Jae soma +1d8 no resultado do teste.' },
      { tipo: 'Livre', nome: 'Assassinato Furtivo', descricao: 'Uma vez por rodada, quando Jae atinge um alvo desprevenido ou que esteja flanqueando, ele causa +3d8 pontos de dano.' },
      { tipo: 'Livre', nome: 'Punhal X', descricao: 'Uma vez por rodada, quando ataca um alvo, Jae pode deixar o alvo desprevenido. Se causar dano, o alvo fica cego por 1 rodada. Um mesmo alvo só pode ficar cego por esta habilidade uma vez por cena.' },
      { tipo: 'Reação', nome: 'Poder de Intenção', descricao: 'Jae prova o sangue de uma pessoa adjacente que está machucada. Seus ataques causam +1d8 pontos de dano e recebem +2 na margem de ameaça. Além disso, se fizer um acerto crítico, Jae corta a boca do alvo em um "X", o silenciando, impedindo de se comunicar e utilizar qualquer poder ou ritual por 1d4 rodadas. Os efeitos duram até o fim da cena.' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 51 },
  },
  {
    id: 'as02-x',
    nome: 'X',
    vd: 140,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'A intenção assassina que Jae desperta ao matar: uma versão ainda mais letal e cruel de si mesma, que marca áreas inteiras com sussurros de X para caçar e silenciar suas vítimas.',
    sentidos: { percepcao: '1d20+10', iniciativa: '3d20+15' },
    defesa: 30,
    testes: { fortitude: '1d20+10', reflexos: '3d20+15', vontade: '1d20+10' },
    pv: 200, pvMachucado: 100,
    atributos: { agi: 3, for: 2, int: 3, pre: 1, vig: 1 },
    pericias: [
      { nome: 'Acrobacia', dados: 3, bonus: 10 },
      { nome: 'Atletismo', dados: 2, bonus: 10 },
      { nome: 'Crime', dados: 3, bonus: 15 },
      { nome: 'Enganação', dados: 1, bonus: 15 },
      { nome: 'Furtividade', dados: 3, bonus: 15 },
      { nome: 'Investigação', dados: 3, bonus: 15 },
      { nome: 'Tecnologia', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Punhal', detalhe: 'Corpo a corpo x2', teste: '3d20+15', critico: '19/x2', dano: '4d4+20 perfuração + 2d6 Conhecimento' },
      { tipo: 'Completa', nome: 'Zona das Sombras', descricao: 'X gasta algum tempo para marcar uma área equivalente a um cômodo com vários "X". Para áreas maiores, podem ser necessários mais usos dessa habilidade. Nessa área, X recebe +5 em testes de ataque e não sofre penalidade por fazer testes de Furtividade após atacar ou fazer outras ações chamativas. X pode ter no máximo três áreas "X" criadas; se criar uma quarta, uma das anteriores desaparece. Além disso, se X usar a habilidade Assassinato Cruel, pode rolar novamente quaisquer resultados 7 ou 8 nos dados de dano e somar seus resultados ao dano final.' },
      { tipo: 'Reação', nome: 'Analítico', descricao: 'Uma vez por rodada, quando faz um teste de uma perícia em que é treinado, X soma +1d12 no resultado do teste.' },
      { tipo: 'Reação', nome: 'Esquiva Sombria', descricao: 'Duas vezes por rodada, quando sofre um ataque, X pode se esquivar, recebendo +10 na Defesa.' },
      { tipo: 'Livre', nome: 'Assassinato Cruel', descricao: 'Uma vez por rodada, quando X atinge um alvo desprevenido ou que esteja flanqueando, ele causa +6d8 pontos de dano.' },
      { tipo: 'Livre', nome: 'Punhal X', descricao: 'Uma vez por rodada, quando ataca um alvo, X pode deixar o alvo desprevenido. Se causar dano, o alvo fica cego por 2 rodadas. Um mesmo alvo só pode ficar cego por esta habilidade uma vez por cena.' },
      { tipo: 'Padrão', nome: 'Intenção Assassina', descricao: 'X adormece sua intenção assassina (veja a ficha Jae-Yoon, p. 51) e não pode usá-la novamente até dormir.' },
      { tipo: 'Reação', nome: 'Poder de Intenção', descricao: 'X prova o sangue de uma pessoa adjacente que está machucada. Seus ataques causam +1d8 pontos de dano e recebem +2 na margem de ameaça. Além disso, se fizer um acerto crítico, X corta a boca do alvo em um "X", o silenciando, impedindo de se comunicar e utilizar qualquer poder ou ritual por 1d4 rodadas. Os efeitos duram até o fim da cena.' },
    ],
    notas: 'Enquanto estiver nessa forma, Jae se torna X, sendo consumido por sua intenção assassina. A transformação não tem limite de duração, mas se Jae não matar uma pessoa até o fim da cena, sua intenção assassina adormece e não pode ser usada até Jae dormir.',
    fonte: { livro: 'Arquivos Secretos 02', pagina: 52 },
  },
];
