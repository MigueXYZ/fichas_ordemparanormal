import React from 'react';

/** Barra de recurso (PV/SAN/PE) dos cartões, do painel e da lista de iniciativa. */
export function BarraRecurso({ rotulo, r, classe, fina }) {
  if (!r) return null;
  const max = Math.max(1, Number(r.max) || 1);
  const atual = Math.max(0, Number(r.atual) || 0);
  const pct = Math.min(100, Math.round((atual / max) * 100));
  return (
    <span className={`cb-barra-rec ${classe}${fina ? ' fina' : ''}`}>
      {!fina && (
        <span className="cb-barra-rec-topo">
          <span>{rotulo}</span>
          <span>{atual}/{r.max}{r.temp ? <em> +{r.temp}</em> : null}</span>
        </span>
      )}
      <span className="cb-barra-rec-trilho"><span style={{ width: `${pct}%` }} /></span>
    </span>
  );
}

/** Caído (0 PV) ou machucado (metade dos PV ou menos — o "Machucado" das fichas de ameaça). */
export function estadoVida(c) {
  const atual = Number(c?.pv?.atual) || 0;
  const max = Number(c?.pv?.max) || 1;
  if (atual <= 0) return 'caido';
  if (atual <= max / 2) return 'machucado';
  return '';
}
