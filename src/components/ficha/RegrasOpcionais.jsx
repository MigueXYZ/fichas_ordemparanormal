import React from 'react';
import { REGRAS_OPCIONAIS, ALTERACOES_GERAIS, ALTERACOES_ELEMENTO } from '../../data/regrasOpcionais.js';
import { PERICIAS_POR_ID } from '../../data/pericias.js';
import { ATRIBUTOS } from '../../data/atributos.js';

/**
 * Interruptores das regras opcionais de Sobrevivendo ao Horror.
 * Nada disto vem ligado: o livro base continua a ser o padrão.
 */
const NOME_ELEMENTO = {
  conhecimento: 'Conhecimento', energia: 'Energia', morte: 'Morte', sangue: 'Sangue',
};

function nomeOpcao(campo, valor) {
  if (campo === 'elemento') return NOME_ELEMENTO[valor] || valor;
  if (campo === 'atributo35') return ATRIBUTOS.find((a) => a.id === valor)?.nome || valor.toUpperCase();
  return PERICIAS_POR_ID?.[valor]?.nome || valor;
}

export default function RegrasOpcionais({ regras = {}, aoMudar, aoFechar, nex = 0, exposicao = {}, aoMudarExposicao }) {
  const atingidas = ALTERACOES_GERAIS.filter((a) => Number(nex) >= a.nex);
  const doElemento = exposicao.elemento ? (ALTERACOES_ELEMENTO[exposicao.elemento] || []) : [];

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-estreito">
        <div className="modal-topo">
          <h3>Regras opcionais · Sobrevivendo ao Horror</h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar"></button>
        </div>

        <div className="modal-corpo">
          <p className="dica" style={{ marginTop: 0 }}>
            O Livro de Regras continua a ser a versão padrão. Estas são alternativas
            oficiais, mais viradas para horror e sobrevivência — usa só se quiseres.
          </p>

          {REGRAS_OPCIONAIS.map((r) => {
            const ligada = Boolean(regras[r.id]);
            return (
              <div className="regra-opcional" key={r.id}>
                <div className="cabeca">
                  <div>
                    <b>{r.nome}</b>
                    <span className="pagina">p. {r.pagina}</span>
                    <div className="resumo">{r.resumo}</div>
                  </div>
                  <div className="interruptor" role="group" aria-label={r.nome}>
                    <button
                      type="button"
                      className={ligada ? '' : 'ativo'}
                      onClick={() => aoMudar({ ...regras, [r.id]: false })}
                    >
                      Desligado
                    </button>
                    <button
                      type="button"
                      className={ligada ? 'ativo' : ''}
                      onClick={() => aoMudar({ ...regras, [r.id]: true })}
                    >
                      Ligado
                    </button>
                  </div>
                </div>
                <p className="texto">{r.texto}</p>
                <p className="efeito">Na ficha: {r.efeito}</p>
              </div>
            );
          })}

          {regras.nivelSeparado && (
            <div className="alteracoes">
              <h4>Alterações por exposição <span className="pagina">p. 99–102</span></h4>
              {atingidas.length === 0 ? (
                <p className="dica" style={{ marginTop: 0 }}>
                  Com NEX {Number(nex) || 0}% ainda não há alterações. A primeira chega aos 25%.
                </p>
              ) : atingidas.map((a) => (
                <div className="alteracao" key={a.id}>
                  <div className="topo">
                    <b>NEX {a.nex}% · {a.titulo}</b>
                  </div>
                  <p>{a.texto}</p>
                  <div className="escolhas">
                    {[a.escolha, a.escolha2].filter(Boolean).map((e) => (
                      <label key={e.campo}>
                        {e.rotulo}
                        <select
                          value={exposicao[e.campo] || ''}
                          onChange={(ev) => aoMudarExposicao({ ...exposicao, [e.campo]: ev.target.value || null })}
                        >
                          <option value="">— escolher —</option>
                          {e.opcoes.map((o) => <option key={o} value={o}>{nomeOpcao(e.campo, o)}</option>)}
                        </select>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {doElemento.length > 0 && (
                <div className="alteracao elemento">
                  <div className="topo"><b>Alterações de {NOME_ELEMENTO[exposicao.elemento]}</b></div>
                  <ul>
                    {doElemento.map((x) => (
                      <li key={x.nex} className={Number(nex) >= x.nex ? 'atingida' : ''}>
                        <span className="marca">NEX {x.nex}%</span> {x.texto}
                      </li>
                    ))}
                  </ul>
                  <p className="nota">
                    Estas não são aplicadas automaticamente — dependem de rituais e de condições
                    que a ficha não simula. Ficam aqui para as teres à mão.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-acoes">
          <button className="btn" onClick={aoFechar}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
