// Arquivos Secretos 06 — pacote temático "Indústrias Panacea" (uma farmacêutica que
// secretamente combate o ocultismo usando criaturas paranormais em experimentos com
// cobaias humanas). Texto verbatim do PDF "Arquivos-Secretos-06-v1.1.pdf".
//
// Mapeamento do livro (confirmado pelo SUMÁRIO, p.3): a única secção com fichas de
// ameaça é "Ameaças Experimentais" (p.54-63) — 3 fichas de "PESSOA" (funcionários da
// Panacea) + 4 criaturas paranormais criadas por ela. O resto do livro (p.65 em
// diante: "Regras Intoxicantes") é conteúdo de personagem jogável (origens, poderes,
// venenos) e não tem fichas de ameaça — excluído deste ficheiro por não ser esse tipo
// de conteúdo.
//
// Nota sobre o glifo de dado: o livro usa "O" para 1d20 em pools (ex.: "3O+10" =
// 3d20+10; "O+5" solto = 1d20+5). A ficha de Segurança da Panacea, por alguma razão
// gráfica, imprime a submetralhadora já como "3d20+10" (não "3O+10") — mantido tal
// como está, já na notação padrão.
//
// Nota sobre a p.63 (Experimento Ssabáka): a extração por ordem de stream de
// caracteres devolveu as ações da criatura (Mastigar, Sofrimento Duradouro, Giro de
// Cauda, mais o ataque "Garras") ANTES do cabeçalho/flavor text/stat block dela — ao
// contrário do problema de texto decorativo de AS02/03, aqui é só a ordem de duas
// colunas da página trocada no stream do PDF. A reconstrução não teve ambiguidade:
// as três habilidades mencionam "o experimento Ssabáka" pelo nome, e "Garras" só faz
// sentido como o 2º ataque AGREDIR da mesma ficha (a par de "Mordida", que aparece
// já dentro do bloco "AÇÕES" do cabeçalho). Nada foi inventado, só reordenado.
//
// Nota sobre "Estímulo" (p.62): a Presença Perturbadora desta criatura imprime
// literalmente "DT 8d10" — um valor de DT em dado, não um número fixo como em todas
// as outras fichas do compêndio — e as suas próprias habilidades usam "DT 8d10" nos
// testes de resistência (ex.: "Vontade DT 8d10 evita"). Transcrito literalmente como
// string ('8d10') em vez de se assumir um número fixo por analogia com outras
// criaturas do mesmo VD.
//
// Nota sobre "eletricidade" como tipo de dano (Hikikomori): o livro imprime "Dano
// 2d12 eletricidade" nos dois ataques dele, em vez de "Energia" como seria de
// esperar pelo descritor da criatura — transcrito literalmente como impresso, sem
// normalizar para "Energia".

export const AMEACAS_AS06_PANACEA = [
  {
    id: 'as06-cientista-da-panacea',
    nome: 'Cientista da Panacea',
    vd: 40,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: [],
    flavorText: 'Uma pessoa cujas habilidades únicas e inteligência notável foram corrompidas pela prática de experimentos antiéticos.',
    sentidos: { percepcao: '1d20+5', iniciativa: '2d20+5' },
    defesa: 16,
    testes: { fortitude: '1d20+5', reflexos: '2d20+5', vontade: '1d20+5' },
    pv: 20,
    pvMachucado: 10,
    atributos: { agi: 2, for: 1, int: 4, pre: 1, vig: 1 },
    pericias: [
      { nome: 'Ciências', dados: 4, bonus: 10 },
      { nome: 'Investigação', dados: 4, bonus: 5 },
      { nome: 'Medicina', dados: 4, bonus: 5 },
      { nome: 'Sobrevivência', dados: 4, bonus: 5 },
      { nome: 'Tecnologia', dados: 4, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Seringas com Venenos', descricao: 'Escolha um veneno com DT até 25 de OPRPG, p. 293 ou desta edição (p. 77). Se acertar um ataque de injetar, o cientista envenena o alvo com o veneno escolhido.' },
      { nome: 'Submissão', descricao: 'Se estiver presente no mesmo ambiente que um manda-chuva da Panacea, os seus testes recebem +5. O efeito termina se o manda-chuva sair de cena.' },
      { nome: 'Traje de Proteção', descricao: 'O cientista da Panacea utiliza traje hazmat de alta qualidade, projetado para resistir à perfurações. Fornece +10 em testes de resistência contra efeitos ambientais e infecções; e resistência a dano de perfuração e químico 10.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pancada', detalhe: 'Corpo a corpo', teste: '1d20+5', dano: '1d4+5 impacto' },
      { tipo: 'Padrão', nome: 'Agredir — Injetar', detalhe: 'Corpo a corpo', teste: '1d20+5', dano: 'Veneno (ver Seringas com Venenos)' },
    ],
    fonte: { livro: 'Arquivos Secretos 06', pagina: 56 },
  },
  {
    id: 'as06-manda-chuva-da-panacea',
    nome: 'Manda-Chuva da Panacea',
    vd: 120,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: [],
    flavorText: 'Um executivo ou funcionário com cargo de gerência, fiel às Indústrias Panacea e disposto a sacrificar todos os seus subalternos pela empresa.',
    sentidos: { percepcao: '3d20+10', iniciativa: '2d20+0' },
    defesa: 23,
    testes: { fortitude: '3d20+5', reflexos: '2d20+0', vontade: '3d20+10' },
    pv: 120,
    pvMachucado: 60,
    atributos: { agi: 2, for: 1, int: 3, pre: 3, vig: 3 },
    pericias: [
      { nome: 'Atualidades', dados: 3, bonus: 5 },
      { nome: 'Diplomacia', dados: 3, bonus: 10 },
      { nome: 'Enganação', dados: 3, bonus: 10 },
      { nome: 'Intimidação', dados: 3, bonus: 10 },
      { nome: 'Intuição', dados: 3, bonus: 10 },
      { nome: 'Ocultismo', dados: 3, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Negociador', descricao: 'O manda-chuva sabe como lidar com pessoas, seus desejos e ambições. Quando faz um teste de perícia baseado em Presença, ele pode rolar novamente e ficar com o melhor resultado.' },
      { nome: 'Objeto de Pesquisa', descricao: 'O manda-chuva tem um item amaldiçoado determinado pelo mestre guardado consigo e sabe como usá-lo.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pancada', detalhe: 'Corpo a corpo', teste: '1d20+10', dano: '1d6+5 impacto' },
      { tipo: 'Padrão', nome: 'Agredir — Pistola', detalhe: 'À distância, curto, x2', teste: '2d20+10', critico: 18, dano: '2d12+10 balístico' },
      { tipo: 'Reação', nome: 'Sou Mais Importante', descricao: 'Uma vez por rodada, quando é alvo de um efeito negativo e há um subalterno seu na cena e em alcance médio, o manda-chuva consegue uma forma de destinar o efeito para o funcionário. Pode ser se jogando atrás do subalterno, dando ordens para protegê-lo ou uma ação similar.' },
      { tipo: 'Padrão', nome: 'Chamar Reforços', descricao: 'Uma vez por cena, o manda-chuva pode chamar reforços das proximidades, trazendo 1d4+1 seguranças da Panacea para a cena. Os seguranças passam a agir imediatamente após o manda-chuva na ordem de iniciativa.' },
    ],
    fonte: { livro: 'Arquivos Secretos 06', pagina: 57 },
  },
  {
    id: 'as06-seguranca-da-panacea',
    nome: 'Segurança da Panacea',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    descritores: [],
    flavorText: 'Um paramilitar muito bem pago, encarregado da força bruta contra criaturas fora de contenção e possíveis visitas indesejadas.',
    sentidos: { percepcao: '2d20+0', iniciativa: '3d20+10' },
    defesa: 21,
    testes: { fortitude: '2d20+5', reflexos: '3d20+5', vontade: '2d20+5' },
    pv: 80,
    pvMachucado: 40,
    atributos: { agi: 3, for: 3, int: 1, pre: 2, vig: 2 },
    pericias: [
      { nome: 'Atletismo', dados: 3, bonus: 10 },
      { nome: 'Intimidação', dados: 2, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Bem Pago', descricao: 'Se estiver presente no mesmo ambiente que um manda-chuva da Panacea, os seus testes recebem +5. O efeito termina se o manda-chuva sair de cena.' },
      { nome: 'Munição Não Letal', descricao: 'O segurança é equipado com munições letais e não letais. A menos que receba a ordem de atirar para matar, sempre está usando munição não letal (balas de borracha ou dardos tranquilizantes).' },
      { nome: 'Ossos do Ofício', descricao: 'O trabalho de segurança nas bases da Panacea exige alguma experiência prévia com o sobrenatural. Por causa disso, o segurança recebe +5 em testes de resistência contra efeitos paranormais (rituais, poderes paranormais e afins).' },
      { nome: 'Traje de Campo', descricao: 'Os trajes vestidos por um segurança da Panacea são feitos para proteger contra ameaças paranormais. Ele fornece RD 5 e contém uma máscara de gás que fornece +10 em testes de Fortitude contra efeitos que dependam de respiração.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pancada', detalhe: 'Corpo a corpo x2', teste: '3d20+10', dano: '2d6+10 impacto' },
      { tipo: 'Padrão', nome: 'Agredir — Pistola', detalhe: 'À distância, curto, x2', teste: '3d20+10', critico: 18, dano: '1d12+10 balístico' },
      { tipo: 'Padrão', nome: 'Agredir — Submetralhadora', detalhe: 'À distância, curto, x2', teste: '3d20+10', critico: '19/x3', dano: '3d6+10 balístico' },
      { tipo: 'Livre', nome: 'Agarrar', descricao: 'Se o segurança acertar um ataque de pancada, pode tentar agarrar o alvo (teste 3d20+10).' },
      { tipo: 'Movimento', nome: 'Derrubar', descricao: 'Se o segurança estiver agarrando um alvo, ele pode tentar derrubá-lo (teste 3d20+10). Independentemente de conseguir ou não, o segurança continua agarrando o alvo.' },
      { tipo: 'Movimento', nome: 'Imobilizar', descricao: 'Se o segurança estiver agarrando um alvo caído, ele pode fazer uma manobra (teste 3d20+10) para imobilizá-lo. Independentemente de conseguir ou não, o segurança continua agarrando o alvo. Se o alvo for imobilizado, ele fica paralisado até ser solto do agarrão. Manter o alvo imobilizado deixa o segurança indefeso, mas ele pode soltar o alvo como reação para se livrar dessa condição.' },
      { tipo: 'Padrão', nome: 'Atordoamento', descricao: 'Uma vez por cena, o segurança arremessa uma granada flashbang em alcance curto. Seres em um raio de 6m a partir do ponto de impacto ficam atordoados por 1 rodada (Fortitude DT 20 reduz para ofuscado e surdo por 1 rodada).' },
      { tipo: 'Padrão', nome: 'Fragmentação', descricao: 'Uma vez por cena, o segurança arremessa uma granada de fragmentação em alcance curto. Seres em um raio de 6m a partir do ponto de impacto sofrem 8d6 pontos de dano de perfuração (Reflexos DT 20 reduz o dano à metade).' },
      { tipo: 'Padrão', nome: 'Gás Lacrimogêneo', descricao: 'Uma vez por cena, o segurança arremessa uma granada de gás lacrimogêneo em alcance curto. Seres em um raio de 6m a partir do ponto de impacto sofrem 4d6 pontos de dano químico, ficam enjoados e asfixiados (OPRPG, p. 293). Após deixarem a área de efeito, continuam asfixiados por 1d4 rodadas e ainda ficam enjoados até o fim da cena (Fortitude DT 20 reduz o dano à metade e evita a condição enjoado).' },
      { tipo: 'Padrão', nome: 'Incendiária', descricao: 'Uma vez por cena, o segurança arremessa uma granada incendiária em alcance curto. Seres em um raio de 6m a partir do ponto de impacto sofrem 6d6 pontos de dano de fogo e ficam em chamas (Reflexos DT 20 reduz o dano à metade e evita a condição em chamas).' },
      { tipo: 'Padrão', nome: 'Rajadas', descricao: 'O segurança faz dois ataques com sua submetralhadora. Cada ataque sofre –1d20 no teste de ataque (2d20+10), mas causa 1 dado de dano adicional do mesmo tipo (4d6+10).' },
    ],
    fonte: { livro: 'Arquivos Secretos 06', pagina: 58 },
  },
  {
    id: 'as06-hikikomori',
    nome: 'Hikikomori',
    vd: 20,
    categoria: 'Ameaça Paranormal',
    tamanho: 'Médio',
    descritores: ['Energia', 'Sangue'],
    flavorText: 'Nomeado a partir do termo japonês que categoriza pessoas em extremo isolamento social voluntário, é uma criatura humanoide originada do contato entre o vírus infecticídio e um humano solitário, cujo contato com a tecnologia e conversas virtuais é maior do que o contato humano presencial. Seu corpo se contorce para dentro, se esconde atrás de aparelhos periféricos e se enrola em fios, como se tentasse se esconder dentro de um casulo de tecnologia. É solitário, mas extremamente agressivo.',
    presencaPerturbadora: { dt: 14, dano: '2d6 mental', nex: 25 },
    sentidos: { percepcao: '1d20+0', iniciativa: '2d20+5' },
    defesa: 16,
    testes: { fortitude: '1d20+0', reflexos: '2d20+5', vontade: '1d20+0' },
    pv: 35,
    pvMachucado: 17,
    resistencias: ['Energia 5'],
    vulnerabilidades: ['Conhecimento'],
    atributos: { agi: 2, for: 1, int: 1, pre: 1, vig: 1 },
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Casulo Voltaico', descricao: 'Enquanto não estiver machucada, o hikikomori drena a energia dos eletrônicos que cobrem seu corpo, recebendo cura acelerada 5. Além disso, sempre que for alvo de um ataque corpo a corpo, projeta uma pequena onda elétrica contra o atacante, causando 2d4 pontos de dano de Energia. Enquanto estiver machucado, perde essa habilidade.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Disparo Infectado', detalhe: 'À distância, curto', teste: '2d20+5', dano: '2d12 eletricidade' },
      { tipo: 'Padrão', nome: 'Agredir — Esbarrão Infectado', detalhe: 'Corpo a corpo', teste: '2d20+5', dano: '2d12 eletricidade' },
      { tipo: 'Livre', nome: 'Infecção', descricao: 'Um ser que sofra dano do disparo ou do esbarrão é infectado pelo vírus do infecticídio (Fortitude DT 14 evita; veja OPRPG, p. 292). Um ser que passe no teste de resistência fica imune a essa doença até o final da cena.' },
      { tipo: 'Livre', nome: 'Ricochete', descricao: 'Ao acertar um ataque de esbarrão, o hikikomori pode fazer uma ação de movimento para se deslocar.' },
    ],
    fonte: { livro: 'Arquivos Secretos 06', pagina: 60 },
  },
  {
    id: 'as06-marca-passo',
    nome: 'Marca-Passo',
    vd: 80,
    categoria: 'Ameaça Paranormal',
    tamanho: 'Médio',
    descritores: ['Energia', 'Sangue'],
    flavorText: 'Surge da união do vírus infecticídio com uma ou mais pessoas que já possuíam previamente implantes tecnológicos ou qualquer tipo de biohacking em seu corpo, incluindo chips, placas de metal ou até mesmo marca-passos. O vírus deforma a tecnologia presente no corpo, expelindo pela carne e tornando-a exposta.',
    presencaPerturbadora: { dt: 20, dano: '3d8 mental', nex: 40 },
    sentidos: { percepcao: '2d20+0', iniciativa: '3d20+10' },
    defesa: 23,
    testes: { fortitude: '2d20+5', reflexos: '3d20+10', vontade: '2d20+0' },
    pv: 140,
    pvMachucado: 70,
    resistencias: ['Balístico, corte e perfuração 10', 'Energia 20'],
    vulnerabilidades: ['Conhecimento'],
    atributos: { agi: 3, for: 3, int: 1, pre: 2, vig: 2 },
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Trilha Digital', descricao: 'O marca-passo consegue captar vibrações elétricas e do elemento de Energia em alcance extremo. Qualquer agente que carregue consigo algum aparelho eletrônico (celular, lanternas, relógio digital, escutas etc.) ou equipamento amaldiçoado com o elemento de Energia, é automaticamente percebido pelo marca-passo (não consegue pegá-lo desprevenido ou deixá-lo surpreendido) e fica vulnerável contra a criatura até que se livre de todos os objetos.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Golpe Infectado', detalhe: 'Corpo a corpo x2', teste: '3d20+10', dano: '2d12+5 impacto' },
      { tipo: 'Reação', nome: 'Frenesi Eletrônico', descricao: 'Quando um ser em alcance curto do marca-passo usa um poder de Energia, ritual de Energia, equipamento eletrônico ou item amaldiçoado de Energia, o marca-passo entra em surto, se movendo até ficar adjacente ao ser. No fim do movimento extremamente veloz, ele causa uma explosão que causa 4d6+5 pontos de dano de Energia em todos os seres em um raio de 6m a partir dele (Reflexos DT 20 reduz o dano à metade).' },
      { tipo: 'Livre', nome: 'Infecção de Equipamento', descricao: 'Um ser que sofra dano do golpe deve rolar 1d100. Se o resultado for 51 ou maior, um equipamento que o ser está carregando se torna um item amaldiçoado de Energia (o mestre determina o item e a maldição). Se o resultado for 50 ou menor, um equipamento que o ser está carregando (o mestre determina o item) é infectado pelo vírus do infecticídio. Qualquer ser que toque o item pode se contaminar (Fortitude DT 20 evita; veja OPRPG, p. 292). Um ser que passe no teste de resistência fica imune a essa doença até o final da cena.' },
    ],
    fonte: { livro: 'Arquivos Secretos 06', pagina: 61 },
  },
  {
    id: 'as06-estimulo',
    nome: 'Estímulo',
    vd: 320,
    categoria: 'Ameaça Paranormal',
    tamanho: 'Grande',
    descritores: ['Energia', 'Sangue'],
    flavorText: 'A manifestação espectral do vírus infecticídio que adquiriu autoconsciência fora de um hospedeiro. Ele se movimenta e pode se fragmentar através de diversos sinais digitais e analógicos como bluetooth, wi-fi, rádio e televisão, podendo percorrer rapidamente grandes distâncias se não for contido. Sua aparência é similar a uma forma errática poligonal cujas várias arestas parecem nunca encontrar a forma correta para criar uma esfera perfeita.',
    // O livro imprime "DT 8d10" na Presença Perturbadora (e nos testes de resistência
    // das próprias habilidades desta criatura) — um valor de DT em dado, e não um
    // número fixo como em todas as outras fichas do compêndio. Transcrito
    // literalmente como string, sem substituir por um número calculado por analogia.
    presencaPerturbadora: { dt: '8d10', dano: '9d6 mental', nex: 95 },
    sentidos: { percepcao: '5d20+20', iniciativa: '5d20+20' },
    defesa: 50,
    testes: { fortitude: '4d20+15', reflexos: '5d20+25', vontade: '5d20+20' },
    pv: 800,
    pvMachucado: 400,
    imunidades: ['Dano (exceto Conhecimento) e todas as condições'],
    vulnerabilidades: ['Conhecimento'],
    atributos: { agi: 5, for: 0, int: 5, pre: 5, vig: 4 },
    deslocamento: '12m | 8',
    habilidades: [
      { nome: 'Cogito Ergo Sum', descricao: 'Um ser que falhe em um teste contra a presença perturbadora do Estímulo é automaticamente infectado pelo vírus infecticídio (veja OPRPG, p. 292). Além disso, qualquer ser que tocar no Estímulo também é infectado automaticamente.' },
    ],
    acoes: [
      { tipo: 'Movimento', nome: 'Sequestrar Sinal', descricao: 'O Estímulo pode se teletransportar para qualquer espaço em alcance médio, desde que fique adjacente a um aparelho eletrônico.' },
      { tipo: 'Padrão', nome: 'Glitch', descricao: 'O Estímulo desaparece e aparece, distorcendo a percepção de realidade de todos os seres em um raio de 9m a partir dele. Os alvos devem fazer testes contra a presença perturbadora do Estímulo novamente.' },
      { tipo: 'Padrão', nome: 'Rodar Simulação', descricao: 'O Estímulo distorce a natureza física de um ser em alcance curto até o final da cena. O maior atributo do ser troca de lugar com o menor atributo (Vontade DT 8d10 evita). Essa troca afeta apenas testes.' },
      { tipo: 'Completa', nome: 'Imergir', descricao: 'O Estímulo aprofunda sua infecção em um ser em alcance curto que está sob efeito do infecticídio. A doença no alvo avança automaticamente em 1 estágio e ele sofre 10d12 pontos de dano de Energia (Fortitude DT 8d10 reduz o dano à metade e evita o avanço da doença). Se morrer enquanto infectado, o ser se transforma no princípio de uma horda de infecticídio (OPRPG, p. 267).' },
      { tipo: 'Completa', nome: 'Sequestro de Atenção', descricao: 'O Estímulo projeta em sua aparência disforme uma imagem hipnotizante para todos os seres infectados em um raio de 30m a partir dele. Um ser que falhe em um teste de Vontade (DT 35) deve gastar todas as ações durante o seu próximo turno para se mover em direção à criatura e tocá-la.' },
    ],
    fonte: { livro: 'Arquivos Secretos 06', pagina: 62 },
  },
  {
    id: 'as06-experimento-ssabaka',
    nome: 'Experimento Ssabáka',
    vd: 180,
    categoria: 'Ameaça Paranormal',
    tamanho: 'Médio',
    descritores: ['Morte', 'Sangue'],
    flavorText: 'Pouco se sabe sobre o experimento russo de codinome Ssabáka, envolvendo ossadas amaldiçoadas encontradas na Sibéria Ocidental. Organizações como a Ordo Realitas só tomaram conhecimento do caso quando uma transação econômica considerada ilegal colocou o projeto russo nas mãos das Indústrias Panacea. Os poucos registros falam de uma criatura grotesca, descarnada, com ossos protuberantes, membros irregulares, força sobrenatural e cabeçorra dentada. Um predador paranormal cruel.',
    presencaPerturbadora: { dt: 28, dano: '6d6 mental', nex: 60 },
    sentidos: { percepcao: '2d20+10', iniciativa: '3d20+15' },
    defesa: 36,
    testes: { fortitude: '4d20+15', reflexos: '3d20+15', vontade: '2d20+10' },
    pv: 360,
    pvMachucado: 180,
    resistencias: ['Balístico, impacto e perfuração 10', 'Sangue 20'],
    vulnerabilidades: ['Energia'],
    atributos: { agi: 3, for: 3, int: 0, pre: 2, vig: 4 },
    deslocamento: '12m | 8',
    habilidades: [
      { nome: 'Fugitivo do Tempo', descricao: 'O experimento Ssabáka é imune a qualquer efeito negativo relacionado ao tempo, sejam naturais ou paranormais. Por exemplo, ele não sofre efeitos de envelhecimento causados por idade, Decadência ou Paradoxo.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Mordida', detalhe: 'Corpo a corpo', teste: '3d20+20', dano: '4d12+20 perfuração' },
      { tipo: 'Padrão', nome: 'Agredir — Garras', detalhe: 'Corpo a corpo x2', teste: '3d20+20', dano: '4d12+10 corte' },
      { tipo: 'Livre', nome: 'Mastigar', descricao: 'Se acertar um ataque com sua mordida em um alvo Grande ou menor, o experimento Ssabáka pode pressionar seus dentes contra sua vítima para agarrá-la (teste 3d20+20). Se conseguir, o alvo fica agarrado e se movimenta junto com a criatura durante o turno dela até se libertar. O experimento Ssabáka só pode mastigar um personagem por vez e liberta o que estiver preso em seus dentes caso faça outro ataque de mordida.' },
      { tipo: 'Movimento', nome: 'Sofrimento Duradouro', descricao: 'O experimento Ssabáka despeja uma quantidade grotesca de Lodo de Morte em um alvo agarrado, apodrecendo e cicatrizando os ferimentos do ser em uma tortura sobrenatural. O alvo recupera 3d8+3 PV atuais, mas perde 1d8+1 PV máximos permanentemente.' },
      { tipo: 'Completa', nome: 'Giro de Cauda', descricao: 'O experimento Ssabáka gira sua cauda, atingindo todos os seres adjacentes que sofrem 4d10+10 pontos de dano de impacto e ficam caídos (Reflexos DT 28 reduz à metade e evita condição).' },
    ],
    fonte: { livro: 'Arquivos Secretos 06', pagina: 63 },
  },
];
