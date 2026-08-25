/**
 * Verificação da roda de atributos.
 *
 * O problema real nunca foi "o número está longe do centro" — era o número
 * subir acima do círculo ou cair por cima do rótulo ("FORÇA / FOR") que já vem
 * desenhado na arte. Por isso este teste mede a caixa de TINTA do algarismo
 * (com as métricas reais da fonte) e confirma que ela fica dentro da faixa
 * livre: entre o topo do círculo e o topo do rótulo.
 *
 * Os números abaixo foram medidos pixel a pixel sobre roda-atributos-v2.png.
 *
 * Correr com o `npm run preview` ligado noutro terminal:
 *     npm run verificar-roda
 */
import { chromium } from 'playwright';

// cx, cy, r = interior do círculo · topoRotulo = onde começa o texto desenhado
const CIRCULOS = {
  agi: { cx: 480.0, cy: 190.0, r: 135, topoRotulo: 224 },
  for: { cx: 175.0, cy: 418.0, r: 135, topoRotulo: 435 },
  int: { cx: 785.0, cy: 418.0, r: 135, topoRotulo: 435 },
  pre: { cx: 270.0, cy: 778.0, r: 135, topoRotulo: 795 },
  vig: { cx: 690.0, cy: 778.0, r: 135, topoRotulo: 795 },
};
const FOLGA = 6;   // margem mínima, em unidades do viewBox

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
  await p.waitForTimeout(500);

  const r = await p.evaluate(({ CIRCULOS, FOLGA }) => {
    const svg = document.querySelector('.roda');
    const ctm = svg.getScreenCTM();
    const escala = Math.hypot(ctm.a, ctm.b);       // px de ecrã por unidade do viewBox
    const paraEcra = (x, y) => {
      const pt = svg.createSVGPoint(); pt.x = x; pt.y = y;
      return pt.matrixTransform(ctm);
    };
    const ctx = document.createElement('canvas').getContext('2d');
    const saida = [];

    for (const [id, c] of Object.entries(CIRCULOS)) {
      const alvo = svg.querySelector(`text.atr-valor[data-attr="${id}"]`);
      const est = getComputedStyle(alvo);
      ctx.font = `${est.fontWeight} ${est.fontSize} ${est.fontFamily}`;
      // o algarismo é o último nó do <text> (o primeiro é o <title> da dica)
      const texto = (alvo.lastChild?.textContent || '').trim();
      const m = ctx.measureText(texto || '0');
      const px = parseFloat(est.fontSize);                        // = unidades do viewBox
      const ascent = m.actualBoundingBoxAscent;
      const descent = m.actualBoundingBoxDescent;
      const largura = m.width;

      // posição real do texto no viewBox
      const caixaEcra = alvo.getBoundingClientRect();
      const cxEcra = paraEcra(c.cx, c.cy);
      // linha de base: y do <text> + dy(0.34em) — lida do próprio atributo
      const yAttr = parseFloat(alvo.getAttribute('y'));
      const dyEm = parseFloat(alvo.getAttribute('dy'));
      const base = yAttr + dyEm * px;

      const tinta = {
        topo: base - ascent,
        fundo: base + descent,
        esq: c.cx - largura / 2,
        dir: c.cx + largura / 2,
      };
      const topoCirculo = c.cy - c.r;
      // meia-corda do círculo à altura do topo e do fundo da tinta
      const meiaCorda = (y) => {
        const d = Math.abs(y - c.cy);
        return d >= c.r ? 0 : Math.sqrt(c.r * c.r - d * d);
      };
      const cabeEmLargura =
        Math.max(largura / 2, 0) < Math.min(meiaCorda(tinta.topo), meiaCorda(tinta.fundo)) - FOLGA;

      const problemas = [];
      if (tinta.topo < topoCirculo + FOLGA) problemas.push('sai por cima do círculo');
      if (tinta.fundo > c.topoRotulo - FOLGA) problemas.push('encosta/tapa o rótulo');
      if (!cabeEmLargura) problemas.push('não cabe em largura');

      saida.push({
        id,
        texto,
        topoTinta: Math.round(tinta.topo),
        fundoTinta: Math.round(tinta.fundo),
        zonaLivre: `${Math.round(topoCirculo)}–${c.topoRotulo}`,
        escala: Number(escala.toFixed(3)),
        larguraEcra: Math.round(caixaEcra.width),
        ok: problemas.length === 0,
        problemas,
      });
    }
    return saida;
  }, { CIRCULOS, FOLGA });

  const falhas = r.filter((x) => !x.ok);
  mau += falhas.length;
  console.log(`${tag.padEnd(9)} ${falhas.length ? 'FALHA ' + JSON.stringify(falhas, null, 1) : 'ok — os 5 números dentro da faixa livre'}`);
  if (tag === 'grande') await p.locator('.roda').screenshot({ path: '/tmp/z_roda.png' });
  await p.close();
}

await b.close();
console.log(mau ? `\n${mau} números fora do sítio` : '\nOs números ficam sempre entre o topo do círculo e o rótulo');
if (mau) process.exitCode = 1;
