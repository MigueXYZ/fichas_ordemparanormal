import { Peer } from 'peerjs';

export const CHAVE_CONFIG = 'op-ficha:overlay:v1';
const CANAL = 'op-ficha-overlay';

const CONFIG_PEER = {
  debug: 1,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ],
  },
};

export function novoCodigoSala() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `op-${rand}`;
}

export function normalizarCodigo(codigo) {
  if (!codigo) return 'mesa';
  return codigo.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
}

export function lerConfig() {
  try {
    const cru = localStorage.getItem(CHAVE_CONFIG);
    const c = cru ? JSON.parse(cru) : {};
    return {
      modo: c.modo === 'local' || c.modo === 'remoto' ? c.modo : 'p2p',
      url: c.url || 'http://localhost:7777',
      codigo: c.codigo || novoCodigoSala(),
      ligado: Boolean(c.ligado),
    };
  } catch {
    return { modo: 'p2p', url: 'http://localhost:7777', codigo: novoCodigoSala(), ligado: false };
  }
}

export function guardarConfig(config) {
  localStorage.setItem(CHAVE_CONFIG, JSON.stringify(config));
  return config;
}

/** URL do overlay para colar no OBS ou partilhar com o Mestre. */
export function urlDoOverlay(config) {
  const base = typeof location !== 'undefined' ? location.origin + location.pathname.replace(/[^/]*$/, '') : '';
  const p = new URLSearchParams({ modo: config.modo || 'p2p', codigo: config.codigo || 'mesa' });
  if (config.modo === 'remoto') p.set('url', config.url);
  return `${base}overlay.html?${p.toString()}`;
}

// ----------------------------------------------------------------- P2P HOST (Jogador)

class HostP2P {
  constructor() {
    this.peer = null;
    this.codigoAtual = null;
    this.conexoes = new Set();
    this.ultimoEstado = null;
    this.ouvintesConexao = new Set();
    this.reiniciarTimeout = null;
  }

  aoMudarEspectadores(fn) {
    this.ouvintesConexao.add(fn);
    fn(this.conexoes.size);
    return () => this.ouvintesConexao.delete(fn);
  }

  notificarOuvintes() {
    for (const fn of this.ouvintesConexao) {
      try { fn(this.conexoes.size); } catch { /* ignora */ }
    }
  }

  iniciar(codigo) {
    const codigoLimpo = normalizarCodigo(codigo);
    if (this.peer && this.codigoAtual === codigoLimpo && !this.peer.destroyed) {
      return;
    }

    this.parar();
    this.codigoAtual = codigoLimpo;

    try {
      console.log('[Host P2P] A criar sala:', codigoLimpo);
      this.peer = new Peer(codigoLimpo, CONFIG_PEER);

      this.peer.on('open', (id) => {
        console.log('[Host P2P] Sala registada com sucesso:', id);
      });

      this.peer.on('connection', (conn) => {
        console.log('[Host P2P] Novo espectador a conectar...');

        conn.on('open', () => {
          console.log('[Host P2P] Espectador conectado com sucesso!');
          this.conexoes.add(conn);
          this.notificarOuvintes();
          if (this.ultimoEstado) {
            conn.send(this.ultimoEstado);
          }
        });

        conn.on('data', (dados) => {
          if (dados?.tipo === 'pedir_estado' && this.ultimoEstado) {
            conn.send(this.ultimoEstado);
          }
        });

        const remover = () => {
          if (this.conexoes.has(conn)) {
            console.log('[Host P2P] Espectador desconectou.');
            this.conexoes.delete(conn);
            this.notificarOuvintes();
          }
        };

        conn.on('close', remover);
        conn.on('error', remover);
      });

      this.peer.on('error', (err) => {
        console.warn('[Host P2P] Notificação do peer:', err?.type || err);
        if (err.type === 'unavailable-id') {
          console.warn(`[Host P2P] Código ${codigoLimpo} ainda em uso, a tentar recuperar em 2s...`);
          clearTimeout(this.reiniciarTimeout);
          this.reiniciarTimeout = setTimeout(() => {
            if (this.codigoAtual === codigoLimpo) {
              this.iniciar(codigoLimpo);
            }
          }, 2000);
        }
      });
    } catch (e) {
      console.error('[Host P2P] Erro ao iniciar Host P2P:', e);
    }
  }

  transmitir(estado) {
    this.ultimoEstado = estado;
    for (const conn of this.conexoes) {
      try {
        if (conn.open) {
          conn.send(estado);
        }
      } catch (e) {
        this.conexoes.delete(conn);
        this.notificarOuvintes();
      }
    }
  }

  parar() {
    clearTimeout(this.reiniciarTimeout);
    this.conexoes.clear();
    this.notificarOuvintes();
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch { /* ignora */ }
      this.peer = null;
    }
    this.codigoAtual = null;
  }
}

const hostP2P = new HostP2P();

export function obterHostP2P() {
  return hostP2P;
}

// ----------------------------------------------------------------- publicar

let canal = null;
function canalLocal() {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!canal) canal = new BroadcastChannel(CANAL);
  return canal;
}

/**
 * Manda o estado atual para o overlay. Nunca rejeita: se houver erro,
 * devolve a mensagem para a interface poder avisar sem partir nada.
 */
export async function publicar(config, estado) {
  if (!config?.ligado) {
    hostP2P.parar();
    return { ok: true, parado: true };
  }

  if (config.modo === 'p2p') {
    hostP2P.iniciar(config.codigo);
    if (estado) hostP2P.transmitir(estado);
    return { ok: true, p2p: true, espectadores: hostP2P.conexoes.size };
  }

  // Se mudou para outro modo, para o host p2p
  hostP2P.parar();

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
 * Ouve as atualizações no Overlay/Mestre. Devolve uma função para desligar.
 * `aoEstado(estado)` é chamado sempre que chega estado novo;
 * `aoLigacao(estado)` recebe 'ligado' | 'à espera' | 'sem ligação'.
 */
export function subscrever(config, aoEstado, aoLigacao = () => {}) {
  if (config.modo === 'p2p') {
    let peer = null;
    let conexao = null;
    let cancelado = false;
    let tentarNovamenteTimer = null;
    const codigoAlvo = normalizarCodigo(config.codigo);

    function tentarConectar() {
      if (cancelado) return;
      aoLigacao('à espera');

      try {
        if (!peer || peer.destroyed) {
          peer = new Peer(null, CONFIG_PEER);
          peer.on('open', () => {
            estabelecerConexaoComHost();
          });
          peer.on('error', (err) => {
            console.warn('[Overlay P2P] Status do cliente Peer:', err?.type || err);
            aoLigacao('à espera');
            agendarReconexao();
          });
        } else if (peer.open) {
          estabelecerConexaoComHost();
        }
      } catch (e) {
        console.error('[Overlay P2P] Erro ao criar cliente Peer:', e);
        aoLigacao('à espera');
        agendarReconexao();
      }
    }

    function estabelecerConexaoComHost() {
      if (cancelado || !peer || !peer.open) return;
      if (conexao) {
        try { conexao.close(); } catch { /* ignora */ }
        conexao = null;
      }

      console.log('[Overlay P2P] A ligar à sala:', codigoAlvo);
      conexao = peer.connect(codigoAlvo, { reliable: true });

      conexao.on('open', () => {
        if (cancelado) return;
        console.log('[Overlay P2P] Conectado com sucesso ao Host!');
        aoLigacao('ligado');
        try { conexao.send({ tipo: 'pedir_estado' }); } catch { /* ignora */ }
      });

      conexao.on('data', (dados) => {
        if (cancelado) return;
        console.log('[Overlay P2P] Dados recebidos do jogador!');
        try {
          const obj = typeof dados === 'string' ? JSON.parse(dados) : dados;
          aoEstado(obj);
        } catch (e) {
          console.error('Falha ao processar dados recebidos:', e);
        }
      });

      conexao.on('close', () => {
        if (cancelado) return;
        console.warn('[Overlay P2P] Conexão fechada, a tentar reconectar...');
        aoLigacao('à espera');
        agendarReconexao();
      });

      conexao.on('error', (err) => {
        if (cancelado) return;
        console.warn('[Overlay P2P] Erro na conexão:', err);
        aoLigacao('à espera');
        agendarReconexao();
      });
    }

    function agendarReconexao() {
      if (cancelado) return;
      clearTimeout(tentarNovamenteTimer);
      tentarNovamenteTimer = setTimeout(() => {
        tentarConectar();
      }, 3000);
    }

    tentarConectar();

    return () => {
      cancelado = true;
      clearTimeout(tentarNovamenteTimer);
      if (conexao) {
        try { conexao.close(); } catch { /* ignora */ }
      }
      if (peer) {
        try { peer.destroy(); } catch { /* ignora */ }
      }
    };
  }

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
