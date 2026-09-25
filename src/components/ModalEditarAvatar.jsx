import React, { useEffect, useRef, useState } from 'react';
import AvatarAjustavel from './AvatarAjustavel.jsx';
import { lerImagem } from '../engine/armazenamento.js';

/**
 * Editor de avatar em modal — arrastar para enquadrar + slider de zoom por
 * baixo, tal como um editor de foto de perfil vulgar. Abre com o que já
 * estava guardado (ou vazio, se ainda não há avatar nenhum) e só grava algo
 * quando se carrega em "Aplicar"; "Cancelar" ou fechar não mexe em nada.
 *
 * Só para avatares — nunca para tokens.
 */
export default function ModalEditarAvatar({ imagem, posX = 50, posY = 50, zoom = 1, aoAplicar, aoCancelar }) {
  const [draftImagem, setDraftImagem] = useState(imagem || null);
  const [draftX, setDraftX] = useState(posX);
  const [draftY, setDraftY] = useState(posY);
  const [draftZoom, setDraftZoom] = useState(zoom);
  const [erro, setErro] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape') aoCancelar();
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [aoCancelar]);

  async function escolherFicheiro(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErro(null);
    try {
      setDraftImagem(await lerImagem(f));
      setDraftX(50);
      setDraftY(50);
      setDraftZoom(1);
    } catch (err) {
      setErro(err.message);
    }
    e.target.value = '';
  }

  function resetar() {
    setDraftX(50);
    setDraftY(50);
    setDraftZoom(1);
  }

  function remover() {
    setDraftImagem(null);
    setDraftX(50);
    setDraftY(50);
    setDraftZoom(1);
  }

  function aplicar() {
    aoAplicar({ imagem: draftImagem, imagemPosX: draftX, imagemPosY: draftY, imagemZoom: draftZoom });
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoCancelar()}>
      <div className="modal modal-avatar">
        <div className="modal-topo">
          <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 18 }}>Ajustar Avatar</h3>
          <button type="button" className="fechar" onClick={aoCancelar} aria-label="Fechar">×</button>
        </div>

        <div className="modal-corpo modal-avatar-corpo">
          <AvatarAjustavel
            className="modal-avatar-preview"
            imagem={draftImagem}
            posX={draftX}
            posY={draftY}
            zoom={draftZoom}
            editavel={Boolean(draftImagem)}
            onMudarAjuste={(patch) => {
              if (patch.imagemPosX != null) setDraftX(patch.imagemPosX);
              if (patch.imagemPosY != null) setDraftY(patch.imagemPosY);
            }}
          >
            <button type="button" className="btn sm" onClick={() => fileRef.current?.click()}>Escolher imagem</button>
          </AvatarAjustavel>

          {draftImagem && (
            <div className="modal-avatar-controlos">
              <button type="button" className="btn ghost sm" onClick={() => fileRef.current?.click()}>Trocar imagem</button>
              <input
                type="range"
                className="avatar-zoom-slider"
                min={1}
                max={3}
                step={0.05}
                value={draftZoom}
                onChange={(e) => setDraftZoom(Number(e.target.value))}
                title="Zoom"
              />
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/*,image/gif" style={{ display: 'none' }} onChange={escolherFicheiro} />

          {erro && <div className="aviso" style={{ fontSize: 12 }}>{erro}</div>}
          {draftImagem && <div className="dica" style={{ fontSize: 11 }}>Arrasta a imagem para ajustar o enquadramento.</div>}
        </div>

        <div className="modal-acoes" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {draftImagem && <button type="button" className="btn ghost sm" onClick={resetar}>Reset</button>}
            {draftImagem && <button type="button" className="btn danger sm" onClick={remover}>Remover avatar</button>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn ghost sm" onClick={aoCancelar}>Cancelar</button>
            <button type="button" className="btn sm" onClick={aplicar}>Aplicar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
