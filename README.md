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

## Overlay para OBS & Transmissão para o Mestre

A aplicação suporta transmissão em tempo real das barras de vida, sanidade, esforço, avatar e rolagens de dados:

### Modo P2P (Recomendado / Vercel):
1. Na app: botão **Overlay** → modo **P2P / Vercel** → clica em **Ligar**.
2. Clica em **Copiar Link** (ou gera um código novo).
3. Entrega o link ao Mestre ou adiciona no OBS (**+ → Browser**, cola o link, 1920×1080).
*Não precisa de nenhum servidor ativo — funciona 100% no browser e na Vercel via WebRTC.*

### Modo Servidor Node (Opcional):
1. `npm run overlay` (corre em http://localhost:7777)
2. Na app: botão **Overlay** → modo **Servidor Node** → liga → copia o link.
3. No OBS: **+ → Browser**, cola o link, 1920×1080.

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
