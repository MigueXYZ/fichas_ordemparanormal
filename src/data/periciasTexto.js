// Descrição das perícias — extraído do Livro Base, capítulo 2 ("Descrição das Perícias").
// Texto verbatim (pt-BR), reconstruído do PDF de duas colunas. Nada foi resumido nem reescrito.
//   resumo -> frase/parágrafo de apresentação da perícia
//   texto  -> texto completo da perícia (apresentação + usos), parágrafos separados por \n\n
//   usos   -> sub-secções de uso; `treino` = grau exigido conforme impresso ('' se nenhum),
//             `dt` = DT conforme impressa ('Variável' quando varia no texto, 'Oposto' quando
//             é um teste oposto, '' quando o livro não indica DT)
//   box    -> quadro lateral impresso ao lado da perícia (só onde existe)
// O símbolo O representa dados (ex.: –O = um dado de penalidade), como no original.

export const PERICIAS_TEXTO = {
  acrobacia: {
    livro: 'Livro Base',
    resumo: 'Você consegue fazer proezas acrobáticas.',
    texto:
      'Você consegue fazer proezas acrobáticas.\n\n' +
      'Amortecer Queda (Veterano, DT 15). Quando cai, você pode gastar uma reação e fazer um teste de Acrobacia para reduzir o dano. Se passar, reduz o dano da queda em 1d6, mais 1d6 para cada 5 pontos pelos quais o resultado do teste exceder a DT. Se reduzir o dano a zero, você cai de pé.\n\n' +
      'Equilíbrio. Se estiver andando por superfícies precárias, você precisa fazer testes de Acrobacia para não cair. Cada ação de movimento exige um teste. Se passar, você avança metade do seu deslocamento. Se falhar, não avança. Se falhar por 5 ou mais, cai. A DT é 10 para piso escorregadio, 15 para uma superfície estreita (como o topo de um muro) e 20 para uma superfície muito estreita (como uma corda esticada). Você pode sofrer –O no teste para avançar seu deslocamento total. Quando está se equilibrando você fica desprevenido e, se sofrer dano, deve fazer um novo teste de Acrobacia; se falhar, cai.\n\n' +
      'Escapar. Você pode escapar de amarras. A DT é igual ao resultado do teste de Agilidade de quem o amarrou +10, se você estiver preso por cordas, ou 30, se você estiver preso por algemas. Este uso gasta uma ação completa.\n\n' +
      'Levantar-se Rapidamente (Treinado, DT 20). Se estiver caído, você pode fazer um teste de Acrobacia para ficar de pé. Você precisa ter uma ação de movimento disponível. Se passar no teste, se levanta como uma ação livre. Se falhar, gasta sua ação de movimento, mas continua caído.\n\n' +
      'Passar por Espaço Apertado (Treinado, DT 25). Você pode se espremer por lugares estreitos, por onde apenas sua cabeça normalmente passaria. Você gasta uma ação completa e avança metade do deslocamento.\n\n' +
      'Passar por Inimigo. Você pode atravessar um espaço ocupado por um inimigo como parte de seu movimento. Faça um teste de Acrobacia oposto ao teste de Acrobacia, Iniciativa ou Luta do oponente (o que for melhor). Se você passar, atravessa o espaço; se falhar, não atravessa e sua ação de movimento termina. Um espaço ocupado por um inimigo conta como terreno difícil.',
    usos: [
      {
        nome: 'Amortecer Queda',
        treino: 'Veterano',
        dt: '15',
        texto:
          'Quando cai, você pode gastar uma reação e fazer um teste de Acrobacia para reduzir o dano. Se passar, reduz o dano da queda em 1d6, mais 1d6 para cada 5 pontos pelos quais o resultado do teste exceder a DT. Se reduzir o dano a zero, você cai de pé.',
      },
      {
        nome: 'Equilíbrio',
        treino: '',
        dt: 'Variável',
        texto:
          'Se estiver andando por superfícies precárias, você precisa fazer testes de Acrobacia para não cair. Cada ação de movimento exige um teste. Se passar, você avança metade do seu deslocamento. Se falhar, não avança. Se falhar por 5 ou mais, cai. A DT é 10 para piso escorregadio, 15 para uma superfície estreita (como o topo de um muro) e 20 para uma superfície muito estreita (como uma corda esticada). Você pode sofrer –O no teste para avançar seu deslocamento total. Quando está se equilibrando você fica desprevenido e, se sofrer dano, deve fazer um novo teste de Acrobacia; se falhar, cai.',
      },
      {
        nome: 'Escapar',
        treino: '',
        dt: 'Variável',
        texto:
          'Você pode escapar de amarras. A DT é igual ao resultado do teste de Agilidade de quem o amarrou +10, se você estiver preso por cordas, ou 30, se você estiver preso por algemas. Este uso gasta uma ação completa.',
      },
      {
        nome: 'Levantar-se Rapidamente',
        treino: 'Treinado',
        dt: '20',
        texto:
          'Se estiver caído, você pode fazer um teste de Acrobacia para ficar de pé. Você precisa ter uma ação de movimento disponível. Se passar no teste, se levanta como uma ação livre. Se falhar, gasta sua ação de movimento, mas continua caído.',
      },
      {
        nome: 'Passar por Espaço Apertado',
        treino: 'Treinado',
        dt: '25',
        texto:
          'Você pode se espremer por lugares estreitos, por onde apenas sua cabeça normalmente passaria. Você gasta uma ação completa e avança metade do deslocamento.',
      },
      {
        nome: 'Passar por Inimigo',
        treino: '',
        dt: 'Oposto',
        texto:
          'Você pode atravessar um espaço ocupado por um inimigo como parte de seu movimento. Faça um teste de Acrobacia oposto ao teste de Acrobacia, Iniciativa ou Luta do oponente (o que for melhor). Se você passar, atravessa o espaço; se falhar, não atravessa e sua ação de movimento termina. Um espaço ocupado por um inimigo conta como terreno difícil.',
      },
    ],
  },

  adestramento: {
    livro: 'Livro Base',
    resumo: 'Você sabe lidar com animais.',
    texto:
      'Você sabe lidar com animais.\n\n' +
      'Acalmar Animal (DT 25). Você acalma um animal nervoso ou agressivo. Isso permite a você controlar um touro furioso ou convencer um cão de guarda a não atacá-lo. Este uso gasta uma ação completa.\n\n' +
      'Cavalgar. Você pode andar a cavalo. Montar exige uma ação de movimento, mas você pode montar como uma ação livre com um teste de Adestramento contra DT 20 (porém, se falhar por 5 ou mais, cai no chão). Andar em terreno plano não exige testes, mas passar por obstáculos ou andar em terreno acidentado, sim. A DT é 15 para obstáculos pequenos ou terreno ruim (estrada esburacada) e 20 para obstáculos grandes ou terreno muito ruim (floresta à noite). Se você falhar, cai da montaria e sofre 1d6 pontos de dano. Cavalgar é parte de seu movimento e não exige uma ação.\n\n' +
      'Se estiver a cavalo, você pode galopar. Gaste uma ação completa e faça um teste de Adestramento. Você avança um número de quadrados de 1,5m igual ao seu deslocamento (modificado pela montaria) mais o resultado do teste. Você só pode galopar em linha reta e não pode galopar em terreno difícil.\n\n' +
      'Manejar Animal (DT 15). Você faz um animal realizar uma tarefa para a qual foi treinado. Isso permite usar Adestramento como Pilotagem para veículos de tração animal, como carroças. Este uso gasta uma ação de movimento.',
    usos: [
      {
        nome: 'Acalmar Animal',
        treino: '',
        dt: '25',
        texto:
          'Você acalma um animal nervoso ou agressivo. Isso permite a você controlar um touro furioso ou convencer um cão de guarda a não atacá-lo. Este uso gasta uma ação completa.',
      },
      {
        nome: 'Cavalgar',
        treino: '',
        dt: 'Variável',
        texto:
          'Você pode andar a cavalo. Montar exige uma ação de movimento, mas você pode montar como uma ação livre com um teste de Adestramento contra DT 20 (porém, se falhar por 5 ou mais, cai no chão). Andar em terreno plano não exige testes, mas passar por obstáculos ou andar em terreno acidentado, sim. A DT é 15 para obstáculos pequenos ou terreno ruim (estrada esburacada) e 20 para obstáculos grandes ou terreno muito ruim (floresta à noite). Se você falhar, cai da montaria e sofre 1d6 pontos de dano. Cavalgar é parte de seu movimento e não exige uma ação.\n\nSe estiver a cavalo, você pode galopar. Gaste uma ação completa e faça um teste de Adestramento. Você avança um número de quadrados de 1,5m igual ao seu deslocamento (modificado pela montaria) mais o resultado do teste. Você só pode galopar em linha reta e não pode galopar em terreno difícil.',
      },
      {
        nome: 'Manejar Animal',
        treino: '',
        dt: '15',
        texto:
          'Você faz um animal realizar uma tarefa para a qual foi treinado. Isso permite usar Adestramento como Pilotagem para veículos de tração animal, como carroças. Este uso gasta uma ação de movimento.',
      },
    ],
  },

  artes: {
    livro: 'Livro Base',
    resumo:
      'Você sabe se expressar com diversas formas de arte, como música, dança, escrita, pintura, atuação e outras.',
    texto:
      'Você sabe se expressar com diversas formas de arte, como música, dança, escrita, pintura, atuação e outras.\n\n' +
      'Impressionar. Faça um teste de Artes oposto pelo teste de Vontade de quem você está tentando impressionar. Se você passar, recebe +2 em testes de perícia baseadas em Presença contra essa pessoa na mesma cena. Se falhar, sofre –2 nesses testes, e não pode tentar de novo na mesma cena. Se estiver tentando impressionar mais de uma pessoa, o mestre faz apenas um teste pela plateia toda, usando o melhor bônus. Este uso leva de alguns minutos (música ou dança) até algumas horas (apresentação de teatro).',
    usos: [
      {
        nome: 'Impressionar',
        treino: '',
        dt: 'Oposto',
        texto:
          'Faça um teste de Artes oposto pelo teste de Vontade de quem você está tentando impressionar. Se você passar, recebe +2 em testes de perícia baseadas em Presença contra essa pessoa na mesma cena. Se falhar, sofre –2 nesses testes, e não pode tentar de novo na mesma cena. Se estiver tentando impressionar mais de uma pessoa, o mestre faz apenas um teste pela plateia toda, usando o melhor bônus. Este uso leva de alguns minutos (música ou dança) até algumas horas (apresentação de teatro).',
      },
    ],
  },

  atletismo: {
    livro: 'Livro Base',
    resumo: 'Você pode realizar façanhas atléticas.',
    texto:
      'Você pode realizar façanhas atléticas.\n\n' +
      'Corrida. Gaste uma ação completa e faça um teste de Atletismo. Você avança um número de quadrados de 1,5m igual ao seu deslocamento mais o resultado do teste. Por exemplo, se você tem deslocamento 9m (6 quadrados) e tira 15 no teste, avança 21 quadrados. Você só pode correr em linha reta e não pode correr em terreno difícil. Você pode correr por um número de rodadas igual ao seu Vigor. Após isso, deve fazer um teste de Fortitude por rodada (DT 5 + 5 por teste anterior). Se falhar, fica fatigado.\n\n' +
      'Escalar. Gaste uma ação de movimento e faça um teste de Atletismo. Se passar, você avança metade do seu deslocamento. Se falhar, não avança. Se falhar por 5 ou mais, você cai. A DT é 10 para superfícies com apoios para os pés e mãos (como um barranco com raízes), 15 para um portão ou árvore, 20 para um muro ou parede com reentrâncias e 25 para um muro ou parede liso (como um prédio). Você pode sofrer –O no teste para avançar seu deslocamento total. Quando está escalando você fica desprevenido e, se sofrer dano, deve fazer um novo teste de Atletismo; se falhar, você cai. Se um personagem adjacente a você estiver escalando e cair, você pode tentar pegá-lo. Faça um teste de Atletismo contra a DT da superfície +5. Se passar, você segura o personagem. Se falhar por 5 ou mais, você também cai!\n\n' +
      'Natação. Se estiver na água, você precisa gastar uma ação de movimento e fazer um teste de Atletismo por rodada para não afundar. A DT é 10 para água calma, 15 para agitada e 20 ou mais para tempestuosa. Se passar, você pode avançar metade de seu deslocamento. Se falhar, consegue boiar, mas não avançar. Se falhar por 5 ou mais, você afunda. Se quiser avançar mais, você pode gastar uma segunda ação de movimento na mesma rodada para outro teste de Atletismo. Se você estiver submerso (seja por ter falhado no teste de Atletismo, seja por ter mergulhado de propósito), deve prender a respiração. Você pode prender a respiração por um número de rodadas igual ao seu Vigor. Após isso, deve fazer um teste de Fortitude por rodada (DT 5 + 5 por teste anterior). Se falhar, se afoga (é reduzido a 0 pontos de vida) e fica morrendo (veja o Capítulo 4). Você sofre penalidade de carga em testes de natação.\n\n' +
      'Saltar. Você pode pular sobre buracos ou obstáculos ou alcançar algo elevado. Para um salto longo, a DT é 5 por quadrado de 1,5m (DT 10 para 3m, 15 para 4,5m, 20 para 6m e assim por diante). Para um salto em altura, a DT é 15 por quadrado de 1,5m (30 para 3m). Você deve ter pelo menos 6m para correr e pegar impulso (sem esse espaço, a DT aumenta em +5). Saltar é parte de seu movimento e não exige uma ação.',
    usos: [
      {
        nome: 'Corrida',
        treino: '',
        dt: '',
        texto:
          'Gaste uma ação completa e faça um teste de Atletismo. Você avança um número de quadrados de 1,5m igual ao seu deslocamento mais o resultado do teste. Por exemplo, se você tem deslocamento 9m (6 quadrados) e tira 15 no teste, avança 21 quadrados. Você só pode correr em linha reta e não pode correr em terreno difícil. Você pode correr por um número de rodadas igual ao seu Vigor. Após isso, deve fazer um teste de Fortitude por rodada (DT 5 + 5 por teste anterior). Se falhar, fica fatigado.',
      },
      {
        nome: 'Escalar',
        treino: '',
        dt: 'Variável',
        texto:
          'Gaste uma ação de movimento e faça um teste de Atletismo. Se passar, você avança metade do seu deslocamento. Se falhar, não avança. Se falhar por 5 ou mais, você cai. A DT é 10 para superfícies com apoios para os pés e mãos (como um barranco com raízes), 15 para um portão ou árvore, 20 para um muro ou parede com reentrâncias e 25 para um muro ou parede liso (como um prédio). Você pode sofrer –O no teste para avançar seu deslocamento total. Quando está escalando você fica desprevenido e, se sofrer dano, deve fazer um novo teste de Atletismo; se falhar, você cai. Se um personagem adjacente a você estiver escalando e cair, você pode tentar pegá-lo. Faça um teste de Atletismo contra a DT da superfície +5. Se passar, você segura o personagem. Se falhar por 5 ou mais, você também cai!',
      },
      {
        nome: 'Natação',
        treino: '',
        dt: 'Variável',
        texto:
          'Se estiver na água, você precisa gastar uma ação de movimento e fazer um teste de Atletismo por rodada para não afundar. A DT é 10 para água calma, 15 para agitada e 20 ou mais para tempestuosa. Se passar, você pode avançar metade de seu deslocamento. Se falhar, consegue boiar, mas não avançar. Se falhar por 5 ou mais, você afunda. Se quiser avançar mais, você pode gastar uma segunda ação de movimento na mesma rodada para outro teste de Atletismo. Se você estiver submerso (seja por ter falhado no teste de Atletismo, seja por ter mergulhado de propósito), deve prender a respiração. Você pode prender a respiração por um número de rodadas igual ao seu Vigor. Após isso, deve fazer um teste de Fortitude por rodada (DT 5 + 5 por teste anterior). Se falhar, se afoga (é reduzido a 0 pontos de vida) e fica morrendo (veja o Capítulo 4). Você sofre penalidade de carga em testes de natação.',
      },
      {
        nome: 'Saltar',
        treino: '',
        dt: 'Variável',
        texto:
          'Você pode pular sobre buracos ou obstáculos ou alcançar algo elevado. Para um salto longo, a DT é 5 por quadrado de 1,5m (DT 10 para 3m, 15 para 4,5m, 20 para 6m e assim por diante). Para um salto em altura, a DT é 15 por quadrado de 1,5m (30 para 3m). Você deve ter pelo menos 6m para correr e pegar impulso (sem esse espaço, a DT aumenta em +5). Saltar é parte de seu movimento e não exige uma ação.',
      },
    ],
  },

  atualidades: {
    livro: 'Livro Base',
    resumo:
      'Você é um conhecedor de assuntos gerais, como política, esporte e entretenimento, e pode responder dúvidas relativas a esses assuntos.',
    texto:
      'Você é um conhecedor de assuntos gerais, como política, esporte e entretenimento, e pode responder dúvidas relativas a esses assuntos. A DT é 15 para informações comuns, como o nome do autor de um livro, 20 para informações específicas, como a história do fundador de uma empresa, e 25 para informações quase desconhecidas, como uma lenda urbana já esquecida.',
    usos: [],
  },

  ciencias: {
    livro: 'Livro Base',
    resumo:
      'Você estudou diversos campos científicos, como matemática, física, química e biologia, e pode responder dúvidas relativas a esses assuntos.',
    texto:
      'Você estudou diversos campos científicos, como matemática, física, química e biologia, e pode responder dúvidas relativas a esses assuntos. Questões simples, como a composição química de uma substância conhecida, não exigem teste. Questões complexas, como detalhes sobre o funcionamento de um procedimento científico específico, exigem um teste contra DT 20. Por fim, questões envolvendo campos experimentais, como avaliar a capacidade de proteção de uma liga metálica recém-criada, exigem um teste contra DT 30.',
    usos: [],
    box: {
      titulo: 'Interpretando a Perícia Ciências',
      texto:
        'Personagens treinados em Ciências conhecem diversas áreas acadêmicas. Entretanto, você pode escolher ser especializado em um campo específico. Isso não fará diferença mecânica na sua ficha, mas pode ajudá-lo a interpretar o personagem de forma mais única. Por exemplo, se você é um matemático, pode analisar uma cena do crime através de padrões estatísticos ou de repetições de números. Use sua especialização científica para criar um agente único!',
    },
  },

  crime: {
    livro: 'Livro Base',
    resumo: 'Você sabe exercer atividades ilícitas.',
    texto:
      'Você sabe exercer atividades ilícitas.\n\n' +
      'Arrombar. Você abre uma fechadura trancada. A DT é 20 para fechaduras comuns (porta de um apartamento), 25 para fechaduras reforçadas (porta de uma loja) e 30 para fechaduras avançadas (cofre de um banco). Este uso gasta uma ação completa.\n\n' +
      'Furto (DT 20). Você pega um objeto de outra pessoa (ou planta um objeto nas posses dela). Gaste uma ação padrão e faça um teste de Crime. Se passar, você pega (ou coloca) o que queria. A vítima tem direito a um teste de Percepção (DT igual ao resultado de seu teste de Crime). Se passar, ela percebe sua tentativa, tenha você conseguido ou não.\n\n' +
      'Ocultar. Você esconde um objeto em você mesmo. Gaste uma ação padrão e faça um teste de Crime oposto pelo teste de Percepção de qualquer um que possa vê-lo. Se uma pessoa revistar você, recebe +10 no teste de Percepção.\n\n' +
      'Sabotar (Veterano). Você desabilita um dispositivo. Uma ação simples, como desativar um alarme, tem DT 20. Uma ação complexa, como sabotar uma pistola para que exploda quando disparada, tem DT 30. Se você falhar por 5 ou mais, algo sai errado (o alarme dispara, você acha que a arma está sabotada, mas na verdade ainda funciona…). Este uso gasta 1d4+1 ações completas. Você pode sofrer uma penalidade de –O em seu teste para fazê-lo como uma ação completa.\n\n' +
      'Os usos arrombar e sabotar exigem um kit. Sem ele, você sofre –5 no teste.',
    usos: [
      {
        nome: 'Arrombar',
        treino: '',
        dt: 'Variável',
        texto:
          'Você abre uma fechadura trancada. A DT é 20 para fechaduras comuns (porta de um apartamento), 25 para fechaduras reforçadas (porta de uma loja) e 30 para fechaduras avançadas (cofre de um banco). Este uso gasta uma ação completa.',
      },
      {
        nome: 'Furto',
        treino: '',
        dt: '20',
        texto:
          'Você pega um objeto de outra pessoa (ou planta um objeto nas posses dela). Gaste uma ação padrão e faça um teste de Crime. Se passar, você pega (ou coloca) o que queria. A vítima tem direito a um teste de Percepção (DT igual ao resultado de seu teste de Crime). Se passar, ela percebe sua tentativa, tenha você conseguido ou não.',
      },
      {
        nome: 'Ocultar',
        treino: '',
        dt: 'Oposto',
        texto:
          'Você esconde um objeto em você mesmo. Gaste uma ação padrão e faça um teste de Crime oposto pelo teste de Percepção de qualquer um que possa vê-lo. Se uma pessoa revistar você, recebe +10 no teste de Percepção.',
      },
      {
        nome: 'Sabotar',
        treino: 'Veterano',
        dt: 'Variável',
        texto:
          'Você desabilita um dispositivo. Uma ação simples, como desativar um alarme, tem DT 20. Uma ação complexa, como sabotar uma pistola para que exploda quando disparada, tem DT 30. Se você falhar por 5 ou mais, algo sai errado (o alarme dispara, você acha que a arma está sabotada, mas na verdade ainda funciona…). Este uso gasta 1d4+1 ações completas. Você pode sofrer uma penalidade de –O em seu teste para fazê-lo como uma ação completa.',
      },
    ],
  },

  diplomacia: {
    livro: 'Livro Base',
    resumo: 'Você convence pessoas com lábia e argumentação.',
    texto:
      'Você convence pessoas com lábia e argumentação.\n\n' +
      'Acalmar (treinado, DT 20). Você estabiliza um personagem adjacente que esteja enlouquecendo, fazendo com que ele fique com Sanidade 1. A DT aumenta em +5 para cada vez que ele tiver sido acalmado na cena. Este uso gasta uma ação padrão.\n\n' +
      'Mudar Atitude. Você muda a categoria de atitude de um NPC em relação a você ou a outra pessoa (veja a página ao lado para a explicação das categorias de atitude). Faça um teste de Diplomacia oposto pelo teste de Vontade do alvo. Se você passar, muda a atitude dele em uma categoria para cima ou para baixo, à sua escolha. Se passar por 10 ou mais, muda a atitude em até duas categorias. Se falhar por 5 ou mais, a atitude do alvo muda uma categoria na direção oposta. Este uso gasta um minuto. Você pode sofrer –OO no teste para fazê-lo como uma ação completa (para evitar uma briga, por exemplo). Você só pode mudar a atitude de uma mesma pessoa uma vez por dia.\n\n' +
      'Persuasão (DT 20). Você convence uma pessoa a fazer alguma coisa, como responder a uma pergunta ou prestar um favor. Se essa coisa for custosa (como emprestar um carro) você sofre –5 em seu teste. Se for perigosa (como cometer um crime) você sofre –10 ou falha automaticamente. De acordo com o mestre, seu teste pode ser oposto ao teste de Vontade da pessoa. Este uso gasta um minuto ou mais, de acordo com o mestre.',
    usos: [
      {
        nome: 'Acalmar',
        treino: 'Treinado',
        dt: '20',
        texto:
          'Você estabiliza um personagem adjacente que esteja enlouquecendo, fazendo com que ele fique com Sanidade 1. A DT aumenta em +5 para cada vez que ele tiver sido acalmado na cena. Este uso gasta uma ação padrão.',
      },
      {
        nome: 'Mudar Atitude',
        treino: '',
        dt: 'Oposto',
        texto:
          'Você muda a categoria de atitude de um NPC em relação a você ou a outra pessoa (veja a página ao lado para a explicação das categorias de atitude). Faça um teste de Diplomacia oposto pelo teste de Vontade do alvo. Se você passar, muda a atitude dele em uma categoria para cima ou para baixo, à sua escolha. Se passar por 10 ou mais, muda a atitude em até duas categorias. Se falhar por 5 ou mais, a atitude do alvo muda uma categoria na direção oposta. Este uso gasta um minuto. Você pode sofrer –OO no teste para fazê-lo como uma ação completa (para evitar uma briga, por exemplo). Você só pode mudar a atitude de uma mesma pessoa uma vez por dia.',
      },
      {
        nome: 'Persuasão',
        treino: '',
        dt: '20',
        texto:
          'Você convence uma pessoa a fazer alguma coisa, como responder a uma pergunta ou prestar um favor. Se essa coisa for custosa (como emprestar um carro) você sofre –5 em seu teste. Se for perigosa (como cometer um crime) você sofre –10 ou falha automaticamente. De acordo com o mestre, seu teste pode ser oposto ao teste de Vontade da pessoa. Este uso gasta um minuto ou mais, de acordo com o mestre.',
      },
    ],
    box: {
      titulo: 'Categorias de Atitude',
      texto:
        'Todo NPC possui uma categoria de atitude em relação a cada personagem. Por padrão, a categoria inicial é “indiferente”, mas o mestre possa estipular outra se quiser. As categorias são descritas a seguir.\n\n' +
        'Prestativo. Adora o personagem. Você recebe +5 em testes de persuasão contra pessoas prestativas.\n\n' +
        'Amistoso. Gosta do personagem. Pode ajudá-lo e fazer pequenos favores, mas dificilmente se arriscará por ele.\n\n' +
        'Indiferente. Não gosta nem desgosta do personagem. Vai tratá-lo como socialmente esperado.\n\n' +
        'Inamistoso. Não vai com a cara do personagem. Você sofre –5 em testes de persuasão contra pessoas inamistosas.\n\n' +
        'Hostil. Odeia o personagem e vai tentar prejudicá-lo — pode falar mal dele, roubar suas coisas ou mesmo atacá-lo! Você falha automaticamente em testes de persuasão contra pessoas hostis.',
    },
  },

  enganacao: {
    livro: 'Livro Base',
    resumo: 'Você manipula pessoas com blefes e trapaças.',
    texto:
      'Você manipula pessoas com blefes e trapaças.\n\n' +
      'Disfarce (Treinado). Você muda sua aparência ou a de outra pessoa. Faça um teste de Enganação oposto pelo teste de Percepção de quem prestar atenção no disfarçado. Se você passar, a pessoa acredita no disfarce; caso contrário, percebe que há algo errado. Se o disfarce é de uma pessoa específica, aqueles que conhecem essa pessoa recebem +10 no teste de Percepção. Um disfarce exige pelo menos dez minutos e um kit. Sem ele, você sofre –5 no teste.\n\n' +
      'Falsificação (Veterano). Você falsifica um documento. Faça um teste de Enganação oposto pelo teste de Percepção de quem examinar o documento. Se você passar, a pessoa acredita que ele é válido; caso contrário, percebe que é falso. Se o documento é muito complexo, ou inclui uma assinatura ou carimbo específico, você sofre –OO no teste.\n\n' +
      'Fintar (Treinado). Você pode gastar uma ação padrão e fazer um teste de Enganação oposto a um teste de Reflexos de um ser em alcance curto. Se você passar, ele fica desprevenido contra seu próximo ataque, se realizado até o fim de seu próximo turno.\n\n' +
      'Insinuação (DT 20). Você fala algo para alguém sem que outras pessoas entendam do que você está falando. Se você passar, o receptor entende sua mensagem. Se falhar por 5 ou mais, entende algo diferente do que você queria. Outras pessoas podem fazer um teste de Intuição oposto ao seu teste de Enganação. Se passarem, entendem o que você está dizendo.\n\n' +
      'Intriga (DT 20). Você espalha uma fofoca. Por exemplo, pode dizer que o dono do bar está aguando a cerveja para enfurecer o povo contra ele. Intrigas muito improváveis (convencer o povo que o delegado é um ET que está abduzindo as pessoas) têm DT 30. Este uso exige pelo menos um dia, mas pode levar mais tempo, de acordo com o mestre. Uma pessoa pode investigar a fonte da fofoca e chegar até você. Isso exige um teste de Investigação por parte dela, com DT igual ao resultado do seu teste para a intriga.\n\n' +
      'Mentir. Você faz uma pessoa acreditar em algo que não é verdade. Seu teste é oposto pelo teste de Intuição da vítima. Mentiras muito implausíveis impõem uma penalidade de –OO em seu teste (“Por que estou com o crachá do chefe de segurança? Ora, porque ele deixou cair e estou indo devolver!”).',
    usos: [
      {
        nome: 'Disfarce',
        treino: 'Treinado',
        dt: 'Oposto',
        texto:
          'Você muda sua aparência ou a de outra pessoa. Faça um teste de Enganação oposto pelo teste de Percepção de quem prestar atenção no disfarçado. Se você passar, a pessoa acredita no disfarce; caso contrário, percebe que há algo errado. Se o disfarce é de uma pessoa específica, aqueles que conhecem essa pessoa recebem +10 no teste de Percepção. Um disfarce exige pelo menos dez minutos e um kit. Sem ele, você sofre –5 no teste.',
      },
      {
        nome: 'Falsificação',
        treino: 'Veterano',
        dt: 'Oposto',
        texto:
          'Você falsifica um documento. Faça um teste de Enganação oposto pelo teste de Percepção de quem examinar o documento. Se você passar, a pessoa acredita que ele é válido; caso contrário, percebe que é falso. Se o documento é muito complexo, ou inclui uma assinatura ou carimbo específico, você sofre –OO no teste.',
      },
      {
        nome: 'Fintar',
        treino: 'Treinado',
        dt: 'Oposto',
        texto:
          'Você pode gastar uma ação padrão e fazer um teste de Enganação oposto a um teste de Reflexos de um ser em alcance curto. Se você passar, ele fica desprevenido contra seu próximo ataque, se realizado até o fim de seu próximo turno.',
      },
      {
        nome: 'Insinuação',
        treino: '',
        dt: '20',
        texto:
          'Você fala algo para alguém sem que outras pessoas entendam do que você está falando. Se você passar, o receptor entende sua mensagem. Se falhar por 5 ou mais, entende algo diferente do que você queria. Outras pessoas podem fazer um teste de Intuição oposto ao seu teste de Enganação. Se passarem, entendem o que você está dizendo.',
      },
      {
        nome: 'Intriga',
        treino: '',
        dt: '20',
        texto:
          'Você espalha uma fofoca. Por exemplo, pode dizer que o dono do bar está aguando a cerveja para enfurecer o povo contra ele. Intrigas muito improváveis (convencer o povo que o delegado é um ET que está abduzindo as pessoas) têm DT 30. Este uso exige pelo menos um dia, mas pode levar mais tempo, de acordo com o mestre. Uma pessoa pode investigar a fonte da fofoca e chegar até você. Isso exige um teste de Investigação por parte dela, com DT igual ao resultado do seu teste para a intriga.',
      },
      {
        nome: 'Mentir',
        treino: '',
        dt: 'Oposto',
        texto:
          'Você faz uma pessoa acreditar em algo que não é verdade. Seu teste é oposto pelo teste de Intuição da vítima. Mentiras muito implausíveis impõem uma penalidade de –OO em seu teste (“Por que estou com o crachá do chefe de segurança? Ora, porque ele deixou cair e estou indo devolver!”).',
      },
    ],
  },

  fortitude: {
    livro: 'Livro Base',
    resumo:
      'Você usa esta perícia para testes de resistência contra efeitos que exigem vitalidade, como doenças e venenos.',
    texto:
      'Você usa esta perícia para testes de resistência contra efeitos que exigem vitalidade, como doenças e venenos. A DT é determina pelo efeito. Você também usa Fortitude para manter seu fôlego quando está correndo ou sem respirar. A DT é 5 +5 por teste anterior (veja a perícia Atletismo para mais detalhes).',
    usos: [],
  },

  furtividade: {
    livro: 'Livro Base',
    resumo: 'Você sabe ser discreto e sorrateiro.',
    texto:
      'Você sabe ser discreto e sorrateiro.\n\n' +
      'Esconder-se. Faça um teste de Furtividade oposto pelos testes de Percepção de qualquer um que possa notá-lo. Todos que falharem não conseguem percebê-lo (você tem camuflagem total contra eles). Esconder-se é uma ação livre que você só pode fazer no final do seu turno e apenas se terminar seu turno em um lugar onde seja possível se esconder (atrás de uma porta, num quarto escuro, numa mata densa, no meio de uma multidão…). Se tiver se movido durante o turno, você sofre –O no teste (você pode se mover à metade do deslocamento normal para não sofrer essa penalidade). Se tiver atacado ou feito outra ação muito chamativa, sofre –OOO.\n\n' +
      'Seguir. Faça um teste de Furtividade oposto ao teste de Percepção da pessoa sendo seguida. Você sofre –5 se estiver em um lugar sem esconderijos ou sem movimento, como um descampado ou rua deserta. A vítima recebe +5 em seu teste de Percepção se estiver tomando precauções para não ser seguida (como olhar para trás de vez em quando). Se você passar, segue a pessoa até ela chegar ao seu destino. Se falhar, a pessoa o percebe na metade do caminho.',
    usos: [
      {
        nome: 'Esconder-se',
        treino: '',
        dt: 'Oposto',
        texto:
          'Faça um teste de Furtividade oposto pelos testes de Percepção de qualquer um que possa notá-lo. Todos que falharem não conseguem percebê-lo (você tem camuflagem total contra eles). Esconder-se é uma ação livre que você só pode fazer no final do seu turno e apenas se terminar seu turno em um lugar onde seja possível se esconder (atrás de uma porta, num quarto escuro, numa mata densa, no meio de uma multidão…). Se tiver se movido durante o turno, você sofre –O no teste (você pode se mover à metade do deslocamento normal para não sofrer essa penalidade). Se tiver atacado ou feito outra ação muito chamativa, sofre –OOO.',
      },
      {
        nome: 'Seguir',
        treino: '',
        dt: 'Oposto',
        texto:
          'Faça um teste de Furtividade oposto ao teste de Percepção da pessoa sendo seguida. Você sofre –5 se estiver em um lugar sem esconderijos ou sem movimento, como um descampado ou rua deserta. A vítima recebe +5 em seu teste de Percepção se estiver tomando precauções para não ser seguida (como olhar para trás de vez em quando). Se você passar, segue a pessoa até ela chegar ao seu destino. Se falhar, a pessoa o percebe na metade do caminho.',
      },
    ],
  },

  iniciativa: {
    livro: 'Livro Base',
    resumo: 'Esta perícia determina sua velocidade de reação.',
    texto:
      'Esta perícia determina sua velocidade de reação. Quando uma cena de ação começa, cada personagem envolvido faz um teste de Iniciativa. Eles então agem em ordem decrescente dos resultados.',
    usos: [],
  },

  intimidacao: {
    livro: 'Livro Base',
    resumo: 'Você pode assustar ou coagir outras pessoas. Todos os usos de Intimidação são efeitos de medo.',
    texto:
      'Você pode assustar ou coagir outras pessoas. Todos os usos de Intimidação são efeitos de medo.\n\n' +
      'Assustar (treinado). Gaste uma ação padrão e faça um teste de Intimidação oposto pelo teste de Vontade de uma pessoa em alcance curto. Se você passar, ela fica abalada pelo resto da cena (não cumulativo). Se você passar por 10 ou mais, ela fica apavorado por uma rodada e então abalada pelo resto da cena.\n\n' +
      'Coagir. Faça um teste de Intimidação oposto pelo teste de Vontade de uma pessoa adjacente. Se você passar, ela obedece uma ordem sua (como fazer uma pequena tarefa, deixar que você passe por um lugar que ele estava protegendo etc.). Se você mandar a pessoa fazer algo perigoso ou que vá contra a natureza dela, ela recebe +5 no teste ou passa automaticamente. Este uso gasta um minuto ou mais, de acordo com o mestre, e deixa a pessoa hostil contra você.',
    usos: [
      {
        nome: 'Assustar',
        treino: 'Treinado',
        dt: 'Oposto',
        texto:
          'Gaste uma ação padrão e faça um teste de Intimidação oposto pelo teste de Vontade de uma pessoa em alcance curto. Se você passar, ela fica abalada pelo resto da cena (não cumulativo). Se você passar por 10 ou mais, ela fica apavorado por uma rodada e então abalada pelo resto da cena.',
      },
      {
        nome: 'Coagir',
        treino: '',
        dt: 'Oposto',
        texto:
          'Faça um teste de Intimidação oposto pelo teste de Vontade de uma pessoa adjacente. Se você passar, ela obedece uma ordem sua (como fazer uma pequena tarefa, deixar que você passe por um lugar que ele estava protegendo etc.). Se você mandar a pessoa fazer algo perigoso ou que vá contra a natureza dela, ela recebe +5 no teste ou passa automaticamente. Este uso gasta um minuto ou mais, de acordo com o mestre, e deixa a pessoa hostil contra você.',
      },
    ],
  },

  intuicao: {
    livro: 'Livro Base',
    resumo: 'Esta perícia mede sua empatia e “sexto sentido”.',
    texto:
      'Esta perícia mede sua empatia e “sexto sentido”.\n\n' +
      'Perceber Mentira. Você descobre se alguém está mentindo (veja a perícia Enganação).\n\n' +
      'Pressentimento (treinado, DT 20). Você analisa uma pessoa, para ter uma ideia de sua índole ou caráter, ou uma situação, para perceber qualquer fato estranho (por exemplo, se os habitantes de uma cidadezinha estão agindo de forma esquisita). Este uso apenas indica se há algo anormal; para descobrir a causa, veja a perícia Investigação.',
    usos: [
      {
        nome: 'Perceber Mentira',
        treino: '',
        dt: 'Oposto',
        texto: 'Você descobre se alguém está mentindo (veja a perícia Enganação).',
      },
      {
        nome: 'Pressentimento',
        treino: 'Treinado',
        dt: '20',
        texto:
          'Você analisa uma pessoa, para ter uma ideia de sua índole ou caráter, ou uma situação, para perceber qualquer fato estranho (por exemplo, se os habitantes de uma cidadezinha estão agindo de forma esquisita). Este uso apenas indica se há algo anormal; para descobrir a causa, veja a perícia Investigação.',
      },
    ],
  },

  investigacao: {
    livro: 'Livro Base',
    resumo: 'Você sabe como descobrir pistas e informações.',
    texto:
      'Você sabe como descobrir pistas e informações.\n\n' +
      'Interrogar. Você descobre informações perguntando ou indo para um lugar movimentado e mantendo os ouvidos atentos. Informações gerais (“Quem é o dono desse bar?”) não exigem teste. Informações restritas, que poucas pessoas conhecem (“Quem é o delegado encarregado desse caso?”), têm DT 20. Informações confidenciais, ou que podem colocar em risco quem falar sobre elas, têm DT 30. Este uso gasta desde uma hora até um dia, a critério do mestre.\n\n' +
      'Procurar. Você examina um local. A DT varia: 15 para um item discreto ou no meio de uma bagunça, mas não necessariamente escondido; 20 para um item escondido (cofre atrás de um quadro, documento no fundo falso de uma gaveta); 30 para um item muito bem escondido (passagem secreta ativada por um botão, documento escrito com tinta invisível). Este uso gasta desde uma ação completa (examinar uma escrivaninha) até um dia (pesquisar uma biblioteca).',
    usos: [
      {
        nome: 'Interrogar',
        treino: '',
        dt: 'Variável',
        texto:
          'Você descobre informações perguntando ou indo para um lugar movimentado e mantendo os ouvidos atentos. Informações gerais (“Quem é o dono desse bar?”) não exigem teste. Informações restritas, que poucas pessoas conhecem (“Quem é o delegado encarregado desse caso?”), têm DT 20. Informações confidenciais, ou que podem colocar em risco quem falar sobre elas, têm DT 30. Este uso gasta desde uma hora até um dia, a critério do mestre.',
      },
      {
        nome: 'Procurar',
        treino: '',
        dt: 'Variável',
        texto:
          'Você examina um local. A DT varia: 15 para um item discreto ou no meio de uma bagunça, mas não necessariamente escondido; 20 para um item escondido (cofre atrás de um quadro, documento no fundo falso de uma gaveta); 30 para um item muito bem escondido (passagem secreta ativada por um botão, documento escrito com tinta invisível). Este uso gasta desde uma ação completa (examinar uma escrivaninha) até um dia (pesquisar uma biblioteca).',
      },
    ],
  },

  luta: {
    livro: 'Livro Base',
    resumo: 'Você usa Luta para fazer ataques corpo a corpo.',
    texto:
      'Você usa Luta para fazer ataques corpo a corpo. A DT é a Defesa do alvo. Se você acertar, causa dano de acordo com a arma utilizada. Veja o Capítulo 4 para as regras completas de ataque.',
    usos: [],
  },

  medicina: {
    livro: 'Livro Base',
    resumo: 'Você sabe tratar ferimentos, doenças e venenos.',
    texto:
      'Você sabe tratar ferimentos, doenças e venenos.\n\n' +
      'Primeiros Socorros (DT 20). Um personagem adjacente que esteja morrendo e inconsciente perde essas condições e fica com 1 PV. A DT aumenta em +5 para cada vez que ele tiver sido estabilizado na cena. Este uso gasta uma ação padrão.\n\n' +
      'Cuidados Prolongados (Veterano, DT 20). Durante uma cena de interlúdio, você pode gastar uma de suas ações para tratar até uma pessoa por ponto de Intelecto. Se passar, elas recuperam o dobro dos PV pela ação dormir neste interlúdio.\n\n' +
      'Necropsia (Treinado, DT 20). Você examina um cadáver para determinar a causa e o momento aproximado da morte. Causas raras ou extraordinárias, como um veneno exótico ou uma maldição, possuem DT +10. Este uso leva dez minutos.\n\n' +
      'Tratamento (Treinado). Você ajuda a vítima de uma doença ou veneno com efeito contínuo. Gaste uma ação completa e faça um teste contra a DT da doença ou veneno. Se você passar, o paciente recebe +5 em seu próximo teste de Fortitude contra esse efeito.\n\n' +
      'Esta perícia exige um kit. Sem ele, você sofre –5 no teste. Você pode usar a perícia Medicina em si mesmo, mas sofre –O no teste.',
    usos: [
      {
        nome: 'Primeiros Socorros',
        treino: '',
        dt: '20',
        texto:
          'Um personagem adjacente que esteja morrendo e inconsciente perde essas condições e fica com 1 PV. A DT aumenta em +5 para cada vez que ele tiver sido estabilizado na cena. Este uso gasta uma ação padrão.',
      },
      {
        nome: 'Cuidados Prolongados',
        treino: 'Veterano',
        dt: '20',
        texto:
          'Durante uma cena de interlúdio, você pode gastar uma de suas ações para tratar até uma pessoa por ponto de Intelecto. Se passar, elas recuperam o dobro dos PV pela ação dormir neste interlúdio.',
      },
      {
        nome: 'Necropsia',
        treino: 'Treinado',
        dt: '20',
        texto:
          'Você examina um cadáver para determinar a causa e o momento aproximado da morte. Causas raras ou extraordinárias, como um veneno exótico ou uma maldição, possuem DT +10. Este uso leva dez minutos.',
      },
      {
        nome: 'Tratamento',
        treino: 'Treinado',
        dt: 'Variável',
        texto:
          'Você ajuda a vítima de uma doença ou veneno com efeito contínuo. Gaste uma ação completa e faça um teste contra a DT da doença ou veneno. Se você passar, o paciente recebe +5 em seu próximo teste de Fortitude contra esse efeito.',
      },
    ],
  },

  ocultismo: {
    livro: 'Livro Base',
    resumo: 'Você estudou o paranormal.',
    texto:
      'Você estudou o paranormal.\n\n' +
      'Identificar Criatura. Você analisa uma criatura paranormal que possa ver. A DT do teste é igual à DT para resistir à Presença Perturbadora da criatura. Se você passar, descobre uma característica da criatura, como um poder ou vulnerabilidade. Para cada 5 pontos pelos quais o resultado do teste superar a DT, você descobre outra característica. Se falhar por 5 ou mais, tira uma conclusão errada (por exemplo, acredita que uma criatura tem vulnerabilidade a Morte, quando na verdade tem vulnerabilidade a Energia). Este uso gasta uma ação completa.\n\n' +
      'Identificar Item Amaldiçoado (DT 20). Você pode gastar uma ação de interlúdio para estudar um item amaldiçoado e identificar seus poderes ou qual ritual o objeto contém. Você pode sofrer –OO no teste para fazê-lo como uma ação completa.\n\n' +
      'Identificar Ritual (DT 10 +5 por círculo do ritual). Quando alguém lança um ritual, você pode descobrir qual é observando seus gestos, palavras e componentes. Este uso é uma reação.\n\n' +
      'Informação. Você responde dúvidas relativas ao Outro Lado, objetos amaldiçoados, fenômenos paranormais, runas, profecias etc. Questões simples não exigem teste. Questões complexas exigem um teste contra DT 20. Por fim, mistérios e enigmas exigem um teste contra DT 30.',
    usos: [
      {
        nome: 'Identificar Criatura',
        treino: '',
        dt: 'Variável',
        texto:
          'Você analisa uma criatura paranormal que possa ver. A DT do teste é igual à DT para resistir à Presença Perturbadora da criatura. Se você passar, descobre uma característica da criatura, como um poder ou vulnerabilidade. Para cada 5 pontos pelos quais o resultado do teste superar a DT, você descobre outra característica. Se falhar por 5 ou mais, tira uma conclusão errada (por exemplo, acredita que uma criatura tem vulnerabilidade a Morte, quando na verdade tem vulnerabilidade a Energia). Este uso gasta uma ação completa.',
      },
      {
        nome: 'Identificar Item Amaldiçoado',
        treino: '',
        dt: '20',
        texto:
          'Você pode gastar uma ação de interlúdio para estudar um item amaldiçoado e identificar seus poderes ou qual ritual o objeto contém. Você pode sofrer –OO no teste para fazê-lo como uma ação completa.',
      },
      {
        nome: 'Identificar Ritual',
        treino: '',
        dt: '10 +5 por círculo do ritual',
        texto:
          'Quando alguém lança um ritual, você pode descobrir qual é observando seus gestos, palavras e componentes. Este uso é uma reação.',
      },
      {
        nome: 'Informação',
        treino: '',
        dt: 'Variável',
        texto:
          'Você responde dúvidas relativas ao Outro Lado, objetos amaldiçoados, fenômenos paranormais, runas, profecias etc. Questões simples não exigem teste. Questões complexas exigem um teste contra DT 20. Por fim, mistérios e enigmas exigem um teste contra DT 30.',
      },
    ],
    box: {
      titulo: 'Interpretando a Perícia Ocultismo',
      texto:
        'Personagens treinados em Ocultismo não necessariamente são ocultistas ou conseguem conjurar rituais. Eles podem ser apenas estudiosos do assunto, com conhecimento de manifestações paranormais registradas dentro da Realidade no passado, e a capacidade de comparar o que estudaram com manifestações encontradas.',
    },
  },

  percepcao: {
    livro: 'Livro Base',
    resumo: 'Você nota coisas usando os sentidos.',
    texto:
      'Você nota coisas usando os sentidos.\n\n' +
      'Observar. Você vê coisas discretas ou escondidas. A DT varia de 15, para coisas difíceis de serem vistas (um livro específico em uma estante) a 30, para coisas quase invisíveis (uma gota de sangue em uma folha no meio de uma floresta à noite). Para pessoas ou coisas escondidas, a DT é o resultado do teste de Furtividade ou Crime feito para esconder a pessoa ou ocultar o item. Você também pode ler lábios (DT 20).\n\n' +
      'Ouvir. Você escuta barulhos sutis. Uma conversa casual próxima tem DT 0 — ou seja, a menos que exista alguma penalidade, você passa automaticamente. Ouvir pessoas sussurrando tem DT 15. Ouvir do outro lado de uma porta aumenta a DT em +5. Você pode fazer testes de Percepção para ouvir mesmo que esteja dormindo, mas sofre –OO no teste; um sucesso faz você acordar. Perceber seres que não possam ser vistos tem DT 20, ou +10 no teste de Furtividade do ser, o que for maior. Mesmo que você passe no teste, ainda sofre penalidades normais por lutar sem ver o inimigo.',
    usos: [
      {
        nome: 'Observar',
        treino: '',
        dt: 'Variável',
        texto:
          'Você vê coisas discretas ou escondidas. A DT varia de 15, para coisas difíceis de serem vistas (um livro específico em uma estante) a 30, para coisas quase invisíveis (uma gota de sangue em uma folha no meio de uma floresta à noite). Para pessoas ou coisas escondidas, a DT é o resultado do teste de Furtividade ou Crime feito para esconder a pessoa ou ocultar o item. Você também pode ler lábios (DT 20).',
      },
      {
        nome: 'Ouvir',
        treino: '',
        dt: 'Variável',
        texto:
          'Você escuta barulhos sutis. Uma conversa casual próxima tem DT 0 — ou seja, a menos que exista alguma penalidade, você passa automaticamente. Ouvir pessoas sussurrando tem DT 15. Ouvir do outro lado de uma porta aumenta a DT em +5. Você pode fazer testes de Percepção para ouvir mesmo que esteja dormindo, mas sofre –OO no teste; um sucesso faz você acordar. Perceber seres que não possam ser vistos tem DT 20, ou +10 no teste de Furtividade do ser, o que for maior. Mesmo que você passe no teste, ainda sofre penalidades normais por lutar sem ver o inimigo.',
      },
    ],
  },

  pilotagem: {
    livro: 'Livro Base',
    resumo: 'Você sabe operar veículos terrestres e aquáticos, como motos, carros e lanchas.',
    texto:
      'Você sabe operar veículos terrestres e aquáticos, como motos, carros e lanchas. Pilotar um veículo gasta uma ação de movimento por turno. Situações comuns (dirigir em uma estrada, velejar em clima tranquilo) não exigem teste. Situações ruins (dirigir em uma estrada de chão e sem iluminação, velejar em chuva ou ventania) exigem um teste por turno contra DT 15. Situações terríveis (dirigir em terreno acidentado, velejar durante uma tempestade) exigem um teste por turno contra DT 25. Se você possuir grau de treinamento veterano nesta perícia, pode pilotar veículos aéreos, como aviões e helicópteros.',
    usos: [],
  },

  pontaria: {
    livro: 'Livro Base',
    resumo: 'Você usa Pontaria para fazer ataques à distância.',
    texto:
      'Você usa Pontaria para fazer ataques à distância. A DT é a Defesa do alvo. Se você acertar, causa dano de acordo com a arma utilizada. Veja o Capítulo 4 para as regras completas de ataque.',
    usos: [],
  },

  profissao: {
    livro: 'Livro Base',
    resumo:
      'Você sabe exercer uma profissão específica, como advogado, engenheiro, jornalista ou publicitário.',
    texto:
      'Você sabe exercer uma profissão específica, como advogado, engenheiro, jornalista ou publicitário. Converse com o mestre para definir os detalhes de sua profissão e que tipos de testes você pode fazer com ela. Por exemplo, um advogado pode fazer um teste de Profissão para argumentar com a polícia, enquanto um administrador pode usar esta perícia para investigar os documentos de uma corporação.\n\n' +
      'Um personagem treinado nesta perícia possui seus próprios rendimentos ou, caso não trabalhe mais, uma reserva de capital. Isso permite que você comece cada missão com um item adicional, além daqueles fornecidos pela Ordem. O item é de categoria I se você for treinado, de categoria II se você for veterano e de categoria III se você for expert.',
    usos: [],
  },

  reflexos: {
    livro: 'Livro Base',
    resumo:
      'Você usa esta perícia para testes de resistência contra efeitos que exigem reação rápida, como armadilhas e explosões.',
    texto:
      'Você usa esta perícia para testes de resistência contra efeitos que exigem reação rápida, como armadilhas e explosões. A DT é determina pelo efeito. Você também usa Reflexos para evitar fintas (veja Enganação).',
    usos: [],
  },

  religiao: {
    livro: 'Livro Base',
    resumo: 'Você possui conhecimento sobre teologia e as diversas religiões do mundo.',
    texto:
      'Você possui conhecimento sobre teologia e as diversas religiões do mundo.\n\n' +
      'Acalmar (DT 20). Você pode usar Religião como Diplomacia para acalmar um personagem que esteja enlouquecendo.\n\n' +
      'Informação. Você pode responder dúvidas relativas a mitos, profecias, relíquias sagradas etc. A DT é 10 para questões simples, 20 para questões complexas e 30 para mistérios e enigmas.\n\n' +
      'Rito (Veterano, DT 20). Você realiza uma cerimônia religiosa (batizado, casamento, funeral…).',
    usos: [
      {
        nome: 'Acalmar',
        treino: '',
        dt: '20',
        texto:
          'Você pode usar Religião como Diplomacia para acalmar um personagem que esteja enlouquecendo.',
      },
      {
        nome: 'Informação',
        treino: '',
        dt: 'Variável',
        texto:
          'Você pode responder dúvidas relativas a mitos, profecias, relíquias sagradas etc. A DT é 10 para questões simples, 20 para questões complexas e 30 para mistérios e enigmas.',
      },
      {
        nome: 'Rito',
        treino: 'Veterano',
        dt: '20',
        texto: 'Você realiza uma cerimônia religiosa (batizado, casamento, funeral…).',
      },
    ],
  },

  sobrevivencia: {
    livro: 'Livro Base',
    resumo: 'Você pode se guiar em regiões selvagens e evitar perigos da natureza.',
    texto:
      'Você pode se guiar em regiões selvagens e evitar perigos da natureza.\n\n' +
      'Acampamento (Treinado). Você pode conseguir abrigo e alimento nos ermos, caçando, pescando, colhendo frutos etc. A DT depende do tipo de terreno: 15 para campo aberto, 20 para mata fechada e 25 para regiões extremas, como desertos, pântanos ou montanhas. Regiões especialmente áridas ou estéreis e clima ruim (neve, tempestade etc.) impõem uma penalidade de –5 (cumulativa). Se passar, você e seu grupo podem usar as ações de interlúdio alimentar-se e dormir mesmo estando ao relento.\n\n' +
      'Identificar Animal (Treinado, DT 20). Com uma ação completa, você pode identificar um animal exótico. Veja a perícia Ocultismo.\n\n' +
      'Orientar-se. Um personagem viajando em regiões selvagens precisa fazer um teste de Sobrevivência por dia para avançar. A DT depende do tipo de terreno (veja acima). Se passar, você avança seu deslocamento normal. Se falhar, avança metade. Se falhar por 5 ou mais, se perde e não avança pelo dia inteiro.\n\n' +
      'Num grupo, um personagem deve ser escolhido como guia. Personagens treinados em Sobrevivência podem fazer testes para ajudá-lo. Entretanto, se mais de um personagem quiser fazer o teste por si só, todos deverão rolar os dados em segredo. Os jogadores devem decidir qual guia seguir antes de verem o resultado!\n\n' +
      'Rastrear (Treinado). Você pode identificar e seguir rastros. A DT varia: 15 para rastrear um grupo grande, ou um único ser em solo macio, como lama ou neve; 20 para um ser em solo comum (grama, terra); 25 para um ser em solo duro (estrada, piso de interiores). Visibilidade precária ou clima ruim (noite, chuva, neblina) impõem –O no teste. Você precisa fazer um teste por dia de perseguição. Enquanto rastreia, seu deslocamento é reduzido à metade. Se falhar, pode tentar novamente gastando mais um dia. Porém, a cada dia desde a criação dos rastros, a DT aumenta em +1.',
    usos: [
      {
        nome: 'Acampamento',
        treino: 'Treinado',
        dt: 'Variável',
        texto:
          'Você pode conseguir abrigo e alimento nos ermos, caçando, pescando, colhendo frutos etc. A DT depende do tipo de terreno: 15 para campo aberto, 20 para mata fechada e 25 para regiões extremas, como desertos, pântanos ou montanhas. Regiões especialmente áridas ou estéreis e clima ruim (neve, tempestade etc.) impõem uma penalidade de –5 (cumulativa). Se passar, você e seu grupo podem usar as ações de interlúdio alimentar-se e dormir mesmo estando ao relento.',
      },
      {
        nome: 'Identificar Animal',
        treino: 'Treinado',
        dt: '20',
        texto:
          'Com uma ação completa, você pode identificar um animal exótico. Veja a perícia Ocultismo.',
      },
      {
        nome: 'Orientar-se',
        treino: '',
        dt: 'Variável',
        texto:
          'Um personagem viajando em regiões selvagens precisa fazer um teste de Sobrevivência por dia para avançar. A DT depende do tipo de terreno (veja acima). Se passar, você avança seu deslocamento normal. Se falhar, avança metade. Se falhar por 5 ou mais, se perde e não avança pelo dia inteiro.\n\nNum grupo, um personagem deve ser escolhido como guia. Personagens treinados em Sobrevivência podem fazer testes para ajudá-lo. Entretanto, se mais de um personagem quiser fazer o teste por si só, todos deverão rolar os dados em segredo. Os jogadores devem decidir qual guia seguir antes de verem o resultado!',
      },
      {
        nome: 'Rastrear',
        treino: 'Treinado',
        dt: 'Variável',
        texto:
          'Você pode identificar e seguir rastros. A DT varia: 15 para rastrear um grupo grande, ou um único ser em solo macio, como lama ou neve; 20 para um ser em solo comum (grama, terra); 25 para um ser em solo duro (estrada, piso de interiores). Visibilidade precária ou clima ruim (noite, chuva, neblina) impõem –O no teste. Você precisa fazer um teste por dia de perseguição. Enquanto rastreia, seu deslocamento é reduzido à metade. Se falhar, pode tentar novamente gastando mais um dia. Porém, a cada dia desde a criação dos rastros, a DT aumenta em +1.',
      },
    ],
  },

  tatica: {
    livro: 'Livro Base',
    resumo: 'Você recebeu educação militar.',
    texto:
      'Você recebeu educação militar.\n\n' +
      'Analisar Terreno (DT 20). Com uma ação de movimento, você pode observar o campo de batalha. Se passar, descobre uma vantagem, como cobertura, camuflagem ou terreno elevado, se houver.\n\n' +
      'Plano de Ação (Veterano, DT 20). Com uma ação padrão, você orienta um aliado em alcance médio. Se passar, fornece +5 na Iniciativa dele. Se isso fizer com que um aliado que ainda não tenha agido nesta rodada fique com uma Iniciativa maior do que a sua, ele age imediatamente após seu turno. Nas próximas rodadas, ele age de acordo com a nova ordem.',
    usos: [
      {
        nome: 'Analisar Terreno',
        treino: '',
        dt: '20',
        texto:
          'Com uma ação de movimento, você pode observar o campo de batalha. Se passar, descobre uma vantagem, como cobertura, camuflagem ou terreno elevado, se houver.',
      },
      {
        nome: 'Plano de Ação',
        treino: 'Veterano',
        dt: '20',
        texto:
          'Com uma ação padrão, você orienta um aliado em alcance médio. Se passar, fornece +5 na Iniciativa dele. Se isso fizer com que um aliado que ainda não tenha agido nesta rodada fique com uma Iniciativa maior do que a sua, ele age imediatamente após seu turno. Nas próximas rodadas, ele age de acordo com a nova ordem.',
      },
    ],
  },

  tecnologia: {
    livro: 'Livro Base',
    resumo: 'Você possui conhecimentos avançados de eletrônica e informática.',
    texto:
      'Você possui conhecimentos avançados de eletrônica e informática. Usos cotidianos, como mexer em um computador ou celular, não exigem treinamento nesta perícia ou testes. Esta perícia serve para usos avançados, como reprogramar um sistema de vigilância ou invadir um servidor seguro.\n\n' +
      'Falsificação (Veterano). Como o uso de Enganação, mas apenas para documentos eletrônicos.\n\n' +
      'Hackear. Você invade um computador protegido. A DT é 15 para computadores pessoais, 20 para redes profissionais e 25 para grandes servidores corporativos, governamentais ou militares. Este uso gasta 1d4+1 ações completas. Você pode sofrer uma penalidade de –O em seu teste para fazê-lo como uma ação completa. Se você falhar no teste, não pode tentar novamente até ter alguma informação nova que o ajude na invasão, como um nome de usuário ou senha. Se falhar por 5 ou mais, pode ser rastreado pelos administradores do sistema que tentou invadir.\n\n' +
      'Uma vez que invada o sistema, você pode fazer o que veio fazer. Para procurar uma informação específica, veja o uso localizar arquivo, abaixo. Outras ações, como alterar ou deletar arquivos, corromper ou desativar aplicativos ou bloquear o acesso de outros usuários, podem exigir novos testes de Tecnologia, a critério do mestre.\n\n' +
      'Localizar Arquivo. Você procura um arquivo específico em um computador ou rede que possa acessar (se você não tiver acesso ao sistema, precisará primeiro invadi-lo; veja o uso hackear, acima). O tempo exigido e a DT do teste variam de acordo com o tamanho do sistema no qual você está pesquisando: uma ação completa e DT 15 para um computador pessoal, 1d4+1 ações completas e DT 20 para uma rede pequena e 1d6+2 ações completas e DT 25 para uma rede corporativa ou governamental. Este uso se refere apenas a localizar arquivos em sistemas privados que você não conhece. Para procurar informações públicas, na internet, use a perícia Investigação.\n\n' +
      'Operar Dispositivo. Você opera um dispositivo eletrônico complexo. Isso permite que você acesse câmeras remotamente, destrave fechaduras eletrônicas, ative ou desative alarmes etc. A DT é 15 para aparelhos comuns, 20 para equipamento profissional e 25 para sistemas protegidos. Este uso gasta 1d4+1 ações completas e exige um kit. Você pode sofrer uma penalidade de –O em seu teste para fazê-lo como uma ação completa. Sem o kit, você sofre –5 nos testes de operar dispositivo.',
    usos: [
      {
        nome: 'Falsificação',
        treino: 'Veterano',
        dt: 'Oposto',
        texto: 'Como o uso de Enganação, mas apenas para documentos eletrônicos.',
      },
      {
        nome: 'Hackear',
        treino: '',
        dt: 'Variável',
        texto:
          'Você invade um computador protegido. A DT é 15 para computadores pessoais, 20 para redes profissionais e 25 para grandes servidores corporativos, governamentais ou militares. Este uso gasta 1d4+1 ações completas. Você pode sofrer uma penalidade de –O em seu teste para fazê-lo como uma ação completa. Se você falhar no teste, não pode tentar novamente até ter alguma informação nova que o ajude na invasão, como um nome de usuário ou senha. Se falhar por 5 ou mais, pode ser rastreado pelos administradores do sistema que tentou invadir.\n\nUma vez que invada o sistema, você pode fazer o que veio fazer. Para procurar uma informação específica, veja o uso localizar arquivo, abaixo. Outras ações, como alterar ou deletar arquivos, corromper ou desativar aplicativos ou bloquear o acesso de outros usuários, podem exigir novos testes de Tecnologia, a critério do mestre.',
      },
      {
        nome: 'Localizar Arquivo',
        treino: '',
        dt: 'Variável',
        texto:
          'Você procura um arquivo específico em um computador ou rede que possa acessar (se você não tiver acesso ao sistema, precisará primeiro invadi-lo; veja o uso hackear, acima). O tempo exigido e a DT do teste variam de acordo com o tamanho do sistema no qual você está pesquisando: uma ação completa e DT 15 para um computador pessoal, 1d4+1 ações completas e DT 20 para uma rede pequena e 1d6+2 ações completas e DT 25 para uma rede corporativa ou governamental. Este uso se refere apenas a localizar arquivos em sistemas privados que você não conhece. Para procurar informações públicas, na internet, use a perícia Investigação.',
      },
      {
        nome: 'Operar Dispositivo',
        treino: '',
        dt: 'Variável',
        texto:
          'Você opera um dispositivo eletrônico complexo. Isso permite que você acesse câmeras remotamente, destrave fechaduras eletrônicas, ative ou desative alarmes etc. A DT é 15 para aparelhos comuns, 20 para equipamento profissional e 25 para sistemas protegidos. Este uso gasta 1d4+1 ações completas e exige um kit. Você pode sofrer uma penalidade de –O em seu teste para fazê-lo como uma ação completa. Sem o kit, você sofre –5 nos testes de operar dispositivo.',
      },
    ],
  },

  vontade: {
    livro: 'Livro Base',
    resumo:
      'Você usa esta perícia para testes de resistência contra efeitos que exigem determinação, como intimidação e rituais que afetam a mente.',
    texto:
      'Você usa esta perícia para testes de resistência contra efeitos que exigem determinação, como intimidação e rituais que afetam a mente. A DT é determinada pelo efeito. Você também usa Vontade para conjurar rituais em condições adversas (veja o Capítulo 5).',
    usos: [],
  },
};

// Índice por id (mesma estrutura; mantido para simetria com os outros ficheiros de dados).
export const PERICIAS_TEXTO_POR_ID = PERICIAS_TEXTO;

export default PERICIAS_TEXTO;
