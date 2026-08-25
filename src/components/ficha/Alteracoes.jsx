import React from 'react';
import { ALTERACOES_GERAIS, ALTERACOES_ELEMENTO } from '../../data/regrasOpcionais.js';
import { COR_ELEMENTO } from '../../data/monstruoso.js';

/**
 * Consulta rápida das Alterações por exposição (Sobrevivendo ao Horror,
 * p. 99–102) — resumo do que muda a cada patamar de NEX. Ao contrário da
 * secção homónima dentro de "Regras opcionais", esta fica sempre disponível,
 * independentemente de a regra "NEX & Experiência" estar ligada: é só
 * referência, não aplica nada à ficha.
 */
const NOME_ELEMENTO = { sangue: 'Sangue', morte: 'Morte', conhecimento: 'Conhecimento', energia: 'Energia' };
const ORDEM_ELEMENTOS = ['sangue', 'morte', 'conhecimento', 'energia'];

/** Linha do tempo com os 3 patamares de Alterações Gerais (25/35/50%), a marcar os já atingidos. */
function LinhaNexGerais({ nex }) {
  const max = 55; // um pouco acima do último marco (50%), para não ficar colado à ponta
  return (
    <div className="linha-nex">
      <div className="linha-nex-trilho" />
      {ALTERACOES_GERAIS.map((a) => {
        const atingida = Number(nex) >= a.nex;
        return (
          <div
            key={a.nex}
            className={'linha-nex-marco' + (atingida ? ' atingida' : '')}
            style={{ left: `${(a.nex / max) * 100}%` }}
            title={`NEX ${a.nex}% · ${a.titulo}`}
          >
            <span className="linha-nex-ponto" />
            <span className="linha-nex-rotulo">{a.nex}%</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Alteracoes({ aoFechar, nex = 0 }) {
  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-estreito">
        <div className="modal-topo">
          <h3>Alterações <span className="pagina">p. 99–102</span></h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-corpo">
          <div className="alteracoes-imagem-moldura">
            <img
              src="/img/alteracoes-sangue.png"
              alt="Transformação progressiva de um agente com afinidade de Sangue"
              className="alteracoes-imagem"
            />
          </div>

          <p className="dica" style={{ marginTop: 12 }}>
            Regra opcional de Sobrevivendo ao Horror ("NEX & Experiência") — resumo do que muda
            a cada patamar de exposição. Só se aplica de facto com essa regra ligada
            (ver Regras opcionais).
          </p>

          <div className="alteracoes" style={{ marginTop: 4, borderTop: 'none', paddingTop: 0 }}>
            <h4>Alterações Gerais</h4>
            <LinhaNexGerais nex={nex} />
            {ALTERACOES_GERAIS.map((a) => (
              <div className="alteracao" key={a.id}>
                <div className="topo">
                  <b>NEX {a.nex}% · {a.titulo}</b>
                </div>
                <p>{a.texto}</p>
              </div>
            ))}
          </div>

          {ORDEM_ELEMENTOS.map((el) => (
            <div className="alteracoes" key={el}>
              <h4 className="alteracoes-h4-elemento">
                <img
                  src={`/img/sigilo-${el}.png`}
                  alt={`Sigilo de ${NOME_ELEMENTO[el]}`}
                  className="alteracoes-sigilo"
                  style={{ borderColor: COR_ELEMENTO[NOME_ELEMENTO[el]] }}
                />
                Alterações de {NOME_ELEMENTO[el]}
              </h4>
              <div className="alteracao elemento" style={{ borderLeftColor: COR_ELEMENTO[NOME_ELEMENTO[el]] }}>
                <ul>
                  {ALTERACOES_ELEMENTO[el].map((x) => (
                    <li key={x.nex} className={Number(nex) >= x.nex ? 'atingida' : ''}>
                      <span className="marca" style={{ color: Number(nex) >= x.nex ? 'var(--ok)' : COR_ELEMENTO[NOME_ELEMENTO[el]] }}>
                        NEX {x.nex}%
                      </span> {x.texto}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <p className="nota" style={{ display: 'block', marginTop: 10 }}>
            As alterações de elemento dependem de teres afinidade com esse elemento por
            Transcendência e de rituais/condições que a ficha não simula — ficam aqui só
            como consulta.
          </p>
        </div>

        <div className="modal-acoes">
          <button className="btn" onClick={aoFechar}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
