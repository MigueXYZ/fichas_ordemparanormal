import React, { useState, useMemo, useCallback } from 'react';
import {
  estadoCombateVazio, adicionarCombatente, removerCombatente, editarCombatente,
  proximoTurno, turnoAnterior, adicionarEquipa, removerEquipa, editarEquipa,
  adicionarEfeitoCombatente, removerEfeitoCombatente, novoIdCombatente,
} from '../../engine/combateTracker.js';
import { calcMaximos, calcDefesas } from '../../engine/calc.js';
import { vitaisLivre } from '../../engine/fichaLivre.js';
import { avaliarBalanco, rolarIniciativaDe, resumoRolagem } from '../../engine/campoBatalha.js';
import PainelRolagem from '../PainelRolagem.jsx';
import PainelCombatente from './campo/PainelCombatente.jsx';
import ListaIniciativa from './campo/ListaIniciativa.jsx';
import RegistoCombate from './campo/RegistoCombate.jsx';
import AdicionarCombatentes from './campo/AdicionarCombatentes.jsx';
import { BarraRecurso, estadoVida } from './campo/pecas.jsx';
import tokenPlaceholder from '../../assets/token-placeholder.png';

/** Valor de VD/NEX com que um combatente pesa no balanço do encontro. */
const pesoDe = (c) => Number(c.tipo === 'agente' ? c.nex : c.vd) || 0;

/** Mantém a vez com quem a tinha quando a ordem muda (iniciativa nova). */
function mantendoVez(antes, depois) {
  const ativo = antes.combatentes[antes.turnoIndex]?.id;
  const i = depois.combatentes.findIndex((c) => c.id === ativo);
  return i >= 0 ? { ...depois, turnoIndex: i } : depois;
}

/** Os números de combate de uma ficha, para entrar no Campo de Batalha. */
function combatenteDeFicha(ficha, equipaId, nome) {
  const base = { id: novoIdCombatente(), fichaId: ficha.id || null, nome: nome || ficha.nome || 'Combatente', equipaId, ficha };
  if (ficha.tipo === 'ameaca' || ficha.fichaLivre) {
    const v = vitaisLivre(ficha);
    const ameaca = ficha.tipo === 'ameaca';
    return {
      ...base,
      tipo: ameaca ? 'ameaca' : 'npc', subtipo: ameaca ? 'criatura' : 'livre',
      vd: Number(ficha.vd) || 0, agi: v.agi,
      // uma ameaça do Bestiário é um modelo: cada cópia começa com os PV cheios
      pv: ameaca ? { atual: v.pv.max, max: v.pv.max, temp: 0 } : v.pv,
      san: ameaca ? null : v.san, pe: ameaca ? null : v.pe, defesa: v.defesa,
    };
  }
  const max = calcMaximos(ficha);
  const defesas = calcDefesas(ficha);
  return {
    ...base,
    tipo: ficha.tipo === 'npc' ? 'npc' : 'agente', subtipo: ficha.tipo === 'npc' ? 'npc' : 'agente',
    nex: Number(ficha.nex || 0), agi: Number(ficha.atributos?.agi ?? 1),
    pv: { atual: ficha.pvAtual ?? max.pv, max: max.pv, temp: ficha.pvTemp || 0 },
    san: max.semSanidade ? null : { atual: ficha.sanAtual ?? max.san, max: max.san, temp: 0 },
    pe: { atual: ficha.peAtual ?? max.pe, max: max.pe, temp: 0 },
    defesa: Number(defesas.defesa || 10),
  };
}

/**
 * Campo de Batalha do Modo Mestre: montar o encontro (fichas de agente, NPCs
 * do Elenco, ameaças do Bestiário ou do compêndio, jogadores ligados), ver o
 * balanço VD/NEX, e correr o combate — turnos e iniciativa, dano por tipo com
 * Resistências/Imunidades/Vulnerabilidades, cura, Sanidade, condições, ataques
 * contra um alvo, e um registo de todas as rolagens (as do Mestre e as dos
 * jogadores ligados pelo Hub).
 */
export default function CampoDeBatalha({
  agentes = [], ameacas = [], agentesConectados = [],
  estadoCombate, setEstadoCombate, aoGuardar,
  registo = [], registar = () => {}, limparRegisto = () => {},
}) {
  const estado = estadoCombate || estadoCombateVazio();
  const setEstado = setEstadoCombate;
  const equipas = estado.equipas || [];
  const combatentes = estado.combatentes || [];
  const ativo = combatentes[estado.turnoIndex] || null;

  const [selecionadoId, setSelecionadoId] = useState(null);
  const [adicionarEm, setAdicionarEm] = useState(null); // equipaId do "+ Adicionar", ou null
  const [rolagens, setRolagens] = useState([]);

  const fichasAgentes = useMemo(() => agentes.filter((a) => a.tipo !== 'npc'), [agentes]);
  const npcsElenco = useMemo(() => agentes.filter((a) => a.tipo === 'npc'), [agentes]);

  const lados = useMemo(() => equipas.map((eq) => {
    const membros = combatentes.filter((c) => c.equipaId === eq.id);
    return { ...eq, membros, total: membros.reduce((s, c) => s + pesoDe(c), 0) };
  }), [equipas, combatentes]);

  const balanco = useMemo(() => {
    const [agentesLado, ...outros] = lados;
    const nex = agentesLado?.total || 0;
    const vd = outros.reduce((s, l) => s + l.total, 0);
    return { ...avaliarBalanco(nex, vd), nex, vd };
  }, [lados]);

  // ------------------------------------------------------------ rolagens
  const onRolar = useCallback((r, autor = 'Mestre') => {
    if (!r) return;
    setRolagens((a) => [...a.slice(-9), r]);
    registar({ tipo: 'rolagem', origem: 'mestre', autor, resumo: resumoRolagem(r) });
  }, [registar]);
  const fecharRolagem = useCallback((id) => setRolagens((a) => a.filter((r) => r.id !== id)), []);
  const limparRolagens = useCallback(() => setRolagens([]), []);

  // ------------------------------------------------------------ combatentes
  function adicionarFichas(ficha, equipaId, quantidade = 1, { propria = false } = {}) {
    const existentes = combatentes.filter((c) => (c.fichaId && c.fichaId === ficha.id) || c.nome === ficha.nome).length;
    const n = Math.max(1, Math.min(20, Number(quantidade) || 1));
    setEstado((est) => {
      let novo = est;
      for (let i = 0; i < n; i++) {
        const numerar = n > 1 || existentes > 0;
        const nome = numerar ? `${ficha.nome} ${existentes + i + 1}` : ficha.nome;
        const c = { ...combatenteDeFicha(ficha, equipaId, nome), fichaPropria: propria };
        novo = mantendoVez(novo, adicionarCombatente(novo, c));
      }
      return novo;
    });
    registar({ tipo: 'evento', texto: `${n > 1 ? `${n}× ` : ''}${ficha.nome} entra${n > 1 ? 'm' : ''} no combate` });
  }

  function adicionarConectado(ag, equipaId) {
    if (combatentes.some((c) => c.codigo && c.codigo === ag.codigo)) return;
    setEstado((est) => mantendoVez(est, adicionarCombatente(est, {
      id: `jog-${ag.codigo}`, codigo: ag.codigo, nome: ag.nome || 'Jogador',
      tipo: 'agente', subtipo: 'agente', equipaId,
      nex: Number(String(ag.subtitulo || '').match(/NEX (\d+)/)?.[1] || ag.nex || 0),
      pv: ag.pv || { atual: 20, max: 20, temp: 0 }, san: ag.san || null, pe: ag.pe || null,
      defesa: Number(ag.defesa || 10), condicoes: ag.condicoes || [],
      ficha: { nome: ag.nome, imagem: ag.token || ag.imagem || null },
    })));
    registar({ tipo: 'evento', texto: `${ag.nome || 'Jogador'} (ligado) entra no combate` });
  }

  const combatentePorId = (id) => combatentes.find((c) => c.id === id);

  /** Grava na ficha guardada o que mudou nela (só agentes e NPCs do Elenco — as
   * ameaças do Bestiário são modelos, e os jogadores ligados têm a ficha deles). */
  function persistirFicha(c, patch) {
    if (!aoGuardar || !c?.ficha?.id || c.codigo || c.tipo === 'ameaca' || c.fichaPropria) return c?.ficha;
    const nova = { ...c.ficha, ...patch };
    aoGuardar(nova);
    return nova;
  }

  function aplicarDano(id, resultado, descricao) {
    const c = combatentePorId(id);
    if (!c || !resultado) return;
    const patchFicha = { pvAtual: resultado.novoPvAtual, pvTemp: resultado.novoPvTemp };
    const alteracoes = { pv: { atual: resultado.novoPvAtual, temp: resultado.novoPvTemp } };
    if (c.san && resultado.totalLiquidoSan > 0) {
      alteracoes.san = { atual: resultado.novoSanAtual };
      patchFicha.sanAtual = resultado.novoSanAtual;
    }
    const ficha = persistirFicha(c, patchFicha);
    setEstado((est) => editarCombatente(est, id, { ...alteracoes, ficha }));
    const partes = [`−${resultado.totalLiquidoPv} PV`];
    if (resultado.totalLiquidoSan > 0) partes.push(`−${resultado.totalLiquidoSan} SAN`);
    registar({
      tipo: 'dano', alvo: c.nome,
      texto: `${c.nome} sofre ${partes.join(' e ')}${descricao ? ` (${descricao})` : ''}${resultado.novoPvAtual === 0 ? ' — caído!' : ''}`,
      notas: resultado.notas || [],
    });
  }

  function definirRecurso(id, recurso, valor) {
    const c = combatentePorId(id);
    if (!c?.[recurso]) return;
    const antes = Number(c[recurso].atual) || 0;
    const novo = Math.max(0, Math.min(Number(c[recurso].max) || 0, Math.round(Number(valor) || 0)));
    if (novo === antes) return;
    const campo = { pv: 'pvAtual', san: 'sanAtual', pe: 'peAtual' }[recurso];
    const ficha = persistirFicha(c, { [campo]: novo });
    setEstado((est) => editarCombatente(est, id, { [recurso]: { atual: novo }, ficha }));
    const delta = novo - antes;
    registar({ tipo: delta > 0 ? 'cura' : 'dano', alvo: c.nome, texto: `${c.nome}: ${delta > 0 ? '+' : '−'}${Math.abs(delta)} ${recurso.toUpperCase()} (${novo}/${c[recurso].max})` });
  }

  function atualizarFicha(id, patch) {
    const c = combatentePorId(id);
    if (!c?.ficha) return;
    const nova = { ...c.ficha, ...patch };
    if (aoGuardar && c.ficha.id && !c.codigo && !c.fichaPropria) aoGuardar(nova);
    const extra = {};
    if (patch.nome && (c.tipo !== 'ameaca')) extra.nome = patch.nome;
    if ('defesa' in patch) extra.defesa = Number(patch.defesa) || c.defesa;
    // ficha livre: PV/PE/SAN máximos escritos na ficha; agente: os atuais mudados na ficha
    if (c.ficha.fichaLivre || c.ficha.tipo === 'ameaca') {
      if ('pv' in patch && Number(patch.pv)) extra.pv = { max: Number(patch.pv), atual: Math.min(c.pv.atual, Number(patch.pv)) };
    } else {
      if ('pvAtual' in patch) extra.pv = { atual: Number(patch.pvAtual) || 0 };
      if ('sanAtual' in patch && c.san) extra.san = { atual: Number(patch.sanAtual) || 0 };
      if ('peAtual' in patch && c.pe) extra.pe = { atual: Number(patch.peAtual) || 0 };
    }
    setEstado((est) => editarCombatente(est, id, { ficha: nova, ...extra }));
  }

  function removerDoCombate(id) {
    const c = combatentePorId(id);
    setEstado((est) => mantendoVez(est, removerCombatente(est, id)));
    if (selecionadoId === id) setSelecionadoId(null);
    if (c) registar({ tipo: 'evento', texto: `${c.nome} sai do combate` });
  }

  function mudarLado(id, equipaId) { setEstado((est) => editarCombatente(est, id, { equipaId })); }

  function adicionarEfeito(id, efeito) {
    const c = combatentePorId(id);
    setEstado((est) => adicionarEfeitoCombatente(est, id, efeito));
    if (c) registar({ tipo: 'evento', texto: `${c.nome}: ${efeito.nome}${efeito.duracao === 'permanente' ? '' : ` (${efeito.duracao} rod.)`}` });
  }
  function removerEfeito(id, efeitoId) { setEstado((est) => removerEfeitoCombatente(est, id, efeitoId)); }

  // ------------------------------------------------------------ iniciativa e turnos
  function rolarIniciativa(id) {
    const c = combatentePorId(id);
    if (!c) return;
    const r = rolarIniciativaDe(c);
    onRolar(r, c.nome);
    setEstado((est) => mantendoVez(est, editarCombatente(est, id, { iniciativa: r.total, iniciativaRolada: true })));
  }

  function rolarIniciativas(soEmFalta) {
    const alvo = combatentes.filter((c) => !soEmFalta || c.iniciativa == null);
    if (!alvo.length) return;
    const resultados = alvo.map((c) => [c, rolarIniciativaDe(c)]);
    resultados.forEach(([c, r]) => registar({ tipo: 'rolagem', origem: 'mestre', autor: c.nome, resumo: resumoRolagem(r) }));
    setEstado((est) => {
      let novo = est;
      for (const [c, r] of resultados) novo = editarCombatente(novo, c.id, { iniciativa: r.total, iniciativaRolada: true });
      // uma ronda nova de iniciativa começa sempre em quem tem a mais alta
      return soEmFalta ? mantendoVez(est, novo) : { ...novo, turnoIndex: 0 };
    });
  }

  function definirIniciativa(id, valor) {
    setEstado((est) => mantendoVez(est, editarCombatente(est, id, { iniciativa: valor === '' ? null : Number(valor) })));
  }

  function avancar() {
    if (!combatentes.length) return;
    const novo = proximoTurno(estado);
    setEstado(novo);
    const vez = novo.combatentes[novo.turnoIndex];
    registar({ tipo: 'turno', texto: `Rodada ${novo.rodada} · vez de ${vez?.nome || '—'}` });
    (novo.efeitosExpirados || []).forEach((e) => registar({ tipo: 'evento', texto: `${e.combatenteNome}: ${e.efeitoNome} terminou` }));
  }
  function recuar() { if (combatentes.length) setEstado(turnoAnterior(estado)); }

  function recomecar() {
    setEstado((est) => ({
      ...est, rodada: 1, turnoIndex: 0, emAndamento: false,
      combatentes: est.combatentes.map((c) => ({ ...c, iniciativa: null, iniciativaRolada: false, efeitos: [] })),
    }));
    registar({ tipo: 'turno', texto: 'Novo combate — iniciativas por rolar' });
  }
  function limparCampo() {
    if (!window.confirm('Tirar toda a gente do Campo de Batalha? (as fichas guardadas não são apagadas)')) return;
    setEstado((est) => ({ ...estadoCombateVazio(), equipas: est.equipas }));
    setSelecionadoId(null);
  }

  // ------------------------------------------------------------ lados
  const criarLado = () => setEstado((est) => adicionarEquipa(est));
  const apagarLado = (id) => { if (equipas.length > 1) setEstado((est) => removerEquipa(est, id)); };
  const renomearLado = (id, nome) => setEstado((est) => editarEquipa(est, id, { nome }));
  const corLado = (id, cor) => setEstado((est) => editarEquipa(est, id, { cor }));

  const selecionado = selecionadoId ? combatentePorId(selecionadoId) : null;

  return (
    <div className="cb">
      {/* ---------------- barra de turno */}
      <div className="cb-barra">
        <div className="cb-rodada">
          <span className="cb-rotulo">Rodada</span>
          <b>{estado.rodada || 1}</b>
        </div>
        <div className="cb-vez">
          {ativo ? (
            <button type="button" className="cb-vez-quem" onClick={() => setSelecionadoId(ativo.id)} title="Abrir">
              <span className="cb-token-mini" style={{ backgroundImage: `url(${ativo.ficha?.imagem || tokenPlaceholder})` }} />
              <span><span className="cb-rotulo">Vez de</span><b>{ativo.nome}</b></span>
            </button>
          ) : <span className="cb-rotulo">Junta combatentes para começar</span>}
        </div>
        <div className="cb-barra-botoes">
          <button type="button" className="btn ghost sm" onClick={recuar} disabled={!combatentes.length} title="Turno anterior">◀</button>
          <button type="button" className="btn sm" onClick={avancar} disabled={!combatentes.length}>Próximo turno ▶</button>
        </div>
        <div className="cb-barra-botoes">
          <button type="button" className="btn ghost sm" onClick={recomecar} disabled={!combatentes.length} title="Rodada 1, iniciativas e efeitos limpos">Recomeçar</button>
          <button type="button" className="btn ghost sm" onClick={limparCampo} disabled={!combatentes.length}>Limpar campo</button>
        </div>
        <div className={`cb-balanco nivel-${balanco.nivel}`} title="NEX somado do 1.º lado contra o VD somado dos restantes (VD ≈ NEX do grupo = equilibrado)">
          <span>NEX {balanco.nex}</span><span className="cb-rotulo">vs</span><span>VD {balanco.vd}</span>
          <b>{balanco.texto}</b>
        </div>
      </div>

      <div className="cb-grelha">
        {/* ---------------- lados */}
        <div className="cb-lados">
          {lados.map((lado) => (
            <section key={lado.id} className="cb-lado" style={{ '--cor-lado': lado.cor }}>
              <header className="cb-lado-topo">
                <input type="color" className="cb-lado-cor" value={lado.cor} onChange={(e) => corLado(lado.id, e.target.value)} title="Cor do lado" />
                <input type="text" className="cb-lado-nome" value={lado.nome} onChange={(e) => renomearLado(lado.id, e.target.value)} aria-label="Nome do lado" />
                <span className="cb-lado-total" title={lado.id === equipas[0]?.id ? 'NEX somado' : 'VD somado'}>
                  {lado.id === equipas[0]?.id ? 'NEX' : 'VD'} {lado.total}
                </span>
                <button type="button" className="btn sm" onClick={() => setAdicionarEm(lado.id)}>+ Adicionar</button>
                {equipas.length > 1 && (
                  <button type="button" className="cb-x" onClick={() => apagarLado(lado.id)} title="Remover lado (quem lá está passa para o 1.º)">×</button>
                )}
              </header>
              {lado.membros.length === 0 ? (
                <button type="button" className="cb-lado-vazio" onClick={() => setAdicionarEm(lado.id)}>
                  Ninguém aqui ainda — <u>adicionar</u> fichas, NPCs, ameaças ou jogadores ligados
                </button>
              ) : (
                <div className="cb-cartoes">
                  {lado.membros.map((c) => (
                    <CartaoCampo key={c.id} c={c} ativo={ativo?.id === c.id} onAbrir={() => setSelecionadoId(c.id)} />
                  ))}
                </div>
              )}
            </section>
          ))}
          <button type="button" className="cb-novo-lado" onClick={criarLado}>+ Novo lado (terceira facção…)</button>
        </div>

        {/* ---------------- lateral: iniciativa + registo */}
        <aside className="cb-lateral">
          <ListaIniciativa
            combatentes={combatentes}
            equipas={equipas}
            turnoIndex={estado.turnoIndex}
            onAbrir={setSelecionadoId}
            onRolar={rolarIniciativa}
            onRolarTodas={() => rolarIniciativas(false)}
            onRolarEmFalta={() => rolarIniciativas(true)}
            onDefinir={definirIniciativa}
          />
          <RegistoCombate registo={registo} onLimpar={limparRegisto} onRolar={(r) => onRolar(r, 'Mestre')} />
        </aside>
      </div>

      {selecionado && (
        <PainelCombatente
          c={selecionado}
          combatentes={combatentes}
          equipas={equipas}
          ehVez={ativo?.id === selecionado.id}
          onFechar={() => setSelecionadoId(null)}
          onRolar={(r) => onRolar(r, selecionado.nome)}
          onAplicarDano={aplicarDano}
          onDefinirRecurso={definirRecurso}
          onAdicionarEfeito={(ef) => adicionarEfeito(selecionado.id, ef)}
          onRemoverEfeito={(efId) => removerEfeito(selecionado.id, efId)}
          onRolarIniciativa={() => rolarIniciativa(selecionado.id)}
          onMudarLado={(eqId) => mudarLado(selecionado.id, eqId)}
          onRemover={() => removerDoCombate(selecionado.id)}
          onAtualizarFicha={(patch) => atualizarFicha(selecionado.id, patch)}
          registar={registar}
        />
      )}

      {adicionarEm && (
        <AdicionarCombatentes
          equipaId={adicionarEm}
          equipas={equipas}
          fichasAgentes={fichasAgentes}
          npcsElenco={npcsElenco}
          ameacas={ameacas}
          agentesConectados={agentesConectados}
          jaNoCombate={combatentes}
          onAdicionar={adicionarFichas}
          onAdicionarConectado={adicionarConectado}
          onFechar={() => setAdicionarEm(null)}
        />
      )}

      <PainelRolagem rolagens={rolagens} aoFechar={fecharRolagem} aoLimpar={limparRolagens} />
    </div>
  );
}

function CartaoCampo({ c, ativo, onAbrir }) {
  const vida = estadoVida(c);
  const sub = [
    c.tipo === 'agente' ? (c.nex ? `NEX ${c.nex}%` : 'Agente') : (c.vd ? `VD ${c.vd}` : c.tipo === 'ameaca' ? 'Ameaça' : 'NPC'),
    `Def ${c.defesa ?? '—'}`,
    c.codigo ? 'ligado' : null,
  ].filter(Boolean).join(' · ');
  return (
    <button type="button" className={`cb-cartao${ativo ? ' ativo' : ''}${vida ? ` ${vida}` : ''}`} onClick={onAbrir} title="Abrir: dano, cura, ataques, condições, ficha">
      <span className="cb-cartao-token" style={{ backgroundImage: `url(${c.ficha?.imagem || tokenPlaceholder})` }}>
        {c.iniciativa != null && <span className="cb-cartao-ini" title="Iniciativa">{c.iniciativa}</span>}
      </span>
      <span className="cb-cartao-corpo">
        <span className="cb-cartao-nome">{c.nome}</span>
        <span className="cb-cartao-sub">{sub}{vida === 'caido' ? ' · caído' : vida === 'machucado' ? ' · machucado' : ''}</span>
        <BarraRecurso rotulo="PV" r={c.pv} classe="pv" />
        <BarraRecurso rotulo="SAN" r={c.san} classe="san" />
        <BarraRecurso rotulo="PE" r={c.pe} classe="pe" />
        {(c.efeitos?.length > 0 || c.condicoes?.length > 0) && (
          <span className="cb-chips">
            {(c.efeitos || []).map((e) => <span key={e.id} className="cb-chip">{e.nome}{e.duracao !== 'permanente' ? ` ${e.duracao}` : ''}</span>)}
            {(c.condicoes || []).map((k) => <span key={k} className="cb-chip fraco">{String(k)}</span>)}
          </span>
        )}
      </span>
    </button>
  );
}
