import React, { useMemo, useState } from 'react';
import { prepararAtaques } from '../../engine/combateAtaques.js';
import { TIPOS_DANO, calcularDanoRecebido, repartirResistenciasFicha, tipoDanoParaId } from '../../engine/danoRecetor.js';

/**
 * "Caixa de dar dano" — ataques, habilidades e poderes de uma unidade
 * (agente ou ameaça), com atacar / só rolar dano rápidos, para não ter de
 * abrir a ficha completa. Partilhada entre o Rastreador de Combate e os
 * Cartões de Batalha — construída em cima de `prepararAtaques` (ver
 * engine/combateAtaques.js), que já sabe ler tanto armas de agente como
 * ações de ameaça.
 *
 * `unidade`: { id, nome, tipo, subtipo, ficha, equipaId, pv:{atual,max}, defesa }
 * `alvos`: [{ id, nome, defesa, equipaId, pv, resistencias }] — candidatos a
 * alvo do ataque (não inclui a própria unidade). `equipaId` é só usado para
 * escolher um alvo "do outro lado" por omissão — funciona com qualquer valor
 * (id de equipa do Rastreador, ou 'ladoA'/'ladoB' dos Cartões).
 * `onAplicarDano(alvoId, quantidade)` — opcional; sem ele os ataques só
 * rolam, sem aplicar dano automaticamente ao acertar. É dano em bruto, sem
 * olhar às Resistências do alvo (usado pelo "Atacar" automático e, na falta
 * de `onAplicarDanoResistido`, também pelo "Só Dano").
 * `onAplicarDanoResistido(alvoId, resultado)` — opcional; liga a secção
 * manual "Dar Dano" E o botão "Só Dano" de cada ataque (rola só o dano e já
 * aplica ao alvo escolhido) — ambos descontam as Resistências marcadas na
 * ficha do alvo antes de aplicar (ver engine/danoRecetor.js → calcularDanoRecebido).
 * `onEditar` — opcional; mostra um botão "Editar Ficha" no topo do modal.
 */
export default function PainelDetalheUnidade({ unidade, alvos = [], onFechar, onRolar, onAplicarDano, onAplicarDanoResistido, onEditar }) {
  const ataques = useMemo(() => prepararAtaques(unidade), [unidade]);
  const ficha = unidade?.ficha;
  const habilidades = Array.isArray(ficha?.habilidades) ? ficha.habilidades : [];
  const poderes = Array.isArray(ficha?.poderes) ? ficha.poderes : [];

  const alvoPadrao = useMemo(() => {
    const outroLado = alvos.find((a) => a.equipaId !== unidade?.equipaId);
    return (outroLado || alvos[0] || {}).id || '';
  }, [alvos, unidade?.equipaId]);
  const [alvoId, setAlvoId] = useState(alvoPadrao);
  const [ultimoPorLinha, setUltimoPorLinha] = useState({});

  const alvo = alvos.find((a) => a.id === alvoId) || null;

  // --------------------------------------------------------- Dar Dano (manual, com Resistências)
  const [mostrarDano, setMostrarDano] = useState(false);
  const [parcelasDano, setParcelasDano] = useState([{ valor: '', tipoId: 'geral' }]);

  const resistenciasAlvo = useMemo(() => repartirResistenciasFicha(alvo?.resistencias), [alvo?.resistencias]);

  const resultadoDano = useMemo(() => {
    if (!alvo) return null;
    return calcularDanoRecebido({
      parcelas: parcelasDano,
      personagem: { resistencias: alvo.resistencias || [], pvAtual: alvo.pv?.atual, pvTemp: 0 },
      max: { pv: alvo.pv?.max },
    });
  }, [parcelasDano, alvo]);

  function mudarParcelaDano(idx, patch) {
    setParcelasDano((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  }
  function adicionarParcelaDano() {
    setParcelasDano((prev) => [...prev, { valor: '', tipoId: 'geral' }]);
  }
  function removerParcelaDano(idx) {
    setParcelasDano((prev) => prev.filter((_, i) => i !== idx));
  }
  function aplicarDanoManual() {
    if (!alvo || !resultadoDano || !onAplicarDanoResistido) return;
    onAplicarDanoResistido(alvo.id, resultadoDano);
    setUltimoPorLinha((prev) => ({
      ...prev,
      __dano: `−${resultadoDano.totalLiquidoPv || 0} PV${resultadoDano.totalLiquidoSan ? ` · −${resultadoDano.totalLiquidoSan} SAN` : ''} em ${alvo.nome}`,
    }));
    setParcelasDano([{ valor: '', tipoId: 'geral' }]);
  }

  function atacarLinha(item) {
    const { acerto, dano } = item.rolar();
    // Um ataque de arma (agente) já vem com o dano embrulhado no próprio
    // cartão (tipo "ataque" — acerto e dano lado a lado); uma ação de
    // ameaça é sempre dois rolamentos separados. Só publica os dois em
    // separado quando não vêm já combinados, para não duplicar o cartão.
    const combinado = acerto?.tipo === 'ataque';
    if (acerto) onRolar(acerto);
    if (dano && !combinado) onRolar(dano);

    let msg = null;
    if (alvo && acerto) {
      const acertou = acerto.total >= Number(alvo.defesa || 10);
      msg = acertou
        ? `Acertou ${alvo.nome} (Defesa ${alvo.defesa})`
        : `Falhou — não passou a Defesa ${alvo.defesa} de ${alvo.nome}`;
      if (acertou && dano && onAplicarDano) {
        onAplicarDano(alvo.id, dano.total);
        msg += ` · −${dano.total} PV`;
      }
    }
    setUltimoPorLinha((prev) => ({ ...prev, [item.id]: msg }));
  }

  // "Só Dano" — para quando o acerto já é dado como certo (crítico automático,
  // ação sem teste, etc.): rola só o dano da arma/ação e aplica-o já ao alvo
  // escolhido, a passar pelas Resistências (o mesmo motor do "Dar Dano"
  // manual) em vez de só mostrar o rolamento e não fazer mais nada com ele.
  function soDano(item) {
    const { dano } = item.rolar();
    if (dano) onRolar(dano);

    if (!dano) return;
    if (!alvo) {
      setUltimoPorLinha((prev) => ({ ...prev, [item.id]: 'Escolhe um alvo acima para aplicar este dano.' }));
      return;
    }

    if (onAplicarDanoResistido) {
      const resultado = calcularDanoRecebido({
        parcelas: [{ valor: dano.total, tipoId: tipoDanoParaId(dano.tipoDano) }],
        personagem: { resistencias: alvo.resistencias || [], pvAtual: alvo.pv?.atual, pvTemp: 0 },
        max: { pv: alvo.pv?.max },
      });
      onAplicarDanoResistido(alvo.id, resultado);
      const reducaoTxt = resultado.totalReducao ? ` (−${resultado.totalReducao} por Resistência)` : '';
      setUltimoPorLinha((prev) => ({
        ...prev,
        [item.id]: `−${resultado.totalLiquidoPv} PV${resultado.totalLiquidoSan ? ` · −${resultado.totalLiquidoSan} SAN` : ''} em ${alvo.nome}${reducaoTxt}`,
      }));
    } else if (onAplicarDano) {
      onAplicarDano(alvo.id, dano.total);
      setUltimoPorLinha((prev) => ({ ...prev, [item.id]: `−${dano.total} PV em ${alvo.nome}` }));
    }
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal" style={{ maxWidth: 560, maxHeight: '85vh', overflowY: 'auto' }}>
        <div className="modal-topo">
          <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>{unidade?.nome}</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {onEditar && (
              <button type="button" className="btn ghost sm" onClick={onEditar}>Editar Ficha</button>
            )}
            <button className="fechar" onClick={onFechar}>×</button>
          </div>
        </div>
        <div className="modal-corpo" style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 14, fontSize: 13, color: 'var(--txt-dim)' }}>
            <span><b>PV</b> {unidade?.pv?.atual ?? '—'}/{unidade?.pv?.max ?? '—'}</span>
            <span><b>Defesa</b> {unidade?.defesa ?? '—'}</span>
          </div>

          {alvos.length > 0 && (
            <div className="campo" style={{ marginBottom: 14 }}>
              <label>Alvo</label>
              <select value={alvoId} onChange={(e) => setAlvoId(e.target.value)}>
                <option value="">— sem alvo, só rolar —</option>
                {alvos.map((a) => (
                  <option key={a.id} value={a.id}>{a.nome} (Defesa {a.defesa})</option>
                ))}
              </select>
            </div>
          )}

          {onAplicarDanoResistido && (
            <div className="campo" style={{ marginBottom: 14 }}>
              <button type="button" className="btn ghost sm" onClick={() => setMostrarDano((v) => !v)} disabled={!alvo}>
                {mostrarDano ? '▲ Fechar Dar Dano' : '▼ Dar Dano ao Alvo'}
              </button>
              {!alvo && <span className="dica" style={{ marginLeft: 8, fontSize: 11 }}>Escolhe um alvo acima primeiro.</span>}

              {mostrarDano && alvo && (
                <div style={{ marginTop: 10, padding: 10, border: '1px solid var(--borda)', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
                  {(resistenciasAlvo.meias.size > 0 || Object.keys(resistenciasAlvo.flat).length > 0) && (
                    <p className="dica" style={{ fontSize: 11, marginTop: 0, marginBottom: 8 }}>
                      Resistências de {alvo.nome}:{' '}
                      {[...resistenciasAlvo.meias].map((id) => `${id} (½)`).concat(
                        Object.entries(resistenciasAlvo.flat).map(([id, v]) => `${id} −${v}`)
                      ).join(', ')}
                    </p>
                  )}

                  {parcelasDano.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                      <input
                        type="number"
                        min="0"
                        placeholder="Valor"
                        value={p.valor}
                        onChange={(e) => mudarParcelaDano(idx, { valor: e.target.value === '' ? '' : Number(e.target.value) })}
                        style={{ width: 80 }}
                      />
                      <select value={p.tipoId} onChange={(e) => mudarParcelaDano(idx, { tipoId: e.target.value })} style={{ flex: 1 }}>
                        {TIPOS_DANO.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                      </select>
                      {parcelasDano.length > 1 && (
                        <button type="button" className="btn ghost sm" onClick={() => removerParcelaDano(idx)} title="Remover">×</button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn ghost sm" onClick={adicionarParcelaDano} style={{ marginBottom: 10 }}>+ Outro tipo de dano</button>

                  {resultadoDano && (
                    <div style={{ fontSize: 13, marginBottom: 10 }}>
                      Dano líquido: <b>{resultadoDano.totalLiquidoPv} PV</b>
                      {resultadoDano.totalLiquidoSan > 0 && <> · <b>{resultadoDano.totalLiquidoSan} SAN</b></>}
                      {resultadoDano.totalReducao > 0 && <span className="dica"> (−{resultadoDano.totalReducao} por Resistência)</span>}
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn sm"
                    onClick={aplicarDanoManual}
                    disabled={!resultadoDano || resultadoDano.totalBruto === 0}
                  >
                    Aplicar Dano
                  </button>
                  {ultimoPorLinha.__dano && (
                    <div style={{ marginTop: 6, fontSize: 12, color: 'var(--sangue-claro)' }}>{ultimoPorLinha.__dano}</div>
                  )}
                </div>
              )}
            </div>
          )}

          <h4 style={{ marginBottom: 6 }}>Ataques</h4>
          {ataques.length === 0 && <p className="dica">Sem ataques registados.</p>}
          {ataques.map((item) => (
            <div key={item.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--borda)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div>
                  <b>{item.nome}</b>
                  {item.detalhe && <div style={{ fontSize: 12, color: 'var(--txt-fraco)' }}>{item.detalhe}</div>}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button type="button" className="btn sm" onClick={() => atacarLinha(item)}>Atacar</button>
                  <button type="button" className="btn ghost sm" onClick={() => soDano(item)}>Só Dano</button>
                </div>
              </div>
              {ultimoPorLinha[item.id] && (
                <div style={{ marginTop: 4, fontSize: 12, color: 'var(--sangue-claro)' }}>{ultimoPorLinha[item.id]}</div>
              )}
            </div>
          ))}

          {habilidades.length > 0 && (
            <>
              <h4 style={{ marginTop: 18, marginBottom: 6 }}>Habilidades</h4>
              {habilidades.map((h, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <b>{h.nome}</b>
                  {h.descricao && <div style={{ fontSize: 13, color: 'var(--txt-dim)' }}>{h.descricao}</div>}
                </div>
              ))}
            </>
          )}

          {poderes.length > 0 && (
            <>
              <h4 style={{ marginTop: 18, marginBottom: 6 }}>Poderes</h4>
              {poderes.map((p, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <b>{p.nome}</b>
                  {p.descricao && <div style={{ fontSize: 13, color: 'var(--txt-dim)' }}>{p.descricao}</div>}
                </div>
              ))}
            </>
          )}

          {!ficha && (
            <p className="dica" style={{ marginTop: 14 }}>
              Sem ficha associada — por isso não há ataques, habilidades ou poderes para mostrar aqui.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
