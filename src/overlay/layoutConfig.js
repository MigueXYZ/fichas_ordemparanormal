export const CHAVE_LAYOUT = 'op-ficha:overlay-layout:v1';

export const LAYOUT_PADRAO = {
  versao: 1,
  widgets: {
    avatar: { id: 'avatar', nome: 'Retrato do Agente', x: 20, y: 20, escala: 1, visivel: true },
    identidade: { id: 'identidade', nome: 'Nome do Agente', x: 180, y: 20, escala: 1, visivel: true },
    pv: { id: 'pv', nome: 'Pontos de Vida (PV)', x: 180, y: 55, escala: 1, visivel: true, estilo: 'numerico' },
    san: { id: 'san', nome: 'Sanidade / Determinação', x: 180, y: 115, escala: 1, visivel: true, estilo: 'numerico' },
    pe: { id: 'pe', nome: 'Pontos de Esforço (PE)', x: 300, y: 115, escala: 1, visivel: true, estilo: 'numerico' },
    dado: { id: 'dado', nome: 'D20 de Rolagem Ativa', x: 440, y: 35, escala: 1, visivel: true },
    rolagens: { id: 'rolagens', nome: 'Histórico de Rolagens', x: 20, y: 520, escala: 1, visivel: true },
  },
};

export const PRESETS_LAYOUT = [
  {
    id: 'padrao',
    nome: 'Padrão Ordem',
    descricao: 'Layout clássico temático no canto superior esquerdo.',
    layout: LAYOUT_PADRAO,
  },
  {
    id: 'webcam',
    nome: 'Compacto para Webcam',
    descricao: 'Barras de progresso empilhadas para posicionar junto à câmera.',
    layout: {
      versao: 1,
      widgets: {
        avatar: { id: 'avatar', nome: 'Retrato do Agente', x: 20, y: 20, escala: 0.85, visivel: true },
        identidade: { id: 'identidade', nome: 'Nome do Agente', x: 160, y: 20, escala: 0.85, visivel: true },
        pv: { id: 'pv', nome: 'Pontos de Vida (PV)', x: 160, y: 55, escala: 0.85, visivel: true, estilo: 'barra' },
        san: { id: 'san', nome: 'Sanidade / Determinação', x: 160, y: 95, escala: 0.85, estilo: 'barra' },
        pe: { id: 'pe', nome: 'Pontos de Esforço (PE)', x: 160, y: 135, escala: 0.85, estilo: 'barra' },
        dado: { id: 'dado', nome: 'D20 de Rolagem Ativa', x: 400, y: 30, escala: 0.85, visivel: true },
        rolagens: { id: 'rolagens', nome: 'Histórico de Rolagens', x: 20, y: 530, escala: 0.85, visivel: true },
      },
    },
  },
  {
    id: 'hud_inferior',
    nome: 'Barra Inferior HUD',
    descricao: 'Elementos distribuídos na base da tela estilo RPG de ação.',
    layout: {
      versao: 1,
      widgets: {
        avatar: { id: 'avatar', nome: 'Retrato do Agente', x: 25, y: 570, escala: 0.85, visivel: true },
        identidade: { id: 'identidade', nome: 'Nome do Agente', x: 165, y: 570, escala: 0.85, visivel: true },
        pv: { id: 'pv', nome: 'Pontos de Vida (PV)', x: 165, y: 610, escala: 0.85, visivel: true, estilo: 'barra' },
        san: { id: 'san', nome: 'Sanidade / Determinação', x: 415, y: 610, escala: 0.85, visivel: true, estilo: 'barra' },
        pe: { id: 'pe', nome: 'Pontos de Esforço (PE)', x: 655, y: 610, escala: 0.85, visivel: true, estilo: 'barra' },
        dado: { id: 'dado', nome: 'D20 de Rolagem Ativa', x: 900, y: 580, escala: 0.85, visivel: true },
        rolagens: { id: 'rolagens', nome: 'Histórico de Rolagens', x: 920, y: 460, escala: 0.85, visivel: true },
      },
    },
  },
];

export const PALETA_CORES = [
  { id: 'sangue', nome: 'Sangue', hex: '#f04653' },
  { id: 'morte', nome: 'Morte', hex: '#63586b' },
  { id: 'energia', nome: 'Energia', hex: '#9933ff' },
  { id: 'conhecimento', nome: 'Conhecimento', hex: '#f5a636' },
  { id: 'medo', nome: 'Medo', hex: '#e2e8f0' },
  { id: 'esmeralda', nome: 'Esmeralda', hex: '#4ade80' },
  { id: 'ciano', nome: 'Ciano', hex: '#38bdf8' },
  { id: 'dourado', nome: 'Dourado', hex: '#fbbf24' },
];

export const WIDGETS_DISPONIVEIS = [
  { id: 'avatar', nome: 'Retrato do Agente', x: 20, y: 20, escala: 1, visivel: true },
  { id: 'identidade', nome: 'Nome do Agente', x: 180, y: 20, escala: 1, visivel: true },
  { id: 'pv', nome: 'Pontos de Vida (PV)', x: 180, y: 55, escala: 1, visivel: true, estilo: 'numerico' },
  { id: 'san', nome: 'Sanidade / Determinação', x: 180, y: 115, escala: 1, visivel: true, estilo: 'numerico' },
  { id: 'pe', nome: 'Pontos de Esforço (PE)', x: 300, y: 115, escala: 1, visivel: true, estilo: 'numerico' },
  { id: 'dado', nome: 'D20 de Rolagem Ativa', x: 440, y: 35, escala: 1, visivel: true },
  { id: 'rolagens', nome: 'Histórico de Rolagens', x: 20, y: 520, escala: 1, visivel: true },
];

export function lerLayout() {
  try {
    const cru = localStorage.getItem(CHAVE_LAYOUT);
    if (!cru) return JSON.parse(JSON.stringify(LAYOUT_PADRAO));
    const dados = JSON.parse(cru);
    return {
      versao: 1,
      widgets: {
        ...LAYOUT_PADRAO.widgets,
        ...(dados?.widgets || {}),
      },
    };
  } catch {
    return JSON.parse(JSON.stringify(LAYOUT_PADRAO));
  }
}

export function guardarLayout(layout) {
  try {
    const limpo = {
      versao: 1,
      widgets: layout?.widgets || LAYOUT_PADRAO.widgets,
    };
    localStorage.setItem(CHAVE_LAYOUT, JSON.stringify(limpo));
    return limpo;
  } catch {
    return layout;
  }
}

export function resetarLayout() {
  const padrao = JSON.parse(JSON.stringify(LAYOUT_PADRAO));
  guardarLayout(padrao);
  return padrao;
}

export function exportarLayoutJson(layout, nome = 'overlay-preset') {
  const limpo = {
    versao: 1,
    tipo: 'ordem-overlay-preset',
    widgets: layout?.widgets || LAYOUT_PADRAO.widgets,
  };
  const blob = new Blob([JSON.stringify(limpo, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${nome.toLowerCase().replace(/[^\w-]+/g, '_') || 'overlay-preset'}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function importarLayoutJson(ficheiro) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const dados = JSON.parse(leitor.result);
        if (!dados || typeof dados !== 'object' || !dados.widgets) {
          throw new Error('Ficheiro de preset inválido.');
        }
        resolve({
          versao: 1,
          widgets: dados.widgets,
        });
      } catch (e) {
        reject(e);
      }
    };
    leitor.onerror = () => reject(new Error('Não foi possível ler o ficheiro.'));
    leitor.readAsText(ficheiro);
  });
}
