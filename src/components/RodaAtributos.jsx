import React from 'react';
import { ATRIBUTOS } from '../data/atributos.js';

/**
 * Roda de atributos.
 *
 * A arte e os números vivem dentro do MESMO SVG, em coordenadas do viewBox da
 * imagem (1000 × 1004). Assim nunca se desencontram: seja qual for o tamanho do
 * ecrã, o zoom do browser ou a fonte, tudo escala em bloco.
 *
 * Centros dos cinco círculos, medidos na arte da ficha oficial:
 */
const BASE = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
const R = 88;                       // raio de cada círculo, em unidades do viewBox
const CENTROS = {
  agi: { x: 501, y: 199 },
  for: { x: 193, y: 457 },
  int: { x: 807, y: 457 },
  pre: { x: 298, y: 807 },
  vig: { x: 704, y: 807 },
};

export default function RodaAtributos({ atributos, onChange, onRolar, mini = false, podeSubir, podeDescer }) {
  return (
    <svg
      className={mini ? 'roda roda-mini' : 'roda'}
      viewBox="0 0 1000 1004"
      role="group"
      aria-label="Atributos"
    >
      <image href={`${BASE}img/roda-atributos-v2.png`} x="0" y="0" width="1000" height="1004" />

      {ATRIBUTOS.map((a) => {
        const c = CENTROS[a.id];
        const valor = Number(atributos[a.id] ?? 0);
        const podeMais = podeSubir ? podeSubir(a.id) : true;
        const podeMenos = podeDescer ? podeDescer(a.id) : true;
        return (
          <g key={a.id}>
            {/* nada de `dominant-baseline`: há browsers (Safari e versões antigas)
                que o ignoram e atiram o número para cima do círculo. `dy` em `em`
                é suportado em todo o lado e centra o algarismo à mesma. */}
            <text
              className="atr-valor"
              data-attr={a.id}
              x={c.x}
              y={c.y - 0.30 * R}
              dy="0.35em"
              textAnchor="middle"
              onClick={() => onRolar && onRolar(a, valor)}
            >
              <title>{onRolar ? `Rolar ${a.nome}: ${valor}d20` : a.nome}</title>
              {valor}
            </text>

            {onChange && (
              <g className="atr-controlos">
                <g
                  className={'atr-botao' + (podeMenos ? '' : ' inativo')}
                  onClick={() => podeMenos && onChange(a.id, valor - 1)}
                >
                  <title>Baixar {a.nome}</title>
                  <circle cx={c.x - 30} cy={c.y + R + 34} r={22} />
                  <text x={c.x - 30} y={c.y + R + 34} dy="0.34em" textAnchor="middle">−</text>
                </g>
                <g
                  className={'atr-botao' + (podeMais ? '' : ' inativo')}
                  onClick={() => podeMais && onChange(a.id, valor + 1)}
                >
                  <title>Subir {a.nome}</title>
                  <circle cx={c.x + 30} cy={c.y + R + 34} r={22} />
                  <text x={c.x + 30} y={c.y + R + 34} dy="0.34em" textAnchor="middle">+</text>
                </g>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
