/**
 * "Ficha livre" — o formato comum de NPCs e Ameaças que não funcionam como
 * personagens de jogador: os valores escrevem-se à mão, sem cálculos do livro.
 *
 * Há dois modelos, um por `tipo`:
 * - 'ameaca' — o bloco oficial de ameaça (Ficha de Ameaça / cap. 7 do Livro
 *   Base): Presença Perturbadora, Sentidos, Defesa + testes de resistência,
 *   PV/Machucado, resistências/vulnerabilidades/imunidades, habilidades,
 *   ações, rituais e Enigma do Medo. É o esquema do Bestiário, que o Campo de
 *   Batalha já sabe ler.
 * - 'npc' (com `fichaLivre: true`) — pessoas: agentes, ocultistas, cultistas,
 *   civis. Classe/origem/NEX, PV/PE/SAN, Defesa/Bloqueio/Esquiva, perícias
 *   (Iniciativa, Percepção e os testes de resistência são perícias), ataques,
 *   habilidades, rituais, equipamento e guia de interpretação. Sem sentidos,
 *   presença nem enigma.
 * Os NPCs antigos da aba "Gerar" (ficha 4, modelo de personagem) não têm a
 * marca `fichaLivre` e continuam iguais.
 *
 * As fichas editáveis fora da app (Ficha_NPC_Ordem_Editavel.html e
 * Ficha_Ameaca_Ordem_Editavel.html) exportam exatamente isto, com
 * `formato: FORMATO_FICHA_LIVRE` — é o que o botão "Importar ficha" lê.
 * Se mudares um campo aqui, muda-o também nessas duas fichas.
 */
export const FORMATO_FICHA_LIVRE = 'ordo-ficha-livre';
export const VERSAO_FICHA_LIVRE = 2;

export const ROLEPLAY_NPC = [
  ['aparencia', 'Descrição Física & Aparência'],
  ['traco', 'Traço Marcante'],
  ['personalidade', 'Personalidade & Tom de Voz'],
  ['maneirismos', 'Maneirismos & Hábitos'],
  ['motivacao', 'Motivação Principal'],
  ['informacao', 'Informações Úteis & Pistas'],
  ['notasMestre', 'Dicas de Mesa (Mestre)'],
];
export const NARRACAO_AMEACA = [
  ['aparencia', 'Aparência'],
  ['comportamento', 'Comportamento & Táticas'],
  ['notasMestre', 'Como Narrar (Mestre)'],
];
export const camposRoleplay = (tipo) => (tipo === 'ameaca' ? NARRACAO_AMEACA : ROLEPLAY_NPC);

export const ELEMENTOS = ['Sangue', 'Morte', 'Conhecimento', 'Energia', 'Medo'];
export const TAMANHOS = ['Minúsculo', 'Pequeno', 'Médio', 'Grande', 'Enorme', 'Colossal'];
export const CLASSES_NPC = ['Combatente', 'Especialista', 'Ocultista', 'Sobrevivente', 'Civil'];

/** As perícias que quase todo o NPC tem — no sistema, Iniciativa, Percepção
 * e os testes de resistência são perícias como as outras. A ficha começa
 * sem nenhuma; o botão "+ perícias comuns" junta estas de uma vez. */
export const PERICIAS_BASE_NPC = ['Iniciativa', 'Percepção', 'Fortitude', 'Reflexos', 'Vontade'];

export function fichaLivreVazia(tipo = 'npc') {
  if (tipo === 'ameaca') {
    return {
      tipo: 'ameaca', fichaLivre: true,
      nome: 'Nova Ameaça', historia: '', vd: 20,
      descritores: [], tamanho: 'Médio', categoria: 'Criatura',
      imagem: null,
      presencaPerturbadora: null,
      // vazios de propósito: escreve-se só o que a criatura tiver
      sentidos: { percepcao: '', iniciativa: '', extra: '' },
      defesa: 15,
      testes: { fortitude: '', reflexos: '', vontade: '' },
      pv: 20, pvMachucado: 10,
      resistencias: [], vulnerabilidades: [], imunidades: [],
      atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 },
      pericias: [],
      deslocamento: '9m | 6',
      habilidades: [], acoes: [], rituais: [],
      enigmaDoMedo: null,
      roleplay: Object.fromEntries(NARRACAO_AMEACA.map(([k]) => [k, ''])),
      tags: [], notas: '',
    };
  }
  return {
    tipo: 'npc', fichaLivre: true,
    nome: 'Novo NPC', breveDescricao: '', historia: '',
    classe: '', origem: '', trilha: '', afiliacao: '', nex: '', vd: '',
    imagem: null,
    atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 },
    pv: 20, pe: '', san: '', defesa: 10, bloqueio: '', esquiva: '', deslocamento: '9m',
    pericias: [], // "+ perícias comuns" acrescenta PERICIAS_BASE_NPC num clique
    resistencias: [],
    acoes: [], habilidades: [], rituais: [], equipamento: [],
    roleplay: Object.fromEntries(ROLEPLAY_NPC.map(([k]) => [k, ''])),
    tags: [], notas: '',
  };
}

/** Ameaças são sempre livres; NPCs só os que têm a marca. */
export function ehFichaLivre(f) {
  return Boolean(f) && (f.tipo === 'ameaca' || f.fichaLivre === true);
}

/** Guia de roleplay/narração de uma ficha — inclui os campos soltos das
 * ameaças geradas e do compêndio (aparencia / comportamento / dicaRp). */
export function roleplayDe(f) {
  const rp = f?.roleplay || {};
  const campos = camposRoleplay(f?.tipo);
  const base = Object.fromEntries(campos.map(([k]) => [k, rp[k] || '']));
  base.aparencia = rp.aparencia || f?.aparencia || '';
  base.notasMestre = rp.notasMestre || f?.dicaRp || '';
  if (f?.tipo === 'ameaca') base.comportamento = rp.comportamento || rp.personalidade || f?.comportamento || '';
  return base;
}

const numeroOu = (v, padrao) => {
  if (v === '' || v === null || v === undefined) return padrao;
  const n = Number(v);
  return Number.isFinite(n) ? n : v; // "—" ou "20 (grupo)" ficam como texto
};
const lista = (v) => (Array.isArray(v) ? v : []);
const texto = (v) => (v === null || v === undefined ? '' : String(v));

/** "3d20+10 (às cegas)" → { dados: 3, bonus: 10 }; null se não for uma pool de d20. */
function pool(txt) {
  const m = String(txt || '').replace(/\s/g, '').match(/^(-?\d+)d20([+-]\d+)?/i);
  return m ? { dados: Number(m[1]), bonus: Number(m[2] || 0) } : null;
}

const acaoLimpa = (a) => ({
  tipo: a.tipo || 'Padrão', nome: texto(a.nome), detalhe: texto(a.detalhe),
  teste: texto(a.teste), dano: texto(a.dano), critico: texto(a.critico), descricao: texto(a.descricao),
});
const habLimpa = (h) => ({ nome: texto(h.nome), custo: texto(h.custo), descricao: texto(h.descricao) });
const ritualLimpo = (r) => ({
  nome: texto(r.nome), circulo: texto(r.circulo), elemento: texto(r.elemento), dt: texto(r.dt),
  custo: texto(r.custo), execucao: texto(r.execucao), alcance: texto(r.alcance), descricao: texto(r.descricao),
});

/**
 * Transforma o que vem de um ficheiro numa ficha pronta a guardar no Ordo.
 * Aceita o formato das fichas editáveis e também uma ameaça/NPC livre do
 * próprio Ordo (exportada daqui). Devolve null se não for nada disso.
 */
export function paraFichaOrdo(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) return null;
  const doFormato = dados.formato === FORMATO_FICHA_LIVRE;
  const doOrdo = dados.tipo === 'ameaca' || (dados.tipo === 'npc' && dados.fichaLivre === true);
  if (!doFormato && !doOrdo) return null;

  const tipo = dados.tipo === 'ameaca' ? 'ameaca' : 'npc';
  const base = fichaLivreVazia(tipo);
  // eslint-disable-next-line no-unused-vars
  const { formato, versao, id, atualizadoEm, ...resto } = dados;

  const comum = {
    ...base,
    ...resto,
    tipo,
    fichaLivre: true,
    nome: texto(dados.nome).trim() || base.nome,
    vd: numeroOu(dados.vd, base.vd),
    pv: numeroOu(dados.pv, base.pv),
    defesa: numeroOu(dados.defesa, base.defesa),
    atributos: { ...base.atributos, ...(dados.atributos || {}) },
    resistencias: lista(dados.resistencias),
    pericias: lista(dados.pericias).map((p) => ({ nome: texto(p.nome), dados: Number(p.dados) || 1, bonus: Number(p.bonus) || 0 })),
    acoes: lista(dados.acoes).map(acaoLimpa),
    habilidades: lista(dados.habilidades).map(habLimpa),
    rituais: lista(dados.rituais).map(ritualLimpo),
    roleplay: { ...base.roleplay, ...(dados.roleplay || {}) },
    tags: lista(dados.tags),
    imagem: dados.imagem || null,
  };

  if (tipo === 'ameaca') {
    // eslint-disable-next-line no-unused-vars
    const { poderes, ...ameaca } = comum;
    return {
      ...ameaca,
      pvMachucado: numeroOu(dados.pvMachucado, Math.floor((Number(dados.pv) || base.pv) / 2)),
      sentidos: { ...base.sentidos, ...(dados.sentidos || {}) },
      testes: { ...base.testes, ...(dados.testes || {}) },
      descritores: lista(dados.descritores),
      vulnerabilidades: lista(dados.vulnerabilidades),
      imunidades: lista(dados.imunidades),
      // "poderes" (versão 1) juntam-se às habilidades
      habilidades: [...comum.habilidades, ...lista(dados.poderes).map(habLimpa)],
    };
  }

  // NPC: da versão 1 (que ainda tinha sentidos/testes) passam para perícias
  const pericias = [...comum.pericias];
  const nomes = new Set(pericias.map((p) => p.nome.toLowerCase()));
  for (const [grupo, chave, nome] of [['sentidos', 'iniciativa', 'Iniciativa'], ['sentidos', 'percepcao', 'Percepção'],
    ['testes', 'fortitude', 'Fortitude'], ['testes', 'reflexos', 'Reflexos'], ['testes', 'vontade', 'Vontade']]) {
    const p = pool(dados[grupo]?.[chave]);
    if (p && !nomes.has(nome.toLowerCase()) && (p.dados !== 1 || p.bonus !== 0)) pericias.push({ nome, ...p });
  }
  // eslint-disable-next-line no-unused-vars
  const { sentidos, testes, presencaPerturbadora, enigmaDoMedo, pvMachucado, descritores, imunidades, vulnerabilidades, poderes, ...npc } = comum;
  return {
    ...npc,
    pericias,
    pe: numeroOu(dados.pe, ''),
    san: numeroOu(dados.san, ''),
    bloqueio: numeroOu(dados.bloqueio, ''),
    esquiva: numeroOu(dados.esquiva, ''),
    nex: numeroOu(dados.nex, ''),
    habilidades: [...comum.habilidades, ...lista(dados.poderes).map(habLimpa)],
    equipamento: lista(dados.equipamento).map(texto),
  };
}

/**
 * Lê o texto de um ficheiro .json e devolve as fichas reconhecidas.
 * Aceita uma ficha, uma lista de fichas ou `{ fichas: [...] }`.
 */
export function lerFichasDeTexto(textoJson) {
  const dados = JSON.parse(textoJson);
  const candidatos = Array.isArray(dados) ? dados : Array.isArray(dados?.fichas) ? dados.fichas : [dados];
  return candidatos.map(paraFichaOrdo).filter(Boolean);
}

/** Uma ficha do Ordo pronta a gravar num .json (para abrir na ficha editável
 * ou importar noutro computador). Tira o que só faz sentido nesta app. */
export function fichaParaExportar(f) {
  // eslint-disable-next-line no-unused-vars
  const { id, atualizadoEm, versao, pvAtual, peAtual, sanAtual, pvTemp, imagemPosX, imagemPosY, imagemZoom, ...resto } = f;
  return { formato: FORMATO_FICHA_LIVRE, versao: VERSAO_FICHA_LIVRE, ...resto };
}

/** Valores de combate de uma ficha livre (PV/PE/SAN/Defesa/AGI). */
export function vitaisLivre(f) {
  const pvMax = Number(f.pv) || 20;
  const pe = Number(f.pe);
  const san = Number(f.san);
  return {
    pv: { atual: Number(f.pvAtual ?? pvMax), max: pvMax, temp: 0 },
    pe: Number.isFinite(pe) && f.pe !== '' && f.pe != null ? { atual: Number(f.peAtual ?? pe), max: pe, temp: 0 } : null,
    san: Number.isFinite(san) && f.san !== '' && f.san != null ? { atual: Number(f.sanAtual ?? san), max: san, temp: 0 } : null,
    defesa: Number(f.defesa) || 10,
    agi: Number(f.atributos?.agi ?? 1) || 0,
  };
}
