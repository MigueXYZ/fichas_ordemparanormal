// Arquivos Secretos 07 — pacote temático "Vampyrus". Texto verbatim do PDF
// "Arquivos-Secretos-07-v1.0.pdf".
//
// Mapeamento do livro (confirmado pelo SUMÁRIO, p.3, e por varrimento de páginas):
// duas secções têm fichas de ameaça. "Mural dos Agentes" (p.40-45) — 6 fichas de
// "PESSOA": Raziel e a sua forma desperta O Verdadeiro Raziel, Alvira, Sabara,
// Velisar e Zéfero (o "espécime"/cão de Velisar). "Terribilis Fides" (p.64-73) — 3
// criaturas paranormais: Incinerado, Stryzga e o Enigma de Medo Apóstata. O resto do
// livro (p.46+: "Regulae Obscurae", regras de personagem — origens, poderes,
// rituais de vampirismo) é conteúdo jogável, não ficha de ameaça, e foi excluído.
//
// Nota sobre o glifo de dado: "O" = 1d20 em pools (ex.: "3O+10" = 3d20+10; "2O"
// solto = 2d20+0). O Incinerado tem "Percepção –2O" e "Vontade –2O" impressos —
// pools NEGATIVOS de característica — transcritos literalmente como '-2d20', na
// mesma situação já documentada para Argano em Arquivos Secretos 03.
//
// Nota sobre reordenação de colunas (Incinerado, p.64-65): tal como aconteceu com o
// Experimento Ssabáka em AS06, a extração por ordem de stream devolveu as ações da
// criatura (Instabilidade Ígnea, Agonia Incandescente) ANTES do cabeçalho/stat
// block dela, por causa do layout de duas colunas da página. Reconstruído sem
// ambiguidade — as ações e o stat block partilham a mesma página e claramente
// pertencem à mesma ficha "Incinerado".
//
// Nota sobre Alvira (p.42): a ação "Ritual — Vampirismo (Sangue 2)" remete para
// "Consulte-o na página @@" — o PRÓPRIO livro imprime "@@" em vez do número real da
// página (erro de diagramação/publicação não corrigido pela editora). Transcrito
// literalmente, sem inventar um número de página.
//
// Nota sobre Zéfero (p.45): o livro imprime "DESLOCAMENTO 12m | 8q Escalada 12m |
// 8q" — o caractere solto "q" a seguir a cada valor de deslocamento é, com quase
// certeza, um glifo decorativo (ícone de "quadrados") que a extração devolveu como
// texto solto, e não um valor ou unidade de jogo. Removido do campo `deslocamento`
// por não ser conteúdo de regra (mantém-se o valor numérico e a unidade "m | X"
// exatamente como em todas as outras fichas do compêndio).
//
// Nota sobre Apóstata (p.70-73, secção "ENIGMA DE MEDO"): esta ficha usa o mesmo
// padrão já estabelecido para os bosses únicos do Livro Base (Anfitrião, VD413, e
// Degolificada, VD320) — um "chefe" com VD escalável (80→160→240→320) através de 3
// "Ritos" que alteram Presença Perturbadora/Defesa/PV/bónus, em vez de fichas
// separadas inventadas por estágio. A entrada abaixo usa as estatísticas da forma
// BASE (VD 80, antes de qualquer Rito), e a escalada de cada Rito está transcrita
// integralmente dentro da habilidade "Ritus (mecânica especial)", tal como a
// "Metamorfose da Degolificada (mecânica especial)" no Livro Base. O campo
// `enigmaDoMedo` usa o texto da secção "ENIGMA DE MEDO" impressa no fim da ficha
// (p.73), seguindo a mesma convenção de schema do Livro Base.

export const AMEACAS_AS07_VAMPYRUS = [
  {
    id: 'as07-raziel',
    nome: 'Raziel',
    vd: 120,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: [],
    sentidos: { percepcao: '2d20+5', iniciativa: '4d20+10', extra: 'Faro, Percepção às cegas' },
    defesa: 28,
    testes: { fortitude: '3d20+10', reflexos: '4d20+10', vontade: '2d20+5' },
    pv: 240,
    pvMachucado: 120,
    resistencias: ['Balístico, impacto e perfuração 10', 'Sangue 20'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 4, for: 3, int: 3, pre: 2, vig: 3 },
    pericias: [
      { nome: 'Atletismo', dados: 3, bonus: 10 },
      { nome: 'Intimidação', dados: 2, bonus: 10 },
      { nome: 'Ocultismo', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Ignorar Dor', descricao: 'Para efeitos dramáticos, e de intimidação, nesta forma, Raziel demonstra elegância, ignorando até mesmo dor. Isso faz parecer que ele é imune a qualquer tipo de dano, mas passar um teste de Intuição ou Percepção (DT 30) revela que essa imunidade não é real.' },
      { nome: 'Monstruosidade', descricao: 'Raziel já passou por incontáveis rituais para manter seus poderes e longevidade, sendo quase uma criatura do Outro Lado. Raziel recebe faro, percepção às cegas, resistência a balístico, impacto e perfuração 10, e Sangue 20, mas sofre vulnerabilidade a Morte (já contabilizado).' },
      { nome: 'Vingança', descricao: 'Toda vez que um familiar de Raziel é morto, ele se sentirá impelido a rastrear e matar não apenas o alvo, mas a maioria das pessoas relacionadas a ele, ou as que estiverem no mesmo local que o alvo. Se isso acontecer na frente de Raziel, ele entra em Fúria Sanguinária.' },
      { nome: 'Fúria Sanguinária', descricao: 'Se Raziel ficar machucado ou enfurecido, à critério do mestre, ele muda de forma. Use a ficha O Verdadeiro Raziel.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Garras', detalhe: 'Corpo a corpo x2', teste: '4d20+15', critico: 18, dano: '2d10+20 perfuração' },
      { tipo: 'Reação', nome: 'Revidar e Estripar', descricao: 'Uma vez por rodada, quando sofre um ataque corpo a corpo, Raziel revida com um ataque. Se fizer isso, ele perde suas RD por 1 rodada, por deixar de se importar com a dor.' },
      { tipo: 'Livre', nome: 'Abraço Sanguinolento', descricao: 'Se Raziel acertar um ataque com garras, pode tentar agarrar o alvo (teste 4d20+15). Uma vez por rodada, como ação livre, Raziel pode morder um ser agarrado, causando 6d6 pontos de dano de Sangue (Fortitude DT 23 reduz à metade) e recuperando PV iguais à metade do dano causado.' },
      { tipo: 'Movimento', nome: 'Perseguir', descricao: 'Uma vez por rodada, Raziel percorre o dobro do seu deslocamento na direção de um alvo que esteja querendo matar.' },
      { tipo: 'Padrão', nome: 'Endurecer Sangue', descricao: 'Raziel bombeia sangue para seus músculos e recebe RD 5 até o fim da cena.' },
      { tipo: 'Padrão', nome: 'Fazer Sangrar', descricao: 'Raziel obriga o sangue de 1 ser em alcance curto a abandonar o corpo. O alvo sofre 6d6 pontos de dano de Sangue e fica sangrando (Fortitude DT 23 reduz à metade e evita condição). O sangramento desta habilidade causa a perda de 2d6 PV (em vez de 1d6).' },
      { tipo: 'Padrão', nome: 'Maldição Sanguínea', descricao: 'Raziel manipula o sangue de 1 ser em alcance curto. O alvo sofre –1d20 em todos os testes até o fim da cena (Fortitude DT 23 reduz para 1 rodada).' },
    ],
    fonte: { livro: 'Arquivos Secretos 07', pagina: 40 },
  },
  {
    id: 'as07-o-verdadeiro-raziel',
    nome: 'O Verdadeiro Raziel',
    vd: 200,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: [],
    flavorText: 'A forma desperta de Raziel, assumida quando ele fica machucado ou enfurecido — perde a fachada de elegância e passa a agir por instinto predatório puro, especialmente para proteger Alvira ou finalizar quem estiver mais fraco na cena.',
    sentidos: { percepcao: '2d20+10', iniciativa: '4d20+15', extra: 'Faro, Percepção às cegas' },
    defesa: 38,
    testes: { fortitude: '3d20+15', reflexos: '4d20+15', vontade: '2d20+10' },
    pv: 400,
    pvMachucado: 200,
    resistencias: ['Balístico, impacto e perfuração 10', 'Sangue 20'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 4, for: 3, int: 3, pre: 2, vig: 3 },
    pericias: [
      { nome: 'Atletismo', dados: 3, bonus: 15 },
      { nome: 'Intimidação', dados: 2, bonus: 15 },
      { nome: 'Ocultismo', dados: 3, bonus: 15 },
    ],
    deslocamento: '12m | 8',
    habilidades: [
      { nome: 'Monstruosidade', descricao: 'Raziel já passou por incontáveis rituais para manter seus poderes e longevidade, sendo quase uma criatura do Outro Lado. Raziel recebe faro, percepção às cegas, resistência a balístico, impacto e perfuração 10, e Sangue 20, mas sofre vulnerabilidade a Morte (já contabilizado).' },
      { nome: 'Fúria Sanguinária', descricao: 'Raziel assume essa forma quando está machucado ou enfurecido, à critério do mestre. Se estiver com menos de 200 PV quando assume essa forma, fica imediatamente com 200 PV.' },
      { nome: 'Sede Incontrolável', descricao: 'Se Alvira estiver sendo ameaçada, Raziel gasta todas suas ações para matar quem a ameaça. Caso contrário, ele focará suas ações contra o alvo com menos PV na cena, com o objetivo de finalizá-lo.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Garras', detalhe: 'Corpo a corpo x2', teste: '4d20+25', critico: 18, dano: '5d10+30 perfuração' },
      { tipo: 'Reação', nome: 'Revidar e Estripar', descricao: 'Uma vez por rodada, quando sofre um ataque corpo a corpo, Raziel revida com um ataque. Se fizer isso, ele perde suas RD por 1 rodada, por deixar de se importar com a dor.' },
      { tipo: 'Livre', nome: 'Abraço Sanguinolento', descricao: 'Se Raziel acertar um ataque com garras, pode tentar agarrar o alvo (teste 4d20+15). Uma vez por rodada, como ação livre, Raziel pode morder um ser agarrado, causando 10d6 pontos de dano de Sangue (Fortitude DT 29 reduz à metade) e recuperando PV iguais à metade do dano causado.' },
      { tipo: 'Movimento', nome: 'Perseguir', descricao: 'Uma vez por rodada, Raziel percorre o dobro do seu deslocamento na direção de um alvo que esteja querendo matar.' },
      { tipo: 'Padrão', nome: 'Bote Retalhador', descricao: 'Raziel salta sobre 1 ser em até 3m para retalhar seu corpo. O alvo pode escolher entre: Atacar (o alvo aproveita a oportunidade para fazer um único ataque, independentemente de itens ou habilidades, como reação, contra Raziel; se errar, sofre 10d10+30 pontos de dano de perfuração, fica caído e sangrando; se acertar, reduz o dano à metade e evita as condições) ou Escapar (o alvo faz um teste de Reflexos DT 29; se falhar, sofre 10d10+30 pontos de dano de perfuração, fica caído e sangrando; se passar, reduz o dano à metade e evita as condições).' },
    ],
    fonte: { livro: 'Arquivos Secretos 07', pagina: 41 },
  },
  {
    id: 'as07-alvira',
    nome: 'Alvira',
    vd: 120,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: ['Sangue'],
    sentidos: { percepcao: '4d20+10', iniciativa: '3d20+10', extra: 'Faro, Percepção às cegas' },
    defesa: 26,
    testes: { fortitude: '2d20+5', reflexos: '3d20+10', vontade: '4d20+10' },
    pv: 210,
    pvMachucado: 105,
    resistencias: ['Balístico, impacto e perfuração 10', 'Sangue 20'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 3, for: 1, int: 2, pre: 4, vig: 2 },
    pericias: [
      { nome: 'Enganação', dados: 4, bonus: 10 },
      { nome: 'Medicina', dados: 2, bonus: 10 },
      { nome: 'Ocultismo', dados: 2, bonus: 10 },
      { nome: 'Religião', dados: 4, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Monstruosidade', descricao: 'Alvira já passou por incontáveis rituais para manter seus poderes e longevidade, sendo quase uma criatura do Outro Lado. Alvira recebe faro, percepção às cegas, resistência a balístico, impacto e perfuração 10, e Sangue 20, mas sofre vulnerabilidade a Morte (já contabilizado).' },
      { nome: 'Madre Superior', descricao: 'Qualquer aliado adjacente pode gastar uma ação de movimento para sugar o sangue de Alvira, causando-a 3d8+3 pontos de dano. Se o fizer, o aliado se cura na mesma quantidade, ou a metade do valor quando ela está machucada. Se Alvira estiver morrendo, essa habilidade não pode ser usada.' },
      { nome: 'Rituais (DT 23)', descricao: 'Alvira pode conjurar o ritual a seguir sem pagar seu custo de PE, até um limite de 10 PE por conjuração, usando a ação apropriada.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Cruz de Sangue', detalhe: 'Corpo a corpo x2', teste: '1d20+15', dano: '2d12+10 corte' },
      { tipo: 'Movimento', nome: 'Clamor do Sangue Divino', descricao: 'Uma vez por cena, todos os seres em alcance longo, à escolha de Alvira, recebem +1d20 em testes de Agilidade, Força ou Vigor até o fim da cena.' },
      { tipo: 'Padrão', nome: 'Bolsa de Sangue', descricao: 'Alvira aumenta a capacidade sanguínea de 1 ser em alcance longo. O alvo recebe 3d8+3 PV. Todos os PV que ultrapassarem os PV máximos do alvo se tornam PV temporários.' },
      { tipo: 'Padrão', nome: 'Sussurro Horripilante', descricao: 'Alvira faz sua voz ressoar por alcance longo, causando os mesmos efeitos de uma presença perturbadora (DT 23, 4d6 mental, NEX 50% é imune).' },
      // O livro remete para "Consulte-o na página @@" — o próprio PDF imprime "@@"
      // em vez do número da página, sem que a editora tenha corrigido isso.
      // Transcrito literalmente, sem inventar o número real.
      { tipo: 'Completa', nome: 'Ritual — Vampirismo (Sangue 2)', descricao: 'Este é um ritual complexo e com diversas escolhas. Consulte-o na página @@.' },
      { tipo: 'Completa', nome: 'Titereira de Sangue', descricao: 'Alvira pode criar cordas de Sangue que manipulam o corpo de 1 ser em alcance longo até o fim da cena. O alvo deve ter bebido ou sido curado pelo sangue dela. Em seu turno, o alvo deve gastar todas as suas ações para fazer o que ela ordenar (Fortitude DT 23 evita). O alvo pode repetir o teste para se libertar do efeito no início de seus turnos.' },
      { tipo: 'Completa', nome: 'Transferir Sangue', descricao: 'Uma vez por rodada, Alvira regurgita seu sangue em 1 ser adjacente. Ela sofre 3d8+3 pontos de dano, curando o alvo na mesma quantidade, ou na metade do valor quando ela está machucada. O alvo pode evitar a cura com um teste de Reflexos (DT 23). Se Alvira estiver morrendo, essa ação não pode ser usada.' },
    ],
    fonte: { livro: 'Arquivos Secretos 07', pagina: 42 },
  },
  {
    id: 'as07-sabara',
    nome: 'Sabara',
    vd: 100,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: [],
    sentidos: { percepcao: '2d20+5', iniciativa: '3d20+10', extra: 'Faro, Percepção às cegas' },
    defesa: 25,
    testes: { fortitude: '2d20+5', reflexos: '3d20+10', vontade: '2d20+0' },
    pv: 200,
    pvMachucado: 100,
    resistencias: ['Balístico, impacto e perfuração 10', 'Sangue 20'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 3, for: 3, int: 2, pre: 2, vig: 2 },
    pericias: [
      { nome: 'Acrobacia', dados: 3, bonus: 10 },
      { nome: 'Atletismo', dados: 3, bonus: 10 },
      { nome: 'Sobrevivência', dados: 2, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Monstruosidade', descricao: 'Sabara já passou por incontáveis rituais para manter seus poderes e longevidade, sendo quase uma criatura do Outro Lado. Sabara recebe faro, percepção às cegas, resistência a balístico, impacto e perfuração 10, e Sangue 20, mas sofre vulnerabilidade a Morte (já contabilizado).' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Espada e Adaga', detalhe: 'Corpo a corpo x2', teste: '3d20+15', critico: '18/x3', dano: '2d6+10 corte mais 2d4 Sangue' },
      { tipo: 'Padrão', nome: 'Agredir — Arremessar Faca', detalhe: 'À distância, curto, x2', teste: '3d20+15', critico: 19, dano: '4d4+10 perfuração' },
      { tipo: 'Reação', nome: 'Esquiva', descricao: 'Uma vez por rodada, quando sofre um ataque, Sabara recebe +10 na Defesa contra esse ataque.' },
      { tipo: 'Reação', nome: 'Mil Perfurações', descricao: 'Se Sabara acertar seus dois ataques de espada e adaga contra o mesmo alvo, também deixa-o sangrando (Fortitude DT 21 evita). O sangramento desta habilidade causa a perda de 2d6 PV (em vez de 1d6).' },
      { tipo: 'Reação', nome: 'Ripostar e Revidar', descricao: 'Uma vez por rodada, quando sofre um ataque corpo a corpo, Sabara pode se defender fazendo um ataque de espada e adaga contra o ataque sofrido. Se ela vencer o teste oposto, não sofre dano e causa 2d6+10 pontos de dano de corte mais 2d4 pontos de dano de Sangue ao atacante.' },
      { tipo: 'Livre', nome: 'Ringen am Schwert', descricao: 'Se Sabara acertar um ataque, pode tentar agarrar o alvo (teste 3d20+15). Uma vez por rodada, como ação livre, Sabara pode morder um ser agarrado, causando 6d6 pontos de dano de Sangue (Fortitude DT 21 reduz à metade) e recuperando PV iguais à metade do dano causado.' },
      { tipo: 'Movimento', nome: 'Perseguir', descricao: 'Uma vez por rodada, Sabara percorre o dobro do seu deslocamento na direção de um alvo que esteja querendo matar.' },
      { tipo: 'Padrão', nome: 'Dança Armada', descricao: 'Sabara gira sob seu próprio eixo, com seus braços estendidos, golpeando todos os seres adjacentes à sua escolha. Os alvos sofrem 2d6+10 pontos de dano de corte mais 2d4 pontos de dano de Sangue (Reflexos DT 21 reduz à metade).' },
      { tipo: 'Padrão', nome: 'Golpe Derrubante', descricao: 'Sabara golpeia com sua espada atrás da perna de 1 ser adjacente. O alvo sofre 2d6+10 pontos de dano de corte mais 2d4 pontos de dano de Sangue e fica caído (Reflexos DT 21 reduz à metade e evita condição). Se ela derrubar o alvo, mantém a ponta da espada perto do peito dele, podendo reagir conforme a ação da vítima em seu próximo turno: se a vítima se levanta ou faz qualquer outra ação, Sabara faz um ataque de espada e adaga contra ela como reação (o alvo pode então fazer sua ação normalmente); se a vítima tenta rolar para longe, gasta uma ação padrão e faz um teste de Iniciativa (DT 23) — se passar, consegue rolar para longe de Sabara, se falhar, não consegue e Sabara faz um ataque de espada e adaga contra ela como reação (o alvo pode então fazer as ações que ainda tiver normalmente).' },
    ],
    fonte: { livro: 'Arquivos Secretos 07', pagina: 43 },
  },
  {
    id: 'as07-velisar',
    nome: 'Velisar',
    vd: 100,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: [],
    sentidos: { percepcao: '3d20+10', iniciativa: '2d20+5', extra: 'Faro, Percepção às cegas' },
    defesa: 25,
    testes: { fortitude: '2d20+0', reflexos: '2d20+5', vontade: '3d20+10' },
    pv: 180,
    pvMachucado: 90,
    resistencias: ['Balístico, impacto e perfuração 10', 'Sangue 20'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 2, for: 1, int: 4, pre: 3, vig: 2 },
    pericias: [
      { nome: 'Artes', dados: 3, bonus: 10 },
      { nome: 'Atletismo', dados: 1, bonus: 10 },
      { nome: 'Ciências', dados: 4, bonus: 10 },
      { nome: 'Ocultismo', dados: 4, bonus: 10 },
      { nome: 'Tecnologia', dados: 4, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Monstruosidade', descricao: 'Velisar já passou por incontáveis rituais para manter seus poderes e longevidade, sendo quase uma criatura do Outro Lado. Velisar recebe faro, percepção às cegas, resistência a balístico, impacto e perfuração 10, e Sangue 20, mas sofre vulnerabilidade a Morte (já contabilizado).' },
      { nome: 'Velisar Sabe', descricao: 'Velisar percebe auras paranormais e criaturas invisíveis ou semelhante em alcance médio e percebe qualquer ameaça ou armadilha em um raio de 18m.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Garras', detalhe: 'Corpo a corpo x2', teste: '3d20+15', critico: 19, dano: '2d10+10 perfuração' },
      { tipo: 'Reação', nome: 'Esquiva', descricao: 'Uma vez por rodada, quando sofre um ataque, Velisar recebe +5 na Defesa contra esse ataque.' },
      { tipo: 'Livre', nome: 'Abraço Sanguinolento', descricao: 'Se Velisar acertar um ataque com garras, pode tentar agarrar o alvo (teste 3d20+15). Uma vez por rodada, como ação livre, Velisar pode morder um ser agarrado, causando 6d6 pontos de dano de Sangue (Fortitude DT 21 reduz à metade) e recuperando PV iguais à metade do dano causado.' },
      { tipo: 'Movimento', nome: 'Perseguir', descricao: 'Uma vez por rodada, Velisar percorre o dobro do seu deslocamento na direção de um alvo que esteja querendo matar.' },
      { tipo: 'Padrão', nome: 'Armadilha Sanguinária', descricao: 'Velisar cria uma das armadilhas paranormais a seguir em um espaço desocupado em alcance médio. A armadilha é ativada por qualquer ser que fique a 3m ou menos dela (Investigação DT 21 para encontrar; Ocultismo DT 21 para desarmar). Caixão de Sangue: 1 ser a 3m da armadilha fica agarrado, caído e enredado (Reflexos DT 21 evita); Velisar pode teletransportar o caixão de sangue com uma vítima presa para qualquer local que considere sua base. Explosão de Carne: todos os seres a 3m da armadilha sofrem 6d6 pontos de dano de perfuração e ficam sangrando (Reflexos DT 21 reduz à metade e evita condição). Gás Paralisante: todos os seres a 3m da armadilha ficam paralisados por 1d4+1 rodadas (Fortitude DT 21 muda para 1 rodada).' },
      { tipo: 'Padrão', nome: 'Comandar Experimento', descricao: 'Uma vez por rodada, Velisar comanda um de seus experimentos em alcance longo. Se o experimento cumprir o comando até o início do próximo turno de Velisar e o comando envolver um teste, o experimento recebe +1d20 no teste.' },
      { tipo: 'Padrão', nome: 'Olhar da Curiosidade Mórbida', descricao: 'Velisar encara 1 ser em alcance médio e tenta "seduzi-lo", despertando curiosidade mórbida em sua mente. O alvo deve fazer um teste de Reflexos (DT 21) para desviar o olhar ou Vontade (DT 21) para resistir a curiosidade. Se falhar, o alvo fica fascinado e, enquanto não for removido da condição (sofrer ação hostil ou ser balançado), só pode fazer ações que envolvam dar atenção e ser prestativo para com Velisar.' },
    ],
    fonte: { livro: 'Arquivos Secretos 07', pagina: 44 },
  },
  {
    id: 'as07-zefero',
    nome: 'Zéfero',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: [],
    flavorText: 'O "espécime" de Velisar: um cão que ele adotou, transformou e condicionou ao longo de um ano em Praga, até torná-lo um caçador leal e monstruoso — batizado com o nome de uma brisa da mitologia grega, por sua velocidade e leveza.',
    sentidos: { percepcao: '2d20+5', iniciativa: '2d20+10', extra: 'Faro, Percepção às cegas' },
    defesa: 23,
    testes: { fortitude: '3d20+10', reflexos: '2d20+5', vontade: '2d20+0' },
    pv: 140,
    pvMachucado: 70,
    resistencias: ['Balístico, impacto e perfuração 5', 'Sangue 10'],
    vulnerabilidades: ['Morte'],
    atributos: { agi: 2, for: 3, int: 0, pre: 2, vig: 2 },
    pericias: [
      { nome: 'Atletismo', dados: 3, bonus: 10 },
    ],
    // O livro imprime "12m | 8q  Escalada 12m | 8q" — o "q" solto após cada valor
    // é um glifo decorativo (ícone de "quadrados") capturado como texto pela
    // extração, não um valor de jogo; removido, mantendo o resto tal como impresso.
    deslocamento: '12m | 8, Escalada 12m | 8',
    habilidades: [
      { nome: 'Demônio de Coleira', descricao: 'Zéfero foi domesticado por Velisar e, em troca de carne ou sangue, faz o que ele manda. Se Velisar for morto, Zéfero pode ser domesticado por um novo dono que ofereça carne ou sangue e passe em um teste de Adestramento (DT 20).' },
      { nome: 'Fome Bestial', descricao: 'Se Velisar estiver sendo ameaçado, Zéfero gasta todas suas ações para matar quem a ameaça. Caso contrário, ele focará suas ações contra o alvo com menos PV na cena, com o objetivo de finalizá-lo.' },
      { nome: 'Monstruosidade', descricao: 'Zéfero já passou por incontáveis rituais para manter seus poderes e longevidade, sendo quase uma criatura do Outro Lado. Zéfero recebe faro, percepção às cegas, resistência a balístico, impacto e perfuração 5, e Sangue 10, mas sofre vulnerabilidade a Morte (já contabilizado).' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Garras', detalhe: 'Corpo a corpo x2', teste: '3d20+10', critico: 19, dano: '1d10+10 perfuração' },
      { tipo: 'Padrão', nome: 'Agredir — Mordida Furiosa', detalhe: 'Corpo a corpo', teste: '3d20+10', critico: 19, dano: '3d12+20 Sangue' },
      { tipo: 'Reação', nome: 'Bloqueio', descricao: 'Uma vez por rodada, quando sofre um ataque, Zéfero recebe RD 10 contra esse ataque.' },
      { tipo: 'Livre', nome: 'Agarrão Lacerador', descricao: 'Se Zéfero acertar um ataque com mordida, pode tentar agarrar o alvo (teste 3d20+10). Uma vez por rodada, como ação livre, Zéfero pode morder um ser agarrado, causando 4d6 pontos de dano de Sangue (Fortitude DT 20 reduz à metade) e recuperando PV iguais à metade do dano causado.' },
      { tipo: 'Livre', nome: 'Dilacerar', descricao: 'Se Zéfero acertar seus dois ataques com garras no mesmo alvo, dilacera-o, causando +1d10 pontos de dano de perfuração.' },
    ],
    fonte: { livro: 'Arquivos Secretos 07', pagina: 45 },
  },
  {
    id: 'as07-incinerado',
    nome: 'Incinerado',
    vd: 60,
    categoria: 'Ameaça Paranormal',
    tamanho: 'Médio',
    descritores: ['Energia', 'Sangue'],
    flavorText: 'Um cadáver consumido pelo caos e pelas chamas, formado a partir de um corpo queimado em um ambiente com a Membrana fragilizada pela Energia. A carcaça reerguida mantém as chamas que o afetaram. Incinerados aparentam estar em um estado extremo de dor e agonia, seu corpo derretendo e se transformando em ainda mais chamas até ser consumido pela sua própria existência.',
    presencaPerturbadora: { dt: 19, dano: '3d6 mental', nex: 35 },
    // O livro imprime "Percepção –2O" e "Vontade –2O" — pools negativos de
    // característica, mesma situação já documentada para Argano em AS03.
    sentidos: { percepcao: '-2d20' },
    defesa: 21,
    testes: { fortitude: '2d20+5', reflexos: '3d20+10', vontade: '-2d20' },
    pv: 100,
    pvMachucado: 50,
    imunidades: ['Fogo'],
    resistencias: ['Balístico, corte e perfuração 5', 'Sangue 10', 'Energia 20'],
    vulnerabilidades: ['Balístico, fogo e Morte'],
    atributos: { agi: 3, for: 3, int: 0, pre: 0, vig: 2 },
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Combustão Caótica', descricao: 'As chamas que sustentam o incinerado também consomem sua existência. No início do seu turno, ele perde 10 pontos de vida. Ao ficar machucado, a dor intensifica seu caos, fazendo com que ele passe a ter duas ações padrões, em vez de uma, enquanto permanecer machucado.' },
      { nome: 'Consumido pelo Caos', descricao: 'Um ser que fique com SAN 0 ou 0 PV enquanto está em chamas e em alcance curto do incinerado é imediatamente consumido pelo fogo. O ser morre instantaneamente e seu corpo é transformado em um incinerado que passa a agir na rodada seguinte.' },
      { nome: 'Natureza Incendiária', descricao: 'Movido por conveniente caos, o incinerado foca seus esforços em incendiar coisas sempre que possível. Por exemplo, ele vai destinar seus ataques de disparo de labaredas em alvos que peguem fogo ou explodam como combustíveis, explosivos e munições.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Disparo de Labaredas', detalhe: 'À distância, curto, x2', teste: '3d20+10', dano: '2d8+5 fogo e fica em chamas' },
      { tipo: 'Padrão', nome: 'Agonia Incandescente', descricao: 'O incinerado emite um berro dilacerante, fazendo sua agonia ecoar pelas chamas. O som invade a mente de pessoas em um raio de 18m a partir da criatura. Os alvos sofrem 3d6 pontos de dano mental (Vontade DT 19 reduz o dano à metade). Alvos em chamas sofrem –5 no teste de resistência.' },
      { tipo: 'Reação', nome: 'Alimentar as Chamas', descricao: 'Quando um ser sofre dano da condição em chamas enquanto está em alcance curto do incinerado, a criatura recupera uma quantidade de PV igual a metade do dano sofrido.' },
      { tipo: 'Reação', nome: 'Instabilidade Ígnea', descricao: 'Quando o incinerado ficar com 0 PV, as chamas consomem completamente seu corpo, criando uma esfera de chamas caóticas que se expande rapidamente, formando uma explosão com 6m de raio a partir do corpo do incinerado. Seres na área sofrem 5d10 pontos de dano (metade mental, metade Energia) e ficam em chamas (Reflexos DT 19 reduz o dano à metade e evita a condição).' },
    ],
    fonte: { livro: 'Arquivos Secretos 07', pagina: 65 },
  },
  {
    id: 'as07-stryzga',
    nome: 'Stryzga',
    vd: 120,
    categoria: 'Ameaça Paranormal',
    tamanho: 'Médio',
    descritores: ['Sangue', 'Morte'],
    flavorText: 'Uma ave monstruosa nascida da "segunda vida" de uma pessoa "de dois corações" que morreu de forma injusta: à noite, imita as vozes de quem já consumiu para atrair novas vítimas, movida pela lembrança e pela vingança de quem perdeu.',
    presencaPerturbadora: { dt: 23, dano: '4d6 mental', nex: 50 },
    sentidos: { percepcao: '4d20+10', iniciativa: '3d20+10', extra: 'Visão no escuro' },
    defesa: 28,
    testes: { fortitude: '2d20+5', reflexos: '3d20+10', vontade: '4d20+10' },
    pv: 240,
    pvMachucado: 120,
    resistencias: ['Balístico, impacto e perfuração 10', 'Químico e Sangue 20'],
    vulnerabilidades: ['Balístico, fogo e Morte'],
    atributos: { agi: 3, for: 2, int: 3, pre: 4, vig: 2 },
    pericias: [
      { nome: 'Acrobacia', dados: 3, bonus: 10 },
      { nome: 'Furtividade', dados: 3, bonus: 20 },
    ],
    deslocamento: '9m | 6, Escalada 12m | 8, Voo 12m | 8',
    habilidades: [
      { nome: 'Absorver Essência', descricao: 'Quando stryzga se alimenta de um alvo três vezes ou mais, ela recebe +1d20 em testes contra esse alvo.' },
      { nome: 'Dois Corações', descricao: 'Quando a stryzga mata uma pessoa, uma maldição dá início. Se a stryzga não for morta e queimada dentro de 1d4+3 dias, uma nova stryzga surgirá na sepultura mais próxima de onde a pessoa foi morta.' },
      { nome: 'Ecos de Essência', descricao: 'A stryzga tem conhecimento de pequenos pedaços do inconsciente das pessoas a qual consumiu o sangue como nomes, personalidades, trejeitos e emoções, e se guiará por esses vestígios para encontrar novas presas. Quando a stryzga enfrenta um ser relacionado com uma das pessoas das quais ela já absorveu a essência, ela recebe +1d20 em testes contra esse ser.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Mordida e Garras', detalhe: 'Corpo a corpo x2', teste: '3d20+15', dano: '4d10+10 corte' },
      { tipo: 'Livre', nome: 'Imitar Voz', descricao: 'A stryzga é capaz de imitar a voz de uma pessoa da qual já tenha se alimentado. Se estiver enfrentando um ser em alcance curto que pode ser afetado emocionalmente pela voz imitada, a stryzga usará esta ação para isso, desestruturando a psique do ser. O alvo sofre 4d6 pontos de dano mental (Vontade DT 23 reduz o dano à metade).' },
      { tipo: 'Reação', nome: 'Alimentar-se', descricao: 'Quando stryzga acertar um ataque de mordida e garras em um alvo, ela se alimenta de parte dele.' },
      { tipo: 'Reação', nome: 'Constrição', descricao: 'Se acertar um ataque de mordida e garras em um alvo Médio ou menor, a stryzga pode agarrá-la (teste 3d20+15). Se já estiver agarrando um alvo enquanto voa, a stryzga pode, uma vez por rodada, usar esta reação para constringi-lo ainda mais com sua mordida e garras. O alvo sofre 4d10+10 pontos de dano de corte (Fortitude DT 23 reduz o dano à metade). A stryzga não pode usar constrição e quebra-ossos na mesma rodada.' },
      { tipo: 'Reação', nome: 'Quebra-Ossos', descricao: 'Se acertar um ataque de mordida e garras em um alvo Médio ou menor, a stryzga pode agarrá-la (teste 3d20+15). Se já estiver agarrando um alvo enquanto voa, a stryzga pode, uma vez por rodada, usar esta reação para atirar o alvo da altura que preferir, causando-lhe dano de queda conforme a altura (OPRPG, p. 292) com um bônus de +4d6 pontos de dano extra. A stryzga não pode usar constrição e quebra-ossos na mesma rodada.' },
      { tipo: 'Reação', nome: 'Rasante Silencioso', descricao: 'Se a stryzga atinge um alvo desprevenido e ele é relacionado de alguma forma com alguma pessoa da qual a stryzga absorveu a essência, o alvo também sofre 4d6 pontos de dano mental e fica apavorado até o fim da cena (Vontade DT 23 reduz o dano à metade e a condição para abalado) pelo susto apavorante do ataque da criatura.' },
    ],
    fonte: { livro: 'Arquivos Secretos 07', pagina: 67 },
  },
  {
    id: 'as07-apostata',
    nome: 'Apóstata',
    vd: 80,
    categoria: 'Ameaça Paranormal',
    tamanho: 'Médio',
    descritores: ['Conhecimento', 'Morte'],
    flavorText: 'Oculta por trás de uma parede rachada de ídolos de uma crença esquecida, a Apóstata subjuga fiéis a realizarem ritos em seu nome, corrompendo mentes e se aproximando de sua forma completa a cada cerimônia concluída — o Enigma de Medo desta edição.',
    presencaPerturbadora: { dt: 20, dano: '3d8 mental', nex: 40 },
    sentidos: { percepcao: '3d20+10', iniciativa: '2d20+0' },
    defesa: 23,
    testes: { fortitude: '2d20+5', reflexos: '2d20+0', vontade: '3d20+10' },
    pv: 111,
    pvMachucado: 55,
    imunidades: ['Dano e todas as condições'],
    resistencias: ['Balístico, corte, impacto e Morte 5', 'Conhecimento 20'],
    vulnerabilidades: ['Sangue'],
    atributos: { agi: 2, for: 2, int: 3, pre: 4, vig: 2 },
    deslocamento: '0m | 0',
    habilidades: [
      { nome: 'Mentem Corrumpere', descricao: 'A apóstata pode escolher que um ser que falhe no teste contra sua Presença Perturbadora não sofra dano mental. Em vez disso, sua mente é contaminada por fragmentos de uma crença impossível — uma memória de uma fé que deveria ter sido esquecida, mas passa a parecer absolutamente verdadeira. Em termos de regras, essa contaminação funciona como o primeiro estágio de uma doença (OPRPG, p. 291). Diferente de outras doenças, não há teste de resistência inicial. O avanço dos estágios está diretamente relacionado com os ritos da apóstata, e a cura só se dá com a morte da criatura. No início de cada dia, o infectado deve realizar um teste de Vontade (DT 20 + 1 por dia infectado) para resistir aos efeitos dos estágios; se falhar, é tomado por uma necessidade irresistível de permanecer próximo à apóstata, sendo incapaz de se afastar mais de 90 metros dela (e, se estiver além dessa distância, deve utilizar todos os meios para retornar ao seu alcance). A apóstata pode permitir que um infectado se afaste para atrair mais vítimas.' },
      { nome: 'Estágios da Infecção', descricao: 'Estágio I: o ser infectado passa a acreditar que sempre foi devoto de uma crença esquecida — recebe treinamento em Religião (ou +2, se já treinado). Se falhar no teste de resistência diário dois dias consecutivos, é obrigado a iniciar o primeiro rito da apóstata. Estágio II: pequenas lacunas de memória surgem para dar espaço ao conhecimento esquecido — recebe +5 em Religião, fica alquebrado e inicia toda cena desprevenido por uma rodada. Se falhar três dias consecutivos, é obrigado a iniciar o segundo rito. Estágio III: além dos efeitos anteriores, se não tiver falhado no teste diário, não é capaz de atacar a apóstata até ser atacado por ela. Se falhar quatro dias consecutivos, é obrigado a iniciar o último rito. Estágio IV: a apóstata já não necessita mais de seus fiéis — após servirem de receptáculo para sua crença impossível, são abandonados pela entidade que veneravam; o infectado sente-se rejeitado por todas as divindades que poderia seguir, e fica esmorecido e abalado.' },
      { nome: 'Murus Idolorum', descricao: 'A apóstata se esconde no vazio atrás de sua parede rachada, formada por imagens de divindades e outros ídolos sagrados esquecidos e apagados. Qualquer ser ou objeto que atravesse a parede sofre 20d12 pontos de dano de Conhecimento. Se os PV do alvo forem reduzidos a 0, ele é inexistido, morrendo instantaneamente.' },
      {
        nome: 'Ritus (mecânica especial)',
        descricao: 'A apóstata subjuga seus fiéis a realizar ritos em seu nome, corrompendo as mentes ao seu redor. Cada rito danifica a Membrana na área em que é executado e fortalece diretamente a criatura, ampliando sua influência e aproximando-a de sua forma completa. Um rito precisa de um teste estendido de Religião com complexidade baixa e DT variada (OPRPG, p. 77); uma vez iniciado, todos os infectados que tenham falhado no teste diário de resistência de Mentem Corrumpere são compelidos a participar, ajudando automaticamente até o rito ser concluído ou interrompido. '
          + 'Primeiro Rito (Religião DT 25): os fiéis cobrem pisos, paredes e outras superfícies com escritos desconexos, símbolos e passagens de crenças esquecidas — dogmas, liturgias, genealogias divinas e eventos históricos impossíveis, alterados de forma macabra. Com a conclusão, todos os infectados passam para o segundo estágio (novos infectados já se iniciam no estágio II) e o VD da apóstata aumenta para 160: Presença Perturbadora DT 25, 4d8 mental, NEX 55% é imune; Defesa 34; PV 333, Machucado 166; e a apóstata recebe +10 em testes, rolagens de dano e RD. '
          + 'Segundo Rito (Religião DT 30): um vazio com o contorno exato de uma figura humana se abre entre os ídolos; os fiéis escolhem uma pessoa para ser oferecida ao rito, que é preparada com ornamentos estranhos e compelida a atravessar a abertura. Com a conclusão, todos os infectados passam para o terceiro estágio (novos infectados já se iniciam no estágio III) e o VD aumenta para 240: Presença Perturbadora DT 31, 6d8 mental, NEX 75% é imune; Defesa 42; PV 555, Machucado 277; a apóstata recebe +15 em testes, rolagens de dano e RD, e pode fazer um ataque adicional com flagellum. '
          + 'Terceiro Rito (teste estendido de Vontade, complexidade baixa, para ser resistido pelos participantes): diversas aberturas com contornos humanos rasgam a parede de ídolos, cada uma aguardando uma pessoa específica; cada participante que falhar no teste de Vontade abandona tudo e caminha voluntariamente até uma abertura, atravessando-a — se pelo menos metade dos envolvidos falharem, o rito é completo. Com a conclusão, todos os infectados passam para o quarto e último estágio (novos infectados já se iniciam no estágio IV) e o VD aumenta para 320: Presença Perturbadora DT 40, 9d6 mental, NEX 95% é imune; Defesa 50; PV 777, Machucado 388; Deslocamento Voo 12m | 8; a apóstata recebe +20 em testes, rolagens de dano e RD, e pode fazer dois ataques adicionais com flagellum.',
      },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Flagellum', detalhe: 'À distância, curto', teste: '3d20+10', dano: '6d10 mental' },
      { tipo: 'Reação', nome: 'Idololatria', descricao: 'Sempre que a apóstata acerta um ataque de flagellum, ela absorve parte da devoção e do potencial da vítima, recuperando PV equivalentes a metade do dano causado. Esta ação só pode ser usada se a apóstata estiver com VD 160 ou maior.' },
      { tipo: 'Reação', nome: 'Gnosis Absoluta', descricao: 'Quando a apóstata sofrer dano, ela compreenderá instantaneamente sua natureza e se lembrará do agressor por toda sua existência. Ela recebe +5 em RD contra o tipo de dano sofrido — bônus cumulativo e permanente. Esta ação só pode ser usada se a apóstata estiver com VD 320 ou maior.' },
      { tipo: 'Livre', nome: 'Funes Ligantes', descricao: 'Uma vez por rodada, se a apóstata acertar um ataque de flagellum, ela pode tentar agarrar o alvo com seus fios (teste 3d20+15). A criatura pode manter até dois personagens agarrados por vez. Cada fio pode ser atacado separadamente (mesmas estatísticas da apóstata, exceto pelos PV, que são 22). Quando um fio é destruído, o ser agarrado é imediatamente libertado e a apóstata perde uma quantidade de PV igual aos PV máximos daquele fio.' },
      { tipo: 'Livre', nome: 'Gnosis Implicata', descricao: 'Se a apóstata acertar um ataque de flagellum, o alvo sofre vulnerabilidade a dano mental até o fim da cena. Esta ação só pode ser usada se a apóstata estiver com VD 320 ou maior.' },
      { tipo: 'Livre', nome: 'Potentiam Absorbere', descricao: 'A apóstata drena parte da essência de cada ser agarrado por ela. Os alvos sofrem 2d8 pontos de dano mental. Além disso, para cada ser que estiver agarrado, a apóstata pode realizar um ataque adicional de flagellum.' },
      { tipo: 'Movimento', nome: 'Visio Vetita', descricao: 'A apóstata emana uma aura de horror absoluto. Quanto mais próxima de sua forma completa, mais insuportável se torna contemplar sua existência. Todos os seres em um raio de 18m dela que possam vê-la sofrem 6d8 pontos de dano mental (Vontade DT 35 reduz o dano à metade). Uma falha crítica no teste de resistência dessa ação deixa o alvo permanentemente cego. Esta ação só pode ser usada se a apóstata estiver com VD 240 ou maior.' },
      { tipo: 'Completa', nome: 'Vacuitatem Observa', descricao: 'A parede de ídolos se abre revelando o contorno de um ser em alcance médio. O alvo fica fascinado pela abertura e, enquanto permanecer sob efeito da condição, deve gastar todas as suas ações para tentar atravessar a passagem com seu contorno (Vontade DT 30 evita). Se o alvo estiver agarrado pelos fios da apóstata, a DT aumenta em +5. Esta ação só pode ser usada se a apóstata estiver com VD 240 ou maior.' },
    ],
    enigmaDoMedo: 'Enquanto permanecer protegida por seus ídolos, a apóstata mantém suas imunidades e não pode ser derrotada de forma definitiva. A única maneira de expô-la é interromper um de seus ritos antes de sua conclusão — nesse momento, sua verdadeira forma é forçada a emergir: ela perde todas as suas imunidades e recebe deslocamento 9m | 6 durante 3 rodadas, podendo ser enfrentada normalmente. Ao término desse período, a apóstata volta a se ocultar atrás de seus ídolos, recuperando suas imunidades e PV perdidos. Caso o último rito seja concluído, a apóstata perde suas imunidades e abandona por conta própria seus ídolos, manifestando sua verdadeira forma em toda sua plenitude — uma criatura moldada pela percepção individual de cada uma de suas vítimas, a personificação de seus medos e crenças, cujo único objetivo passa a ser matar todos os seus seguidores. Caso isso ocorra, ela regride para o VD 80 e volta a se esconder atrás de sua parede de ídolos, aguardando para recomeçar o ciclo de sua existência.',
    fonte: { livro: 'Arquivos Secretos 07', pagina: 70 },
  },
];
