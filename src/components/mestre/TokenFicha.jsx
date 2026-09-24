import React, { useEffect, useRef, useState } from 'react';
import { lerToken } from '../../engine/armazenamento.js';

/**
 * Token das fichas de NPC e ameaça — a ilustração inteira, sem recorte nem
 * zoom (os tokens são quase sempre figuras de corpo inteiro com fundo
 * transparente). Clicar abre o ModalTokenFicha quando `editavel`.
 * `vazio` é o que aparece sem imagem (silhueta de pessoa ou "?").
 */
export default function TokenFicha({ imagem, nome, editavel, vazio, aoMudar }) {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <div
        className={'ficha-npc-token-caixa ficha-token' + (editavel ? ' editavel' : '')}
        onClick={editavel ? () => setAberto(true) : undefined}
        onKeyDown={editavel ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAberto(true); } } : undefined}
        role={editavel ? 'button' : undefined}
        tabIndex={editavel ? 0 : undefined}
        title={editavel ? (imagem ? 'Clica para trocar o token' : 'Clica para adicionares o token') : undefined}
      >
        {imagem ? <img className="ficha-token-img" src={imagem} alt={nome || ''} draggable={false} /> : <div className="ficha-npc-token-vazio">{vazio}</div>}
      </div>
      {aberto && (
        <ModalTokenFicha
          imagem={imagem}
          vazio={vazio}
          aoAplicar={(nova) => { aoMudar(nova); setAberto(false); }}
          aoCancelar={() => setAberto(false)}
        />
      )}
    </>
  );
}

/**
 * Escolher o token com pré-visualização do que vai aparecer na ficha: mesma
 * proporção e sem recorte, sobre um xadrez para se ver o que é transparente.
 * "Tirar fundo" apaga um fundo liso branco ou preto (o de um desenho
 * digitalizado, por exemplo); um fundo que já é transparente fica sempre.
 */
export function ModalTokenFicha({ imagem, vazio, aoAplicar, aoCancelar }) {
  const [rascunho, setRascunho] = useState(imagem || null);
  const [ficheiro, setFicheiro] = useState(null);
  const [tirarFundo, setTirarFundo] = useState(true);
  const [aProcessar, setAProcessar] = useState(false);
  const [erro, setErro] = useState(null);
  const [arrastar, setArrastar] = useState(false);
  const input = useRef(null);

  useEffect(() => {
    const aoTeclar = (e) => { if (e.key === 'Escape') aoCancelar(); };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [aoCancelar]);

  async function processar(f, comFundoTirado) {
    if (!f) return;
    if (!f.type.startsWith('image/')) { setErro('Esse ficheiro não é uma imagem.'); return; }
    setErro(null);
    setAProcessar(true);
    try {
      setRascunho(await lerToken(f, 900, { tirarFundo: comFundoTirado }));
      setFicheiro(f);
    } catch (e) {
      setErro(e.message);
    } finally {
      setAProcessar(false);
    }
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoCancelar()}>
      <div className="modal modal-token">
        <div className="modal-topo">
          <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 18 }}>Token</h3>
          <button type="button" className="fechar" onClick={aoCancelar} aria-label="Fechar">×</button>
        </div>

        <div className="modal-corpo modal-token-corpo">
          <div
            className={'modal-token-preview' + (arrastar ? ' a-arrastar' : '')}
            onClick={() => input.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setArrastar(true); }}
            onDragLeave={() => setArrastar(false)}
            onDrop={(e) => { e.preventDefault(); setArrastar(false); processar(e.dataTransfer.files?.[0], tirarFundo); }}
            title="Clica ou arrasta uma imagem"
          >
            {rascunho ? <img src={rascunho} alt="" draggable={false} /> : <div className="ficha-npc-token-vazio">{vazio}</div>}
            {aProcessar && <div className="modal-token-a-processar">A preparar…</div>}
          </div>
          <p className="dica" style={{ fontSize: 11, margin: 0, textAlign: 'center' }}>
            É assim que fica na ficha. O xadrez é a parte transparente.
          </p>

          <label className="modal-token-opcao" title={ficheiro ? '' : 'Escolhe primeiro uma imagem'}>
            <input
              type="checkbox"
              checked={tirarFundo}
              disabled={!ficheiro || aProcessar}
              onChange={(e) => { setTirarFundo(e.target.checked); processar(ficheiro, e.target.checked); }}
            />
            Tirar fundo branco/preto liso
          </label>

          <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { processar(e.target.files?.[0], tirarFundo); e.target.value = ''; }} />
          {erro && <div className="aviso" style={{ fontSize: 12 }}>{erro}</div>}
        </div>

        <div className="modal-acoes" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn ghost sm" onClick={() => input.current?.click()}>{rascunho ? 'Trocar imagem' : 'Escolher imagem'}</button>
            {rascunho && <button type="button" className="btn danger sm" onClick={() => { setRascunho(null); setFicheiro(null); }}>Remover</button>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn ghost sm" onClick={aoCancelar}>Cancelar</button>
            <button type="button" className="btn sm" disabled={aProcessar} onClick={() => aoAplicar(rascunho)}>Aplicar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
