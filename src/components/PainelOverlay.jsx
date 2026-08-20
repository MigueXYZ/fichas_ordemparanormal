import React, { useEffect, useState } from 'react';
import { urlDoOverlay, novoCodigoSala, obterHostP2P } from '../overlay/transporte.js';

/**
 * Definições do overlay para o OBS e para partilhar com o Mestre.
 */
export default function PainelOverlay({ config, aoMudar, estadoEnvio, aoFechar }) {
  const [copiado, setCopiado] = useState(false);
  const [espectadores, setEspectadores] = useState(0);
  const link = urlDoOverlay(config);
  const set = (patch) => aoMudar({ ...config, ...patch });

  useEffect(() => {
    return obterHostP2P().aoMudarEspectadores(setEspectadores);
  }, []);

  async function copiar() {
    try {
      if (!config.ligado) {
        set({ ligado: true });
      }
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch { /* o utilizador que copie à mão */ }
  }

  function gerarNovoCodigo() {
    set({ codigo: novoCodigoSala(), ligado: true });
  }

  const modo = config.modo || 'p2p';

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-estreito">
        <div className="modal-topo">
          <h3>Transmissão em Tempo Real & Overlay</h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-corpo">
          <div className="regra-opcional">
            <div className="cabeca">
              <div>
                <b>Transmissão Ativa</b>
                <div className="resumo">
                  Transmite Vida, Sanidade, Esforço, Avatar e Rolagens em tempo real.
                </div>
              </div>
              <div className="interruptor">
                <button type="button" className={config.ligado ? '' : 'ativo'} onClick={() => set({ ligado: false })}>Desligado</button>
                <button type="button" className={config.ligado ? 'ativo' : ''} onClick={() => set({ ligado: true })}>Ligado</button>
              </div>
            </div>
          </div>

          {!config.ligado && (
            <div className="aviso" style={{ background: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.3)', color: '#fde047', fontSize: 13 }}>
              <strong>Atenção:</strong> A transmissão está <b>desligada</b>. Clica em <b>Ligado</b> acima para começar a enviar os dados para o overlay/mestre.
            </div>
          )}

          <div className="campo">
            <label>Modo de Conexão</label>
            <div className="interruptor" style={{ width: 'fit-content' }}>
              <button type="button" className={modo === 'p2p' ? 'ativo' : ''} onClick={() => set({ modo: 'p2p' })}>
                P2P / Vercel
              </button>
              <button type="button" className={modo === 'local' ? 'ativo' : ''} onClick={() => set({ modo: 'local' })}>
                Mesmo browser
              </button>
              <button type="button" className={modo === 'remoto' ? 'ativo' : ''} onClick={() => set({ modo: 'remoto' })}>
                Servidor Node
              </button>
            </div>
            <span className="dica">
              {modo === 'p2p' && 'Conexão direta WebRTC (sem servidor). Ideal para Vercel — gera um link direto para o Mestre ou OBS.'}
              {modo === 'local' && 'Só chega a outra janela deste mesmo browser. Serve para testes rápidos na mesma máquina.'}
              {modo === 'remoto' && 'Passa por um servidor Node HTTP (`npm run overlay` ou hospedado no Render/Railway).'}
            </span>
          </div>

          {modo === 'remoto' && (
            <div className="campo">
              <label>Endereço do servidor</label>
              <input type="text" value={config.url} onChange={(e) => set({ url: e.target.value })} placeholder="http://localhost:7777" />
            </div>
          )}

          <div className="campo">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <label style={{ margin: 0 }}>Código da sala</label>
              {modo === 'p2p' && (
                <button type="button" className="btn ghost sm" onClick={gerarNovoCodigo} style={{ padding: '2px 8px', fontSize: 11 }}>
                  Gerar novo código
                </button>
              )}
            </div>
            <input type="text" value={config.codigo} onChange={(e) => set({ codigo: e.target.value.trim() || 'mesa' })} />
            <span className="dica">Código único da tua sessão. Partilha o link gerado abaixo.</span>
          </div>

          <div className="campo">
            <label>Link para o Mestre ou Browser Source do OBS</label>
            <div className="linha-link">
              <input type="text" readOnly value={link} onFocus={(e) => e.target.select()} />
              <button className="btn ghost sm" onClick={copiar}>{copiado ? 'Copiado!' : 'Copiar Link'}</button>
            </div>
            <span className="dica">
              Pode ser aberto no navegador do Mestre ou colado no OBS (1920×1080).
              Adiciona <code>&amp;limpo=1</code> ao link para ocultar diagnósticos.
            </span>
          </div>

          {config.ligado && modo === 'p2p' && (
            <div className="aviso" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#86efac' }}>
              <strong>Status P2P:</strong> {espectadores > 0 ? `🟢 ${espectadores} ${espectadores === 1 ? 'espectador conectado' : 'espectadores conectados'}` : '🟡 Transmissão ligada (à espera de conexões no link)'}
            </div>
          )}

          {estadoEnvio?.erro && (
            <div className="aviso"><strong>Não deu para enviar:</strong> {estadoEnvio.erro}</div>
          )}
          {config.ligado && modo !== 'p2p' && !estadoEnvio?.erro && (
            <div className="dica">Último envio: {estadoEnvio?.quando ? new Date(estadoEnvio.quando).toLocaleTimeString('pt-PT') : '—'}</div>
          )}
        </div>

        <div className="modal-acoes">
          <button className="btn" onClick={aoFechar}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
