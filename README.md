# Criador de Fichas — Ordem Paranormal RPG

Aplicação web para criar e gerir agentes de Ordem Paranormal RPG: wizard de criação em
4 passos (Atributos → Origem → Classe → Toques Finais), ficha completa com cálculos
automáticos e exportação para o PDF da Ficha Automática oficial (v2.3.3).

## Correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produção -> dist/
npm test         # testes dos cálculos
```

## Conteúdo carregado dos livros

| Conteúdo | Quantidade |
|---|---|
| Origens | **53** (26 Livro Base · 20 Sobrevivendo ao Horror · 3 AS6 · 2 AS4 · 2 AS5) |
| Classes | **4** — Combatente, Especialista, Ocultista, Sobrevivente |
| Trilhas | **27**, com todos os poderes por NEX |
| Poderes de classe | **81** |
| Poderes paranormais e gerais | **92** |
| Rituais | **97** (1º ao 4º círculo, com Discente e Verdadeiro) |
| Armas | **60** |
| Proteções | **3** |
| Equipamento geral | **87** |
| Itens amaldiçoados/paranormais | **92** |
| Perícias | **28**, com descrição completa e usos |

Fontes: Livro de Regras (v1.2), Sobrevivendo ao Horror e Arquivos Secretos 1 a 7.
Cada entrada tem o campo `livro` com a proveniência.

## Estrutura

```
src/
  data/            conteúdo do jogo
    atributos.js     regra de distribuição de pontos
    pericias.js      as 28 perícias (+ periciasTexto.js com a descrição completa)
    origens.js       53 origens
    classes.js       agregador -> classes/{combatente,especialista,ocultista,sobrevivente}.js
    poderes.js       poderes paranormais e gerais
    rituais.js       agregador -> rituais/{parte1,parte2}.js
    itens.js         agregador -> itens/{armas,geral,amaldicoados}.js
    pdfCodigos.js    listas oficiais do PDF (origens, trilhas) para a exportação
  engine/          cálculos puros, sem UI (testáveis com `npm test`)
  components/      wizard/ e ficha/
  export/pdf.js    preenchimento do PDF oficial
public/
  ficha-template.pdf   modelo oficial usado na exportação
```

## Aparência

Tema preto e sangue, com as fontes reais dos livros em `public/fontes/`:

- **Westsac** — a marca "Ordem Paranormal" (não tem acentos, por isso só aqui).
- **Special Elite** — títulos, abas e nomes, ar de dossiê datilografado.
- **Blur Light** — texto corrido e rótulos.
- **Minion Pro** — os números (PV, Defesa, totais das rolagens).
- **Sigilos do Outro Lado** — enfeites.

**Atenção:** Optima e CF Crack and Bold não têm os acentos mapeados corretamente
(`Ç` sai como `3`, `Í` como `H`), por isso não são usadas em texto.

A roda de atributos é a arte da ficha oficial, extraída do PDF e convertida para
branco sobre transparente (`public/img/roda-atributos.png`).

## Regras implementadas

- Atributos começam a 1, 4 pontos para distribuir, baixar a 0 devolve 1 ponto, máximo inicial 3.
- PV / SAN / PE por classe e NEX (5% → 99%, 20 patamares). Subir de NEX acompanha os valores atuais.
- Perícias treinadas concedidas automaticamente pela origem e pela classe, incluindo as
  escolhas (ex.: Luta **ou** Pontaria) e as livres (ex.: 1 + Intelecto).
- Proficiências preenchidas pela classe.
- Trilha disponível a partir de NEX 10%; habilidades de classe e de trilha aparecem
  automaticamente conforme o NEX.
- Defesa = 10 + AGI + equipamento + outros.
- Perícias: dados = valor do atributo; treino 0/5/10/15 limitado pelo NEX; penalidade de carga
  só nas perícias marcadas com `+`; perícias `*` bloqueadas sem treino.
- PE por turno = NEX ÷ 5. Círculo máximo de ritual por NEX (1º/2º/3º/4º).
- Rolagem de perícia: N d20 e fica o melhor (0 no atributo → 2 d20 e fica o pior).
- Limite de carga = 5 + FOR × 2.
- **Bloqueio** — só com treino em Fortitude; RD igual ao bónus de Fortitude.
- **Esquiva** — só com treino em Reflexos; Defesa + bónus de Reflexos.
  Ambos têm um campo de extra manual.
- Rolagens: clicar no d20 de uma perícia, no número de um atributo (teste puro),
  num ataque ou no dano. O resultado aparece no canto inferior direito com a conta;
  **crítico (20 no dado escolhido) fica a verde**.

## Agentes guardados

Os agentes ficam guardados no browser (localStorage) e aparecem no ecrã inicial.
Dá para criar, abrir, duplicar, apagar, importar/exportar `.json` e pôr uma foto
no agente. Não há servidor: os dados vivem na máquina onde a app corre.

## Por confirmar

- Limite de carga e regras de patente/crédito ainda não foram cruzados com o capítulo de
  Equipamento — o valor usado está em `engine/calc.js:calcCargaMaxima`.
- Os Arquivos Secretos 2, 3 e 7 foram lidos apenas nas secções de itens/poderes; se tiverem
  mais conteúdo de criação, falta importar.
