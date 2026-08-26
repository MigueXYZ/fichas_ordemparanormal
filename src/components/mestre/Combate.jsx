import React, { useState, useMemo } from 'react';
import {
  estadoCombateVazio,
  adicionarCombatente,
  removerCombatente,
  editarCombatente,
  proximoTurno,
  turnoAnterior,
  rolarIniciativaGeral,
  rolarIniciativa,
  adicionarEquipa,
  removerEquipa,
  editarEquipa,
  mudarEquipaCombatente,
  adicionarEfeitoCombatente,
  removerEfeitoCombatente,
  alternarCondicaoCombatente,
  CORES_EQUIPAS,
} from '../../engine/combateTracker.js';
import { CONDICOES } from '../../data/condicoes.js';

export default function Combate({
  estadoCombate,
  setEstadoCombate,
  ameacas = [],
  agentes = [],
  agentesConectados = [],
}) {
  const estado = estadoCombate || estadoCombateVazio();
  const setEstado = setEstadoCombate;

  const [visao, setVisao] = useState('equipas'); // 'equipas' | 'turnos'
  const [painelAdicionar, setPainelAdicionar] = useState(false);
  const [abaBanco, setAbaBanco] = useState('conectados'); // 'conectados' | 'fichas' | 'bestiario' | 'manual'
  const [equipaDestino, setEquipaDestino] = useState(estado.equipas?.[0]?.id || 'equipa-1');

  const [modalEfeito, setModalEfeito] = useState(null); // combatenteId
  const [nomeEfeito, setNomeEfeito] = useState('');
  const [duracaoEfeito, setDuracaoEfeito] = useState('2');

  // Criação manual
  const [novoNome, setNovoNome] = useState('');
  const [novoVd, setNovoVd] = useState(20);
  const [novoAgi, setNovoAgi] = useState(1);
  const [novoPv, setNovoPv] = useState(20);
  const [novoDef, setNovoDef] = useState(10);
  const [novoTipo, setNovoTipo] = useState('npc');

  // Drag and drop
  const [combatenteArrastadoId, setCombatenteArrastadoId] = useState(null);

  const equipas = estado.equipas || [];
  const combatentes = estado.combatentes || [];
  const combatenteAtivo = combatentes[estado.turnoIndex] || null;

  // Estatísticas por equipa (Membros, VD Total, PV Total)
  const statsEquipas = useMemo(() => {
    return equipas.map((eq) => {
      const membros = combatentes.filter((c) => c.equipaId === eq.id);
      const totalVD = membros.reduce((soma, c) => soma + (Number(c.vd || c.nex) || 0), 0);
      const pvAtualTotal = membros.reduce((soma, c) => soma + (Number(c.pv?.atual) || 0), 0);
      const pvMaxTotal = membros.reduce((soma, c) => soma + (Number(c.pv?.max) || 0), 0);
      return {
        ...eq,
        membros,
        totalVD,
        pvAtualTotal,
        pvMaxTotal,
      };
    });
  }, [equipas, combatentes]);

  // Controlo de Turnos e Iniciativas
  function avancar() {
    setEstado((est) => proximoTurno(est));
  }

  function retroceder() {
    setEstado((est) => turnoAnterior(est));
  }

  function rolarTodos() {
    setEstado((est) => rolarIniciativaGeral(est, false));
  }

  function rolarApenasSem() {
    setEstado((est) => rolarIniciativaGeral(est, true));
  }

  function rolarIndividual(id) {
    setEstado((est) => {
      const c = est.combatentes.find((x) => x.id === id);
      if (!c) return est;
      const rolo = rolarIniciativa(c.agi || 0, c.bonusIniciativa || 0);
      return editarCombatente(est, id, { iniciativa: rolo.total, iniciativaRolada: true, ultimaRolagemIni: rolo });
    });
  }

  function alterarPv(id, delta) {
    setEstado((est) => {
      const c = est.combatentes.find((x) => x.id === id);
      if (!c) return est;
      const atual = Number(c.pv?.atual || 0);
      const novo = Math.max(0, atual + delta);
      return editarCombatente(est, id, { pv: { atual: novo } });
    });
  }

  // Gestão de Equipas
  function handleCriarEquipa() {
    setEstado((est) => adicionarEquipa(est));
  }

  function handleRemoverEquipa(eqId) {
    if (equipas.length <= 1) return;
    setEstado((est) => removerEquipa(est, eqId));
  }

  function handleRenomearEquipa(eqId, nome) {
    setEstado((est) => editarEquipa(est, eqId, { nome }));
  }

  // Drag and Drop de combatentes entre equipas
  function handleDragStart(id) {
    setCombatenteArrastadoId(id);
  }

  function handleDropNaEquipa(targetEquipaId) {
    if (!combatenteArrastadoId) return;
    setEstado((est) => mudarEquipaCombatente(est, combatenteArrastadoId, targetEquipaId));
    setCombatenteArrastadoId(null);
  }

  // Adições rápidas ao combate
  function handleAdicionarAgenteConectado(ag) {
    setEstado((est) =>
      adicionarCombatente(est, {
        id: ag.codigo || `ag-peer-${Date.now()}`,
        nome: ag.nome || 'Agente Conectado',
        tipo: 'agente',
        subtipo: 'agente',
        equipaId: equipaDestino,
        nex: Number(ag.nex || 20),
        agi: Number(ag.atributos?.agi ?? 2),
        pv: ag.pv || { atual: 20, max: 20, temp: 0 },
        san: ag.san || null,
        pe: ag.pe || null,
        defesa: Number(ag.defesa || 12),
        condicoes: ag.condicoes || [],
      })
    );
  }

  function handleAdicionarFichaGuardada(ficha) {
    setEstado((est) =>
      adicionarCombatente(est, {
        id: ficha.id || `ag-${Date.now()}`,
        nome: ficha.nome,
        tipo: 'agente',
        subtipo: 'agente',
        equipaId: equipaDestino,
        nex: Number(ficha.nex || 20),
        agi: Number(ficha.atributos?.agi ?? 1),
        pv: { atual: ficha.pvAtual || 20, max: ficha.pvMax || 20, temp: 0 },
        san: ficha.sanAtual ? { atual: ficha.sanAtual, max: ficha.sanMax || 10, temp: 0 } : null,
        pe: ficha.peAtual ? { atual: ficha.peAtual, max: ficha.peMax || 5, temp: 0 } : null,
        defesa: Number(ficha.defesa || 10),
      })
    );
  }

  function handleAdicionarAmeacaOuOcultista(item) {
    const ehOcultista = item.subtipo === 'ocultista' || item.subtipo === 'ocultista_inimigo';
    setEstado((est) =>
      adicionarCombatente(est, {
        nome: item.nome,
        tipo: ehOcultista ? 'npc' : 'ameaca',
        subtipo: ehOcultista ? 'ocultista' : 'criatura',
        equipaId: equipaDestino,
        vd: Number(item.vd || 20),
        agi: Number(item.testes?.reflexos ? 2 : 1),
        pv: { atual: Number(item.pv || 30), max: Number(item.pv || 30), temp: 0 },
        defesa: Number(item.defesa || 15),
      })
    );
  }

  function handleAdicionarManual(e) {
    if (e) e.preventDefault();
    if (!novoNome.trim()) return;
    setEstado((est) =>
      adicionarCombatente(est, {
        nome: novoNome.trim(),
        tipo: novoTipo,
        subtipo: novoTipo,
        equipaId: equipaDestino,
        vd: Number(novoVd) || 20,
        nex: novoTipo === 'agente' ? Number(novoVd) || 20 : 0,
        agi: Number(novoAgi) || 1,
        pv: { atual: Number(novoPv) || 20, max: Number(novoPv) || 20, temp: 0 },
        defesa: Number(novoDef) || 10,
      })
    );
    setNovoNome('');
    setNovoPv(20);
    setNovoDef(10);
  }

  function handleSalvarEfeito(e) {
    if (e) e.preventDefault();
    if (!modalEfeito || !nomeEfeito.trim()) return;
    setEstado((est) =>
      adicionarEfeitoCombatente(est, modalEfeito, {
        nome: nomeEfeito.trim(),
        duracao: duracaoEfeito,
      })
    );
    setModalEfeito(null);
    setNomeEfeito('');
    setDuracaoEfeito('2');
  }

  return (
    <div style={{ marginTop: 8 }}>
      {/* Barra de Controlo de Rodada & Iniciativa */}
      <div
        className="painel"
        style={{
          padding: '14px 18px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          borderLeft: '4px solid var(--sangue-claro)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--txt-fraco)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Batalha Multilateral
            </div>
            <div style={{ fontSize: 24, fontFamily: 'var(--display)', fontWeight: 'bold' }}>
              Rodada {estado.rodada}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              className="btn ghost sm"
              onClick={retroceder}
              disabled={combatentes.length === 0}
              title="Turno anterior"
            >
              ← Anterior
            </button>
            <button
              type="button"
              className="btn sm"
              onClick={avancar}
              disabled={combatentes.length === 0}
              style={{ fontWeight: 'bold' }}
              title="Próximo turno (Espaço)"
            >
              Próximo Turno →
            </button>
          </div>
        </div>

        {/* Turno Ativo Info */}
        {combatenteAtivo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: 6, border: '1px solid var(--borda)' }}>
            <span style={{ fontSize: 12, color: 'var(--txt-dim)' }}>Turno de:</span>
            <b style={{ color: 'var(--txt)', fontSize: 15 }}>{combatenteAtivo.nome}</b>
            <span style={{ fontSize: 12, color: 'var(--txt-fraco)' }}>
              ({combatenteAtivo.iniciativa ? `Ini ${combatenteAtivo.iniciativa}` : 'Sem Ini'})
            </span>
          </div>
        ) : (
          <span style={{ color: 'var(--txt-fraco)', fontSize: 13 }}>Nenhum combatente na arena</span>
        )}

        {/* Botões de Ação Geral */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="interruptor" style={{ fontSize: 12 }}>
            <button
              type="button"
              className={visao === 'equipas' ? 'ativo' : ''}
              onClick={() => setVisao('equipas')}
            >
              Colunas por Equipas
            </button>
            <button
              type="button"
              className={visao === 'turnos' ? 'ativo' : ''}
              onClick={() => setVisao('turnos')}
            >
              Ordem de Turnos ({combatentes.length})
            </button>
          </div>

          <button
            type="button"
            className="btn ghost sm"
            onClick={rolarTodos}
            disabled={combatentes.length === 0}
          >
            Rolar Iniciativas
          </button>
          <button
            type="button"
            className={`btn sm ${painelAdicionar ? '' : 'ghost'}`}
            onClick={() => setPainelAdicionar(!painelAdicionar)}
          >
            {painelAdicionar ? 'Fechar Banco' : '+ Adicionar Combatente'}
          </button>
        </div>
      </div>

      {/* Comparador de Forças / Balanço Multilateral no Topo */}
      <div
        className="painel"
        style={{
          padding: '12px 16px',
          marginBottom: 16,
          background: 'rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--txt-fraco)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Balanço de Forças & VD das Facções ({equipas.length} Lados em Confronto)
          </span>
          <button
            type="button"
            className="btn ghost sm"
            style={{ fontSize: 11, padding: '2px 8px' }}
            onClick={handleCriarEquipa}
          >
            + Adicionar Lado / Equipa
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, equipas.length)}, 1fr)`, gap: 10 }}>
          {statsEquipas.map((eq) => (
            <div
              key={eq.id}
              style={{
                borderTop: `3px solid ${eq.cor}`,
                paddingTop: 6,
                background: 'rgba(255,255,255,0.02)',
                padding: '6px 10px',
                borderRadius: 4,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: 13, color: eq.cor }}>
                  {eq.nome}
                </span>
                {equipas.length > 1 && (
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: 'var(--txt-fraco)', cursor: 'pointer', fontSize: 11 }}
                    onClick={() => handleRemoverEquipa(eq.id)}
                    title="Remover este lado"
                  >
                    ×
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                <span style={{ fontSize: 18, fontFamily: 'var(--display)', fontWeight: 'bold' }}>
                  VD/NEX {eq.totalVD}
                </span>
                <span style={{ fontSize: 11, color: 'var(--txt-dim)' }}>
                  {eq.membros.length} {eq.membros.length === 1 ? 'combatente' : 'combatentes'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gaveta / Banco de Recursos para Adicionar Rapidamente */}
      {painelAdicionar && (
        <div
          className="painel"
          style={{
            padding: 16,
            marginBottom: 16,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--borda)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: 16, fontFamily: 'var(--display)' }}>
              Banco de Combatentes — Escolher e Enviar para uma Equipa
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--txt-dim)' }}>Adicionar para:</span>
              <select
                value={equipaDestino}
                onChange={(e) => setEquipaDestino(e.target.value)}
                style={{ fontSize: 12, padding: '3px 8px' }}
              >
                {equipas.map((eq) => (
                  <option key={eq.id} value={eq.id}>{eq.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="abas" style={{ marginBottom: 12 }}>
            <button
              type="button"
              className={abaBanco === 'conectados' ? 'ativa' : ''}
              onClick={() => setAbaBanco('conectados')}
            >
              Jogadores Conectados ({agentesConectados.length})
            </button>
            <button
              type="button"
              className={abaBanco === 'fichas' ? 'ativa' : ''}
              onClick={() => setAbaBanco('fichas')}
            >
              Fichas Guardadas ({agentes.length})
            </button>
            <button
              type="button"
              className={abaBanco === 'bestiario' ? 'ativa' : ''}
              onClick={() => setAbaBanco('bestiario')}
            >
              Bestiário & Ocultistas ({ameacas.length})
            </button>
            <button
              type="button"
              className={abaBanco === 'manual' ? 'ativa' : ''}
              onClick={() => setAbaBanco('manual')}
            >
              Criação Manual
            </button>
          </div>

          {/* Aba 1: Jogadores Conectados */}
          {abaBanco === 'conectados' && (
            <div>
              {agentesConectados.length === 0 ? (
                <p className="dica" style={{ fontSize: 13 }}>
                  Nenhum jogador conectado via WebRTC/PeerJS no momento. Quando os jogadores abrirem as fichas na mesma sala, aparecerão aqui instantaneamente.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                  {agentesConectados.map((ag, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 10,
                        border: '1px solid var(--borda)',
                        borderRadius: 4,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <b>{ag.nome}</b> <span style={{ fontSize: 11, color: 'var(--txt-dim)' }}>[NEX {ag.nex || 20}%]</span>
                        <div style={{ fontSize: 11, color: 'var(--txt-fraco)' }}>
                          PV {ag.pv?.atual || 20}/{ag.pv?.max || 20} · DEF {ag.defesa || 10}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn sm"
                        onClick={() => handleAdicionarAgenteConectado(ag)}
                      >
                        + Colocar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Aba 2: Fichas Guardadas */}
          {abaBanco === 'fichas' && (
            <div>
              {agentes.length === 0 ? (
                <p className="dica" style={{ fontSize: 13 }}>Nenhuma ficha de agente guardada no armazenamento.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                  {agentes.map((ficha) => (
                    <div
                      key={ficha.id}
                      style={{
                        padding: 10,
                        border: '1px solid var(--borda)',
                        borderRadius: 4,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <b>{ficha.nome}</b> <span style={{ fontSize: 11, color: 'var(--txt-dim)' }}>[NEX {ficha.nex || 20}%]</span>
                        <div style={{ fontSize: 11, color: 'var(--txt-fraco)' }}>
                          {ficha.origemId} · {ficha.classeId}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn sm"
                        onClick={() => handleAdicionarFichaGuardada(ficha)}
                      >
                        + Colocar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Aba 3: Bestiário & Ocultistas */}
          {abaBanco === 'bestiario' && (
            <div>
              {ameacas.length === 0 ? (
                <p className="dica" style={{ fontSize: 13 }}>Nenhuma criatura ou ocultista guardado no Bestiário.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                  {ameacas.map((item) => {
                    const ehOcultista = item.subtipo === 'ocultista' || item.subtipo === 'ocultista_inimigo';
                    return (
                      <div
                        key={item.id}
                        style={{
                          padding: 10,
                          border: '1px solid var(--borda)',
                          borderRadius: 4,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <b>{item.nome}</b>
                          <span style={{ marginLeft: 6, fontSize: 11, color: ehOcultista ? '#c084fc' : 'var(--sangue-claro)' }}>
                            [{ehOcultista ? 'Ocultista' : 'Criatura'} · VD {item.vd}]
                          </span>
                          <div style={{ fontSize: 11, color: 'var(--txt-fraco)' }}>
                            PV {item.pv} · DEF {item.defesa}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => handleAdicionarAmeacaOuOcultista(item)}
                        >
                          + Colocar
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Aba 4: Criação Manual */}
          {abaBanco === 'manual' && (
            <form onSubmit={handleAdicionarManual} className="grelha-editor" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
              <div className="campo">
                <label>Nome</label>
                <input
                  type="text"
                  placeholder="Nome do combatente"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  required
                />
              </div>
              <div className="campo">
                <label>Tipo</label>
                <select value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)}>
                  <option value="agente">Agente (Ordem)</option>
                  <option value="ameaca">Ameaça / Criatura</option>
                  <option value="ocultista">Ocultista</option>
                  <option value="npc">NPC / Terceira Facção</option>
                </select>
              </div>
              <div className="campo">
                <label>VD / NEX</label>
                <input
                  type="number"
                  value={novoVd}
                  onChange={(e) => setNovoVd(Number(e.target.value))}
                />
              </div>
              <div className="campo">
                <label>PV Máximo</label>
                <input
                  type="number"
                  value={novoPv}
                  onChange={(e) => setNovoPv(Number(e.target.value))}
                />
              </div>
              <div className="campo">
                <label>Agilidade</label>
                <input
                  type="number"
                  value={novoAgi}
                  onChange={(e) => setNovoAgi(Number(e.target.value))}
                />
              </div>
              <div className="campo">
                <label>Defesa</label>
                <input
                  type="number"
                  value={novoDef}
                  onChange={(e) => setNovoDef(Number(e.target.value))}
                />
              </div>
              <div className="campo" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn" style={{ width: '100%' }}>Adicionar</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Visualização 1: Colunas por Equipas / Lados (com Drag and Drop) */}
      {visao === 'equipas' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.max(1, equipas.length)}, minmax(300px, 1fr))`,
            gap: 16,
            overflowX: 'auto',
          }}
        >
          {statsEquipas.map((eq) => (
            <div
              key={eq.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropNaEquipa(eq.id)}
              className="painel"
              style={{
                borderTop: `4px solid ${eq.cor}`,
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(0,0,0,0.15)',
              }}
            >
              {/* Cabeçalho da Coluna da Equipa */}
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--borda)' }}>
                <input
                  type="text"
                  value={eq.nome}
                  onChange={(e) => handleRenomearEquipa(eq.id, e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: eq.cor,
                    width: '100%',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--txt-dim)', marginTop: 4 }}>
                  <span><b>VD/NEX Total:</b> {eq.totalVD}</span>
                  <span>{eq.membros.length} {eq.membros.length === 1 ? 'membro' : 'membros'}</span>
                </div>
              </div>

              {/* Lista de Combatentes da Equipa */}
              <div style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {eq.membros.length === 0 ? (
                  <div
                    style={{
                      border: '2px dashed rgba(255,255,255,0.08)',
                      borderRadius: 6,
                      padding: 24,
                      textAlign: 'center',
                      color: 'var(--txt-fraco)',
                      fontSize: 13,
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Arrasta ou adiciona combatentes para este lado
                  </div>
                ) : (
                  eq.membros.map((c) => (
                    <CombatenteCard
                      key={c.id}
                      c={c}
                      ehAtivo={combatenteAtivo?.id === c.id}
                      equipas={equipas}
                      onDragStart={() => handleDragStart(c.id)}
                      onAlterarPv={(delta) => alterarPv(c.id, delta)}
                      onRolarIni={() => rolarIndividual(c.id)}
                      onMudarEquipa={(novaEq) => setEstado((est) => mudarEquipaCombatente(est, c.id, novaEq))}
                      onRemover={() => setEstado((est) => removerCombatente(est, c.id))}
                      onAbrirEfeito={() => setModalEfeito(c.id)}
                      onRemoverEfeito={(efId) => setEstado((est) => removerEfeitoCombatente(est, c.id, efId))}
                      onAlternarCondicao={(condId) => setEstado((est) => alternarCondicaoCombatente(est, c.id, condId))}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visualização 2: Ordem Global de Turnos (Iniciativa) */}
      {visao === 'turnos' && (
        <div className="painel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 18 }}>
              Ordem dos Turnos por Iniciativa ({combatentes.length} Combatentes)
            </h4>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="btn ghost sm" onClick={rolarApenasSem}>
                Rolar sem Iniciativa
              </button>
              <button type="button" className="btn ghost sm" onClick={rolarTodos}>
                Rolar Todos
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {combatentes.map((c, idx) => {
              const eq = equipas.find((e) => e.id === c.equipaId) || equipas[0];
              const ehAtivo = estado.turnoIndex === idx;
              return (
                <CombatenteCard
                  key={c.id}
                  c={c}
                  ehAtivo={ehAtivo}
                  ordem={idx + 1}
                  equipas={equipas}
                  onAlterarPv={(delta) => alterarPv(c.id, delta)}
                  onRolarIni={() => rolarIndividual(c.id)}
                  onMudarEquipa={(novaEq) => setEstado((est) => mudarEquipaCombatente(est, c.id, novaEq))}
                  onRemover={() => setEstado((est) => removerCombatente(est, c.id))}
                  onAbrirEfeito={() => setModalEfeito(c.id)}
                  onRemoverEfeito={(efId) => setEstado((est) => removerEfeitoCombatente(est, c.id, efId))}
                  onAlternarCondicao={(condId) => setEstado((est) => alternarCondicaoCombatente(est, c.id, condId))}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Adicionar Efeito Temporário */}
      {modalEfeito && (
        <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && setModalEfeito(null)}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-topo">
              <h3>Adicionar Efeito Temporário</h3>
              <button className="fechar" onClick={() => setModalEfeito(null)}>×</button>
            </div>
            <form onSubmit={handleSalvarEfeito} className="modal-corpo" style={{ padding: 16 }}>
              <div className="campo" style={{ marginBottom: 12 }}>
                <label>Nome do Efeito / Condição Especial</label>
                <input
                  type="text"
                  placeholder="Ex: Chamas de Sangue, Abalado, Paralisia"
                  value={nomeEfeito}
                  onChange={(e) => setNomeEfeito(e.target.value)}
                  required
                />
              </div>
              <div className="campo" style={{ marginBottom: 16 }}>
                <label>Duração (Rodadas)</label>
                <select value={duracaoEfeito} onChange={(e) => setDuracaoEfeito(e.target.value)}>
                  <option value="1">1 rodada</option>
                  <option value="2">2 rodadas</option>
                  <option value="3">3 rodadas</option>
                  <option value="5">5 rodadas</option>
                  <option value="permanente">Até o fim da cena (Permanente)</option>
                </select>
              </div>
              <div className="modal-acoes" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn ghost" onClick={() => setModalEfeito(null)}>Cancelar</button>
                <button type="submit" className="btn">Adicionar Efeito</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CombatenteCard({
  c,
  ehAtivo,
  ordem,
  equipas = [],
  onDragStart,
  onAlterarPv,
  onRolarIni,
  onMudarEquipa,
  onRemover,
  onAbrirEfeito,
  onRemoverEfeito,
  onAlternarCondicao,
}) {
  const eq = equipas.find((e) => e.id === c.equipaId) || equipas[0];
  const pvAtual = Number(c.pv?.atual ?? 0);
  const pvMax = Number(c.pv?.max ?? 20);
  const pctPv = Math.max(0, Math.min(100, Math.round((pvAtual / Math.max(1, pvMax)) * 100)));

  const vdValor = Number(c.vd || c.nex || 0);
  const rotuloVD = c.tipo === 'agente' ? `NEX ${vdValor}%` : `VD ${vdValor}`;

  return (
    <div
      draggable={Boolean(onDragStart)}
      onDragStart={onDragStart}
      style={{
        background: ehAtivo ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.03)',
        border: ehAtivo ? '2px solid var(--sangue-claro)' : '1px solid var(--borda)',
        borderLeft: `4px solid ${eq?.cor || '#fff'}`,
        borderRadius: 6,
        padding: 12,
        cursor: onDragStart ? 'grab' : 'default',
        boxShadow: ehAtivo ? '0 0 12px rgba(239, 68, 68, 0.3)' : 'none',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Topo do Card: Ordem, Nome com VD em destaque e Ações */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {ordem != null && (
            <span style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--txt-fraco)' }}>
              #{ordem}
            </span>
          )}
          <span style={{ fontWeight: 'bold', fontSize: 15, color: 'var(--txt)' }}>
            {c.nome}
          </span>
          {/* VD / NEX em Destaque Singular à frente do Nome */}
          <span
            style={{
              fontSize: 11,
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.08)',
              color: eq?.cor || 'var(--txt)',
              border: `1px solid ${eq?.cor || 'var(--borda)'}`,
            }}
          >
            {rotuloVD}
          </span>
          <span style={{ fontSize: 11, color: 'var(--txt-fraco)', textTransform: 'capitalize' }}>
            ({c.subtipo || c.tipo})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Seletor de Equipa / Lado */}
          <select
            value={c.equipaId}
            onChange={(e) => onMudarEquipa(e.target.value)}
            style={{ fontSize: 11, padding: '2px 4px', maxWidth: 100 }}
            title="Mover para outro lado"
          >
            {equipas.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>

          <button
            type="button"
            style={{ background: 'transparent', border: 'none', color: 'var(--txt-fraco)', cursor: 'pointer', fontSize: 14 }}
            onClick={onRemover}
            title="Remover do combate"
          >
            ×
          </button>
        </div>
      </div>

      {/* Barra de PV e Controlo de Dano Rápido */}
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
          <span>
            <b>PV:</b> {pvAtual} / {pvMax} {c.pv?.temp > 0 ? `(+${c.pv.temp} temp)` : ''}
          </span>
          <span style={{ color: 'var(--txt-dim)' }}>DEF {c.defesa || 10}</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${pctPv}%`,
              background: pctPv > 50 ? '#22c55e' : pctPv > 25 ? '#eab308' : '#ef4444',
              transition: 'width 0.2s',
            }}
          />
        </div>

        {/* Botões Rápidos de Dano / Cura */}
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          <button type="button" className="btn ghost sm" style={{ padding: '1px 6px', fontSize: 11 }} onClick={() => onAlterarPv(-5)}>−5</button>
          <button type="button" className="btn ghost sm" style={{ padding: '1px 6px', fontSize: 11 }} onClick={() => onAlterarPv(-1)}>−1</button>
          <button type="button" className="btn ghost sm" style={{ padding: '1px 6px', fontSize: 11 }} onClick={() => onAlterarPv(1)}>+1</button>
          <button type="button" className="btn ghost sm" style={{ padding: '1px 6px', fontSize: 11 }} onClick={() => onAlterarPv(5)}>+5</button>
        </div>
      </div>

      {/* Iniciativa e Efeitos */}
      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--txt-dim)' }}>Iniciativa:</span>
          <b style={{ fontSize: 13 }}>{c.iniciativa ?? '—'}</b>
          <button
            type="button"
            className="btn ghost sm"
            style={{ padding: '1px 6px', fontSize: 11 }}
            onClick={onRolarIni}
          >
            Rolar
          </button>
        </div>

        <button
          type="button"
          className="btn ghost sm"
          style={{ padding: '1px 6px', fontSize: 11 }}
          onClick={onAbrirEfeito}
        >
          + Efeito ({c.efeitos?.length || 0})
        </button>
      </div>

      {/* Efeitos Temporários Ativos */}
      {c.efeitos && c.efeitos.length > 0 && (
        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {c.efeitos.map((ef) => (
            <span
              key={ef.id}
              style={{
                fontSize: 11,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: 'var(--txt)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{ef.nome} ({ef.duracao === 'permanente' ? 'Perm.' : `${ef.duracao}r`})</span>
              <button
                type="button"
                style={{ background: 'transparent', border: 'none', color: 'var(--txt-fraco)', cursor: 'pointer', padding: 0 }}
                onClick={() => onRemoverEfeito(ef.id)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
