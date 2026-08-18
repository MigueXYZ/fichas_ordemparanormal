import React from 'react';
import { GRAUS_TREINO } from '../../data/pericias.js';
import { ATRIBUTOS } from '../../data/atributos.js';
import { calcPericias, grauMaximoPorNex } from '../../engine/calc.js';
import { rolarTeste } from '../../engine/dados.js';
import IconeD20 from '../IconeD20.jsx';

export default function TabelaPericias({ personagem, setPersonagem, onRolar }) {
  const linhas = calcPericias(personagem);
  const grauMax = grauMaximoPorNex(personagem.nex);
  const grausPermitidos = GRAUS_TREINO.filter((g) => g.bonus <= grauMax.bonus);

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
              <td className="attr">( {ATRIBUTOS.find((a) => a.id === l.attr)?.sigla} )</td>
              <td className="bonus">{l.bonus >= 0 ? `+${l.bonus}` : l.bonus}</td>
              <td>
                <select value={l.grau} onChange={(e) => setPericia(l.id, { grau: e.target.value })}>
                  {grausPermitidos.map((g) => (
                    <option key={g.id} value={g.id}>{g.bonus}</option>
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
