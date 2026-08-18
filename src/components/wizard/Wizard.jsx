import React, { useState } from 'react';
import StepAtributos from './StepAtributos.jsx';
import StepOrigem from './StepOrigem.jsx';
import StepClasse from './StepClasse.jsx';
import StepToquesFinais from './StepToquesFinais.jsx';
import { normalizarRecursos } from '../../engine/character.js';

const PASSOS = ['Atributos', 'Origem', 'Classe', 'Toques Finais'];

export default function Wizard({ personagem, setPersonagem, onFinalizar, onRolar }) {
  const [passo, setPasso] = useState(0);

  const atualizar = (patch) => setPersonagem({ ...personagem, ...patch });
  const podeFinalizar = Boolean(personagem.classeId);

  return (
    <div className="container">
      <div className="stepper">
        {PASSOS.map((nome, i) => (
          <React.Fragment key={nome}>
            {i > 0 && <div className="traco" />}
            <button className={'passo' + (i === passo ? ' ativo' : '')} onClick={() => setPasso(i)}>
              {nome}
            </button>
          </React.Fragment>
        ))}
      </div>

      {passo === 0 && <StepAtributos personagem={personagem} atualizar={atualizar} onRolar={onRolar} />}
      {passo === 1 && <StepOrigem personagem={personagem} setPersonagem={setPersonagem} />}
      {passo === 2 && <StepClasse personagem={personagem} setPersonagem={setPersonagem} />}
      {passo === 3 && (
        <StepToquesFinais
          personagem={personagem}
          atualizar={atualizar}
          podeFinalizar={podeFinalizar}
          onFinalizar={() => {
            setPersonagem(normalizarRecursos(personagem));
            onFinalizar();
          }}
        />
      )}

      <div className="navegacao">
        <button className="btn ghost" disabled={passo === 0} onClick={() => setPasso(passo - 1)}>Voltar</button>
        {passo < PASSOS.length - 1 ? (
          <button className="btn" onClick={() => setPasso(passo + 1)}>Continuar</button>
        ) : (
          <button className="btn" disabled={!podeFinalizar} onClick={() => { setPersonagem(normalizarRecursos(personagem)); onFinalizar(); }}>
            Finalizar
          </button>
        )}
      </div>
    </div>
  );
}
