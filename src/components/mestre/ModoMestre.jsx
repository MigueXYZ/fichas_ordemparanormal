import React, { useCallback, useState, useEffect, useRef } from 'react';
import HubEquipa from './HubEquipa.jsx';
import Combate from './Combate.jsx';
import Geradores from './Geradores.jsx';
import Bestiario from './Bestiario.jsx';
import Encontro from './Encontro.jsx';
import { listarAgentes, guardarAgente, apagarAgente } from '../../engine/armazenamento.js';
import { estadoCombateVazio, adicionarCombatente } from '../../engine/combateTracker.js';
import { SubscritorMestre, lerCodigosMestre, guardarCodigosMestre } from '../../engine/redeMestre.js';

const ABAS = [
  { id: 'hub', nome: 'Hub de Equipa' },
  { id: 'combate', nome: 'Rastreador de Combate' },
  { id: 'gerar', nome: 'Gerar' },
  { id: 'bestiario', nome: 'Bestiário' },
  { id: 'encontro', nome: 'Encontro' },
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
 * - Rastreador de Combate & Iniciativa Multilateral (Multi-Equipas / Múltiplos Lados)
 * - Geradores de NPCs, Ocultistas e Ameaças
 * - Bestiário
 * - Planeador de Encontros (Cálculo de VD Multi-Agente & Multi-Inimigo)
 */
export default function ModoMestre({ aoAbrir }) {
  const [aba, setAba] = useState('hub');
  const [listaAmeacas, setListaAmeacas] = useState(ameacasGuardadas);
  const [listaAgentes, setListaAgentes] = useState(agentesGuardados);
  const [estadoCombate, setEstadoCombate] = useState(estadoCombateVazio);

  // Gestão de Salas e Conexão P2P Multi-Player
  const [codigos, setCodigos] = useState(lerCodigosMestre);
  const [agentesConectados, setAgentesConectados] = useState([]);
  const subscritorRef = useRef(null);

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
    setAba('combate');
  }, []);

  const iniciarCombateComEncontro = useCallback((combatentes) => {
    setEstadoCombate((est) => {
      let novoEst = est;
      for (const c of combatentes) {
        novoEst = adicionarCombatente(novoEst, c);
      }
      return novoEst;
    });
    setAba('combate');
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
        Hub da equipa em tempo real, rastreador de combate multilateral com iniciativas e turnos, geradores de NPCs e ocultistas, bestiário e cálculo de VD de encontros.
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
      {aba === 'combate' && (
        <Combate
          estadoCombate={estadoCombate}
          setEstadoCombate={setEstadoCombate}
          ameacas={listaAmeacas}
          agentes={listaAgentes}
          agentesConectados={dadosAgentesConectados}
        />
      )}
      {aba === 'gerar' && <Geradores aoGuardar={guardar} aoAbrir={aoAbrir} />}
      {aba === 'bestiario' && <Bestiario lista={listaAmeacas} aoAbrir={aoAbrir} aoApagar={apagar} />}
      {aba === 'encontro' && (
        <Encontro
          ameacas={listaAmeacas}
          agentes={listaAgentes}
          agentesConectados={dadosAgentesConectados}
          aoIniciarCombate={iniciarCombateComEncontro}
        />
      )}
    </div>
  );
}
