import React from 'react';
import RodaAtributos from '../RodaAtributos.jsx';
import { REGRAS_ATRIBUTOS } from '../../data/atributos.js';
import { pontosRestantes } from '../../engine/calc.js';
import { rolarTeste } from '../../engine/dados.js';

export default function StepAtributos({ personagem, atualizar, onRolar }) {
  const atributos = personagem.atributos;
  const restantes = pontosRestantes(atributos, REGRAS_ATRIBUTOS.pontosParaDistribuir);

  function setAtributo(id, valor) {
    if (valor < REGRAS_ATRIBUTOS.minimo || valor > REGRAS_ATRIBUTOS.maximoInicial) return;
    atualizar({ atributos: { ...atributos, [id]: valor } });
  }

  const podeSubir = (id) => atributos[id] < REGRAS_ATRIBUTOS.maximoInicial && restantes > 0;
  const podeDescer = (id) => atributos[id] > REGRAS_ATRIBUTOS.minimo;

  return (
    <div className="atributos-layout">
      <div>
        <p className="texto-regra">
          Quando crias um personagem, todos os atributos começam em <span className="destaque">1</span> e
          recebes <span className="destaque">4 pontos</span> para distribuir entre eles como quiseres.
          Também podes reduzir um atributo para <span className="destaque">0</span> para receber 1 ponto
          adicional. O valor máximo inicial que podes ter em cada atributo é <span className="destaque">3</span>.
        </p>
        <div className={'pontos-restantes' + (restantes === 0 ? ' completo' : '')}>
          <strong>{restantes}</strong>
          <span>{restantes === 1 ? 'ponto por distribuir' : 'pontos por distribuir'}</span>
        </div>
        {restantes > 0 && (
          <div className="aviso">Ainda tens pontos por gastar — podes avançar na mesma e voltar depois.</div>
        )}
      </div>
      <RodaAtributos
        atributos={atributos}
        onChange={setAtributo}
        onRolar={(a, valor) => onRolar && onRolar(rolarTeste({ nome: a.nome, dados: valor, bonus: 0 }))}
        podeSubir={podeSubir}
        podeDescer={podeDescer}
      />
    </div>
  );
}
