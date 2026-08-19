import React, { useState } from 'react';
import StepAtributos from './StepAtributos.jsx';
import StepOrigem from './StepOrigem.jsx';
import StepClasse from './StepClasse.jsx';
import StepToquesFinais from './StepToquesFinais.jsx';
import { normalizarRecursos, ajustarRecursos } from '../../engine/character.js';
import { NEX_TRACK, calcMaximos, degrauNex, nexEfetivo } from '../../engine/calc.js';

const PASSOS = ['Atributos', 'Origem', 'Classe', 'Toques Finais'];

export default function Wizard({ personagem, setPersonagem, onFinalizar, onRolar }) {
  const [passo, setPasso] = useState(0);

  const atualizar = (patch) => setPersonagem({ ...personagem, ...patch });
  const podeFinalizar = Boolean(personagem.classeId);
  const max = calcMaximos(personagem);

  // o NEX manda em Vida/Sanidade/Esforço, na trilha e nos poderes: dá para o
  // definir em qualquer passo, não só depois de a ficha estar criada
  const mudarNex = (n) =>
    setPersonagem(ajustarRecursos(personagem, { ...personagem, nex: n === '' ? 0 : Number(n) }));
  const nexUtil = nexEfetivo(personagem);

  return (
    <div className="container">
      <div className="barra-nex">
        {personagem.regras?.nivelSeparado && (
          <>
            <label htmlFor="nivel-wizard">Nível</label>
            <input
              id="nivel-wizard" type="number" min="1" max={NEX_TRACK.length}
              value={personagem.nivel ?? 1}
              onChange={(e) => setPersonagem(ajustarRecursos(personagem, {
                ...personagem,
                nivel: Math.max(1, Math.min(NEX_TRACK.length, Number(e.target.value) || 1)),
              }))}
            />
          </>
        )}
        <label htmlFor="nex-wizard">NEX</label>
        <input
          id="nex-wizard" type="number" min="0" max="99" step="1"
          value={personagem.nex}
          onChange={(e) => mudarNex(e.target.value)}
          title="Escreve a percentagem que quiseres — as contas usam o degrau abaixo"
        />
        <span className="por-cento">%</span>
        {!personagem.regras?.nivelSeparado && degrauNex(personagem.nex) !== Number(personagem.nex) && (
          <span className="degrau">conta como {degrauNex(personagem.nex)}%</span>
        )}
        <span className="dica">
          {personagem.classeId
            ? (max.semSanidade
              ? `${max.pv} PV · ${max.pd} Determinação`
              : `${max.pv} PV · ${max.san} Sanidade · ${max.pe} PE`)
            : 'escolhe a classe para veres Vida, Sanidade e Esforço'}
          {nexUtil >= 10 ? ' · já dá para escolher trilha' : ' · trilha a partir de 10%'}
        </span>
      </div>

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
