/**
 * Som gerado na hora com a Web Audio API — sem ficheiros, sem downloads.
 *  - dados: uma série de estalidos secos (o dado a saltar e a assentar)
 *  - coração: dois baques graves, "lub-dub", em ciclo, sincronizados com o
 *    pulsar do fundo (cada batida dispara também um evento no DOM)
 */

let ctx = null;
let ligadoDados = true;
let ligadoCoracao = true;

try {
  ligadoDados = localStorage.getItem('op-ficha:som') !== 'off';
  ligadoCoracao = localStorage.getItem('op-ficha:coracao') !== 'off';
} catch { /* sem localStorage */ }

function contexto() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------- blocos

/** Ruído curto com decaimento rápido, filtrado — a base de qualquer impacto. */
function ruido(ac, inicio, duracao, volume, tipoFiltro, freq, q = 1) {
  const amostras = Math.max(1, Math.floor(ac.sampleRate * duracao));
  const buffer = ac.createBuffer(1, amostras, ac.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < amostras; i++) {
    dados[i] = (Math.random() * 2 - 1) * (1 - i / amostras) ** 3;
  }
  const fonte = ac.createBufferSource();
  fonte.buffer = buffer;

  const filtro = ac.createBiquadFilter();
  filtro.type = tipoFiltro;
  filtro.frequency.value = freq;
  filtro.Q.value = q;

  const ganho = ac.createGain();
  ganho.gain.setValueAtTime(volume, inicio);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);

  fonte.connect(filtro).connect(ganho).connect(ac.destination);
  fonte.start(inicio);
  fonte.stop(inicio + duracao + 0.01);
}

/**
 * Um modo de ressonância: um impulso curtíssimo (2 ms) a excitar um filtro
 * estreito, que continua a "cantar" enquanto o envelope o deixa. É assim que
 * se sintetiza o toque de um corpo pequeno e duro.
 */
function modo(ac, inicio, freq, q, decaimento, volume) {
  const amostras = Math.max(1, Math.floor(ac.sampleRate * decaimento));
  const buffer = ac.createBuffer(1, amostras, ac.sampleRate);
  const dados = buffer.getChannelData(0);
  const impulso = Math.floor(ac.sampleRate * 0.002);
  for (let i = 0; i < impulso; i++) dados[i] = (Math.random() * 2 - 1) * (1 - i / impulso);

  const fonte = ac.createBufferSource();
  fonte.buffer = buffer;

  const filtro = ac.createBiquadFilter();
  filtro.type = 'bandpass';
  filtro.frequency.value = freq;
  filtro.Q.value = q;

  const ganho = ac.createGain();
  ganho.gain.setValueAtTime(volume, inicio);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + decaimento);

  fonte.connect(filtro).connect(ganho).connect(ac.destination);
  fonte.start(inicio);
  fonte.stop(inicio + decaimento + 0.01);
}

/**
 * Um estalido de dado. Um corpo pequeno e duro (acrílico) a bater em madeira
 * não faz um "tom": faz um impacto com três ressonâncias inarmónicas que
 * morrem em poucos centésimos de segundo. É isso que se constrói aqui —
 * sem oscilador com glissando, que era o que soava a desenho animado.
 */
function estalido(ac, inicio, volume = 0.2, altura = 2100) {
  const f = altura * (0.9 + Math.random() * 0.25);
  // modos inarmónicos, do mais grave (mais longo) ao mais agudo (mais curto)
  modo(ac, inicio, f, 24, 0.042, volume * 9);
  modo(ac, inicio, f * 1.63, 28, 0.026, volume * 5.5);
  modo(ac, inicio, f * 2.41, 22, 0.016, volume * 3.2);
  // o "tique" do contacto
  ruido(ac, inicio, 0.004, volume * 0.8, 'highpass', 6500);
  // ressonância da mesa por baixo
  ruido(ac, inicio + 0.002, 0.05, volume * 0.55, 'lowpass', 300);
}

function sino(ac, inicio, frequencia, volume = 0.08) {
  const osc = ac.createOscillator();
  const ganho = ac.createGain();
  osc.type = 'triangle';
  osc.frequency.value = frequencia;
  ganho.gain.setValueAtTime(0, inicio);
  ganho.gain.linearRampToValueAtTime(volume, inicio + 0.02);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.9);
  osc.connect(ganho).connect(ac.destination);
  osc.start(inicio);
  osc.stop(inicio + 0.95);
}

// ------------------------------------------------------------------ dados

export function somLigado() { return ligadoDados; }
export function coracaoLigado() { return ligadoCoracao; }

export function alternarSom() {
  ligadoDados = !ligadoDados;
  try { localStorage.setItem('op-ficha:som', ligadoDados ? 'on' : 'off'); } catch { /* ignora */ }
  if (ligadoDados) tocarRolagem({ dados: 2 });
  return ligadoDados;
}

export function alternarCoracao() {
  ligadoCoracao = !ligadoCoracao;
  try { localStorage.setItem('op-ficha:coracao', ligadoCoracao ? 'on' : 'off'); } catch { /* ignora */ }
  if (ligadoCoracao) contexto();
  return ligadoCoracao;
}

/**
 * O dado a rolar: estalidos cada vez mais juntos (o salto) e depois cada vez
 * mais espaçados até assentar. Mais dados = mais estalidos.
 */
export function tocarRolagem({ dados = 1, critico = false, falhaCritica = false, ac: contextoExterno = null } = {}) {
  if (!ligadoDados && !contextoExterno) return;
  const ac = contextoExterno || contexto();
  if (!ac) return;
  try {
    const t = ac.currentTime + 0.01;
    const n = Math.min(Math.max(Number(dados) || 1, 1), 5);
    const total = 7 + n * 2;

    let quando = t;
    let intervalo = 0.055;
    for (let i = 0; i < total; i++) {
      const progresso = i / total;
      // salta depressa a meio e vai abrandando no fim
      intervalo = progresso < 0.45
        ? Math.max(0.022, intervalo * 0.82)
        : Math.min(0.115, intervalo * 1.3);
      const volume = 0.30 * (1 - progresso * 0.45) + Math.random() * 0.05;
      estalido(ac, quando, volume, 1500 + Math.random() * 1500);
      quando += intervalo + Math.random() * 0.012;
    }

    // assenta: um último toque mais cheio e a madeira a responder
    estalido(ac, quando + 0.05, 0.42, 1450);
    ruido(ac, quando + 0.052, 0.14, 0.13, 'lowpass', 190);

    const fim = quando + 0.2;
    if (critico) {
      sino(ac, fim, 880);
      sino(ac, fim + 0.09, 1320, 0.055);
    } else if (falhaCritica) {
      ruido(ac, fim, 0.3, 0.16, 'lowpass', 90);
    }
  } catch { /* o som é acessório: nunca deve partir a app */ }
}

// ---------------------------------------------------------------- coração

const CICLO = 4.6;      // segundos entre batimentos (~13 ciclos por minuto)
const ATRASO_DUB = 0.34; // intervalo entre o "lub" e o "dub"
let temporizador = null;

function baqueCardiaco(ac, inicio, volume, frequencia) {
  const osc = ac.createOscillator();
  const ganho = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequencia, inicio);
  osc.frequency.exponentialRampToValueAtTime(frequencia * 0.55, inicio + 0.16);
  ganho.gain.setValueAtTime(0.0001, inicio);
  ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.012);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.26);
  osc.connect(ganho).connect(ac.destination);
  osc.start(inicio);
  osc.stop(inicio + 0.3);

  ruido(ac, inicio, 0.09, volume * 0.5, 'lowpass', 170);   // o "corpo" do baque
}

function avisarDom(forte) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('op-batida', { detail: { forte } }));
}

function umCiclo() {
  avisarDom(true);
  setTimeout(() => avisarDom(false), ATRASO_DUB * 1000);

  if (!ligadoCoracao) return;
  const ac = contexto();
  if (!ac) return;
  try {
    const t = ac.currentTime + 0.02;
    baqueCardiaco(ac, t, 0.085, 58);                    // lub
    baqueCardiaco(ac, t + ATRASO_DUB, 0.055, 46);       // dub
  } catch { /* ignora */ }
}

/** Arranca o ciclo do coração. O áudio só toca depois de um gesto do utilizador. */
export function iniciarCoracao() {
  if (temporizador || typeof window === 'undefined') return () => {};
  umCiclo();
  temporizador = setInterval(umCiclo, CICLO * 1000);
  return () => { clearInterval(temporizador); temporizador = null; };
}

export const CICLO_CORACAO = CICLO;
