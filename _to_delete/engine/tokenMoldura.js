/**
 * Editor de Tokens com Molduras Paranormais — recorta uma imagem (a arte do
 * personagem ou outra) num círculo e desenha por cima uma moldura ritual
 * temática de um dos 5 elementos, pronta a usar como token no overlay.
 *
 * As cores de cada elemento e o sigilo desenhado no topo da moldura vêm dos
 * dados já existentes na app (ELEMENTOS em data/rituais.js e os ficheiros
 * public/img/sigilo-<elemento>.png já usados em Alteracoes.jsx) — a moldura
 * em si (anéis, marcas, brilho) é desenho geométrico, não arte extraída de
 * livro nenhum.
 *
 * Este ficheiro separa a matemática pura (recorte/zoom/posição — testável
 * sem DOM) do desenho em canvas (só corre no browser).
 */
import { ELEMENTOS } from '../data/rituais.js';

/** Os 5 elementos com moldura própria — sem "variável", que não é um elemento real. */
export const ELEMENTOS_MOLDURA = ELEMENTOS.filter((e) => e.id !== 'variavel');

// ---------------------------------------------------------------- geometria

/** Lado (em píxeis da imagem original) do quadrado recortado, para um dado zoom. */
export function tamanhoRecorteNatural(naturalW, naturalH, zoom) {
  return Math.min(naturalW, naturalH) / Math.max(zoom, 1);
}

/** Escala exibida = display ÷ lado menor da imagem, vezes o zoom. */
export function baseEscala(displaySize, naturalW, naturalH) {
  return displaySize / Math.min(naturalW, naturalH);
}

/** Mantém o centro do recorte (0..1 num eixo) dentro dos limites da imagem. */
export function limitarEixo(offset, naturalW, naturalH, zoom, eixo) {
  const dimensao = eixo === 'x' ? naturalW : naturalH;
  const recorte = tamanhoRecorteNatural(naturalW, naturalH, zoom);
  const meia = recorte / (2 * dimensao);
  if (meia >= 0.5) return 0.5;
  return Math.min(Math.max(offset, meia), 1 - meia);
}

/** Onde e a que tamanho desenhar a imagem dentro da caixa de pré-visualização. */
export function posicaoImagem(displaySize, naturalW, naturalH, zoom, offsetX, offsetY) {
  const escala = baseEscala(displaySize, naturalW, naturalH) * Math.max(zoom, 1);
  return {
    escala,
    esquerda: displaySize / 2 - offsetX * naturalW * escala,
    topo: displaySize / 2 - offsetY * naturalH * escala,
    largura: naturalW * escala,
    altura: naturalH * escala,
  };
}

/** Novo centro do recorte depois de arrastar (deltaPx) a imagem na caixa de pré-visualização. */
export function deslocarOffset(offsetX, offsetY, deltaPxX, deltaPxY, displaySize, naturalW, naturalH, zoom) {
  const escala = baseEscala(displaySize, naturalW, naturalH) * Math.max(zoom, 1);
  return {
    offsetX: limitarEixo(offsetX - deltaPxX / (naturalW * escala), naturalW, naturalH, zoom, 'x'),
    offsetY: limitarEixo(offsetY - deltaPxY / (naturalH * escala), naturalW, naturalH, zoom, 'y'),
  };
}

// -------------------------------------------------------------- desenho final

function carregarImagem(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Imagem inválida.'));
    img.src = src;
  });
}

function desenharAneis(ctx, centro, raioToken, cor, lado) {
  ctx.save();
  ctx.strokeStyle = cor;
  ctx.lineWidth = lado * 0.022;
  ctx.beginPath();
  ctx.arc(centro, centro, raioToken + ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0,0,0,.55)';
  ctx.lineWidth = lado * 0.006;
  ctx.beginPath();
  ctx.arc(centro, centro, raioToken - lado * 0.012, 0, Math.PI * 2);
  ctx.stroke();

  const brilho = ctx.createRadialGradient(centro, centro, raioToken, centro, centro, raioToken + lado * 0.05);
  brilho.addColorStop(0, cor + '55');
  brilho.addColorStop(1, cor + '00');
  ctx.fillStyle = brilho;
  ctx.beginPath();
  ctx.arc(centro, centro, raioToken + lado * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4 marcas cardeais, como as de um pedestal ritual
  ctx.save();
  ctx.fillStyle = cor;
  const raioMarca = lado * 0.014;
  const raioPosicao = raioToken + lado * 0.038;
  for (const angulo of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
    const x = centro + Math.cos(angulo) * raioPosicao;
    const y = centro + Math.sin(angulo) * raioPosicao;
    ctx.beginPath();
    ctx.arc(x, y, raioMarca, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function desenharSigilo(ctx, centro, raioToken, lado, sigilo, cor) {
  const raioBadge = lado * 0.09;
  const x = centro;
  const y = centro - raioToken - lado * 0.05;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, raioBadge, 0, Math.PI * 2);
  ctx.fillStyle = '#0b0708';
  ctx.fill();
  ctx.lineWidth = lado * 0.008;
  ctx.strokeStyle = cor;
  ctx.stroke();
  ctx.clip();
  const tam = raioBadge * 1.6;
  ctx.drawImage(sigilo, x - tam / 2, y - tam / 2, tam, tam);
  ctx.restore();
}

/**
 * Gera o token final: recorta `src` num círculo (segundo zoom/offsetX/offsetY,
 * a mesma matemática da pré-visualização) e desenha por cima a moldura do
 * elemento escolhido. Devolve uma promessa com o data URL PNG.
 */
export async function gerarTokenComMoldura({ src, zoom = 1, offsetX = 0.5, offsetY = 0.5, elemento, lado = 900 }) {
  const info = ELEMENTOS_MOLDURA.find((e) => e.id === elemento) || ELEMENTOS_MOLDURA[0];
  const img = await carregarImagem(src);
  const sigilo = await carregarImagem(`/img/sigilo-${info.id}.png`).catch(() => null);

  const canvas = document.createElement('canvas');
  canvas.width = lado;
  canvas.height = lado;
  const ctx = canvas.getContext('2d');
  const centro = lado / 2;
  const raioToken = lado * 0.4;

  const recorte = tamanhoRecorteNatural(img.width, img.height, zoom);
  const sx = Math.min(Math.max(offsetX * img.width - recorte / 2, 0), Math.max(img.width - recorte, 0));
  const sy = Math.min(Math.max(offsetY * img.height - recorte / 2, 0), Math.max(img.height - recorte, 0));

  ctx.save();
  ctx.beginPath();
  ctx.arc(centro, centro, raioToken, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = '#0b0708';
  ctx.fillRect(centro - raioToken, centro - raioToken, raioToken * 2, raioToken * 2);
  ctx.drawImage(img, sx, sy, recorte, recorte, centro - raioToken, centro - raioToken, raioToken * 2, raioToken * 2);
  ctx.restore();

  desenharAneis(ctx, centro, raioToken, info.cor, lado);
  if (sigilo) desenharSigilo(ctx, centro, raioToken, lado, sigilo, info.cor);

  return canvas.toDataURL('image/png');
}
