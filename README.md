# Claudio

Ferramenta de fichas para **Ordem Paranormal RPG**.

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
branco sobre transparente. **A arte e os números vivem dentro do mesmo SVG**
(`RodaAtributos.jsx`), em coordenadas do viewBox da imagem — assim não há
percentagens de CSS que possam desalinhar seja em que ecrã for.

A criatura na margem esquerda é o **Enraizado** (Livro Base, cap. 7), recortado do PDF com o
canal alfa do próprio ficheiro. É limitado pela altura da janela (`height: min(78vh, 640px)`,
largura automática) para nunca aparecer cortado.

Os símbolos no ecrã inicial são os **símbolos dos elementos** enviados pelo Rodrigo, usados
como máscara CSS e pintados com a cor de cada elemento. Os ficheiros estão em `public/img/`:

| Ficheiro | Elemento | Forma |
|---|---|---|
| `sigilo-sangue.png` | Sangue | gancho com dois pontos |
| `sigilo-morte.png` | Morte | cruz de campa |
| `sigilo-energia.png` | Energia | seta em V com voltas |
| `sigilo-conhecimento.png` | Conhecimento | espiral dentro de um círculo |
| `sigilo-medo.png` | Medo | *ainda o sigilo tirado do livro* — falta o oficial |

Se algum estiver trocado, basta trocar os nomes dos ficheiros: o código vai buscar
`sigilo-<elemento>.png` e não sabe nada sobre as formas.

Por trás da marca roda a **roda de sigilos** (`roda-sigilos.png`), a 7% de opacidade.

### Verificar a roda de atributos

`npm run verificar-roda` (com o `npm run preview` a correr) mede no browser a posição de
cada número e o centro do círculo correspondente na arte, e confirma que estão alinhados
em 5 combinações de tamanho de janela e zoom.

## Regras implementadas

- Atributos começam a 1, 4 pontos para distribuir, baixar a 0 devolve 1 ponto, máximo inicial 3.
- PV / SAN / PE por classe e NEX (5% → 99%, 20 patamares). Subir de NEX acompanha os valores atuais.
- Perícias treinadas concedidas automaticamente pela origem e pela classe, incluindo as
  escolhas (ex.: Luta **ou** Pontaria) e as livres (ex.: 1 + Intelecto).
- Proficiências preenchidas pela classe.
- Trilha disponível a partir de NEX 10%; habilidades de classe e de trilha aparecem
  automaticamente conforme o NEX.
- Defesa = 10 + AGI + equipamento + outros.
- Perícias: dados = valor do atributo (rolas N d20 e fica o maior); treino 0/5/10/15; penalidade de carga
  só nas perícias marcadas com `+`; perícias `*` bloqueadas sem treino.
- PE por turno = NEX ÷ 5. Círculo máximo de ritual por NEX (1º/2º/3º/4º).
- Rolagem de perícia: N d20 e fica o melhor (0 no atributo → 2 d20 e fica o pior).
- **Carga** = 5 espaços por ponto de Força (Força 0 → 2). Passar do limite deixa
  sobrecarregado: −5 na Defesa e nas perícias com penalidade de carga (aplicado
  automaticamente), −3m de deslocamento; o máximo absoluto é o dobro.
- **Patente** (Tabela 3.1): define o limite de crédito e quantos itens de cada
  categoria a Ordem libera por missão. A app mostra os slots I–IV usados/disponíveis.
- **Ataque**: o botão *Atacar* faz o teste de acerto e, logo a seguir, rola o dano
  da arma já com as modificações e o crítico aplicados. *Só dano* volta a rolar
  apenas o dano. O crítico usa a margem
  de ameaça da arma (`19/x2` = crítico com 19 ou 20, dados de dano ×2). Num crítico
  só os dados da arma são multiplicados — bónus e dados extra não.
- **Editor de armas** com as modificações do livro (Certeira, Cruel, Perigosa,
  Calibre Grosso, Mira Laser…), que alteram sozinhas ataque, dano, margem e espaços.
- **Bloqueio** — só com treino em Fortitude; RD igual ao bónus de Fortitude.
- **Esquiva** — só com treino em Reflexos; Defesa + bónus de Reflexos.
  Ambos têm um campo de extra manual.
- Rolagens: clicar no d20 de uma perícia, no número de um atributo (teste puro),
  num ataque ou no dano. O resultado aparece no canto inferior direito com a conta;
  **crítico (20 no dado escolhido) fica a verde**.

## Perícias

A coluna **Dados** de cada perícia é um seletor de atributo. Há poderes que trocam
o atributo-base (usar Intelecto em vez de Presença, por exemplo) — escolhe ali e a
app passa a rolar os dados desse atributo. Quando está trocado fica a âmbar com um
asterisco; voltar ao atributo do livro limpa a marca.

## Ambiente

- O fundo pulsa como um batimento cardíaco (~52 bpm, dois pulsos e pausa) e tem
  brasas a subir. Ambos respeitam `prefers-reduced-motion`.
- Som gerado na hora com a Web Audio API (`engine/som.js`), sem ficheiros de áudio:
  - **dados** — uma série de estalidos secos com ressonância curta (plástico em
    madeira), a acelerar e depois a abrandar até assentar; mais dados, mais
    estalidos. Sino no crítico, baque grave na falha crítica.
  - **coração** — "lub-dub" grave em ciclo de 4,6 s. É o mesmo relógio que dispara
    o pulsar do fundo, por isso o som e a imagem batem ao mesmo tempo.
  - Botões **♪ dados** e **♥** na barra de topo; as escolhas ficam guardadas.
  - O browser só deixa tocar som depois do primeiro clique na página — é por isso
    que o coração começa a ouvir-se logo a seguir à primeira interação.

## Geradores

No ecrã inicial, o botão **Geradores** abre três:

- **Ficha aleatória** — escolhes NEX, conceito (combate, investigação, ritual, social ou
  surpreende-me) e, se quiseres, forçar a classe e a origem. Sai uma ficha jogável
  completa: atributos distribuídos com jeito, origem, classe, trilha, perícias, arma
  e equipamento.
- **NPC agente** — a mesma coisa, marcada como NPC e com uma ocupação anterior.
- **Ameaça** — ficha no formato do capítulo 7. Os números (Defesa, PV, bónus de teste,
  dano, DT) saem de um modelo ajustado às **41 fichas de ameaça do Livro Base**, por VD.
  Confere: VD 200 gera Defesa 36 / 445 PV / 4O+25 / 4d10+20, e o Carniçal Preto do
  livro (VD 200) tem Defesa 38 / 400 PV / 4O+25 / 4d10+20. O painel mostra também o VD
  fácil/equilibrado/difícil para o NEX somado do grupo, como manda a regra.

Todos os nomes são portugueses de Portugal (`data/nomesPt.js`).

## Histórico de rolagens

Cada agente guarda as últimas 300 rolagens. O botão **Histórico** na barra de topo abre
a lista com hora, contas e total, filtros (testes, ataques, dano, críticos) e um resumo
com a média dos testes e a contagem de críticos e falhas críticas.

## Agentes guardados

Os agentes ficam guardados no browser (localStorage) e aparecem no ecrã inicial.
Dá para criar, abrir, duplicar, apagar, importar/exportar `.json` e pôr uma foto
no agente. Não há servidor: os dados vivem na máquina onde a app corre.

## Por confirmar

- Limite de carga e regras de patente/crédito ainda não foram cruzados com o capítulo de
  Equipamento — o valor usado está em `engine/calc.js:calcCargaMaxima`.
- Os Arquivos Secretos 2, 3 e 7 foram lidos apenas nas secções de itens/poderes; se tiverem
  mais conteúdo de criação, falta importar.
