import React, { useEffect, useRef } from 'react';
import { GRAUS_TREINO } from '../../data/pericias.js';
import { ATRIBUTOS } from '../../data/atributos.js';
import { calcPericias } from '../../engine/calc.js';
import { rolarTeste } from '../../engine/dados.js';
import IconeD20 from '../IconeD20.jsx';

function InputNumeroScroll({ value, onChange, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 1 : -1;
      const atual = Number(el.value) || 0;
      onChange(atual + delta);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [onChange]);

  return (
    <input
      ref={ref}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      {...props}
    />
  );
}

function SelectScroll({ value, onChange, onScrollStep, children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 1 : -1;
      if (onScrollStep) {
        onScrollStep(delta);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [onScrollStep]);

  return (
    <select
      ref={ref}
      value={value}
      onChange={onChange}
      {...props}
    >
      {children}
    </select>
  );
}

export default function TabelaPericias({ personagem, setPersonagem, onRolar }) {
  const linhas = calcPericias(personagem);

  function setPericia(id, patch) {
    setPersonagem({
      ...personagem,
      pericias: { ...personagem.pericias, [id]: { ...personagem.pericias[id], ...patch } },
    });
  }

  function rolarTreino(id, grauAtual, delta) {
    const graus = GRAUS_TREINO.map((g) => g.id);
    const idx = graus.indexOf(grauAtual);
    if (idx === -1) return;
    const novoIdx = Math.max(0, Math.min(graus.length - 1, idx + delta));
    setPericia(id, { grau: graus[novoIdx] });
  }

  function rolarAttr(id, attrAtual, attrPadrao, delta) {
    const ids = ATRIBUTOS.map((a) => a.id);
    const idx = ids.indexOf(attrAtual);
    if (idx === -1) return;
    const novoIdx = (idx + delta + ids.length) % ids.length;
    const novoAttr = ids[novoIdx];
    setPericia(id, { attr: novoAttr === attrPadrao ? null : novoAttr });
  }

  return (
    <div>
      <div className="titulo-seccao">Perícias</div>
      <table className="tabela-pericias">
        <thead>
          <tr>
            <th>Perícia</th>
            <th>Dados</th>
            <th>Bónus</th>
            <th>Treino</th>
            <th>Outros</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.id} className={(l.treino > 0 ? 'treinada' : '') + (l.bloqueada ? ' bloqueada' : '')}>
              <td>
                <div className="nome-pericia">
                  <button
                    className="dado-btn"
                    title={l.bloqueada ? 'Perícia somente treinada — sem treino não podes usar' : `Rolar ${l.nome}: ${l.dados}d20 ${l.bonus >= 0 ? '+' : '−'}${Math.abs(l.bonus)}`}
                    onClick={() => onRolar(rolarTeste({ nome: l.nome, dados: l.dados, bonus: l.bonus }))}
                  >
                    <IconeD20 />
                  </button>
                  {l.nome}
                  <span className="marca">{(l.treinada ? '*' : '') + (l.carga ? '+' : '')}</span>
                </div>
              </td>
              <td className="attr">
                <select
                  className={l.attrTrocado ? 'trocado' : ''}
                  value={l.attr}
                  title={l.attrTrocado
                    ? `Atributo trocado (o normal é ${ATRIBUTOS.find((a) => a.id === l.attrPadrao)?.sigla})`
                    : 'Atributo usado nesta perícia'}
                  onChange={(e) => setPericia(l.id, { attr: e.target.value === l.attrPadrao ? null : e.target.value })}
                >
                  {ATRIBUTOS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.sigla}{a.id === l.attrPadrao ? '' : ' *'}
                    </option>
                  ))}
                </select>
              </td>
              <td className="bonus">{l.bonus >= 0 ? `+${l.bonus}` : l.bonus}</td>
              <td>
                <SelectScroll
                  value={l.grau}
                  title={`${GRAUS_TREINO.find((g) => g.id === l.grau)?.nome} · Altera com o scroll`}
                  onChange={(e) => setPericia(l.id, { grau: e.target.value })}
                  onScrollStep={(delta) => rolarTreino(l.id, l.grau, delta)}
                >
                  {GRAUS_TREINO.map((g) => (
                    <option key={g.id} value={g.id} title={g.nome}>{g.bonus === 0 ? '0' : `+${g.bonus}`}</option>
                  ))}
                </SelectScroll>
              </td>
              <td>
                <InputNumeroScroll
                  value={l.outros}
                  title="Altera digitando ou com o scroll do rato"
                  onChange={(novo) => setPericia(l.id, { outros: novo })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="rodape-pericias">+ Penalidade de carga. * Somente treinada.</div>
    </div>
  );
}
