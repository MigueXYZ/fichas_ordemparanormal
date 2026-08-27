import React, { useState, useMemo } from 'react';
import {
  CONDICOES_DESCANSO,
  PRATOS_ALIMENTACAO,
  ACOES_INTERLUDIO,
  calcularInterludio,
  aplicarDescansoPleno,
  aplicarLimpezaCondicoesETemporarios,
} from '../../engine/interludio.js';
import { IconeEscudo } from '../Icones.jsx';

export default function ModalDescanso({
  personagem,
  max,
  aoAplicarDescanso,
  aoFechar,
}) {
  const [modoAba, setModoAba] = useState('interludio'); // 'interludio' | 'rapido'
  const [condicaoId, setCondicaoId] = useState('normal');
  const [acoes, setAcoes] = useState(['dormir', 'relaxar']);
  const [pratoId, setPratoId] = useState('favorito');
  const [aliadosRelaxando, setAliadosRelaxando] = useState(0);
  const [limparCondicoes, setLimparCondicoes] = useState(true);

  const resultado = useMemo(() => {
    return calcularInterludio({
      personagem,
      max,
      condicaoDescansoId: condicaoId,
      acoes,
      pratoId,
      aliadosRelaxando: Number(aliadosRelaxando) || 0,
      limparCondicoes,
    });
  }, [personagem, max, condicaoId, acoes, pratoId, aliadosRelaxando, limparCondicoes]);

  function alternarAcao(id) {
    if (acoes.includes(id)) {
      setAcoes(acoes.filter((a) => a !== id));
    } else {
      if (acoes.length >= 2) {
        // Substitui a segunda ação se já tiver 2
        setAcoes([acoes[0], id]);
      } else {
        setAcoes([...acoes, id]);
      }
    }
  }

  function confirmarInterludio() {
    aoAplicarDescanso(resultado.patch);
    aoFechar();
  }

  function confirmarDescansoPleno() {
    aoAplicarDescanso(aplicarDescansoPleno(personagem, max));
    aoFechar();
  }

  function confirmarLimpeza() {
    aoAplicarDescanso(aplicarLimpezaCondicoesETemporarios(personagem));
    aoFechar();
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-descanso" style={{ maxWidth: 560 }}>
        <div className="modal-topo">
          <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 20 }}>
            Descanso & Interlúdio
          </h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar"></button>
        </div>

        {/* Abas do Modal */}
        <div className="abas-modal-descanso">
          <button
            type="button"
            className={'aba-modal-btn' + (modoAba === 'interludio' ? ' ativa' : '')}
            onClick={() => setModoAba('interludio')}
          >
            Interlúdio Oficial
          </button>
          <button
            type="button"
            className={'aba-modal-btn' + (modoAba === 'rapido' ? ' ativa' : '')}
            onClick={() => setModoAba('rapido')}
          >
            Atalhos Rápidos
          </button>
        </div>

        <div className="modal-corpo" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {modoAba === 'interludio' ? (
            <>
              {/* Condição de Descanso */}
              <div className="seccao-bloco-descanso">
                <label className="rotulo-descanso">Condição de Acomodação</label>
                <div className="grelha-condicoes-descanso">
                  {Object.values(CONDICOES_DESCANSO).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={'card-condicao-descanso' + (condicaoId === c.id ? ' ativo' : '')}
                      onClick={() => setCondicaoId(c.id)}
                    >
                      <div className="nome-condicao-descanso">{c.nome}</div>
                      <div className="mult-condicao-descanso">{c.mult}× limite PE</div>
                      <div className="desc-condicao-descanso">{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seletor de Ações (máximo 2) */}
              <div className="seccao-bloco-descanso">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="rotulo-descanso">Ações de Interlúdio</label>
                  <span className="contador-acoes-descanso">
                    {acoes.length}/2 selecionadas
                  </span>
                </div>

                <div className="lista-acoes-interludio">
                  {ACOES_INTERLUDIO.map((ac) => {
                    const ativa = acoes.includes(ac.id);
                    return (
                      <div
                        key={ac.id}
                        className={'item-acao-interludio' + (ativa ? ' ativa' : '')}
                        onClick={() => alternarAcao(ac.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={ativa}
                            onChange={() => {}}
                            style={{ marginTop: 2, cursor: 'pointer' }}
                          />
                          <div>
                            <b className="titulo-acao-interludio">{ac.nome}</b>
                            <span className="desc-acao-interludio">{ac.desc}</span>
                          </div>
                        </div>

                        {ac.id === 'dormir' && (
                          <span className="badge-ganho-descanso">
                            +{resultado.pvRecuperado} PV · +{resultado.peRecuperado} PE
                          </span>
                        )}
                        {ac.id === 'relaxar' && (
                          <span className="badge-ganho-descanso">
                            +{resultado.sanRecuperado} SAN
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detalhes para Alimentar-se */}
              {acoes.includes('alimentar') && (
                <div className="seccao-bloco-descanso seccao-sub-opcao">
                  <label className="rotulo-descanso">Escolha da Refeição (Alimentar-se)</label>
                  <select
                    value={pratoId}
                    onChange={(e) => setPratoId(e.target.value)}
                    className="select-tipo-dano"
                    style={{ marginTop: 4 }}
                  >
                    {Object.values(PRATOS_ALIMENTACAO).map((p) => (
                      <option key={p.id} value={p.id}>{p.nome} — {p.desc}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Detalhes para Relaxar com aliados */}
              {acoes.includes('relaxar') && (
                <div className="seccao-bloco-descanso seccao-sub-opcao" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--txt-dim)' }}>
                    Outros participantes a relaxar juntos (+1 SAN cada):
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={aliadosRelaxando}
                    onChange={(e) => setAliadosRelaxando(e.target.value === '' ? 0 : Number(e.target.value))}
                    style={{ width: 60, textAlign: 'center', padding: '3px 6px' }}
                  />
                </div>
              )}

              {/* Opção de Limpar Condições */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="chk-limpar-condicoes"
                  checked={limparCondicoes}
                  onChange={(e) => setLimparCondicoes(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="chk-limpar-condicoes" style={{ fontSize: 13, cursor: 'pointer', color: 'var(--txt-dim)' }}>
                  Limpar condições ativas (ex: Fatigado, Abalado, Fraco) e zerar pontos temporários
                </label>
              </div>

              {/* Pré-visualização de Recuperação */}
              <div className="card-resumo-calculo-dano">
                <div className="titulo-resumo-dano">Previsão da Recuperação</div>

                <div className="grelha-impacto-recursos-descanso">
                  <div className="item-recurso-descanso">
                    <span className="rotulo-recurso-d">Pontos de Vida</span>
                    <span className="valor-transicao-d">
                      {resultado.pvAtual} → <b style={{ color: 'var(--txt)' }}>{resultado.novoPv}</b> / {resultado.pvMax}
                    </span>
                    {resultado.pvRecuperado > 0 && (
                      <span className="ganho-positivo-d">+{resultado.pvRecuperado} PV</span>
                    )}
                  </div>

                  <div className="item-recurso-descanso">
                    <span className="rotulo-recurso-d">Pontos de Esforço</span>
                    <span className="valor-transicao-d">
                      {resultado.peAtual} → <b style={{ color: 'var(--txt)' }}>{resultado.novoPe}</b> / {resultado.peMax}
                    </span>
                    {resultado.peRecuperado > 0 && (
                      <span className="ganho-positivo-d">+{resultado.peRecuperado} PE</span>
                    )}
                  </div>

                  <div className="item-recurso-descanso">
                    <span className="rotulo-recurso-d">{resultado.semSanidade ? 'Determinação' : 'Sanidade'}</span>
                    <span className="valor-transicao-d">
                      {resultado.sanAtual} → <b style={{ color: 'var(--txt)' }}>{resultado.novoSan}</b> / {resultado.sanMax}
                    </span>
                    {resultado.sanRecuperado > 0 && (
                      <span className="ganho-positivo-d" style={{ color: '#38bdf8' }}>+{resultado.sanRecuperado} SAN</span>
                    )}
                  </div>
                </div>

                {(resultado.temExercitar || resultado.temLer) && (
                  <div style={{ marginTop: 6, fontSize: 12, color: 'var(--ok)' }}>
                    {resultado.temExercitar && `• Bónus de Exercício (+1d6 Físico ativo: ${resultado.novoBonusExercicio}) `}
                    {resultado.temLer && `• Bónus de Leitura (+1d6 Mental ativo: ${resultado.novoBonusLeitura})`}
                  </div>
                )}
              </div>

              <div className="modal-acoes" style={{ marginTop: 8 }}>
                <button type="button" className="btn ghost" onClick={aoFechar}>Cancelar</button>
                <button
                  type="button"
                  className="btn btn-aplicar-dano"
                  onClick={confirmarInterludio}
                  disabled={acoes.length === 0}
                >
                  Concluir Interlúdio
                </button>
              </div>
            </>
          ) : (
            /* Modo Atalhos Rápidos */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 0' }}>
              <div className="card-atalho-rapido-descanso">
                <div>
                  <b style={{ display: 'block', fontSize: 15, color: 'var(--txt)' }}>
                    Descanso Pleno (Recuperação Total)
                  </b>
                  <span style={{ fontSize: 13, color: 'var(--txt-dim)' }}>
                    Restaura 100% de PV, Sanidade/Determinação e PE, remove pontos temporários e limpa todas as condições.
                  </span>
                </div>
                <button
                  type="button"
                  className="btn sm"
                  style={{ background: 'var(--sangue)', color: '#fff', minWidth: 140 }}
                  onClick={confirmarDescansoPleno}
                >
                  Recuperar 100%
                </button>
              </div>

              <div className="card-atalho-rapido-descanso">
                <div>
                  <b style={{ display: 'block', fontSize: 15, color: 'var(--txt)' }}>
                    Limpar Condições & Temporários
                  </b>
                  <span style={{ fontSize: 13, color: 'var(--txt-dim)' }}>
                    Zera PV Temp, PE Temp, SAN Temp e limpa as condições ativas sem alterar a vida/sanidade atual.
                  </span>
                </div>
                <button
                  type="button"
                  className="btn ghost sm"
                  style={{ minWidth: 140 }}
                  onClick={confirmarLimpeza}
                >
                  Limpar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
