import React from 'react';
import { ALTERACOES_GERAIS, ALTERACOES_ELEMENTO } from '../../data/regrasOpcionais.js';

/**
 * Consulta rápida das Alterações por exposição (Sobrevivendo ao Horror,
 * p. 99–102) — resumo do que muda a cada patamar de NEX. Ao contrário da
 * secção homónima dentro de "Regras opcionais", esta fica sempre disponível,
 * independentemente de a regra "NEX & Experiência" estar ligada: é só
 * referência, não aplica nada à ficha.
 */
const NOME_ELEMENTO = { sangue: 'Sangue', morte: 'Morte', conhecimento: 'Conhecimento', energia: 'Energia' };
const ORDEM_ELEMENTOS = ['sangue', 'morte', 'conhecimento', 'energia'];

export default function Alteracoes({ aoFechar, nex = 0 }) {
  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-estreito">
        <div className="modal-topo">
          <h3>Alterações <span className="pagina">p. 99–102</span></h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-corpo">
          <img
            src="/img/alteracoes-sangue.png"
            alt="Transformação progressiva de um agente com afinidade de Sangue"
            className="alteracoes-imagem"
          />

          <p className="dica" style={{ marginTop: 12 }}>
            Regra opcional de Sobrevivendo ao Horror ("NEX & Experiência") — resumo do que muda
            a cada patamar de exposição. Só se aplica de facto com essa regra ligada
            (ver Regras opcionais).
          </p>

          <div className="alteracoes" style={{ marginTop: 4, borderTop: 'none', paddingTop: 0 }}>
            <h4>Alterações Gerais</h4>
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
              <h4>Alterações de {NOME_ELEMENTO[el]}</h4>
              <div className="alteracao elemento">
                <ul>
                  {ALTERACOES_ELEMENTO[el].map((x) => (
                    <li key={x.nex} className={Number(nex) >= x.nex ? 'atingida' : ''}>
                      <span className="marca">NEX {x.nex}%</span> {x.texto}
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
