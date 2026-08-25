// PODERES PARANORMAIS, GERAIS e poderes de classe dos suplementos.
//
// Fontes:
//   Ordem Paranormal RPG (Livro Base) — cap. 5, Poderes Paranormais (pp. 114-116)
//   Sobrevivendo ao Horror — Poderes Gerais (pp. 33-36) e Poderes Paranormais (pp. 46-47)
//   Arquivos Secretos 1 — Poderes de Ocultista, Poderes Gerais, Poderes Paranormais de Sangue (pp. 44-47)
//   Arquivos Secretos 6 — Poderes de Combatente/Especialista/Ocultista, Poderes Gerais,
//                          Poderes Paranormais (pp. 67-71)
//   Arquivos Secretos 4 — Poderes de Combatente/Especialista/Ocultista, Poderes Gerais,
//                          Poderes Paranormais de Energia (pp. 65-67)
//
// Os poderes de classe do Livro Base e de Sobrevivendo ao Horror estão em src/data/classes/*.js.
// Aqui só entram os poderes de classe que aparecem nos Arquivos Secretos.
//
// Schema:
// {
//   id, nome,
//   tipo: 'paranormal' | 'geral' | 'classe',
//   classe: 'combatente' | 'especialista' | 'ocultista' | 'sobrevivente' | null,
//   elemento: 'sangue' | 'morte' | 'energia' | 'conhecimento' | null,  // só para paranormais
//   prerequisito: '',   // verbatim; '' se não houver
//   nexMinimo: null,    // número, quando o pré-requisito exige NEX
//   descricao: '',      // verbatim, parágrafos separados por \n\n
//   livro: '',
// }
//
// Nota: a linha "Pré-requisito(s): ..." foi mantida dentro da descrição (verbatim) e também
// copiada para o campo `prerequisito`.

export const REGRAS_PODERES_PARANORMAIS = `Quando escolhe o poder de classe Transcender, você realiza um ritual para se conectar ao Outro Lado e vislumbrar as entidades, voltando modificado pelo contato. Em termos de jogo, você recebe um poder paranormal desta seção. Este poder cobra seu preço: sempre que transcende, você não recebe a Sanidade daquele aumento de NEX.

Pré-requisito. Você precisa cumprir todos os pré-requisitos para escolher um poder paranormal e, a menos que o texto indique o contrário, só pode escolher cada poder uma vez. Alguns exigem que você possua outros poderes paranormais do mesmo tipo. Por exemplo, para escolher um poder com pré-requisito Morte 2, você já precisa ter outros dois poderes de Morte.

Afinidade Elemental. Quando atinge NEX 50% você se conecta com um elemento a sua escolha entre Conhecimento, Energia, Morte e Sangue. Na primeira vez que transcender após isso, irá desenvolver afinidade com o elemento escolhido. Afinidade fornece os seguintes benefícios:
• Você não precisa mais de componentes ritualísticos para conjurar rituais do elemento com o qual tem afinidade. Além disso, pode aprender rituais que exijam afinidade com esse elemento.
• Você recebe +OO em testes contra efeitos do seu elemento. No entanto, sofre –OO em testes contra efeitos do elemento opressor ao seu.
• Você pode escolher poderes paranormais do seu elemento uma segunda vez para receber o benefício listado na linha "Afinidade".`;

export const REGRAS_PODERES_GERAIS = `Poderes gerais são um novo grupo de poderes, que representam habilidades gerais acessíveis a todos os personagens. Essencialmente, eles são considerados poderes de todas as classes. Assim, sempre que você puder escolher um poder de classe pode, em vez disso, escolher um poder geral.

Além dos novos poderes descritos a seguir, os seguintes poderes originalmente de classe são considerados poderes gerais: Artista Marcial, Combater com Duas Armas, Saque Rápido e Tiro Certeiro.`;

export const PODERES = [
  // ---------------------------------------------------------------------------
  // LIVRO BASE — PODERES PARANORMAIS (sem elemento definido)
  // ---------------------------------------------------------------------------
  {
    id: 'aprender-ritual',
    nome: 'Aprender Ritual',
    tipo: 'paranormal',
    classe: null,
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Através de uma conexão com as memórias de ocultistas do passado e os segredos das entidades, você aprende e pode conjurar um ritual de 1º círculo à sua escolha. Além disso, você pode substituir um ritual que já conhece por outro. A partir de 45% de NEX, quando escolhe este poder, você aprende um ritual de até 2º círculo e, a partir de 75% de NEX, aprende um ritual de até 3º círculo. Você pode escolher esse poder quantas vezes quiser, mas está sujeito ao limite de rituais conhecidos. Este poder conta como um poder do elemento do ritual escolhido.`,
    livro: 'Livro Base',
  },
  {
    id: 'resistir-a-elemento',
    nome: 'Resistir a <Elemento>',
    tipo: 'paranormal',
    classe: null,
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Escolha entre Conhecimento, Energia, Morte ou Sangue. Você recebe resistência 10 contra esse elemento. Este poder conta como um poder do elemento escolhido.

Afinidade: aumenta a resistência para 20.`,
    livro: 'Livro Base',
  },

  // --- LIVRO BASE — PODERES DE CONHECIMENTO ---
  {
    id: 'expansao-de-conhecimento',
    nome: 'Expansão de Conhecimento',
    tipo: 'paranormal',
    classe: null,
    elemento: 'conhecimento',
    prerequisito: 'Conhecimento 1',
    nexMinimo: null,
    descricao: `Você se conecta com o Conhecimento do Outro Lado, rompendo os limites de sua compreensão. Você aprende um poder de classe que não pertença à sua classe (caso o poder possua pré-requisitos, você precisa preenchê-los). Pré-requisito: Conhecimento 1.

Afinidade: você aprende um segundo poder de classe que não pertença à sua classe.`,
    livro: 'Livro Base',
  },
  {
    id: 'percepcao-paranormal',
    nome: 'Percepção Paranormal',
    tipo: 'paranormal',
    classe: null,
    elemento: 'conhecimento',
    prerequisito: '',
    nexMinimo: null,
    descricao: `O Conhecimento sussurra em sua mente. Em cenas de investigação, sempre que fizer um teste para procurar pistas, você pode rolar novamente um dado com resultado menor que 10. Você deve aceitar a segunda rolagem, mesmo que seja menor que a primeira.

Afinidade: você pode rolar novamente até dois dados com resultado menor que 10.`,
    livro: 'Livro Base',
  },
  {
    id: 'precognicao',
    nome: 'Precognição',
    tipo: 'paranormal',
    classe: null,
    elemento: 'conhecimento',
    prerequisito: 'Conhecimento 1',
    nexMinimo: null,
    descricao: `Você possui um "sexto sentido" que o avisa do perigo antes que ele aconteça. Você recebe +2 em Defesa e em testes de resistência. Pré-requisito: Conhecimento 1.

Afinidade: você fica imune à condição desprevenido.`,
    livro: 'Livro Base',
  },
  {
    id: 'sensitivo',
    nome: 'Sensitivo',
    tipo: 'paranormal',
    classe: null,
    elemento: 'conhecimento',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Você consegue sentir as emoções e intenções de outros personagens, como medo, raiva ou malícia, recebendo +5 em testes de Diplomacia, Intimidação e Intuição.

Afinidade: quando você faz um teste oposto usando uma dessas perícias, o oponente sofre –O.`,
    livro: 'Livro Base',
  },
  {
    id: 'visao-do-oculto',
    nome: 'Visão do Oculto',
    tipo: 'paranormal',
    classe: null,
    elemento: 'conhecimento',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Você não enxerga mais pelos olhos, mas sim pela percepção do Conhecimento em sua mente. Você recebe +5 em testes de Percepção e enxerga no escuro.

Afinidade: você ignora camuflagem.`,
    livro: 'Livro Base',
  },

  // --- LIVRO BASE — PODERES DE ENERGIA ---
  {
    id: 'afortunado',
    nome: 'Afortunado',
    tipo: 'paranormal',
    classe: null,
    elemento: 'energia',
    prerequisito: '',
    nexMinimo: null,
    descricao: `A Energia considera resultados medíocres entediantes. Uma vez por rolagem, você pode rolar novamente um resultado 1 em qualquer dado que não seja d20.

Afinidade: além disso, uma vez por teste, você pode rolar novamente um resultado 1 em d20.`,
    livro: 'Livro Base',
  },
  {
    id: 'campo-protetor',
    nome: 'Campo Protetor',
    tipo: 'paranormal',
    classe: null,
    elemento: 'energia',
    prerequisito: 'Energia 1',
    nexMinimo: null,
    descricao: `Você consegue gerar um campo de Energia que o protege de perigos. Quando usa a ação esquiva, você pode gastar 1 PE para receber +5 em Defesa. Pré-requisito: Energia 1.

Afinidade: quando usa este poder, você também recebe +5 em Reflexo e, até o início de seu próximo turno, se passar em um teste de Reflexo que reduziria o dano à metade, em vez disso não sofre nenhum dano.`,
    livro: 'Livro Base',
  },
  {
    id: 'causalidade-fortuita',
    nome: 'Causalidade Fortuita',
    tipo: 'paranormal',
    classe: null,
    elemento: 'energia',
    prerequisito: '',
    nexMinimo: null,
    descricao: `A Energia o conduz rumo a descobertas. Em cenas de investigação, a DT para procurar pistas diminui em –5 para você até você encontrar uma pista.

Afinidade: a DT para procurar pistas sempre diminui em –5 para você.`,
    livro: 'Livro Base',
  },
  {
    id: 'golpe-de-sorte',
    nome: 'Golpe de Sorte',
    tipo: 'paranormal',
    classe: null,
    elemento: 'energia',
    prerequisito: 'Energia 1',
    nexMinimo: null,
    descricao: `Seus ataques recebem +1 na margem de ameaça. Pré-requisito: Energia 1.

Afinidade: seus ataques recebem +1 no multiplicador de crítico.`,
    livro: 'Livro Base',
  },
  {
    id: 'manipular-entropia',
    nome: 'Manipular Entropia',
    tipo: 'paranormal',
    classe: null,
    elemento: 'energia',
    prerequisito: 'Energia 1',
    nexMinimo: null,
    descricao: `Nada diverte mais a Energia do que a possibilidade de um desastre ainda maior. Você pode gastar 2 PE para fazer um alvo em alcance curto (exceto você mesmo) rolar novamente um dos dados em um teste de perícia. Pré-requisito: Energia 1.

Afinidade: o alvo rola novamente todos os dados que você escolher.`,
    livro: 'Livro Base',
  },

  // --- LIVRO BASE — PODERES DE MORTE ---
  {
    id: 'encarar-a-morte',
    nome: 'Encarar a Morte',
    tipo: 'paranormal',
    classe: null,
    elemento: 'morte',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Sua conexão com a Morte faz com que você não hesite em situações de perigo. Durante cenas de ação, seu limite de gasto de PE aumenta em +1 (isso não afeta a DT de seus efeitos).

Afinidade: durante cenas de ação, seu limite de gasto de PE aumenta em +2 (para um total de +3).`,
    livro: 'Livro Base',
  },
  {
    id: 'escapar-da-morte',
    nome: 'Escapar da Morte',
    tipo: 'paranormal',
    classe: null,
    elemento: 'morte',
    prerequisito: 'Morte 1',
    nexMinimo: null,
    descricao: `A Morte tem um interesse especial em sua caminhada. Uma vez por cena, quando receber dano que o deixaria com 0 PV, você fica com 1 PV. Não funciona em caso de dano massivo. Pré-requisito: Morte 1.

Afinidade: em vez do normal, você evita completamente o dano. Em caso de dano massivo, você fica com 1 PV.`,
    livro: 'Livro Base',
  },
  {
    id: 'potencial-aprimorado',
    nome: 'Potencial Aprimorado',
    tipo: 'paranormal',
    classe: null,
    elemento: 'morte',
    prerequisito: '',
    nexMinimo: null,
    descricao: `A Morte lhe concede potencial latente de momentos roubados de outro lugar. Você recebe +1 ponto de esforço por NEX. Quando sobe de NEX, os PE que recebe por este poder aumentam de acordo. Por exemplo, se escolher este poder em NEX 30%, recebe 6 PE. Quando subir para NEX 35%, recebe +1 PE adicional, e assim por diante.

Afinidade: você recebe +1 PE adicional por NEX (para um total de +2 PE por NEX).`,
    livro: 'Livro Base',
  },
  {
    id: 'potencial-reaproveitado',
    nome: 'Potencial Reaproveitado',
    tipo: 'paranormal',
    classe: null,
    elemento: 'morte',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Você absorve os momentos desperdiçados de outros seres. Uma vez por rodada, quando passa num teste de resistência, você ganha 2 PE temporários cumulativos. Os pontos desaparecem no final da cena.

Afinidade: você ganha 3 PE temporários, em vez de 2.`,
    livro: 'Livro Base',
  },
  {
    id: 'surto-temporal',
    nome: 'Surto Temporal',
    tipo: 'paranormal',
    classe: null,
    elemento: 'morte',
    prerequisito: 'Morte 2',
    nexMinimo: null,
    descricao: `A sua percepção temporal se torna distorcida e espiralizada, fazendo com que a noção de passagem do tempo nunca mais seja a mesma para você. Uma vez por cena, durante seu turno, você pode gastar 3 PE para realizar uma ação padrão adicional. Pré-requisito: Morte 2.

Afinidade: em vez de uma vez por cena, você pode usar este poder uma vez por turno.`,
    livro: 'Livro Base',
  },

  // --- LIVRO BASE — PODERES DE SANGUE ---
  {
    id: 'anatomia-insana',
    nome: 'Anatomia Insana',
    tipo: 'paranormal',
    classe: null,
    elemento: 'sangue',
    prerequisito: 'Sangue 2',
    nexMinimo: null,
    descricao: `O seu corpo é transfigurado e parece desenvolver um instinto próprio separado da sua consciência. Você tem 50% de chance (resultado par em 1d4) de ignorar o dano adicional de um acerto crítico ou ataque furtivo. Pré-requisito: Sangue 2.

Afinidade: você é imune aos efeitos de acertos críticos e ataques furtivos.`,
    livro: 'Livro Base',
  },
  {
    id: 'arma-de-sangue',
    nome: 'Arma de Sangue',
    tipo: 'paranormal',
    classe: null,
    elemento: 'sangue',
    prerequisito: '',
    nexMinimo: null,
    descricao: `O Sangue devora parte de seu corpo e se manifesta como parte de você. Você pode gastar uma ação de movimento e 2 PE para produzir garras, chifres ou uma lâmina de sangue cristalizado que brota de seu antebraço. Qualquer que seja sua escolha, é considerada uma arma simples, corpo a corpo e leve, que você não precisa empunhar e causa 1d6 pontos de dano de Sangue. Uma vez por turno, quando você usa a ação agredir, pode gastar 1 PE para fazer um ataque adicional com essa arma. A arma dura até o final da cena, e então se desfaz numa poça de sangue coagulado.

Afinidade: a arma se torna parte permanente de você e causa 1d10 pontos de dano de Sangue.`,
    livro: 'Livro Base',
  },
  {
    id: 'sangue-de-ferro',
    nome: 'Sangue de Ferro',
    tipo: 'paranormal',
    classe: null,
    elemento: 'sangue',
    prerequisito: '',
    nexMinimo: null,
    descricao: `O seu sangue flui de forma paranormal e agressiva, concedendo vigor não natural. Você recebe +2 pontos de vida por NEX. Quando sobe de NEX, os PV que recebe por este poder aumentam de acordo. Por exemplo, se escolher este poder em NEX 50%, recebe 20 PV. Quando subir para NEX 55%, recebe +2 PV, e assim por diante.

Afinidade: você recebe +5 em Fortitude e se torna imune a venenos e doenças.`,
    livro: 'Livro Base',
  },
  {
    id: 'sangue-fervente',
    nome: 'Sangue Fervente',
    tipo: 'paranormal',
    classe: null,
    elemento: 'sangue',
    prerequisito: 'Sangue 2',
    nexMinimo: null,
    descricao: `A intensidade da dor desperta em você sentimentos bestiais e prazerosos que você nem imaginava que existiam. Enquanto estiver machucado, você recebe +1 em Agilidade ou Força, à sua escolha (escolha sempre que este efeito for ativado). Pré-requisito: Sangue 2.

Afinidade: o bônus que você recebe em Agilidade ou Força aumenta para +2.`,
    livro: 'Livro Base',
  },
  {
    id: 'sangue-vivo',
    nome: 'Sangue Vivo',
    tipo: 'paranormal',
    classe: null,
    elemento: 'sangue',
    prerequisito: 'Sangue 1',
    nexMinimo: null,
    descricao: `A carnificina não pode parar, o Sangue precisa continuar fluindo. Na primeira vez que ficar machucado durante uma cena, você recebe cura acelerada 2 (veja a página 179). Esse efeito nunca cura você acima da metade dos PV máximos (ou seja, você nunca deixa de estar machucado) e termina no fim da cena ou caso você perca a condição machucado. Pré-requisito: Sangue 1.

Afinidade: a cura acelerada aumenta para 5.`,
    livro: 'Livro Base',
  },

  // ---------------------------------------------------------------------------
  // SOBREVIVENDO AO HORROR — PODERES GERAIS
  // ---------------------------------------------------------------------------
  {
    id: 'acrobatico',
    nome: 'Acrobático',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Agi 2',
    nexMinimo: null,
    descricao: `Você possui um talento natural para piruetas, cambalhotas e outras acrobacias complexas. Você recebe treinamento em Acrobacia ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, terreno difícil não reduz seu deslocamento nem o impede de realizar investidas. Pré-requisito: Agi 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'as-do-volante',
    nome: 'Ás do Volante',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Agi 2',
    nexMinimo: null,
    descricao: `Você é um apaixonado por velocidade, e tem a coragem (ou falta de juízo) necessária para executar qualquer manobra. Você recebe treinamento em Pilotagem ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, uma vez por rodada, quando um veículo que você está pilotando sofre dano, você pode fazer um teste de Pilotagem (DT igual ao resultado do teste de ataque ou à DT do efeito que causou o dano). Se passar, evita esse dano. Pré-requisito: Agi 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'atletico',
    nome: 'Atlético',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'For 2',
    nexMinimo: null,
    descricao: `Você possui um corpo atlético, resultado de uma fortuita disposição genética ou árduo treinamento. Você recebe treinamento em Atletismo ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, recebe +3m em seu deslocamento. Pré-requisito: For 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'atraente',
    nome: 'Atraente',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Pre 2',
    nexMinimo: null,
    descricao: `Seja por pura beleza física ou por sua postura e atitude, você atrai olhares por onde passa. Você recebe +5 em testes de Artes, Diplomacia, Enganação, e Intimidação contra pessoas que possam se sentir fisicamente atraídas por você. Pré-requisito: Pre 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'dedos-ageis',
    nome: 'Dedos Ágeis',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Agi 2',
    nexMinimo: null,
    descricao: `Você possui uma motricidade fina precisa, particularmente útil para manipular ferramentas delicadas. Você recebe treinamento em Crime ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, pode arrombar com uma ação padrão, furtar com uma ação livre (apenas uma vez por rodada) e sabotar com uma ação completa. Pré-requisito: Agi 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'detector-de-mentiras',
    nome: 'Detector de Mentiras',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Pre 2',
    nexMinimo: null,
    descricao: `Você possui uma aptidão para perceber os sutis sinais de alguém que está mentindo. Você recebe treinamento em Intuição ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, outros seres sofrem uma penalidade de –10 em testes de Enganação para mentir para você. Pré-requisito: Pre 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'especialista-em-emergencias',
    nome: 'Especialista em Emergências',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 2',
    nexMinimo: null,
    descricao: `Você recebeu treinamento como socorrista de emergência, e sabe como tratar um paciente em situações de urgência. Você recebe treinamento em Medicina ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, pode aplicar cicatrizantes e medicamentos como uma ação de movimento e, uma vez por rodada, pode sacar um desses itens como uma ação livre. Pré-requisito: Int 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'estigmado',
    nome: 'Estigmado',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `A adrenalina causada pela dor faz você se manter focado no que está acontecendo. Sempre que sofre dano mental de efeitos de medo, você pode converter esse dano em perda de pontos de vida (se sofre 5 pontos de dano mental de medo você pode, em vez disso, perder 5 pontos de vida).`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'foco-em-pericia',
    nome: 'Foco em Perícia',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'treinado na perícia escolhida',
    nexMinimo: null,
    descricao: `Você se dedicou a estudar e treinar os vários pormenores de uma área de conhecimento específica. Escolha uma perícia (exceto Luta e Pontaria). Quando faz um teste dessa perícia, você rola +O. Você pode escolher este poder outras vezes para perícias diferentes. Pré-requisito: treinado na perícia escolhida.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'inventario-organizado',
    nome: 'Inventário Organizado',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 2',
    nexMinimo: null,
    descricao: `Você sabe como organizar sua mochila e seu equipamento de forma organizada e racional. Você soma seu Intelecto no limite de espaços que pode carregar. Para você, itens muito leves ou pequenos, que normalmente ocupam meio espaço (0,5), em vez disso ocupam 1/4 de espaço (0,25). Pré-requisito: Int 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'informado',
    nome: 'Informado',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 2',
    nexMinimo: null,
    descricao: `Você passa bastante tempo consumindo fofocas… bem, notícias sobre o mundo ao seu redor. Você recebe treinamento em Atualidades ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, pode usar Atualidades no lugar de qualquer outra perícia para testes envolvendo informações, desde que aprovado pelo mestre. Pré-requisito: Int 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'interrogador',
    nome: 'Interrogador',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'For 2',
    nexMinimo: null,
    descricao: `Você sabe como usar o medo para extrair todo tipo de informação das outras pessoas. Você recebe treinamento em Intimidação ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, pode fazer testes de Intimidação para coagir como uma ação padrão, mas apenas uma vez por cena contra a mesma pessoa. Pré-requisito: For 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'mentiroso-nato',
    nome: 'Mentiroso Nato',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Pre 2',
    nexMinimo: null,
    descricao: `Você é um cara de pau, capaz de mentir descaradamente sem que ninguém perceba. Você recebe treinamento em Enganação ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, a penalidade que você sofre por mentiras muito implausíveis diminui para –O. Pré-requisito: Pre 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'observador',
    nome: 'Observador',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 2',
    nexMinimo: null,
    descricao: `Você possui uma combinação de sentidos apurados para perceber pistas e intelecto afiado para processá-las. Você recebe treinamento em Investigação ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, soma seu Intelecto em Intuição. Pré-requisito: Int 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'pai-de-pet',
    nome: 'Pai de Pet',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Pre 2',
    nexMinimo: null,
    descricao: `Você adora animais, e cuida de seus pets como se fossem seus filhos. Você recebe treinamento em Adestramento ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, possui um animal de estimação que o auxilia e o acompanha em suas aventuras. Em termos de jogo, é um aliado que fornece +2 em duas perícias a sua escolha (exceto Luta ou Pontaria e aprovadas pelo mestre). Pré-requisito: Pre 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'palavras-de-devocao',
    nome: 'Palavras de Devoção',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Pre 2',
    nexMinimo: null,
    descricao: `Você combina uma fé verdadeira com o conhecimento dos ritos e tradições de sua religião. Você recebe treinamento em Religião ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, uma vez por cena, pode gastar 3 PE e uma ação completa para executar uma oração para um número de pessoas até o dobro de sua Presença. Até o fim da cena, todos os participantes dessa oração recebem resistência a dano mental 5. Pré-requisito: Pre 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'parceiro',
    nome: 'Parceiro',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'treinado em Diplomacia, NEX 30%',
    nexMinimo: 30,
    descricao: `Em algum momento da sua vida, você conquistou uma amizade fiel e verdadeira; alguém disposto a até mesmo a se arriscar para lhe ajudar. Você possui um parceiro, uma pessoa que o acompanha e o auxilia em suas missões. Escolha os detalhes dele, como nome, aparência e personalidade. Em termos de jogo, é um aliado de um tipo à sua escolha (veja OPRPG, p. 171). O parceiro obedece às suas ordens e se arrisca para ajudá-lo, mas, se for maltratado, pode parar de segui-lo (de acordo com o mestre). Se perder seu aliado, você precisa gastar uma folga da Ordem (veja p. 94) para receber outro. Pré-requisitos: treinado em Diplomacia, NEX 30%.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'pensamento-tatico',
    nome: 'Pensamento Tático',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 2',
    nexMinimo: null,
    descricao: `Você possui uma mente voltada para análises táticas e pensamento estratégico. Você recebe treinamento em Tática ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, quando você passa em um teste de Tática para analisar terreno, você e seus aliados em alcance médio recebem uma ação de movimento adicional na primeira rodada do próximo combate neste terreno (desde que ele ocorra até o fim do dia). Pré-requisito: Int 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'personalidade-esoterica',
    nome: 'Personalidade Esotérica',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 2',
    nexMinimo: null,
    descricao: `Você sempre teve uma afinidade com assuntos esotéricos. Você recebe +3 PE e recebe treinamento em Ocultismo. Se já for treinado nesta perícia, recebe +2 nela. Pré-requisito: Int 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'persuasivo',
    nome: 'Persuasivo',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Pre 2',
    nexMinimo: null,
    descricao: `Você possui uma personalidade diplomática e sabe obter o que deseja por meio de argumentação e conversa. Você recebe treinamento em Diplomacia ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, ao fazer um teste para persuasão, a penalidade que você sofre por perguntar ou pedir coisas custosas ou perigosas diminui em –5. Pré-requisito: Pre 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'pesquisador-cientifico',
    nome: 'Pesquisador Científico',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 2',
    nexMinimo: null,
    descricao: `Você possui um profundo respeito pela ciência e acredita que ela é a resposta para muitos de seus questionamentos. Você recebe treinamento em Ciências ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, você pode usar Ciências no lugar de Ocultismo e Sobrevivência para identificar criaturas e animais, respectivamente. Pré-requisito: Int 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'proativo',
    nome: 'Proativo',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Agi 2',
    nexMinimo: null,
    descricao: `Seu negócio é fazer as coisas, e não deixar para depois. Você recebe treinamento em Iniciativa ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, ao rolar um 19 ou 20 em pelo menos um dos dados de um teste de Iniciativa, você recebe uma ação padrão adicional em seu primeiro turno. Pré-requisito: Agi 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'provisoes-de-emergencia',
    nome: 'Provisões de Emergência',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Você é um sujeito precavido e mantém uma reserva secreta para quando as coisas ficarem ruins. Você possui um esconderijo com equipamentos e suprimentos escondidos para uma situação de emergência. Uma vez por missão, você pode usar uma ação de interlúdio para recuperar o conteúdo de seu esconderijo (pessoalmente ou através de algum contato). Você recebe novos equipamentos a sua escolha equivalente à sua patente no início desta missão (como se tivesse uma nova fase de preparação de missão).`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'racionalidade-inflexivel',
    nome: 'Racionalidade Inflexível',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 3',
    nexMinimo: null,
    descricao: `Suas convicções e sua visão de mundo são baseadas em argumentos racionais e lógicos. Você pode usar Intelecto no lugar de Presença como atributo-chave de Vontade e para calcular seus pontos de esforço. Pré-requisito: Int 3.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'rato-de-computador',
    nome: 'Rato de Computador',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 2',
    nexMinimo: null,
    descricao: `Você adora computadores e outros dispositivos tecnológicos. Você recebe treinamento em Tecnologia ou, se já for treinado nesta perícia, recebe +2 nela. Você pode hackear, localizar arquivo ou operar dispositivo como uma ação completa e, uma vez por cena de investigação, se tiver acesso a um computador, pode fazer um teste de Tecnologia para procurar pistas sem gastar uma rodada de investigação. Pré-requisito: Int 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'resposta-rapida',
    nome: 'Resposta Rápida',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Agi 2',
    nexMinimo: null,
    descricao: `Seus reflexos são tão apurados que o permitem agir antes mesmo de você perceber as ameaças de forma consciente. Você recebe treinamento em Reflexos ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, ao falhar em um teste de Percepção para evitar ficar desprevenido, você pode gastar 2 PE para rolar novamente o teste usando Reflexos. Pré-requisito: Agi 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'talentoso',
    nome: 'Talentoso',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Pre 2',
    nexMinimo: null,
    descricao: `Você possui inclinação para todas as formas de expressão artística. Você recebe treinamento em Artes ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, quando faz um teste de Artes para impressionar, o bônus em perícias que você recebe aumenta em +1 para cada 5 pontos adicionais em que o resultado de seu teste passar a DT. Pré-requisito: Pre 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'teimosia-obstinada',
    nome: 'Teimosia Obstinada',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Pre 2',
    nexMinimo: null,
    descricao: `As pessoas chamam você de teimoso. Mas elas estão erradas! Você recebe treinamento em Vontade ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, quando faz um teste de Vontade contra um efeito que cause uma condição mental ou tente modificar sua categoria de atitude (como o ritual Enfeitiçar), você pode gastar 2 PE para receber +5 neste teste. Pré-requisito: Pre 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'tenacidade',
    nome: 'Tenacidade',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Vig 2',
    nexMinimo: null,
    descricao: `Seu corpo desenvolveu a capacidade de suportar rigores extremos. Você recebe treinamento em Fortitude ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, ao estar morrendo, mas consciente (com pelo menos 1 PV), você pode fazer um teste de Fortitude (DT 20 + 10 por teste anterior na mesma cena) como ação livre. Se for bem-sucedido, encerra a condição morrendo. Pré-requisito: Vig 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'sentidos-agucados',
    nome: 'Sentidos Aguçados',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Pre 2',
    nexMinimo: null,
    descricao: `Todos os seus sentidos são mais aguçados que o normal. Você recebe treinamento em Percepção ou, se já for treinado nessa perícia, recebe +2 nela. Além disso, não fica desprevenido contra inimigos que não possa ver e, sempre que erra um ataque devido a camuflagem, pode rolar mais uma vez o dado da chance de falha. Pré-requisito: Pre 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'sobrevivencialista',
    nome: 'Sobrevivencialista',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 2',
    nexMinimo: null,
    descricao: `Você aprecia — ou aprecia enfrentar — a natureza. Você recebe treinamento em Sobrevivência ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, você recebe +2 em testes para resistir a efeitos de clima e terreno difícil natural não reduz seu deslocamento nem impede que você execute investidas. Pré-requisito: Int 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'sorrateiro',
    nome: 'Sorrateiro',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Agi 2',
    nexMinimo: null,
    descricao: `Você sabe ser discreto em qualquer situação. Você recebe treinamento em Furtividade ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, você não sofre penalidades por se mover normalmente enquanto está furtivo, nem por seguir alguém em ambientes sem esconderijos ou sem movimento. Pré-requisito: Agi 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'vitalidade-reforcada',
    nome: 'Vitalidade Reforçada',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Vig 2',
    nexMinimo: null,
    descricao: `Você possui uma capacidade superior de suportar ferimentos. Você recebe +1 PV para cada 5% de NEX (ou para cada nível, se estiver usando a regra de nível de experiência) e +2 em Fortitude. Pré-requisito: Vig 2.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'vontade-inabalavel',
    nome: 'Vontade Inabalável',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Pre 2',
    nexMinimo: null,
    descricao: `Sua mente é preparada para suportar os mais rigorosos traumas. Você recebe +1 PE para cada 10% de NEX (ou para cada 2 níveis, se estiver usando a regra de nível de experiência) e +2 em Vontade. Pré-requisito: Pre 2.`,
    livro: 'Sobrevivendo ao Horror',
  },

  // ---------------------------------------------------------------------------
  // SOBREVIVENDO AO HORROR — PODERES PARANORMAIS
  // ---------------------------------------------------------------------------
  {
    id: 'espreitar-da-besta',
    nome: 'Espreitar da Besta',
    tipo: 'paranormal',
    classe: null,
    elemento: 'sangue',
    prerequisito: '',
    nexMinimo: null,
    descricao: `O Sangue do Outro Lado deu a você o poder de controlar seu corpo e se mover exatamente como as bestas predadoras fazem. Você recebe +5 em Furtividade. Em cenas de perseguição (p. 90), se for o caçador, pode usar Furtividade em vez de Atletismo. Em cenas de furtividade (p. 92), seus movimentos são calculados pelos seus instintos, o que permite que faça ações discretas sem sofrer –O de penalidade.

Afinidade: o bônus em Furtividade aumenta para +10.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'instintos-sanguinarios',
    nome: 'Instintos Sanguinários',
    tipo: 'paranormal',
    classe: null,
    elemento: 'sangue',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Ao se conectar com o Sangue do Outro Lado, você desperta instintos animalescos paranormais. Você recebe visão no escuro e faro.

Afinidade: seus instintos aguçados transformam o terror da perseguição em uma tempestade viciante de adrenalina. Você não pode mais ser flanqueado, não fica desprevenido e recebe +5 em testes de resistência contra armadilhas da realidade ou paranormais.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'antecipar-vitalidade',
    nome: 'Antecipar Vitalidade',
    tipo: 'paranormal',
    classe: null,
    elemento: 'morte',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Sua ligação com a Morte permite que você sacrifique sua vitalidade futura para auxiliar seu presente. Quando faz um teste, você pode acumular uma carga de antecipação para adicionar +O a esse teste. Você pode acumular um máximo de cargas de antecipação igual ao seu Vigor. Enquanto tiver uma carga de antecipação, em sua próxima ação de interlúdio dormir em vez de recuperar pontos de vida você perde uma dessas cargas.

Afinidade: você amplia sua capacidade de sacrificar o presente pelo futuro. O limite de cargas de antecipação que você pode acumular aumenta em +2 e você passa a perder 2 cargas por ação dormir.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'aura-de-pavor',
    nome: 'Aura de Pavor',
    tipo: 'paranormal',
    classe: null,
    elemento: 'morte',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Ao receber esse poder, você é tomado por uma aura de Morte que nunca mais o abandona. Do ponto de vista dos outros, é como se o mundo ao seu redor perdesse as cores e se tornasse mais opressor. Você pode gastar 2 PE e uma ação de movimento para deixar uma pessoa ou animal em alcance médio apavorado (Vontade DT Pre reduz para abalado). O alvo não precisa ser capaz de ver você. Esta condição termina ao fim da cena, se o alvo se afastar de você além de alcance médio ou se você usar este efeito em outro alvo. Uma mesma pessoa ou animal só pode sofrer o efeito deste poder uma vez por dia.

Afinidade: a DT para resistir ao poder aumenta em +5 e o número de alvos muda para quaisquer pessoas ou animais escolhidos no alcance.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'absorver-conhecimento',
    nome: 'Absorver Conhecimento',
    tipo: 'paranormal',
    classe: null,
    elemento: 'conhecimento',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Você se conecta com o Conhecimento do Outro Lado para adquirir informação de forma paranormal, sem precisar gastar tempo de pesquisa. Se estiver empunhando uma fonte de conhecimento escrito (como um livro, um texto aberto em um celular ou uma pedra de runas), você pode gastar 1 PE e uma ação completa para fazer uma pergunta a esta fonte. Se a resposta estiver armazenada na fonte, você a obtém automaticamente. Se usar este poder em conjunto com a ação de interlúdio ler, você aumenta o dado de bônus recebido por esta ação em um passo (de d6 para 1d8, por exemplo).

Afinidade: quando usa um ritual de Conhecimento que tenha como alvo 1 pessoa (exceto você), se puder tocar o alvo o custo desse ritual é reduzido em –1 PE.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'apatia-herege',
    nome: 'Apatia Herege',
    tipo: 'paranormal',
    classe: null,
    elemento: 'conhecimento',
    prerequisito: 'Conhecimento 1',
    nexMinimo: null,
    descricao: `Saber tudo é perder tudo. Contudo, não se deve subestimar a capacidade de adaptação humana. Ao se conectar com o Conhecimento do Outro Lado, você usa as experiências grotescas que já viveu para desligar suas emoções e blindar sua mente. Quando faz um teste contra uma condição de medo, você pode gastar 2 PE para rolar o teste novamente. Você deve aceitar o resultado da segunda rolagem, mesmo que seja menor que a primeira. Pré-requisito: Conhecimento 1.

Afinidade: você pode usar esse poder depois de saber se passou no teste, além de poder escolher a melhor rolagem entre as duas.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'conexao-empatica',
    nome: 'Conexão Empática',
    tipo: 'paranormal',
    classe: null,
    elemento: 'energia',
    prerequisito: 'Energia 1',
    nexMinimo: null,
    descricao: `Você consegue usar a Energia do Outro Lado para se conectar com objetos tecnológicos energizados. Você pode gastar uma ação completa e 2 PE para tocar um objeto elétrico que esteja ligado, como um celular, uma batedeira ou uma máquina de lavar roupa. Até o fim da cena, ou até deixar de tocá-lo, você pode conversar com o objeto como se ele fosse um ser senciente, e de algum jeito consegue escutar respostas. Um objeto tem percepção limitada de seus arredores, e sua personalidade e memórias são definidas apenas pelos arquivos ou programas que contém registrado em si; um objeto não tem lembranças do que ocorreu em seus arredores a não ser que tenha uma câmera e arquivos de vídeo em seu sistema, por exemplo. O objeto possui uma atitude inicial indiferente, mas pode ser persuadido com testes de Diplomacia (objetos normalmente têm Vontade 1, mas objetos particularmente sofisticados ou protegidos podem ter Vontade 2 ou 3, a critério do mestre). Apenas você é capaz de "ouvir" o objeto e precisa falar em voz alta para que ele te "escute". Quando o efeito termina, o item emite um lamento enquanto experimenta uma sensação traumática de morte; se você tentar falar novamente com ele, sua atitude será hostil devido ao sofrimento ao qual foi exposto. Pré-requisito: Energia 1.

Afinidade: você recebe +5 em testes de perícias baseadas em Intelecto ou Presença com o item.`,
    livro: 'Sobrevivendo ao Horror',
  },
  {
    id: 'valer-se-do-caos',
    nome: 'Valer-se do Caos',
    tipo: 'paranormal',
    classe: null,
    elemento: 'energia',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Você pode tentar manipular o caos do mundo ao seu redor, um ato que fornece grande poder às custas da ordem de sua mente. Quando faz um teste, você pode escolher tentar controlar o caos. Se fizer isso, você recebe +O nesse teste. Entretanto, se o teste for uma falha, ou se o resultado desse d20 adicional (use um dado de cor diferente para identificá-lo) for igual ou menor que 5, você perde 1d4 pontos de Sanidade.

Afinidade: você perde Sanidade se o teste for uma falha ou se o resultado do O extra for 1 ou 2.`,
    livro: 'Sobrevivendo ao Horror',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 1 — PODERES DE OCULTISTA
  // ---------------------------------------------------------------------------
  {
    id: 'acostumado-a-maldicao-de-elemento',
    nome: 'Acostumado a Maldição de <Elemento>',
    tipo: 'classe',
    classe: 'ocultista',
    elemento: null,
    prerequisito: 'Int 2, conjurar ritual de 2° círculo do elemento escolhido',
    nexMinimo: null,
    descricao: `Escolha um elemento (exceto Medo). Por já interagir ritualísticamente com esta entidade, quando falha em um teste relacionado ao preço da maldição de itens amaldiçoados do elemento escolhido (OPRPG, p. 145), você não perde pontos de sanidade. Você ainda sofre quaisquer outros efeitos negativos de itens amaldiçoados. Pré-requisitos: Int 2, conjurar ritual de 2° círculo do elemento escolhido.`,
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'reter-ritual-de-combate',
    nome: 'Reter Ritual de Combate',
    tipo: 'classe',
    classe: 'ocultista',
    elemento: null,
    prerequisito: 'Int 2, conjurar ritual de 1° círculo',
    nexMinimo: null,
    descricao: `Quando um ritual com duração retida está afetando negativamente um alvo, você pode mudar a duração para cena, como reação, no instante em que ele sai da linha de efeito. Além disso, quando sofre uma condição que o faz deixar de reter rituais, você pode gastar uma reação e 1 PE por ritual para mudar a duração dos rituais para cena, evitando perder seus efeitos. O custo é de 1 PE por ritual. Pré-requisitos: Int 2, conjurar ritual de 1° círculo. Este poder só pode ser escolhido se estiver usando a regra opcional de Reter Ritual (p. 58).`,
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'ritual-intenso',
    nome: 'Ritual Intenso',
    tipo: 'classe',
    classe: 'ocultista',
    elemento: null,
    prerequisito: 'Pre 2',
    nexMinimo: null,
    descricao: `Você soma sua Presença nas rolagens de dano e de cura de seus rituais. Pré-requisito: Pre 2.`,
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'saude-sobrenatural',
    nome: 'Saúde Sobrenatural',
    tipo: 'classe',
    classe: 'ocultista',
    elemento: null,
    prerequisito: 'Int 2, Pre 2, conjurar ritual de 1° círculo',
    nexMinimo: null,
    descricao: `Uma vez por cena, você pode gastar uma ação de movimento e 3 PE para receber pontos de vida temporários igual a sua Presença x 10. Por exemplo, se tem Pre 3, recebe 30 PV temporários. Esses pontos temporários desaparecem no fim da cena e não são cumulativos com eles mesmos. Pré-requisitos: Int 2, Pre 2, conjurar ritual de 1° círculo.`,
    livro: 'Arquivos Secretos 1',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 1 — PODERES GERAIS
  // ---------------------------------------------------------------------------
  {
    id: 'cicatrizes-expostas',
    nome: 'Cicatrizes Expostas',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'ter cicatrizes',
    nexMinimo: null,
    descricao: `Você tem cicatrizes graves, físicas ou psicológicas, que podem deixá-lo em um estado de ira caso sejam expostas. Você pode gastar uma ação de movimento para expor sua cicatriz. Se fizer isso, sempre que causar dano, você causa +1d8 pontos de dano do mesmo tipo, mas sofre –O em testes de Vontade e testes que exijam calma, como ficar furtivo ou traduzir um idioma. Caso outro ser exponha sua cicatriz, ainda que contra sua vontade, os mesmos efeitos se aplicam. Os efeitos duram até o fim da cena. Pré-requisitos: ter cicatrizes.`,
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'curiosidade-oculta',
    nome: 'Curiosidade Oculta',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 2',
    nexMinimo: null,
    descricao: `Seu gosto bizarro pelo oculto abriu sua mente. Você recebe treinamento em Ocultismo ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, quando faz um teste de Vontade, você pode gastar 2 PE para trocar a perícia por Ocultismo. Pré-requisito: Int 2.`,
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'especialista-esoterico',
    nome: 'Especialista Esotérico',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Int 3, conjurar ritual de 2° círculo, Domínio Esotérico (SaH, p. 26)',
    nexMinimo: null,
    descricao: `Poucos compreendem o uso de catalisadores ritualísticos como você. Ao conjurar um ritual, você pode combinar os efeitos de até três catalisadores ritualísticos diferentes ao mesmo tempo. Pré-requisitos: Int 3, conjurar ritual de 2° círculo, Domínio Esotérico (SaH, p. 26).`,
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'habilidade-aprimorada',
    nome: '<Habilidade> Aprimorada',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Escolha uma habilidade ou um ritual que tenha DT. A DT para resistir a essa habilidade ou ritual aumenta em +2. Você pode escolher este poder outras vezes para habilidades e rituais diferentes, e até duas vezes para uma mesma habilidade ou ritual (neste caso, a DT aumenta em um total de +5).`,
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'instintos-urbanos',
    nome: 'Instintos Urbanos',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Agi 2',
    nexMinimo: null,
    descricao: `Você não confia na "sociedade civilizada" e está pronto para sobreviver na selva de concreto. Você recebe treinamento em Crime ou, se já for treinado nesta perícia, receba +2 nela. Além disso, quando entra em um ambiente fechado, pode fazer um teste de Crime (DT 20) para identificar as melhores saídas. Se passar, você identifica uma rota de fuga. Em termos de regras, se decidir escapar do lugar, você recebe uma ação de movimento extra no primeiro turno da fuga e +2 na Defesa até fugir. Se o lugar não tiver rotas de fuga identificáveis, você recebe +2 na Defesa enquanto estiver nele. Pré-requisito: Agi 2.`,
    livro: 'Arquivos Secretos 1',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 1 — PODERES PARANORMAIS DE SANGUE
  // ---------------------------------------------------------------------------
  {
    id: 'ferro-maculado',
    nome: 'Ferro Maculado',
    tipo: 'paranormal',
    classe: null,
    elemento: 'sangue',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Acostumado a usar munições especiais contra ameaças, sua relação com armas que disparam projéteis se intensifica conforme você é corrompido pelo Sangue. Quando faz um ataque com uma arma de disparo, você pode gastar 2 PV para amaldiçoar a munição a ser disparada. Até o fim do turno, essa munição é considerada amaldiçoada e causa +1d6 pontos de dano de Sangue. Este dano é multiplicado em caso de acerto crítico.

Afinidade. O dano muda para +1d8 pontos de dano de Sangue.`,
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'placas-sanguinolentas',
    nome: 'Placas Sanguinolentas',
    tipo: 'paranormal',
    classe: null,
    elemento: 'sangue',
    prerequisito: 'conjurar ritual de Sangue',
    nexMinimo: null,
    descricao: `Você consegue manipular parte do Sangue presente em um ritual para criar placas rubras que o protegem. Quando você conjura um ritual de Sangue, recebe um bônus na Defesa equivalente ao círculo do ritual até o início do seu próximo turno (se for de 3º círculo, por exemplo, recebe +3 na Defesa). Pré-requisito: conjurar ritual de Sangue.

Afinidade. O bônus na Defesa passa a ser igual ao círculo do ritual +2 (+3 para um ritual de 1º círculo, +4 para um ritual de 2º círculo e assim por diante).`,
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'sangue-corrosivo',
    nome: 'Sangue Corrosivo',
    tipo: 'paranormal',
    classe: null,
    elemento: 'sangue',
    prerequisito: '',
    nexMinimo: null,
    descricao: `A maldade do Sangue borbulha nas suas veias como um ácido extraído do inferno. Você pode gastar uma ação de movimento e 1 PE para transformar seu sangue em uma substância corrosiva até o fim da cena. Quando você sofre dano causado por um ser que está adjacente, você também causa 1d10 pontos de dano de Sangue nele.

Afinidade. O dano muda para +2d10 pontos de dano de Sangue.`,
    livro: 'Arquivos Secretos 1',
  },
  {
    id: 'sangue-prazeroso',
    nome: 'Sangue Prazeroso',
    tipo: 'paranormal',
    classe: null,
    elemento: 'sangue',
    prerequisito: 'Sangue 1',
    nexMinimo: null,
    descricao: `Sua conexão com o Sangue permite que você resista a dor apenas para que consiga sentir ela por mais tempo. Enquanto estiver machucado, você recebe resistência a dano 5. Pré-requisito: Sangue 1.

Afinidade. Enquanto estiver machucado, você também recebe +20 PV temporários, mas apenas uma vez por cena.`,
    livro: 'Arquivos Secretos 1',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 6 — PODERES DE COMBATENTE
  // ---------------------------------------------------------------------------
  {
    id: 'analise-combativa',
    nome: 'Análise Combativa',
    tipo: 'classe',
    classe: 'combatente',
    elemento: null,
    prerequisito: 'Ciente das Cicatrizes (SaH, p. 14)',
    nexMinimo: null,
    descricao: `Você especializou suas habilidades de análise. Quando faz um teste usando Ciente das Cicatrizes, você recebe +5 nesse teste. Além disso, se enfrentar uma ameaça que já havia investigado com sucesso usando Ciente das Cicatrizes, você recebe +2 em testes contra ela. Pré-requisito: Ciente das Cicatrizes (SaH, p. 14).`,
    livro: 'Arquivos Secretos 6',
  },
  {
    id: 'especialista-em-protecao-leve',
    nome: 'Especialista em Proteção Leve',
    tipo: 'classe',
    classe: 'combatente',
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Você sabe usufruir do que a proteção leve tem de melhor. Se estiver usando uma proteção leve, você recebe +2 na Defesa e em Reflexos.`,
    livro: 'Arquivos Secretos 6',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 6 — PODERES DE ESPECIALISTA
  // ---------------------------------------------------------------------------
  {
    id: 'doutor-em-emergencias',
    nome: 'Doutor em Emergências',
    tipo: 'classe',
    classe: 'especialista',
    elemento: null,
    prerequisito: 'Especialista em Emergências (SaH, p. 33)',
    nexMinimo: null,
    descricao: `Sua eficiência como socorrista é ainda melhor. Qualquer cicatrizante ou medicamento que recupere pontos de vida, ou forneça pontos de vida temporários, aplicados por você recebe 1d8 PV adicionais em seu efeito (um cicatrizante recupera 3d8+2 PV, enquanto um anti-inflamatório fornece 2d8+2 PV temporários). Além disso, você recebe +5 em testes de Medicina para aplicar tratamento (OPRPG, p. 46), e, se passar no teste, o paciente recebe +10 em seu próximo teste de Fortitude contra a doença ou veneno, em vez de +5. Pré-requisito: Especialista em Emergências (SaH, p. 33).`,
    livro: 'Arquivos Secretos 6',
  },
  {
    id: 'farmaceutico-de-campo',
    nome: 'Farmacêutico de Campo',
    tipo: 'classe',
    classe: 'especialista',
    elemento: null,
    prerequisito: 'treinado em Medicina e Profissão (químico ou similar)',
    nexMinimo: null,
    descricao: `Você se especializou na fabricação e administração de cicatrizantes (OPRPG, p. 65) e medicamentos (SaH, p. 43). Uma vez por cena de interlúdio em que tenha um kit de medicina, escolha um cicatrizante ou medicamento e gaste 2 PE, mais 2 PE por categoria do item escolhido. Você cria o item. Quando o mesmo kit de medicina é usado 3 vezes por esta habilidade, ele é consumido. Você pode usar esse poder novamente na mesma cena, mas para cada uso além do primeiro, também precisa gastar uma ação de interlúdio. Pré-requisitos: treinado em Medicina e Profissão (químico ou similar).`,
    livro: 'Arquivos Secretos 6',
  },
  {
    id: 'medico-da-salvacao',
    nome: 'Médico da Salvação',
    tipo: 'classe',
    classe: 'especialista',
    elemento: null,
    prerequisito: 'Paramédico',
    nexMinimo: null,
    descricao: `Você se especializou em salvar vidas. Os dados de sua habilidade de médico de campo Paramédico aumentam de d10 para d12. Além disso, quando usa a habilidade Paramédico, você pode gastar 3 PE, uma vez por rodada, para usá-la como uma ação de movimento, em vez de ação padrão. Pré-requisito: Paramédico.`,
    livro: 'Arquivos Secretos 6',
  },
  {
    id: 'resgatar-da-morte',
    nome: 'Resgatar da Morte',
    tipo: 'classe',
    classe: 'especialista',
    elemento: null,
    prerequisito: 'veterano em Medicina',
    nexMinimo: null,
    descricao: `Não haverá baixas no seu turno. Quando faz um teste de primeiros socorros (OPRPG, p. 46), você pode gastar 2 PE para obter sucesso automático nesse teste. Você só pode usar essa habilidade no mesmo ser uma vez por cena. Pré-requisitos: veterano em Medicina.`,
    livro: 'Arquivos Secretos 6',
  },
  {
    id: 'veterano-da-equipe-de-trauma',
    nome: 'Veterano da Equipe de Trauma',
    tipo: 'classe',
    classe: 'especialista',
    elemento: null,
    prerequisito: 'Paramédico, Equipe de Trauma',
    nexMinimo: null,
    descricao: `Você é o melhor entre os melhores. Quando usa a habilidade de médico de campo Equipe de Trauma, você remove até três condições negativas (exceto morrendo), em vez de apenas uma. Pré-requisitos: Paramédico, Equipe de Trauma.`,
    livro: 'Arquivos Secretos 6',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 6 — PODERES DE OCULTISTA
  // ---------------------------------------------------------------------------
  {
    id: 'barreira-do-oculto',
    nome: 'Barreira do Oculto',
    tipo: 'classe',
    classe: 'ocultista',
    elemento: null,
    prerequisito: 'Especialista em Elemento no elemento escolhido, NEX 30%',
    nexMinimo: 30,
    descricao: `Buscando sobreviver, você aprendeu a se proteger através da conexão com uma entidade. Escolha um elemento. Quando conjura um ritual do elemento escolhido, você pode gastar PE para receber bônus na Defesa, na proporção de 1 PE para cada +2 na Defesa, até seu limite de PE. O bônus dura por 1 rodada. Pré-requisitos: Especialista em Elemento no elemento escolhido, NEX 30%.`,
    livro: 'Arquivos Secretos 6',
  },
  {
    id: 'grao-mestre-em-elemento',
    nome: 'Grão-Mestre em Elemento',
    tipo: 'classe',
    classe: 'ocultista',
    elemento: null,
    prerequisito: 'Mestre em Elemento no elemento escolhido, NEX 60%',
    nexMinimo: 60,
    descricao: `Você se tornou mestre em causar efeitos adicionais quando conjura seus rituais. Escolha um elemento. Quando conjura um ritual do elemento escolhido, você pode gastar 1 PE para causar um dos efeitos a seguir, de acordo com o elemento.
• Sangue: se o alvo for um aliado, ele recebe +2d4 pontos de dano extra de Sangue em suas rolagens de dano; se o alvo for um inimigo, ele fica debilitado por 1 rodada.
• Morte: se o alvo for um aliado, ele recebe 3d8+3 pontos de vida temporários; se o alvo for um inimigo, ele fica enjoado por 1 rodada.
• Conhecimento: se o alvo for um aliado, ele recebe +2 em testes de perícia; se o alvo for um inimigo, ele fica esmorecido por 1 rodada.
• Energia: se o alvo for um aliado, ele recebe +6m em todas as suas formas de deslocamento; se o alvo for um inimigo, ele fica desprevenido por 1 rodada.

Os efeitos desta habilidade afetam apenas 1 alvo (podendo ser você) e duram até o fim da cena (salvo descrição contrária), mesmo que o ritual afete vários e tenha duração diferente. Além disso, as condições causadas por esta habilidade ignoram imunidades. Pré-requisitos: Mestre em Elemento no elemento escolhido, NEX 60%.`,
    livro: 'Arquivos Secretos 6',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 6 — PODERES GERAIS
  // ---------------------------------------------------------------------------
  {
    id: 'adaptacao-climatica',
    nome: 'Adaptação Climática',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Vig 2',
    nexMinimo: null,
    descricao: `Através de treinamentos contra hipotermia e hipertermia, você se tornou mais resistente ao clima. Você recebe +2 em Fortitude e não sofre dano por clima muito quente, muito frio, calor extremo ou frio extremo. Pré-requisito: Vig 2.`,
    livro: 'Arquivos Secretos 6',
  },
  {
    id: 'especialista-em-armas-improvisadas',
    nome: 'Especialista em Armas Improvisadas',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'For 2 ou Agi 2, treinado em Luta',
    nexMinimo: null,
    descricao: `Você treinou com armas improvisadas até dominá-las. Você não sofre penalidade em testes de ataque por usar uma arma improvisada. Além disso, suas rolagens de dano com armas improvisadas recebem +1 dado de dano extra do mesmo tipo (uma cadeira que causa 1d6 pontos de dano de impacto passa a causar 2d6, por exemplo). Pré-requisitos: For 2 ou Agi 2, treinado em Luta.`,
    livro: 'Arquivos Secretos 6',
  },
  {
    id: 'muito-sorrateiro',
    nome: 'Muito Sorrateiro',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: 'Sorrateiro (SaH, p. 36)',
    nexMinimo: null,
    descricao: `Suas habilidades de discrição beiram a inexistência. Quando uma cena de furtividade começa, role 1d4 e subtraia o valor da sua visibilidade inicial. Por exemplo, se começaria com visibilidade 0 e rola 2 no d4, no início da cena de furtividade, sua visibilidade é –2. Além disso, você recebe +3 em Furtividade. Pré-requisito: Sorrateiro (SaH, p. 36).`,
    livro: 'Arquivos Secretos 6',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 6 — PODERES PARANORMAIS
  // ---------------------------------------------------------------------------
  {
    id: 'escudo-espiral-temporal',
    nome: 'Escudo Espiral Temporal',
    tipo: 'paranormal',
    classe: null,
    elemento: 'morte',
    prerequisito: 'Morte 2',
    nexMinimo: null,
    descricao: `Sua conexão com a Morte permite que crie proteções que envelhecem itens usados contra você. Uma vez por rodada, você pode gastar 2 PE como reação para afetar uma arma ou munição que vai te causar dano. Se o dano for causado por uma munição, você recebe RD 20 contra ele e o projétil se desfaz em cinzas. Se o dano for causado por uma arma corpo a corpo, você recebe RD 10 contra ele e a arma envelhece (ela sofre 10 pontos de dano químico). A RD dessa habilidade não funciona contra dano de Energia. Pré-requisito: Morte 2.

Afinidade: você pode usar essa habilidade mais de uma vez por rodada e o dano químico muda para 20.`,
    livro: 'Arquivos Secretos 6',
  },
  {
    id: 'grilhoes-de-lodo',
    nome: 'Grilhões de Lodo',
    tipo: 'paranormal',
    classe: null,
    elemento: 'morte',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Você é capaz de criar correntes, vinhas e grilhões de Lodo pelo chão. Você pode gastar 2 PE para criar uma área afetada por esses grilhões com 9m de raio a partir de você. A área dura até o fim da cena. Todos os seres na área (exceto você e criaturas de Morte) sofrem 3d6 pontos de dano de Morte e ficam lentos (Fortitude DT <atributo mais alto> reduz o dano à metade e evita a condição por 1 rodada).

Afinidade: o dano muda para 6d6 e a condição muda para enredado.`,
    livro: 'Arquivos Secretos 6',
  },
  {
    id: 'salto-de-dados',
    nome: 'Salto de Dados',
    tipo: 'paranormal',
    classe: null,
    elemento: 'energia',
    prerequisito: 'Energia 2',
    nexMinimo: null,
    descricao: `Através da sua conexão com a Energia, você consegue "copiar seus dados" na realidade por um breve momento. Você pode gastar uma ação completa 2 PE para marcar um símbolo em seu próprio corpo. Esse símbolo dura por 1 dia ou até ser consumido, o que acontecer primeiro. Você não pode ter dois símbolos marcados simultaneamente. A qualquer momento, você pode gastar 3 PE como uma reação para consumir a marca e retornar o seu estado físico e mental para o momento em que fez o símbolo em si mesmo (PV, PE, condições, efeitos, estatísticas da ficha, tudo retorna para o estado em que estava quando você fez a marca). Entretanto, você perde a memória de tudo o que vivenciou desde que se marcou. Além da interpretação, a perda de memória se reflete em regras, deixando você alquebrado e frustrado até o fim da cena e pasmo por 1d4+1 rodadas. Pré-requisito: Energia 2.

Afinidade: a duração do símbolo muda para 1 ano ou até ser consumido, o que acontecer primeiro.`,
    livro: 'Arquivos Secretos 6',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 4 — PODERES DE COMBATENTE
  // ---------------------------------------------------------------------------
  {
    id: 'chuva-de-balas',
    nome: 'Chuva de Balas',
    tipo: 'classe',
    classe: 'combatente',
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Você sabe muito bem como administrar e economizar sua munição durante os combates, assim como sabe sentar o dedo no momento certo. Todos os pacotes de munição que estiverem em seu inventário têm sua duração dobrada por cena. Além disso, ao fazer um ataque com uma arma de fogo, antes de rolar dano, pode sacrificar um ou mais pacotes de munições para causar +2 dados do mesmo tipo de dano no ataque por pacote sacrificado. Se estiver usando a regra opcional de contagem de munição, a quantidade de balas em cada pacote aumenta em +10.`,
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'combatente-esforcado',
    nome: 'Combatente Esforçado',
    tipo: 'classe',
    classe: 'combatente',
    elemento: null,
    prerequisito: 'For 3 ou Vig 3',
    nexMinimo: null,
    descricao: `Seu treinamento intenso e físico de dar orgulho teve bons rendimentos. Você recebe +1 PE para cada NEX. Pré-requisitos: For 3 ou Vig 3.`,
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'treinamento-militarizado',
    nome: 'Treinamento Militarizado',
    tipo: 'classe',
    classe: 'combatente',
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `O bônus recebido por exercitar-se em uma cena de interlúdio muda para +1d8 e também pode ser gasto em rolagens de dano, mas só pode usar um bônus em cada rolagem.`,
    livro: 'Arquivos Secretos 4',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 4 — PODERES DE ESPECIALISTA
  // ---------------------------------------------------------------------------
  {
    id: 'analise-conturbada',
    nome: 'Análise Conturbada',
    tipo: 'classe',
    classe: 'especialista',
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Sua eloquência mórbida e palavras angustiantes, por mais que macabras, trazem uma certa reflexão valiosa. Durante uma cena de investigação, você pode gastar uma ação padrão para trazer suas teorias e análises obscuras em voz alta, implantando paranoia em quem puder ouvir. Agentes voluntários que estiverem presentes no ambiente, incluindo você, podem escolher dar ouvidos às suas falas. Caso aceitem, rolam 1d6 e recebem o resultado em bônus para testes baseados em Intelecto e Presença até o fim da cena, mas também perdem o valor da rolagem em pontos de sanidade.`,
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'profissao-perigo',
    nome: 'Profissão Perigo',
    tipo: 'classe',
    classe: 'especialista',
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Em situações difíceis, você sabe dar valor à qualquer coisa, podendo transformar a tralha mais insignificante em algo útil. Você pode gastar uma ação completa e 4 PE para desmontar seus equipamentos e construir algo novo utilizando os seus materiais. Ao fazer isso, você se desfaz de um item qualquer em seu inventário e recebe um novo item operacional à sua escolha no lugar dele. O item escolhido não deve ultrapassar a categoria e os espaços do item sacrificado. Você só pode fazer isso uma vez por missão.`,
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'quase-novo',
    nome: 'Quase Novo',
    tipo: 'classe',
    classe: 'especialista',
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Ao fazer uma ação de manutenção (veja Fabricação em Campo, SaH, p. 94) durante uma cena de interlúdio, o item reparado recebe +10 PV adicionais. Além disso, você pode usar a mesma ação para adicionar ao equipamento uma nova modificação temporária de uma categoria que possa acessar. A modificação dura até o início da próxima cena de interlúdio.`,
    livro: 'Arquivos Secretos 4',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 4 — PODERES DE OCULTISTA
  // ---------------------------------------------------------------------------
  {
    id: 'explorador-da-nevoa',
    nome: 'Explorador da Névoa',
    tipo: 'classe',
    classe: 'ocultista',
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Você já criou costume por estar em lugares onde ninguém gostaria de pisar. Uma vez por cena, você pode gastar 2 PE para distinguir o estado da Membrana de um ambiente (estável, danificada, arruinada etc.). Se fizer isso e a Membrana estiver danificada ou pior, você perde 1 SAN, mas reduz o custo de conjuração de todos os seus rituais em 1 PE.`,
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'sinestesia-paranormal',
    nome: 'Sinestesia Paranormal',
    tipo: 'classe',
    classe: 'ocultista',
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `O Outro Lado afeta sua percepção sensorial à níveis extremos. Quando entra em uma cena em que a Membrana está danificada ou pior, você passa a conseguir ouvir o gosto do caos, sentir o som da imprevisibilidade, saborear o cheiro do intangivel, percebendo influências do Outro Lado de maneiras diferentes. Você pode resistir a sinestesia (nada acontece e seus sentidos voltam ao normal) ou aceitá-la. Caso aceite, você perde 1d6 SAN e pode escolher dois pares de perícias para trocar os atributos usados entre elas. Por exemplo, você pode trocar Atletismo (passa a usar Presença, em vez de Força) e Percepção (passa a usar Força, em vez de Presença), ou trocar Investigação (passa a usar Agilidade, em vez de Intelecto) e Reflexos (passa a usar Intelecto, em vez de Agilidade). Você não pode usar esse poder em perícias que exijam treinamento e você não tenha. A sinestesia é interrompida quando você sai da área afetada pela Membrana e só pode ser aceita novamente no dia seguinte.`,
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'terrores-noturnos',
    nome: 'Terrores Noturnos',
    tipo: 'classe',
    classe: 'ocultista',
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Os sussurros da escuridão não cessam e parecem se fortalecer conforme seus olhos se fecham. Quando dormir em uma cena de interlúdio, role 1d100. Se o resultado for 51 ou mais, nada acontece e você tem bons sonhos. Se o resultado for 50 ou menos, você é tomado por pesadelos paranormais. Sua condição de descanso muda para precária e você perde 1d4 SAN. Entretanto, escolha 1 poder paranormal ou ritual que você atenda os pré-requisitos para usá-lo. Até o início da próxima cena de interlúdio, você pode usar o poder ou conjurar o ritual uma única vez, seguindo as regras dele normalmente.`,
    livro: 'Arquivos Secretos 4',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 4 — PODERES GERAIS
  // ---------------------------------------------------------------------------
  {
    id: 'gororoba',
    nome: 'Gororoba',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `Sopa de cereal com bebida energética? Seu paladar é um tanto quanto peculiar. Em uma cena de interlúdio, você pode alimentar-se uma vez sem gastar uma ação e sem precisar de fato ter acesso à refeição (você improvisa com os restos que encontra).`,
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'ruido-branco',
    nome: 'Ruído Branco',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `O barulho de um ambiente caótico se torna ruído para sua concentração. Enquanto estiver em um ambiente movimentado ou um local com muitas conversas paralelas, você recebe +1d6 em testes de Investigação e Percepção. Além disso, à critério do mestre, pode gastar 1 PE, uma vez por cena, para ouvir entre as vozes uma conversa que forneça uma informação útil para a missão.`,
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'uma-ultima-olhada',
    nome: 'Uma Última Olhada',
    tipo: 'geral',
    classe: null,
    elemento: null,
    prerequisito: '',
    nexMinimo: null,
    descricao: `É melhor prevenir do que remediar. Na última rodada de uma cena de investigação, você pode gastar 2 PE, uma vez por cena, para se esforçar mais, aproveitando o pouco tempo que tem para analisar tudo rapidamente com seu grupo. Em termos de regras, o número de rodadas disponíveis aumenta em +1.`,
    livro: 'Arquivos Secretos 4',
  },

  // ---------------------------------------------------------------------------
  // ARQUIVOS SECRETOS 4 — PODERES PARANORMAIS DE ENERGIA
  // ---------------------------------------------------------------------------
  {
    id: 'sobrepor-imprevisivel',
    nome: 'Sobrepor Imprevisível',
    tipo: 'paranormal',
    classe: null,
    elemento: 'energia',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Seus movimentos são caóticos e imprevisíveis. Se você não sabe o que está fazendo, muito menos o inimigo. Uma vez por rodada, e apenas no início dela, você pode gastar 2 PE para rolar 1d20. Se o resultado for par, some ele ao seu valor de iniciativa. Se for ímpar, subtraia. Sua posição na ordem de iniciativa é mudada de acordo com o novo resultado.

Afinidade: você pode rolar 2d20 e escolher o resultado que preferir em um dos dados.`,
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'foco-gravitacional',
    nome: 'Foco Gravitacional',
    tipo: 'paranormal',
    classe: null,
    elemento: 'energia',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Equipamentos de grande importância para você parecem sofrer de uma anomalia gravitacional. Escolha um equipamento. Ele passa a ocupar 0 espaços enquanto estiver guardado com você, porém, toda vez que for empunhado, tem 25% de chance (1 a 25 em 1d100) de sair voando descontroladamente e parar em um espaço em alcance curto à escolha do mestre. Se o equipamento for destruído ou consumido, escolha outro equipamento disponível.

Afinidade: aumenta a quantidade de equipamentos para três.`,
    livro: 'Arquivos Secretos 4',
  },
  {
    id: 'traco-de-inconsistencia',
    nome: 'Traço de Inconsistência',
    tipo: 'paranormal',
    classe: null,
    elemento: 'energia',
    prerequisito: '',
    nexMinimo: null,
    descricao: `Sua presença causa perturbações em aparelhos eletrônicos que possam capturá-la. Você pode gastar 2 PE, como reação, para esconder sua identidade em imagens digitais capturadas por câmeras de segurança ou fotográficas, no momento em que é fotografado/filmado.

Afinidade: sua presença se torna incapaz de ser capturada por imagens digitais permanentemente. Além disso, sua voz também se torna distorcida em gravações.`,
    livro: 'Arquivos Secretos 4',
  },
];

/**
 * Atualização de regra (Arquivos Secretos 4, "Regras Caóticas", p. 64): novo uso
 * para a perícia Tecnologia. Guardado aqui como texto de referência — ainda não
 * há, na app, um ecrã de "regras/atualizações" que o mostre.
 */
export const ATUALIZACAO_TECNOLOGIA_AS4 = {
  titulo: 'Novo uso para a Perícia Tecnologia',
  nome: 'Obter Informações',
  dt: 5,
  descricao: `Você pode gastar uma ação completa para fazer uma rápida pesquisa na internet sobre um local ou pessoa. Faça um teste de Tecnologia (DT 5). Se passar, você adquire 1 informação +1 para cada 5 pontos acima da DT.`,
  livro: 'Arquivos Secretos 4',
};

export const TIPOS_PODER = [
  { id: 'classe', nome: 'Poder de Classe' },
  { id: 'trilha', nome: 'Poder de Trilha' },
  { id: 'paranormal', nome: 'Poder Paranormal' },
  { id: 'geral', nome: 'Poder Geral' },
  { id: 'origem', nome: 'Poder de Origem' },
];

export const PODERES_POR_ID = Object.fromEntries(PODERES.map((p) => [p.id, p]));
