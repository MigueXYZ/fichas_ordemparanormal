import React, { useMemo, useState } from 'react';
import { vdParaGrupo } from '../../engine/geradores.js';

/**
 * Aba "Encontro" do Modo Mestre: soma o VD das ameaças escolhidas (com
 * quantidade) e compara com o VD recomendado para o NEX somado do grupo —
 * a mesma regra do livro já usada em vdParaGrupo (engine/geradores.js),
 * só que agora a soma das ameaças é automática em vez de feita à mão.
 */
export default function Encontro({ ameacas }) {
  const [nexGrupo, setNexGrupo] = useState(20);
  const [qtds, setQtds] = useState({});

  const facil = vdParaGrupo(nexGrupo, 'facil');
  const equilibrado = vdParaGrupo(nexGrupo);
  const dificil = vdParaGrupo(nexGrupo, 'dificil');

  const totalVD = useMemo(
    () => ameacas.reduce((soma, a) => soma + (Number(qtds[a.id]) || 0) * (Number(a.vd) || 0), 0),
    [ameacas, qtds]
  );

  const selecionadas = useMemo(() => ameacas.filter((a) => (qtds[a.id] || 0) > 0), [ameacas, qtds]);

  function mudarQtd(id, delta) {
    setQtds((q) => {
      const atual = q[id] || 0;
      const novo = Math.max(0, atual + delta);
      return { ...q, [id]: novo };
    });
  }

  function posicao() {
    if (totalVD <= 0) return { texto: 'nenhuma ameaça escolhida ainda', cor: 'var(--txt-fraco)' };
    if (totalVD < facil) return { texto: 'abaixo de fácil', cor: 'var(--txt-fraco)' };
    if (totalVD < equilibrado) return { texto: 'entre fácil e equilibrado', cor: 'var(--ok)' };
    if (totalVD < dificil) return { texto: 'entre equilibrado e difícil', cor: 'var(--txt)' };
    return { texto: 'acima de difícil', cor: 'var(--sangue-claro)' };
  }
  const pos = posicao();

  if (ameacas.length === 0) {
    return (
      <p style={{ color: 'var(--txt-fraco)', marginTop: 12, fontSize: 14 }}>
        Ainda não há nenhuma ameaça guardada para montar um encontro. Gera ou guarda uma primeiro.
      </p>
    );
  }

  return (
    <div>
      <p className="dica" style={{ marginTop: 0 }}>
        Regra do livro: soma o VD de todas as ameaças do encontro e compara com o VD recomendado para o NEX somado do grupo.
      </p>

      <div className="grelha-editor" style={{ marginBottom: 8 }}>
        <div className="campo">
          <label>NEX somado do grupo</label>
          <input type="number" value={nexGrupo} onChange={(e) => setNexGrupo(Number(e.target.value) || 0)} />
          <span className="dica">
            fácil {facil} · equilibrado {equilibrado} · difícil {dificil}
          </span>
        </div>
      </div>

      <div className="previa" style={{ marginBottom: 20 }}>
        <div className="previa-attrs">
          <span><b>{totalVD}</b> VD TOTAL</span>
        </div>
        <div className="previa-linha" style={{ color: pos.cor }}>{pos.texto}</div>
        {selecionadas.length > 0 && (
          <div className="previa-bloco">
            <div className="previa-rotulo">No encontro ({selecionadas.length})</div>
            <ul className="previa-pericias">
              {selecionadas.map((a) => (
                <li key={a.id}>
                  <span className="pn">{a.nome}</span>
                  <span className="pb">{qtds[a.id]} × VD {a.vd}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="previa-rotulo" style={{ marginBottom: 8 }}>Ameaças guardadas</div>
      <ul className="previa-pericias">
        {ameacas.map((a) => (
          <li key={a.id}>
            <span className="pn">{a.nome} <span style={{ color: 'var(--txt-fraco)' }}>· VD {a.vd}</span></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button type="button" className="btn ghost sm" onClick={() => mudarQtd(a.id, -1)} disabled={!qtds[a.id]}>−</button>
              <b style={{ minWidth: 16, textAlign: 'center' }}>{qtds[a.id] || 0}</b>
              <button type="button" className="btn ghost sm" onClick={() => mudarQtd(a.id, 1)}>+</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
