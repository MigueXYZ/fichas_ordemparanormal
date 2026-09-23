import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  estadoCombateVazio,
  adicionarCombatente,
  removerCombatente,
  editarCombatente,
  proximoTurno,
  turnoAnterior,
  rolarIniciativa,
  rolarIniciativaGeral,
  adicionarEquipa,
  removerEquipa,
  editarEquipa,
  adicionarEfeitoCombatente,
  removerEfeitoCombatente,
} from '../../engine/combateTracker.js';
import { COMPENDIO_AMEACAS, clonarAmeacaOficial } from '../../data/ameacas/index.js';
import { calcMaximos, calcDefesas } from '../../engine/calc.js';
import Ficha from '../ficha/Ficha.jsx';
import FichaAmeaca from '../ficha/FichaAmeaca.jsx';
import FichaNpcCard from './FichaNpcCard.jsx';
import ModalDetalheGenerico from './ModalDetalheGenerico.jsx';
import PainelRolagem from '../PainelRolagem.jsx';
import PainelDetalheUnidade from './PainelDetalheUnidade.jsx';
import tokenPlaceholder from '../../assets/token-placeholder.png';

function normalizar(texto) {
  return String(texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function pvDeFicha(ficha, tipo) {
  if (!ficha) return null;
  const max = tipo === 'ameaca' ? (Number(ficha.pv) || 20) : (calcMaximos(ficha)?.pv ?? 20);
  const atual = Number(ficha.pvAtual ?? max);
  return { atual, max };
}

/** Limiares de dificuldade — a mesma fórmula que o antigo "Encontro" usava,
 * agora aplicada em tempo real ao que já está posto nos lados, em vez de
 * duplicar a escolha de agentes/inimigos numa calculadora à parte. */
function avaliarBalanco(nexAgentes, vdInimigos) {
  if (vdInimigos <= 0) return { texto: 'Sem inimigos postos ainda', cor: 'var(--txt-fraco)', badge: '—' };
  const facil = nexAgentes * 0.5;
  const equilibrado = nexAgentes * 1.0;
  const dificil = nexAgentes * 1.5;
  if (vdInimigos < facil) return { texto: 'Muito Fácil', cor: 'var(--txt-fraco)', badge: 'Muito Fácil' };
  if (vdInimigos <= facil * 1.1) return { texto: 'Fácil', cor: '#22c55e', badge: 'Fácil' };
  if (vdInimigos <= equilibrado) return { texto: 'Equilibrado', cor: '#eab308', badge: 'Equilibrado' };
  if (vdInimigos <= dificil) return { texto: 'Difícil', cor: '#f97316', badge: 'Difícil' };
  return { texto: 'Extremo / Mortal', cor: 'var(--sangue-claro)', badge: 'Extremo / Mortal' };
}

/**
 * "Campo de Batalha" — une o antigo Encontro (balanço de VD), Cartões de
 * Batalha (visual em cartão) e Rastreador de Combate (equipas ilimitadas,
 * efeitos, iniciativa, jogadores conectados) numa única secção prática:
 * cartões simples e recolhidos por omissão (token, PV, PE, SAN, iniciativa),
 * que ao clicar abrem a caixa de atacar — e, para NPCs, a ficha 4 completa.
 */
export default function CampoDeBatalha({
  agentes = [],
  ameacas = [],
  agentesConectados = [],
  estadoCombate,
  setEstadoCombate,
  aoGuardar,
}) {
  const estado = estadoCombate || estadoCombateVazio();
  const setEstado = setEstadoCombate;

  const fichasAgentes = useMemo(() => agentes.filter((a) => a.tipo !== 'npc'), [agentes]);
  const npcsElenco = useMemo(() => agentes.filter((a) => a.tipo === 'npc'), [agentes]);

  const [painelAdicionar, setPainelAdicionar] = useState(null); // equipaId aberto, ou null
  const [abaBanco, setAbaBanco] = useState('fichas');
  const [buscaCatalogo, setBuscaCatalogo] = useState('');

  const [detalheId, setDetalheId] = useState(null); // combatente com a caixa de ataque aberta
  const [fichaCompleta, setFichaCompleta] = useState(null); // { combatenteId, tipo, ficha } — editor completo
  const [npcCompletaId, setNpcCompletaId] = useState(null); // combatente cuja ficha 4 está aberta
  const [editandoNpcCard, setEditandoNpcCard] = useState(false);
  const [npcDetalhe, setNpcDetalhe] = useState(null);

  const [modalEfeito, setModalEfeito] = useState(null); // combatenteId
  const [nomeEfeito, setNomeEfeito] = useState('');
  const [duracaoEfeito, setDuracaoEfeito] = useState('2');

  const [rolagens, setRolagens] = useState([]);
  const onRolar = useCallback((r) => { if (r) setRolagens((a) => [...a.slice(-9), r]); }, []);
  const fecharRolagem = useCallback((id) => setRolagens((a) => a.filter((r) => r.id !== id)), []);
  const limparRolagens = useCallback(() => setRolagens([]), []);

  const equipas = estado.equipas || [];
  const combatentes = estado.combatentes || [];
  const combatenteAtivo = combatentes[estado.turnoIndex] || null;

  const statsEquipas = useMemo(() => equipas.map((eq) => {
    const membros = combatentes.filter((c) => c.equipaId === eq.id);
    const totalVD = membros.reduce((s, c) => s + (Number(c.vd || c.nex) || 0), 0);
    return { ...eq, membros, totalVD };
  }), [equipas, combatentes]);

  // Balanço em tempo real: 1º lado = "agentes" (NEX), resto = "inimigos" (VD somado).
  const balanco = useMemo(() => {
    const [ladoAgentes, ...outros] = statsEquipas;
    const nexAgentes = ladoAgentes?.totalVD || 0;
    const vdInimigos = outros.reduce((s, eq) => s + eq.totalVD, 0);
    return { ...avaliarBalanco(nexAgentes, vdInimigos), nexAgentes, vdInimigos };
  }, [statsEquipas]);

  function avancar() { setEstado((est) => proximoTurno(est)); }
  function retroceder() { setEstado((est) => turnoAnterior(est)); }
  function rolarSemIniciativa() { setEstado((est) => rolarIniciativaGeral(est, true)); }

  function rolarIniciativaCard(id) {
    setEstado((est) => {
      const c = est.combatentes.find((x) => x.id === id);
      if (!c) return est;
      const rolo = rolarIniciativa(c.agi || 0, c.bonusIniciativa || 0);
      return editarCombatente(est, id, { iniciativa: rolo.total, iniciativaRolada: true, ultimaRolagemIni: rolo });
    });
  }

  function definirIniciativaManual(id, valorTexto) {
    const valor = valorTexto === '' ? null : Number(valorTexto);
    setEstado((est) => editarCombatente(est, id, { iniciativa: valor }));
  }

  function alterarPv(id, delta) {
    setEstado((est) => {
      const c = est.combatentes.find((x) => x.id === id);
      if (!c) return est;
      const atual = Number(c.pv?.atual || 0);
      const novo = Math.max(0, atual + delta);
      if (c.ficha && aoGuardar) {
        aoGuardar({ ...c.ficha, pvAtual: novo });
      }
      return editarCombatente(est, id, { pv: { atual: novo } });
    });
  }

  function aplicarDano(id, quantidade) {
    alterarPv(id, -Math.abs(Number(quantidade) || 0));
  }

  // Aplica um resultado já calculado com Resistências (ver PainelDetalheUnidade
  // → "Dar Dano", que usa engine/danoRecetor.js → calcularDanoRecebido) — ao
  // contrário de aplicarDano/alterarPv (dano em bruto), isto mexe em PV e SAN
  // de uma vez e persiste os dois na ficha por baixo, se houver uma.
  function aplicarDanoResistido(id, resultado) {
    setEstado((est) => {
      const c = est.combatentes.find((x) => x.id === id);
      if (!c || !resultado) return est;
      const patchFicha = {};
      let novoPv = c.pv;
      let novoSan = c.san;
      if (resultado.totalLiquidoPv > 0 || resultado.pvTempAbsorvido > 0) {
        patchFicha.pvAtual = resultado.novoPvAtual;
        patchFicha.pvTemp = resultado.novoPvTemp;
        novoPv = { ...c.pv, atual: resultado.novoPvAtual };
      }
      if (resultado.totalLiquidoSan > 0 && c.san) {
        if (resultado.semSanidade) patchFicha.pdAtual = resultado.novoSanAtual;
        else patchFicha.sanAtual = resultado.novoSanAtual;
        novoSan = { ...c.san, atual: resultado.novoSanAtual };
      }
      if (c.ficha && aoGuardar && Object.keys(patchFicha).length) {
        aoGuardar({ ...c.ficha, ...patchFicha });
      }
      return editarCombatente(est, id, { pv: novoPv, san: novoSan });
    });
  }

  // Gestão de equipas
  function criarEquipa() { setEstado((est) => adicionarEquipa(est)); }
  function apagarEquipa(id) { if (equipas.length > 1) setEstado((est) => removerEquipa(est, id)); }
  function renomearEquipa(id, nome) { setEstado((est) => editarEquipa(est, id, { nome })); }
  function mudarCorEquipa(id, cor) { setEstado((est) => editarEquipa(est, id, { cor })); }

  // Adições rápidas
  function adicionarConectado(equipaId, ag) {
    setEstado((est) => adicionarCombatente(est, {
      id: ag.codigo || `ag-peer-${Date.now()}`,
      nome: ag.nome || 'Agente Conectado',
      tipo: 'agente', subtipo: 'agente', equipaId,
      nex: Number(ag.nex || 20), agi: Number(ag.atributos?.agi ?? 2),
      pv: ag.pv || { atual: 20, max: 20, temp: 0 },
      san: ag.san || null, pe: ag.pe || null,
      defesa: Number(ag.defesa || 12), condicoes: ag.condicoes || [], ficha: ag,
    }));
  }

  function adicionarFicha(equipaId, ficha) {
    const max = calcMaximos(ficha);
    const defesas = calcDefesas(ficha);
    setEstado((est) => adicionarCombatente(est, {
      id: ficha.id, nome: ficha.nome,
      tipo: 'agente', subtipo: ficha.tipo === 'npc' ? 'npc' : 'agente', equipaId,
      nex: Number(ficha.nex || 20), agi: Number(ficha.atributos?.agi ?? 1),
      pv: { atual: ficha.pvAtual ?? max.pv, max: max.pv, temp: 0 },
      san: { atual: ficha.sanAtual ?? max.san, max: max.san, temp: 0 },
      pe: { atual: ficha.peAtual ?? max.pe, max: max.pe, temp: 0 },
      defesa: Number(defesas.defesa || 10), ficha,
    }));
  }

  function adicionarAmeaca(equipaId, item) {
    const ehOcultista = item.subtipo === 'ocultista' || item.subtipo === 'ocultista_inimigo';
    setEstado((est) => adicionarCombatente(est, {
      nome: item.nome,
      tipo: ehOcultista ? 'npc' : 'ameaca', subtipo: ehOcultista ? 'ocultista' : 'criatura', equipaId,
      vd: Number(item.vd || 20),
      pv: { atual: Number(item.pvAtual ?? item.pv ?? 30), max: Number(item.pv || 30), temp: 0 },
      defesa: Number(item.defesa || 15), ficha: item,
    }));
  }

  function adicionarDoCatalogo(equipaId, oficial) {
    const nova = clonarAmeacaOficial(oficial);
    const guardada = aoGuardar ? aoGuardar(nova) : nova;
    adicionarAmeaca(equipaId, guardada);
  }

  function removerDoCombate(id) {
    setEstado((est) => removerCombatente(est, id));
  }

  // Ficha completa / ficha 4
  function abrirFichaCompleta(c) {
    if (!c.ficha) return;
    setDetalheId(null);
    if (c.ficha.tipo === 'npc') {
      setEditandoNpcCard(false);
      setNpcCompletaId(c.id);
    } else {
      setFichaCompleta({ combatenteId: c.id, tipo: c.ficha.tipo === 'ameaca' ? 'ameaca' : 'agente', ficha: c.ficha });
    }
  }

  // Clique no cartão: NPC abre a ficha 4 diretamente; agente/ameaça abre a
  // caixa de atacar / relatório (PainelDetalheUnidade), como já acontecia.
  function abrirCartao(c) {
    if (c.ficha?.tipo === 'npc') abrirFichaCompleta(c);
    else setDetalheId(c.id);
  }

  // Autoguarda a ficha completa em edição, 800ms depois da última alteração
  // — o mesmo esquema usado no resto da app.
  useEffect(() => {
    if (!fichaCompleta) return undefined;
    const t = setTimeout(() => aoGuardar(fichaCompleta.ficha), 800);
    return () => clearTimeout(t);
  }, [fichaCompleta, aoGuardar]);

  const npcCompletaFicha = npcCompletaId
    ? combatentes.find((c) => c.id === npcCompletaId)?.ficha || null
    : null;

  function atualizarCampoNpcCompleta(campo, valor) {
    const c = combatentes.find((x) => x.id === npcCompletaId);
    if (!c?.ficha) return;
    const novaFicha = { ...c.ficha, [campo]: valor };
    aoGuardar(novaFicha);
    setEstado((est) => editarCombatente(est, npcCompletaId, { ficha: novaFicha, nome: novaFicha.nome || c.nome }));
  }

  // Efeitos temporários
  function salvarEfeito(e) {
    if (e) e.preventDefault();
    if (!modalEfeito || !nomeEfeito.trim()) return;
    setEstado((est) => adicionarEfeitoCombatente(est, modalEfeito, { nome: nomeEfeito.trim(), duracao: duracaoEfeito }));
    setModalEfeito(null);
    setNomeEfeito('');
    setDuracaoEfeito('2');
  }

  return (
    <div style={{ marginTop: 8 }}>
      {/* Barra de Rodada / Turno */}
      <div className="painel" style={{ padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', borderLeft: '4px solid var(--sangue-claro)' }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--txt-fraco)', textTransform: 'uppercase', letterSpacing: 1 }}>Rodada</div>
          <div style={{ fontSize: 20, fontFamily: 'var(--display)', fontWeight: 'bold' }}>{estado.rodada || 1}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" className="btn ghost sm" onClick={retroceder} disabled={combatentes.length === 0}>← Anterior</button>
          <button type="button" className="btn sm" onClick={avancar} disabled={combatentes.length === 0}>Próximo Turno →</button>
        </div>
        <button type="button" className="btn ghost sm" onClick={rolarSemIniciativa} disabled={combatentes.length === 0}>
          Rolar Iniciativa em Falta
        </button>
        <button type="button" className="btn ghost sm" onClick={criarEquipa}>+ Novo Lado</button>
      </div>

      {/* Trilha de Iniciativa — a ordem de turno em retratos; quem já jogou ou
          ainda vai jogar fica esbatido, só quem está na vez fica em destaque. */}
      <TrilhaIniciativa
        combatentes={combatentes}
        turnoIndex={estado.turnoIndex}
        onRolarIni={rolarIniciativaCard}
        onIniciativaManual={definirIniciativaManual}
        onAbrir={(id) => setDetalheId(id)}
      />

      {/* Balanço de VD/NEX em tempo real */}
      {equipas.length >= 2 && (
        <div className="painel" style={{ padding: '10px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 20, fontFamily: 'var(--display)', fontWeight: 'bold' }}>
              NEX {balanco.nexAgentes} <span style={{ fontSize: 13, color: 'var(--txt-fraco)', fontFamily: 'var(--corpo)' }}>vs</span> VD {balanco.vdInimigos}
            </span>
            <span style={{ fontSize: 12, color: balanco.cor }}>{balanco.texto}</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 'bold', padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.08)', color: balanco.cor, border: `1px solid ${balanco.cor}` }}>
            {balanco.badge}
          </span>
        </div>
      )}

      {/* Colunas por equipa/lado */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, equipas.length)}, minmax(260px, 1fr))`, gap: 16, overflowX: 'auto' }}>
        {statsEquipas.map((eq) => (
          <div key={eq.id} className="painel" style={{ borderTop: `4px solid ${eq.cor}`, padding: 12, background: 'rgba(0,0,0,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <input
                type="color"
                value={eq.cor}
                onChange={(e) => mudarCorEquipa(eq.id, e.target.value)}
                title="Cor do lado"
                style={{ width: 22, height: 22, padding: 0, border: 'none', background: 'transparent', flex: '0 0 auto', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={eq.nome}
                onChange={(e) => renomearEquipa(eq.id, e.target.value)}
                style={{ background: 'transparent', border: 'none', fontWeight: 'bold', fontSize: 15, color: eq.cor, flex: 1, fontFamily: 'var(--display)' }}
              />
              {equipas.length > 1 && (
                <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: '2px 6px' }} onClick={() => apagarEquipa(eq.id)} title="Remover lado">×</button>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--txt-dim)', marginBottom: 8 }}>
              <span>VD/NEX {eq.totalVD}</span>
              <span>{eq.membros.length} {eq.membros.length === 1 ? 'membro' : 'membros'}</span>
            </div>

            <button
              type="button"
              className={`btn sm ${painelAdicionar === eq.id ? '' : 'ghost'}`}
              style={{ width: '100%', marginBottom: 10 }}
              onClick={() => setPainelAdicionar((v) => (v === eq.id ? null : eq.id))}
            >
              {painelAdicionar === eq.id ? 'Fechar' : '+ Adicionar'}
            </button>

            {painelAdicionar === eq.id && (
              <PainelAdicionar
                equipaId={eq.id}
                aba={abaBanco}
                setAba={setAbaBanco}
                agentesConectados={agentesConectados}
                fichasAgentes={fichasAgentes}
                npcsElenco={npcsElenco}
                ameacas={ameacas}
                buscaCatalogo={buscaCatalogo}
                setBuscaCatalogo={setBuscaCatalogo}
                onAdicionarConectado={(ag) => adicionarConectado(eq.id, ag)}
                onAdicionarFicha={(f) => adicionarFicha(eq.id, f)}
                onAdicionarAmeaca={(a) => adicionarAmeaca(eq.id, a)}
                onAdicionarCatalogo={(o) => adicionarDoCatalogo(eq.id, o)}
              />
            )}

            {eq.membros.length === 0 ? (
              <div style={{ border: '2px dashed rgba(255,255,255,0.08)', borderRadius: 6, padding: 24, textAlign: 'center', color: 'var(--txt-fraco)', fontSize: 12 }}>
                Sem ninguém neste lado ainda.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
                {eq.membros.map((c) => (
                  <CartaoCombatente
                    key={c.id}
                    c={c}
                    ativo={combatenteAtivo?.id === c.id}
                    onAbrir={() => abrirCartao(c)}
                    onRemover={() => removerDoCombate(c.id)}
                    onAbrirEfeito={() => setModalEfeito(c.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Caixa de atacar / rolar dano */}
      {detalheId && (() => {
        const c = combatentes.find((x) => x.id === detalheId);
        if (!c) return null;
        return (
          <PainelDetalheUnidade
            unidade={c}
            alvos={combatentes.filter((x) => x.id !== c.id).map((x) => ({
              id: x.id, nome: x.nome, defesa: x.defesa, equipaId: x.equipaId, pv: x.pv, resistencias: x.ficha?.resistencias,
            }))}
            onFechar={() => setDetalheId(null)}
            onRolar={onRolar}
            onAplicarDano={aplicarDano}
            onAplicarDanoResistido={aplicarDanoResistido}
            onEditar={c.ficha ? () => abrirFichaCompleta(c) : undefined}
          />
        );
      })()}

      {/* Ficha completa (agente ou ameaça) */}
      {fichaCompleta && (
        <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && setFichaCompleta(null)}>
          <div className="modal" style={{ maxWidth: 960, width: '95vw', maxHeight: '92vh', overflowY: 'auto' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>{fichaCompleta.ficha.nome}</h3>
              <button className="fechar" onClick={() => setFichaCompleta(null)}>×</button>
            </div>
            <div className="modal-corpo" style={{ padding: 16 }}>
              {fichaCompleta.tipo === 'ameaca'
                ? <FichaAmeaca ameaca={fichaCompleta.ficha} setAmeaca={(f) => setFichaCompleta((ant) => ({ ...ant, ficha: f }))} onRolar={onRolar} aoConcluir={() => setFichaCompleta(null)} />
                : <Ficha personagem={fichaCompleta.ficha} setPersonagem={(f) => setFichaCompleta((ant) => ({ ...ant, ficha: f }))} onRolar={onRolar} />}
            </div>
          </div>
        </div>
      )}

      {/* Ficha 4 do NPC */}
      {npcCompletaId && npcCompletaFicha && (
        <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && setNpcCompletaId(null)}>
          <div className="modal" style={{ maxWidth: 1080, width: '96vw', maxHeight: '92vh', overflowY: 'auto' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>{npcCompletaFicha.nome}</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" className={`btn ghost sm ${editandoNpcCard ? 'ativo' : ''}`} onClick={() => setEditandoNpcCard((v) => !v)}>
                  {editandoNpcCard ? 'Concluir Edição' : 'Editar Guia'}
                </button>
                <button className="fechar" onClick={() => setNpcCompletaId(null)}>×</button>
              </div>
            </div>
            <div className="modal-corpo" style={{ padding: 16 }}>
              <FichaNpcCard
                p={npcCompletaFicha}
                aoVerDetalhe={setNpcDetalhe}
                editando={editandoNpcCard}
                onAtualizarCampo={atualizarCampoNpcCompleta}
                aoUploadImagem={(dataUrl) => atualizarCampoNpcCompleta('imagem', dataUrl)}
              />
            </div>
          </div>
        </div>
      )}
      {npcDetalhe && <ModalDetalheGenerico item={npcDetalhe} aoFechar={() => setNpcDetalhe(null)} />}

      {/* Efeito temporário */}
      {modalEfeito && (
        <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && setModalEfeito(null)}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-topo">
              <h3>Adicionar Efeito Temporário</h3>
              <button className="fechar" onClick={() => setModalEfeito(null)}>×</button>
            </div>
            <form onSubmit={salvarEfeito} className="modal-corpo" style={{ padding: 16 }}>
              <div className="campo" style={{ marginBottom: 12 }}>
                <label>Nome do Efeito / Condição</label>
                <input type="text" placeholder="Ex: Abalado, Sangrando, Paralisado" value={nomeEfeito} onChange={(e) => setNomeEfeito(e.target.value)} required />
              </div>
              <div className="campo" style={{ marginBottom: 16 }}>
                <label>Duração</label>
                <select value={duracaoEfeito} onChange={(e) => setDuracaoEfeito(e.target.value)}>
                  <option value="1">1 rodada</option>
                  <option value="2">2 rodadas</option>
                  <option value="3">3 rodadas</option>
                  <option value="5">5 rodadas</option>
                  <option value="permanente">Até o fim da cena</option>
                </select>
              </div>
              <div className="modal-acoes" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn ghost" onClick={() => setModalEfeito(null)}>Cancelar</button>
                <button type="submit" className="btn">Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PainelRolagem rolagens={rolagens} aoFechar={fecharRolagem} aoLimpar={limparRolagens} />
    </div>
  );
}

function PainelAdicionar({
  equipaId, aba, setAba, agentesConectados, fichasAgentes, npcsElenco, ameacas,
  buscaCatalogo, setBuscaCatalogo, onAdicionarConectado, onAdicionarFicha, onAdicionarAmeaca, onAdicionarCatalogo,
}) {
  const resultadosCatalogo = useMemo(() => {
    const termo = normalizar(buscaCatalogo.trim());
    if (termo.length < 2) return [];
    return COMPENDIO_AMEACAS.filter((a) => normalizar(a.nome).includes(termo)).slice(0, 30);
  }, [buscaCatalogo]);

  const ABAS_BANCO = [
    { id: 'fichas', nome: `Fichas (${fichasAgentes.length})` },
    { id: 'elenco', nome: `Elenco (${npcsElenco.length})` },
    { id: 'bestiario', nome: `Bestiário (${ameacas.length})` },
    { id: 'catalogo', nome: 'Catálogo Oficial' },
    { id: 'conectados', nome: `Ligados (${agentesConectados.length})` },
  ];

  return (
    <div style={{ marginBottom: 12, padding: 10, border: '1px solid var(--borda)', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {ABAS_BANCO.map((b) => (
          <button key={b.id} type="button" className={`btn ghost sm ${aba === b.id ? 'ativo' : ''}`} style={{ fontSize: 11 }} onClick={() => setAba(b.id)}>
            {b.nome}
          </button>
        ))}
      </div>

      {aba === 'fichas' && (
        fichasAgentes.length === 0
          ? <p className="dica" style={{ fontSize: 12 }}>Nenhuma ficha guardada.</p>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {fichasAgentes.map((f) => (
                <button key={f.id} type="button" className="btn ghost sm" onClick={() => onAdicionarFicha(f)}>+ {f.nome}</button>
              ))}
            </div>
      )}

      {aba === 'elenco' && (
        npcsElenco.length === 0
          ? <p className="dica" style={{ fontSize: 12 }}>Nenhum NPC no Elenco.</p>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {npcsElenco.map((n) => (
                <button key={n.id} type="button" className="btn ghost sm" onClick={() => onAdicionarFicha(n)}>+ {n.nome}</button>
              ))}
            </div>
      )}

      {aba === 'bestiario' && (
        ameacas.length === 0
          ? <p className="dica" style={{ fontSize: 12 }}>Nada guardado no Bestiário.</p>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ameacas.map((a) => (
                <button key={a.id} type="button" className="btn ghost sm" onClick={() => onAdicionarAmeaca(a)}>+ {a.nome} <span style={{ opacity: 0.6 }}>(VD {a.vd})</span></button>
              ))}
            </div>
      )}

      {aba === 'catalogo' && (
        <div>
          <input
            type="text"
            placeholder="Pesquisar no compêndio oficial (mín. 2 letras)…"
            value={buscaCatalogo}
            onChange={(e) => setBuscaCatalogo(e.target.value)}
            style={{ width: '100%', marginBottom: 6 }}
          />
          {buscaCatalogo.trim().length >= 2 && (
            resultadosCatalogo.length === 0
              ? <p className="dica" style={{ fontSize: 12 }}>Nada encontrado.</p>
              : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {resultadosCatalogo.map((of) => (
                    <button key={of.id} type="button" className="btn ghost sm" onClick={() => onAdicionarCatalogo(of)}>+ {of.nome} <span style={{ opacity: 0.6 }}>(VD {of.vd})</span></button>
                  ))}
                </div>
          )}
        </div>
      )}

      {aba === 'conectados' && (
        agentesConectados.length === 0
          ? <p className="dica" style={{ fontSize: 12 }}>Nenhum jogador ligado pelo Hub neste momento.</p>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {agentesConectados.map((ag, i) => (
                <button key={i} type="button" className="btn ghost sm" onClick={() => onAdicionarConectado(ag)}>+ {ag.nome}</button>
              ))}
            </div>
      )}
    </div>
  );
}

/** Barra de recurso no estilo do Overlay de OBS (rótulo + valores em cima,
 * trilho escuro, preenchimento colorido com brilho) — usada para PV/PE/SAN
 * no cartão do combatente. */
function BarraCartaoCombatente({ rotulo, atual, max, classe }) {
  const a = Number(atual ?? 0);
  const m = Math.max(1, Number(max ?? 1));
  const pct = Math.max(0, Math.min(100, Math.round((a / m) * 100)));
  return (
    <div className={`cartao-combatente-barra-${classe}`}>
      <div className="cartao-combatente-barra-topo">
        <span>{rotulo}</span>
        <span>{a}/{m}</span>
      </div>
      <div className="cartao-combatente-barra-trilho">
        <div className="cartao-combatente-barra-preenchimento" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Cartão do combatente — mesma linguagem visual do Overlay de OBS (retrato
 * circular com brilho, nome com glow) mas com barras de PV/PE/SAN, simples e
 * direto. A iniciativa vive na Trilha de Iniciativa acima, não aqui. Sem
 * token ainda, mostra o boneco de referência — o token põe-se na ficha
 * (FichaNpcCard / Ficha), não aqui. O cartão inteiro é clicável: abre a
 * ficha para NPCs, ou a caixa de atacar/relatório para os restantes. */
function CartaoCombatente({ c, ativo, onAbrir, onRemover, onAbrirEfeito }) {
  const imagem = c.ficha?.imagem || null;

  return (
    <div className={`cartao-combatente${ativo ? ' ativo' : ''}`} onClick={onAbrir} title="Atacar / ver ficha">
      <div className="cartao-combatente-topo">
        <div
          className="cartao-combatente-retrato"
          style={{ backgroundImage: `url(${imagem || tokenPlaceholder})` }}
        />
        <div className="cartao-combatente-nome">{c.nome}</div>

        <div className="cartao-combatente-acoes">
          <button
            type="button"
            className={`cartao-combatente-efeito${c.efeitos?.length ? ' tem' : ''}`}
            onClick={(e) => { e.stopPropagation(); onAbrirEfeito(); }}
            title={c.efeitos?.length ? c.efeitos.map((ef) => ef.nome).join(', ') : 'Adicionar efeito'}
          >
            {c.efeitos?.length ? `${c.efeitos.length}` : '+'}
          </button>
          <button
            type="button"
            className="cartao-combatente-remover"
            onClick={(e) => { e.stopPropagation(); onRemover(); }}
            title="Remover do combate"
          >
            ×
          </button>
        </div>
      </div>

      <div className="cartao-combatente-barras">
        <BarraCartaoCombatente rotulo="PV" atual={c.pv?.atual} max={c.pv?.max} classe="pv" />
        {c.pe && <BarraCartaoCombatente rotulo="PE" atual={c.pe?.atual} max={c.pe?.max} classe="pe" />}
        {c.san && <BarraCartaoCombatente rotulo="SAN" atual={c.san?.atual} max={c.san?.max} classe="san" />}
      </div>
    </div>
  );
}

/** Trilha de Iniciativa — a ordem de turno em retratos, centrada, na ordem
 * já calculada em `combatentes` (decrescente por Iniciativa). Só quem está
 * na vez fica em destaque; quem já jogou nesta rodada e quem ainda vai jogar
 * ficam ambos esbatidos. Cada retrato tem o dado de rolar e o valor da
 * iniciativa por baixo, para não duplicar esse controlo nos cartões. */
function TrilhaIniciativa({ combatentes, turnoIndex, onRolarIni, onIniciativaManual, onAbrir }) {
  if (combatentes.length === 0) return null;
  return (
    <div className="trilha-iniciativa">
      {combatentes.map((c, i) => {
        const imagem = c.ficha?.imagem || null;
        const ativo = i === turnoIndex;
        return (
          <div key={c.id} className={`trilha-iniciativa-item${ativo ? ' ativo' : ''}`}>
            <button
              type="button"
              className="trilha-iniciativa-retrato"
              style={imagem ? { backgroundImage: `url(${imagem})` } : undefined}
              onClick={() => onAbrir(c.id)}
              title={`${c.nome} — abrir`}
            >
              {!imagem && (c.nome?.[0]?.toUpperCase() || '?')}
            </button>
            <div className="trilha-iniciativa-nome">{c.nome}</div>
            <div className="trilha-iniciativa-ini">
              <button type="button" onClick={() => onRolarIni(c.id)} title="Rolar iniciativa (1d20 + Agilidade)">🎲</button>
              <input
                type="number"
                value={c.iniciativa ?? ''}
                onChange={(e) => onIniciativaManual(c.id, e.target.value)}
                title="Iniciativa manual"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
