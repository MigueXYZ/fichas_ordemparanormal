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