import React, { useState } from 'react';
import { urlDoOverlay } from '../overlay/transporte.js';

/**
 * Definições do overlay para o OBS. O que aqui se escolhe fica guardado no
 * browser; o link é o que se cola na Browser Source do OBS.
 */
export default function PainelOverlay({ config, aoMudar, estadoEnvio, aoFechar }) {
  const [copiado, setCopiado] = useState(false);
  const link = urlDoOverlay(config);
  const set = (patch) => aoMudar({ ...config, ...patch });

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch { /* o utilizador que copie à mão */ }
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-estreito">
        <div className="modal-topo">
          <h3>Overlay para OBS</h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-corpo">
          <div className="regra-opcional">
            <div className="cabeca">
              <div>
                <b>Transmitir</b>
                <div className="resumo">
                  Manda o nome, o token, as barras e as rolagens para o overlay.
                </div>
              </div>
              <div className="interruptor">
                <button type="button" className={config.ligado ? '' : 'ativo'} onClick={() => set({ ligado: false })}>Desligado</button>
                <button type="button" className={config.ligado ? 'ativo' : ''} onClick={() => set({ ligado: true })}>Ligado</button>
              </div>
            </div>
          </div>

          <div className="campo">
            <label>Como é que chega ao overlay</label>
            <div className="interruptor" style={{ width: 'fit-content' }}>
              <button type="button" className={config.modo === 'local' ? 'ativo' : ''} onClick={() => set({ modo: 'local' })}>
                Mesmo browser
              </button>
              <button type="button" className={config.modo === 'remoto' ? 'ativo' : ''} onClick={() => set({ modo: 'remoto' })}>
                Servidor
              </button>
            </div>
            <span className="dica">
              {config.modo === 'local'
                ? 'Só chega a outra janela deste mesmo browser. Serve para experimentar — o OBS não vê.'
                : 'Passa por um servidor. Corre `npm run overlay` no teu PC, ou aloja o mesmo ficheiro (servidor/overlay.mjs) para o mestre ver de outro sítio.'}
            </span>
          </div>

          {config.modo === 'remoto' && (
            <div className="campo">
              <label>Endereço do servidor</label>
              <input type="text" value={config.url} onChange={(e) => set({ url: e.target.value })} placeholder="http://localhost:7777" />
            </div>
          )}

          <div className="campo">
            <label>Código da sala</label>
            <input type="text" value={config.codigo} onChange={(e) => set({ codigo: e.target.value.trim() || 'mesa' })} />
            <span className="dica">Cada jogador com o seu código; o mestre abre um overlay por código.</span>
          </div>

          <div className="campo">
            <label>Link para a Browser Source do OBS</label>
            <div className="linha-link">
              <input type="text" readOnly value={link} onFocus={(e) => e.target.select()} />
              <button className="btn ghost sm" onClick={copiar}>{copiado ? 'Copiado' : 'Copiar'}</button>
            </div>
            <span className="dica">
              No OBS: + → Browser → URL, 1920×1080, e liga «Shutdown source when not visible» desligado.
              Acrescenta <code>&amp;limpo=1</code> ao link para esconder o aviso de "à espera da ficha".
            </span>
          </div>

          {estadoEnvio?.erro && (
            <div className="aviso"><strong>Não deu para enviar:</strong> {estadoEnvio.erro}</div>
          )}
          {config.ligado && !estadoEnvio?.erro && (
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
