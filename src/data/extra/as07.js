// Arquivos Secretos 7 (Pacote #7 — secção "A crença no sobrenatural") — trilhas e origens
// Texto verbatim do PDF "Arquivos-Secretos-07-v1.0.pdf" (pp. 80-88).
// Origens: p. 80. Nova trilha de Especialista (Monstruoso): pp. 81-84.
// Nova trilha de Ocultista (Monstruoso): pp. 85-88.
// Várias páginas estão com o texto rodado/inclinado no PDF; os parágrafos foram
// reconstruídos a partir da extração por página. Nada foi resumido nem inventado.
// O glifo do dado (fonte "d20-Regular") aparece como `O`, tal como nos ficheiros
// as01/as03 (ex.: `–O`, `–2O`, `+O`).

export const TRILHAS_AS07 = [
  {
    classe: 'especialista',
    id: 'monstruoso-especialista',
    nome: 'Monstruoso',
    descricao: `Os limites impostos pela realidade em seu corpo o impedem de ser aquilo que você realmente deveria ser, então você se apropria daquilo que o Outro Lado o fornece e se transforma com estratégia, buscando eficácia.

Especial: esta trilha é uma variante do monstruoso para combatentes (SaH, pp. 17-21) e usa a “Progressão de NEX” apresentada na regra opcional Nível de Experiência e Nível de Exposição (SaH, p. 98), mesmo que esta regra em si não esteja sendo usada. O personagem recebe todas as alterações apropriadas ao seu NEX descritas na progressão e, se a regra de Nível de Experiência estiver em uso, recebe o dobro de NEX sempre que se expõe ao paranormal.`,
    livro: 'Arquivos Secretos 7',
    poderes: [
      {
        nex: 10,
        nome: 'Ser Experimentado',
        descricao: `Você se torna treinado em Ocultismo (se já for treinado, em vez disso recebe +2 nessa perícia). Escolha um elemento paranormal entre Sangue, Morte, Conhecimento ou Energia e sofra as consequências (–2 em Diplomacia, Enganação e Intuição). Uma vez por dia, você precisa fazer experimentos cruéis com seu corpo usando algum componente ritualístico desse elemento. Fazer o experimento custa uma ação completa e consome o componente. Se fizer isso, você recupera 1d8+1 PV e, até o fim do dia, recebe os efeitos descritos a seguir, conforme o elemento escolhido. Caso contrário, você sofre de efeitos nesse dia similares a fome e sede (OPRPG, p. 292). Só é possível fazer um experimento por dia. Por fim, se adquirir afinidade com um elemento, deverá escolher aquele selecionado para esta habilidade.

SANGUE Você consome a carne e o sangue maculado em um processo de experimentação. Seus músculos crescem com velocidade sobrenatural e a adrenalina corre em suas veias. Você passa a ser considerado Grande (+2 em manobras e –2 em Furtividade) e soma sua Força em testes baseados nesse atributo. Além disso, você passa a usar Força, em vez de Presença, para determinar seus PE.

MORTE Você inala as cinzas de um passado esquecido e deixa seu corpo reagir à mudança. Sua pele se acinzenta e seus olhos escurecem. Você recebe 2d6 PV temporários, uma ação padrão adicional por cena e soma seu Vigor em testes baseados nesse atributo. Além disso, você passa a usar Vigor, em vez de Presença, para determinar seus PE.

CONHECIMENTO Você absorve os textos incompreensíveis, forçando sua mente à adquirir um conhecimento que não é seu através de um esforço torturante. Escolha duas perícias. Você é considerado treinado nas perícias escolhidas e soma seu Intelecto em testes baseados nesse atributo. Além disso, você passa a usar Intelecto, em vez de Presença, para determinar seus PE.

ENERGIA Você injeta em suas veias reagentes químicos que poderiam acabar com a sua vida, enquanto recebe choques elétricos para lhe manter consciente, alterando a química do seu corpo para que reaja com maior velocidade. Você pode, uma vez por rodada, sacar um item como ação livre (esse efeito é cumulativo com os de itens como bandoleira), todos os seus deslocamentos aumentam em 6m e você soma sua Agilidade em testes baseados nesse atributo. Além disso, você passa a usar Agilidade, em vez de Presença, para determinar seus PE.`,
      },
      {
        nex: 40,
        nome: 'Ser Testado',
        descricao: `Seu corpo demonstra costume com os estímulos frequentes ao seu organismo, exigindo métodos alternativos para resultados mais surpreendentes. Você faz sacrifícios físicos e mentais ainda mais doloroso para testar seus limites e sofre as consequências (–2 muda para –5 em Diplomacia, Enganação e Intuição). Agora, ao fazer o experimento, você recupera 2d8+2 PV e, até o fim do dia, também recebe os efeitos descritos a seguir, conforme seu elemento.

SANGUE Você fica ainda mais bestial. Ao fazer o experimento, seus ataques causam +1d6 pontos de dano de Sangue e você recebe RD 2. Além disso, você pode devorar seus pontos de Intelecto (até o limite de Intelecto 0). Para cada ponto devorado, seus ataques causam +1d6 pontos de dano de Sangue e sua RD aumenta em +2. Essa alteração de atributo não afeta PV, PE, SAN ou número de perícias treinadas. Você não pode alterar pontos que não sejam seus (como os fornecidos por itens ou rituais).

MORTE Sua natureza se torna mais fria e cadavérica. Ao fazer o experimento, o número de turnos em que pode ficar morrendo aumenta em +1 e você recebe 2d8 PV temporários no início de cada cena. Além disso, você pode necrosar seus pontos de Força (até o limite de Força 0). Para cada ponto necrosado, o número de turnos em que pode ficar morrendo aumenta em +1. Além disso, para cada ponto necrosado, você recebe +2d8 PV temporários no início de cada cena. Essa alteração de atributo não afeta PV, PE, SAN ou número de perícias treinadas. Você não pode alterar pontos que não sejam seus (como os fornecidos por itens ou rituais).

CONHECIMENTO A verdade sobre tudo se reflete em seu ser, tornando-o mais estático. Ao fazer o experimento, você recebe +1d6 em testes baseados em Intelecto. Além disso, você pode inexistir seus pontos de Agilidade (até o limite de Agilidade 0). Para cada ponto inexistido, você recebe +1d6 em testes baseados em Intelecto. Essa alteração de atributo não afeta PV, PE, SAN ou número de perícias treinadas. Você não pode alterar pontos que não sejam seus (como os fornecidos por itens ou rituais).

ENERGIA O caos acelera sua mente e corpo enquanto gasta ambos como se fossem combustíveis. Ao fazer o experimento, você recebe +1d6 em testes de ataque e +2 na Defesa. Além disso, você pode queimar seus pontos de Vigor (até o limite de Vigor 0). Para cada ponto queimado, você recebe +1d6 em testes de ataque e +2 na Defesa. Essa alteração de atributo não afeta PV, PE, SAN ou número de perícias treinadas. Você não pode alterar pontos que não sejam seus (como os fornecidos por itens ou rituais).`,
      },
      {
        nex: 65,
        nome: 'Ser Expurgado',
        descricao: `Você expurga um braço do seu corpo para que ele, pouco a pouco, se desate das amarras limitantes da Realidade, substituindo-o por algo superior: um braço feito através da união de componentes ritualísticos e alimentado por seus experimentos constantes (essa alteração faz sua Presença ser reduzida permanentemente em 1 e a penalidade de –5 mudar para –O em Diplomacia, Enganação e Intuição). Agora, ao fazer o experimento, você recupera 3d8+3 PV e, até o fim do dia, também se beneficia de um dos braços a seguir, conforme seu elemento. Sem fazer o experimento, a parte paranormal fica inutilizada e você sofre as consequências disso (por exemplo, se for uma perna, fica lento).

SANGUE Seu braço novo é envolto por sangue, espinhos e lâminas que alimentam a carne pulsante com dor. Você recebe +1 ponto em Força, +1d8 em testes de ataques corpo a corpo e o dano fornecido por Ser Testado muda para +1d8. Além disso, uma vez por rodada, quando ataca com outra arma, você pode gastar 1 PE para fazer um ataque desarmado com sua parte nova.

MORTE Seu braço novo é esquelético e pútrido, feito de uma aglomeração repulsiva de madeira podre, lodo, ossos e cinzas. Você recebe +1 ponto em Vigor e, quando toca em um item pela primeira vez com essa parte, pode gastar 3 PE e escolher entre envelhece-lo ou interagir com o passado dele. Se escolher envelhece-lo, o item sofre 50 pontos de dano de Morte (tocar um item portado por alguém que resiste exige sucesso na manobra quebrar). Se escolher interagir com o passado, você tem uma visão nebulosa da última pessoa que pegou no item e o que ela fez enquanto estava com ele. A visão dura 1 minuto.

CONHECIMENTO Seu braço novo é feito com ouro maldito, encravada por inúmeras escrituras antigas e Sigilos. Você recebe +1 ponto em Intelecto e pode gastar uma ação completa e 3 PE para tocar a sua cabeça ou a cabeça de outro ser com o braço (seres sem cabeça não sofrem esse efeito; tocar a cabeça de alguém que resiste exige sucesso em um teste de ataque corpo a corpo). Se tocou a própria cabeça, até o fim da cena, você está sob efeito do ritual Detecção de Ameaças discente. Se tocou a cabeça de outro ser, o alvo fica sob efeito do ritual Mergulho Mental por 3 rodadas (você não precisa sustentar PE; o alvo não tem direito a teste de resistência; você não pode aumentar a duração; se perder o contato com a cabeça, o ritual acaba).

ENERGIA Seu braço novo é uma prótese metálica energizada por cabos em sobrecarga e baterias vazadas. Você recebe +1 ponto em Agilidade e pode gastar uma ação de movimento e 2 PE para manipular a corporeidade do braço molécula por molécula até o fim da cena, permitindo que, por exemplo, atravesse superfícies sólidas (em regras, sempre que fizer um teste e conseguir usar o braço dessa forma a seu favor criativamente, a critério do mestre, você recebe +5 nesse teste). Além disso, você também pode gastar uma ação de interlúdio para acoplar um item de uma mão ao braço, podendo usá-lo sem manter a mão ocupada.`,
      },
      {
        nex: 99,
        nome: 'Ser Apavorante',
        descricao: `Suas experimentações alcançaram o limite entre a humanidade e a monstruosidade, tornando seu corpo o ambiente adequado para a entidade preenchê-lo (esse limite faz sua Presença ser reduzida permanentemente em 1 e a penalidade de –O mudar para –2O em Diplomacia, Enganação e Intuição). Agora, ao fazer o experimento, você recupera 4d8+4 PV e, até o fim do dia, também recebe os efeitos descritos a seguir, conforme seu elemento.

SANGUE O seu corpo já não é mais seu. Você agora é uma massa bestial impregnada com o mesmo fluxo que banha o Outro Lado. Uma junção de partes desproporcionais costuradas e moldadas a força, a maioria nem sequer parece humana. Consumir é tudo que importa agora. Devorar. Crescer. Experimentar já não carrega o mesmo sentido que possuía antes. Você deve saborear tudo. Os efeitos de Ser Experimentado mudam para: você passa a ser considerado Enorme (+5 em manobras e –5 em Furtividade) e soma sua Força em testes baseados nesse atributo. Além disso, você passa a usar Força, em vez de Presença, para determinar seus PE. Por fim, recebe +1 ponto em Força e aprende o ritual Vínculo de Sangue.

MORTE Tempo. Tudo que você tem agora é tempo. Se você conseguisse sentir algo, seria tortura. Seu corpo cadavérico deixa um rastro de lodo por onde passa, consumindo o potencial de tudo por onde quer ande. Cada segundo distorcido em minuto. Hora. Dia. Semana. Mês. Ano. Década. Século. Milênio. Não parece haver distinção nenhuma entre essas palavras. Tudo que elas são é tempo. E você está no centro dele, presenciando cada tic, cada toc. A única experiência que lhe falta é o fim. Os efeitos de Ser Experimentado mudam para: você recebe 4d6 PV temporários, duas ações padrão adicionais por cena e soma seu Vigor em testes baseados nesse atributo. Além disso, você passa a usar Vigor, em vez de Presença, para determinar seus PE. Por fim, recebe +1 ponto em Vigor e aprende o ritual Distorção Temporal.

CONHECIMENTO A sua mente carrega muito mais do que deveria. Todas as descobertas. Tudo que você decifrou. Todo esse conhecimento espera para desmantelar qualquer sinal de sanidade que lhe resta. Você virou a maçaneta, sua mão já está pronta para empurrá-la e presenciar o segredo que o aguarda atrás dela. Não, você não pode perder ainda. Existe um último experimento. Talvez, só talvez, dividindo o tudo em várias partes… Os efeitos de Ser Experimentado mudam para: escolha três perícias. Você é considerado expert nas perícias escolhidas e soma seu Intelecto em testes baseados nesse atributo. Além disso, você passa a usar Intelecto, em vez de Presença, para determinar seus PE. Por fim, recebe +1 ponto em Intelecto e aprendo o ritual Controle Mental.

ENERGIA Você é um experimento que falhou catastroficamente, tudo que poderia dar errado aconteceu. Duh, era óbvio que ia ser assim, era justamente o propósito de tudo isso! Você consegue sentir todas as partículas fundamentais do seu corpo se movendo de uma maneira caótica, incapazes de parar em um mesmo lugar mais de uma vez. Seu corpo se desmaterializa e é remontado constantemente em posições diferentes, como se saltasse pelo tecido do espaço. Os efeitos de Ser Experimentado mudam para: você pode, três vezes por rodada, sacar um item como ação livre (esse efeito é cumulativo com os de itens como bandoleira), todos os seus deslocamentos aumentam em 12m e você soma sua Agilidade em testes baseados nesse atributo. Além disso, você passa a usar Agilidade, em vez de Presença, para determinar seus PE. Por fim, recebe +1 ponto em Agilidade e aprende o ritual Teletransporte.`,
      },
    ],
  },
  {
    classe: 'ocultista',
    id: 'monstruoso-ocultista',
    nome: 'Monstruoso',
    descricao: `Talvez seja a solidão, quem sabe a curiosidade ou o insuportável medo do silêncio. Se comunicar com a Realidade, para você, parece muito mais complexo do que conversar com o incompreensível, então você se envolveu com o Outro Lado, buscando uma comunicação constante entre o seu corpo e uma entidade.

Especial: esta trilha é uma variante do monstruoso para combatentes (SaH, pp. 17-21) e usa a “Progressão de NEX” apresentada na regra opcional Nível de Experiência e Nível de Exposição (SaH, p. 98), mesmo que esta regra em si não esteja sendo usada. O personagem recebe todas as alterações apropriadas ao seu NEX descritas na progressão e, se a regra de Nível de Experiência estiver em uso, recebe o dobro de NEX sempre que se expõe ao paranormal.`,
    livro: 'Arquivos Secretos 7',
    poderes: [
      {
        nex: 10,
        nome: 'Ser Escarificado',
        descricao: `Você recebe +2 em Ocultismo. Escolha um elemento paranormal entre Sangue, Morte, Conhecimento ou Energia e sofra as consequências (–2 em Diplomacia, Enganação e Intuição). Uma vez por dia, você precisa eternizar símbolos em seu corpo com o uso de componentes ritualísticos e isso não se faz através de meras tatuagens, mas sim da escarificação da pele, algo que leva tempo, cuidado e deve ser repetido diariamente. Fazer a escarificação custa uma ação completa e consome o componente. Se fizer isso, você recupera 1d4 PE e, até o fim do dia, recebe os efeitos descritos a seguir, conforme o elemento escolhido. Caso contrário, você sofre de efeitos nesse dia similares a fome e sede (OPRPG, p. 292). Só é possível fazer uma escarificação por dia. Por fim, se adquirir afinidade com um elemento, deverá escolher aquele selecionado para esta habilidade.

SANGUE Então está decidido. Sua pele será a fundação da porta que você está construindo para o Sangue em seu corpo. Você rasga a sua pele com formas agressivas e, ao mesmo tempo, fluídas. A dor é apenas um preço a ser pago para o poder que o aguarda. Você passa a usar Força, em vez de Presença, para determinar seus PE e a DT dos seus rituais. Além disso, recebe +1 ponto em Força.

MORTE Então está decidido. Sua pele será a fundação da porta que você está construindo para a Morte em seu corpo. Você eterniza os símbolos de seus rituais usando de formas e movimentos inconscientemente invertidos. A tinta usada mistura cinzas, vinho apodrecido e o lodo da Morte. Você passa a usar Vigor, em vez de Presença, para determinar seus PE e a DT dos seus rituais. Além disso, recebe +1 ponto em Vigor.

CONHECIMENTO Então está decidido. Sua pele será a fundação da porta que você está construindo para o Conhecimento em seu corpo. Cada Sigilo de Eloquência é posicionado em seu corpo com uma precisão milimétrica, todas as formas são matematicamente perfeitas. Você passa a usar Intelecto, em vez de Presença, para determinar seus PE e a DT dos seus rituais. Além disso, recebe +1 ponto em Intelecto.

ENERGIA Então está decidido. Sua pele será a fundação da porta que você está construindo para a Energia em seu corpo. Você marca na sua pele de maneira desorganizada formas com mudanças bruscas e repentinas usando qualquer processo que possa gerar uma queimadura, seja química, por ferro quente ou por frio extremo. Você passa a usar Agilidade, em vez de Presença, para determinar seus PE e a DT dos seus rituais. Além disso, recebe +1 ponto em Agilidade.`,
      },
      {
        nex: 40,
        nome: 'Ser Perfurado',
        descricao: `Já parte de sua própria formação física, os símbolos ritualísticos se comunicam diretamente com as necessidades de seu corpo. Os símbolos agora clamam por permanecerem expostos e assim deverá ser, o que resulta em consequências (–2 muda para –5 em Diplomacia, Enganação e Intuição). Agora, ao fazer a escarificação, você recupera 1d6 PE e, até o fim do dia, também recebe os efeitos descritos a seguir, conforme seu elemento.

SANGUE Você fica sem espaço para cortar, a única solução é marcar por cima das suas cicatrizes. Isso não apaga a dor da que já estava lá, pelo contrário, você sente as duas. Cada traço traz o sofrimento extremo como no momento em que foi marcado. Através do sofrimento, você forma o batente da porta para a entidade do Outro Lado. Você recebe o poder Tatuagem Ritualística, mas diferente do normal, ele também se aplica a todos os rituais de Sangue marcados em sua pele, não apenas aos de alcance pessoal que têm você como alvo (se já tiver o poder, apenas altere a maneira como ele funciona). Além disso, uma vez por cena, se estiver machucado ou sob efeito de uma condição de fadiga, você pode conjurar um ritual marcado em sua pele como reação. Finalmente, você recebe +5 em testes de concentração com rituais de Sangue marcados.

MORTE Suas tatuagens começam a consumir toda a carne ao redor delas, murchando seu corpo e diminuindo o precioso quadro que é sua pele. Você começa a juntar gravetos, folhas mortas, ossos humanos e de outros animais junto do Lodo e inserir essa amálgama dentro do seu corpo para expandir o espaço do seu corpo que pode ser marcado. Através do cadaverismo, você forma o batente da porta para a entidade do Outro Lado. Você recebe o poder Tatuagem Ritualística, mas diferente do normal, ele também se aplica a todos os rituais de Morte marcados em sua pele, não apenas aos de alcance pessoal que têm você como alvo (se já tiver o poder, apenas altere a maneira como ele funciona). Além disso, uma vez por cena, se estiver morrendo ou sob efeito de uma condição de sentidos, você pode conjurar um ritual marcado em sua pele como reação. Finalmente, você recebe +5 em testes de concentração com rituais de Morte marcados.

CONHECIMENTO Você começa a vestir ornamentos feitos de ouro e prata marcados com os símbolos de seus rituais. A posição desses adornos é pensada para formar linhas invisíveis que se conectem em mais Sigilos de Eloquência, tudo no seu corpo conversa perfeitamente com o Outro Lado. Através da verdade enlouquecedora, você forma o batente da porta para a entidade do Outro Lado. Você recebe o poder Tatuagem Ritualística, mas diferente do normal, ele também se aplica a todos os rituais de Conhecimento marcados em sua pele, não apenas aos de alcance pessoal que têm você como alvo (se já tiver o poder, apenas altere a maneira como ele funciona). Além disso, uma vez por cena, se estiver sob efeito de uma condição mental ou de medo, você pode conjurar um ritual marcado em sua pele como reação. Finalmente, você recebe +5 em testes de concentração com rituais de Conhecimento marcados.

ENERGIA As queimaduras em seu corpo começam a derreter sua pele ou, no mínimo, deixá-lá em um estado maleável. Você consegue transformar os símbolos marcados em outros com suas próprias mãos, numa sensação indescritível de ter a sua pele em um estado líquido. Através do caos fervente, você forma o batente da porta para a entidade do Outro Lado. Você recebe o poder Tatuagem Ritualística, mas diferente do normal, ele também se aplica a todos os rituais de Energia marcados em sua pele, não apenas aos de alcance pessoal que têm você como alvo (se já tiver o poder, apenas altere a maneira como ele funciona). Além disso, uma vez por cena, se estiver sob efeito de uma condição de paralisia ou de sentidos, você pode conjurar um ritual marcado em sua pele como reação. Finalmente, você recebe +5 em testes de concentração com rituais de Energia marcados.`,
      },
      {
        nex: 65,
        nome: 'Ser Rasgado',
        descricao: `Os símbolos precisam ir ainda mais fundo. Você consegue ouvir a entidade conversando com você, senti-la respirando como se fosse um organismo próprio se apossando cada vez mais do seu corpo. A entidade agora não só escuta suas súplicas e as de seu corpo, ela vive dentro de você, respira através de você e te conhece melhor do que a sua própria mente (essa “simbiose” faz sua Presença ser reduzida permanentemente em 1 e a penalidade de –5 mudar para –O em Diplomacia, Enganação e Intuição). Agora, ao fazer a escarificação, você recupera 1d8 PE e, até o fim do dia, também recebe os efeitos descritos a seguir, conforme seu elemento.

SANGUE A porta está pronta. Não existe mais pele no seu corpo. Você precisa romper seus músculos anormalmente robustos e expostos para marcar seus rituais em sua própria carne. A dor excruciante desse ato, em conjunto da agonia inexplicável de ainda sentir cada traço feito na pele que já não é mais, forma um banquete para o Sangue, uma refeição que pode ser repartida. Quando conjura um ritual de Sangue, você pode gastar uma ação de movimento e 2d8+2 PV para servir esse sangue a um aliado adjacente. Se o alvo aceitá-lo e ingeri-lo como reação, ele recebe +O em testes baseados em Agilidade, Força e Vigor até o fim da cena. Além disso, a DT dos seus rituais de Sangue marcados na pele aumenta em +2.

MORTE A porta está pronta. Você carrega a Morte dentro de si. Galhos e ossos atravessam sua pele por dentro e dessas aberturas o lodo começa a vazar e formar curvas e espirais escurecidas por cima de sua pele acinzentada e marcada por dezenas de símbolos e formas invertidas, tornando-se um com todas elas. Você aprende o ritual Cicatrização. Se já o conhece, em vez disso o custo para conjurá-lo diminui em –1 PE (cumulativo com outras fontes). Quando conjura um ritual de Morte diferente de Cicatrização, você pode conjurar Cicatrização como uma ação de movimento. Além disso, a DT dos seus rituais de Morte marcados na pele aumenta em +2.

CONHECIMENTO A porta está pronta. Você substitui a tinta de suas tatuagens por ouro líquido que se solidifica em um processo não muito agradável, mas necessário. Não parece haver mais dúvidas, o Conhecimento dentro de você possui todas as respostas das perguntas que nunca foram ditas. É preciso ter muito cuidado com as perguntas que são feitas. Quando conjura um ritual de Conhecimento, você pode gastar uma ação de movimento e 2 PE para obter revelações sobre o alvo do ritual (o mestre deve responder a 5 perguntas sobre a ficha, história e/ou personalidade do alvo com “sim” ou “não”). Se você mesmo for o alvo, em vez disso, você se torna capaz de ver coisas incorpóreas, invisíveis ou ocultas de outra forma pelo paranormal, até o fim da cena. Além disso, a DT dos seus rituais de Conhecimento marcados na pele aumenta em +2.

ENERGIA A porta está pronta. Sua pele esporadicamente se torna a matéria caótica da Energia. Suas escarificações não permanecem iguais por muito tempo. Linhas se movem e brilham em faíscas e pequenas descargas percorrem seu corpo constantemente, fazendo seus músculos reagirem antes mesmo de sua mente compreender o que acontece. Quando conjura um ritual de Energia, você pode gastar uma ação de movimento e 3 PE para se teletransportar para um espaço desocupado a 3m de distância e receber bônus na Defesa igual ao número de PE gastos no ritual que conjurou. Esse bônus na Defesa dura por 1 rodada. Além disso, a DT dos seus rituais de Energia marcados na pele aumenta em +2.`,
      },
      {
        nex: 99,
        nome: 'Ser Mutilado',
        descricao: `As escarificações são tão profundas que os rituais marcados dispensam qualquer comunicação para serem conjurados, entrando em um estado de efeito frequente que só terminará com a morte de seu portador (essas feridas fazem sua Presença ser reduzida permanentemente em 1 e a penalidade de –O mudar para –2O em Diplomacia, Enganação e Intuição). Agora, ao fazer a escarificação, você recupera 1d12 PE e, até o fim do dia, também recebe os efeitos descritos a seguir, conforme seu elemento.

SANGUE Seu corpo jorra sangue em um fluxo interminável. Todos os sacrifícios que poderiam ser feitos já foram realizados por você. Afinal, você é o sacrifício. Todos os preços já foram pagos. Agora só lhe resta se deleitar nos frutos de todas as suas dores. A própria Entidade do Sangue testou a sua resiliência e você se provou digno de sentir a sua comunicação. A porta está aberta e a conexão é quase absoluta. Você recebe +1 ponto em Força e pode conjurar rituais de Sangue marcados na pele sem a necessidade de fala, gestos e componentes. Além disso, aprende um ritual de Sangue de 4º círculo e um ritual de Medo de 4º círculo à sua escolha. O ritual de Medo escolhido recebe todos os benefícios dessa trilha, como se fosse um ritual de Sangue.

MORTE A casca decrépita que um dia chamou de corpo contém a infinitude de momentos em que você poderia ter parado com tudo isso, mas não fez. A sua dedicação à Morte lhe trouxe toda a destruição que você poderá causar. Você chegará para todas as coisas. Você é o fim. A porta está aberta e a conexão é quase absoluta. Você recebe +1 ponto em Vigor e pode conjurar rituais de Morte marcados na pele sem a necessidade de fala, gestos e componentes. Além disso, aprende um ritual de Morte de 4º círculo e um ritual de Medo de 4º círculo à sua escolha. O ritual de Medo escolhido recebe todos os benefícios dessa trilha, como se fosse um ritual de Morte.

CONHECIMENTO A Verdade está marcada em seu corpo, esperando para ser lembrada. Você sabe onde ela está. Você sabe como acessá-la. E você sabe o que vai acontecer depois de lembrar do que deveria ser esquecido. Você foi aplicado aos Sigilos de Eloquência e se tornou exatamente o que buscava. A porta está aberta e a conexão é quase absoluta. Você recebe +1 ponto em Intelecto e pode conjurar rituais de Conhecimento marcados na pele sem a necessidade de fala, gestos e componentes. Além disso, aprende um ritual de Conhecimento de 4º círculo e um ritual de Medo de 4º círculo à sua escolha. O ritual de Medo escolhido recebe todos os benefícios dessa trilha, como se fosse um ritual de Conhecimento.

ENERGIA Era inevitável o desenrolar dessa peça. Seu corpo vibra e pisca em cores e símbolos diferentes como se estivesse em uma pista de boate, seguindo um ritmo caótico de uma música, ou um ruído, que ninguém além de você escuta. Os símbolos se alternam rápido demais para serem compreendidos, mas você não precisa entendê-los. Você já está conectado a todos eles ao mesmo tempo. Não existe mais linguagem. Não existe mais comunicação. Existe apenas o Caos, pulsando através de você. A porta está aberta e a conexão é quase absoluta. Você recebe +1 ponto em Agilidade e pode conjurar rituais de Energia marcados na pele sem a necessidade de fala, gestos e componentes. Além disso, aprende um ritual de Energia de 4º círculo e um ritual de Medo de 4º círculo à sua escolha. O ritual de Medo escolhido recebe todos os benefícios dessa trilha, como se fosse um ritual de Energia.`,
      },
    ],
  },
];

export const ORIGENS_AS07 = [
  {
    id: 'exorcizado',
    nome: 'Exorcizado',
    descricao: `Você já esteve sob influência de uma grande força sobrenatural opressora, que dominou seu corpo para realizar façanhas incompreensíveis.`,
    pericias: ['fortitude', 'ocultismo'],
    periciasLivres: 0,
    periciasNota: '',
    poder: {
      nome: 'O Que Restou',
      descricao: `Uma parte da criatura paranormal que o possuiu continua dentro de você. Escolha um elemento (exceto Medo). Você recebe RD 5 contra o tipo do elemento escolhido. Entretanto, sempre que entrar em contato com esse elemento pela primeira vez em uma cena (seja ao presenciar rituais, ítens amaldiçoados, criaturas ou poderes paranormais), você perde 2 SAN.`,
    },
    livro: 'Arquivos Secretos 7',
  },
  {
    id: 'sensitivo-rebelde',
    nome: 'Sensitivo Rebelde',
    descricao: `Apesar de lutar contra sua sensitividade paranormal, ela nunca te abandonou. Não importa o quanto você tentou negar, as visões continuavam voltando. Para você, nunca foi uma questão de fé. O sobrenatural sempre foi sua realidade.`,
    pericias: ['intuicao', 'vontade'],
    periciasLivres: 0,
    periciasNota: '',
    poder: {
      nome: 'Sussurros e Vultos',
      descricao: `Ao lidar com outras pessoas, inesperadamente surgem vozes e vultos na sua cabeça que, por mais assustadoras que sejam, ajudam a compreendê-las. Quando faz um teste de Diplomacia, Enganação, Intimidação ou Intuição, você pode escolher perder 2 SAN para receber +5 nesse teste.`,
    },
    livro: 'Arquivos Secretos 7',
  },
];
