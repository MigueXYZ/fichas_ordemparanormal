import React from 'react';
import { ATRIBUTOS } from '../data/atributos.js';

/**
 * Roda de atributos.
 *
 * A arte e os números vivem dentro do MESMO SVG, em coordenadas do viewBox da
 * imagem (1000 × 1004). Assim nunca se desencontram: seja qual for o tamanho do
 * ecrã, o zoom do browser ou a fonte, tudo escala em bloco.
 *
 * A geometria abaixo NÃO foi estimada a olho: foi medida pixel a pixel sobre
 * `public/img/roda-atributos-v2.png` (deteção do interior de cada círculo e da
 * caixa do rótulo "FORÇA / FOR" que já lá está desenhado).
 *
 *   cx, cy, r  → centro e raio do interior do círculo
 *   ny         → altura onde o algarismo fica centrado (a meio do espaço livre
 *                entre o topo do círculo e o topo do rótulo desenhado)
 *
 * O texto é centrado com `dy` em `em` (nunca `dominant-baseline`, que o Safari
 * e browsers antigos ignoram, atirando o número para fora do círculo).
 */
const BASE = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';

const CIRCULOS = {
  agi: { cx: 480.0, cy: 190.0, r: 135, ny: 148 },
  for: { cx: 175.0, cy: 418.0, r: 135, ny: 362 },
  int: { cx: 785.0, cy: 418.0, r: 135, ny: 362 },
  pre: { cx: 270.0, cy: 778.0, r: 135, ny: 724 },
  vig: { cx: 690.0, cy: 778.0, r: 135, ny: 724 },
};

/**
 * `efetivos` (opcional): os mesmos atributos, mas já com os buffs/penalidades
 * ao vivo da Trilha do Monstruoso somados (ver `atributosEfetivos` em
 * engine/monstruoso.js). Quando presente, a roda MOSTRA e ROLA este valor
 * (o que a personagem tem agora, incluindo drenagem/atributo da trilha) —
 * os botões +/− continuam a editar sempre o valor BASE (`atributos`), nunca
 * o efetivo, para não misturar "pontos gastos na criação" com "bónus
 * temporário de hoje". Quando o valor efetivo difere do base, o número
 * fica colorido (verde a subir, vermelho a descer) para ficar óbvio.
 */
export default function RodaAtributos({ atributos, efetivos, onChange, onRolar, mini = false, podeSubir, podeDescer }) {
  return (
    <svg
      className={mini ? 'roda roda-mini' : 'roda'}
      viewBox="0 0 960 968"
      role="group"
      aria-label="Atributos"
    >
      <image href={`${BASE}img/roda-atributos-v2.png`} x="0" y="0" width="960" height="968" />

      {ATRIBUTOS.map((a) => {
        const c = CIRCULOS[a.id];
        const valorBase = Number(atributos[a.id] ?? 0);
        const valorEfetivo = Number((efetivos ? efetivos[a.id] : valorBase) ?? valorBase);
        const alterado = efetivos != null && valorEfetivo !== valorBase;
        const podeMais = podeSubir ? podeSubir(a.id) : true;
        const podeMenos = podeDescer ? podeDescer(a.id) : true;
        const yBotoes = c.cy + c.r + 20;
        return (
          <g key={a.id}>
            <text
              className={'atr-valor' + (alterado ? (valorEfetivo > valorBase ? ' atr-buff' : ' atr-debuff') : '')}
              data-attr={a.id}
              x={c.cx}
              y={c.ny}
              dy="0.34em"
              textAnchor="middle"
              onClick={() => onRolar && onRolar(a, valorEfetivo)}
            >
              <title>
                {onRolar ? `Rolar ${a.nome}: ${valorEfetivo}d20` : a.nome}
                {alterado ? ` (base ${valorBase}, ${valorEfetivo > valorBase ? '+' : ''}${valorEfetivo - valorBase} da Trilha do Monstruoso)` : ''}
              </title>
              {valorEfetivo}
            </text>

            {onChange && (
              <g className="atr-controlos">
                <g
                  className={'atr-botao' + (podeMenos ? '' : ' inativo')}
                  onClick={() => podeMenos && onChange(a.id, valorBase - 1)}
                >
                  <title>Baixar {a.nome}</title>
                  <circle cx={c.cx - 30} cy={yBotoes} r={22} />
                  <text x={c.cx - 30} y={yBotoes} dy="0.34em" textAnchor="middle">−</text>
                </g>
                <g
                  className={'atr-botao' + (podeMais ? '' : ' inativo')}
                  onClick={() => podeMais && onChange(a.id, valorBase + 1)}
                >
                  <title>Subir {a.nome}</title>
                  <circle cx={c.cx + 30} cy={yBotoes} r={22} />
                  <text x={c.cx + 30} y={yBotoes} dy="0.34em" textAnchor="middle">+</text>
                </g>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export { CIRCULOS };
