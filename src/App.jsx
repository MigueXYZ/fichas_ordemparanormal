import React, { useCallback, useEffect, useRef, useState } from 'react';
import Inicio from './components/Inicio.jsx';
import Wizard from './components/wizard/Wizard.jsx';
import Ficha from './components/ficha/Ficha.jsx';
import PainelRolagem from './components/PainelRolagem.jsx';
import Fundo from './components/Fundo.jsx';
import EspacoToken from './components/EspacoToken.jsx';
import HistoricoRolagens from './components/HistoricoRolagens.jsx';
import PainelOverlay from './components/PainelOverlay.jsx';
import FichaAmeaca from './components/ficha/FichaAmeaca.jsx';
import { personagemVazio } from './engine/character.js';
import { descarregarPdf } from './export/pdf.js';
import { guardarAgente, exportarJson, novoId } from './engine/armazenamento.js';
import { tocarRolagem, alternarSom, somLigado, alternarCoracao, coracaoLigado } from './engine/som.js';
import { calcMaximos } from './engine/calc.js';
import { lerConfig, guardarConfig, publicar } from './overlay/transporte.js';

export default function App() {
  const [vista, setVista] = useState('inicio'); // inicio | wizard | ficha
  const [personagem, setPersonagem] = useState(null);
  const [rolagens, setRolagens] = useState([]);
  const [erro, setErro] = useState(null);
  const [aExportar, setAExportar] = useState(false);
  const [guardadoEm, setGuardadoEm] = useState(null);
  const temporizador = useRef(null);

  // guarda sozinho, 800 ms depois da última alteração
  useEffect(() => {
    if (!personagem || vista === 'inicio') return undefined;
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      const guardado = guardarAgente(personagem);
      if (guardado.id !== personagem.id) setPersonagem((p) => ({ ...p, id: guardado.id }));
      setGuardadoEm(Date.now());
    }, 800);
    return () => clearTimeout(temporizador.current);
  }, [personagem, vista]);

  const [som, setSom] = useState(somLigado);
  const [coracao, setCoracao] = useState(coracaoLigado);
  const [verHistorico, setVerHistorico] = useState(false);

  // ---- overlay para o OBS ----
  const [configOverlay, setConfigOverlay] = useState(lerConfig);
  const [verOverlay, setVerOverlay] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState(null);
  const ultimoEnvio = useRef('');
  const relogioOverlay = useRef(null);

  useEffect(() => {
    if (!configOverlay.ligado || !personagem || personagem.tipo === 'ameaca') {
      publicar({ ligado: false }, null);
      return undefined;
    }
    const max = calcMaximos(personagem);
    const ultima = rolagens[rolagens.length - 1] || null;
    const estado = {
      nome: personagem.nome || 'Agente',
      legenda: [personagem.patente, personagem.regras?.nivelSeparado
        ? `Nível ${personagem.nivel ?? 1} · NEX ${personagem.nex}%`
        : `NEX ${personagem.nex}%`].filter(Boolean).join(' · '),
      token: personagem.token || null,
      imagem: personagem.imagem || null,
      pv: { atual: personagem.pvAtual ?? max.pv, max: max.pv, temp: personagem.pvTemp || 0 },
      san: max.semSanidade ? null : { atual: personagem.sanAtual ?? max.san, max: max.san },
      pe: max.semSanidade ? null : { atual: personagem.peAtual ?? max.pe, max: max.pe, temp: personagem.peTemp || 0 },
      pd: max.semSanidade ? { atual: personagem.pdAtual ?? max.pd, max: max.pd, temp: personagem.pdTemp || 0 } : null,
      condicoes: personagem.condicoes || [],
      rolagem: ultima,
    };
    const corpo = JSON.stringify(estado);
    if (corpo === ultimoEnvio.current && configOverlay.modo !== 'p2p') return undefined;

    clearTimeout(relogioOverlay.current);
    relogioOverlay.current = setTimeout(async () => {
      ultimoEnvio.current = corpo;
      const r = await publicar(configOverlay, estado);
      setEstadoEnvio(r.ok ? { quando: Date.now() } : { erro: r.erro });
    }, 150);
    return () => clearTimeout(relogioOverlay.current);
  }, [personagem, rolagens, configOverlay]);

  const mudarOverlay = useCallback((novo) => {
    setConfigOverlay(guardarConfig(novo));
    ultimoEnvio.current = '';       // força um envio novo com a configuração nova
  }, []);

  const rolar = useCallback((resultado) => {
    if (!resultado) return;
    const registo = { ...resultado, quando: Date.now() };
    setRolagens((r) => [...r.slice(-9), registo]);
    // o histórico fica guardado com o agente (últimas 300 rolagens)
    setPersonagem((p) => (p ? { ...p, historico: [...(p.historico || []), registo].slice(-300) } : p));
    tocarRolagem({
      dados: resultado.dados || resultado.rolagens?.length || 1,
      critico: resultado.critico,
      falhaCritica: resultado.falhaCritica,
    });
  }, []);

  function criar() {
    setPersonagem({ ...personagemVazio(), id: novoId() });
    setVista('wizard');
  }

  function abrir(agente) {
    setPersonagem(agente);
    setVista('ficha');
  }

  function voltarAoInicio() {
    if (personagem) guardarAgente(personagem);
    setPersonagem(null);
    setVista('inicio');
  }

  async function exportarPdf() {
    setErro(null);
    setAExportar(true);
    try {
      await descarregarPdf(personagem);
    } catch (e) {
      setErro(e.message || 'Falha ao gerar o PDF.');
    } finally {
      setAExportar(false);
    }
  }

  // o espaço do token só aparece com uma ficha de agente aberta (e só em ecrãs
  // largos o suficiente para caber na margem — ver .espaco-token em styles.css)
  const comToken = vista !== 'inicio' && Boolean(personagem) && personagem.tipo !== 'ameaca';

  return (
    <div className="app">
      <Fundo />
      {comToken && (
        <EspacoToken
          token={personagem.token || null}
          aoMudarToken={(t) => setPersonagem((p) => ({ ...p, token: t }))}
        />
      )}
      <div className="topbar">
        <h1>Claudio <span className="marca-sub">· Ordem Paranormal</span></h1>
        <div className="acoes">
          <button
            className="btn ghost sm" title={som ? 'Desligar som dos dados' : 'Ligar som dos dados'}
            onClick={() => setSom(alternarSom())}
          >
            {som ? '♪ dados' : '♪ mudo'}
          </button>
          <button
            className={'btn ghost sm' + (coracao ? ' a-bater' : '')}
            title={coracao ? 'Desligar o batimento cardíaco' : 'Ligar o batimento cardíaco'}
            onClick={() => setCoracao(alternarCoracao())}
          >
            {coracao ? '♥' : '♡'}
          </button>
          {vista !== 'inicio' && (
            <>
              {guardadoEm && <span className="pill">guardado</span>}
              <button className="btn ghost sm" onClick={voltarAoInicio}>Agentes</button>
              {vista === 'ficha' && personagem?.tipo !== 'ameaca' && (
                <button className="btn ghost sm" onClick={() => setVista('wizard')}>Criação</button>
              )}
              {vista === 'wizard' && personagem?.classeId && <button className="btn ghost sm" onClick={() => setVista('ficha')}>Ver ficha</button>}
              <button className="btn ghost sm" onClick={() => setVerHistorico(true)}>
                Histórico{personagem?.historico?.length ? ` (${personagem.historico.length})` : ''}
              </button>
              <button
                className={'btn ghost sm' + (configOverlay.ligado ? ' a-transmitir' : '')}
                onClick={() => setVerOverlay(true)}
                title="Overlay para OBS"
              >
                Overlay{configOverlay.ligado ? ' •' : ''}
              </button>
              <button className="btn ghost sm" onClick={() => exportarJson(personagem)}>JSON</button>
              <button className="btn sm" onClick={exportarPdf} disabled={aExportar}>
                {aExportar ? 'A gerar…' : 'Exportar PDF'}
              </button>
            </>
          )}
        </div>
      </div>

      {erro && <div className="container" style={{ paddingBottom: 0 }}><div className="aviso"><strong>Erro:</strong> {erro}</div></div>}

      {vista === 'inicio' && <Inicio aoCriar={criar} aoAbrir={abrir} />}
      {vista === 'wizard' && personagem && (
        <Wizard personagem={personagem} setPersonagem={setPersonagem} onRolar={rolar} onFinalizar={() => setVista('ficha')} />
      )}
      {vista === 'ficha' && personagem && personagem.tipo === 'ameaca' && (
        <FichaAmeaca ameaca={personagem} setAmeaca={setPersonagem} onRolar={rolar} />
      )}
      {vista === 'ficha' && personagem && personagem.tipo !== 'ameaca' && (
        <Ficha personagem={personagem} setPersonagem={setPersonagem} onRolar={rolar} />
      )}

      {verHistorico && (
        <HistoricoRolagens
          historico={personagem?.historico || []}
          aoFechar={() => setVerHistorico(false)}
          aoLimpar={() => setPersonagem((p) => ({ ...p, historico: [] }))}
        />
      )}

      {verOverlay && (
        <PainelOverlay
          config={configOverlay}
          aoMudar={mudarOverlay}
          estadoEnvio={estadoEnvio}
          aoFechar={() => setVerOverlay(false)}
        />
      )}

      <PainelRolagem
        rolagens={rolagens}
        aoFechar={(id) => setRolagens((r) => r.filter((x) => x.id !== id))}
        aoLimpar={() => setRolagens([])}
      />
    </div>
  );
}
