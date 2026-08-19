import React, { useState } from 'react';

/**
 * Barra de um recurso (Vida, Sanidade, Esforço ou Determinação).
 *
 * Os pontos temporários vivem à parte do máximo: aguentam dano antes dos
 * pontos a sério e desaparecem quando acabam. Por isso o `−` come primeiro os
 * temporários, e o `+` só enche até ao máximo normal.
 */
export default function BarraRecurso({ titulo, classe, atual, max, onChange, temp = 0, onTemp }) {
  const [aEditarTemp, setAEditarTemp] = useState(false);
  const t = Math.max(0, Number(temp) || 0);
  const valor = Math.max(0, Math.min(Number(atual ?? max ?? 0), Number(max || 0)));
  const pct = max > 0 ? (valor / max) * 100 : 0;

  const set = (v) => onChange(Math.max(0, Math.min(v, max)));

  function tirarUm() {
    if (t > 0 && onTemp) onTemp(t - 1);   // os temporários levam com o golpe primeiro
    else set(valor - 1);
  }

  return (
    <div className={'barra-recurso ' + classe}>
      <div className="titulo">
        {titulo}
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
            />
          ) : (
            <button
              type="button"
              className={'temp-chip' + (t > 0 ? ' ativo' : '')}
              onClick={() => setAEditarTemp(true)}
              title="Pontos temporários — aguentam o dano antes dos pontos normais"
            >
              {t > 0 ? `+${t} temp` : '+ temp'}
            </button>
          )
        )}
      </div>
      <div className="linha-barra">
        <button type="button" className="extremo" onClick={() => { set(0); onTemp?.(0); }} title="Zerar">«</button>
        <button type="button" onClick={tirarUm} title="−1" aria-label="Menos um">−</button>
        <div className="valor">
          <div className="preenchido" style={{ width: pct + '%' }} />
          {t > 0 && <div className="temporario" style={{ width: Math.min(100, (t / Math.max(1, max)) * 100) + '%' }} />}
          <span className="texto">{valor} / {max}{t > 0 ? ` +${t}` : ''}</span>
        </div>
        <button type="button" onClick={() => set(valor + 1)} title="+1" aria-label="Mais um">+</button>
        <button type="button" className="extremo" onClick={() => set(max)} title="Encher">»</button>
      </div>
    </div>
  );
}
