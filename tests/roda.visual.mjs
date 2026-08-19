/**
 * Verificação da roda de atributos.
 *
 * Mede, no browser, a caixa de cada número e o centro do respetivo círculo na
 * arte (convertendo as coordenadas do viewBox para o ecrã) e confirma que o
 * número cabe dentro do círculo — em vários tamanhos de janela e zoom.
 *
 * Correr com o `npm run preview` ligado noutro terminal:
 *     npm run verificar-roda
 */
import { chromium } from 'playwright';

const CENTROS = { agi: [501, 199], for: [193, 457], int: [807, 457], pre: [298, 807], vig: [704, 807] };
const R = 88;

const b = await chromium.launch({ ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}) });
let mau = 0;

for (const [w, h, zoom, tag] of [
  [1460, 1020, 1, 'grande'],
  [1280, 800, 1, 'medio'],
  [1024, 720, 1, 'pequeno'],
  [1460, 1020, 1.5, 'zoom150'],
  [1920, 1080, 0.8, 'zoom80'],
]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: zoom });
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  await p.click('.agente-cartao.novo');
  await p.waitForTimeout(400);

  const r = await p.evaluate(({ CENTROS, R }) => {
    const svg = document.querySelector('.roda');
    const ctm = svg.getScreenCTM();
    const paraEcra = (x, y) => {
      const pt = svg.createSVGPoint(); pt.x = x; pt.y = y;
      const s = pt.matrixTransform(ctm);
      return { x: s.x, y: s.y };
    };
    const escala = Math.hypot(ctm.a, ctm.b);
    const saida = [];
    Object.entries(CENTROS).forEach(([id, [cx, cy]]) => {
      const centro = paraEcra(cx, cy);
      const alvo = svg.querySelector(`text.atr-valor[data-attr="${id}"]`);
      const caixa = alvo.getBoundingClientRect();
      const meio = { x: caixa.left + caixa.width / 2, y: caixa.top + caixa.height / 2 };
      const dist = Math.hypot(meio.x - centro.x, meio.y - centro.y);
      const raio = R * escala;
      // o número deve caber dentro do círculo, com folga para a etiqueta em baixo
      saida.push({
        id,
        distanciaAoCentro: Math.round(dist),
        raio: Math.round(raio),
        dentro: dist + caixa.height / 2 < raio,
        alturaTexto: Math.round(caixa.height),
      });
    });
    return saida;
  }, { CENTROS, R });

  const falhas = r.filter((x) => !x.dentro);
  mau += falhas.length;
  console.log(`${tag.padEnd(9)} ${falhas.length ? 'FALHA ' + JSON.stringify(falhas) : 'ok — todos os números dentro dos círculos'}`);
  if (tag === 'grande') await p.screenshot({ path: '/tmp/z_roda.png' });
  await p.close();
}

await b.close();
console.log(mau ? `\n${mau} números fora do sítio` : '\nTudo dentro dos círculos em todas as medidas testadas');
