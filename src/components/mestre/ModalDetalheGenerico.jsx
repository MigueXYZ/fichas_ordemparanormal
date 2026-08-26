import React, { useEffect } from 'react';

export default function ModalDetalheGenerico({ item, aoFechar }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') aoFechar();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aoFechar]);

  if (!item) return null;

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal" style={{ maxWidth: 520, display: 'flex', flexDirection: 'column' }}>
        <div className="modal-topo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 20 }}>
                {item.nome}
              </h3>
              {item.tipo && (
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--txt-dim)',
                    border: '1px solid var(--borda)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {item.tipo}
                </span>
              )}
            </div>

            {item.subtitulo && (
              <div style={{ fontSize: 12, color: 'var(--txt-fraco)', marginTop: 2 }}>
                {item.subtitulo}
              </div>
            )}
          </div>

          <button className="fechar" onClick={aoFechar} aria-label="Fechar">×</button>
        </div>

        <div className="modal-corpo" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Metadados / Detalhes em Tags */}
          {item.tags && item.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {item.tags.map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: 12,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--borda)',
                    color: 'var(--txt)',
                  }}
                >
                  {t.rotulo ? <b style={{ color: 'var(--txt-dim)' }}>{t.rotulo}: </b> : null}
                  {t.valor}
                </span>
              ))}
            </div>
          )}

          {/* Descrição Principal */}
          {item.descricao && (
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--txt)', whiteSpace: 'pre-line' }}>
              {item.descricao}
            </div>
          )}

          {/* Seção Adicional / Efeitos Mecânicos */}
          {item.extra && (
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '10px 12px',
                borderRadius: 4,
                borderLeft: '3px solid var(--sangue-claro)',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {item.extra}
            </div>
          )}
        </div>

        <div className="modal-acoes" style={{ padding: '12px 20px', borderTop: '1px solid var(--borda)', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn" onClick={aoFechar}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
