import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SubscritorMestre, lerCodigosMestre } from '../../engine/redeMestre.js';
import { CONDICOES_POR_ID } from '../../data/condicoes.js';

function formatarTempoRelativo(timestamp) {
  if (!timestamp) return '';
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 3) return 'agora';
  if (diff < 60) return `há ${diff}s`;
  const min = Math.floor(diff / 60);
  if (min < 60) return `há ${min}m`;
  return `há ${Math.floor(min / 60)}h`;
}

export default function HubEquipa({
  codigos: codigosProp,
  setCodigos: setCodigosProp,
  agentesConectados: agentesConectadosProp,
  aoAdicionarAoCombate,
}) {
  const [codigosLocais, setCodigosLocais] = useState(lerCodigosMestre);
  const [agentesConectadosLocais, setAgentesConectadosLocais] = useState([]);
  const [novoCodigo, setNovoCodigo] = useState('');
  const [agora, setAgora] = useState(Date.now());
  const subscritorRef = useRef(null);

  const usaProps = Boolean(codigosProp && setCodigosProp);
  const codigos = usaProps ? codigosProp : codigosLocais;
  const setCodigos = usaProps ? setCodigosProp : setCodigosLocais;
  const agentesConectados = agentesConectadosProp || agentesConectadosLocais;

  // Inicializar subscritor multi-peer se não fornecido externamente
  useEffect(() => {
    if (usaProps) return;
    const sub = new SubscritorMestre();
    subscritorRef.current = sub;
    sub.iniciar();
    sub.definirCodigos(codigos);

    const cancelar = sub.aoAtualizar((lista) => {
      setAgentesConectadosLocais(lista);
    });

    return () => {
      cancelar();
      sub.destruir();
    };
  }, [usaProps]);

  // Atualizar lista de códigos no subscritor quando o estado muda
  useEffect(() => {
    if (!usaProps && subscritorRef.current) {
      subscritorRef.current.definirCodigos(codigos);
    }
  }, [codigos, usaProps]);

  // Tick de relógio para tempos relativos
  useEffect(() => {
    const timer = setInterval(() => setAgora(Date.now()), 2000);
    return () => clearInterval(timer);
  }, []);

  function adicionarCodigo(e) {
    if (e) e.preventDefault();
    const limpo = novoCodigo.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!limpo) return;
    if (!codigos.includes(limpo)) {
      setCodigos((antigos) => [...antigos, limpo]);
    }
    setNovoCodigo('');
  }

  function removerCodigo(codigo) {
    setCodigos((antigos) => antigos.filter((c) => c !== codigo));
  }

  const estatisticas = useMemo(() => {
    const total = agentesConectados.length;
    const online = agentesConectados.filter((a) => a.status === 'ligado' && a.dados).length;
    return { total, online };
  }, [agentesConectados]);

  return (
    <div style={{ marginTop: 8 }}>
      {/* Barra superior de gestão de salas */}
      <div className="painel" style={{ marginBottom: 18, padding: 14 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 19 }}>Hub da Equipa em Tempo Real</h3>
            <span className="dica" style={{ display: 'block', marginTop: 2 }}>
              Acompanha os agentes da tua mesa via WebRTC P2P ({estatisticas.online}/{estatisticas.total} conectados).
            </span>
          </div>

          <form onSubmit={adicionarCodigo} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Código do jogador (ex: op-joao)"
              value={novoCodigo}
              onChange={(e) => setNovoCodigo(e.target.value)}
              style={{ minWidth: 220, fontSize: 13 }}
            />
            <button type="submit" className="btn sm">Adicionar Agente</button>
          </form>
        </div>

        {/* Tags de salas monitorizadas */}
        {codigos.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, borderTop: '1px solid var(--borda)', paddingTop: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--txt-fraco)', alignSelf: 'center', marginRight: 4 }}>Salas:</span>
            {codigos.map((cod) => {
              const agente = agentesConectados.find((a) => a.codigo === cod);
              const conectado = agente?.status === 'ligado';
              return (
                <span
                  key={cod}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: conectado ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${conectado ? 'rgba(34, 197, 94, 0.3)' : 'var(--borda)'}`,
                    fontSize: 12,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: conectado ? '#22c55e' : '#eab308',
                    }}
                  />
                  <b style={{ color: conectado ? '#86efac' : 'var(--txt)' }}>{cod}</b>
                  <button
                    type="button"
                    onClick={() => removerCodigo(cod)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--txt-fraco)',
                      cursor: 'pointer',
                      fontSize: 14,
                      lineHeight: 1,
                      padding: 0,
                    }}
                    title="Remover agente"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid de Cartões dos Agentes */}
      {agentesConectados.length === 0 ? (
        <div className="painel-vazio" style={{ padding: '36px 20px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 8px 0', fontFamily: 'var(--display)', fontSize: 18 }}>Nenhum agente adicionado</h4>
          <p className="dica" style={{ maxWidth: 500, margin: '0 auto 16px auto' }}>
            Pede aos teus jogadores para ativarem a <b>Transmissão em Tempo Real & Overlay</b> na ficha deles e insere o código de sala acima.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}
        >
          {agentesConectados.map((ag) => {
            const d = ag.dados;
            const conectado = ag.status === 'ligado';

            if (!d) {
              return (
                <div
                  key={ag.codigo}
                  className="painel"
                  style={{
                    padding: 16,
                    opacity: 0.75,
                    border: '1px dashed var(--borda)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 180,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--txt-fraco)' }}>Sala: {ag.codigo}</span>
                      <span style={{ fontSize: 11, color: '#eab308' }}>À espera de transmissão...</span>
                    </div>
                    <p className="dica" style={{ marginTop: 12, fontSize: 12 }}>
                      Certifica-te de que o jogador abriu a ficha, ligou a transmissão P2P e configurou a sala <b>{ag.codigo}</b>.
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button type="button" className="btn ghost sm" onClick={() => removerCodigo(ag.codigo)}>
                      Remover
                    </button>
                  </div>
                </div>
              );
            }

            const pv = d.pv || { atual: 0, max: 1, temp: 0 };
            const pctPv = Math.max(0, Math.min(100, Math.round((pv.atual / (pv.max || 1)) * 100)));
            const san = d.san;
            const pctSan = san ? Math.max(0, Math.min(100, Math.round((san.atual / (san.max || 1)) * 100))) : 0;
            const pd = d.pd;
            const pctPd = pd ? Math.max(0, Math.min(100, Math.round((pd.atual / (pd.max || 1)) * 100))) : 0;
            const pe = d.pe;
            const pctPe = pe ? Math.max(0, Math.min(100, Math.round((pe.atual / (pe.max || 1)) * 100))) : 0;

            const condicoes = d.condicoes || [];
            const rolagem = d.rolagem;

            return (
              <div
                key={ag.codigo}
                className="painel"
                style={{
                  padding: 16,
                  border: '1px solid var(--borda)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Cabeçalho do Agente */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {d.token || d.imagem ? (
                    <img
                      src={d.token || d.imagem}
                      alt={d.nome}
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 6,
                        objectFit: 'cover',
                        border: '1px solid var(--borda)',
                        background: '#000',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 6,
                        background: 'var(--fundo-card)',
                        border: '1px solid var(--borda)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--display)',
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: 'var(--txt)',
                      }}
                    >
                      {(d.nome || 'A').charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ margin: 0, fontSize: 17, fontFamily: 'var(--display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {d.nome || 'Agente'}
                      </h4>
                      <span style={{ fontSize: 11, color: '#22c55e', whiteSpace: 'nowrap' }}>
                        {formatarTempoRelativo(d._atualizadoEm)}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--txt-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
                      {d.subtitulo || 'Agente da Ordem'}
                    </div>
                  </div>
                </div>

                {/* Barras de Recursos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* PV */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--sangue-claro)' }}>PV</span>
                      <span>
                        <b>{pv.atual}</b>/{pv.max}
                        {pv.temp > 0 && <span style={{ color: '#fbbf24', marginLeft: 4 }}>+{pv.temp}</span>}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pctPv}%`,
                          height: '100%',
                          background: pctPv > 50 ? 'var(--sangue-claro)' : pctPv > 25 ? '#eab308' : '#ef4444',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* SAN ou PD */}
                  {san && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--conhecimento-claro)' }}>SAN</span>
                        <span>
                          <b>{san.atual}</b>/{san.max}
                          {san.temp > 0 && <span style={{ color: '#fbbf24', marginLeft: 4 }}>+{san.temp}</span>}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${pctSan}%`,
                            height: '100%',
                            background: 'var(--conhecimento-claro)',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {pd && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
                        <span style={{ fontWeight: 'bold', color: '#a855f7' }}>PD</span>
                        <span><b>{pd.atual}</b>/{pd.max}</span>
                      </div>
                      <div style={{ width: '100%', height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${pctPd}%`,
                            height: '100%',
                            background: '#a855f7',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* PE */}
                  {pe && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--energia-claro)' }}>PE</span>
                        <span>
                          <b>{pe.atual}</b>/{pe.max}
                          {pe.temp > 0 && <span style={{ color: '#fbbf24', marginLeft: 4 }}>+{pe.temp}</span>}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${pctPe}%`,
                            height: '100%',
                            background: 'var(--energia-claro)',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Condições Ativas */}
                {condicoes.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {condicoes.map((cid) => {
                      const cinfo = CONDICOES_POR_ID[cid] || { nome: cid };
                      return (
                        <span
                          key={cid}
                          style={{
                            fontSize: 11,
                            padding: '2px 6px',
                            borderRadius: 3,
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#fca5a5',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                          }}
                          title={cinfo.descricao || ''}
                        >
                          {cinfo.nome}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Última Rolagem */}
                {rolagem ? (
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.35)',
                      padding: '8px 10px',
                      borderRadius: 4,
                      border: `1px solid ${rolagem.critico ? '#fbbf24' : rolagem.desastre ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--txt-dim)', marginBottom: 2 }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--txt)' }}>
                        {rolagem.nome || rolagem.rotulo || 'Rolagem'}
                      </span>
                      <span>{formatarTempoRelativo(rolagem.quando)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 12, color: 'var(--txt-fraco)' }}>
                        {rolagem.detalhe || (rolagem.dados ? `${rolagem.dados} dados` : '')}
                      </span>
                      <span
                        style={{
                          fontSize: 18,
                          fontFamily: 'var(--display)',
                          fontWeight: 'bold',
                          color: rolagem.critico ? '#fbbf24' : rolagem.desastre ? '#ef4444' : 'var(--txt)',
                        }}
                      >
                        {rolagem.total != null ? rolagem.total : '—'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: 'var(--txt-fraco)', textAlign: 'center', padding: '4px 0' }}>
                    Nenhuma rolagem recente
                  </div>
                )}

                {/* Ações Rápidas */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                  <button
                    type="button"
                    className="btn ghost sm"
                    onClick={() => removerCodigo(ag.codigo)}
                    style={{ fontSize: 11, color: 'var(--txt-fraco)' }}
                  >
                    Desconectar
                  </button>
                  {aoAdicionarAoCombate && (
                    <button
                      type="button"
                      className="btn sm"
                      onClick={() =>
                        aoAdicionarAoCombate({
                          id: ag.codigo,
                          nome: d.nome || ag.codigo,
                          tipo: 'agente',
                          codigo: ag.codigo,
                          pv: d.pv,
                          san: d.san,
                          pe: d.pe,
                          condicoes: d.condicoes || [],
                        })
                      }
                      style={{ fontSize: 12 }}
                    >
                      Adicionar ao Combate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
