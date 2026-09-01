import React, { useState, useEffect } from 'react';
import { muralSync } from '../lib/services/muralSync.ts';
import { calcMaximos } from '../engine/calc.js';
import { IconeMural, IconeSom, IconePlay, IconePause } from './Icones.jsx';

export default function PainelMural({ personagem, aoFechar }) {
  const [codigoSala, setCodigoSala] = useState(() => {
    return muralSync.roomCode || localStorage.getItem('mural_room_code') || '';
  });
  const [conectado, setConectado] = useState(muralSync.isConnected);
  const [conectando, setConectando] = useState(muralSync.isConnecting);
  const [erro, setErro] = useState(muralSync.lastError);
  const [audioState, setAudioState] = useState(muralSync.audioState);

  useEffect(() => {
    const unsubStatus = muralSync.onStatusChange((status) => {
      setConectado(status);
      setConectando(muralSync.isConnecting);
      setErro(muralSync.lastError);
    });
    const unsubAudio = muralSync.onAudioChange(setAudioState);
    return () => {
      unsubStatus();
      unsubAudio();
    };
  }, []);

  function handleConectar(e) {
    e?.preventDefault();
    if (!codigoSala.trim()) return;

    localStorage.setItem('mural_room_code', codigoSala.trim().toUpperCase());
    const max = personagem ? calcMaximos(personagem) : { pv: 0, san: 0, pe: 0 };
    const charData = personagem ? {
      ...personagem,
      pvMax: max.pv,
      sanMax: max.san,
      peMax: max.pe,
    } : {};

    muralSync.connect(codigoSala, charData);
    setConectando(true);
    setErro(null);
  }

  function handleDesconectar() {
    try {
      localStorage.removeItem('mural_room_code');
    } catch {}
    muralSync.disconnect();
    setCodigoSala('');
    setConectado(false);
    setConectando(false);
    setErro(null);
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-estreito">
        <div className="modal-topo">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconeMural size={20} style={{ color: 'var(--sangue-claro)' }} />
            Conectar ao Mural
          </h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-corpo">
          <div className="resumo" style={{ marginBottom: 16 }}>
            Sincroniza automaticamente a tua ficha (PV, Sanidade, PE e Atributos), rolagens de dados e áudio com a mesa do Mestre em tempo real.
          </div>

          <form onSubmit={handleConectar} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="campo">
              <label>Código da Sala do Mural (Host ID)</label>
              <input
                type="text"
                placeholder="ex: ORD-9482"
                value={codigoSala}
                disabled={conectado || conectando}
                onChange={(e) => setCodigoSala(e.target.value.toUpperCase())}
                style={{ textTransform: 'uppercase', letterSpacing: 1 }}
              />
              <span className="dica">
                Pede o código ao Mestre da mesa (visível no painel do Mural).
              </span>
            </div>

            {conectado ? (
              <div className="aviso" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#86efac' }}>
                <strong>🟢 Conectado ao Mural!</strong>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  Sala: <b>{muralSync.roomCode}</b>. As tuas rolagens, status e áudio estão sincronizados com o Mestre.
                </div>
              </div>
            ) : conectando ? (
              <div className="aviso" style={{ background: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.3)', color: '#fde047' }}>
                <strong>🟡 A conectar à sala {muralSync.roomCode || codigoSala}...</strong>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  Aguardando resposta do Mestre via WebRTC.
                </div>
              </div>
            ) : erro ? (
              <div className="aviso" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
                <strong>Erro na conexão:</strong> {erro}
              </div>
            ) : (
              <div className="aviso" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--txt-dim)' }}>
                Status: 🔴 Desconectado
              </div>
            )}

            {/* Secção de Áudio Sincronizado */}
            {conectado && (
              <div style={{ borderTop: '1px solid var(--linha)', paddingTop: 12, marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <b style={{ fontSize: 13, color: 'var(--txt-dim)' }}>ÁUDIO & MÚSICA DO MESTRE</b>
                  <span style={{ fontSize: 12, color: audioState.isPlaying ? 'var(--ok)' : 'var(--txt-dim)' }}>
                    {audioState.isPlaying ? '▶ A tocar' : '⏸ Em pausa'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-3)', padding: '8px 12px', borderRadius: 4 }}>
                  <button
                    type="button"
                    className="btn ghost sm"
                    onClick={() => muralSync.togglePlay()}
                    style={{ minWidth: 32, padding: '4px 8px' }}
                    title={audioState.isPlaying ? 'Pausar' : 'Tocar'}
                  >
                    {audioState.isPlaying ? <IconePause size={14} /> : <IconePlay size={14} />}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {audioState.title || 'Nenhuma música a transmitir'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      className="btn ghost sm"
                      onClick={() => muralSync.toggleMute()}
                      style={{ padding: '2px 6px', fontSize: 12 }}
                      title="Silenciar / Ativar som"
                    >
                      <IconeSom mudo={audioState.isMuted || audioState.volume === 0} size={14} />
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={audioState.isMuted ? 0 : audioState.volume}
                      onChange={(e) => muralSync.setVolume(parseFloat(e.target.value))}
                      style={{ width: 80, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 11, color: 'var(--txt-dim)', minWidth: 28, textAlign: 'right' }}>
                      {Math.round((audioState.isMuted ? 0 : audioState.volume) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              {conectado || conectando ? (
                <button
                  type="button"
                  className="btn ghost"
                  style={{ width: '100%', borderColor: 'var(--vermelho-suave, #f87171)', color: 'var(--vermelho-suave, #f87171)' }}
                  onClick={handleDesconectar}
                >
                  Desconectar
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn"
                  style={{ width: '100%' }}
                  disabled={!codigoSala.trim()}
                >
                  Conectar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="modal-acoes" style={{ marginTop: 20 }}>
          <button className="btn ghost" onClick={aoFechar} style={{ width: '100%' }}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
