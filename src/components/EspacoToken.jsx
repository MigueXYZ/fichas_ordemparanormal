import React, { useState } from 'react';
import { lerToken } from '../engine/armazenamento.js';

/**
 * Espaço do token, na margem esquerda.
 *
 * Sem token, fica lá o modelo — o contorno da figura, muito esbatido — só para
 * se perceber que é ali que o agente vai. Com token, mostra-se a imagem e mais
 * nada: sem pedestal, sem holofotes.
 */
export default function EspacoToken({ token, aoMudarToken }) {
  const [erro, setErro] = useState(null);

  async function escolher(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErro(null);
    try {
      aoMudarToken(await lerToken(f));
    } catch (err) {
      setErro(err.message);
    }
    e.target.value = '';
  }

  return (
    <div className={'espaco-token' + (token ? ' com-token' : '')}>
      {token ? (
        <>
          <img className="token-img" src={token} alt="Token do agente" />
          <div className="acoes-token">
            <label className="acao-token" title="Trocar o token">
              <span>+</span>
              <input type="file" accept="image/*,image/gif" onChange={escolher} />
            </label>
            <button type="button" className="acao-token" title="Tirar o token" onClick={() => aoMudarToken(null)}>
              ✕
            </button>
          </div>
        </>
      ) : (
        <label className="modelo" title="Carregar o token do agente">
          <span className="figura" aria-hidden="true" />
          <span className="dica-token">Token do agente</span>
          <input type="file" accept="image/*,image/gif" onChange={escolher} />
        </label>
      )}

      {erro && <div className="erro-token">{erro}</div>}
    </div>
  );
}
