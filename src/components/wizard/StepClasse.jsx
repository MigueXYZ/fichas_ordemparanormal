import React from 'react';
import { CLASSES } from '../../data/classes.js';
import { PERICIAS, PERICIAS_POR_ID } from '../../data/pericias.js';
import { calcMaximos, orcamentoPericias } from '../../engine/calc.js';
import { aplicarConcessoes } from '../../engine/concessoes.js';

export default function StepClasse({ personagem, setPersonagem }) {
  const principais = CLASSES.filter((c) => c.id !== 'sobrevivente');
  const sobrevivente = CLASSES.find((c) => c.id === 'sobrevivente');
  const classe = CLASSES.find((c) => c.id === personagem.classeId);
  const orc = orcamentoPericias(personagem);

  const escolhasFeitas = personagem.periciasEscolhaClasse || {};
  const livresEscolhidas = personagem.periciasLivresClasse || [];

  function recalcular(base, escolhas, livres) {
    const ids = [...orcamentoPericias(base).obrigatorias, ...Object.values(escolhas).filter(Boolean), ...livres];
    return aplicarConcessoes(
      { ...base, periciasEscolhaClasse: escolhas, periciasLivresClasse: livres },
      'classe',
      [...new Set(ids)]
    );
  }

  function escolherClasse(c) {
    const base = {
      ...personagem,
      classeId: c.id,
      trilhaId: null,
      proficiencias: (c.proficiencias || []).join(', '),
    };
    setPersonagem(recalcular(base, {}, []));
  }

  function definirEscolha(indice, periciaId) {
    setPersonagem(recalcular(personagem, { ...escolhasFeitas, [indice]: periciaId }, livresEscolhidas));
  }

  function alternarLivre(id) {
    const jaEscolhida = livresEscolhidas.includes(id);
    if (!jaEscolhida && livresEscolhidas.length >= orc.livres) return;
    const novas = jaEscolhida ? livresEscolhidas.filter((x) => x !== id) : [...livresEscolhidas, id];
    setPersonagem(recalcular(personagem, escolhasFeitas, novas));
  }

  const previa = personagem.classeId ? calcMaximos(personagem) : null;
  const bloqueadas = new Set([
    ...orc.obrigatorias,
    ...Object.values(escolhasFeitas).filter(Boolean),
    ...(personagem.concedidas?.origem || []),
  ]);

  return (
    <div>
      <p className="texto-regra" style={{ fontSize: 15 }}>
        A tua classe indica o treino que recebeste na Ordem para enfrentar os perigos do Outro Lado.
        Em termos de jogo é a característica mais importante: define o que fazes e qual é o teu papel no grupo.
      </p>
      <p className="texto-regra" style={{ fontSize: 13, color: 'var(--txt-dim)' }}>
        As perícias concedidas são adicionadas automaticamente. Perícias opcionais podem ser adicionadas ao agente depois de criado.
      </p>

      {sobrevivente && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', margin: '14px 0 4px' }}>
          <span style={{ fontSize: 14 }}>Em alternativa podes começar como uma pessoa comum.</span>
          <button className={'btn sm' + (personagem.classeId === 'sobrevivente' ? '' : ' ghost')} onClick={() => escolherClasse(sobrevivente)}>
            {sobrevivente.nome}
          </button>
        </div>
      )}

      <div className="cards">
        {principais.map((c) => (
          <div key={c.id} className={'card' + (personagem.classeId === c.id ? ' selecionado' : '')}>
            <h3>{c.nome}</h3>
            <div className="barra" />
            <div className="corpo">
              <p>{c.descricao}</p>
              <p style={{ marginTop: 12 }}>
                <span className="pill">PV {c.progressao.pv.inicial} + VIG</span>{' '}
                <span className="pill">SAN {c.progressao.san.inicial}</span>{' '}
                <span className="pill">PE {c.progressao.pe.inicial} + PRE</span>
              </p>
              <p><b>Perícias.</b> {c.pericias?.nota}</p>
              <p><b>Proficiências.</b> {(c.proficiencias || []).join(', ')}</p>
              <p><b>Trilhas.</b> {(c.trilhas || []).map((t) => t.nome).join(', ')}</p>
            </div>
            <div className="acao">
              <button className="btn" onClick={() => escolherClasse(c)}>
                {personagem.classeId === c.id ? 'Escolhida' : 'Escolher'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {classe && (
        <div className="card" style={{ marginTop: 22 }}>
          <h3 style={{ fontSize: 18 }}>Perícias treinadas de {classe.nome}</h3>
          <div className="barra" />
          <p style={{ color: 'var(--txt-dim)', fontSize: 13, marginTop: 0 }}>{orc.nota}</p>

          {orc.obrigatorias.length > 0 && (
            <p style={{ fontSize: 14 }}>
              <b>Automáticas:</b> {orc.obrigatorias.map((id) => PERICIAS_POR_ID[id]?.nome).join(', ')}
            </p>
          )}

          {orc.escolhas.map((esc, i) => (
            <div className="campo" key={i} style={{ maxWidth: 320 }}>
              <label>Escolhe uma</label>
              <select value={escolhasFeitas[i] || ''} onChange={(e) => definirEscolha(i, e.target.value)}>
                <option value="">—</option>
                {esc.entre.map((id) => <option key={id} value={id}>{PERICIAS_POR_ID[id]?.nome}</option>)}
              </select>
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, marginBottom: 10 }}>
            <strong style={{ color: livresEscolhidas.length === orc.livres ? 'var(--ok)' : 'var(--accent)', fontSize: 20 }}>
              {orc.livres - livresEscolhidas.length}
            </strong>
            <span style={{ fontSize: 14 }}>perícias livres por escolher (total {orc.livres})</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PERICIAS.map((p) => {
              const fixa = bloqueadas.has(p.id);
              const ativa = livresEscolhidas.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={'btn sm' + (ativa ? '' : ' ghost')}
                  disabled={fixa}
                  title={fixa ? 'Já treinada por origem ou classe' : ''}
                  onClick={() => alternarLivre(p.id)}
                  style={fixa ? { opacity: 0.35 } : undefined}
                >
                  {p.nome}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {previa && (
        <div className="card" style={{ marginTop: 22 }}>
          <h3 style={{ fontSize: 18 }}>Prévia em NEX {personagem.nex}%</h3>
          <div className="barra" />
          <div style={{ display: 'flex', gap: 26, fontSize: 15 }}>
            <div><b style={{ color: 'var(--vida)' }}>{previa.pv}</b> Vida</div>
            <div><b style={{ color: 'var(--sanidade)' }}>{previa.san}</b> Sanidade</div>
            <div><b style={{ color: 'var(--esforco)' }}>{previa.pe}</b> Esforço</div>
          </div>
        </div>
      )}
    </div>
  );
}
