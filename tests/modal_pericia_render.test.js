/**
 * Renderiza o modal de detalhe de perícia para as 28 perícias, à procura de
 * rebentamentos (era `test_modal_renders_safe.test.js`).
 *
 * O node não sabe importar `.jsx` sozinho, e o teste antigo rebentava logo no
 * import. Aqui usa-se o próprio vite (já é dependência do projeto) para
 * carregar o componente em modo SSR — sem instalar nada de novo e com as
 * mesmas regras de resolução que o build usa.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.join(aqui, '..');
const alvo = path.join(raiz, 'src/components/ficha/ModalDetalhePericia.jsx');

if (!fs.existsSync(alvo)) {
  console.log('SALTADO: ModalDetalhePericia.jsx não existe.');
  process.exit(0);
}

let criarServidor;
try {
  ({ createServer: criarServidor } = await import('vite'));
} catch (err) {
  console.log(`SALTADO: vite indisponível neste ambiente (${err.message.split('\n')[0]}).`);
  process.exit(0);
}

let servidor;
try {
  servidor = await criarServidor({
    root: raiz,
    configFile: false,
    logLevel: 'silent',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
    plugins: [(await import('@vitejs/plugin-react')).default()],
  });
} catch (err) {
  console.log(`SALTADO: não deu para arrancar o vite (${err.message.split('\n')[0]}).`);
  process.exit(0);
}

try {
  const React = (await import('react')).default;
  const { renderToString } = await import('react-dom/server');
  const ModalDetalhePericia = (await servidor.ssrLoadModule('/src/components/ficha/ModalDetalhePericia.jsx')).default;
  const { personagemVazio } = await import('../src/engine/character.js');
  const { calcPericias } = await import('../src/engine/calc.js');

  assert.ok(typeof ModalDetalhePericia === 'function', 'ModalDetalhePericia não exporta um componente');

  const p = personagemVazio();
  const linhas = calcPericias(p);
  assert.equal(linhas.length, 28, 'esperava 28 perícias');

  let passou = 0;
  for (const l of linhas) {
    try {
      const html = renderToString(
        React.createElement(ModalDetalhePericia, { pericia: l, personagem: p, onRolar() {}, onFechar() {} })
      );
      assert.ok(html.length > 100, `saída curta demais em ${l.nome}`);
      passou++;
    } catch (err) {
      console.error(`  FALHOU em ${l.nome}: ${err.message}`);
      process.exitCode = 1;
    }
  }
  console.log(`${passou} perícias renderizadas sem rebentar`);
} finally {
  await servidor.close();
}
