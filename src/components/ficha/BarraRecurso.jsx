import React, { useState, useRef, useEffect } from 'react';

/** Campo numérico que também aceita o scroll do rato para +1/−1. */
function InputNumeroScroll({ value, onChange, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 1 : -1;
      const atual = Number(el.value) || 0;
      onChange(atual + delta);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [onChange]);

  return (
    <input
      ref={ref}
      type="number"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      {...props}
    />
  );
}

export default function BarraRecurso({ titulo, classe, atual, max, onChange, temp = 0, onTemp, extra = 0, onExtraChange }) {
  const [destravado, setDestravado] = useState(false);
  const [modal, setModal] = useState(null); // null | 'valor' | 'excedente' | 'buff'
  const [abaBuff, setAbaBuff] = useState('perm'); // 'perm' | 'temp'
  const [rascunho, setRascunho] = useState(0);
  const [rascunhoExtra, setRascunhoExtra] = useState(0);
  const [rascunhoTemp, setRascunhoTemp] = useState(0);
  const [excedente, setExcedente] = useState(0);

  const t = Math.max(0, Number(temp) || 0);
  const ex = Number(extra) || 0;
  const valor = Math.max(0, Math.min(Number(atual ?? max ?? 0), Number(max || 0)));
  const pct = max > 0 ? (valor / max) * 100 : 0;

  // O máximo em si (max, vindo de fora) É SEMPRE automático — Vigor/Presença,
  // Trilha do Monstruoso, NEX, etc. "Destrancar" aqui não substitui isso por
  // um valor preso; só soma/subtrai um bónus fixo (extra) por cima, que
  // continua a acompanhar o automático para sempre (item, talento, maldição).
  function tirarUm() {
    if (destravado && onExtraChange) {
      onExtraChange(ex - 1);
    } else {
      if (t > 0 && onTemp) onTemp(t - 1);
      else onChange(Math.max(0, valor - 1));
    }
  }

  function adicionarUm() {
    if (destravado && onExtraChange) {
      onExtraChange(ex + 1);
      onChange(valor + 1);
    } else {
      onChange(Math.max(0, Math.min(valor + 1, max)));
    }
  }

  function abrirModalBuff(aba = 'perm') {
    setRascunhoExtra(ex);
    setRascunhoTemp(t);
    setAbaBuff(aba);
    setModal('buff');
  }

  function confirmarBuffPerm() {
    const novoEx = Math.trunc(Number(rascunhoExtra) || 0);
    const delta = novoEx - ex;
    if (onExtraChange) {
      onExtraChange(novoEx);
    }
    if (delta > 0) {
      onChange(Math.max(0, valor + delta));
    } else if (valor > (max + delta)) {
      onChange(Math.max(0, max + delta));
    }
    setModal(null);
  }

  function confirmarTemp() {
    const novoT = Math.max(0, Math.trunc(Number(rascunhoTemp) || 0));
    if (onTemp) {
      onTemp(novoT);
    }
    setModal(null);
  }

  /**
   * Escreve o valor ATUAL à mão, num popup do estilo da ficha.
   * Se o número passar do máximo, pergunta-se com botões
   * se os pontos a mais devem ser aplicados como buff permanente ao máximo,
   * temporários ou descartados.
   */
  function abrirEditorValor() {
    setRascunho(valor);
    setModal('valor');
  }

  function confirmarValor() {
    const n = Math.max(0, Number(rascunho) || 0);
    if (n > max) {
      setExcedente(n - max);
      setModal('excedente');
    } else {
      onChange(n);
      setModal(null);
    }
  }

  function resolverExcedente(opcao) {
    if (opcao === 'permanente') {
      if (onExtraChange) {
        onExtraChange(ex + excedente);
      }
      onChange(rascunho);
    } else if (opcao === 'temp') {
      onChange(max);
      if (onTemp) onTemp(t + excedente);
    } else {
      onChange(max);
    }
    setModal(null);
  }

  return (
    <div className={'barra-recurso ' + classe}>
      {/* Grelha de 3 colunas: o lado esquerdo equilibra o botão da direita, garantindo que o título fica 100% centrado com a barra */}
      <div className="titulo" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', position: 'relative', marginBottom: '2px' }}>
        
        {/* Lado esquerdo (vazio ou com o botão de destrancar se houver) */}
        <div style={{ justifySelf: 'start' }}>
          {onExtraChange && (
            <button
              type="button"
              onClick={() => setDestravado(!destravado)}
              title={destravado ? "Fechar ajuste do máximo (destravado)" : "Ajustar o máximo à mão (+/-)"}
              style={{
                display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer',
                fontSize: '11px', lineHeight: 1, padding: '3px 6px', borderRadius: 4,
                background: destravado ? 'var(--sangue)' : 'rgba(255,255,255,.07)',
                border: '1px solid ' + (destravado ? 'var(--sangue)' : 'var(--linha-forte)'),
                color: destravado ? '#fff' : 'var(--txt-dim)',
              }}
            >
              {destravado ? '✓' : '±'}
            </button>
          )}
        </div>

        {/* Centro: Título perfeitamente centrado */}
        <span style={{ fontWeight: 'bold', letterSpacing: '1px', textAlign: 'center' }}>{titulo}</span>
        
        {/* Lado direito: Chips para Buff Permanente e Pontos Temporários */}
        <div
          style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {onExtraChange && (
            <button
              type="button"
              className={'temp-chip' + (ex !== 0 ? ' ativo' : '')}
              style={ex !== 0 ? {
                borderColor: 'rgba(239, 68, 68, 0.6)',
                color: '#f87171',
                background: 'rgba(239, 68, 68, 0.12)',
                opacity: 1,
              } : undefined}
              onClick={() => abrirModalBuff('perm')}
              onDoubleClick={() => onExtraChange && onExtraChange(0)}
              title={ex !== 0 ? `Buff permanente: ${ex > 0 ? `+${ex}` : ex} · Clica para abrir modal · Duplo clique para zerar` : "Adicionar buff permanente ao máximo"}
            >
              {ex !== 0 ? `${ex > 0 ? `+${ex}` : ex} buff` : '+ buff'}
            </button>
          )}

          {onTemp && (
            <button
              type="button"
              className={'temp-chip' + (t > 0 ? ' ativo' : '')}
              onClick={() => abrirModalBuff('temp')}
              onDoubleClick={() => onTemp && onTemp(0)}
              title={t > 0 ? `Pontos temporários: +${t} · Clica para abrir modal · Duplo clique para zerar` : "Pontos temporários"}
            >
              {t > 0 ? `+${t} temp` : '+ temp'}
            </button>
          )}
        </div>

      </div>

      <div className="linha-barra">
        <button type="button" className="extremo" onClick={() => { onChange(0); onTemp?.(0); }} title="Zerar">«</button>
        <button type="button" onClick={tirarUm} title={destravado ? "Reduzir bónus fixo ao máximo" : "−1"} aria-label="Menos um">−</button>
        <div className="valor">
          <div className="preenchido" style={{ width: pct + '%' }} />
          {t > 0 && <div className="temporario" style={{ width: Math.min(100, (t / Math.max(1, max)) * 100) + '%' }} />}
          <span className="texto">
            <span
              onClick={abrirEditorValor}
              style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
              title="Clica para escrever o valor atual à mão"
            >
              {valor}
            </span> / <span
              onClick={() => onExtraChange && abrirModalBuff('perm')}
              style={{
                cursor: onExtraChange ? 'pointer' : 'default',
                textDecoration: onExtraChange ? 'underline dotted' : 'none',
              }}
              title={onExtraChange ? 'Clica para ajustar o máximo permanente ou aplicar buff' : ''}
            >
              {max}
            </span>
            {ex !== 0 && (
              <span
                style={{ color: '#f87171', fontSize: '10px', cursor: onExtraChange ? 'pointer' : 'default' }}
                onClick={() => onExtraChange && abrirModalBuff('perm')}
                title={`Máximo automático com um bónus permanente de ${ex > 0 ? '+' : ''}${ex} por cima · Clica para ajustar`}
              >
                {' '}({ex > 0 ? '+' : ''}{ex})
              </span>
            )}
            {t > 0 ? ` +${t}` : ''}
          </span>
        </div>
        <button type="button" onClick={adicionarUm} title={destravado ? "Aumentar bónus fixo ao máximo" : "+1"} aria-label="Mais um">+</button>
        <button type="button" className="extremo" onClick={() => onChange(max)} title="Encher">»</button>
      </div>

      {modal === 'valor' && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: 360, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>{titulo} — valor atual</h3>
              <button type="button" className="fechar" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 20 }}>
                Escreve o valor atual (o scroll do rato também soma/tira 1).
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 22 }}>
                <button type="button" className="btn ghost sm" onClick={() => setRascunho((v) => Math.max(0, (Number(v) || 0) - 1))}>−</button>
                <InputNumeroScroll
                  value={rascunho}
                  onChange={(v) => setRascunho(Math.max(0, Number(v) || 0))}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && confirmarValor()}
                  style={{ width: 80, textAlign: 'center', fontSize: 22, fontFamily: 'var(--numeros)' }}
                />
                <button type="button" className="btn ghost sm" onClick={() => setRascunho((v) => (Number(v) || 0) + 1)}>+</button>
              </div>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button type="button" className="btn ghost" onClick={() => setModal(null)}>Cancelar</button>
                <button type="button" className="btn" style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)' }} onClick={confirmarValor}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'excedente' && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: 440, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Passa do máximo</h3>
              <button type="button" className="fechar" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 22 }}>
                {rascunho} ultrapassa o máximo de {titulo} ({max}) por <strong>+{excedente}</strong>. Como queres aplicar este excedente?
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button type="button" className="btn ghost" onClick={() => setModal('valor')}>Voltar</button>
                <button type="button" className="btn ghost" onClick={() => resolverExcedente('descartar')}>Descartar</button>
                {onTemp && (
                  <button type="button" className="btn ghost" onClick={() => resolverExcedente('temp')}>
                    +{excedente} Temporário
                  </button>
                )}
                {onExtraChange && (
                  <button
                    type="button"
                    className="btn"
                    style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)', fontWeight: 'bold' }}
                    onClick={() => resolverExcedente('permanente')}
                    title="Aumenta o máximo e o valor atual permanentemente"
                  >
                    +{excedente} Permanente
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'buff' && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: 420, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>{titulo} — Ajustar Buff / Recursos</h3>
              <button type="button" className="fechar" onClick={() => setModal(null)}>×</button>
            </div>

            <div className="modal-corpo">
              {onExtraChange && onTemp && (
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 18 }}>
                  <button
                    type="button"
                    className={`btn sm ${abaBuff === 'perm' ? '' : 'ghost'}`}
                    style={abaBuff === 'perm' ? { borderColor: 'var(--sangue)', background: 'var(--sangue)' } : undefined}
                    onClick={() => setAbaBuff('perm')}
                  >
                    Buff Permanente {ex !== 0 ? `(${ex > 0 ? `+${ex}` : ex})` : ''}
                  </button>
                  <button
                    type="button"
                    className={`btn sm ${abaBuff === 'temp' ? '' : 'ghost'}`}
                    style={abaBuff === 'temp' ? { borderColor: 'var(--sangue)', background: 'var(--sangue)' } : undefined}
                    onClick={() => setAbaBuff('temp')}
                  >
                    Pontos Temporários {t > 0 ? `(+${t})` : ''}
                  </button>
                </div>
              )}

              {abaBuff === 'perm' && onExtraChange && (
                <div>
                  <p style={{ color: 'var(--txt-dim)', fontSize: 13.5, marginBottom: 14 }}>
                    Ajusta o bónus permanente somado ao máximo de {titulo} (talentos, itens, bênçãos ou maldições).
                  </p>

                  <div style={{ fontSize: 13, color: 'var(--txt-fraco)', marginBottom: 16 }}>
                    Cálculo base: <b>{max - ex}</b> · Máximo resultante: <b style={{ color: 'var(--txt)' }}>{(max - ex) + (Number(rascunhoExtra) || 0)}</b>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
                    <button type="button" className="btn ghost sm" onClick={() => setRascunhoExtra((v) => (Number(v) || 0) - 1)}>−1</button>
                    <div style={{ position: 'relative' }}>
                      <InputNumeroScroll
                        value={rascunhoExtra}
                        onChange={(v) => setRascunhoExtra(v === null ? 0 : Number(v) || 0)}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && confirmarBuffPerm()}
                        style={{ width: 90, textAlign: 'center', fontSize: 22, fontFamily: 'var(--numeros)' }}
                      />
                    </div>
                    <button type="button" className="btn ghost sm" onClick={() => setRascunhoExtra((v) => (Number(v) || 0) + 1)}>+1</button>
                  </div>

                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                    <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => setRascunhoExtra((v) => (Number(v) || 0) + 2)}>+2</button>
                    <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => setRascunhoExtra((v) => (Number(v) || 0) + 5)}>+5</button>
                    <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => setRascunhoExtra((v) => (Number(v) || 0) + 10)}>+10</button>
                    <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => setRascunhoExtra(0)}>Zerar (+0)</button>
                  </div>

                  <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                    <button type="button" className="btn ghost" onClick={() => setModal(null)}>Cancelar</button>
                    <button
                      type="button"
                      className="btn"
                      style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)' }}
                      onClick={confirmarBuffPerm}
                    >
                      Aplicar Buff Permanente
                    </button>
                  </div>
                </div>
              )}

              {abaBuff === 'temp' && onTemp && (
                <div>
                  <p style={{ color: 'var(--txt-dim)', fontSize: 13.5, marginBottom: 14 }}>
                    Pontos temporários absorvem dano antes da vida normal e duram até ao final da cena.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
                    <button type="button" className="btn ghost sm" onClick={() => setRascunhoTemp((v) => Math.max(0, (Number(v) || 0) - 1))}>−1</button>
                    <InputNumeroScroll
                      value={rascunhoTemp}
                      onChange={(v) => setRascunhoTemp(Math.max(0, Number(v) || 0))}
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && confirmarTemp()}
                      style={{ width: 90, textAlign: 'center', fontSize: 22, fontFamily: 'var(--numeros)' }}
                    />
                    <button type="button" className="btn ghost sm" onClick={() => setRascunhoTemp((v) => (Number(v) || 0) + 1)}>+1</button>
                  </div>

                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                    <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => setRascunhoTemp((v) => (Number(v) || 0) + 5)}>+5</button>
                    <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => setRascunhoTemp((v) => (Number(v) || 0) + 10)}>+10</button>
                    <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => setRascunhoTemp((v) => (Number(v) || 0) + 15)}>+15</button>
                    <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => setRascunhoTemp((v) => (Number(v) || 0) + 30)}>+30</button>
                    <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => setRascunhoTemp(0)}>Zerar</button>
                  </div>

                  <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                    <button type="button" className="btn ghost" onClick={() => setModal(null)}>Cancelar</button>
                    <button
                      type="button"
                      className="btn"
                      style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)' }}
                      onClick={confirmarTemp}
                    >
                      Aplicar Temporários
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}