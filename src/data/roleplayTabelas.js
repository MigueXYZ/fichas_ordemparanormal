// Tabelas de Interpretação, Comportamentos Estranhos, Descrições Visuais e Habilidades Especiais
// para o Gerador de Personagens, NPCs e Criaturas de Ordem Paranormal RPG.

export const COMPORTAMENTOS_ESTRANHOS_AGENTES = [
  'Murmura equações de probabilidade ou cálculos de distância baixinho sempre que está sob tensão.',
  'Evita contacto visual direto, focando o olhar sempre nas sombras atrás da pessoa com quem fala.',
  'Conta compulsivamente os batimentos cardíacos dos outros ao tocar no pulso ou ao apertar as mãos.',
  'Verifica obsessivamente todas as portas e saídas de um ambiente três vezes antes de se sentar.',
  'Tem o tique de tocar em superfícies frias de metal para ter a certeza de que a realidade é sólida.',
  'Sussurra desculpas e preces a entidades invisíveis sempre que fere um ser vivo.',
  'Cheira o ar com frequência e afirma sentir o odor de ozono, enxofre ou cinzas quando o paranormal se aproxima.',
  'Anota compulsivamente símbolos, coordenadas e frases desconexas em guardanapos e braços.',
  'Rói as unhas e estala os dedos em ritmos musicais fúnebres quando há silêncio absoluto.',
  'Fala consigo mesmo em terceira pessoa quando tenta tomar decisões táticas cruciais.',
  'Guarda pequenos frascos com terra, dentes ou fragmentos de locais de investigações passadas.',
  'Recusa-se a olhar para espelhos e superfícies reflexivas, cobrindo-os sempre que entra num quarto.',
  'Come apenas alimentos amargos ou sem tempero, afirmando que qualquer doçura parece podre.',
  'Limpa obsessivamente as suas armas e ferramentas repetindo um mantra ou código da Ordem.',
  'Sorri de forma involuntária e desconcertante em momentos de extremo perigo ou choque.',
  'Mantém sempre uma mão no coldre ou na arma oculta, mesmo em conversas amigáveis com aliados.',
  'Tem uma cicatriz que afirma doer e latejar como um alarme sempre que uma criatura se aproxima.',
  'Fala com um tom monótono e calmo demais, como se nada no mundo pudesse mais surpreendê-lo.',
  'Troca frequentemente de relógio, afirmando que o tempo à sua volta não passa à mesma velocidade.',
  'Guarda fotografias de pessoas que não conhece e insiste que elas foram apagadas da realidade.',
];

export const APARENCIAS_AGENTES = [
  'Olhar fixo com olheiras profundas e uma mecha de cabelo prematuramente embranquecida por choque paranormal.',
  'Cicatrizes geométricas nos antebraços e mãos calejadas pelo manuseio constante de armas e artefactos.',
  'Veste sempre um sobretudo escuro puído nas bordas, repleto de bolsos internos fechados a zíper.',
  'Postura milimetricamente rígida e passos silenciosos, como se estivesse sempre a perseguir ou a ser perseguido.',
  'Tatuagens com sigilos antigos disfarçadas entre padrões modernos nas costas e no pescoço.',
  'Olhos bicolores (heterocromia) resultantes de exposição direta a uma fenda da Realidade.',
  'Cheiro característico a tabaco forte, café amargo e produtos químicos de limpeza de munição.',
  'Usa óculos escuros mesmo em ambientes fechados para disfarçar veias dilatadas perto dos olhos.',
  'Dentes cerrados com frequência, maxilar tenso e uma pequena queimadura de pólvora na bochecha.',
  'Roupas táticas discretas com reforço balístico oculto sob um casaco civil comum.',
  'Unhas cortadas rentes e dedos manchados de tinta preta e óleo de manutenção.',
  'Voz rouca e pausada, com uma ligeira vibração grave ao pronunciar certas palavras em rituais.',
  'Um colar com um dente ou fragmento mineral suspenso por um fio de cabedal desgastado.',
  'Mãos ligeiramente trémulas que ficam perfeitamente firmes no instante em que empunham uma arma.',
  'Pele invulgarmente pálida e fria ao toque, com veias azuladas salientes nos pulsos.',
];

export const DICAS_RP_AGENTES = [
  'Pragmático e focado na missão: prefere a eficácia fria à empatia, mas não abandona companheiros feridos.',
  'Assombrado pelo passado: fala com reverência de antigos colegas caídos e teme falhar novamente.',
  'Curioso e temerário: fascinado pelos mistérios do Outro Lado, por vezes arriscando mais do que devia.',
  'Protetor implacável: coloca-se na linha de fogo para proteger civis e os membros mais jovens da equipa.',
  'Paranoico e metódico: desconfia de tudo o que pareça fácil ou óbvio, revistando tudo duas vezes.',
  'Sarcástico como defesa: usa humor negro para não sucumbir ao medo perante os horrores da missão.',
  'Devoto da verdade: odeia mentiras e segredos desnecessários entre membros da equipa da Ordem.',
  'Fatalista sereno: acredita que a morte é inevitável neste trabalho e encara cada dia como uma vitória bónus.',
  'Tático calculista: analisa o ambiente procurando coberturas, rotas de fuga e ângulos de tiro antes de falar.',
  'Empático e emotivo: tenta confortar sobreviventes e sente o peso de cada perda como uma ferida pessoal.',
];

export const HABILIDADES_CRIATURAS = [
  {
    nome: 'Presença Perturbadora',
    descricao: 'No início do combate ou ao avistar a criatura, todos os seres a até 9m devem fazer um teste de Vontade (DT do monstro). Se falharem, sofrem dano mental e ficam Abalados por 1 rodada.',
  },
  {
    nome: 'Bote Predatório',
    descricao: 'Se a criatura se mover pelo menos 3m em linha reta antes de atacar, o seu primeiro ataque causa +2 dados de dano.',
  },
  {
    nome: 'Agarrar e Dilacerar',
    descricao: 'Se a criatura acertar um ataque corpo a corpo, pode fazer um teste de Luta contra o alvo como ação livre. Se vencer, agarra o alvo e causa dano automático no início de cada turno dele.',
  },
  {
    nome: 'Regeneração Sombria',
    descricao: 'No início do seu turno, a criatura recupera PV igual a metade do seu VD (mínimo 5). Não recupera PV se tiver sofrido dano do elemento opressor na rodada anterior.',
  },
  {
    nome: 'Aura de Entropia',
    descricao: 'A área a até 3m da criatura é considerada terreno difícil. Aparelhos eletrónicos nessa área falham e lâmpadas piscam ou queimam instantaneamente.',
  },
  {
    nome: 'Camuflagem Ilusória',
    descricao: 'A criatura distorce a luz à sua volta, recebendo camuflagem (20% de chance de ataques errarem) e +5 em testes de Furtividade.',
  },
  {
    nome: 'Olhar Paralisante',
    descricao: 'Uma vez por cena, como ação padrão, a criatura foca o seu olhar num alvo a até 9m. O alvo deve passar num teste de Vontade (DT) ou fica Paralisado e Indefeso por 1 rodada.',
  },
  {
    nome: 'Toxina Necrótica',
    descricao: 'Os ataques da criatura aplicam uma toxina. A vítima sofre 2d6 de dano químico no final do seu turno por 2 rodadas (Fortitude DT reduz à metade e encerra o efeito).',
  },
  {
    nome: 'Teletransporte Rápido',
    descricao: 'Uma vez por rodada, como ação livre após sofrer dano, a criatura pode teleportar-se instantaneamente até 6m para um espaço desocupado.',
  },
  {
    nome: 'Sussurros da Ruína',
    descricao: 'A criatura projeta sussurros caóticos na mente dos alvos a até 6m. Todos sofrem −1d20 em testes de concentração e perícias mentais.',
  },
];

export const COMPORTAMENTOS_CRIATURAS = [
  'Move-se em espasmos rápidos e desconexos, congelando completamente quando alguém a encara fixamente.',
  'Imita vozes humanas familiares com entonação distorcida e ecoante para atrair vítimas para emboscadas.',
  'Alimenta-se da dor visível: foca sempre os seus ataques mais brutais no alvo com menos PV ou que esteja em pânico.',
  'Emite estalidos ósseos ritmados e um sibilo grave que ressoa no peito de quem está próximo.',
  'Rasteja pelas paredes e pelo teto com facilidade incomum, evitando o chão iluminado.',
  'Ignora luzes normais e caça exclusivamente guiada pelo som da respiração e dos batimentos cardíacos dos agentes.',
  'Fica temporariamente atordoada e recua se confrontada com memórias ou objetos significativos do seu passado humano.',
  'Sussurra os segredos e medos mais obscuros dos agentes em voz baixa antes de desferir um golpe fatal.',
  'Gira a cabeça em ângulos impossíveis de 180 graus enquanto mantém o corpo apontado noutra direção.',
  'Deixa um rastro pegajoso de resíduo paranormal que corrói lentamente o piso por onde passa.',
];

export const APARENCIAS_CRIATURAS = [
  'Massa corporal retorcida com musculatura exposta, pulsando veias escuras brilhantes e carcaça endurecida.',
  'Silhueta esguia e alongada com membros finos como agulhas e pele translúcida que revela cinzas no interior.',
  'Rosto sem traços faciais definidos, exceto por fendas irregulares de onde escorre um líquido espesso.',
  'Olhos múltiplos espalhados de forma assimétrica pelo peito e ombros, piscando em momentos alternados.',
  'Garras afiadas como bisturis metálicos cobertas por uma fina camada de fuligem que nunca arrefece.',
  'Corpo rodeado por estática visível e pequenas faíscas que distorcem o espaço e as sombras ao redor.',
  'Pele endurecida como pedra vulcânica rachada, com fendas onde se avista um brilho incandescente.',
  'Membros articulados em sentidos contrários ao normal, com movimentos que parecem um filme a rodar aos soluços.',
];

export const DICAS_RP_CRIATURAS = [
  'Narre o horror sensorial: o ar fica subitamente gelado, o cheiro a ozono sufoca e os ouvidos começam a zumbir.',
  'Tática predatória: use o cenário, apague as fontes de luz dos agentes e ataque o membro que se isolar da equipa.',
  'Pressão psicológica: faça a criatura usar frases curtas de entes queridos dos agentes para quebrar a sua Sanidade.',
  'Monstro imparável: enfatize que os tiros e lâmpadas cortam a carne mas ela não expressa dor física comum.',
  'Comportamento territorial: a criatura protege um foco paranormal específico e torna-se frenética se os agentes se aproximarem.',
];

// ----------------------------------------------------------- OCULTISTAS INIMIGOS / CULTISTAS

export const NOMES_CULTOS = [
  'Os Filhos do Sangue Eterno',
  'Os Arautos do Fim Inevitável',
  'Os Escribas da Máscara Dourada',
  'A Fraternidade do Caos Primordial',
  'O Círculo da Cinza Sagrada',
  'Os Devotos da Espiral Rubra',
  'A Ordem do Véu Rompido',
  'Os Adoradores do Olho Cego',
];

export const PODERES_PARANORMAIS_CULTISTAS = [
  {
    nome: 'Sacrifício Fanático',
    descricao: 'Como reação ao sofrer dano letal, o cultista explode em chamas paranormais ou espinhos ósseos, causando 4d6 de dano do seu elemento a todos a até 3m (Reflexos DT reduz à metade).',
  },
  {
    nome: 'Vínculo de Dor',
    descricao: 'Como ação de movimento, vincula-se a um aliado próximo. Metade de todo o dano que o cultista sofrer é transferido para o aliado vinculado.',
  },
  {
    nome: 'Sussurros do Outro Lado',
    descricao: 'Sempre que conjura um ritual, força um alvo a até 9m a fazer um teste de Vontade (DT). Em caso de falha, o alvo perde 1d6 de Sanidade e fica Frustrado por 1 rodada.',
  },
  {
    nome: 'Foco Macabro',
    descricao: 'Recebe +5 em testes de Ocultismo e concentração ao conjurar rituais do seu elemento de afinidade.',
  },
  {
    nome: 'Proteção Profana',
    descricao: 'Ganha RD 5 contra o dano físico (corte, impacto, perfuração, balístico) e RD 10 contra o seu próprio elemento.',
  },
  {
    nome: 'Transfiguração Maldita',
    descricao: 'Quando fica com menos de metade dos PV, o seu corpo sofre uma mutação grotesca: ganha +2 na Defesa e +1d6 no dano de todos os seus ataques e rituais.',
  },
];

export const COMPORTAMENTOS_CULTISTAS = [
  'Entoa cânticos guturais contínuos em línguas mortas, sem parar nem mesmo enquanto atira ou é ferido.',
  'Corta a própria carne com uma lâmina ritualística para potenciar as conjurações com sangue fresco.',
  'Olha para os agentes com um sorriso de superioridade e êxtase, rindo das ameaças e tentativas de negociação.',
  'Protege com a própria vida o símbolo ou ídolo da seita que carrega ao peito.',
  'Trata a dor física como uma dádiva e benção direta da Entidade que venera.',
  'Tenta convencer os agentes a abandonarem a Ordem, argumentando que a invasão do Outro Lado é inevitável.',
];

export const APARENCIAS_CULTISTAS = [
  'Túnica cerimonial escura com manchas de sangue seco e símbolos desenhados com pó de ossos.',
  'Pele coberta de escarificações rituais e sigilos entalhados à mão que brilham fracamente no escuro.',
  'Máscara ritualística de madeira entalhada ou metal polido que oculta totalmente as feições humanas.',
  'Unhas enegrecidas e dedos manchados por óleos de rituais e substâncias alquímicas proibidas.',
  'Olhos com pupilas dilatadas e escleras manchadas por veias escuras pulsantes de exposição continuada.',
];

export const DICAS_RP_CULTISTAS = [
  'Fanático inflexível: não teme a morte e considera os agentes apenas carne tola destinada à colheita.',
  'Mestre manipulador: usa rituais para desestabilizar a mente do grupo e fazer os agentes duvidarem dos seus aliados.',
  'Convicção absoluta: fale com fervor religioso, usando termos grandiosos para descrever o Outro Lado.',
  'Tática covarde mas implacável: mantém peões à sua frente enquanto canaliza rituais devastadores à distância.',
];

// ----------------------------------------------------- FICHA DE NPC ("Como Interpretar")
// Quatro tabelas usadas só pelo guia de interpretação da ficha de NPC:
// Traço Distintivo, Maneirismo, Motivação Principal e Informação Útil.
// Descrição Física e Personalidade/Tom de Voz continuam a usar
// APARENCIAS_AGENTES e DICAS_RP_AGENTES, já existentes.

export const TRACOS_DISTINTIVOS_AGENTES = [
  'Uma cicatriz em meia-lua sobre a sobrancelha esquerda, lembrança de uma missão que nunca conta em detalhe.',
  'Falta a falange do dedo mindinho direito — diz que foi "o preço de um ritual mal calculado".',
  'Um olho ligeiramente mais claro que o outro, quase impercetível à luz do dia.',
  'Uma voz rouca demais para a idade, como se tivesse gritado até perder o tom.',
  'Anda sempre com as mangas compridas, mesmo no calor, escondendo algo nos antebraços.',
  'Um sotaque que muda ligeiramente consoante o assunto fica desconfortável.',
  'Postura assimétrica, como se favorecesse permanentemente um lado do corpo ferido há anos.',
  'Um cheiro persistente a incenso ou cera queimada que não sai da roupa.',
  'Nunca tira as luvas, nem para comer.',
  'Uma mancha de nascença escura no pescoço, que tenta sempre manter tapada.',
  'Pestaneja o dobro do normal quando alguém menciona um nome específico.',
  'Traz sempre um objeto pequeno no bolso que aperta com força em momentos de tensão.',
  'Um tremor quase impercetível na mão direita, que desaparece assim que percebe que alguém reparou.',
  'Dentes ligeiramente desalinhados de um lado, resultado de um golpe antigo nunca tratado como deve ser.',
];

export const MANEIRISMOS_AGENTES = [
  'Bate os dedos na mesa em grupos de três sempre que pondera uma resposta.',
  'Gira um anel ou fio no dedo enquanto fala, sem se dar conta disso.',
  'Faz uma pausa longa antes de responder a perguntas diretas, como se pesasse cada palavra.',
  'Repete a última palavra da pergunta antes de responder, quase como um eco automático.',
  'Evita sentar-se de costas para portas ou janelas, mudando de lugar se necessário.',
  'Sorri sempre um instante depois de deveria, como se o gesto fosse aprendido e não natural.',
  'Limpa as mãos na roupa com frequência, mesmo quando estão secas.',
  'Fala baixo demais em assuntos sérios, obrigando quem ouve a aproximar-se.',
  'Conta nos dedos, discretamente, sempre que enumera algo — mesmo coisas simples.',
  'Olha para o relógio ou para o telemóvel a cada poucos minutos, mesmo sem hora marcada.',
  'Interrompe silêncios longos com perguntas triviais, desconfortável com pausas.',
  'Mantém sempre uma distância física maior do que o normal, mesmo com conhecidos.',
  'Risca pequenos símbolos ou linhas em qualquer superfície disponível enquanto pensa.',
];

export const MOTIVACOES_AGENTES = [
  'Provar a si mesmo que o erro que cometeu no passado não define quem é agora.',
  'Proteger alguém específico — um familiar, um amigo, um antigo colega — custe o que custar.',
  'Encontrar respostas sobre um desaparecimento ou morte que a Ordem nunca resolveu oficialmente.',
  'Subir de patente o suficiente para ter acesso a informação que hoje lhe é negada.',
  'Manter uma promessa feita a alguém que já morreu.',
  'Escapar de uma dívida — financeira, moral ou paranormal — contraída há muito tempo.',
  'Provar que a sua forma pouco ortodoxa de agir traz resultados que os métodos oficiais não trazem.',
  'Encontrar uma forma de reverter ou controlar algo que lhe aconteceu e que esconde dos outros.',
  'Vingança contra uma entidade, culto ou pessoa específica responsável por uma perda pessoal.',
  'Simplesmente sobreviver mais um dia, sem grandes ambições para além disso.',
  'Ganhar a confiança de alguém que atualmente o trata com desconfiança ou desprezo.',
  'Manter as aparências de normalidade para não perder algo que valoriza fora da Ordem.',
];

export const INFORMACOES_UTEIS_AGENTES = [
  'Sabe de um local que muda de fechadura ou de acesso regularmente, sem explicação oficial.',
  'Conhece alguém dentro da Ordem que não é de confiança, mas não tem provas para o denunciar.',
  'Guarda um contacto fora da Ordem que consegue arranjar recursos ou informação por baixo da mesa.',
  'Já viu algo semelhante ao caso atual antes, mas o relatório dessa missão foi arquivado como confidencial.',
  'Sabe o verdadeiro motivo por trás de uma decisão recente da Ordem que foi anunciada com outra justificação.',
  'Tem conhecimento de um padrão ou ritual que se repete em datas específicas, ainda não documentado.',
  'Conhece uma rota, passagem ou atalho que evita vigilância — paranormal ou não.',
  'Sabe de um objeto ou artefacto perdido que pode ser relevante, mas hesita em revelar onde está.',
  'Testemunhou algo que contradiz a versão oficial de um evento recente, mas tem medo de o admitir.',
  'Tem um pressentimento fundado sobre quem será o próximo alvo — mas não sabe como o provar.',
];

// Guia de interpretação dos ocultistas/cultistas gerados (NPCs de ficha livre).
// Traços, maneirismos e aparência vêm do estilo de cada elemento
// (data/perfisNpc.js → ESTILO_CULTO); estes completam o papel no culto.

export const MOTIVACOES_CULTISTAS = [
  'Subir na hierarquia do culto, custe quantas vidas custar.',
  'Completar o ritual a tempo — a data está marcada e não pode falhar.',
  'Provar a sua devoção depois de um fracasso que o culto não esqueceu.',
  'Proteger o líder do culto, a quem deve a vida (ou o que resta dela).',
  'Trazer de volta alguém que perdeu, convencido de que o Outro Lado lho devolverá.',
];

export const INFORMACOES_CULTISTAS = [
  'Sabe onde o culto se reúne e a senha para entrar.',
  'Conhece a data e o local do próximo ritual.',
  'Sabe quem, fora do culto, lhes fornece dinheiro e proteção.',
  'Guarda um objeto do ritual que o culto precisa de recuperar.',
  'Conhece o ponto fraco da entidade que o culto serve — e tem medo de o dizer.',
];
