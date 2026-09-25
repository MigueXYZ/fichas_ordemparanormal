import React from 'react';
import tokenPlaceholder from '../../../assets/token-placeholder.png';
import { BarraRecurso, estadoVida } from './pecas.jsx';

/**
 * Ordem de iniciativa (maior primeiro, empates pela Agilidade — ver
 * engine/combateTracker.js). Quem está na vez fica marcado; quem está a 0 PV
 * aparece riscado. O valor escreve-se à mão ou rola-se (teste de Iniciativa
 * da ficha: tantos d20 quanto a AGI, fica o maior, + bónus).
 */
export default function ListaIniciativa({ combatentes, equipas, turnoIndex, onAbrir, onRolar, onRolarTodas, onRolarEmFalta, onDefinir }) {
  const corDe = (eqId) => equipas.find((e) => e.id === eqId)?.cor || 'var(--linha-forte)';
  const emFalta = combatentes.filter((c) => c.iniciativa == null).length;
  return (
    <section className="cb-painel-lateral">
      <header className="cb-painel-lateral-topo">
        <h4>Iniciativa</h4>
        <div className="cb-painel-lateral-acoes">
          {emFalta > 0 && <button type="button" className="btn sm" onClick={onRolarEmFalta} title="Rola só para quem ainda não tem iniciativa">🎲 Em falta ({emFalta})</button>}
          <button type="button" className="btn ghost sm" onClick={onRolarTodas} disabled={!combatentes.length} title="Rola de novo para todos e começa em quem tiver mais">🎲 Todos</button>
        </div>
      </header>
      {combatentes.length === 0 ? (
        <p className="dica cb-vazio-texto">A ordem de turnos aparece aqui quando houver combatentes.</p>
      ) : (
        <ol className="cb-ini-lista">
          {combatentes.map((c, i) => {
            const vida = estadoVida(c);
            return (
              <li key={c.id} className={`cb-ini-linha${i === turnoIndex ? ' ativa' : ''}${vida === 'caido' ? ' caido' : ''}`} style={{ '--cor-lado': corDe(c.equipaId) }}>
                <input
                  type="number"
                  className="cb-ini-valor"
                  value={c.iniciativa ?? ''}
                  placeholder="—"
                  onChange={(e) => onDefinir(c.id, e.target.value)}
                  aria-label={`Iniciativa de ${c.nome}`}
                />
                <button type="button" className="cb-ini-quem" onClick={() => onAbrir(c.id)} title="Abrir">
                  <span className="cb-token-mini" style={{ backgroundImage: `url(${c.ficha?.imagem || tokenPlaceholder})` }} />
                  <span className="cb-ini-nome">
                    <span>{i === turnoIndex && <span className="cb-ini-seta" aria-label="na vez">▶ </span>}{c.nome}</span>
                    <BarraRecurso r={c.pv} classe="pv" fina />
                  </span>
                </button>
                <button type="button" className="cb-ini-dado" onClick={() => onRolar(c.id)} title="Rolar iniciativa">🎲</button>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
