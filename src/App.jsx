import React, { useCallback, useEffect, useRef, useState } from 'react';
import Inicio from './components/Inicio.jsx';
import Wizard from './components/wizard/Wizard.jsx';
import Ficha from './components/ficha/Ficha.jsx';
import PainelRolagem from './components/PainelRolagem.jsx';
import Fundo from './components/Fundo.jsx';
import EspacoToken from './components/EspacoToken.jsx';
import HistoricoRolagens from './components/HistoricoRolagens.jsx';
import FichaAmeaca from './components/ficha/FichaAmeaca.jsx';
import { personagemVazio } from './engine/character.js';
import { descarregarPdf } from './export/pdf.js';
import { guardarAgente, exportarJson, novoId } from './engine/armazenamento.js';
import { tocarRolagem, alternarSom, somLigado, alternarCoracao, coracaoLigado } from './engine/som.js';

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

  // o espaço do token só aparece com uma ficha de agente aberta
  const comToken = vista !== 'inicio' && Boolean(personagem) && personagem.tipo !== 'ameaca';

  return (
    <div className={'app' + (comToken ? ' com-token-lateral' : '')}>
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

      <PainelRolagem
        rolagens={rolagens}
        aoFechar={(id) => setRolagens((r) => r.filter((x) => x.id !== id))}
        aoLimpar={() => setRolagens([])}
      />
    </div>
  );
}
