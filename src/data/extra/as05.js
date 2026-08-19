// Arquivos Secretos 5 (Pacote #5 — Transcrição, Origem da Comunicação,
// Alheios Ameaçadores, Regras Alheias) — trilhas e origens
// Texto verbatim do PDF "Arquivos-Secretos-05-v1.1.pdf" (pp. 54 e 58),
// já com o "Registro de Atualizações" da v1.1 (p. 71) aplicado.
// Nada foi resumido, traduzido ou inventado.

export const TRILHAS_AS05 = [
  {
    classe: 'ocultista',
    id: 'criptologista-do-oculto',
    nome: 'Criptologista do Oculto',
    descricao: `Você estuda tentando compreender as linguagens utilizadas para se comunicar com o Outro Lado. Mesmo desconfiando que não haja uma solução concreta, você analisa os padrões, desenvolve técnicas e ensina aos seus aliados maneiras de aprimorar suas súplicas ao paranormal.`,
    livro: 'Arquivos Secretos 5',
    poderes: [
      {
        nex: 10,
        nome: 'Método Intuitivo',
        descricao: `Você recebe o poder Criar Selo (OPRPG, p. 33). Se recebê-lo novamente, dobra a quantidade máxima de selos criados ao mesmo tempo. Você pode criar 2 selos com uma ação de interlúdio, em vez de apenas 1. O número de selos que você pode criar em uma ação de interlúdio aumenta em +1 para cada outra habilidade desta trilha que adquirir.`,
      },
      {
        nex: 40,
        nome: 'Caligrafia Eficiente',
        descricao: `Selos feitos por você são mais fáceis de usar. O teste para usar o Selo de um ritual que o usuário não conhece muda para Ocultismo (DT 10 + custo em PE do ritual). Além disso, você recebe +5 em testes para identificar rituais.`,
      },
      {
        nex: 65,
        nome: 'Decifrar à Distância',
        descricao: `Quando usa um Selo Paranormal, você não precisa estar empunhando-o nem precisa lê-lo em voz alta. Basta poder lê-lo, mesmo que apenas mentalmente, mas o Selo precisa estar, no máximo, em alcance curto de você. Além disso, você recebe +5 em testes para extrair alguma informação das “linguagens” do Outro Lado como Sigilos ou Sinais.`,
      },
      {
        nex: 99,
        nome: 'Selo Supremo',
        descricao: `Selos feitos por você dispensam testes de Ocultismo para serem usados. Além disso, os rituais dos seus Selos sofrem as seguintes alterações:
• Se o ritual pede testes de resistência, a DT aumenta em +5;
• Se o ritual causa dano, a rolagem de dano aumenta em +3 dados extras do mesmo tipo;
• Se o ritual for usado em forma avançada (discente ou verdadeira), o usuário do Selo não precisa pagar o custo adicional em pontos de esforço da forma avançada.`,
      },
    ],
  },
];

// Arquivos Secretos 5 traz apenas duas origens (p. 54): Ufólogo e Funcionário de
// Beira de Estrada. Ambas já constam na app (ids `ufologo` e
// `funcionario-de-beira-de-estrada`), por isso não são repetidas aqui.
// O resto da secção "Regras Alheias" (pp. 52-63) são poderes de classe/gerais,
// um novo uso da perícia Tecnologia (Rastrear Trilha Digital), regalias para
// veículos, itens e poderes de Transmissão — nada disso são trilhas ou origens.
export const ORIGENS_AS05 = [];
