import React, { useState } from 'react';
import Wizard from './components/wizard/Wizard.jsx';
import Ficha from './components/ficha/Ficha.jsx';
import { personagemVazio } from './engine/character.js';
import { descarregarPdf } from './export/pdf.js';

export default function App() {
  const [personagem, setPersonagem] = useState(personagemVazio);
  const [vista, setVista] = useState('wizard');
  const [erro, setErro] = useState(null);
  const [aExportar, setAExportar] = useState(false);

  async function exportar() {
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
        <h1>Criador de Fichas · Ordem Paranormal</h1>
        <div className="acoes">
          {vista === 'ficha' && <button className="btn ghost" onClick={() => setVista('wizard')}>Voltar à criação</button>}
          {vista === 'wizard' && personagem.classeId && <button className="btn ghost" onClick={() => setVista('ficha')}>Ver ficha</button>}
          <button className="btn" onClick={exportar} disabled={aExportar}>
            {aExportar ? 'A gerar…' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      {erro && <div className="container" style={{ paddingBottom: 0 }}><div className="aviso"><strong>Erro:</strong> {erro}</div></div>}

      {vista === 'wizard' ? (
        <Wizard personagem={personagem} setPersonagem={setPersonagem} onFinalizar={() => setVista('ficha')} />
      ) : (
        <Ficha personagem={personagem} setPersonagem={setPersonagem} />
      )}
    </div>
  );
}
