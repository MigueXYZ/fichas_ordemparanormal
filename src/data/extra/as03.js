// Arquivos Secretos 3 (Pacote #3 — Psikolera, Couraças, Pássaros, Mais Hexatombe)
// Texto verbatim do PDF "Arquivos-Secretos-3-v-1-0.pdf" (p. 119).
// Nada foi resumido, traduzido ou inventado.

export const TRILHAS_AS03 = [
  {
    // O livro apresenta esta trilha como "NOVA TRILHA: COMBATENTE PERFORMÁTICO",
    // mas o boxe "REGRA OPCIONAL: TRILHA GERAL" (mesma página) declara que ela
    // pertence às três classes e pode ser escolhida por qualquer uma delas.
    classe: 'geral',
    id: 'combatente-performatico',
    nome: 'Combatente Performático',
    descricao: `Você gosta de glamour, ritmo e trabalhar em sinergia com a sua trupe durante conflitos. Uma luta é uma performance violentamente cativante e colaborativa, digna de ser observada por uma plateia.

REGRA OPCIONAL: TRILHA GERAL. Fazendo uma experiência ousada, combatente performático é a primeira trilha pensada como trilha geral. Ou seja, ela foi feita visualizando combatentes, especialistas e ocultistas (mais especificamente os ocultistas que gostam de ir pro combate em curto alcance). Em termos de regras, ela pertence às três classes e pode ser escolhida por qualquer uma delas (o nome muda para especialista performático ou ocultista performático). Ficamos no aguardo de feedbacks sobre o experimento.`,
    livro: 'Arquivos Secretos 3',
    poderes: [
      {
        nex: 10,
        nome: 'Ensaio',
        descricao: `Você sabe que a prática leva à perfeição em qualquer contexto. Você recebe uma nova opção de ação de interlúdio: ensaiar combate. Quando fizer ela, você recebe +1 na margem de ameaça de seus ataques até o início da próxima cena de interlúdio. Esse bônus aumenta para +2 em NEX 40%, para +3 em NEX 65% e +4 em NEX 99%. Você só pode ensaiar uma vez por cena. Outros personagens podem gastar uma ação de interlúdio para ensaiar com você, recebendo o mesmo bônus pela mesma duração.`,
      },
      {
        nex: 40,
        nome: 'Frase de Efeito',
        descricao: `Você tem uma frase de efeito que ilustra perfeitamente os momentos de maior performance. Quando você ou um aliado em alcance curto obter um acerto crítico, você pode gastar 2 PE para exclamar sua grande frase e mudar o multiplicador de crítico do ataque para um valor igual a sua Presença. Se a sua Presença for igual ou menor do que o multiplicador do ataque, em vez disso o multiplicador aumenta em +1.`,
      },
      {
        nex: 65,
        nome: 'Mosh Pit',
        descricao: `Conforme a música fica mais pesada, o clima fica cada vez mais violento. Quando está flanqueando um alvo, você e todos os seus aliados flanqueando ou adjacentes ao mesmo alvo recebem +1d6 nas rolagens de dano contra ele para cada aliado cercando-o (até o limite de +5d6). Por exemplo, se você está flanqueando o inimigo com um aliado e há mais dois aliados adjacentes ao inimigo, todos vocês recebem +4d6 nas rolagens de dano contra este inimigo.`,
      },
      {
        nex: 99,
        nome: 'Rítmo Contagiante',
        descricao: `Você e todos os membros da sua equipe já sabem de cor as suas coreografias icônicas, seu ritmo se torna contagiante e inevitável. No início de uma cena de combate, você e todos os aliados em alcance médio recebem +5 na Defesa até o fim do combate. Sempre que você obter um acerto crítico, esse bônus aumenta em +1.`,
      },
    ],
  },
];

// Arquivos Secretos 3 não traz nenhuma origem nova.
// O apêndice "O Mais Hexatombe" (pp. 105-134) contém apenas poderes, itens,
// aliados, a trilha acima e regras opcionais.
export const ORIGENS_AS03 = [];
