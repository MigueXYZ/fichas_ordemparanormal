import React, { useEffect, useMemo, useState } from 'react';

/**
 * Painel de escolha reutilizável: procura + filtros + lista de resultados.
 * `filtros` = [{ id, label, opcoes: [{valor, label}], valorDe, filtrar, tipo: 'select' | 'toggle' }]
 */
export default function Seletor({ titulo, itens, filtros = [], render, onEscolher, onFechar, aoProcurar }) {
  const [busca, setBusca] = useState('');

  const getEstadoInicial = () => {
    const init = {};
    for (const f of filtros) {
      if (f.padrao !== undefined) init[f.id] = f.padrao;
    }
    return init;
  };

  const [estado, setEstado] = useState(getEstadoInicial);
  const [limite, setLimite] = useState(50);

  // Reiniciar paginação sempre que a procura ou filtros mudarem
  useEffect(() => {
    setLimite(50);
  }, [busca, estado]);

  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return itens.filter((i) => {
      for (const f of filtros) {
        const v = estado[f.id];
        if (typeof f.filtrar === 'function') {
          if (!f.filtrar(i, v, estado)) return false;
        } else {
          if (!v) continue;
          if (typeof f.valorDe === 'function') {
            const valItem = f.valorDe(i);
            if (valItem === null || valItem === undefined) return false;
            if (String(valItem).toLowerCase() !== String(v).toLowerCase()) return false;
          }
        }
      }
      return !t || (aoProcurar ? aoProcurar(i, t) : i.nome.toLowerCase().includes(t));
    });
  }, [busca, estado, itens, filtros, aoProcurar]);

  const temFiltrosAtivos = useMemo(() => {
    if (busca.trim() !== '') return true;
    for (const f of filtros) {
      const v = estado[f.id];
      const def = f.padrao !== undefined ? f.padrao : (f.tipo === 'toggle' ? false : '');
      if (v !== undefined && v !== def && v !== '') return true;
    }
    return false;
  }, [busca, estado, filtros]);

  function limparFiltros() {
    setBusca('');
    setEstado(getEstadoInicial());
  }

  const toggles = useMemo(() => filtros.filter((f) => f.tipo === 'toggle'), [filtros]);
  const selects = useMemo(() => filtros.filter((f) => f.tipo !== 'toggle'), [filtros]);

  return (
    <div className="seletor" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Topo: Título + Badge de Contagem + Botão Limpar + Fechar */}
      <div className="seletor-topo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <strong>{titulo}</strong>
          <span
            style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 12,
              background: 'var(--bg-3)',
              color: 'var(--txt-dim)',
              border: '1px solid var(--linha)',
              fontFamily: 'var(--corpo)',
              letterSpacing: '0.02em',
            }}
            title="Resultados encontrados"
          >
            {lista.length < itens.length ? `${lista.length} de ${itens.length}` : `${itens.length} ${itens.length === 1 ? 'item' : 'itens'}`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {temFiltrosAtivos && (
            <button
              type="button"
              className="btn ghost sm"
              onClick={limparFiltros}
              style={{ fontSize: 11.5, padding: '3px 8px', height: 26 }}
              title="Limpar todos os filtros e procura"
            >
              Limpar filtros
            </button>
          )}
          {onFechar && (
            <button
              type="button"
              className="fechar"
              onClick={onFechar}
              aria-label="Fechar catálogo"
              style={{ background: 'none', border: 'none', color: 'var(--txt-dim)', cursor: 'pointer', fontSize: 18, padding: 4, lineHeight: 1 }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Barra de Procura */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Procurar…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            paddingLeft: 32,
            paddingRight: busca ? 30 : 10,
            height: 34,
            fontSize: 13,
            background: 'var(--bg-3)',
            border: '1px solid var(--linha)',
            borderRadius: 'var(--raio)',
            color: 'var(--txt)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.5,
            fontSize: 13,
            pointerEvents: 'none',
          }}
        >
          🔍
        </span>
        {busca && (
          <button
            type="button"
            onClick={() => setBusca('')}
            aria-label="Limpar procura"
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--txt-dim)',
              cursor: 'pointer',
              fontSize: 13,
              padding: 4,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Toggles / Filtros rápidos em linha */}
      {toggles.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {toggles.map((f) => {
            const ativo = Boolean(estado[f.id]);
            return (
              <button
                key={f.id}
                type="button"
                className={'btn sm ' + (ativo ? '' : 'ghost')}
                onClick={() => setEstado({ ...estado, [f.id]: !ativo })}
                style={{
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 'var(--raio)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  borderColor: ativo ? 'var(--sangue-claro)' : 'var(--linha)',
                  background: ativo ? 'rgba(var(--sangue-rgb), 0.22)' : 'var(--bg-3)',
                  color: ativo ? '#fff' : 'var(--txt-dim)',
                  fontWeight: ativo ? 600 : 400,
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  height: 28,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: ativo ? 'var(--sangue-claro)' : 'transparent',
                    border: ativo ? 'none' : '1px solid var(--txt-fraco)',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                {f.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Dropdowns em grelha responsiva equilibrada */}
      {selects.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
            gap: 8,
          }}
        >
          {selects.map((f) => {
            const valor = estado[f.id] || '';
            const temValor = Boolean(valor);
            return (
              <select
                key={f.id}
                value={valor}
                onChange={(e) => setEstado({ ...estado, [f.id]: e.target.value })}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  fontSize: 12,
                  height: 32,
                  padding: '0 8px',
                  borderRadius: 'var(--raio)',
                  background: temValor ? 'rgba(var(--sangue-rgb), 0.12)' : 'var(--bg-3)',
                  border: temValor ? '1px solid var(--sangue-claro)' : '1px solid var(--linha)',
                  color: temValor ? '#fff' : 'var(--txt-dim)',
                  cursor: 'pointer',
                }}
              >
                <option value="">{f.label}</option>
                {(f.opcoes || []).map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.label}
                  </option>
                ))}
              </select>
            );
          })}
        </div>
      )}

      {/* Lista de Resultados */}
      <div className="seletor-lista" style={{ marginTop: 4 }}>
        {lista.slice(0, limite).map((i) => (
          <div
            key={i.chave || i.id}
            role="button"
            tabIndex={0}
            className="seletor-item"
            onClick={() => onEscolher(i)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
                e.preventDefault();
                onEscolher(i);
              }
            }}
          >
            {render(i)}
          </div>
        ))}
        {lista.length === 0 && <div className="painel-vazio" style={{ padding: 24 }}>Sem resultados</div>}

        {/* Botão de Ver Mais para catálogo extenso */}
        {lista.length > limite && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'center',
              alignItems: 'center',
              padding: '12px 0',
              marginTop: 4,
              borderTop: '1px solid var(--linha)',
            }}
          >
            <button
              type="button"
              className="btn sm"
              onClick={() => setLimite((l) => l + 50)}
              style={{ minWidth: 160 }}
            >
              ▾ Ver mais (+50) · A mostrar {Math.min(limite, lista.length)} de {lista.length}
            </button>
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => setLimite(lista.length)}
            >
              Mostrar todos ({lista.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
