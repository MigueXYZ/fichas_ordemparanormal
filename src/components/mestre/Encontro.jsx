import React, { useMemo, useState } from 'react';
import { vdParaGrupo } from '../../engine/geradores.js';

export default function Encontro({
  ameacas = [],
  agentes = [],
  agentesConectados = [],
  aoIniciarCombate,
}) {
  // Modo de Agentes: 'conectados' | 'salvos' | 'manual'
  const [modoAgentes, setModoAgentes] = useState('conectados');
  const [qtdAgentesManual, setQtdAgentesManual] = useState(4);
  const [nexAgenteManual, setNexAgenteManual] = useState(20);
  const [agentesSelecionados, setAgentesSelecionados] = useState({});
  const [conectadosSelecionados, setConectadosSelecionados] = useState({});

  // Controlo de quantidades de inimigos (ameaças / cultistas)
  const [qtds, setQtds] = useState({});

  // Inicializar conectados como selecionados por padrão
  React.useEffect(() => {
    if (agentesConectados.length > 0) {
      const mapa = {};
      agentesConectados.forEach((a) => {
        mapa[a.codigo || a.nome] = true;
      });
      setConectadosSelecionados(mapa);
    }
  }, [agentesConectados]);

  // Cálculo do NEX Total do Grupo
  const nexGrupoTotal = useMemo(() => {
    if (modoAgentes === 'manual') {
      return Math.max(5, (Number(qtdAgentesManual) || 1) * (Number(nexAgenteManual) || 5));
    }
    if (modoAgentes === 'conectados') {
      const selecionados = agentesConectados.filter((a) => conectadosSelecionados[a.codigo || a.nome]);
      if (selecionados.length === 0) return 20;
      return selecionados.reduce((soma, a) => soma + (Number(a.nex) || 20), 0);
    }
    // Fichas guardadas
    const selecionados = agentes.filter((a) => agentesSelecionados[a.id]);
    if (selecionados.length === 0) return 20;
    return selecionados.reduce((soma, a) => soma + (Number(a.nex) || 5), 0);
  }, [modoAgentes, qtdAgentesManual, nexAgenteManual, agentes, agentesSelecionados, agentesConectados, conectadosSelecionados]);

  // Limiares de Dificuldade de VD
  const vdFacil = Math.round(nexGrupoTotal * 0.5);
  const vdEquilibrado = Math.round(nexGrupoTotal * 1.0);
  const vdDificil = Math.round(nexGrupoTotal * 1.5);
  const vdMortal = Math.round(nexGrupoTotal * 2.0);

  // Soma de VD de todas as ameaças e cultistas no encontro
  const totalVD = useMemo(
    () => ameacas.reduce((soma, a) => soma + (Number(qtds[a.id]) || 0) * (Number(a.vd) || 0), 0),
    [ameacas, qtds]
  );

  const inimigosSelecionados = useMemo(
    () => ameacas.filter((a) => (qtds[a.id] || 0) > 0),
    [ameacas, qtds]
  );

  const totalInimigosQtd = useMemo(
    () => inimigosSelecionados.reduce((soma, a) => soma + (Number(qtds[a.id]) || 0), 0),
    [inimigosSelecionados, qtds]
  );

  function mudarQtd(id, delta) {
    setQtds((q) => {
      const atual = q[id] || 0;
      const novo = Math.max(0, atual + delta);
      return { ...q, [id]: novo };
    });
  }

  function alternarAgente(id) {
    setAgentesSelecionados((ant) => ({
      ...ant,
      [id]: !ant[id],
    }));
  }

  function alternarConectado(cod) {
    setConectadosSelecionados((ant) => ({
      ...ant,
      [cod]: !ant[cod],
    }));
  }

  function avaliacaoDificuldade() {
    if (totalVD <= 0) return { texto: 'Nenhum inimigo selecionado', cor: 'var(--txt-fraco)', badge: 'Vazio' };
    if (totalVD < vdFacil) return { texto: 'Muito Fácil (sem risco real para a equipa)', cor: 'var(--txt-fraco)', badge: 'Muito Fácil' };
    if (totalVD <= vdFacil * 1.1) return { texto: 'Fácil (combate leve, consome poucos recursos)', cor: '#22c55e', badge: 'Fácil' };
    if (totalVD <= vdEquilibrado) return { texto: 'Equilibrado (desafiante na medida certa)', cor: '#eab308', badge: 'Equilibrado' };
    if (totalVD <= vdDificil) return { texto: 'Difícil (ameaça séria, pode causar baixas)', cor: '#f97316', badge: 'Difícil' };
    return { texto: 'Extremo / Mortal (perigo iminente de TPK / morte)', cor: 'var(--sangue-claro)', badge: 'Extremo / Mortal' };
  }
  const statusDif = avaliacaoDificuldade();

  // Iniciar combate com todos os agentes e inimigos selecionados
  function handleEnviarCombate() {
    if (!aoIniciarCombate) return;

    const combatentes = [];

    // Adicionar Agentes
    if (modoAgentes === 'manual') {
      for (let i = 1; i <= Number(qtdAgentesManual); i++) {
        combatentes.push({
          id: `agente-auto-${i}-${Date.now()}`,
          nome: `Agente ${i}`,
          tipo: 'agente',
          subtipo: 'agente',
          equipaId: 'equipa-1',
          nex: Number(nexAgenteManual),
          agi: 2,
          pv: { atual: 20 + Math.floor(nexAgenteManual / 5) * 4, max: 20 + Math.floor(nexAgenteManual / 5) * 4, temp: 0 },
        });
      }
    } else if (modoAgentes === 'conectados') {
      const ags = agentesConectados.filter((a) => conectadosSelecionados[a.codigo || a.nome]);
      for (const a of ags) {
        combatentes.push({
          id: a.codigo || `ag-peer-${Date.now()}`,
          nome: a.nome,
          tipo: 'agente',
          subtipo: 'agente',
          equipaId: 'equipa-1',
          nex: Number(a.nex || 20),
          agi: Number(a.atributos?.agi ?? 2),
          pv: a.pv || { atual: 20, max: 20, temp: 0 },
          san: a.san || null,
          pe: a.pe || null,
          condicoes: a.condicoes || [],
        });
      }
    } else {
      const ags = agentes.filter((a) => agentesSelecionados[a.id]);
      for (const a of ags) {
        combatentes.push({
          id: a.id,
          nome: a.nome,
          tipo: 'agente',
          subtipo: 'agente',
          equipaId: 'equipa-1',
          nex: Number(a.nex || 20),
          agi: Number(a.atributos?.agi || 1),
          pv: { atual: a.pvAtual || 20, max: a.pvMax || 20, temp: 0 },
          san: a.sanAtual ? { atual: a.sanAtual, max: a.sanMax || 10, temp: 0 } : null,
          pe: a.peAtual ? { atual: a.peAtual, max: a.peMax || 5, temp: 0 } : null,
          condicoes: a.condicoes || [],
        });
      }
    }

    // Adicionar Inimigos (Criaturas e Ocultistas)
    for (const a of inimigosSelecionados) {
      const count = Number(qtds[a.id]) || 1;
      const ehOcultista = a.subtipo === 'ocultista' || a.subtipo === 'ocultista_inimigo';
      for (let i = 1; i <= count; i++) {
        combatentes.push({
          id: `${a.id}-${i}-${Date.now()}`,
          nome: count > 1 ? `${a.nome} #${i}` : a.nome,
          tipo: ehOcultista ? 'npc' : 'ameaca',
          subtipo: ehOcultista ? 'ocultista' : 'criatura',
          equipaId: 'equipa-2',
          vd: Number(a.vd || 20),
          agi: Number(a.testes?.reflexos ? 2 : 1),
          pv: { atual: Number(a.pv || 30), max: Number(a.pv || 30), temp: 0 },
          defesa: Number(a.defesa || 15),
          condicoes: [],
        });
      }
    }

    aoIniciarCombate(combatentes);
  }

  return (
    <div style={{ marginTop: 8 }}>
      <p className="dica" style={{ marginTop: 0 }}>
        Planeador de Encontros de Ordem Paranormal RPG: adiciona múltiplos agentes (incluindo jogadores conectados em tempo real) e múltiplas criaturas/ocultistas para calcular automaticamente o equilíbrio de VD.
      </p>

      {/* Grid de Configuração: Agentes vs Inimigos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Lado 1: Configuração dos Agentes */}
        <div className="painel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 18 }}>Equipa de Agentes</h4>
            <div className="interruptor" style={{ fontSize: 12 }}>
              <button
                type="button"
                className={modoAgentes === 'conectados' ? 'ativo' : ''}
                onClick={() => setModoAgentes('conectados')}
              >
                Conectados ({agentesConectados.length})
              </button>
              <button
                type="button"
                className={modoAgentes === 'salvos' ? 'ativo' : ''}
                onClick={() => setModoAgentes('salvos')}
              >
                Fichas ({agentes.length})
              </button>
              <button
                type="button"
                className={modoAgentes === 'manual' ? 'ativo' : ''}
                onClick={() => setModoAgentes('manual')}
              >
                Manual
              </button>
            </div>
          </div>

          {/* Agentes Conectados em Tempo Real */}
          {modoAgentes === 'conectados' && (
            <div>
              {agentesConectados.length === 0 ? (
                <p className="dica" style={{ fontSize: 12 }}>
                  Nenhum jogador conectado via Hub no momento. Alterna para "Fichas" ou "Manual" acima.
                </p>
              ) : (
                <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid var(--borda)', borderRadius: 4, padding: 4 }}>
                  {agentesConectados.map((a) => {
                    const cod = a.codigo || a.nome;
                    return (
                      <label
                        key={cod}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '5px 8px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          cursor: 'pointer',
                          fontSize: 13,
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="checkbox"
                            checked={Boolean(conectadosSelecionados[cod])}
                            onChange={() => alternarConectado(cod)}
                          />
                          <b>{a.nome}</b>
                        </span>
                        <span style={{ color: '#38bdf8', fontSize: 12, fontWeight: 'bold' }}>
                          [NEX {a.nex || 20}%]
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Fichas Salvas */}
          {modoAgentes === 'salvos' && (
            <div>
              {agentes.length === 0 ? (
                <p className="dica" style={{ fontSize: 12 }}>Nenhum agente guardado. Alterna para o modo manual acima.</p>
              ) : (
                <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid var(--borda)', borderRadius: 4, padding: 4 }}>
                  {agentes.map((a) => (
                    <label
                      key={a.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '5px 8px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                        fontSize: 13,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={Boolean(agentesSelecionados[a.id])}
                          onChange={() => alternarAgente(a.id)}
                        />
                        <span>{a.nome}</span>
                      </span>
                      <span style={{ color: '#38bdf8', fontSize: 12, fontWeight: 'bold' }}>
                        [NEX {a.nex}%]
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Modo Manual */}
          {modoAgentes === 'manual' && (
            <div className="grelha-editor" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="campo">
                <label>Número de Agentes</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={qtdAgentesManual}
                  onChange={(e) => setQtdAgentesManual(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div className="campo">
                <label>NEX Médio</label>
                <input
                  type="number"
                  min="5"
                  max="99"
                  step="5"
                  value={nexAgenteManual}
                  onChange={(e) => setNexAgenteManual(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: 12, borderTop: '1px solid var(--borda)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span>NEX Total da Equipa:</span>
            <b style={{ color: '#38bdf8', fontSize: 16 }}>{nexGrupoTotal}%</b>
          </div>
        </div>

        {/* Lado 2: Resumo e Comparação de Dificuldade */}
        <div className="painel" style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h4 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 18 }}>Balanço do Encontro</h4>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.08)',
                  color: statusDif.cor,
                  border: `1px solid ${statusDif.cor}`,
                }}
              >
                {statusDif.badge}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '8px 0' }}>
              <span style={{ fontSize: 28, fontFamily: 'var(--display)', fontWeight: 'bold', color: 'var(--txt)' }}>
                VD {totalVD}
              </span>
              <span style={{ fontSize: 13, color: 'var(--txt-dim)' }}>
                / Recomendado: VD {vdEquilibrado}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: 12, color: statusDif.cor, lineHeight: 1.4 }}>
              {statusDif.texto}
            </p>

            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--txt-fraco)' }}>
              Limiares: Fácil <b>{vdFacil}</b> · Equilibrado <b>{vdEquilibrado}</b> · Difícil <b>{vdDificil}</b> · Mortal <b>{vdMortal}</b>
            </div>
          </div>

          <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--borda)' }}>
            <button
              type="button"
              className="btn"
              style={{ width: '100%', fontWeight: 'bold' }}
              disabled={totalInimigosQtd === 0}
              onClick={handleEnviarCombate}
            >
              Iniciar Combate com este Encontro ({totalInimigosQtd} {totalInimigosQtd === 1 ? 'inimigo' : 'inimigos'}) →
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Criaturas e Ocultistas no Bestiário */}
      <div className="painel" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 18 }}>
            Criaturas & Ocultistas Guardados ({ameacas.length})
          </h4>
          <span className="dica" style={{ margin: 0 }}>Ajusta as quantidades para compor o encontro</span>
        </div>

        {ameacas.length === 0 ? (
          <p className="dica" style={{ fontSize: 13 }}>
            Ainda não tens nenhuma criatura ou ocultista guardado no Bestiário. Usa a aba <b>Gerar</b> para criar e guardar ameaças.
          </p>
        ) : (
          <ul className="previa-pericias">
            {ameacas.map((a) => {
              const qtd = qtds[a.id] || 0;
              const ehOcultista = a.subtipo === 'ocultista' || a.subtipo === 'ocultista_inimigo';
              return (
                <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                  <div>
                    <span className="pn" style={{ fontWeight: 'bold', fontSize: 14 }}>{a.nome}</span>
                    {/* VD Singular em Destaque à frente do nome */}
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 11,
                        fontWeight: 'bold',
                        padding: '1px 6px',
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.06)',
                        color: ehOcultista ? '#c084fc' : 'var(--sangue-claro)',
                        border: `1px solid ${ehOcultista ? '#c084fc' : 'var(--sangue-claro)'}`,
                      }}
                    >
                      VD {a.vd} · {ehOcultista ? 'Ocultista' : 'Criatura'}
                    </span>
                    <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--txt-fraco)' }}>
                      PV {a.pv} · DEF {a.defesa}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      className="btn ghost sm"
                      onClick={() => mudarQtd(a.id, -1)}
                      disabled={!qtd}
                    >
                      −
                    </button>
                    <b style={{ minWidth: 20, textAlign: 'center', fontSize: 14 }}>{qtd}</b>
                    <button
                      type="button"
                      className="btn ghost sm"
                      onClick={() => mudarQtd(a.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
