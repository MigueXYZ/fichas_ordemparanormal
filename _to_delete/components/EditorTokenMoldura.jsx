import React, { useEffect, useRef, useState } from 'react';
import { lerImagem } from '../engine/armazenamento.js';
import {
  ELEMENTOS_MOLDURA,
  posicaoImagem,
  deslocarOffset,
  limitarEixo,
  gerarTokenComMoldura,
} from '../engine/tokenMoldura.js';

const TAMANHO_CAIXA = 280;

/**
 * Editor de Tokens com Molduras Paranormais — recorta uma imagem num círculo
 * e aplica uma moldura ritual de um dos 5 elementos, para exportar um token
 * pronto para o overlay. `fontes` é a lista de imagens de onde se pode
 * partir (normalmente a arte do personagem e/ou o token atual); pode vir
 * vazia — o editor mostra sempre um botão para carregar uma imagem nova.
 * Não aceita animações (GIF): essas continuam a usar o "trocar" simples,
 * fora deste editor, para não perderem o movimento.
 */
export default function EditorTokenMoldura({ fontes, fonteInicialId, aoAplicar, aoFechar }) {
  const [fontesLocais, setFontesLocais] = useState(fontes);
  const [fonteId, setFonteId] = useState(fonteInicialId || fontes[0]?.id || null);
  const fonte = fontesLocais.find((f) => f.id === fonteId) || null;

  const [natural, setNatural] = useState(null); // { largura, altura }
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0.5);
  const [offsetY, setOffsetY] = useState(0.5);
  const [elemento, setElemento] = useState(ELEMENTOS_MOLDURA[0].id);
  const [previa, setPrevia] = useState(null);
  const [aGerar, setAGerar] = useState(false);
  const [aAplicar, setAAplicar] = useState(false);
  const [aCarregar, setACarregar] = useState(false);
  const [erro, setErro] = useState(null);

  const arrastoRef = useRef(null); // { x, y } do último ponto do pointer
  const caixaRef = useRef(null);
  const atrasoPrevia = useRef(null);

  async function aoCarregarFicheiro(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (/gif|apng/i.test(f.type)) {
      setErro('GIFs animados não passam por este editor — usa o "trocar" simples, para não perder o movimento.');
      return;
    }
    setErro(null);
    setACarregar(true);
    try {
      const src = await lerImagem(f, 1600);
      const nova = { id: 'novo', nome: f.name || 'Imagem carregada', src };
      setFontesLocais((atual) => [...atual.filter((x) => x.id !== 'novo'), nova]);
      setFonteId('novo');
    } catch (err) {
      setErro(err.message || 'Não foi possível ler a imagem.');
    } finally {
      setACarregar(false);
    }
  }

  // muda de fonte (ou a app abriu com outra imagem): recomeça o enquadramento
  useEffect(() => {
    setNatural(null);
    setZoom(1);
    setOffsetX(0.5);
    setOffsetY(0.5);
    setErro(null);
  }, [fonteId]);

  function aoCarregarImagem(e) {
    setNatural({ largura: e.target.naturalWidth, altura: e.target.naturalHeight });
  }

  // pré-visualização final (com moldura) — só recalcula pouco depois da
  // última alteração, para não gerar um canvas a cada pixel de arrasto
  useEffect(() => {
    if (!natural || !fonte?.src) return undefined;
    clearTimeout(atrasoPrevia.current);
    setAGerar(true);
    atrasoPrevia.current = setTimeout(() => {
      gerarTokenComMoldura({ src: fonte.src, zoom, offsetX, offsetY, elemento, lado: 300 })
        .then((url) => setPrevia(url))
        .catch(() => {})
        .finally(() => setAGerar(false));
    }, 180);
    return () => clearTimeout(atrasoPrevia.current);
  }, [natural, fonte?.src, zoom, offsetX, offsetY, elemento]);

  function aoMudarZoom(novoZoom) {
    setZoom(novoZoom);
    if (!natural) return;
    setOffsetX((x) => limitarEixo(x, natural.largura, natural.altura, novoZoom, 'x'));
    setOffsetY((y) => limitarEixo(y, natural.largura, natural.altura, novoZoom, 'y'));
  }

  function aoIniciarArrasto(e) {
    if (!natural) return;
    caixaRef.current?.setPointerCapture?.(e.pointerId);
    arrastoRef.current = { x: e.clientX, y: e.clientY };
  }

  function aoMoverArrasto(e) {
    if (!arrastoRef.current || !natural) return;
    const dx = e.clientX - arrastoRef.current.x;
    const dy = e.clientY - arrastoRef.current.y;
    arrastoRef.current = { x: e.clientX, y: e.clientY };
    const novo = deslocarOffset(offsetX, offsetY, dx, dy, TAMANHO_CAIXA, natural.largura, natural.altura, zoom);
    setOffsetX(novo.offsetX);
    setOffsetY(novo.offsetY);
  }

  function aoLargarArrasto() {
    arrastoRef.current = null;
  }

  const pos = natural
    ? posicaoImagem(TAMANHO_CAIXA, natural.largura, natural.altura, zoom, offsetX, offsetY)
    : null;

  async function confirmar() {
    if (!fonte?.src) return;
    setAAplicar(true);
    setErro(null);
    try {
      const dataUrl = await gerarTokenComMoldura({ src: fonte.src, zoom, offsetX, offsetY, elemento, lado: 900 });
      aoAplicar(dataUrl);
    } catch (e) {
      setErro(e.message || 'Não foi possível gerar o token.');
    } finally {
      setAAplicar(false);
    }
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-estreito editor-moldura">
        <div className="modal-topo">
          <h3>Token com Moldura Paranormal</h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-corpo">
          <div className="editor-moldura-fontes">
            {fontesLocais.map((f) => (
              <button
                type="button"
                key={f.id}
                className={'editor-moldura-fonte-btn' + (f.id === fonteId ? ' ativa' : '')}
                onClick={() => setFonteId(f.id)}
              >
                {f.nome}
              </button>
            ))}
            <label className="editor-moldura-fonte-btn editor-moldura-fonte-upload">
              {aCarregar ? 'A ler…' : '+ Carregar imagem'}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={aoCarregarFicheiro} disabled={aCarregar} />
            </label>
          </div>

          {fonte ? (
            <div className="editor-moldura-corpo">
              <div className="editor-moldura-coluna">
                <div
                  ref={caixaRef}
                  className="editor-moldura-crop"
                  style={{ width: TAMANHO_CAIXA, height: TAMANHO_CAIXA }}
                  onPointerDown={aoIniciarArrasto}
                  onPointerMove={aoMoverArrasto}
                  onPointerUp={aoLargarArrasto}
                  onPointerCancel={aoLargarArrasto}
                >
                  <img
                    src={fonte.src}
                    alt=""
                    onLoad={aoCarregarImagem}
                    draggable={false}
                    style={pos ? {
                      position: 'absolute', left: pos.esquerda, top: pos.topo,
                      width: pos.largura, height: pos.altura, maxWidth: 'none',
                    } : { opacity: 0 }}
                  />
                </div>
                <p className="dica editor-moldura-dica">Arrasta para posicionar · roda o zoom abaixo</p>
                <input
                  type="range" min="1" max="3" step="0.01" value={zoom}
                  onChange={(e) => aoMudarZoom(Number(e.target.value))}
                  className="editor-moldura-zoom"
                  aria-label="Zoom"
                />
              </div>

              <div className="editor-moldura-coluna">
                <div className="editor-moldura-preview-caixa">
                  {previa ? (
                    <img src={previa} alt="Pré-visualização do token" className={'editor-moldura-preview' + (aGerar ? ' a-gerar' : '')} />
                  ) : (
                    <div className="editor-moldura-preview editor-moldura-preview-vazia" />
                  )}
                </div>
                <div className="editor-moldura-elementos">
                  {ELEMENTOS_MOLDURA.map((el) => (
                    <button
                      type="button"
                      key={el.id}
                      className={'editor-moldura-elemento' + (el.id === elemento ? ' ativo' : '')}
                      style={{ '--cor-elemento': el.cor }}
                      onClick={() => setElemento(el.id)}
                      title={el.nome}
                    >
                      {el.nome}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="dica editor-moldura-dica-vazia">Carrega uma imagem para começar (usa "+ Carregar imagem" acima).</p>
          )}

          {erro && <div className="aviso" style={{ marginTop: 10 }}>{erro}</div>}
        </div>

        <div className="modal-acoes">
          <button className="btn ghost" onClick={aoFechar}>Cancelar</button>
          <button className="btn" onClick={confirmar} disabled={!natural || aAplicar}>
            {aAplicar ? 'A gerar…' : 'Aplicar ao Token'}
          </button>
        </div>
      </div>
    </div>
  );
}
