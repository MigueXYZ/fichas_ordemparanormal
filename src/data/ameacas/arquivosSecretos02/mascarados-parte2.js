// Os Mascarados (parte 2) — Arquivos Secretos 02 "Hexatombe", seção dos Mascarados
// remanescentes: Kemi/Fantasma, Labirinto, Jasper, Lena Viegas, Maria Helena
// Rodrigues, Remi, Tuco Belez e Juan/Juan Diabólico (p. 57-92 do PDF).
// Texto verbatim do PDF "as02_ameacas_raw.txt" (extração de Arquivos Secretos 02).
// Nada foi resumido, traduzido ou inventado nas regras/ações; a "flavorText" é uma
// síntese curta (1-2 frases) da lore/diário de cada personagem. Narrativa longa de
// background (diários, "NA SUA MESA", "COMO ALIADO/ALIADA", itens amaldiçoados de
// jogador como Sniper Fantasma/A Antena/Faca Predadora) foi deliberadamente OMITIDA
// por não fazer parte da ficha de ameaça em si — só o stat block da criatura/pessoa
// foi transcrito.
//
// Jasper, Lena Viegas, Maria Helena Rodrigues, Remi e Tuco Belez têm apenas UMA
// ficha cada (o livro não imprime uma forma vilanesca separada para eles, ao
// contrário de Kemi→Fantasma, Labirinto→"Forma Suprema" e Juan→Juan Diabólico).
//
// == NOTA (Labirinto Forma Suprema) ==
// Ao contrário de todo o resto dos Mascarados (Kemi→Fantasma, Juan→Juan Diabólico
// etc.), o livro NÃO dá um nome próprio para a forma desperta/VD 140 de Labirinto —
// ela continua sendo chamada só de "Labirinto" nas duas fichas. A área da página
// onde um nome de vilão poderia aparecer só tem um texto decorativo giratório/
// rotacionado (tipo "Vazio.", "Labirinto." espalhados na diagonal) que a extração
// de texto devolve como sopa de caracteres — isso é flavor text decorativo sobre
// estar perdido num labirinto, não um nome, e foi ignorado (não adivinhado). Por
// isso, o id/nome 'Labirinto (Forma Suprema)' abaixo é um rótulo que NÓS adicionamos
// só para diferenciar as duas fichas no app; não é texto do livro.
//
// == NOTA (círculo reconstruído via DT = 10 + 5×círculo) ==
// Várias ações de ritual da forma desperta de Labirinto e de Juan Diabólico saem
// da extração como "ELEMENTO ???" no lugar do número do círculo (mesma causa: texto
// decorativo rotacionado sobre o card do ritual). Em todos os casos, o efeito do
// próprio ritual imprime "DT 25" claramente no texto corrido. Pela fórmula oficial
// DT = 10 + 5×círculo, DT 25 = 3º círculo. Os "???" foram substituídos por "3" nesses
// 7 rituais (4 de Labirinto, 3 de Juan Diabólico), cada um com um comentário
// específico marcando a reconstrução.
//
// == NOTA (atributos AGI/FOR/INT/PRE/VIG sem rótulo) ==
// Em Jasper, Lena Viegas, Maria Helena Rodrigues, Remi e Tuco Belez, os atributos
// saem da extração claramente rotulados em duas linhas, sempre no mesmo layout:
// "AGI X INT Y VIG Z" seguido de "FOR A PRE B". Já em Kemi, Fantasma, Labirinto
// (as duas fichas) e Juan (as duas fichas), a mesma caixa de atributos sai da
// extração SEM os rótulos "AGI/FOR/INT/PRE/VIG" — só os 5 números soltos, na mesma
// disposição espacial (1 número isolado, depois um par, depois outro par, sempre
// nessa ordem de leitura). Como essa disposição bate exatamente com o padrão
// "AGI/INT/VIG" (3 números, aqui divididos em 1+2 pela diagonal do texto que
// atravessa a caixa) seguido de "FOR/PRE" (2 números) confirmado nos outros cinco
// personagens desta mesma seção, os atributos de Kemi/Fantasma, Labirinto (as duas
// fichas) e Juan (as duas fichas) foram reconstruídos nessa ordem — não foram
// adivinhados: os valores em si já estavam no texto, só a legenda dos rótulos
// precisou ser inferida do padrão do livro. Como reforço, os mesmos 5 números se
// repetem sem alteração entre a forma base e a forma desperta de cada personagem
// (Kemi/Fantasma, Labirinto base/Forma Suprema, Juan/Juan Diabólico), como esperado
// já que atributos não mudam na transformação — o que é consistente com a hipótese.
//
// Comentários "// GAP:" marcam trechos genuinamente ilegíveis (texto decorativo
// rotacionado/diagonal sobreposto ao texto real na extração do PDF) que não puderam
// ser recuperados nem por contexto nem por comparação com caixas "NA SUA MESA"
// paralelas — nesses casos, nada foi inventado para preencher o buraco.

export const AMEACAS_AS02_MASCARADOS_2 = [
  {
    id: 'as02-kemi',
    nome: 'Kemi',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Uma assassina de aluguel fria e metódica, moldada pelo abandono num orfanato abusivo e por anos de treinamento sob uma misteriosa mentora; atualmente contratada para matar o lutador Colosso.',
    sentidos: { percepcao: '2d20+5', iniciativa: '3d20+10' },
    defesa: 23,
    testes: { fortitude: '1d20+5', reflexos: '3d20+10', vontade: '2d20+5' },
    pv: 90, pvMachucado: 45,
    // NOTA: atributos sem rótulo no PDF, reconstruídos pela ordem AGI/INT/VIG (3) +
    // FOR/PRE (2) confirmada em outras fichas da mesma seção — veja nota no topo do arquivo.
    atributos: { agi: 3, for: 2, int: 1, pre: 1, vig: 3 },
    pericias: [
      { nome: 'Acrobacia', dados: 3, bonus: 10 },
      { nome: 'Atletismo', dados: 1, bonus: 5 },
      { nome: 'Crime', dados: 3, bonus: 10 },
      { nome: 'Furtividade', dados: 3, bonus: 10 },
      { nome: 'Investigação', dados: 3, bonus: 10 },
      { nome: 'Medicina', dados: 3, bonus: 5 },
      { nome: 'Ocultismo', dados: 3, bonus: 5 },
      { nome: 'Sobrevivência', dados: 2, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Sniper da Morte', descricao: 'Um ser reduzido a 0 PV por dano da sniper da Kemi, morre se iniciar 2 turnos morrendo (em vez de 3).' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Facada', detalhe: 'Corpo a corpo x2', teste: '3d20+10', critico: '19/x2', dano: '2d4+10 perfuração' },
      { tipo: 'Padrão', nome: 'Agredir — Fuzil de Precisão', detalhe: 'À distância, longo', teste: '3d20+10', critico: '17/x3', dano: '2d10+20 balístico + 2d4 Morte' },
      { tipo: 'Reação', nome: 'Esquiva Tática', descricao: 'Uma vez por rodada, quando sofre um ataque, Kemi pode se esquivar, recebendo +10 na Defesa.' },
      { tipo: 'Reação', nome: 'Perito', descricao: 'Uma vez por rodada, quando faz um teste de uma perícia em que é treinado, Kemi soma +1d8 no resultado do teste.' },
      { tipo: 'Livre', nome: 'Disparo da Morte', descricao: 'Uma vez por rodada, quando faz um ataque com uma arma de fogo, Kemi sente o tempo desacelerar, o que permite mirar com precisão letal. Ela recebe +2 na margem de ameaça.' },
      { tipo: 'Padrão', nome: 'Intenção Assassina', descricao: 'Kemi desperta sua intenção assassina (veja a ficha Fantasma, p. 58).' },
      { tipo: 'Reação', nome: 'Poder de Intenção', descricao: 'Uma vez por rodada, quando Kemi ouvir o grito de morte de alguém em seu campo de visão que ela tentou proteger, Kemi pode fazer um ataque contra quem deixou seu aliado morrendo. Kemi também pode usar essa habilidade para fazer um ataque contra um inimigo que a deixou morrendo.' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 57 },
  },
  {
    id: 'as02-fantasma',
    nome: 'Fantasma',
    vd: 140,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'A intenção assassina desperta de Kemi: uma versão ainda mais precisa e implacável da atiradora, consumida pelo instinto de matar até saciar sua sede de sangue ou adormecer novamente.',
    sentidos: { percepcao: '2d20+10', iniciativa: '3d20+15' },
    defesa: 30,
    testes: { fortitude: '1d20+10', reflexos: '3d20+15', vontade: '2d20+10' },
    pv: 180, pvMachucado: 90,
    // NOTA: mesma reconstrução de atributos sem rótulo explicada no topo do arquivo;
    // os 5 números batem exatamente com os de Kemi (atributos não mudam na transformação).
    atributos: { agi: 3, for: 2, int: 1, pre: 1, vig: 3 },
    pericias: [
      { nome: 'Acrobacia', dados: 3, bonus: 15 },
      { nome: 'Atletismo', dados: 1, bonus: 10 },
      { nome: 'Crime', dados: 3, bonus: 15 },
      { nome: 'Furtividade', dados: 3, bonus: 15 },
      { nome: 'Investigação', dados: 3, bonus: 15 },
      { nome: 'Medicina', dados: 3, bonus: 10 },
      { nome: 'Ocultismo', dados: 3, bonus: 10 },
      { nome: 'Sobrevivência', dados: 2, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Sniper da Morte', descricao: 'Um ser reduzido a 0 PV por dano da sniper da Fantasma, morre se iniciar 2 turnos morrendo (em vez de 3).' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Facada', detalhe: 'Corpo a corpo x2', teste: '3d20+15', critico: '19/x2', dano: '4d4+20 perfuração' },
      { tipo: 'Padrão', nome: 'Agredir — Fuzil de Precisão', detalhe: 'À distância, longo', teste: '3d20+15', critico: '17/x3', dano: '4d10+40 balístico + 4d4 Morte' },
      { tipo: 'Reação', nome: 'Esquiva Fantasma', descricao: 'Duas vezes por rodada, quando sofre um ataque, Fantasma pode se esquivar, recebendo +10 na Defesa.' },
      { tipo: 'Reação', nome: 'Analítica', descricao: 'Uma vez por rodada, quando faz um teste de uma perícia em que é treinada, Fantasma soma +1d12 no resultado do teste.' },
      // GAP: o extrator devolve "curvar seu projeto na direção do alvo" — muito provavelmente
      // "projétil" no original (perda de caractere por sobreposição de texto decorativo na
      // página), mas mantido exatamente como sai da extração por não haver como confirmar.
      { tipo: 'Livre', nome: 'Disparo Espiral', descricao: 'Uma vez por rodada, quando faz um ataque com uma arma de fogo, Kemi sente o tempo desacelerar, o que permite mirar com precisão letal e curvar seu projeto na direção do alvo. Ela recebe +2 na margem de ameaça e seu ataque ignora cobertura e 10 pontos de resistência a dano.' },
      { tipo: 'Padrão', nome: 'Intenção Assassina', descricao: 'Fantasma adormece sua intenção assassina (veja a ficha Kemi, p. 57) e não pode usá-la novamente até dormir.' },
      { tipo: 'Reação', nome: 'Poder de Intenção', descricao: 'Uma vez por rodada, quando Kemi ouvir o grito de morte de alguém em seu campo de visão que ela tentou proteger, Kemi pode fazer um ataque contra quem deixou seu aliado morrendo. Kemi também pode usar essa habilidade para fazer um ataque contra um inimigo que a deixou morrendo.' },
    ],
    notas: 'Enquanto estiver nessa forma, Kemi se torna Fantasma, sendo consumido por sua intenção assassina. A transformação não tem limite de duração, mas se Kemi não matar uma pessoa até o fim da cena, sua intenção assassina adormece e não pode ser usada até Kemi dormir.',
    fonte: { livro: 'Arquivos Secretos 02', pagina: 58 },
  },
  {
    id: 'as02-labirinto',
    nome: 'Labirinto',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Um ocultista de identidade obscura, obcecado por labirintos, mapas de sangue e símbolos que capturam momentos — capaz de guardar um ritual pronto dentro de uma antena amaldiçoada para libertá-lo no instante certo.',
    sentidos: { percepcao: '3d20+5', iniciativa: '1d20+5' },
    defesa: 20,
    testes: { fortitude: '1d20+5', reflexos: '1d20+5', vontade: '3d20+10' },
    pv: 120, pvMachucado: 60,
    // NOTA: mesma reconstrução de atributos sem rótulo explicada no topo do arquivo.
    atributos: { agi: 1, for: 3, int: 1, pre: 2, vig: 3 },
    pericias: [
      { nome: 'Ciências', dados: 3, bonus: 10 },
      { nome: 'Intuição', dados: 3, bonus: 5 },
      { nome: 'Investigação', dados: 3, bonus: 10 },
      { nome: 'Medicina', dados: 3, bonus: 10 },
      { nome: 'Ocultismo', dados: 3, bonus: 15 },
      { nome: 'Sobrevivência', dados: 3, bonus: 5 },
      { nome: 'Tecnologia', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Antena do Medo', descricao: 'Labirinto pode conjurar um ritual na antena. O ritual não faz efeito na hora; em vez disso, fica contido nela. Labirinto pode gastar uma ação padrão para libertar o ritual e gerar o efeito dele (sem precisar gastar ações de conjuração ou outro recurso). A antena só pode conter um ritual por vez.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pancada com Antena', detalhe: 'Corpo a corpo x2', teste: '1d20+5', dano: '1d8+10 impacto' },
      { tipo: 'Padrão', nome: 'Ritual — Mapa Sanguíneo (Sangue 2)', descricao: 'Labirinto toca em uma superfície e desenha um mapa com gotas de sangue que sinalizam em tempo real a localização de todos os seres em um raio de 1 km a partir dele. Os seres podem fazer um teste de Vontade (DT 20) para evitar este efeito. O mapa dura até o fim da cena.' },
      { tipo: 'Padrão', nome: 'Novo Caminho', descricao: 'Labirinto pode usar essa habilidade após testemunhar a morte de uma pessoa. Ele absorve as intenções da pessoa morta em alcance curto. Então, recupera pontos de vida de um ser em alcance curto equivalentes à metade dos PV máximos do cadáver.' },
      { tipo: 'Padrão', nome: 'Ritual — Capturar Momento (Morte 2)', descricao: 'Labirinto marca um local em alcance médio com um símbolo de Morte invisível. O símbolo capta imagens e sons em alcance médio dele. Labirinto pode gastar uma ação padrão para ver e ouvir qualquer coisa captada pelo símbolo, mesmo estando distante dele. Labirinto pode ter no máximo três símbolos; se criar um quarto, um dos anteriores desaparece.' },
      { tipo: 'Padrão', nome: 'Ritual — Rajada Caótica (Energia 2)', descricao: 'Labirinto dispara um raio que causa 8d8 pontos de dano de Energia em um ser em alcance médio (Reflexos DT 20 reduz à metade).' },
      { tipo: 'Padrão', nome: 'Ritual — Labirinto Mental (Conhecimento 2)', descricao: 'Labirinto prende a mente de uma pessoa em alcance médio em um labirinto. Pelas próximas 1d4 rodadas, o alvo é obrigado a gastar suas ações para se mover em uma direção aleatória. No início de cada um de seus turnos, o alvo pode fazer um teste de Vontade (DT 20). Se passar, se liberta deste efeito.' },
      { tipo: 'Padrão', nome: 'Intenção Assassina', descricao: 'Labirinto desperta sua intenção assassina (veja a ficha na página a seguir).' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 62 },
  },
  {
    id: 'as02-labirinto-forma-suprema',
    // NOTA: nome "(Forma Suprema)" é um rótulo NOSSO — o livro não dá um nome próprio
    // para esta forma (só chama de "Labirinto" também). Veja a nota no topo do arquivo.
    nome: 'Labirinto (Forma Suprema)',
    vd: 140,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'A forma desperta de Labirinto: o mesmo ocultista, agora consumido pela própria intenção assassina, disparando relâmpagos e detonando seus símbolos de Morte em explosões de energia entrópica.',
    sentidos: { percepcao: '3d20+10', iniciativa: '1d20+10' },
    defesa: 28,
    testes: { fortitude: '1d20+10', reflexos: '1d20+10', vontade: '3d20+15' },
    pv: 240, pvMachucado: 120,
    // NOTA: mesma reconstrução de atributos sem rótulo explicada no topo do arquivo;
    // os 5 números batem exatamente com os da forma base (atributos não mudam na transformação).
    atributos: { agi: 1, for: 3, int: 1, pre: 2, vig: 3 },
    pericias: [
      { nome: 'Ciências', dados: 3, bonus: 15 },
      { nome: 'Intuição', dados: 3, bonus: 10 },
      { nome: 'Investigação', dados: 3, bonus: 15 },
      { nome: 'Medicina', dados: 3, bonus: 15 },
      { nome: 'Ocultismo', dados: 3, bonus: 20 },
      { nome: 'Sobrevivência', dados: 3, bonus: 10 },
      { nome: 'Tecnologia', dados: 3, bonus: 15 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Antena do Medo', descricao: 'Labirinto pode conjurar um ritual na antena. O ritual não faz efeito na hora; em vez disso, fica contido nela. Labirinto pode gastar uma ação padrão para libertar o ritual e gerar o efeito dele (sem precisar gastar ações de conjuração ou outro recurso). A antena só pode conter um ritual por vez.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pancada com Antena', detalhe: 'Corpo a corpo x2', teste: '1d20+10', dano: '2d8+20 impacto' },
      // (círculo reconstruído via DT=10+5×círculo, DT 25 no texto)
      { tipo: 'Padrão', nome: 'Ritual — Consumir Momento (Morte 3)', descricao: 'Labirinto marca um local em alcance médio com um símbolo de Morte invisível. O símbolo capta imagens e sons em alcance médio dele. Labirinto pode gastar uma ação padrão para ver e ouvir qualquer coisa captada pelo símbolo, mesmo estando distante dele. Labirinto pode ter no máximo três símbolos; se criar um quarto, um dos anteriores desaparece. Alternativamente, Labirinto pode gastar uma ação padrão fazer o símbolo explodir em energias entrópicas, que causam 8d8 pontos de dano de Morte em todos os seres captados por ele no momento (Fortitude DT 25 reduz à metade).' },
      // (círculo reconstruído via DT=10+5×círculo, DT 25 no texto)
      { tipo: 'Padrão', nome: 'Ritual — Labirinto Abissal (Conhecimento 3)', descricao: 'Labirinto prende a mente de uma pessoa em alcance médio em um labirinto. O alvo é obrigado a gastar suas ações para se mover em uma direção aleatória até o fim da cena. No início de cada um de seus turnos, o alvo pode fazer um teste de Vontade (DT 25). Se passar, se liberta deste efeito.' },
      // (círculo reconstruído via DT=10+5×círculo, DT 25 no texto)
      { tipo: 'Padrão', nome: 'Ritual — Revelação Sanguínea (Sangue 3)', descricao: 'Labirinto toca em uma superfície e desenha um mapa com gotas de sangue que sinalizam em tempo real a localização e a condição de saúde (ileso, ferido, machucado ou morrendo) de todos os seres em um raio de 1 km a partir dele. Os seres podem fazer um teste de Vontade (DT 25) para evitar este efeito. O mapa dura até o fim da cena.' },
      // (círculo reconstruído via DT=10+5×círculo, DT 25 no texto)
      { tipo: 'Padrão', nome: 'Ritual — Tempestade Caótica (Energia 3)', descricao: 'Labirinto canaliza relâmpagos. Em seguida, dispara um raio que causa 8d10 pontos de dano de Energia em um ser em alcance médio (Reflexos DT 25 reduz à metade). Nas suas próximas rodadas, até o fim da cena, Labirinto pode gastar uma ação padrão para disparar outro raio com o mesmo efeito.' },
      { tipo: 'Padrão', nome: 'Intenção Assassina', descricao: 'Labirinto adormece sua intenção assassina (veja a ficha Labirinto, p. 63) e não pode usá-la novamente até dormir.' },
      { tipo: 'Reação', nome: 'Poder de Intenção', descricao: 'Labirinto pode usar essa habilidade após testemunhar a morte de uma pessoa. Ele absorve as intenções da pessoa morta em alcance curto. Então, recupera pontos de vida de um ser em alcance curto equivalentes à metade dos PV máximos do cadáver.' },
    ],
    notas: 'Enquanto estiver nessa forma, Labirinto é consumido por sua intenção assassina. A transformação não tem limite de duração, mas se Labirinto não matar uma pessoa até o fim da cena, sua intenção assassina adormece e não pode ser usada até Labirinto dormir.',
    fonte: { livro: 'Arquivos Secretos 02', pagina: 64 },
  },
  {
    id: 'as02-jasper',
    nome: 'Jasper',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Jasper Nascimento, agente prodígio criado numa comunidade isolada de albinos liderada pelos próprios pais ("a Efígie Alva"), que fugiu com a irmã Elisa após anos de abuso e experimentos; hoje luta com duas foices acorrentadas ao próprio corpo, ainda assombrado pela morte do companheiro Rafa.',
    sentidos: { percepcao: '2d20+0', iniciativa: '3d20+5' },
    defesa: 23,
    // GAP: o modificador de Vontade sai ilegível na extração — a caixa de texto "Vontade 2O"
    // é seguida de um bloco de caracteres embaralhados (texto decorativo sobreposto na página),
    // então só a contagem de dados ("2d20") é confirmada; o bônus numérico não pôde ser recuperado.
    testes: { fortitude: '2d20+5', reflexos: '3d20+10', vontade: '2d20' },
    pv: 90, pvMachucado: 45,
    atributos: { agi: 3, for: 3, int: 1, pre: 1, vig: 2 },
    pericias: [
      { nome: 'Atletismo', dados: 3, bonus: 10 },
      { nome: 'Religião', dados: 1, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Conduíte Paranormal', descricao: 'O corpo de Jasper já foi alvo de influências e experimentos crueis com o Outro Lado desde criança, portanto desenvolveu certa tolerância aos efeitos causados pelo paranormal. Jasper tem resistência a dano paranormal 5 e +5 em testes de resistência contra rituais e habilidades de criaturas paranormais.' },
      // GAP: um trecho no meio desta descrição sai como um bloco de caracteres embaralhados
      // (texto decorativo sobreposto na página, mesma falha de extração de outras partes desta
      // ficha) entre "apesar de serem armas corpo a corpo," e "combate feitos com elas recebem
      // +5." — o conteúdo exato dessa cláusula não pôde ser recuperado nem por contexto.
      { nome: 'Correntes Acopladas', descricao: 'As foices de Jasper estão acopladas ao seu corpo através de correntes, sendo impossível desarmá-lo delas. Além disso, apesar de serem armas corpo a corpo, [GAP: trecho ilegível] combate feitos com elas recebem +5.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Foices Acorrentadas', detalhe: 'Corpo a corpo x2', teste: '3d20+10', critico: 19, dano: '3d4+10 corte' },
      { tipo: 'Padrão', nome: 'Agredir — Foices Acorrentadas (acopladas)', detalhe: 'Corpo a corpo', teste: '3d20+10', critico: 'x4', dano: '6d4+10 corte' },
      { tipo: 'Movimento', nome: 'Acoplar Foices', descricao: 'Jasper acopla as duas foices, transformando-as em uma única arma, trocando versatilidade por letalidade.' },
      { tipo: 'Livre', nome: 'Puxar pra Briga', descricao: 'Se acertar um ataque com foices acorrentadas, Jasper pode usar as correntes para puxar o alvo para um espaço vazio adjacente à ele. Se o alvo se afastar de Jasper, ele sofre –1d20 em testes de ataque contra outros alvos que não sejam o Jasper por 1 rodada.' },
      // GAP: um trecho no meio desta descrição sai como um bloco de caracteres embaralhados
      // (mesma falha de extração de texto decorativo sobreposto) entre "foices acopladas," e
      // "de todos os alvos." — não recuperável por contexto.
      { tipo: 'Completa', nome: 'Ceifar', descricao: 'Jasper faz um ataque com foices acopladas, [GAP: trecho ilegível] de todos os alvos. Seres atingidos sofrem 4d4 pontos de dano de corte adicional, multiplicado em caso de acerto crítico, e ficam sangrando.' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 70 },
  },
  {
    id: 'as02-lena-viegas',
    nome: 'Lena Viegas',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Lena Viegas, uma mãe que perdeu a filha Aurora nas mãos do parceiro abusivo Cláudio e mergulhou no ocultismo em busca de respostas, hoje uma ocultista camaleônica que se esconde nas sombras e marca corpos com ordens de Sangue.',
    sentidos: { percepcao: '3d20+0', iniciativa: '2d20+5' },
    defesa: 22,
    testes: { fortitude: '1d20+0', reflexos: '2d20+5', vontade: '3d20+10' },
    pv: 80, pvMachucado: 40,
    atributos: { agi: 2, for: 1, int: 3, pre: 3, vig: 1 },
    pericias: [
      { nome: 'Diplomacia', dados: 3, bonus: 5 },
      { nome: 'Investigação', dados: 3, bonus: 5 },
      { nome: 'Ocultismo', dados: 3, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Catalisadores Sofisticados', descricao: 'Os brincos e acessórios utilizados por Lena estão impregnados pelos horrores do Outro Lado. Uma vez por cena, Lena recebe 3d6. Ela pode gastar 1d6, como ação livre, para: Aumentar o dano de um ritual em +1d6. Aumentar a recuperação de PV de um ritual em +1d6. Aumentar a DT de um ritual em +1d6. Lena só pode gastar 1d6 no mesmo ritual, e apenas no momento em que conjurá-lo. No fim da cena, d6 não gastos são perdidos.' },
      { nome: 'Rituais (DT 20)', descricao: 'Lena pode conjurar os rituais a seguir sem pagar o custo de PE, até um limite de 6 PE por conjuração, usando a ação apropriada.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pistola', detalhe: 'À distância x2, curto', teste: '2d20+10', critico: 18, dano: '1d12+10 balístico' },
      // GAP: esta descrição tem três trechos que saem como blocos de caracteres embaralhados
      // (texto decorativo diagonal sobreposto na página 74 — mesmo fenômeno do texto giratório
      // de Labirinto) e não foi encontrada uma caixa "LENA NA SUA MESA" com restatement limpo
      // deste ritual especificamente para recuperar por comparação. O início do efeito (que
      // provavelmente concede invisibilidade/camuflagem, dado o "+15 em testes de Furtividade"
      // logo em seguida) e dois trechos internos sobre objetos carregados não puderam ser
      // recuperados; o restante é verbatim.
      { tipo: 'Padrão', nome: 'Ritual — Esconder dos Olhos (Conhecimento 2)', descricao: '[GAP: início do efeito ilegível] +15 em testes de Furtividade. Como o normal, seres que não possam vê-la ficam desprevenidos contra seus ataques. O efeito termina se ela faz um ataque ou usa uma habilidade hostil. Ações contra objetos livres não dissipam [GAP: trecho ilegível] outros seres). Causar dano indiretamente — por exemplo, preparar explosivos para detonar mais tarde — não é considerado um ataque. Objetos soltos voltam a ser visíveis e objetos apanhados [GAP: trecho ilegível] Qualquer parte de um item carregado que se estenda além do alcance corpo a corpo natural dela se torna visível.' },
      { tipo: 'Padrão', nome: 'Ritual — Flagelo de Sangue (Sangue 2)', descricao: 'Lena toca uma pessoa, gravando uma marca escarificada no corpo dela enquanto profere uma ordem, como "não ataque a mim ou meus aliados", "siga-me" ou "não saia desta sala". A marca dura até o fim da cena. A cada rodada que o alvo desobedecer a ordem, a marca inflige uma dor excruciante, que causa 10d6 pontos de dano de Sangue e deixa o alvo enjoado pela [GAP: trecho ilegível — provável cláusula de duração] turnos seguidos a marca desaparece.' },
      { tipo: 'Padrão', nome: 'Ritual — Cicatrização Discente (Morte 1)', descricao: 'Lena acelera o tempo ao redor das feridas de 1 ser em alcance de toque, que cicatrizam instantaneamente. O alvo recupera 5d8+5 PV, mas envelhece 1 ano automaticamente.' },
      { tipo: 'Padrão', nome: 'Ritual — Eletrocussão Discente (Energia 1)', descricao: 'Lena dispara um poderoso raio que causa 6d6 pontos de dano de Energia em todos os seres e objetos livres em uma linha de 30m (Fortitude reduz à metade).' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 74 },
  },
  {
    id: 'as02-maria-helena-rodrigues',
    nome: 'Maria Helena Rodrigues',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Maria Helena Rodrigues, enfermeira que descobriu prazer mórbido ao presenciar a morte de pacientes e se tornou devota fanática do profeta Kian, hoje capaz de sugar sangue à distância e de aplicar tratamentos médicos arriscados demais para qualquer hospital.',
    sentidos: { percepcao: '2d20+5', iniciativa: '3d20+5' },
    defesa: 21,
    testes: { fortitude: '1d20+5', reflexos: '3d20+10', vontade: '2d20+5' },
    pv: 80, pvMachucado: 40,
    atributos: { agi: 3, for: 1, int: 3, pre: 2, vig: 1 },
    pericias: [
      { nome: 'Enganação', dados: 2, bonus: 10 },
      { nome: 'Medicina', dados: 3, bonus: 5 },
      { nome: 'Ocultismo', dados: 3, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Estágio Terminal', descricao: 'Um surto de adrenalina percorre pelo corpo de Maria ao ver a morte se aproximando. Quando estiver machucada, ela recebe uma ação de movimento extra até o fim da cena.' },
      { nome: 'Fim Precoce', descricao: 'Ao ser responsável pela morte de alguém, Maria recebe +1d20 em todos os seus testes até o fim da cena.' },
      // Recuperado por comparação com a caixa "MARIA NA SUA MESA — Kian Vai Nos Salvar" (mesma
      // cena, texto limpo em 2ª pessoa que restabelece a mesma regra), que preenche o trecho
      // embaralhado ("de até 3º círculo como se o conhecesse (ele não conta para o limite de
      // rituais). Uma vez escolhido") desta ficha.
      { nome: 'Kian Vai Nos Salvar', descricao: 'A fé cega em Kian faz de Maria uma agente com habilidades inesperadas. A critério do mestre, se ela estiver enfrentando um desafio (uma ameaça, um perigo, um enigma etc.) e sua fé em Kian estiver envolvida e motivando-a de alguma forma, ela pode conjurar um único ritual de Conhecimento de até 3º círculo como se o conhecesse (ele não conta para o limite de rituais). Uma vez escolhido o ritual, ele permanece disponível até o fim da cena. Maria não pode ter dois rituais disponíveis na mesma cena, simultaneamente ou não.' },
      { nome: 'Rituais (DT 20)', descricao: 'Maria pode conjurar os rituais a seguir sem pagar seu custo de PE, até um limite de 6 PE por conjuração, usando a ação apropriada.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Pistola', detalhe: 'À distância x2, curto', teste: '2d20+10', critico: 18, dano: '1d12+10 balístico' },
      // GAP: a cláusula de abertura do ritual (execução/alcance/o que Maria faz para acertar o
      // alvo) sai como um extenso bloco de caracteres embaralhados (texto decorativo sobreposto
      // na página 78) sem paralelo limpo em nenhuma caixa "NA SUA MESA" desta seção — não
      // recuperável por contexto. O efeito numérico final é verbatim.
      { tipo: 'Padrão', nome: 'Ritual — Hemofagia (Sangue 2)', descricao: '[GAP: cláusula de abertura ilegível] 6d6 pontos de dano de Sangue (Fortitude reduz à metade). Você então absorve esse sangue, recuperando pontos de vida iguais à metade do dano causado.' },
      // Recuperado por comparação com a caixa "MARIA NA SUA MESA — Tratamento de Emergência"
      // (mesma cena, texto limpo em 2ª pessoa) para o trecho embaralhado no meio desta ação.
      { tipo: 'Padrão', nome: 'Tratamento de Emergência', descricao: 'Maria faz uma aplicação medicinal arriscada para manter 1 ser em alcance de toque na ação, fornecendo 2d10+10 PV temporários. Quando todos os pontos forem perdidos, o ser fica fraco até o fim da cena. O mesmo alvo não pode ser beneficiado novamente por essa habilidade na mesma cena.' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 78 },
  },
  {
    id: 'as02-remi',
    nome: 'Remi',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Riado "Remi" Risco, um músico marcado pelo trauma de perder os amigos para o misterioso "Maestro" (Veríssimo) ainda na juventude, hoje um espadachim obcecado que usa uma harpa acoplada ao braço e rituais de Sangue e Conhecimento para amaldiçoar armas e distorcer aparências.',
    sentidos: { percepcao: '2d20+5', iniciativa: '3d20+5' },
    defesa: 21,
    testes: { fortitude: '2d20+0', reflexos: '2d20+5', vontade: '2d20+10' },
    pv: 90, pvMachucado: 45,
    atributos: { agi: 2, for: 1, int: 3, pre: 2, vig: 2 },
    pericias: [
      { nome: 'Artes', dados: 2, bonus: 10 },
      { nome: 'Ocultismo', dados: 3, bonus: 5 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Sem Espaço para Erro', descricao: 'Uma vez por rodada, ao errar um ataque com sua espada, Remi pode rolar o teste novamente. Se acertar na segunda tentativa, seu ataque é motivado pela determinação e causa +1 dado de dano do mesmo tipo. Além disso, com sua espada, ele faz testes de ataques e dano usando Intelecto, em vez de Força.' },
      { nome: 'Rituais (DT 20)', descricao: 'Remi pode conjurar os rituais a seguir sem pagar seu custo de PE, até um limite de 6 PE por conjuração, usando a ação apropriada.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Espada Enferrujada', detalhe: 'Corpo a corpo x2', teste: '3d20+10', critico: 19, dano: '2d8+10 corte' },
      { tipo: 'Movimento', nome: 'Dedilhar Harpa', descricao: 'Remi toca a harpa acoplada em seu braço, produzindo melodias que reverberam em sua espada, afetando-a de forma paranormal. Ele escolhe um entre os efeitos a seguir que dura até o início de seu próximo turno: +5 no teste de ataque. +5 pontos de dano. +2 na margem de ameaça. Aumenta o alcance do ataque corpo a corpo para 9m.' },
      { tipo: 'Padrão', nome: 'Ritual — Amaldiçoar Arma Discente (Sangue Conhecimento 1)', descricao: 'Remi imbui uma arma ou munições em alcance de toque, fazendo com que causem +2d6 pontos de dano de Sangue ou Conhecimento até o fim da cena.' },
      // Trecho embaralhado recuperado por comparação com o texto limpo e verbatim do ritual
      // "Distorcer Aparência" já transcrito na ficha de Giovanni Opspor (Arquivos Secretos 01,
      // p. 33) — mesmo ritual oficial de Sangue 1, texto idêntico, só o sujeito muda.
      { tipo: 'Padrão', nome: 'Ritual — Distorcer Aparência (Sangue 1)', descricao: 'Remi modifica sua aparência de modo a parecer outra pessoa até o fim da cena. Isso inclui altura, peso, tom de pele, cor de cabelo, timbre de voz, impressão digital, córnea etc. Ele recebe +10 em testes de Enganação para disfarce, mas não recebe habilidades da nova forma nem modifica suas demais estatísticas.' },
      { tipo: 'Padrão', nome: 'Ritual — Desfazer Sinapses Discente (Conhecimento 1)', descricao: 'Remi faz com que a entidade do Conhecimento inexista bilhões de neurônios de dentro do cérebro de até 5 seres em alcance longo, causando a angústia inexplicável do vazio. Os alvos sofrem 3d6+3 pontos de dano de Conhecimento e ficam frustrados por uma rodada. Se passar em um teste de resistência de Vontade, sofre apenas metade do dano e evita a condição. O alvo precisa ter um cérebro; o efeito se reflete como uma dor de cabeça severa que faz sangrar levemente pelos olhos, narinas, orelhas e boca.' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 82 },
  },
  {
    id: 'as02-tuco-belez',
    nome: 'Tuco Belez',
    vd: 80,
    categoria: 'Pessoa',
    tamanho: 'Médio',
    flavorText: 'Tuco Belez, ex-militar e mercenário que sobreviveu a uma arena clandestina de lutas contra o lutador Colosso e criaturas de Sangue, hoje um combatente tático brutal com foices acorrentadas e pistola.',
    sentidos: { percepcao: '1d20+5', iniciativa: '1d20+10' },
    defesa: 24,
    testes: { fortitude: '3d20+5', reflexos: '1d20+10', vontade: '2d20+5' },
    pv: 90, pvMachucado: 45,
    atributos: { agi: 1, for: 3, int: 1, pre: 2, vig: 3 },
    pericias: [
      { nome: 'Atletismo', dados: 3, bonus: 10 },
      { nome: 'Furtividade', dados: 1, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    habilidades: [
      { nome: 'Aí Sim, Neném', descricao: 'Tuco recebe +1d20 em testes de ataque contra alvos que não estão engajados em combate.' },
      { nome: 'Sentido Tático', descricao: 'Tuco, mesmo que pareça distraído, jamais abandona o treinamento recebido em sua carreira militar. Tuco é imune à condição desprevenido e um alvo que sofra dano dele falha automaticamente em testes de Furtividade contra ele por 1 rodada.' },
    ],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Foices Acorrentadas', detalhe: 'Corpo a corpo x2', teste: '3d20+10', critico: 19, dano: '2d6+10 impacto' },
      { tipo: 'Padrão', nome: 'Agredir — Pistola', detalhe: 'À distância x2, curto', teste: '1d20+10', critico: 18, dano: '1d12+10 balístico' },
      { tipo: 'Livre', nome: 'Imobilização Militar', descricao: 'Uma vez por rodada, se acertar um ataque de porrada, Tuco tenta agarrar o alvo (teste +12).' },
      { tipo: 'Movimento', nome: 'Movimentação Tática', descricao: 'Se Tuco se mover em direção a uma cobertura ou um inimigo, ele pode percorrer o dobro do seu deslocamento.' },
      { tipo: 'Completa', nome: 'Marteladas', descricao: 'Tuco desfere uma série de porradas esmagadoras contra um ser adjacente. O alvo sofre 6d6+20 pontos de dano de impacto (Fortitude DT 20 reduz à metade).' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 86 },
  },
  {
    id: 'as02-juan',
    nome: 'Juan',
    vd: 80,
    categoria: 'Pessoa',
    // O livro imprime "MÉDIA" (não "MÉDIO") tanto para Juan quanto para Juan Diabólico —
    // transcrito exatamente como sai nas duas fichas.
    tamanho: 'Média',
    flavorText: 'Juan Davo, um seguidor manipulado e descartado desde a infância, que fez um pacto com o Trono de Sangue para deixar de ser "apenas mais uma peça"; capaz de invocar uma armadura de sangue diabólica que o transforma em algo ainda mais aterrorizante.',
    sentidos: { percepcao: '3d20+5', iniciativa: '3d20+10' },
    defesa: 20,
    testes: { fortitude: '1d20+5', reflexos: '2d20+10', vontade: '3d20+10' },
    pv: 100, pvMachucado: 50,
    // NOTA: atributos sem rótulo no PDF, reconstruídos pela ordem AGI/INT/VIG (3) + FOR/PRE
    // (2) confirmada em outras fichas da mesma seção — veja nota no topo do arquivo.
    atributos: { agi: 2, for: 2, int: 1, pre: 3, vig: 2 },
    pericias: [
      { nome: 'Atletismo', dados: 2, bonus: 5 },
      { nome: 'Enganação', dados: 3, bonus: 5 },
      { nome: 'Intimidação', dados: 3, bonus: 10 },
      { nome: 'Ocultismo', dados: 2, bonus: 10 },
    ],
    deslocamento: '9m | 6',
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Facada', detalhe: 'Corpo a corpo x2', teste: '2d20+10', critico: '19/x2', dano: '2d4+10 perfuração + 2d10 Sangue' },
      { tipo: 'Reação', nome: 'Faca Predadora', descricao: 'Uma vez por rodada, quando Juan acerta um ataque, ele recupera 2d10 PV. Qualquer ponto de vida recuperado que exceda seus PV máximos se torna ponto de vida temporário.' },
      { tipo: 'Padrão', nome: 'Armadura de Sangue Diabólica', descricao: 'Juan conjura sua Armadura de Sangue Diabólica (veja a ficha Juan Diabólico, p. 92).' },
      { tipo: 'Padrão', nome: 'Ritual — Descansar Discente (Sangue 2)', descricao: 'Juan manifesta lacerações na pele e órgãos de um alvo em alcance de toque, que sofre 10d8 pontos de dano (metade corte, metade Sangue) e fica com hemorragia severa: no início de cada turno dele, o alvo deve fazer um teste de Fortitude (DT 20); se falhar, sofre 4d8 pontos de dano de Sangue. Se passar nesse teste dois turnos seguidos, a hemorragia é estancada.' },
      { tipo: 'Padrão', nome: 'Ritual — Perturbação Discente (Conhecimento 2)', descricao: 'Juan dá uma das ordens a seguir para um ser em alcance curto (Vontade DT 20 anula). Fuja: o alvo gasta seu próximo turno inteiro se afastando de você. Largue: o alvo solta quaisquer itens que esteja segurando e não pode pegá-los por 1 rodada. Senta: o alvo se senta no chão e não pode se levantar por 1 rodada. Venha: o alvo gasta seu próximo turno inteiro se aproximando de você. Sofra: o alvo sofre 3d8 pontos de dano de Conhecimento e fica abalado por 1 rodada.' },
      { tipo: 'Padrão', nome: 'Ritual — Vínculo de Sangue (Sangue 4)', descricao: 'Juan manifesta um símbolo no seu corpo e no corpo de um ser em alcance curto que dura até o fim da cena. Alvos involuntários têm direito a um teste de Fortitude (DT 20) para evitar o efeito. Sempre que você sofre dano, metade do dano é transferido para o alvo. Você pode conjurar o ritual com efeito inverso, fazendo com que você receba metade do dano do alvo.' },
      { tipo: 'Reação', nome: 'Poder de Intenção', descricao: 'Se Juan obedecer a Ele, ao fazer um teste, em vez de rolar os dados, Juan pode determinar que seja um sucesso automático (como se tivesse rolado 20 natural). Juan pode fazer isso apenas uma vez por cena e precisa fazê-lo na mesma cena em que obedeceu uma vontade d\'Ele.' },
    ],
    fonte: { livro: 'Arquivos Secretos 02', pagina: 91 },
  },
  {
    id: 'as02-juan-diabolico',
    nome: 'Juan Diabólico',
    vd: 140,
    categoria: 'Pessoa',
    tamanho: 'Média',
    flavorText: 'A forma diabólica de Juan, envolta numa armadura de sangue viva que amplia sua sede de violência e o poder de seus rituais de Sangue e Conhecimento, até que ele mate ou a transformação adormeça.',
    sentidos: { percepcao: '3d20+10', iniciativa: '3d20+15' },
    defesa: 31,
    testes: { fortitude: '1d20+10', reflexos: '2d20+15', vontade: '3d20+15' },
    pv: 280, pvMachucado: 140,
    // NOTA: mesma reconstrução de atributos sem rótulo explicada no topo do arquivo; os 5
    // números batem exatamente com os de Juan (atributos não mudam na transformação).
    atributos: { agi: 2, for: 2, int: 1, pre: 3, vig: 2 },
    pericias: [
      { nome: 'Atletismo', dados: 2, bonus: 10 },
      { nome: 'Enganação', dados: 3, bonus: 10 },
      { nome: 'Intimidação', dados: 3, bonus: 15 },
      { nome: 'Ocultismo', dados: 2, bonus: 15 },
    ],
    deslocamento: '9m | 6',
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir — Facada', detalhe: 'Corpo a corpo x2', teste: '2d20+15', critico: '19/x2', dano: '4d4+20 perfuração + 4d10 Sangue' },
      { tipo: 'Reação', nome: 'Faca Predadora', descricao: 'Uma vez por rodada, quando Juan acerta um ataque, ele recupera 4d10 PV. Qualquer ponto de vida recuperado que exceda seus PV máximos se torna ponto de vida temporário.' },
      { tipo: 'Padrão', nome: 'Armadura de Sangue Diabólica', descricao: 'Juan abandona sua forma diabólica (veja a ficha Juan, p. 91) e não pode usá-la novamente até dormir.' },
      // (círculo reconstruído via DT=10+5×círculo, DT 25 no texto)
      { tipo: 'Padrão', nome: 'Ritual — Descansar Discente Diabólico (Sangue 3)', descricao: 'Juan manifesta lacerações na pele e órgãos de um alvo em alcance curto, que sofre 12d8 pontos de dano (metade corte, metade Sangue) e fica com hemorragia severa: no início de cada turno dele, o alvo deve fazer um teste de Fortitude (DT 25); se falhar, sofre 5d8 pontos de dano de Sangue. Se passar nesse teste dois turnos seguidos, a hemorragia é estancada.' },
      // (círculo reconstruído via DT=10+5×círculo, DT 25 no texto)
      { tipo: 'Padrão', nome: 'Ritual — Perturbação Discente Diabólica (Conhecimento 3)', descricao: 'Juan dá uma das ordens a seguir para um ser em alcance médio (Vontade DT 25 anula). Fuja: o alvo gasta seu próximo turno inteiro se afastando de você. Largue: o alvo solta quaisquer itens que esteja segurando e não pode pegá-los por 1 rodada. Senta: o alvo se senta no chão e não pode se levantar por 1 rodada. Venha: o alvo gasta seu próximo turno inteiro se aproximando de você. Sofra: o alvo sofre 5d8 pontos de dano de Conhecimento e fica abalado por 1 rodada.' },
      // (círculo reconstruído via DT=10+5×círculo, DT 25 no texto)
      { tipo: 'Padrão', nome: 'Ritual — Vínculo de Sangue Diabólico (Sangue 3)', descricao: 'Juan manifesta um símbolo no seu corpo e no corpo de um ser em alcance médio que dura até o fim da cena. Alvos involuntários têm direito a um teste de Fortitude (DT 25) para evitar o efeito. Sempre que você sofre dano, metade do dano é transferido para o alvo. Você pode conjurar o ritual com efeito inverso, fazendo com que você receba metade do dano do alvo.' },
      { tipo: 'Reação', nome: 'Poder de Intenção', descricao: 'Se Juan obedecer a Ele, ao fazer um teste, em vez de rolar os dados, Juan pode determinar que seja um sucesso automático (como se tivesse rolado 20 natural). Juan pode fazer isso apenas uma vez por cena e precisa fazê-lo na mesma cena em que obedeceu uma vontade d\'Ele.' },
    ],
    notas: 'Enquanto estiver nessa forma, Juan fica aterrorizante, sendo consumido por sua sede de sangue. A transformação não tem limite de duração, mas se Juan não matar uma pessoa até o fim da cena, sua forma diabólica adormece e não pode ser usada até Juan dormir.',
    fonte: { livro: 'Arquivos Secretos 02', pagina: 92 },
  },
];
