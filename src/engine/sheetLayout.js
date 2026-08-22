export const CHAVE_LAYOUT_FICHA = 'op-ficha:sheet-layout:v1';

export const WIDGETS_EMBUTIDOS = [
  { id: 'atributos', nome: 'Atributos & Regras', fixo: false },
  { id: 'recursos', nome: 'NEX & Recursos Vitais (PV, SAN, PE)', fixo: false },
  { id: 'defesas', nome: 'Defesas & Cálculos', fixo: false },
  { id: 'condicoes', nome: 'Condições & Resistências', fixo: false },
  { id: 'pericias', nome: 'Tabela de Perícias & Rolador', fixo: false },
  { id: 'abas', nome: 'Painel com Abas (Combate, Habilidades, Rituais, etc.)', fixo: false },
  { id: 'combate_direto', nome: 'Secção de Combate & Armas (Direto)', fixo: false },
  { id: 'habilidades_direto', nome: 'Secção de Habilidades & Poderes (Direto)', fixo: false },
  { id: 'rituais_direto', nome: 'Secção de Rituais (Direto)', fixo: false },
  { id: 'inventario_direto', nome: 'Secção de Inventário & Carga (Direto)', fixo: false },
  { id: 'descricao_direto', nome: 'Secção de Descrição & Tags (Direto)', fixo: false },
];

export const LAYOUT_FICHA_PADRAO = {
  versao: 1,
  numColunas: 3,
  colunas: [
    ['atributos', 'recursos', 'defesas', 'condicoes'],
    ['pericias'],
    ['abas'],
  ],
  widgets: {
    atributos: { id: 'atributos', visivel: true },
    recursos: { id: 'recursos', visivel: true },
    defesas: { id: 'defesas', visivel: true },
    condicoes: { id: 'condicoes', visivel: true },
    pericias: { id: 'pericias', visivel: true },
    abas: { id: 'abas', visivel: true },
    combate_direto: { id: 'combate_direto', visivel: false },
    habilidades_direto: { id: 'habilidades_direto', visivel: false },
    rituais_direto: { id: 'rituais_direto', visivel: false },
    inventario_direto: { id: 'inventario_direto', visivel: false },
    descricao_direto: { id: 'descricao_direto', visivel: false },
  },
  customWidgets: {},
};

export const PRESETS_FICHA = [
  {
    id: 'padrao',
    nome: 'Padrão Ordem (3 Colunas)',
    descricao: 'Layout clássico oficial: Atributos/Recursos à esquerda, Perícias ao meio e Abas à direita.',
    layout: LAYOUT_FICHA_PADRAO,
  },
  {
    id: 'combate',
    nome: 'Foco em Combate (2 Colunas)',
    descricao: 'Recursos, Defesas e Combate lado a lado para agilidade máxima em batalha.',
    layout: {
      versao: 1,
      numColunas: 2,
      colunas: [
        ['recursos', 'defesas', 'combate_direto', 'condicoes'],
        ['atributos', 'pericias', 'rituais_direto', 'habilidades_direto'],
      ],
      widgets: {
        atributos: { id: 'atributos', visivel: true },
        recursos: { id: 'recursos', visivel: true },
        defesas: { id: 'defesas', visivel: true },
        condicoes: { id: 'condicoes', visivel: true },
        pericias: { id: 'pericias', visivel: true },
        abas: { id: 'abas', visivel: false },
        combate_direto: { id: 'combate_direto', visivel: true },
        habilidades_direto: { id: 'habilidades_direto', visivel: true },
        rituais_direto: { id: 'rituais_direto', visivel: true },
        inventario_direto: { id: 'inventario_direto', visivel: false },
        descricao_direto: { id: 'descricao_direto', visivel: false },
      },
      customWidgets: {},
    },
  },
  {
    id: 'investigativo',
    nome: 'Investigação & Roleplay (2 Colunas)',
    descricao: 'Perícias e anotações em destaque com recursos essenciais.',
    layout: {
      versao: 1,
      numColunas: 2,
      colunas: [
        ['pericias', 'descricao_direto', 'inventario_direto'],
        ['atributos', 'recursos', 'defesas', 'habilidades_direto'],
      ],
      widgets: {
        atributos: { id: 'atributos', visivel: true },
        recursos: { id: 'recursos', visivel: true },
        defesas: { id: 'defesas', visivel: true },
        condicoes: { id: 'condicoes', visivel: true },
        pericias: { id: 'pericias', visivel: true },
        abas: { id: 'abas', visivel: false },
        combate_direto: { id: 'combate_direto', visivel: false },
        habilidades_direto: { id: 'habilidades_direto', visivel: true },
        rituais_direto: { id: 'rituais_direto', visivel: false },
        inventario_direto: { id: 'inventario_direto', visivel: true },
        descricao_direto: { id: 'descricao_direto', visivel: true },
      },
      customWidgets: {},
    },
  },
  {
    id: 'painel_aberto',
    nome: 'Painel Completo Sem Abas (3 Colunas)',
    descricao: 'Todas as secções abertas em simultâneo no ecrã sem necessidade de trocar de abas.',
    layout: {
      versao: 1,
      numColunas: 3,
      colunas: [
        ['atributos', 'recursos', 'defesas', 'condicoes'],
        ['pericias', 'combate_direto', 'rituais_direto'],
        ['habilidades_direto', 'inventario_direto', 'descricao_direto'],
      ],
      widgets: {
        atributos: { id: 'atributos', visivel: true },
        recursos: { id: 'recursos', visivel: true },
        defesas: { id: 'defesas', visivel: true },
        condicoes: { id: 'condicoes', visivel: true },
        pericias: { id: 'pericias', visivel: true },
        abas: { id: 'abas', visivel: false },
        combate_direto: { id: 'combate_direto', visivel: true },
        habilidades_direto: { id: 'habilidades_direto', visivel: true },
        rituais_direto: { id: 'rituais_direto', visivel: true },
        inventario_direto: { id: 'inventario_direto', visivel: true },
        descricao_direto: { id: 'descricao_direto', visivel: true },
      },
      customWidgets: {},
    },
  },
];

export function lerLayoutFicha() {
  try {
    const cru = localStorage.getItem(CHAVE_LAYOUT_FICHA);
    if (!cru) return JSON.parse(JSON.stringify(LAYOUT_FICHA_PADRAO));
    const dados = JSON.parse(cru);
    const numColunas = Math.max(1, Math.min(3, Number(dados?.numColunas) || 3));
    let colunas = Array.isArray(dados?.colunas) ? dados.colunas : LAYOUT_FICHA_PADRAO.colunas;

    // Ajusta o array de colunas conforme o número de colunas configurado
    while (colunas.length < numColunas) colunas.push([]);
    if (colunas.length > numColunas) {
      const extra = colunas.slice(numColunas).flat();
      colunas = colunas.slice(0, numColunas);
      colunas[colunas.length - 1] = [...colunas[colunas.length - 1], ...extra];
    }

    return {
      versao: 1,
      numColunas,
      colunas,
      widgets: {
        ...LAYOUT_FICHA_PADRAO.widgets,
        ...(dados?.widgets || {}),
      },
      customWidgets: dados?.customWidgets || {},
    };
  } catch {
    return JSON.parse(JSON.stringify(LAYOUT_FICHA_PADRAO));
  }
}

export function guardarLayoutFicha(layout) {
  try {
    const limpo = {
      versao: 1,
      numColunas: Math.max(1, Math.min(3, Number(layout?.numColunas) || 3)),
      colunas: layout?.colunas || LAYOUT_FICHA_PADRAO.colunas,
      widgets: layout?.widgets || LAYOUT_FICHA_PADRAO.widgets,
      customWidgets: layout?.customWidgets || {},
    };
    localStorage.setItem(CHAVE_LAYOUT_FICHA, JSON.stringify(limpo));
    return limpo;
  } catch {
    return layout;
  }
}

export function resetarLayoutFicha() {
  const padrao = JSON.parse(JSON.stringify(LAYOUT_FICHA_PADRAO));
  guardarLayoutFicha(padrao);
  return padrao;
}

export function novoIdWidgetCustom() {
  return 'cw-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
}

export function moverWidget(layout, id, direcao) {
  const colunas = layout.colunas.map((col) => [...col]);
  let colIdx = -1;
  let itemIdx = -1;

  for (let c = 0; c < colunas.length; c++) {
    const idx = colunas[c].indexOf(id);
    if (idx !== -1) {
      colIdx = c;
      itemIdx = idx;
      break;
    }
  }

  if (colIdx === -1) return layout;

  if (direcao === 'cima' && itemIdx > 0) {
    const temp = colunas[colIdx][itemIdx - 1];
    colunas[colIdx][itemIdx - 1] = id;
    colunas[colIdx][itemIdx] = temp;
  } else if (direcao === 'baixo' && itemIdx < colunas[colIdx].length - 1) {
    const temp = colunas[colIdx][itemIdx + 1];
    colunas[colIdx][itemIdx + 1] = id;
    colunas[colIdx][itemIdx] = temp;
  } else if (direcao === 'esquerda' && colIdx > 0) {
    colunas[colIdx].splice(itemIdx, 1);
    colunas[colIdx - 1].push(id);
  } else if (direcao === 'direita' && colIdx < colunas.length - 1) {
    colunas[colIdx].splice(itemIdx, 1);
    colunas[colIdx + 1].push(id);
  }

  return { ...layout, colunas };
}

export function soltarWidgetSobre(layout, srcId, targetId, posicao = 'antes') {
  if (!srcId || !targetId || srcId === targetId) return layout;

  let targetColIdx = -1;
  for (let c = 0; c < layout.colunas.length; c++) {
    if (layout.colunas[c].includes(targetId)) {
      targetColIdx = c;
      break;
    }
  }
  if (targetColIdx === -1) return layout;

  // Remove srcId de todas as colunas
  const colunas = layout.colunas.map((col) => col.filter((id) => id !== srcId));
  
  // Acha o novo índice do targetId na coluna de destino
  const targetIdx = colunas[targetColIdx].indexOf(targetId);
  if (targetIdx === -1) {
    colunas[targetColIdx].push(srcId);
  } else {
    const insertIdx = posicao === 'depois' ? targetIdx + 1 : targetIdx;
    colunas[targetColIdx].splice(insertIdx, 0, srcId);
  }

  return { ...layout, colunas };
}

export function soltarWidgetNaColuna(layout, srcId, colIdx) {
  if (!srcId) return layout;
  const colunas = layout.colunas.map((col) => col.filter((id) => id !== srcId));
  const destCol = Math.min(layout.numColunas - 1, Math.max(0, colIdx));
  while (colunas.length <= destCol) colunas.push([]);
  colunas[destCol].push(srcId);
  return { ...layout, colunas };
}

export function reordenarWidgetDrag(layout, widgetId, destinoColIdx, destinoItemIdx) {
  if (!widgetId) return layout;
  const colunas = layout.colunas.map((col) => col.filter((id) => id !== widgetId));
  const destCol = Math.min(layout.numColunas - 1, Math.max(0, destinoColIdx));
  
  while (colunas.length <= destCol) {
    colunas.push([]);
  }

  if (
    destinoItemIdx === undefined ||
    destinoItemIdx === null ||
    destinoItemIdx < 0 ||
    destinoItemIdx >= colunas[destCol].length
  ) {
    colunas[destCol].push(widgetId);
  } else {
    colunas[destCol].splice(destinoItemIdx, 0, widgetId);
  }

  return { ...layout, colunas };
}

export function ocultarWidget(layout, id) {
  const colunas = layout.colunas.map((col) => col.filter((wId) => wId !== id));
  const isCustom = id.startsWith('cw-');
  
  if (isCustom) {
    return {
      ...layout,
      colunas,
      customWidgets: {
        ...layout.customWidgets,
        [id]: { ...(layout.customWidgets[id] || {}), visivel: false },
      },
    };
  }

  return {
    ...layout,
    colunas,
    widgets: {
      ...layout.widgets,
      [id]: { ...(layout.widgets[id] || { id }), visivel: false },
    },
  };
}

export function mostrarWidget(layout, id, colDestino = 0) {
  const colunas = layout.colunas.map((col) => [...col]);
  const dest = Math.min(colunas.length - 1, Math.max(0, colDestino));
  
  // Se já estiver na coluna, não duplica
  if (!colunas[dest].includes(id)) {
    colunas[dest].push(id);
  }

  const isCustom = id.startsWith('cw-');
  if (isCustom) {
    return {
      ...layout,
      colunas,
      customWidgets: {
        ...layout.customWidgets,
        [id]: { ...(layout.customWidgets[id] || {}), visivel: true },
      },
    };
  }

  return {
    ...layout,
    colunas,
    widgets: {
      ...layout.widgets,
      [id]: { ...(layout.widgets[id] || { id }), visivel: true },
    },
  };
}

export function alterarNumColunas(layout, novoNum) {
  const n = Math.max(1, Math.min(3, Number(novoNum) || 3));
  if (n === layout.numColunas) return layout;

  let colunas = layout.colunas.map((col) => [...col]);
  while (colunas.length < n) colunas.push([]);
  if (colunas.length > n) {
    const extra = colunas.slice(n).flat();
    colunas = colunas.slice(0, n);
    colunas[colunas.length - 1] = [...colunas[colunas.length - 1], ...extra];
  }

  return { ...layout, numColunas: n, colunas };
}

export function adicionarWidgetCustomizado(layout, novoWidget) {
  const colunas = layout.colunas.map((col) => [...col]);
  colunas[0].unshift(novoWidget.id);

  return {
    ...layout,
    colunas,
    customWidgets: {
      ...layout.customWidgets,
      [novoWidget.id]: novoWidget,
    },
  };
}

export function atualizarWidgetCustomizado(layout, widgetAtualizado) {
  return {
    ...layout,
    customWidgets: {
      ...layout.customWidgets,
      [widgetAtualizado.id]: widgetAtualizado,
    },
  };
}

export function removerWidgetCustomizado(layout, id) {
  const colunas = layout.colunas.map((col) => col.filter((wId) => wId !== id));
  const custom = { ...layout.customWidgets };
  delete custom[id];

  return {
    ...layout,
    colunas,
    customWidgets: custom,
  };
}
