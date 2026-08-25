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

/**
 * Ids de TIPOS_DANO marcados como "Resistência" na ficha SEM número (entrada
 * = id puro, ex.: "sangue"): dano desse tipo fica a metade, arredondado para
 * baixo, ANTES de qualquer RD por número/Bloqueio. Ver `repartirResistenciasFicha`
 * abaixo, que separa isto das entradas COM número da mesma lista.
 */
export function tiposComResistencia(resistencias) {
  const lista = Array.isArray(resistencias) ? resistencias : [];
  return new Set(lista.filter((id) => TIPOS_DANO_POR_ID[id]));
}

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Interpreta texto ou array com o número fixo de RD por tipo — entradas
 * "Nome N" (a parte COM número das Resistências da ficha; ver
 * `repartirResistenciasFicha` abaixo). Exemplos:
 *   "Balístico, corte, impacto e perfuração 5, Morte 10, Sangue 5"
 *   "Físico 5, Energia 10, Mental 5"
 *   "RD 5, Conhecimento 10"
 */
export function interpretarResistencias(reducaoDano) {
  const mapa = {};
  if (!reducaoDano) return mapa;

  let textos = [];
  if (Array.isArray(reducaoDano)) {
    textos = reducaoDano.map((r) => String(r));
  } else if (typeof reducaoDano === 'string') {
    textos = [reducaoDano];
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
 * Separa a lista única de Resistências da ficha (`personagem.resistencias`)
 * nas duas partes que o motor de dano já sabe tratar: cada entrada é OU um id
 * puro de TIPOS_DANO (ex.: "sangue") — marcada sem número, dano desse tipo
 * fica a metade — OU "Nome N" (ex.: "Sangue 5") — marcada com número, desconta
 * N ao dano em vez de cortar a metade. Nunca as duas coisas ao mesmo tempo no
 * mesmo tipo (a ficha só deixa uma opção por checkbox) — por pedido explícito
 * do utilizador, que fundiu as antigas abas "Resistências" e "Redução de
 * Dano" numa só.
 */
export function repartirResistenciasFicha(resistencias) {
  const lista = Array.isArray(resistencias) ? resistencias : (resistencias ? [String(resistencias)] : []);
  const semNumero = [];
  const comNumero = [];
  for (const entrada of lista) {
    const texto = String(entrada).trim();
    if (!texto) continue;
    if (/\d\s*$/.test(texto)) comNumero.push(texto);
    else semNumero.push(texto);
  }
  return { meias: tiposComResistencia(semNumero), flat: interpretarResistencias(comNumero) };
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
  rdTrilha = {},
}) {
  const { meias: tiposResistentes, flat: resistFicha } = repartirResistenciasFicha(personagem.resistencias);
  // Redução de Dano concedida automaticamente pela trilha (ex.: Combatente
  // Monstruoso) soma-se ao que a personagem marcou à mão na ficha, tipo a
  // tipo — ver `reducaoDanoTrilhaAtiva` em engine/monstruoso.js. `rdCustom`
  // (ajuste temporário do Recetor de Dano, só para este ataque) continua a
  // substituir tudo quando o jogador mexe explicitamente nesse campo.
  const resistBase = {};
  for (const id of new Set([...Object.keys(resistFicha), ...Object.keys(rdTrilha)])) {
    resistBase[id] = Number(resistFicha[id] || 0) + Number(rdTrilha[id] || 0);
  }
  const resistCombinadas = { ...resistBase, ...rdCustom };
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
        resistente: false,
        rdEspecifica: 0,
        rdGeral: 0,
        rdBloqueioAplicada: 0,
        reducaoTotal: 0,
        danoLiquido: 0,
      };
    }

    // Dano de medo ignora tudo: Resistência (metade) e Redução de Dano/Bloqueio
    if (tipo.ignoraRd) {
      totalLiquidoPv += valorBruto;
      return {
        idx,
        tipo,
        valorBruto,
        resistente: false,
        rdEspecifica: 0,
        rdGeral: 0,
        rdBloqueioAplicada: 0,
        reducaoTotal: 0,
        danoLiquido: valorBruto,
      };
    }

    // 0. Resistência ao tipo: o dano fica a metade (arredondado para baixo)
    // ANTES de qualquer Redução de Dano/Bloqueio — ex.: Resistência a Sangue
    // + 7 de dano de Sangue = 3 antes de entrar a Redução de Dano.
    const resistente = tiposResistentes.has(tipo.id);
    const reducaoMetade = resistente ? valorBruto - Math.floor(valorBruto / 2) : 0;

    let rdEsp = Number(resistCombinadas[tipo.id] || 0);
    let valorRestante = valorBruto - reducaoMetade;

    // 1. Aplica Redução de Dano Específica do Tipo
    const reducaoEsp = Math.min(valorRestante, rdEsp);
    valorRestante -= reducaoEsp;

    // 2. Aplica Redução de Dano Geral / Extra
    const reducaoGeral = Math.min(valorRestante, rdGeralTotal);
    valorRestante -= reducaoGeral;

    // 3. Aplica Bloqueio (para danos físicos ou gerais de ataques)
    let reducaoBloq = 0;
    if (rdBloqueioDisponivel > 0 && tipo.categoria !== 'Mental') {
      reducaoBloq = Math.min(valorRestante, rdBloqueioDisponivel);
      valorRestante -= reducaoBloq;
      rdBloqueioDisponivel -= reducaoBloq; // o bloqueio absorve até o seu valor total
    }

    const reducaoTotal = reducaoMetade + reducaoEsp + reducaoGeral + reducaoBloq;
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
      resistente,
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
