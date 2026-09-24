import React, { useCallback, useState, useEffect, useRef } from 'react';
import HubEquipa from './HubEquipa.jsx';
import CampoDeBatalha from './CampoDeBatalha.jsx';
import Geradores from './Geradores.jsx';
import Bestiario from './Bestiario.jsx';
import Elenco from './Elenco.jsx';
import { listarAgentes, guardarAgente, apagarAgente } from '../../engine/armazenamento.js';
import { estadoCombateVazio, adicionarCombatente, editarCombatente } from '../../engine/combateTracker.js';
import { SubscritorMestre, lerCodigosMestre, guardarCodigosMestre } from '../../engine/redeMestre.js';
import { lerCombateLocal, guardarCombateLocal, resumoRolagemJogador } from '../../engine/campoBatalha.js';

/** O combate guardado da última visita, com as fichas atuais do Ordo. */
function combateInicial() {
  const fichasPorId = Object.fromEntries(listarAgentes().map((f) => [f.id, f]));
  return lerCombateLocal(fichasPorId) || { estado: estadoCombateVazio(), registo: [] };
}

const novoIdRegisto = () => `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const ABAS = [
  { id: 'hub', nome: 'Hub de Equipa' },
  { id: 'gerar', nome: 'Gerar' },
  { id: 'bestiario', nome: 'Bestiário' },
  { id: 'elenco', nome: 'Elenco' },
  { id: 'campo', nome: 'Campo de Batalha' },
];

function ameacasGuardadas() {
  return listarAgentes().filter((a) => a.tipo === 'ameaca');
}

function agentesGuardados() {
  return listarAgentes().filter((a) => a.tipo !== 'ameaca');
}

/**
 * "Modo Mestre" — Painel central do Mestre de Ordem Paranormal RPG:
 * - Hub de Equipa em Tempo Real (P2P WebRTC)
 * - Geradores de NPCs, Ocultistas e Ameaças
 * - Bestiário (ameaças) e Elenco (NPCs, sempre em ficha 4)
 * - Campo de Batalha: balanço de VD/NEX, lados/equipas ilimitados, cartões
 *   de combate e rastreador de iniciativa — tudo numa aba só
 */
export default function ModoMestre({ aoAbrir }) {
  const [aba, setAba] = useState('hub');
  const [listaAmeacas, setListaAmeacas] = useState(ameacasGuardadas);
  const [listaAgentes, setListaAgentes] = useState(agentesGuardados);
  const [inicial] = useState(combateInicial);
  const [estadoCombate, setEstadoCombate] = useState(inicial.estado);
  // Registo do combate (rolagens do Mestre e dos jogadores, dano, turnos) —
  // vive aqui para continuar a apanhar as rolagens dos jogadores noutras abas
  const [registo, setRegisto] = useState(inicial.registo);
  const registar = useCallback((entrada) => {
    setRegisto((r) => [...r, { id: novoIdRegisto(), quando: Date.now(), ...entrada }].slice(-200));
  }, []);
  const limparRegisto = useCallback(() => setRegisto([]), []);

  // o combate fica guardado neste browser (fecha-se a app e continua onde estava)
  useEffect(() => {
    const t = setTimeout(() => guardarCombateLocal(estadoCombate, registo), 400);
    return () => clearTimeout(t);
  }, [estadoCombate, registo]);

  // Gestão de Salas e Conexão P2P Multi-Player
  const [codigos, setCodigos] = useState(lerCodigosMestre);
  const [agentesConectados, setAgentesConectados] = useState([]);
  const subscritorRef = useRef(null);

  // Rolagens dos jogadores ligados → registo; PV/SAN/PE que mudaram na ficha
  // do jogador → o seu cartão no combate (a ficha dele é que manda)
  const vistas = useRef(new Set());
  const montadoEm = useRef(Date.now());
  useEffect(() => {
    for (const a of agentesConectados) {
      const r = a.dados?.rolagem;
      if (!r?.quando || r.quando < montadoEm.current - 2000) continue;
      const chave = `${a.codigo}:${r.quando}`;
      if (vistas.current.has(chave)) continue;
      vistas.current.add(chave);
      registar({ tipo: 'rolagem', origem: 'jogador', autor: a.dados?.nome || a.codigo, resumo: resumoRolagemJogador(r) });
    }
    setEstadoCombate((est) => {
      let novo = est;
      for (const a of agentesConectados) {
        if (!a.dados || !a.codigo) continue;
        const c = novo.combatentes.find((x) => x.codigo === a.codigo);
        if (!c) continue;
        const remoto = JSON.stringify({ pv: a.dados.pv, san: a.dados.san, pe: a.dados.pe, cond: a.dados.condicoes });
        if (remoto === c.ultimoRemoto) continue;
        novo = editarCombatente(novo, c.id, {
          ultimoRemoto: remoto,
          ...(a.dados.pv ? { pv: a.dados.pv } : null),
          ...(a.dados.san && c.san ? { san: a.dados.san } : null),
          ...(a.dados.pe && c.pe ? { pe: a.dados.pe } : null),
          condicoes: a.dados.condicoes || c.condicoes,
        });
      }
      return novo;
    });
  }, [agentesConectados, registar]);

  useEffect(() => {
    const sub = new SubscritorMestre();
    subscritorRef.current = sub;
    sub.iniciar();
    sub.definirCodigos(codigos);

    const cancelar = sub.aoAtualizar((lista) => {
      setAgentesConectados(lista);
    });

    return () => {
      cancelar();
      sub.destruir();
    };
  }, []);

  useEffect(() => {
    if (subscritorRef.current) {
      subscritorRef.current.definirCodigos(codigos);
    }
    guardarCodigosMestre(codigos);
  }, [codigos]);

  const recarregar = useCallback(() => {
    setListaAmeacas(ameacasGuardadas());
    setListaAgentes(agentesGuardados());
  }, []);

  const guardar = useCallback((p) => {
    const g = guardarAgente(p);
    recarregar();
    return g;
  }, [recarregar]);

  const apagar = useCallback((id) => {
    apagarAgente(id);
    recarregar();
  }, [recarregar]);

  const adicionarAoCombate = useCallback((agente) => {
    setEstadoCombate((est) =>
      adicionarCombatente(est, {
        id: agente.id || agente.codigo,
        nome: agente.nome,
        tipo: 'agente',
        subtipo: 'agente',
        equipaId: est.equipas?.[0]?.id || 'equipa-1',
        codigo: agente.codigo,
        nex: Number(agente.nex || 20),
        agi: Number(agente.atributos?.agi ?? 1),
        pv: agente.pv || { atual: 20, max: 20, temp: 0 },
        san: agente.san || null,
        pe: agente.pe || null,
        condicoes: agente.condicoes || [],
      })
    );
    setAba('campo');
  }, []);

  // Extrair dados puros dos agentes conectados com dados válidos
  const dadosAgentesConectados = agentesConectados
    .filter((a) => a.dados && a.status === 'ligado')
    .map((a) => ({
      ...a.dados,
      codigo: a.codigo,
      status: a.status,
    }));

  return (
    <div className="container">
      <h2 style={{ fontFamily: 'var(--display)', fontSize: 26, marginBottom: 4 }}>Modo Mestre</h2>
      <p className="dica" style={{ marginTop: 0, marginBottom: 20 }}>
        Hub da equipa em tempo real, geradores de NPCs e ocultistas, Bestiário e Elenco para guardar o que crias, e um Campo de Batalha único para montar encontros, ver o balanço de VD/NEX e correr o combate com iniciativa e turnos.
      </p>

      <div className="abas">
        {ABAS.map((s) => (
          <button key={s.id} className={aba === s.id ? 'ativa' : ''} onClick={() => setAba(s.id)}>
            {s.nome}
          </button>
        ))}
      </div>

      {aba === 'hub' && (
        <HubEquipa
          codigos={codigos}
          setCodigos={setCodigos}
          agentesConectados={agentesConectados}
          aoAdicionarAoCombate={adicionarAoCombate}
        />
      )}
      {aba === 'gerar' && <Geradores aoGuardar={guardar} aoAbrir={aoAbrir} />}
      {aba === 'bestiario' && <Bestiario lista={listaAmeacas} aoAbrir={aoAbrir} aoApagar={apagar} aoGuardar={guardar} />}
      {aba === 'elenco' && (
        <Elenco
          lista={listaAgentes.filter((a) => a.tipo === 'npc')}
          aoAbrir={aoAbrir}
          aoApagar={apagar}
          aoGuardar={guardar}
        />
      )}
      {aba === 'campo' && (
        <CampoDeBatalha
          estadoCombate={estadoCombate}
          setEstadoCombate={setEstadoCombate}
          ameacas={listaAmeacas}
          agentes={listaAgentes}
          agentesConectados={dadosAgentesConectados}
          aoGuardar={guardar}
          registo={registo}
          registar={registar}
          limparRegisto={limparRegisto}
        />
      )}
    </div>
  );
}
