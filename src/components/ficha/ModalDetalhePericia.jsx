import React, { useEffect } from 'react';
import { PERICIAS_TEXTO } from '../../data/periciasTexto.js';
import { ATRIBUTOS } from '../../data/atributos.js';
import { GRAUS_TREINO } from '../../data/pericias.js';
import { rolarTeste, quantidadeDados } from '../../engine/dados.js';
import IconeD20 from '../IconeD20.jsx';

export default function ModalDetalhePericia({ pericia, personagem, onRolar, onFechar }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onFechar();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFechar]);

  if (!pericia) return null;

  const textoInfo = PERICIAS_TEXTO[pericia.id] || {};
  const attrPadraoObj = ATRIBUTOS.find((a) => a.id === pericia.attrPadrao);
  const grauObj = GRAUS_TREINO.find((g) => g.id === pericia.grau);

  const usosBase = Array.isArray(textoInfo.usos) ? textoInfo.usos : [];
  const suplementos = Array.isArray(textoInfo.suplementos) ? textoInfo.suplementos : [];

  const temSuplementos = suplementos.length > 0;
  const temUsosBase = usosBase.length > 0;

  function executarRolagem() {
    if (!onRolar) return;
    const comBonus = Boolean(personagem?.monstruosoBancoPendente);
    onRolar(
      rolarTeste({
        nome: pericia.nome,
        dados: comBonus ? Number(pericia.dados) + 1 : pericia.dados,
        bonus: pericia.bonus,
        dadosExtra: pericia.dadosExtra,
      })
    );
    if (onFechar) onFechar();
  }

  const qtdD20 = quantidadeDados(Number(pericia.dados) || 0);
  const bonusStr = Number(pericia.bonus) >= 0 ? `+${pericia.bonus}` : `${pericia.bonus}`;

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal" style={{ maxWidth: 640, maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        {/* Topo do Modal */}
        <div className="modal-topo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--display, inherit)', fontSize: 20 }}>
                {pericia.nome}
              </h3>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--sangue-claro, #ff5555)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {attrPadraoObj ? `${attrPadraoObj.nome} (${attrPadraoObj.sigla})` : pericia.attrPadrao}
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--txt-suave, #ccc)',
                }}
              >
                Treino: {grauObj?.nome || 'Destreinado'} ({bonusStr})
              </span>
              {pericia.treinada && (
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#f59e0b',
                    fontWeight: 600,
                  }}
                  title="Esta perícia não pode ser usada sem treino prévio"
                >
                  * Somente Treinada
                </span>
              )}
              {pericia.carga && (
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa',
                    fontWeight: 600,
                  }}
                  title="Esta perícia sofre penalidade pelo excesso de carga de itens transportados"
                >
                  + Penalidade de Carga
                </span>
              )}
            </div>
            {textoInfo.resumo && (
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--txt-dim, #a1a1aa)', fontStyle: 'italic' }}>
                {textoInfo.resumo}
              </p>
            )}
          </div>
          <button type="button" className="fechar" onClick={onFechar} aria-label="Fechar"></button>
        </div>

        {/* Corpo Scrollável */}
        <div className="modal-corpo" style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          {/* Caixa de destaque se houver */}
          {textoInfo.box && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 6,
                background: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid rgba(234, 179, 8, 0.25)',
                color: '#fef08a',
                fontSize: 12.5,
                lineHeight: 1.5,
              }}
            >
              {typeof textoInfo.box === 'string' ? (
                textoInfo.box
              ) : (
                <>
                  {textoInfo.box.titulo && (
                    <div style={{ fontWeight: 700, marginBottom: 4, color: '#fef08a' }}>
                      {textoInfo.box.titulo}
                    </div>
                  )}
                  <div style={{ whiteSpace: 'pre-line' }}>{textoInfo.box.texto}</div>
                </>
              )}
            </div>
          )}

          {/* Seção Livro Base */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--txt-dim, #71717a)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 8,
                borderBottom: '1px solid var(--borda, rgba(255, 255, 255, 0.08))',
                paddingBottom: 4,
              }}
            >
              Livro de Regras (Livro Base)
            </div>

            {temUsosBase ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {usosBase.map((u, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--borda, rgba(255, 255, 255, 0.06))',
                      borderRadius: 6,
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 13.5, color: '#e4e4e7' }}>{u.nome}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {u.treino && (
                          <span
                            style={{
                              fontSize: 11,
                              padding: '1px 6px',
                              borderRadius: 4,
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                            }}
                          >
                            {u.treino}
                          </span>
                        )}
                        {u.dt && (
                          <span
                            style={{
                              fontSize: 11,
                              padding: '1px 6px',
                              borderRadius: 4,
                              background: 'rgba(59, 130, 246, 0.15)',
                              color: '#93c5fd',
                              fontWeight: 600,
                            }}
                          >
                            DT {u.dt}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.5, color: '#d4d4d8', whiteSpace: 'pre-line' }}>
                      {u.texto}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--borda, rgba(255, 255, 255, 0.06))',
                  borderRadius: 6,
                  padding: '10px 12px',
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: '#d4d4d8',
                  whiteSpace: 'pre-line',
                }}
              >
                {textoInfo.texto || 'Sem descrição específica.'}
              </div>
            )}
          </div>

          {/* Seção Suplementos (Sobrevivendo ao Horror e Arquivos Secretos) */}
          {temSuplementos && (
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--sangue-claro, #ff5555)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 8,
                  borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
                  paddingBottom: 4,
                }}
              >
                 Novos Usos & Suplementos Oficiais
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {suplementos.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(239, 68, 68, 0.04)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: 6,
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 3,
                            background: s.fonte === 'Arquivos Secretos' ? '#7c3aed' : '#b91c1c',
                            color: '#fff',
                            textTransform: 'uppercase',
                          }}
                        >
                          {s.fonte}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: 13.5, color: '#fca5a5' }}>{s.nome}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {s.treino && (
                          <span
                            style={{
                              fontSize: 11,
                              padding: '1px 6px',
                              borderRadius: 4,
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#fca5a5',
                            }}
                          >
                            {s.treino}
                          </span>
                        )}
                        {s.dt && (
                          <span
                            style={{
                              fontSize: 11,
                              padding: '1px 6px',
                              borderRadius: 4,
                              background: 'rgba(59, 130, 246, 0.15)',
                              color: '#93c5fd',
                              fontWeight: 600,
                            }}
                          >
                            DT {s.dt}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.5, color: '#e4e4e7', whiteSpace: 'pre-line' }}>
                      {s.texto}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Ações */}
        <div className="modal-acoes" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 20px', borderTop: '1px solid var(--borda, #333)' }}>
          <div style={{ fontSize: 12, color: 'var(--txt-dim, #71717a)' }}>
            Fórmula na ficha: <strong>{qtdD20}d20 {bonusStr}</strong>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn ghost sm" onClick={onFechar}>
              Fechar
            </button>
            {onRolar && (
              <button
                type="button"
                className="btn sm"
                onClick={executarRolagem}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <IconeD20 style={{ width: 14, height: 14 }} />
                <span>Rolar {pericia.nome}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
