import React, { useState } from 'react';

export default function BarraRecurso({ titulo, classe, atual, max, onChange, temp = 0, onTemp, maxManual, onMaxManualChange }) {
  const [aEditarTemp, setAEditarTemp] = useState(false);
  const [destravado, setDestravado] = useState(false);
  
  const t = Math.max(0, Number(temp) || 0);
  const valor = Math.max(0, Math.min(Number(atual ?? max ?? 0), Number(max || 0)));
  const pct = max > 0 ? (valor / max) * 100 : 0;

  function tirarUm() {
    if (destravado && onMaxManualChange) {
      const novoMax = Math.max(0, max - 1);
      onMaxManualChange(novoMax);
      // Garante que o valor atual não fica superior ao novo limite
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

  return (
    <div className={'barra-recurso ' + classe}>
      <div className="titulo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>{titulo}</span>
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
                style={{ width: '50px' }}
              />
            ) : (
              <button
                type="button"
                className={'temp-chip' + (t > 0 ? ' ativo' : '')}
                onClick={() => setAEditarTemp(true)}
                title="Pontos temporários"
              >
                {t > 0 ? `+${t} temp` : '+ temp'}
              </button>
            )
          )}
        </div>
        {onMaxManualChange && (
          <button
            type="button"
            onClick={() => setDestravado(!destravado)}
            title={destravado ? "Bloquear limites" : "Desbloquear: os botões + e - alteram o limite máximo"}
            style={{ position: 'absolute', right: 0, background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: destravado ? 1 : 0.5 }}
          >
            {destravado ? '🔓' : '🔒'}
          </button>
        )}
      </div>

      <div className="linha-barra">
        <button type="button" className="extremo" onClick={() => { onChange(0); onTemp?.(0); }} title="Zerar">«</button>
        <button type="button" onClick={tirarUm} title={destravado ? "Reduzir Limite Máximo" : "−1"} aria-label="Menos um">−</button>
        <div className="valor">
          <div className="preenchido" style={{ width: pct + '%' }} />
          {t > 0 && <div className="temporario" style={{ width: Math.min(100, (t / Math.max(1, max)) * 100) + '%' }} />}
          <span className="texto">
            {valor} / <span 
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
    </div>
  );
}