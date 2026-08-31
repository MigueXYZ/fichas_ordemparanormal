import React from 'react';

/**
 * Aparece quando a personagem sobe pelo menos um degrau de NEX (ou um nível,
 * com a regra de nível separado). Lista o que se ganha em cada degrau — pela
 * tabela da classe, pelos poderes da trilha e, se for o caso, pela Trilha do
 * Monstruoso — e quanto sobem os máximos.
 *
 * Só mostra. Quem calcula é `engine/subirNex.js`; quem decide quando abrir é
 * o efeito em `Ficha.jsx`.
 */
export default function ModalSubidaNex({ resumo, aoFechar }) {
  if (!resumo) return null;
  const { de, para, porNivel, degraus, recursos } = resumo;
  const varios = degraus.length > 1;

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-subida-nex" style={{ maxWidth: 560 }}>
        <div className="modal-topo">
          <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 20 }}>
            {porNivel ? 'Subiste de nível' : 'Subiste de NEX'}
            <span className="subida-salto">
              {de}% → {para}%
            </span>
          </h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">×</button>
        </div>

        <div className="modal-corpo" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {recursos.length > 0 && (
            <div className="subida-bloco">
              <label className="rotulo-def">Recursos</label>
              <div className="subida-recursos">
                {recursos.map((r) => (
                  <div key={r.nome} className="subida-recurso">
                    <span className="subida-recurso-nome">{r.nome}</span>
                    <span className={'subida-recurso-delta' + (r.delta < 0 ? ' desce' : '')}>
                      {r.delta > 0 ? '+' : ''}{r.delta}
                    </span>
                    <span className="subida-recurso-valores">{r.de} → {r.para}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {degraus.map((g) => (
            <div key={g.nex} className="subida-bloco">
              {varios && <label className="rotulo-def">NEX {g.nex}%</label>}

              {g.daClasse.length > 0 && (
                <div className="subida-via">
                  <div className="subida-via-titulo">
                    Classe{g.classeNome ? ` · ${g.classeNome}` : ''}
                  </div>
                  <ul className="subida-lista">
                    {g.daClasse.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
              )}

              {g.daTrilha.length > 0 && (
                <div className="subida-via">
                  <div className="subida-via-titulo">
                    Trilha{g.trilhaNome ? ` · ${g.trilhaNome}` : ''}
                  </div>
                  {g.daTrilha.map((p, i) => (
                    <div key={i} className="subida-poder">
                      <b>{p.nome}</b>
                      {p.descricao && <p>{p.descricao}</p>}
                    </div>
                  ))}
                </div>
              )}

              {g.monstruoso.length > 0 && (
                <div className="subida-via">
                  <div className="subida-via-titulo">
                    Monstruoso{g.elemento ? ` · ${g.elemento}` : ''}
                  </div>
                  <ul className="subida-lista">
                    {g.monstruoso.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              )}

              {g.vazio && (
                <p className="dica" style={{ margin: 0 }}>
                  Este degrau não dá nada de novo pela tabela da classe nem pela trilha
                  {g.trilhaNome ? '' : ' (ainda não escolheste trilha)'}.
                </p>
              )}
            </div>
          ))}

          <p className="dica" style={{ margin: 0 }}>
            Os máximos já estão atualizados na ficha. As escolhas que dependem de ti
            (poderes, perícias, rituais, aumento de atributo) tens de as fazer à mão nas
            abas respetivas.
          </p>
        </div>

        <div className="modal-acoes" style={{ marginTop: 20 }}>
          <button type="button" className="btn" onClick={aoFechar} style={{ width: '100%' }}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
