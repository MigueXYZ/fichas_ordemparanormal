import React from 'react';
import IconeD20 from '../IconeD20.jsx';
import EditorTags from '../EditorTags.jsx';
import { rolarTeste, rolarDano } from '../../engine/dados.js';

/** Ficha de ameaça, no formato do capítulo 7 do Livro Base. */
export default function FichaAmeaca({ ameaca, setAmeaca, onRolar }) {
  const a = ameaca;
  const set = (patch) => setAmeaca({ ...a, ...patch });

  function rolar(nome, dados, bonus) {
    onRolar(rolarTeste({ nome: `${a.nome} — ${nome}`, dados, bonus }));
  }

  return (
    <div className="container">
      <div className="ameaca">
        <div className="ameaca-topo">
          <input className="ameaca-nome" value={a.nome} onChange={(e) => set({ nome: e.target.value })} />
          <div className="ameaca-vd">
            <span>VD</span>
            <input type="number" value={a.vd} onChange={(e) => set({ vd: Number(e.target.value) })} />
          </div>
        </div>
        <div className="ameaca-descritores">
          {a.descritores.join(' · ')} · {a.tamanho}
          {a.ocupacao ? ` · ${a.ocupacao}` : ''}
        </div>

        <div className="ameaca-grelha">
          <div className="ameaca-bloco">
            <h4>Sentidos</h4>
            <div className="linha-stat"><span>Percepção</span><b>{a.sentidos.percepcao}</b>
              <button className="dado-btn" onClick={() => rolar('Percepção', a.ataque.dados, a.ataque.bonus)}><IconeD20 /></button>
            </div>
            <div className="linha-stat"><span>Iniciativa</span><b>{a.sentidos.iniciativa}</b>
              <button className="dado-btn" onClick={() => rolar('Iniciativa', a.ataque.dados, a.ataque.bonus)}><IconeD20 /></button>
            </div>
          </div>

          <div className="ameaca-bloco">
            <h4>Defesa</h4>
            <div className="linha-stat"><span>Defesa</span><b>{a.defesa}</b></div>
            <div className="linha-stat"><span>Fortitude</span><b>{a.testes.fortitude}</b></div>
            <div className="linha-stat"><span>Reflexos</span><b>{a.testes.reflexos}</b></div>
            <div className="linha-stat"><span>Vontade</span><b>{a.testes.vontade}</b></div>
          </div>

          <div className="ameaca-bloco">
            <h4>Pontos de vida</h4>
            <div className="ameaca-pv">
              <input type="number" value={a.pvAtual ?? a.pv} onChange={(e) => set({ pvAtual: Number(e.target.value) })} />
              <span>/ {a.pv}</span>
            </div>
            <div className="linha-stat"><span>Machucado</span><b>{a.pvMachucado}</b></div>
            <div className="linha-stat"><span>DT</span><b>{a.dt}</b></div>
            <div className="linha-stat"><span>Deslocamento</span><b>{a.deslocamento} m</b></div>
          </div>
        </div>

        {a.resistencias?.length > 0 && (
          <div className="ameaca-bloco largo">
            <h4>Resistências</h4>
            <div>{a.resistencias.join(' · ')}</div>
          </div>
        )}

        <div className="ameaca-bloco largo">
          <h4>Perícias</h4>
          <div className="ameaca-pericias">
            {a.pericias.map((p) => (
              <button key={p.nome} className="pill clicavel" onClick={() => rolar(p.nome, p.dados, p.bonus)}>
                {p.nome} {p.dados}O+{p.bonus}
              </button>
            ))}
          </div>
        </div>

        <div className="ameaca-bloco largo">
          <h4>Ações</h4>
          <div className="bloco arma">
            <div className="topo">
              <div>
                <b>{a.ataque.nome}</b>
                <div className="arma-stats">
                  <span>{a.ataque.teste}</span>
                  <span>{a.ataque.dano} {a.ataque.tipo}</span>
                  <span>crítico {a.ataque.critico}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn sm" onClick={() => rolar(a.ataque.nome, a.ataque.dados, a.ataque.bonus)}>Atacar</button>
                <button
                  className="btn ghost sm"
                  onClick={() => onRolar(rolarDano({ nome: `${a.nome} — dano`, dano: a.ataque.dano.replace(/\+\d+$/, ''), tipoDano: a.ataque.tipo, bonus: Number(a.ataque.dano.match(/\+(\d+)$/)?.[1] || 0) }))}
                >
                  Dano
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <EditorTags
            tags={a.tags || []}
            onChange={(novasTags) => set({ tags: novasTags })}
          />
        </div>

        <div className="campo" style={{ marginTop: 16 }}>
          <label>Notas</label>
          <textarea value={a.notas || ''} onChange={(e) => set({ notas: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
