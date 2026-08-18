import React, { useCallback, useEffect, useRef, useState } from 'react';
import Inicio from './components/Inicio.jsx';
import Wizard from './components/wizard/Wizard.jsx';
import Ficha from './components/ficha/Ficha.jsx';
import PainelRolagem from './components/PainelRolagem.jsx';
import { personagemVazio } from './engine/character.js';
import { descarregarPdf } from './export/pdf.js';
import { guardarAgente, exportarJson, novoId } from './engine/armazenamento.js';

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

  const rolar = useCallback((resultado) => {
    if (resultado) setRolagens((r) => [...r.slice(-9), resultado]);
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

  return (
    <div className="app">
      <div className="topbar">
        <h1>Ordem <em>Paranormal</em></h1>
        <div className="acoes">
          {vista !== 'inicio' && (
            <>
              {guardadoEm && <span className="pill">guardado</span>}
              <button className="btn ghost sm" onClick={voltarAoInicio}>Agentes</button>
              {vista === 'ficha' && <button className="btn ghost sm" onClick={() => setVista('wizard')}>Criação</button>}
              {vista === 'wizard' && personagem?.classeId && <button className="btn ghost sm" onClick={() => setVista('ficha')}>Ver ficha</button>}
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
      {vista === 'ficha' && personagem && (
        <Ficha personagem={personagem} setPersonagem={setPersonagem} onRolar={rolar} />
      )}

      <PainelRolagem
        rolagens={rolagens}
        aoFechar={(id) => setRolagens((r) => r.filter((x) => x.id !== id))}
        aoLimpar={() => setRolagens([])}
      />
    </div>
  );
}
