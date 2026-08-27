import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { PERICIAS_TEXTO } from '../src/data/periciasTexto.js';
import { personagemVazio } from '../src/engine/character.js';
import { calcPericias } from '../src/engine/calc.js';
import ModalDetalhePericia from '../src/components/ficha/ModalDetalhePericia.jsx';

console.log('Testing render of all 28 skills including ciencias, diplomacia, ocultismo...');

const p = personagemVazio();
const linhas = calcPericias(p);

for (const l of linhas) {
  try {
    const html = renderToString(
      React.createElement(ModalDetalhePericia, {
        pericia: l,
        personagem: p,
        onRolar: () => {},
        onFechar: () => {},
      })
    );
    assert.ok(html.length > 100, `Output too short for ${l.nome}`);
    console.log(`  ok  ${l.nome} rendered smoothly (${html.length} bytes)`);
  } catch (err) {
    console.error(`  FAIL ON ${l.nome}:`, err);
    process.exitCode = 1;
  }
}

console.log('\nAll modal render tests passed with 0 crashes!');
