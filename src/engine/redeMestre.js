import PeerPkg from 'peerjs';
const Peer = PeerPkg?.Peer || PeerPkg;
import { normalizarCodigo } from '../overlay/transporte.js';

export const CHAVE_CODIGOS_MESTRE = 'op-ficha:mestre:codigos:v1';

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

/**
 * Lê a lista de códigos de salas guardadas para o Mestre.
 */
export function lerCodigosMestre() {
  try {
    const raw = localStorage.getItem(CHAVE_CODIGOS_MESTRE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizarCodigo).filter(Boolean) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda a lista de códigos de salas do Mestre.
 */
export function guardarCodigosMestre(codigos) {
  const limpos = Array.from(new Set((codigos || []).map(normalizarCodigo).filter(Boolean)));
  try {
    localStorage.setItem(CHAVE_CODIGOS_MESTRE, JSON.stringify(limpos));
  } catch {
    /* ignora */
  }
  return limpos;
}

/**
 * Gerenciador Multi-P2P para o Mestre escutar múltiplos jogadores simultaneamente.
 */
export class SubscritorMestre {
  constructor() {
    this.peer = null;
    this.conexoes = new Map(); // codigo -> DataConnection
    this.estados = new Map(); // codigo -> estado do agente
    this.status = new Map(); // codigo -> 'ligado' | 'à espera' | 'erro'
    this.ouvintes = new Set();
    this.codigosAlvo = [];
    this.destruido = false;
    this.reconexaoTimers = new Map();
  }

  aoAtualizar(fn) {
    this.ouvintes.add(fn);
    this.notificar();
    return () => this.ouvintes.delete(fn);
  }

  notificar() {
    const lista = this.codigosAlvo.map((codigo) => ({
      codigo,
      status: this.status.get(codigo) || 'à espera',
      dados: this.estados.get(codigo) || null,
    }));
    for (const fn of this.ouvintes) {
      try {
        fn(lista);
      } catch (e) {
        console.error('[Mestre P2P] Erro no ouvinte:', e);
      }
    }
  }

  definirCodigos(novosCodigos) {
    const lista = Array.from(new Set((novosCodigos || []).map(normalizarCodigo).filter(Boolean)));
    this.codigosAlvo = lista;
    guardarCodigosMestre(lista);

    // Fechar conexões de códigos removidos
    for (const [cod, conn] of this.conexoes.entries()) {
      if (!lista.includes(cod)) {
        try { conn.close(); } catch { /* ignora */ }
        this.conexoes.delete(cod);
        this.estados.delete(cod);
        this.status.delete(cod);
        const timer = this.reconexaoTimers.get(cod);
        if (timer) {
          clearTimeout(timer);
          this.reconexaoTimers.delete(cod);
        }
      }
    }

    // Inicializar status para novos códigos
    for (const cod of lista) {
      if (!this.status.has(cod)) {
        this.status.set(cod, 'à espera');
      }
    }

    this.conectarTodos();
    this.notificar();
  }

  iniciar() {
    if (this.peer && !this.peer.destroyed) {
      this.conectarTodos();
      return;
    }
    this.destruido = false;

    try {
      this.peer = new Peer(null, CONFIG_PEER);

      this.peer.on('open', () => {
        console.log('[Mestre P2P] Peer central do Mestre pronto:', this.peer.id);
        this.conectarTodos();
      });

      this.peer.on('error', (err) => {
        console.warn('[Mestre P2P] Erro no Peer central:', err?.type || err);
      });
    } catch (e) {
      console.error('[Mestre P2P] Falha ao criar Peer central do Mestre:', e);
    }
  }

  conectarTodos() {
    if (!this.peer || !this.peer.open || this.destruido) return;

    for (const codigo of this.codigosAlvo) {
      const connAtual = this.conexoes.get(codigo);
      if (connAtual && connAtual.open) continue;
      this.conectarCodigo(codigo);
    }
  }

  conectarCodigo(codigo) {
    if (!this.peer || !this.peer.open || this.destruido) return;

    const timer = this.reconexaoTimers.get(codigo);
    if (timer) {
      clearTimeout(timer);
      this.reconexaoTimers.delete(codigo);
    }

    try {
      this.status.set(codigo, 'à espera');
      this.notificar();

      const conn = this.peer.connect(codigo, { reliable: true });
      this.conexoes.set(codigo, conn);

      conn.on('open', () => {
        if (this.destruido) return;
        console.log(`[Mestre P2P] Conectado ao agente: ${codigo}`);
        this.status.set(codigo, 'ligado');
        this.notificar();
        try {
          conn.send({ tipo: 'pedir_estado' });
        } catch {
          /* ignora */
        }
      });

      conn.on('data', (dados) => {
        if (this.destruido) return;
        try {
          const obj = typeof dados === 'string' ? JSON.parse(dados) : dados;
          this.estados.set(codigo, { ...obj, _atualizadoEm: Date.now() });
          this.status.set(codigo, 'ligado');
          this.notificar();
        } catch (e) {
          console.error(`[Mestre P2P] Erro ao analisar dados do agente ${codigo}:`, e);
        }
      });

      const desconectar = () => {
        if (this.destruido) return;
        this.status.set(codigo, 'à espera');
        this.conexoes.delete(codigo);
        this.notificar();
        this.agendarReconexao(codigo);
      };

      conn.on('close', desconectar);
      conn.on('error', desconectar);
    } catch (e) {
      console.warn(`[Mestre P2P] Falha ao tentar conectar a ${codigo}:`, e);
      this.agendarReconexao(codigo);
    }
  }

  agendarReconexao(codigo) {
    if (this.destruido || !this.codigosAlvo.includes(codigo)) return;
    if (this.reconexaoTimers.has(codigo)) return;

    const timer = setTimeout(() => {
      this.reconexaoTimers.delete(codigo);
      this.conectarCodigo(codigo);
    }, 4000);
    this.reconexaoTimers.set(codigo, timer);
  }

  destruir() {
    this.destruido = true;
    for (const timer of this.reconexaoTimers.values()) {
      clearTimeout(timer);
    }
    this.reconexaoTimers.clear();
    for (const conn of this.conexoes.values()) {
      try { conn.close(); } catch { /* ignora */ }
    }
    this.conexoes.clear();
    if (this.peer) {
      try { this.peer.destroy(); } catch { /* ignora */ }
      this.peer = null;
    }
    this.ouvintes.clear();
  }
}
