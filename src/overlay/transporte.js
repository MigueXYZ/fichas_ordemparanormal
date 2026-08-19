/**
 * Transporte do overlay.
 *
 * O Claudio guarda tudo no browser, e o OBS abre um browser à parte que não vê
 * esse armazenamento. Por isso o estado tem de passar por algum sítio. Há dois
 * modos, com a MESMA interface:
 *
 *   local  — BroadcastChannel + localStorage. Só funciona dentro do mesmo
 *            browser (ótimo para experimentar numa segunda janela), mas não
 *            chega ao OBS nem a outro computador.
 *   remoto — HTTP: a ficha faz POST do estado, o overlay ouve por SSE.
 *            Serve para o OBS no teu PC (com `npm run overlay`) e para o mestre
 *            noutro sítio qualquer (com o mesmo servidor alojado algures).
 *
 * Para o modo remoto só é preciso um URL base e um código de sala. O servidor
 * de referência está em `servidor/overlay.mjs` — 90 linhas, sem dependências.
 */

export const CHAVE_CONFIG = 'op-ficha:overlay:v1';
const CANAL = 'op-ficha-overlay';

export function lerConfig() {
  try {
    const cru = localStorage.getItem(CHAVE_CONFIG);
    const c = cru ? JSON.parse(cru) : {};
    return {
      modo: c.modo === 'remoto' ? 'remoto' : 'local',
      url: c.url || 'http://localhost:7777',
      codigo: c.codigo || 'mesa',
      ligado: Boolean(c.ligado),
    };
  } catch {
    return { modo: 'local', url: 'http://localhost:7777', codigo: 'mesa', ligado: false };
  }
}

export function guardarConfig(config) {
  localStorage.setItem(CHAVE_CONFIG, JSON.stringify(config));
  return config;
}

/** URL do overlay para colar no OBS. */
export function urlDoOverlay(config) {
  const base = typeof location !== 'undefined' ? location.origin + location.pathname.replace(/[^/]*$/, '') : '';
  const p = new URLSearchParams({ modo: config.modo, codigo: config.codigo });
  if (config.modo === 'remoto') p.set('url', config.url);
  return `${base}overlay.html?${p.toString()}`;
}

// ----------------------------------------------------------------- publicar

let canal = null;
function canalLocal() {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!canal) canal = new BroadcastChannel(CANAL);
  return canal;
}

/**
 * Manda o estado atual para o overlay. Nunca rejeita: se o servidor estiver em
 * baixo, devolve o erro para a interface poder avisar sem partir nada.
 */
export async function publicar(config, estado) {
  if (!config?.ligado) return { ok: true, parado: true };

  if (config.modo === 'local') {
    try {
      localStorage.setItem(`${CHAVE_CONFIG}:${config.codigo}`, JSON.stringify(estado));
      canalLocal()?.postMessage(estado);
      return { ok: true };
    } catch (e) {
      return { ok: false, erro: e.message };
    }
  }

  try {
    const r = await fetch(`${config.url.replace(/\/$/, '')}/o/${encodeURIComponent(config.codigo)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(estado),
    });
    if (!r.ok) return { ok: false, erro: `o servidor respondeu ${r.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, erro: e.message };
  }
}

// ---------------------------------------------------------------- subscrever

/**
 * Ouve as atualizações. Devolve uma função para desligar.
 * `aoEstado(estado)` é chamado sempre que chega estado novo;
 * `aoLigacao(estado)` recebe 'ligado' | 'à espera' | 'sem ligação'.
 */
export function subscrever(config, aoEstado, aoLigacao = () => {}) {
  if (config.modo === 'local') {
    const c = canalLocal();
    const daStorage = (e) => {
      if (e.key === `${CHAVE_CONFIG}:${config.codigo}` && e.newValue) {
        try { aoEstado(JSON.parse(e.newValue)); } catch { /* ignora */ }
      }
    };
    const doCanal = (e) => aoEstado(e.data);
    c?.addEventListener('message', doCanal);
    window.addEventListener('storage', daStorage);
    aoLigacao('ligado');

    // o que já lá estiver
    try {
      const guardado = localStorage.getItem(`${CHAVE_CONFIG}:${config.codigo}`);
      if (guardado) aoEstado(JSON.parse(guardado));
    } catch { /* ignora */ }

    return () => {
      c?.removeEventListener('message', doCanal);
      window.removeEventListener('storage', daStorage);
    };
  }

  const base = config.url.replace(/\/$/, '');
  let fonte = null;
  let morto = false;
  let tentativa = null;

  function ligar() {
    if (morto) return;
    aoLigacao('à espera');
    fonte = new EventSource(`${base}/sse/${encodeURIComponent(config.codigo)}`);
    fonte.onopen = () => aoLigacao('ligado');
    fonte.onmessage = (e) => {
      try { aoEstado(JSON.parse(e.data)); } catch { /* ignora */ }
    };
    fonte.onerror = () => {
      aoLigacao('sem ligação');
      fonte.close();
      // volta a tentar sozinho: o OBS fica horas aberto e o servidor pode reiniciar
      tentativa = setTimeout(ligar, 3000);
    };
  }
  ligar();

  return () => {
    morto = true;
    clearTimeout(tentativa);
    fonte?.close();
  };
}
