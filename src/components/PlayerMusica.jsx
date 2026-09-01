import React, { useEffect, useState } from 'react';
import { muralSync } from '../lib/services/muralSync.ts';
import { IconeMusica, IconePlay, IconePause, IconeSom } from './Icones.jsx';

function formatarTempo(segundos) {
  if (isNaN(segundos) || segundos < 0) return '00:00';
  const mins = Math.floor(segundos / 60);
  const secs = Math.floor(segundos % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function PlayerMusica() {
  const [conectado, setConectado] = useState(muralSync.isConnected);
  const [audioState, setAudioState] = useState(muralSync.audioState);
  const [minimizado, setMinimizado] = useState(false);
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    const unsubStatus = muralSync.onStatusChange(setConectado);
    const unsubAudio = muralSync.onAudioChange((novo) => {
      setAudioState(novo);
      if (novo.isPlaying) {
        setOculto(false);
      }
    });
    return () => {
      unsubStatus();
      unsubAudio();
    };
  }, []);

  // Se não estiver conectado ou não houver música transmitida e estiver oculto
  if (!conectado || oculto) {
    return null;
  }

  // Se não houver título, url ou reprodução ativa
  if (!audioState.title && !audioState.url && !audioState.isPlaying) {
    return null;
  }

  const progresso = audioState.duration > 0
    ? (audioState.currentTime / audioState.duration) * 100
    : 0;

  return (
    <div className={`mural-player-container ${minimizado ? 'minimizado' : ''}`}>
      {/* Banner de desbloqueio de áudio (Autoplay policy) */}
      {audioState.autoplayBlocked && (
        <div
          className="mural-player-aviso-autoplay"
          onClick={() => muralSync.togglePlay()}
          title="O navegador pausou o áudio automático. Clica para desbloquear e ouvir a música do Mestre!"
        >
          <span>🔊</span>
          <b>Mestre a transmitir áudio! Clica para ouvir</b>
        </div>
      )}

      <div className="mural-player-card">
        {/* Cabeçalho / Título da Música */}
        <div className="mural-player-topo">
          <div className="mural-player-info">
            <div className="mural-player-icone-onda">
              <IconeMusica size={16} className={audioState.isPlaying ? 'a-tocar' : ''} />
              {audioState.isPlaying && (
                <span className="equalizador-barras">
                  <span className="b1" />
                  <span className="b2" />
                  <span className="b3" />
                </span>
              )}
            </div>
            <div className="mural-player-texto">
              <span className="mural-player-tag">MURAL AUDIO SYNC</span>
              <span className="mural-player-titulo" title={audioState.title || 'Música da Sessão'}>
                {audioState.title || 'Música da Sessão'}
              </span>
            </div>
          </div>

          <div className="mural-player-acoes-topo">
            <button
              type="button"
              className="btn-icone-player"
              onClick={() => setMinimizado(!minimizado)}
              title={minimizado ? 'Expandir Player' : 'Minimizar Player'}
            >
              {minimizado ? '▲' : '▼'}
            </button>
            <button
              type="button"
              className="btn-icone-player"
              onClick={() => setOculto(true)}
              title="Fechar player de música"
            >
              ✕
            </button>
          </div>
        </div>

        {!minimizado && (
          <>
            {/* Barra de Progresso / Tempo */}
            <div className="mural-player-barra-tempo">
              <div
                className="mural-player-progresso-fundo"
                onClick={(e) => {
                  if (!audioState.duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const pct = Math.max(0, Math.min(1, clickX / rect.width));
                  muralSync.seek(pct * audioState.duration);
                }}
              >
                <div
                  className="mural-player-progresso-preenchido"
                  style={{ width: `${progresso}%` }}
                />
              </div>
              <div className="mural-player-tempos">
                <span>{formatarTempo(audioState.currentTime)}</span>
                <span>{formatarTempo(audioState.duration)}</span>
              </div>
            </div>

            {/* Controlos de Reprodução e Volume */}
            <div className="mural-player-controlos">
              <button
                type="button"
                className="btn-player-play"
                onClick={() => muralSync.togglePlay()}
                title={audioState.isPlaying ? 'Pausar Áudio' : 'Reproduzir Áudio'}
              >
                {audioState.isPlaying ? <IconePause size={18} /> : <IconePlay size={18} />}
              </button>

              {/* Controlo de Volume */}
              <div className="mural-player-volume">
                <button
                  type="button"
                  className="btn-icone-player"
                  onClick={() => muralSync.toggleMute()}
                  title={audioState.isMuted ? 'Ativar Som' : 'Silenciar'}
                >
                  <IconeSom mudo={audioState.isMuted || audioState.volume === 0} size={16} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioState.isMuted ? 0 : audioState.volume}
                  onChange={(e) => muralSync.setVolume(parseFloat(e.target.value))}
                  className="mural-player-slider-volume"
                  title={`Volume: ${Math.round((audioState.isMuted ? 0 : audioState.volume) * 100)}%`}
                />
                <span className="mural-player-volume-valor">
                  {Math.round((audioState.isMuted ? 0 : audioState.volume) * 100)}%
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
