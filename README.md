# Claudio — fichas de Ordem Paranormal RPG

App web para criar e gerir agentes de Ordem Paranormal RPG, com o conteúdo dos livros
oficiais (Livro de Regras, Sobrevivendo ao Horror e Arquivos Secretos 1–7).

## Correr

```bash
npm install
npm run dev        # http://localhost:5173
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build para `dist/` (duas páginas: a app e o overlay) |
| `npm run preview` | serve o `dist/` |
| `npm test` | testes das regras (`tests/calc.test.js`) |
| `npm run verificar-roda` | confirma, num browser, que os números dos atributos ficam dentro dos círculos (precisa do `preview` a correr) |
| `npm run overlay` | servidor do overlay para OBS, em http://localhost:7777 |

## Overlay para OBS

1. `npm run overlay`
2. Na app: botão **Overlay** → modo **Servidor** → liga → copia o link
3. No OBS: **+ → Browser**, cola o link, 1920×1080

O servidor (`servidor/overlay.mjs`) não tem dependências e corre em qualquer sítio com
Node — no teu PC ou alojado, se o mestre estiver noutro sítio.

## Organização

```
src/
  data/        conteúdo dos livros (origens, classes, trilhas, perícias, itens, rituais)
    extra/     o que vem dos Arquivos Secretos, um ficheiro por pacote
  engine/      regras e cálculos (calc, armas, dados, geradores, som, armazenamento)
  components/  interface (wizard, ficha, geradores, overlay)
  export/      exportação para o PDF oficial da Ficha Automática
servidor/      servidor do overlay
tests/         testes
```

As fichas ficam no browser (localStorage). Há importar/exportar JSON para as levar
para outro computador.
