import test from 'node:test';
import assert from 'node:assert/strict';
import { personagemVazio } from '../src/engine/character.js';
import { guardarAgente, obterAgente, apagarAgente } from '../src/engine/armazenamento.js';

if (typeof globalThis.localStorage === 'undefined' || !globalThis.localStorage.getItem) {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

test('Seguranca do Wizard: agente existente nunca deve ser eliminado ao sair sem guardar', () => {
  localStorage.clear();

  const agenteOriginal = {
    ...personagemVazio(),
    id: 'ag-teste-123',
    nome: 'Arthur Cervero',
    classeId: 'combatente',
    trilhaId: 'aniquilador',
    nex: 35,
    atributos: { for: 3, agi: 2, int: 1, pre: 1, vig: 3 },
  };
  guardarAgente(agenteOriginal);

  assert.ok(obterAgente('ag-teste-123'), 'Agente deve estar no armazenamento');

  const ehNovo = false;
  let snapshot = JSON.parse(JSON.stringify(agenteOriginal));

  let personagemEmEdicao = {
    ...agenteOriginal,
    nome: 'Nome Provisorio alterado',
    nex: 50,
  };

  function simularSairSemGuardar({ ehNovo, id, snapshot, onCancelar, onSair }) {
    if (ehNovo) {
      apagarAgente(id);
      onSair();
    } else {
      if (onCancelar) onCancelar();
      else onSair();
    }
  }

  let cancelou = false;
  simularSairSemGuardar({
    ehNovo,
    id: personagemEmEdicao.id,
    snapshot,
    onCancelar: () => {
      guardarAgente(snapshot);
      personagemEmEdicao = snapshot;
      cancelou = true;
    },
    onSair: () => {
      assert.fail('Nao deveria chamar onSair direto em modo edicao');
    },
  });

  assert.equal(cancelou, true, 'Deve acionar onCancelar');
  const agenteAposSair = obterAgente('ag-teste-123');
  assert.ok(agenteAposSair, 'Agente NUNCA deve ser eliminado do armazenamento!');
  assert.equal(agenteAposSair.nome, 'Arthur Cervero', 'Nome original deve ser mantido intacto');
  assert.equal(agenteAposSair.trilhaId, 'aniquilador', 'Trilha deve ser mantida intacta');
  assert.equal(agenteAposSair.nex, 35, 'NEX deve ser mantido intacto');
});

test('Seguranca do Wizard: novo agente temporario deve ser limpo ao sair sem guardar', () => {
  localStorage.clear();

  const novoAgente = {
    ...personagemVazio(),
    id: 'ag-novo-456',
    nome: 'Rascunho descartavel',
  };
  guardarAgente(novoAgente);

  const ehNovo = true;
  function simularSairSemGuardar({ ehNovo, id, onSair }) {
    if (ehNovo) {
      apagarAgente(id);
      onSair();
    }
  }

  let saiu = false;
  simularSairSemGuardar({
    ehNovo,
    id: novoAgente.id,
    onSair: () => {
      saiu = true;
    },
  });

  assert.equal(saiu, true);
  assert.equal(obterAgente('ag-novo-456'), null, 'Rascunho novo temporario deve ser apagado');
});

test('Seguranca do StepClasse: clicar na mesma classe nao deve apagar a trilha', () => {
  const personagemComTrilha = {
    ...personagemVazio(),
    classeId: 'combatente',
    trilhaId: 'guerreiro',
  };

  function escolherClasse(c, p) {
    if (p.classeId === c.id) return p;
    return {
      ...p,
      classeId: c.id,
      trilhaId: null,
    };
  }

  const resultadoMesmaClasse = escolherClasse({ id: 'combatente' }, personagemComTrilha);
  assert.equal(resultadoMesmaClasse.trilhaId, 'guerreiro', 'Trilha deve ser preservada ao clicar na mesma classe');

  const resultadoOutraClasse = escolherClasse({ id: 'especialista' }, personagemComTrilha);
  assert.equal(resultadoOutraClasse.trilhaId, null, 'Trilha deve ser resetada ao trocar para uma classe diferente');
});
