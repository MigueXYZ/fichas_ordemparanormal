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

export default function BarraRecurso({ titulo, classe, atual, max, onChange, temp = 0, onTemp, maxManual, onMaxManualChange }) {
  const [aEditarTemp, setAEditarTemp] = useState(false);
  const [destravado, setDestravado] = useState(false);
  const [modal, setModal] = useState(null); // null | 'valor' | 'excedente'
  const [rascunho, setRascunho] = useState(0);
  const [excedente, setExcedente] = useState(0);

  const t = Math.max(0, Number(temp) || 0);
  const valor = Math.max(0, Math.min(Number(atual ?? max ?? 0), Number(max || 0)));
  const pct = max > 0 ? (valor / max) * 100 : 0;

  function tirarUm() {
    if (destravado && onMaxManualChange) {
      const novoMax = Math.max(0, max - 1);
      onMaxManualChange(novoMax);
      if (valor > novoMax) {
        onChange(novoMax);
      }
    } else {
      if (t > 0 && onTemp) onTemp(t - 1);
      else onChange(Math.max(0, valor - 1));
    }
  }

  function adicionarUm() {
    if (destravado && onMaxManualChange) {
      onMaxManualChange(max + 1);
    } else {
      onChange(Math.max(0, Math.min(valor + 1, max)));
    }
  }

  function editarMaximo() {
    if (!destravado || !onMaxManualChange) return;
    const res = window.prompt(`Novo limite para ${titulo} (deixa vazio para repor o valor automático):`, max);
    if (res === null) return;
    if (res.trim() === '') {
      onMaxManualChange(null);
    } else {
      const novoMax = Math.max(0, Number(res) || 0);
      onMaxManualChange(novoMax);
      if (valor > novoMax) {
        onChange(novoMax);
      }
    }
  }

  /**
   * Escreve o valor ATUAL à mão, num popup do estilo da ficha (não o feio
   * por omissão do browser). Se o número passar do máximo, pergunta-se —
   * com botões, não um alerta — se os pontos a mais devem virar temporários
   * ou ficar esquecidos (descartados).
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

  function resolverExcedente(transferir) {
    onChange(max);
    if (transferir && onTemp) onTemp(t + excedente);
    setModal(null);
  }

  return (
    <div className={'barra-recurso ' + classe}>
      {/* Grelha de 3 colunas: o lado esquerdo equilibra o botão da direita, garantindo que o título fica 100% centrado com a barra */}
      <div className="titulo" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', position: 'relative', marginBottom: '2px' }}>
        
        {/* Lado esquerdo (vazio ou com o botão de destrancar se houver) */}
        <div style={{ justifySelf: 'start' }}>
          {onMaxManualChange && (
            <button
              type="button"
              onClick={() => setDestravado(!destravado)}
              title={destravado ? "Bloquear limites" : "Desbloquear limites"}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', opacity: destravado ? 1 : 0.5, padding: 0 }}
            >
              {destravado ? '🔓' : '🔒'}
            </button>
          )}
        </div>

        {/* Centro: Título perfeitamente centrado */}
        <span style={{ fontWeight: 'bold', letterSpacing: '1px', textAlign: 'center' }}>{titulo}</span>
        
        {/* Lado direito: Chip de temp alinhado horizontalmente na mesma linha */}
        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {onTemp && (
            aEditarTemp ? (
              <input
                className="temp-campo"
                type="number"
                autoFocus
                value={t}
                onChange={(e) => onTemp(Math.max(0, Number(e.target.value) || 0))}
                onBlur={() => setAEditarTemp(false)}
                onKeyDown={(e) => e.key === 'Enter' && setAEditarTemp(false)}
                title="Pontos temporários"
                style={{ width: '45px', textAlign: 'center', fontSize: '10px' }}
              />
            ) : (
              <button
                type="button"
                className={'temp-chip' + (t > 0 ? ' ativo' : '')}
                onClick={() => setAEditarTemp(true)}
                title="Pontos temporários"
                style={{ fontSize: '10px', padding: '1px 4px' }}
              >
                {t > 0 ? `+${t} temp` : '+ temp'}
              </button>
            )
          )}
        </div>

      </div>

      <div className="linha-barra">
        <button type="button" className="extremo" onClick={() => { onChange(0); onTemp?.(0); }} title="Zerar">«</button>
        <button type="button" onClick={tirarUm} title={destravado ? "Reduzir Limite Máximo" : "−1"} aria-label="Menos um">−</button>
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
              onClick={editarMaximo}
              style={{ cursor: destravado ? 'pointer' : 'default', textDecoration: destravado ? 'underline dotted' : 'none' }}
              title={destravado ? "Clica para editar manualmente ou repor o automático" : ""}
            >
              {max}
            </span> {t > 0 ? ` +${t}` : ''}
          </span>
        </div>
        <button type="button" onClick={adicionarUm} title={destravado ? "Aumentar Limite Máximo" : "+1"} aria-label="Mais um">+</button>
        <button type="button" className="extremo" onClick={() => onChange(max)} title="Encher">»</button>
      </div>

      {modal === 'valor' && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: 360, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>{titulo} — valor atual</h3>
              <button className="fechar" onClick={() => setModal(null)}>×</button>
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
                <button className="btn ghost" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn" style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)' }} onClick={confirmarValor}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'excedente' && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Passa do máximo</h3>
              <button className="fechar" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 22 }}>
                {rascunho} ultrapassa o máximo de {titulo} ({max}). Queres transferir os <strong>{excedente}</strong> pontos a mais para temporário, ou esquecê-los?
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn ghost" onClick={() => setModal('valor')}>Voltar</button>
                <button className="btn ghost" onClick={() => resolverExcedente(false)}>Não, esquecer</button>
                <button className="btn" style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)' }} onClick={() => resolverExcedente(true)}>Sim, transferir</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}