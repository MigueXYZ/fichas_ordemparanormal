import React, { useState, useMemo } from 'react';
import { TIPOS_DANO, TIPOS_DANO_POR_ID, calcularDanoRecebido, repartirResistenciasFicha } from '../../engine/danoRecetor.js';
import { reducaoDanoTrilhaAtiva } from '../../engine/monstruoso.js';
import { IconeLixo, IconeEscudo } from '../Icones.jsx';

export default function ModalReceberDano({
  personagem,
  max,
  defesas,
  nex,
  aoAplicarDano,
  aoFechar,
}) {
  const [parcelas, setParcelas] = useState([
    { valor: '', tipoId: 'perfuracao' },
  ]);

  const [bloqueioAtivo, setBloqueioAtivo] = useState(false);
  const [rdExtra, setRdExtra] = useState('');
  const [rdCustom, setRdCustom] = useState({});
  const [mostrarAjusteRd, setMostrarAjusteRd] = useState(false);

  const rdBloqueio = Number(defesas?.bloqueio?.valor || 0);
  const temBloqueioDisponivel = Boolean(defesas?.bloqueio?.disponivel);

  // Resistências da ficha (uma só lista): meias = marcadas sem número (½
  // dano); resistFicha = marcadas com número (RD fixa) — ver
  // engine/danoRecetor.js → repartirResistenciasFicha.
  const { meias: resistentesFicha, flat: resistFicha } = useMemo(() => {
    return repartirResistenciasFicha(personagem?.resistencias);
  }, [personagem?.resistencias]);

  // Redução de Dano concedida automaticamente pela Trilha do Monstruoso
  // (Combatente) — soma-se ao que a personagem marcou à mão (ver
  // engine/monstruoso.js → reducaoDanoTrilhaAtiva).
  const rdTrilha = useMemo(() => {
    return reducaoDanoTrilhaAtiva(personagem, nex);
  }, [personagem, nex]);

  const resultado = useMemo(() => {
    return calcularDanoRecebido({
      parcelas,
      personagem,
      max,
      bloqueioAtivo,
      rdBloqueio,
      rdExtra: Number(rdExtra) || 0,
      rdCustom,
      rdTrilha,
    });
  }, [parcelas, personagem, max, bloqueioAtivo, rdBloqueio, rdExtra, rdCustom, rdTrilha]);

  function adicionarParcela() {
    setParcelas((prev) => [...prev, { valor: '', tipoId: 'morte' }]);
  }

  function mudarParcela(idx, patch) {
    setParcelas((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  }

  function removerParcela(idx) {
    setParcelas((prev) => prev.filter((_, i) => i !== idx));
  }

  function confirmarDano() {
    const patch = {};
    if (resultado.totalLiquidoPv > 0 || resultado.pvTempAbsorvido > 0) {
      patch.pvAtual = resultado.novoPvAtual;
      patch.pvTemp = resultado.novoPvTemp;
    }
    if (resultado.totalLiquidoSan > 0) {
      if (resultado.semSanidade) {
        patch.pdAtual = resultado.novoSanAtual;
      } else {
        patch.sanAtual = resultado.novoSanAtual;
      }
    }

    aoAplicarDano(patch);
    aoFechar();
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-receber-dano" style={{ maxWidth: 540 }}>
        <div className="modal-topo">
          <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 20 }}>
            Recetor de Ataques & Dano
          </h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar"></button>
        </div>

        <div className="modal-corpo" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Informação do Agente */}
          <div className="card-info-dano-agente">
            <div>
              <span className="nome-agente-dano">{personagem?.nome || 'Agente'}</span>
              <span className="detalhe-pv-dano">
                PV: <b>{personagem?.pvAtual ?? max.pv}</b> / {max.pv}
                {(personagem?.pvTemp || 0) > 0 && (
                  <span className="tag-pv-temp-dano"> +{personagem.pvTemp} Temp</span>
                )}
              </span>
            </div>
            {resistentesFicha.size > 0 && (
              <div className="texto-resistencias-agente" title="Dano destes tipos fica a metade (arredondado para baixo)">
                <IconeEscudo size={13} style={{ marginRight: 4, verticalAlign: 'text-bottom' }} />
                Resistência (½ dano): {[...resistentesFicha].map((id) => TIPOS_DANO_POR_ID[id]?.nome).filter(Boolean).join(', ')}
              </div>
            )}
            {Object.keys(resistFicha).length > 0 && (
              <div className="texto-resistencias-agente" title="Resistência marcada com número na ficha — desconta esse valor ao dano">
                <IconeEscudo size={13} style={{ marginRight: 4, verticalAlign: 'text-bottom' }} />
                Resistência (nº): {Object.entries(resistFicha).map(([id, v]) => `${TIPOS_DANO_POR_ID[id]?.nome || id} ${v}`).join(', ')}
              </div>
            )}
            {Object.keys(rdTrilha).length > 0 && (
              <div className="texto-resistencias-agente" title="Redução de Dano concedida pela Trilha do Monstruoso (soma-se à Resistência marcada à mão)">
                <IconeEscudo size={13} style={{ marginRight: 4, verticalAlign: 'text-bottom' }} />
                Resistência (Trilha): {Object.entries(rdTrilha).map(([id, v]) => `${TIPOS_DANO_POR_ID[id]?.nome || id} ${v}`).join(', ')}
              </div>
            )}
          </div>

          {/* Parcelas de Dano */}
          <div className="seccao-parcelas-dano">
            <label className="rotulo-seccao-dano">Dano Sofrido</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {parcelas.map((p, idx) => (
                <div key={idx} className="linha-parcela-dano">
                  <div className="input-dano-wrap">
                    <input
                      type="number"
                      min="0"
                      autoFocus={idx === 0}
                      placeholder="Valor"
                      value={p.valor}
                      onChange={(e) => mudarParcela(idx, { valor: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="input-valor-dano"
                    />
                  </div>

                  <select
                    value={p.tipoId}
                    onChange={(e) => mudarParcela(idx, { tipoId: e.target.value })}
                    className="select-tipo-dano"
                  >
                    <optgroup label="Físico">
                      {TIPOS_DANO.filter((t) => t.categoria === 'Físico').map((t) => (
                        <option key={t.id} value={t.id}>{t.nome}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Elemental">
                      {TIPOS_DANO.filter((t) => t.categoria === 'Elemental').map((t) => (
                        <option key={t.id} value={t.id}>{t.nome}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Mental / Geral">
                      {TIPOS_DANO.filter((t) => t.categoria === 'Mental' || t.categoria === 'Geral').map((t) => (
                        <option key={t.id} value={t.id}>{t.nome}</option>
                      ))}
                    </optgroup>
                  </select>

                  {parcelas.length > 1 && (
                    <button
                      type="button"
                      className="btn danger sm btn-remover-parcela"
                      onClick={() => removerParcela(idx)}
                      title="Remover esta parcela de dano"
                    >
                      <IconeLixo size={14} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn ghost sm btn-add-parcela"
                onClick={adicionarParcela}
              >
                + Adicionar Outro Tipo de Dano (ex: Morte, Energia...)
              </button>
            </div>
          </div>

          {/* Opções de Redução de Dano (Bloqueio & Extras) */}
          <div className="card-opcoes-reducao">
            {temBloqueioDisponivel && (
              <label className="checkbox-bloqueio-dano">
                <input
                  type="checkbox"
                  checked={bloqueioAtivo}
                  onChange={(e) => setBloqueioAtivo(e.target.checked)}
                />
                <span>
                  <IconeEscudo size={14} style={{ marginRight: 4, verticalAlign: 'text-bottom' }} />
                  <b>Usei Bloqueio</b> (-{rdBloqueio} RD no dano do ataque)
                </span>
              </label>
            )}

            <div className="linha-rd-extra">
              <span className="rotulo-rd-extra">RD Extra Temporária:</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={rdExtra}
                onChange={(e) => setRdExtra(e.target.value === '' ? '' : Number(e.target.value))}
                className="input-rd-extra"
                title="Bónus de rituais como Armadura de Sangue, Tela de Ruído, etc."
              />
            </div>

            <div style={{ marginTop: 6 }}>
              <button
                type="button"
                className="btn-link-ajuste-rd"
                onClick={() => setMostrarAjusteRd(!mostrarAjusteRd)}
              >
                {mostrarAjusteRd ? '▲ Ocultar Resistência (nº) ativa' : '▼ Ver / Ajustar Resistência (nº) ativa'}
              </button>

              {mostrarAjusteRd && (
                <div className="grelha-ajuste-rd">
                  {TIPOS_DANO.filter((t) => !t.ignoraRd).map((t) => {
                    const val = rdCustom[t.id] ?? (Number(resistFicha[t.id] || 0) + Number(rdTrilha[t.id] || 0));
                    return (
                      <div key={t.id} className="item-ajuste-rd">
                        <span className="nome-tipo-rd" style={{ color: t.cor }}>{t.nome}</span>
                        <input
                          type="number"
                          min="0"
                          value={val || ''}
                          placeholder="0"
                          onChange={(e) => {
                            const n = e.target.value === '' ? 0 : Number(e.target.value);
                            setRdCustom((prev) => ({ ...prev, [t.id]: n }));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Resumo do Cálculo e Impacto */}
          <div className="card-resumo-calculo-dano">
            <div className="titulo-resumo-dano">Pré-visualização do Impacto</div>

            <div className="lista-detalhes-calculo">
              {resultado.detalhesParcelas.map((d, i) => (
                <div key={i} className="linha-detalhe-dano">
                  <span style={{ color: d.tipo.cor }}>
                    • {d.valorBruto} {d.tipo.nome}{d.resistente ? ' (½ Resist.)' : ''}
                  </span>
                  <span className="valor-calculo-passo">
                    {d.reducaoTotal > 0 ? (
                      <>
                        <span className="subtracao-rd">−{d.reducaoTotal}{d.resistente ? '' : ' RD'}</span> ={' '}
                        <b>{d.danoLiquido} dano</b>
                      </>
                    ) : (
                      <b>= {d.danoLiquido} dano</b>
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="divisor-resumo-dano" />

            <div className="linha-total-dano">
              <span>Total de Dano Sofrido:</span>
              <b className="num-total-dano">
                {resultado.totalLiquidoPv > 0 && `${resultado.totalLiquidoPv} PV`}
                {resultado.totalLiquidoPv > 0 && resultado.totalLiquidoSan > 0 && ' + '}
                {resultado.totalLiquidoSan > 0 && `${resultado.totalLiquidoSan} SAN`}
                {resultado.totalLiquidoPv === 0 && resultado.totalLiquidoSan === 0 && '0 (Todo Bloqueado / Resistido)'}
              </b>
            </div>

            {resultado.pvTempAbsorvido > 0 && (
              <div className="linha-absorcao-temp">
                {resultado.pvTempAbsorvido} de dano absorvido pelo PV Temporário (resta {resultado.novoPvTemp} Temp).
              </div>
            )}

            <div className="linha-resultado-pv-final">
              <span>Resultado na Ficha:</span>
              <span className="impacto-pv-destaque">
                {resultado.pvAtual} PV → <b style={{ color: resultado.novoPvAtual <= 0 ? 'var(--sangue-claro)' : 'var(--txt)' }}>{resultado.novoPvAtual} PV</b>
                {resultado.totalLiquidoSan > 0 && (
                  <span style={{ marginLeft: 8, color: '#38bdf8' }}>
                    ({resultado.sanAtual} SAN → <b>{resultado.novoSanAtual} SAN</b>)
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="modal-acoes" style={{ marginTop: 8 }}>
            <button type="button" className="btn ghost" onClick={aoFechar}>Cancelar</button>
            <button
              type="button"
              className="btn btn-aplicar-dano"
              onClick={confirmarDano}
              disabled={resultado.totalBruto === 0}
            >
              Aplicar Dano à Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
