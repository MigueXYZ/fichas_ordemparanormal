import React from 'react';
import { GRAUS_TREINO } from '../../data/pericias.js';
import { ATRIBUTOS } from '../../data/atributos.js';
import { calcPericias } from '../../engine/calc.js';
import { rolarTeste } from '../../engine/dados.js';
import IconeD20 from '../IconeD20.jsx';

export default function TabelaPericias({ personagem, setPersonagem, onRolar }) {
  const linhas = calcPericias(personagem);

  function setPericia(id, patch) {
    setPersonagem({
      ...personagem,
      pericias: { ...personagem.pericias, [id]: { ...personagem.pericias[id], ...patch } },
    });
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
                <select
                  value={l.grau}
                  title={GRAUS_TREINO.find((g) => g.id === l.grau)?.nome}
                  onChange={(e) => setPericia(l.id, { grau: e.target.value })}
                >
                  {GRAUS_TREINO.map((g) => (
                    <option key={g.id} value={g.id} title={g.nome}>{g.bonus === 0 ? '0' : `+${g.bonus}`}</option>
                  ))}
                </select>
              </td>
              <td>
                <input type="number" value={l.outros} onChange={(e) => setPericia(l.id, { outros: Number(e.target.value) })} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="rodape-pericias">+ Penalidade de carga. * Somente treinada.</div>
    </div>
  );
}
