import React, { useState } from 'react';
import { IconeLixo } from '../Icones.jsx';

export default function WidgetContainer({
  id,
  titulo,
  modoEdicao,
  custom = false,
  dadosCustom = null,
  estaArrastando = false,
  onArrastoInicio,
  onArrastoFim,
  onDropSobre,
  aoMudarCustom,
  aoEditarCustom,
  aoEliminarCustom,
  aoOcultar,
  aoMoverCima,
  aoMoverBaixo,
  aoMoverEsquerda,
  aoMoverDireita,
  podeMoverCima,
  podeMoverBaixo,
  podeMoverEsquerda,
  podeMoverDireita,
  children,
}) {
  const [posicaoDrag, setPosicaoDrag] = useState(null); // 'antes' | 'depois' | null

  return (
    <div
      className={
        'widget-container' +
        (modoEdicao ? ' modo-edicao-ativo' : '') +
        (posicaoDrag ? ` drag-sobre drag-sobre-${posicaoDrag}` : '') +
        (estaArrastando ? ' esta-arrastando' : '')
      }
      draggable={modoEdicao}
      onDragStart={(e) => {
        if (!modoEdicao) return;
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
        onArrastoInicio?.(id);
      }}
      onDragEnd={() => {
        setPosicaoDrag(null);
        onArrastoFim?.();
      }}
      onDragOver={(e) => {
        if (!modoEdicao) return;
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        const rect = e.currentTarget.getBoundingClientRect();
        const isTopo = (e.clientY - rect.top) < (rect.height / 2);
        setPosicaoDrag(isTopo ? 'antes' : 'depois');
      }}
      onDragLeave={(e) => {
        if (!modoEdicao) return;
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setPosicaoDrag(null);
        }
      }}
      onDrop={(e) => {
        if (!modoEdicao) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const isTopo = (e.clientY - rect.top) < (rect.height / 2);
        const pos = isTopo ? 'antes' : 'depois';
        setPosicaoDrag(null);
        onArrastoFim?.();
        const srcId = e.dataTransfer.getData('text/plain') || null;
        if (srcId && srcId !== id) {
          onDropSobre?.(srcId, id, pos);
        }
      }}
    >
      {modoEdicao && (
        <div className="widget-header-edicao">
          <span className="widget-titulo-edicao" title="Arrasta este bloco para qualquer coluna ou posição">
            <span className="icone-grip-arrasto" aria-hidden="true">⠿</span>
            {dadosCustom?.cor && (
              <span className="ponto-cor-widget" style={{ background: dadosCustom.cor }} />
            )}
            {titulo}
          </span>
          <div className="widget-acoes-edicao" onMouseDown={(e) => e.stopPropagation()}>
            {podeMoverEsquerda && (
              <button
                type="button"
                className="btn-widget-pos"
                onClick={aoMoverEsquerda}
                title="Mover para a coluna da esquerda"
              >
                ◀
              </button>
            )}
            {podeMoverCima && (
              <button
                type="button"
                className="btn-widget-pos"
                onClick={aoMoverCima}
                title="Mover para cima"
              >
                ▲
              </button>
            )}
            {podeMoverBaixo && (
              <button
                type="button"
                className="btn-widget-pos"
                onClick={aoMoverBaixo}
                title="Mover para baixo"
              >
                ▼
              </button>
            )}
            {podeMoverDireita && (
              <button
                type="button"
                className="btn-widget-pos"
                onClick={aoMoverDireita}
                title="Mover para a coluna da direita"
              >
                ▶
              </button>
            )}
            {custom && aoEditarCustom && (
              <button
                type="button"
                className="btn-widget-pos"
                onClick={aoEditarCustom}
                title="Editar este widget"
              >
                ✎
              </button>
            )}
            <button
              type="button"
              className="btn-widget-pos"
              onClick={aoOcultar}
              title="Ocultar este widget"
            >
              👁️
            </button>
            {custom && aoEliminarCustom && (
              <button
                type="button"
                className="btn-widget-pos danger"
                onClick={aoEliminarCustom}
                title="Eliminar este widget"
              >
                <IconeLixo size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Renderização de Widgets Customizados */}
      {custom && dadosCustom ? (
        <div
          className="widget-custom-corpo"
          style={{
            borderLeft: `3px solid ${dadosCustom.cor || 'var(--sangue)'}`,
          }}
        >
          <div className="widget-custom-titulo-barra">
            <b style={{ color: dadosCustom.cor || 'var(--txt)' }}>{dadosCustom.titulo}</b>
            {dadosCustom.tipo === 'contador' && (
              <span style={{ fontSize: 13, color: 'var(--txt-dim)' }}>
                {dadosCustom.unidade ? `(${dadosCustom.unidade})` : ''}
              </span>
            )}
          </div>

          {/* TIPO 1: CONTADOR */}
          {dadosCustom.tipo === 'contador' && (
            <div className="widget-custom-contador">
              <div className="contador-display">
                <span className="contador-valor">{dadosCustom.atual}</span>
                {dadosCustom.max !== null && dadosCustom.max !== undefined && (
                  <span className="contador-max">/ {dadosCustom.max}</span>
                )}
              </div>
              <div className="contador-botoes">
                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => {
                    const passo = dadosCustom.passo || 1;
                    const novo = Math.max(0, dadosCustom.atual - passo);
                    aoMudarCustom({ ...dadosCustom, atual: novo });
                  }}
                  title={`Subtrair ${dadosCustom.passo || 1}`}
                >
                  −{dadosCustom.passo > 1 ? dadosCustom.passo : ''}
                </button>
                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => {
                    const passo = dadosCustom.passo || 1;
                    const novo = dadosCustom.max !== null && dadosCustom.max !== undefined
                      ? Math.min(dadosCustom.max, dadosCustom.atual + passo)
                      : dadosCustom.atual + passo;
                    aoMudarCustom({ ...dadosCustom, atual: novo });
                  }}
                  title={`Somar ${dadosCustom.passo || 1}`}
                >
                  +{dadosCustom.passo > 1 ? dadosCustom.passo : ''}
                </button>
                {dadosCustom.max !== null && dadosCustom.max !== undefined && (
                  <button
                    type="button"
                    className="btn ghost sm"
                    style={{ fontSize: 11, padding: '3px 6px' }}
                    onClick={() => aoMudarCustom({ ...dadosCustom, atual: dadosCustom.max })}
                    title="Recarregar ao máximo"
                  >
                    Max
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TIPO 2: NOTA */}
          {dadosCustom.tipo === 'nota' && (
            <div className="widget-custom-nota">
              <textarea
                value={dadosCustom.conteudo || ''}
                placeholder="Escreve aqui as tuas anotações..."
                rows={4}
                onChange={(e) => aoMudarCustom({ ...dadosCustom, conteudo: e.target.value })}
              />
            </div>
          )}

          {/* TIPO 3: CHECKLIST */}
          {dadosCustom.tipo === 'checklist' && (
            <div className="widget-custom-checklist">
              {(!dadosCustom.itens || dadosCustom.itens.length === 0) ? (
                <div style={{ fontSize: 13, color: 'var(--txt-dim)', fontStyle: 'italic' }}>
                  Nenhum item na lista.
                </div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dadosCustom.itens.map((it, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                      <input
                        type="checkbox"
                        checked={it.feito || false}
                        onChange={(e) => {
                          const novosItens = dadosCustom.itens.map((item, i) =>
                            i === idx ? { ...item, feito: e.target.checked } : item
                          );
                          aoMudarCustom({ ...dadosCustom, itens: novosItens });
                        }}
                        style={{ cursor: 'pointer', width: 16, height: 16 }}
                      />
                      <span style={{ textDecoration: it.feito ? 'line-through' : 'none', opacity: it.feito ? 0.6 : 1 }}>
                        {it.texto}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
