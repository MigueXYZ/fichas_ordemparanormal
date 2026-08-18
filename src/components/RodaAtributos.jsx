import React from 'react';
import { ATRIBUTOS } from '../data/atributos.js';

const POSICOES = {
  agi: { left: '50%', top: '12%' },
  int: { left: '87%', top: '43%' },
  vig: { left: '73%', top: '85%' },
  pre: { left: '27%', top: '85%' },
  for: { left: '13%', top: '43%' },
};

export default function RodaAtributos({ atributos, onChange, mini = false, podeSubir, podeDescer }) {
  return (
    <div className={mini ? 'roda roda-mini' : 'roda'}>
      <div className="centro">ATRIBUTOS</div>
      {ATRIBUTOS.map((a) => {
        const valor = Number(atributos[a.id] ?? 0);
        return (
          <div key={a.id} className="atr-no" style={POSICOES[a.id]}>
            <div className="atr-circulo">
              <div className="valor">{valor}</div>
              <div className="nome">{a.nome.toUpperCase()}</div>
              <div className="sigla">{a.sigla}</div>
            </div>
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
