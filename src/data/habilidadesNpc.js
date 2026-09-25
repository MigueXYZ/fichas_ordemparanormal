/**
 * Habilidades próprias para NPCs gerados (pessoas e ocultistas). Seguem o
 * modelo das fichas de "Pessoa" do Livro Base (Ameaças da Realidade: Bandido,
 * Capanga, Assassino, Comandante Mercenário, Iniciado, Líder de Culto…): um
 * NPC não tem classe, trilha nem NEX — tem VD e umas poucas habilidades que
 * são só dele.
 *
 * Cada habilidade tem `vdMin` (não sai abaixo disso) e os números vêm do VD,
 * para ficar sempre balanceada:
 *   {DT}    DT de resistência (15 no VD 20, 25 no VD 140 — como o livro)
 *   {XD6}   dados extra de dano (1d6 no VD 10, 2d6 no VD 20, 4d6 no VD 80)
 *   {XD6_METADE} metade desses dados (para dano que sai "de graça", em reação)
 *   {BONUS} bónus fixo pequeno (+2 a +5)
 *   {RD}    resistência a dano (2, ou 5 a partir do VD 60)
 *   {CURA}  pontos de vida recuperados
 *   {PV}    PV com que fica ao "recusar a morte"
 * `+1d20` é o "+O" do livro (um dado a mais no teste).
 *
 * `tipo`: Passiva (vai para Habilidades) ou Livre/Movimento/Padrão/Completa/
 * Reação (vai para Ações, como no livro).
 */

/** Habilidades temáticas — cada perfil de NPC tem 2 a 3 `temas`. */
export const HABILIDADES_TEMA = {
  combate: [
    { nome: 'Ataque em Movimento', tipo: 'Completa', vdMin: 40, descricao: 'Percorre o seu deslocamento e ataca em qualquer ponto durante o movimento.' },
    { nome: 'Tiro Certeiro', tipo: 'Movimento', vdMin: 20, descricao: 'Aponta com calma: o próximo ataque à distância nesta rodada recebe +1d20 e ignora cobertura leve.' },
    { nome: 'Golpe Atordoante', tipo: 'Padrão', vdMin: 40, descricao: 'Faz um ataque corpo a corpo; se acertar, além do dano o alvo fica atordoado por 1 rodada (Fortitude DT {DT} evita).' },
    { nome: 'Embalo', tipo: 'Passiva', vdMin: 80, descricao: 'Se causar dano a um inimigo, o próximo ataque recebe +1d20 e, se acertar, causa mais um dado de dano do mesmo tipo.' },
    { nome: 'Colete', tipo: 'Passiva', vdMin: 40, descricao: 'Usa proteção por baixo da roupa: resistência a balístico, corte, impacto e perfuração {RD}.' },
  ],
  resistencia: [
    { nome: 'Teimoso', tipo: 'Reação', vdMin: 60, descricao: 'Uma vez por cena, ignora um efeito que exija teste de resistência ou reduz à metade um dano que acabou de sofrer.' },
    { nome: 'Duro de Roer', tipo: 'Passiva', vdMin: 20, descricao: 'Da primeira vez numa cena que ficaria com 0 PV, fica com 1 PV em vez disso.' },
    { nome: 'Evasão', tipo: 'Passiva', vdMin: 60, descricao: 'Quando sofre um efeito que permite um teste de Reflexos para reduzir o dano à metade, não sofre dano algum se passar.' },
  ],
  crime: [
    { nome: 'Ataque Furtivo', tipo: 'Livre', vdMin: 10, descricao: 'Uma vez por rodada, causa +{XD6} de dano com ataques corpo a corpo, ou à distância em alcance curto, contra alvos desprevenidos ou que esteja a flanquear.' },
    { nome: 'Golpe Baixo', tipo: 'Livre', vdMin: 20, descricao: 'Uma vez por cena, atira areia, sal ou spray aos olhos de um alvo adjacente: fica cego até ao fim do seu próximo turno (Reflexos DT {DT} evita).' },
    { nome: 'Mãos Leves', tipo: 'Padrão', vdMin: 10, descricao: 'Tira um objeto pequeno a um ser adjacente (teste de Crime contra a Percepção do alvo); se passar por 5 ou mais, o alvo nem dá por isso.' },
    { nome: 'Mão na Boca', tipo: 'Livre', vdMin: 60, descricao: 'Ao fazer um ataque corpo a corpo furtivo contra um ser desprevenido, pode também agarrá-lo; enquanto estiver agarrado, o alvo não consegue falar nem gritar.' },
  ],
  furtividade: [
    { nome: 'Desaparecer na Multidão', tipo: 'Movimento', vdMin: 20, descricao: 'Com gente à volta ou pouca luz, afasta-se e fica escondido; só é encontrado com Percepção DT {DT}.' },
    { nome: 'Passos Leves', tipo: 'Passiva', vdMin: 10, descricao: '+1d20 em Furtividade e não sofre penalidade por se mover à velocidade normal enquanto se esconde.' },
  ],
  social: [
    { nome: 'Lábia', tipo: 'Padrão', vdMin: 10, descricao: 'Uma vez por cena, convence um humano em alcance curto a hesitar: não o ataca nesta rodada (Vontade DT {DT} evita; não funciona se já tiver sido atacado por ele).' },
    { nome: 'Rede de Contactos', tipo: 'Passiva', vdMin: 10, descricao: 'Conhece sempre alguém: uma vez por sessão, consegue uma informação, um favor ou um objeto comum em poucas horas.' },
    { nome: 'Olhar Duro', tipo: 'Padrão', vdMin: 20, descricao: 'Encara um humano em alcance curto: fica abalado até ao fim da cena (Vontade DT {DT} evita).' },
    { nome: 'Sangue-Frio', tipo: 'Passiva', vdMin: 20, descricao: '+1d20 em Vontade contra medo e contra dano mental.' },
  ],
  lideranca: [
    { nome: 'Coordenar', tipo: 'Movimento', vdMin: 40, descricao: 'Um aliado em alcance curto pode, como reação, mover-se até metade do deslocamento ou fazer um ataque.' },
    { nome: 'Ordens', tipo: 'Movimento', vdMin: 100, descricao: 'Grita ordens aos aliados em alcance médio: recebem +1d20 em testes de perícia e causam mais um dado de dano do mesmo tipo até ao fim da cena.' },
  ],
  investigacao: [
    { nome: 'Olho para Detalhes', tipo: 'Passiva', vdMin: 10, descricao: 'Não pode ser surpreendido e nota sempre objetos escondidos quando procura com calma.' },
    { nome: 'Ler o Adversário', tipo: 'Movimento', vdMin: 40, descricao: 'Estuda um inimigo em alcance curto: até ao fim da cena recebe +{BONUS} nos ataques contra ele e +{BONUS} na Defesa contra os ataques dele.' },
    { nome: 'Preparado', tipo: 'Livre', vdMin: 10, descricao: 'Uma vez por cena, tira do bolso ou da mochila o objeto comum de que precisa (corda, lanterna, fita, isqueiro…).' },
  ],
  medicina: [
    { nome: 'Primeiros Socorros', tipo: 'Padrão', vdMin: 10, descricao: 'Estabiliza um ser adjacente que esteja a morrer, ou cura {CURA} PV a um aliado adjacente (uma vez por ser por cena).' },
    { nome: 'Mãos Firmes', tipo: 'Reação', vdMin: 40, descricao: 'Quando um aliado adjacente fica com 0 PV, estabiliza-o de imediato.' },
    { nome: 'Sedativo', tipo: 'Padrão', vdMin: 40, descricao: 'Injeta um sedativo num ser adjacente agarrado, desprevenido ou indefeso: fica lento por 1d4 rodadas (Fortitude DT {DT} evita) e inconsciente se falhar por 5 ou mais.' },
  ],
  fe: [
    { nome: 'Palavra de Conforto', tipo: 'Padrão', vdMin: 10, descricao: 'Um aliado em alcance curto deixa de estar abalado ou apavorado.' },
    { nome: 'Fé Inabalável', tipo: 'Passiva', vdMin: 20, descricao: '+1d20 em Vontade; efeitos de medo que o afetariam por mais de 1 rodada só o afetam por 1.' },
    { nome: 'Proteção', tipo: 'Reação', vdMin: 60, descricao: 'Uma vez por cena, quando um aliado em alcance curto sofre dano paranormal, reduz esse dano em {XD6}.' },
  ],
  tecnica: [
    { nome: 'Sabotagem', tipo: 'Padrão', vdMin: 20, descricao: 'Desliga um aparelho eletrónico, fechadura elétrica ou veículo em alcance curto até ao fim da cena.' },
    { nome: 'Engenhoca', tipo: 'Padrão', vdMin: 40, descricao: 'Uma vez por cena, atira um dispositivo improvisado (fumo, flash, estática): os seres a até 3m de um ponto em alcance curto ficam cegos por 1 rodada (Reflexos DT {DT} evita).' },
  ],
  sobrevivencia: [
    { nome: 'Rastreador', tipo: 'Passiva', vdMin: 10, descricao: 'Segue rastos de pessoas ou animais com dias; nunca se perde em terreno natural.' },
    { nome: 'Conhecer o Terreno', tipo: 'Movimento', vdMin: 20, descricao: 'Em terreno natural, move-se sem penalidade por terreno difícil e recebe +{BONUS} na Defesa até ao início do seu próximo turno.' },
    { nome: 'Armadilha', tipo: 'Completa', vdMin: 40, descricao: 'Prepara uma armadilha num espaço adjacente: o primeiro inimigo que lá entre sofre {XD6} de dano e fica imóvel por 1 rodada (Reflexos DT {DT} evita ambos).' },
  ],
  fuga: [
    { nome: 'Fuga', tipo: 'Movimento', vdMin: 10, descricao: 'Recua até o dobro do deslocamento sem provocar ataques de oportunidade.' },
    { nome: 'Adrenalina', tipo: 'Livre', vdMin: 40, descricao: 'Uma vez por cena, ganha uma ação padrão extra neste turno.' },
  ],
};

/** Habilidades de assinatura — uma ou duas por perfil, só dele. */
export const ASSINATURAS_PERFIL = {
  detetive: [
    { nome: 'Faro de Polícia', tipo: 'Passiva', vdMin: 10, descricao: '+1d20 em Intuição para perceber mentiras, e ninguém consegue esconder uma arma de si sem passar em Crime DT {DT}.' },
    { nome: 'Mãos ao Alto', tipo: 'Padrão', vdMin: 20, descricao: 'Aponta a arma a um ser em alcance curto: se o alvo agir contra si antes do fim da próxima rodada, faz um ataque à distância contra ele como reação (uma vez por cena).' },
  ],
  enfermeira: [
    { nome: 'Turno da Noite', tipo: 'Passiva', vdMin: 10, descricao: 'Anos de noites em claro: não sofre penalidades por cansaço nem por pouca luz.' },
    { nome: 'Triagem', tipo: 'Movimento', vdMin: 20, descricao: 'Vê de relance o estado de todos os seres em alcance curto (PV aproximados e condições) e, uma vez por cena, cura {CURA} PV a um aliado adjacente.' },
  ],
  padre: [
    { nome: 'Exortação', tipo: 'Padrão', vdMin: 20, descricao: 'Ergue o símbolo da sua fé: uma criatura paranormal em alcance curto faz Vontade (DT {DT}) ou não se pode aproximar de si até ao fim da próxima rodada.' },
    { nome: 'Confidente', tipo: 'Passiva', vdMin: 10, descricao: 'As pessoas contam-lhe coisas: +1d20 em Diplomacia e Intuição com quem o conhece.' },
  ],
  hacker: [
    { nome: 'Porta dos Fundos', tipo: 'Completa', vdMin: 20, descricao: 'Com um telemóvel ou portátil, desliga câmaras, abre portas elétricas ou corta a luz de um edifício ligado à rede.' },
    { nome: 'Rasto Digital', tipo: 'Passiva', vdMin: 10, descricao: 'Com 10 minutos e internet, descobre a morada, os contactos e os movimentos recentes de uma pessoa comum.' },
  ],
  seguranca: [
    { nome: 'Ninguém Passa', tipo: 'Reação', vdMin: 20, descricao: 'Quando um inimigo sai de um espaço adjacente, faz um ataque corpo a corpo contra ele; se acertar, o inimigo pára ali.' },
    { nome: 'Pôr na Rua', tipo: 'Livre', vdMin: 20, descricao: 'Quando acerta um ataque corpo a corpo, pode empurrar o alvo 3m ou derrubá-lo (Fortitude DT {DT} evita).' },
  ],
  jornalista: [
    { nome: 'Fonte Anónima', tipo: 'Passiva', vdMin: 10, descricao: 'Uma vez por sessão, recebe uma pista verdadeira de um contacto que não pode revelar.' },
    { nome: 'Está a Ser Gravado', tipo: 'Padrão', vdMin: 10, descricao: 'Levanta o telemóvel a filmar: humanos em alcance curto que se preocupem com a reputação fazem Vontade (DT {DT}) ou não atacam nesta rodada.' },
  ],
  cacador: [
    { nome: 'Tiro de Caçador', tipo: 'Completa', vdMin: 20, descricao: 'Faz um ataque à distância com +1d20 contra um alvo desprevenido ou imóvel; se acertar, causa +{XD6} de dano.' },
    { nome: 'Faro do Mato', tipo: 'Passiva', vdMin: 10, descricao: 'Sente a presença de animais e criaturas a até 30m em terreno natural e nunca é surpreendido lá.' },
  ],
  legista: [
    { nome: 'Conhecer o Corpo', tipo: 'Passiva', vdMin: 10, descricao: 'Ao examinar um cadáver, sabe a causa e a hora aproximada da morte, e se houve algo de estranho (Ocultismo DT {DT} para mais detalhes).' },
    { nome: 'Ponto Fraco', tipo: 'Movimento', vdMin: 40, descricao: 'Estuda a anatomia de um humano ou humanoide: os seus ataques contra ele têm margem de ameaça +2 até ao fim da cena.' },
  ],
  estudante: [
    { nome: 'Li Sobre Isto', tipo: 'Livre', vdMin: 10, descricao: 'Uma vez por cena, lembra-se de um facto útil sobre um lugar, símbolo ou criatura (o Mestre dá uma informação verdadeira).' },
    { nome: 'Corre!', tipo: 'Movimento', vdMin: 10, descricao: 'Percorre o dobro do deslocamento e recebe +{BONUS} na Defesa até ao seu próximo turno.' },
  ],
  militar: [
    { nome: 'Fogo de Supressão', tipo: 'Completa', vdMin: 40, descricao: 'Dispara sobre uma área de 6m em alcance médio: quem lá estiver sofre {XD6} de dano balístico (Reflexos DT {DT} evita) e fica com –1d20 nos ataques na próxima rodada.' },
    { nome: 'Disciplina', tipo: 'Passiva', vdMin: 20, descricao: '+1d20 em Iniciativa e não pode ser flanqueado.' },
  ],
  vidente: [
    { nome: 'Ler as Cartas', tipo: 'Padrão', vdMin: 10, descricao: 'Tira uma carta para um ser em alcance curto e rola 1d6: com 1–3 o próximo teste do alvo tem –1d20, com 4–6 tem +1d20. Sabe sempre qual saiu.' },
    { nome: 'Pressentimento', tipo: 'Reação', vdMin: 20, descricao: 'Uma vez por cena, quando é alvo de um ataque, já o esperava: +{BONUS} na Defesa contra esse ataque.' },
  ],
  motorista: [
    { nome: 'Conheço um Atalho', tipo: 'Passiva', vdMin: 10, descricao: 'Numa perseguição ou fuga de carro recebe +1d20 em Pilotagem, e chega sempre primeiro a qualquer ponto da cidade.' },
    { nome: 'Travagem Brusca', tipo: 'Reação', vdMin: 20, descricao: 'Ao volante, quando o veículo é atacado, faz um teste de Pilotagem; se superar o teste de ataque, o ataque falha.' },
  ],
  contrabandista: [
    { nome: 'Sempre uma Saída', tipo: 'Movimento', vdMin: 20, descricao: 'Uma vez por cena, sai por uma saída que ninguém tinha visto (porta de serviço, alçapão, janela) e fica fora de vista.' },
    { nome: 'Mercadoria', tipo: 'Passiva', vdMin: 10, descricao: 'Arranja quase tudo — armas, documentos, medicamentos — em 1d4 dias, pelo preço certo.' },
  ],
  psicologa: [
    { nome: 'Voz Calma', tipo: 'Padrão', vdMin: 10, descricao: 'Um aliado em alcance curto recupera {CURA} de Sanidade ou deixa de estar abalado ou apavorado (uma vez por ser por cena).' },
    { nome: 'Ler as Pessoas', tipo: 'Passiva', vdMin: 10, descricao: '+1d20 em Intuição; percebe sempre se alguém está sob um efeito mental paranormal.' },
  ],
};

/** Habilidades de ocultista por elemento (além de Conjurador). */
export const HABILIDADES_ELEMENTO_CULTO = {
  Sangue: [
    { nome: 'Sangue por Poder', tipo: 'Livre', vdMin: 20, descricao: 'Sofre 1d6 de dano para aumentar em +{BONUS} a DT do próximo ritual de Sangue que conjurar nesta rodada.' },
    { nome: 'Carne Enxertada', tipo: 'Passiva', vdMin: 40, descricao: 'Resistência a corte, impacto e perfuração {RD}.' },
    { nome: 'Frenesim', tipo: 'Livre', vdMin: 60, descricao: 'Quando fica machucado, faz um ataque corpo a corpo extra por rodada até ao fim da cena, mas deixa de poder conjurar rituais.' },
    { nome: 'Beber a Ferida', tipo: 'Reação', vdMin: 80, descricao: 'Quando causa dano com um ataque corpo a corpo, recupera PV iguais a metade desse dano.' },
  ],
  Morte: [
    { nome: 'Tempo Emprestado', tipo: 'Reação', vdMin: 40, descricao: 'Uma vez por cena, quando ia sofrer dano, sai do fluxo do tempo e não o sofre; perde a próxima ação de movimento.' },
    { nome: 'Lodo nas Veias', tipo: 'Passiva', vdMin: 20, descricao: 'Imune a venenos e doenças; resistência a Morte {RD}.' },
    { nome: 'Envelhecer', tipo: 'Padrão', vdMin: 60, descricao: 'Toca num ser adjacente: sofre {XD6} de dano de Morte e fica fatigado (Fortitude DT {DT} reduz o dano à metade e evita a fadiga).' },
    { nome: 'Recusar o Fim', tipo: 'Passiva', vdMin: 100, descricao: 'Da primeira vez numa cena que ficaria com 0 PV, fica com {PV} PV em vez disso.' },
  ],
  Conhecimento: [
    { nome: 'Sabia que Vinhas', tipo: 'Passiva', vdMin: 20, descricao: 'Não pode ser surpreendido e recebe +1d20 em Iniciativa.' },
    { nome: 'Sigilo de Anulação', tipo: 'Reação', vdMin: 60, descricao: 'Uma vez por cena, quando um ritual é conjurado em alcance curto, o conjurador faz Ocultismo (DT {DT}); se falhar, o ritual não tem efeito, mas os PE são gastos.' },
    { nome: 'Segredo Exposto', tipo: 'Padrão', vdMin: 20, descricao: 'Diz em voz alta um segredo de um ser em alcance curto: fica frustrado (–1d20 em testes de perícia) até ao fim da cena (Vontade DT {DT} evita).' },
    { nome: 'Mente Fechada', tipo: 'Passiva', vdMin: 40, descricao: 'Resistência a Conhecimento {RD}; não pode ter a mente lida nem controlada.' },
  ],
  Energia: [
    { nome: 'Sobrecarga', tipo: 'Livre', vdMin: 20, descricao: 'Uma vez por rodada, o próximo ritual de Energia que conjurar e cause dano causa +{XD6_METADE} de dano.' },
    { nome: 'Corpo Estático', tipo: 'Reação', vdMin: 40, descricao: 'Quando um inimigo o acerta com um ataque corpo a corpo, esse inimigo sofre {XD6_METADE} de dano de Energia.' },
    { nome: 'Caos Imprevisível', tipo: 'Livre', vdMin: 60, descricao: 'Uma vez por cena, rola 1d6 antes de um ataque: com 1–2 o ataque falha, com 3–6 causa o dobro do dano.' },
    { nome: 'Salto de Fase', tipo: 'Movimento', vdMin: 40, descricao: 'Desaparece num clarão e reaparece num ponto que consiga ver em alcance curto.' },
  ],
  Medo: [
    { nome: 'Sussurros', tipo: 'Padrão', vdMin: 20, descricao: 'Um ser em alcance curto faz Vontade (DT {DT}) ou fica abalado; se já estava abalado, fica apavorado.' },
    { nome: 'Rosto Esquecido', tipo: 'Livre', vdMin: 40, descricao: 'Uma vez por cena, quem o vê esquece o seu rosto assim que desvia o olhar: fica escondido até atacar.' },
    { nome: 'Além do Medo', tipo: 'Passiva', vdMin: 20, descricao: 'Imune a medo e a dano mental de Presença Perturbadora.' },
    { nome: 'Presença Incómoda', tipo: 'Passiva', vdMin: 80, descricao: 'Da primeira vez numa cena que um ser o tenta atacar, faz Vontade (DT {DT}) ou perde essa ação.' },
  ],
};

/** Habilidades do papel do cultista no culto. */
export const HABILIDADES_PAPEL_CULTO = {
  recrutador: [
    { nome: 'Palavras Doces', tipo: 'Padrão', vdMin: 10, descricao: 'Um humano em alcance curto que o ouça faz Vontade (DT {DT}) ou fica fascinado por 1 rodada.' },
  ],
  sacrificador: [
    { nome: 'Golpe Ritual', tipo: 'Livre', vdMin: 20, descricao: 'Uma vez por rodada, contra um alvo caído, agarrado ou desprevenido, causa +{XD6} de dano.' },
  ],
  escriba: [
    { nome: 'Ritual Preparado', tipo: 'Livre', vdMin: 60, descricao: 'Uma vez por cena, conjura um ritual com execução padrão como ação livre (já o tinha deixado preparado).' },
  ],
  guardiao: [
    { nome: 'Vigia', tipo: 'Passiva', vdMin: 10, descricao: 'Não pode ser surpreendido e recebe +1d20 em Percepção para notar intrusos.' },
    { nome: 'Escudo Humano', tipo: 'Reação', vdMin: 40, descricao: 'Quando um aliado adjacente é atacado, passa a ser o alvo desse ataque.' },
  ],
  profeta: [
    { nome: 'Sermão', tipo: 'Movimento', vdMin: 40, descricao: 'Os aliados do culto em alcance médio recebem +1d20 em testes e ficam imunes a medo até ao fim da próxima rodada.' },
  ],
  infiltrado: [
    { nome: 'Disfarce Perfeito', tipo: 'Passiva', vdMin: 10, descricao: 'Passa por quem finge ser; só é desmascarado com Intuição DT {DT}.' },
    { nome: 'Ataque Furtivo', tipo: 'Livre', vdMin: 20, descricao: 'Uma vez por rodada, causa +{XD6} de dano com ataques corpo a corpo, ou à distância em alcance curto, contra alvos desprevenidos ou que esteja a flanquear.' },
  ],
};
