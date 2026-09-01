import { Peer, type DataConnection } from 'peerjs';

const isDev = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);

const log = {
  info: (...args: any[]) => { if (isDev) console.log(...args); },
  warn: (...args: any[]) => { if (isDev) console.warn(...args); },
  error: (...args: any[]) => { if (isDev) console.error(...args); },
};

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  url: string | null;
  title: string | null;
  volume: number;
  isMuted: boolean;
  autoplayBlocked: boolean;
}

class MuralSync {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  public isConnected = false;
  public isConnecting = false;
  public roomCode = '';
  public lastError: string | null = null;

  // Áudio e estado de reprodução
  private audio: HTMLAudioElement | null = null;
  public audioState: AudioState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    url: null,
    title: null,
    volume: 0.7,
    isMuted: false,
    autoplayBlocked: false,
  };

  private listeners: Set<(connected: boolean) => void> = new Set();
  private audioListeners: Set<(state: AudioState) => void> = new Set();
  private trackCache: Map<string, string> = new Map(); // trackId -> objectUrl
  private chunkBuffers: Map<string, { chunks: ArrayBuffer[]; mimeType: string; title: string }> = new Map();
  private mestreVolumeMultiplier: number = 1;

  private applyEffectiveVolume() {
    if (!this.audio) return;
    if (this.audioState.isMuted) {
      this.audio.volume = 0;
    } else {
      this.audio.volume = Math.max(0, Math.min(1, this.audioState.volume * this.mestreVolumeMultiplier));
    }
  }

  constructor() {
    if (typeof Audio !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'auto';

      // Recuperar volume guardado
      try {
        const vol = localStorage.getItem('op_mural_audio_volume');
        if (vol !== null) {
          const numVol = Math.max(0, Math.min(1, parseFloat(vol)));
          this.audioState.volume = numVol;
          this.audio.volume = numVol;
        } else {
          this.audio.volume = 0.7;
        }
      } catch {}

      // Eventos nativos do elemento de áudio
      this.audio.addEventListener('timeupdate', () => {
        if (!this.audio) return;
        this.audioState.currentTime = this.audio.currentTime;
        this.audioState.duration = this.audio.duration || 0;
        this.notifyAudioListeners();
      });

      this.audio.addEventListener('play', () => {
        this.audioState.isPlaying = true;
        this.audioState.autoplayBlocked = false;
        this.notifyAudioListeners();
      });

      this.audio.addEventListener('pause', () => {
        this.audioState.isPlaying = false;
        this.notifyAudioListeners();
      });

      this.audio.addEventListener('loadedmetadata', () => {
        if (!this.audio) return;
        this.audioState.duration = this.audio.duration || 0;
        this.notifyAudioListeners();
      });

      this.audio.addEventListener('ended', () => {
        this.audioState.isPlaying = false;
        this.notifyAudioListeners();
      });

      this.audio.addEventListener('error', (e) => {
        log.warn('[MuralSync Audio] Erro no carregamento de áudio:', e);
        this.notifyAudioListeners();
      });
    }
  }

  /**
   * Registar ouvinte para alterações de estado da ligação
   */
  public onStatusChange(fn: (connected: boolean) => void): () => void {
    this.listeners.add(fn);
    fn(this.isConnected);
    return () => this.listeners.delete(fn);
  }

  /**
   * Registar ouvinte para alterações no estado do player de música
   */
  public onAudioChange(fn: (state: AudioState) => void): () => void {
    this.audioListeners.add(fn);
    fn(this.audioState);
    return () => this.audioListeners.delete(fn);
  }

  private notifyListeners() {
    for (const fn of this.listeners) {
      try {
        fn(this.isConnected);
      } catch {}
    }
  }

  private notifyAudioListeners() {
    for (const fn of this.audioListeners) {
      try {
        fn({ ...this.audioState });
      } catch {}
    }
  }

  /**
   * Liga o jogador à sala do Mural
   */
  connect(roomCode: string, character: any) {
    if (!roomCode || !roomCode.trim()) return;

    const cleanCode = roomCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetPeerId = `mural-ordo-${cleanCode}`;
    this.roomCode = roomCode.trim().toUpperCase();
    this.lastError = null;
    this.isConnecting = true;
    this.notifyListeners();

    if (this.conn) {
      try { this.conn.close(); } catch {}
      this.conn = null;
    }
    if (this.peer) {
      try { this.peer.destroy(); } catch {}
      this.peer = null;
    }

    try {
      this.peer = new Peer();

      this.peer.on('open', () => {
        if (!this.peer) return;
        this.conn = this.peer.connect(targetPeerId);

        this.conn.on('open', () => {
          this.isConnected = true;
          this.isConnecting = false;
          this.lastError = null;
          this.notifyListeners();
          // 1. Envia a ficha inicial assim que conecta
          this.sendCharacter(character);
        });

        // 2. Escuta comandos do Mestre (ex: Música e ficheiros)
        this.conn.on('data', (msg: any) => {
          if (msg?.type === 'AUDIO_SYNC') {
            this.handleAudioSync(msg.payload || msg);
          } else if (msg?.type === 'AUDIO_TRACK_DATA') {
            this.handleAudioTrackData(msg.payload || msg);
          } else if (msg?.type === 'AUDIO_CHUNK') {
            this.handleAudioChunk(msg.payload || msg);
          }
        });

        this.conn.on('close', () => {
          this.isConnected = false;
          this.isConnecting = false;
          this.notifyListeners();
        });

        this.conn.on('error', (err: any) => {
          this.isConnected = false;
          this.isConnecting = false;
          this.lastError = err?.message || 'Erro na ligação P2P';
          this.notifyListeners();
        });
      });

      // Suporte a chamada de Streaming WebRTC (MediaStream direto via peer.call)
      this.peer.on('call', (mediaConn) => {
        log.info('[MuralSync Audio] Recebida transmissão de áudio em tempo real (MediaStream)');
        mediaConn.answer(); // atende o stream de áudio
        mediaConn.on('stream', (remoteStream) => {
          if (this.audio) {
            this.audio.srcObject = remoteStream;
            this.audioState.title = 'Transmissão ao Vivo do Mestre';
            this.audioState.isPlaying = true;
            this.audio.play().catch(() => {
              this.audioState.autoplayBlocked = true;
              this.notifyAudioListeners();
            });
            this.notifyAudioListeners();
          }
        });
      });

      this.peer.on('error', (err: any) => {
        log.warn('[MuralSync] Erro do Peer:', err);
        this.isConnected = false;
        this.isConnecting = false;
        this.lastError = err?.type === 'peer-unavailable'
          ? 'Sala não encontrada. Verifica se o Mestre está online com a sala aberta.'
          : (err?.message || 'Erro ao inicializar conexão Peer');
        this.notifyListeners();
      });
    } catch (e: any) {
      this.isConnected = false;
      this.isConnecting = false;
      this.lastError = e?.message || 'Falha ao iniciar PeerJS';
      this.notifyListeners();
    }
  }

  /**
   * Envia os status do personagem para o Mural (chamar sempre que PV, SAN, PE ou atributos mudarem)
   */
  sendCharacter(char: any) {
    if (!this.conn || !this.conn.open || !char) return;

    // Calcular atributos com fallback para o formato interno do Ordo
    const attrs = char.atributos || char.attributes || {};
    const agi = attrs.agi ?? attrs.agilidade ?? 1;
    const forc = attrs.for ?? attrs.forca ?? 1;
    const inte = attrs.int ?? attrs.intelecto ?? 1;
    const pre = attrs.pre ?? attrs.presenca ?? 1;
    const vig = attrs.vig ?? attrs.vigor ?? 1;

    // Pontos de vida, sanidade e esforço
    const pvCurrent = char.pv?.current ?? char.pvAtual;
    const pvMax = char.pv?.max ?? char.pvMax;
    const sanCurrent = char.san?.current ?? char.sanAtual;
    const sanMax = char.san?.max ?? char.sanMax;
    const peCurrent = char.pe?.current ?? char.peAtual;
    const peMax = char.pe?.max ?? char.peMax;

    this.conn.send({
      type: 'CHARACTER_UPDATE',
      senderId: this.peer?.id || 'ordo-player',
      senderName: char.playerName || char.nomeJogador || char.jogador || 'Jogador',
      timestamp: Date.now(),
      payload: {
        id: char.id || 'char-1',
        name: char.name || char.nome || 'Personagem',
        playerName: char.playerName || char.nomeJogador || char.jogador || 'Jogador',
        class: char.class || char.classe || char.classeId || 'Agente',
        origin: char.origin || char.origem || char.origemId || '',
        nex: char.nex || 5,
        pv: { current: pvCurrent, max: pvMax },
        san: { current: sanCurrent, max: sanMax },
        pe: { current: peCurrent, max: peMax },
        attributes: {
          agi,
          for: forc,
          int: inte,
          pre,
          vig,
        },
        skills: char.skills || char.pericias || {},
      },
    });
  }

  /**
   * Envia uma rolagem de dados para aparecer no feed do Mestre
   */
  sendDiceRoll(roll: {
    label: string; // Ex: "Ocultismo", "Iniciativa"
    diceFormula: string; // Ex: "3d20+5"
    diceResults: number[]; // Ex: [14, 19, 8]
    total: number; // Ex: 24
    isCritical?: boolean;
    isFumble?: boolean;
  }) {
    if (!this.conn || !this.conn.open) return;
    this.conn.send({
      type: 'DICE_ROLL',
      senderId: this.peer?.id || 'ordo-player',
      senderName: 'Jogador',
      timestamp: Date.now(),
      payload: {
        ...roll,
        rollType: 'pericia',
        keptValue: Math.max(...(roll.diceResults || [roll.total])),
      },
    });
  }

  /**
   * Extrair nome legível do ficheiro / URL
   */
  private extractTitleFromUrl(url: string): string {
    try {
      const pathname = new URL(url, location.href).pathname;
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
      const decoded = decodeURIComponent(filename);
      return decoded.replace(/\.[a-z0-9]+$/i, '') || 'Música da Sessão';
    } catch {
      return 'Música da Sessão';
    }
  }

  /**
   * 1. Receber Ficheiro de Áudio Binário do Mestre (AUDIO_TRACK_DATA)
   */
  private handleAudioTrackData(payload: { trackId: string; title?: string; name?: string; mimeType?: string; data: ArrayBuffer | Uint8Array | string | Blob }) {
    if (!payload || !payload.trackId) return;
    try {
      const { trackId, mimeType, data, title, name } = payload;
      const byteLen = data instanceof ArrayBuffer ? data.byteLength : (data as any)?.length || 0;
      log.info(`[Ordo] A receber dados de áudio para a faixa ${trackId} (${byteLen} bytes)`);

      let blob: Blob;
      const mime = mimeType || 'audio/mpeg';

      if (data instanceof Blob) {
        blob = data;
      } else if (typeof data === 'string' && data.startsWith('data:')) {
        const byteCharacters = atob(data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: mime });
      } else {
        blob = new Blob([data], { type: mime });
      }

      // Cria um Blob local seguro no próprio navegador do jogador
      const localBlobUrl = URL.createObjectURL(blob);
      this.trackCache.set(trackId, localBlobUrl);

      if (this.audio) {
        this.audio.src = localBlobUrl;
        this.audio.load();
      }

      this.audioState.url = localBlobUrl;
      this.audioState.title = title || name || 'Música da Sessão';
      this.notifyAudioListeners();
    } catch (e) {
      log.error('[Ordo MuralSync Audio] Erro ao processar dados de áudio binário:', e);
    }
  }

  /**
   * Receber pedaços de ficheiro grande via P2P (Chunked Transfer)
   */
  private handleAudioChunk(payload: { trackId: string; title?: string; mimeType?: string; chunk: ArrayBuffer; current: number; total: number }) {
    if (!payload || !payload.trackId) return;
    try {
      if (!this.chunkBuffers.has(payload.trackId)) {
        this.chunkBuffers.set(payload.trackId, {
          chunks: [],
          mimeType: payload.mimeType || 'audio/mpeg',
          title: payload.title || 'Música da Sessão',
        });
      }

      const buffer = this.chunkBuffers.get(payload.trackId)!;
      buffer.chunks[payload.current] = payload.chunk;

      if (buffer.chunks.filter(Boolean).length === payload.total) {
        const fullBlob = new Blob(buffer.chunks, { type: buffer.mimeType });
        const objectUrl = URL.createObjectURL(fullBlob);
        this.trackCache.set(payload.trackId, objectUrl);
        this.chunkBuffers.delete(payload.trackId);

        if (this.audio) {
          this.audio.src = objectUrl;
          this.audio.load();
        }

        this.audioState.url = objectUrl;
        this.audioState.title = buffer.title;
        this.notifyAudioListeners();
      }
    } catch (e) {
      log.error('[Ordo MuralSync Audio] Erro ao processar chunk de áudio:', e);
    }
  }

  /**
   * 2. Receber Sincronização de Play / Pause / Seek / Volume (AUDIO_SYNC)
   */
  private handleAudioSync(audio: {
    trackId?: string;
    url?: string;
    src?: string;
    title?: string;
    name?: string;
    artist?: string;
    isPlaying: boolean;
    currentTime: number;
    duration?: number;
    volumeMultiplier?: number;
    timestamp?: number;
  }) {
    log.info('[Ordo] Sincronização de áudio recebida:', audio);
    if (!this.audio) return;

    if (!audio.trackId && !audio.url && !audio.src) {
      this.audio.pause();
      this.audioState.isPlaying = false;
      this.notifyAudioListeners();
      return;
    }

    // 1. Resolver fonte de áudio (cache local ou link web)
    if (audio.trackId && this.trackCache.has(audio.trackId)) {
      const localUrl = this.trackCache.get(audio.trackId)!;
      if (this.audio.src !== localUrl) {
        this.audio.src = localUrl;
        this.audio.load();
      }
      this.audioState.url = localUrl;
    } else if (audio.url && audio.url.startsWith('http') && !audio.url.includes('localhost') && !audio.url.startsWith('blob:')) {
      if (this.audio.src !== audio.url) {
        this.audio.src = audio.url;
        this.audio.load();
      }
      this.audioState.url = audio.url;
    }

    // 2. Atualizar título da faixa
    const trackTitle = audio.title || audio.name || (audio.url ? this.extractTitleFromUrl(audio.url) : 'Música da Sessão');
    this.audioState.title = trackTitle;

    // 3. Sincronizar posição no tempo
    if (typeof audio.currentTime === 'number') {
      if (Math.abs(this.audio.currentTime - audio.currentTime) > 1.5) {
        this.audio.currentTime = audio.currentTime;
      }
      this.audioState.currentTime = audio.currentTime;
    }

    // 4. Volume do Mestre
    if (typeof audio.volumeMultiplier === 'number') {
      this.mestreVolumeMultiplier = Math.max(0, Math.min(1, audio.volumeMultiplier));
      this.applyEffectiveVolume();
    }

    // 5. Tocar ou pausar
    if (audio.isPlaying) {
      this.audio.play().then(() => {
        this.audioState.isPlaying = true;
        this.audioState.autoplayBlocked = false;
        this.notifyAudioListeners();
      }).catch((err) => {
        log.warn('[Ordo MuralSync Audio] Autoplay bloqueado pelo navegador:', err);
        this.audioState.isPlaying = false;
        this.audioState.autoplayBlocked = true;
        this.notifyAudioListeners();
      });
    } else {
      this.audio.pause();
      this.audioState.isPlaying = false;
      this.audioState.autoplayBlocked = false;
      this.notifyAudioListeners();
    }
  }

  /**
   * Controlos locais do jogador
   */
  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.audioState.volume = clamped;
    this.audioState.isMuted = clamped === 0;
    this.applyEffectiveVolume();
    try {
      localStorage.setItem('op_mural_audio_volume', String(clamped));
    } catch {}
    this.notifyAudioListeners();
  }

  public toggleMute() {
    if (this.audioState.isMuted) {
      const restoreVol = this.audioState.volume > 0 ? this.audioState.volume : 0.7;
      this.audioState.volume = restoreVol;
      this.audioState.isMuted = false;
    } else {
      this.audioState.isMuted = true;
    }
    this.applyEffectiveVolume();
    this.notifyAudioListeners();
  }

  public togglePlay() {
    if (!this.audio || !this.audio.src) return;
    if (this.audio.paused) {
      this.audio.play().then(() => {
        this.audioState.isPlaying = true;
        this.audioState.autoplayBlocked = false;
        this.notifyAudioListeners();
      }).catch((e) => {
        log.warn('[MuralSync Audio] Erro ao reproduzir:', e);
      });
    } else {
      this.audio.pause();
      this.audioState.isPlaying = false;
      this.notifyAudioListeners();
    }
  }

  public seek(seconds: number) {
    if (!this.audio || !this.audio.duration) return;
    this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, seconds));
    this.audioState.currentTime = this.audio.currentTime;
    this.notifyAudioListeners();
  }

  disconnect() {
    if (this.conn) {
      try { this.conn.close(); } catch {}
      this.conn = null;
    }
    if (this.peer) {
      try { this.peer.destroy(); } catch {}
      this.peer = null;
    }
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.src = '';
      } catch {}
      this.audioState.isPlaying = false;
      this.audioState.url = null;
      this.audioState.title = null;
      this.notifyAudioListeners();
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.notifyListeners();
  }
}

export const muralSync = new MuralSync();
