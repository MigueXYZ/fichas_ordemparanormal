import React from 'react';

export default function BarraRecurso({ titulo, classe, atual, max, onChange }) {
  const valor = Math.max(0, Math.min(Number(atual ?? max ?? 0), Number(max || 0)));
  const pct = max > 0 ? (valor / max) * 100 : 0;
  const set = (v) => onChange(Math.max(0, Math.min(v, max)));

  return (
    <div className={'barra-recurso ' + classe}>
      <div className="titulo">{titulo}</div>
      <div className="linha-barra">
        <button type="button" className="extremo" onClick={() => set(0)} title="Zerar">«</button>
        <button type="button" onClick={() => set(valor - 1)} title="−1" aria-label="Menos um">−</button>
        <div className="valor">
          <div className="preenchido" style={{ width: pct + '%' }} />
          <span className="texto">{valor} / {max}</span>
        </div>
        <button type="button" onClick={() => set(valor + 1)} title="+1" aria-label="Mais um">+</button>
        <button type="button" className="extremo" onClick={() => set(max)} title="Encher">»</button>
      </div>
    </div>
  );
}
