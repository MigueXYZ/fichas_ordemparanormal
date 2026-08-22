export const TIPOS_DANO = [
  { id: 'balistico', nome: 'Balístico', categoria: 'Físico', cor: '#94a3b8' },
  { id: 'corte', nome: 'Corte', categoria: 'Físico', cor: '#cbd5e1' },
  { id: 'impacto', nome: 'Impacto', categoria: 'Físico', cor: '#e2e8f0' },
  { id: 'perfuracao', nome: 'Perfuração', categoria: 'Físico', cor: '#a1a1aa' },
  { id: 'sangue', nome: 'Sangue', categoria: 'Elemental', cor: '#f04653' },
  { id: 'morte', nome: 'Morte', categoria: 'Elemental', cor: '#82738c' },
  { id: 'energia', nome: 'Energia', categoria: 'Elemental', cor: '#a855f7' },
  { id: 'conhecimento', nome: 'Conhecimento', categoria: 'Elemental', cor: '#f5a636' },
  { id: 'medo', nome: 'Medo', categoria: 'Elemental', cor: '#ffffff', ignoraRd: true },
  { id: 'mental', nome: 'Mental (Sanidade)', categoria: 'Mental', cor: '#38bdf8' },
  { id: 'fogo', nome: 'Fogo', categoria: 'Elemental', cor: '#f97316' },
  { id: 'frio', nome: 'Frio', categoria: 'Elemental', cor: '#67e8f9' },
  { id: 'eletricidade', nome: 'Eletricidade', categoria: 'Elemental', cor: '#facc15' },
  { id: 'quimico', nome: 'Químico / Ácido', categoria: 'Elemental', cor: '#84cc16' },
  { id: 'geral', nome: 'Dano Geral / Direto', categoria: 'Geral', cor: '#e2e8f0' },
];

export const TIPOS_DANO_POR_ID = Object.fromEntries(TIPOS_DANO.map((t) => [t.id, t]));

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Interpreta texto ou array de resistências da ficha de Ordem Paranormal.
 * Exemplos:
 *   "Balístico, corte, impacto e perfuração 5, Morte 10, Sangue 5"
 *   "Físico 5, Energia 10, Mental 5"
 *   "RD 5, Conhecimento 10"
 */
export function interpretarResistencias(resistencias) {
  const mapa = {};
  if (!resistencias) return mapa;

  let textos = [];
  if (Array.isArray(resistencias)) {
    textos = resistencias.map((r) => String(r));
  } else if (typeof resistencias === 'string') {
    textos = [resistencias];
  }

  const partes = [];
  for (const t of textos) {
    // Divide por ponto e vírgula, quebras de linha ou vírgulas seguidas de número
    const clausulas = t.split(/(?<=\d)[,;·\n]+|;\s*|\n+/);
    for (const c of clausulas) {
      if (c.trim()) partes.push(c.trim());
    }
  }

  for (const p of partes) {
    const limpo = normalizar(p).trim();
    if (!limpo) continue;

    // Extrai o número da resistência
    const numMatch = limpo.match(/\b(\d+)\b/);
    if (!numMatch) continue;
    const valor = Number(numMatch[1]);
    if (isNaN(valor) || valor <= 0) continue;

    const tem = (palavra) => limpo.includes(palavra);

    if (tem('balistico') || tem('balistica')) mapa.balistico = Math.max(mapa.balistico || 0, valor);
    if (tem('corte')) mapa.corte = Math.max(mapa.corte || 0, valor);
    if (tem('impacto')) mapa.impacto = Math.max(mapa.impacto || 0, valor);
    if (tem('perfuracao') || tem('perfurante')) mapa.perfuracao = Math.max(mapa.perfuracao || 0, valor);

    if (tem('fisico') || tem('fisica') || tem('mundano')) {
      mapa.balistico = Math.max(mapa.balistico || 0, valor);
      mapa.corte = Math.max(mapa.corte || 0, valor);
      mapa.impacto = Math.max(mapa.impacto || 0, valor);
      mapa.perfuracao = Math.max(mapa.perfuracao || 0, valor);
    }

    if (tem('sangue')) mapa.sangue = Math.max(mapa.sangue || 0, valor);
    if (tem('morte')) mapa.morte = Math.max(mapa.morte || 0, valor);
    if (tem('energia')) mapa.energia = Math.max(mapa.energia || 0, valor);
    if (tem('conhecimento')) mapa.conhecimento = Math.max(mapa.conhecimento || 0, valor);
    if (tem('medo')) mapa.medo = Math.max(mapa.medo || 0, valor);
    if (tem('mental') || tem('sanidade')) mapa.mental = Math.max(mapa.mental || 0, valor);
    if (tem('fogo')) mapa.fogo = Math.max(mapa.fogo || 0, valor);
    if (tem('frio') || tem('gelo')) mapa.frio = Math.max(mapa.frio || 0, valor);
    if (tem('eletricidade') || tem('eletrico') || tem('raio')) mapa.eletricidade = Math.max(mapa.eletricidade || 0, valor);
    if (tem('quimico') || tem('acido') || tem('veneno')) mapa.quimico = Math.max(mapa.quimico || 0, valor);

    if (tem('dano') || tem('rd ') || limpo.startsWith('rd') || tem('geral')) {
      mapa.geral = Math.max(mapa.geral || 0, valor);
    }
  }

  return mapa;
}

/**
 * Calcula o dano sofrido por parcela com resistências, bloqueio e absorção de PV Temp.
 */
export function calcularDanoRecebido({
  parcelas = [],
  personagem = {},
  max = {},
  bloqueioAtivo = false,
  rdBloqueio = 0,
  rdExtra = 0,
  rdCustom = {},
}) {
  const resistFicha = interpretarResistencias(personagem.resistencias);
  const resistCombinadas = { ...resistFicha, ...rdCustom };
  const rdGeralTotal = (Number(resistCombinadas.geral || 0)) + Number(rdExtra || 0);

  let rdBloqueioDisponivel = bloqueioAtivo ? Math.max(0, Number(rdBloqueio || 0)) : 0;
  let totalBruto = 0;
  let totalReducao = 0;
  let totalLiquidoPv = 0;
  let totalLiquidoSan = 0;

  const detalhesParcelas = parcelas.map((p, idx) => {
    const valorBruto = Math.max(0, Number(p.valor) || 0);
    const tipo = TIPOS_DANO_POR_ID[p.tipoId] || TIPOS_DANO_POR_ID.geral;
    totalBruto += valorBruto;

    if (valorBruto === 0) {
      return {
        idx,
        tipo,
        valorBruto: 0,
        rdEspecifica: 0,
        rdGeral: 0,
        rdBloqueioAplicada: 0,
        reducaoTotal: 0,
        danoLiquido: 0,
      };
    }

    // Dano de medo ignora todas as resistências
    if (tipo.ignoraRd) {
      totalLiquidoPv += valorBruto;
      return {
        idx,
        tipo,
        valorBruto,
        rdEspecifica: 0,
        rdGeral: 0,
        rdBloqueioAplicada: 0,
        reducaoTotal: 0,
        danoLiquido: valorBruto,
      };
    }

    let rdEsp = Number(resistCombinadas[tipo.id] || 0);
    let valorRestante = valorBruto;

    // 1. Aplica RD Específica do Tipo
    const reducaoEsp = Math.min(valorRestante, rdEsp);
    valorRestante -= reducaoEsp;

    // 2. Aplica RD Geral / Extra
    const reducaoGeral = Math.min(valorRestante, rdGeralTotal);
    valorRestante -= reducaoGeral;

    // 3. Aplica Bloqueio (para danos físicos ou gerais de ataques)
    let reducaoBloq = 0;
    if (rdBloqueioDisponivel > 0 && tipo.categoria !== 'Mental') {
      reducaoBloq = Math.min(valorRestante, rdBloqueioDisponivel);
      valorRestante -= reducaoBloq;
      rdBloqueioDisponivel -= reducaoBloq; // o bloqueio absorve até o seu valor total
    }

    const reducaoTotal = reducaoEsp + reducaoGeral + reducaoBloq;
    const danoLiquido = Math.max(0, valorRestante);

    totalReducao += reducaoTotal;

    if (tipo.id === 'mental') {
      totalLiquidoSan += danoLiquido;
    } else {
      totalLiquidoPv += danoLiquido;
    }

    return {
      idx,
      tipo,
      valorBruto,
      rdEspecifica: rdEsp,
      rdGeral: rdGeralTotal,
      rdBloqueioAplicada: reducaoBloq,
      reducaoTotal,
      danoLiquido,
    };
  });

  // Absorção de PV
  const pvMax = max.pv || 40;
  const pvAtual = personagem.pvAtual ?? pvMax;
  const pvTempAtual = Math.max(0, Number(personagem.pvTemp || 0));

  const pvTempAbsorvido = Math.min(pvTempAtual, totalLiquidoPv);
  const novoPvTemp = pvTempAtual - pvTempAbsorvido;
  const danoExcedentePv = totalLiquidoPv - pvTempAbsorvido;
  const novoPvAtual = Math.max(0, pvAtual - danoExcedentePv);

  // Absorção de Sanidade / Determinação
  const semSanidade = Boolean(max.semSanidade);
  const sanMax = semSanidade ? (max.pd || 30) : (max.san || 30);
  const sanAtual = semSanidade ? (personagem.pdAtual ?? sanMax) : (personagem.sanAtual ?? sanMax);
  const novoSanAtual = Math.max(0, sanAtual - totalLiquidoSan);

  return {
    detalhesParcelas,
    totalBruto,
    totalReducao,
    totalLiquidoPv,
    totalLiquidoSan,
    pvAtual,
    pvTempAtual,
    pvTempAbsorvido,
    novoPvAtual,
    novoPvTemp,
    sanAtual,
    novoSanAtual,
    semSanidade,
  };
}
