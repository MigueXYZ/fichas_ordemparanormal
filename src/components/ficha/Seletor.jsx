import React, { useMemo, useState } from 'react';

/**
 * Painel de escolha reutilizável: procura + filtros + lista de resultados.
 * `filtros` = [{ id, label, opcoes: [{valor, label}] }]
 */
export default function Seletor({ titulo, itens, filtros = [], render, onEscolher, onFechar, aoProcurar }) {
  const [busca, setBusca] = useState('');
  const [estado, setEstado] = useState({});

  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return itens.filter((i) => {
      for (const f of filtros) {
        const v = estado[f.id];
        if (v && String(f.valorDe(i)) !== String(v)) return false;
      }
      return !t || (aoProcurar ? aoProcurar(i, t) : i.nome.toLowerCase().includes(t));
    });
  }, [busca, estado, itens, filtros, aoProcurar]);

  return (
    <div className="seletor">
      <div className="seletor-topo">
        <strong>{titulo}</strong>
        <button className="btn ghost sm" onClick={onFechar}>Fechar</button>
      </div>
      <div className="filtros">
        <input type="text" placeholder="Procurar…" value={busca} onChange={(e) => setBusca(e.target.value)} style={{ maxWidth: 260 }} />
        {filtros.map((f) => (
          <select key={f.id} value={estado[f.id] || ''} onChange={(e) => setEstado({ ...estado, [f.id]: e.target.value })} style={{ maxWidth: 190 }}>
            <option value="">{f.label}</option>
            {f.opcoes.map((o) => <option key={o.valor} value={o.valor}>{o.label}</option>)}
          </select>
        ))}
        <span className="contador">{lista.length}</span>
      </div>
      <div className="seletor-lista">
        {lista.slice(0, 200).map((i) => (
          <button key={i.chave || i.id} type="button" className="seletor-item" onClick={() => onEscolher(i)}>
            {render(i)}
          </button>
        ))}
        {lista.length === 0 && <div className="painel-vazio" style={{ padding: 24 }}>Sem resultados</div>}
        {lista.length > 200 && <div className="rodape-pericias">A mostrar os primeiros 200 de {lista.length}. Refina a procura.</div>}
      </div>
    </div>
  );
}
