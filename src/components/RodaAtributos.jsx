import React from 'react';
import { ATRIBUTOS } from '../data/atributos.js';

// posições medidas sobre a arte da ficha oficial (public/img/roda-atributos.png)
const POSICOES = {
  agi: { left: '50.2%', top: '13.5%' },
  for: { left: '16.3%', top: '41.5%' },
  int: { left: '83.7%', top: '41.5%' },
  pre: { left: '27.8%', top: '79.5%' },
  vig: { left: '72.4%', top: '79.5%' },
};

/**
 * Roda de atributos com a arte da ficha oficial.
 * Clicar no número rola um teste puro do atributo.
 */
export default function RodaAtributos({ atributos, onChange, onRolar, mini = false, podeSubir, podeDescer }) {
  return (
    <div className={mini ? 'roda roda-mini' : 'roda'}>
      {ATRIBUTOS.map((a) => {
        const valor = Number(atributos[a.id] ?? 0);
        return (
          <div key={a.id} className="atr-no" style={POSICOES[a.id]}>
            <button
              type="button"
              className="atr-valor"
              title={onRolar ? `Rolar ${a.nome} (${valor}d20)` : a.nome}
              onClick={() => onRolar && onRolar(a, valor)}
            >
              {valor}
            </button>
            {onChange && (
              <div className="atr-controlos">
                <button
                  type="button"
                  aria-label={`Baixar ${a.nome}`}
                  disabled={podeDescer ? !podeDescer(a.id) : false}
                  onClick={() => onChange(a.id, valor - 1)}
                >
                  −
                </button>
                <button
                  type="button"
                  aria-label={`Subir ${a.nome}`}
                  disabled={podeSubir ? !podeSubir(a.id) : false}
                  onClick={() => onChange(a.id, valor + 1)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
