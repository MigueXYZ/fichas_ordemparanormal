/**
 * "Ficha livre" — o formato comum de NPCs e Ameaças que não funcionam como
 * personagens: os valores (PV, Defesa, perícias como "2d20+5", ataques com
 * teste/dano/crítico) escrevem-se à mão, sem classe, origem nem cálculos do
 * livro. É o mesmo esquema das ameaças do Bestiário (FichaAmeaca / Campo de
 * Batalha já o sabem ler), mais o bloco de roleplay e PE/SAN/Bloqueio/Esquiva.
 *
 * Um NPC livre é `tipo: 'npc'` com `fichaLivre: true`; os NPCs antigos da aba
 * "Gerar" (ficha 4, modelo de personagem) não têm a marca e continuam iguais.
 *
 * A ficha editável fora da app (Ficha_NPC_Ordem_Editavel.html) exporta
 * exatamente isto, com `formato: FORMATO_FICHA_LIVRE` — é o que o botão
 * "Importar ficha" do Modo Mestre lê.
 */
export const FORMATO_FICHA_LIVRE = 'ordo-ficha-livre';
export const VERSAO_FICHA_LIVRE = 1;

export const CAMPOS_ROLEPLAY = [
  ['aparencia', 'Descrição Física & Aparência'],
  ['traco', 'Traço Marcante'],
  ['personalidade', 'Personalidade & Tom de Voz'],
  ['maneirismos', 'Maneirismos & Hábitos'],
  ['motivacao', 'Motivação Principal'],
  ['informacao', 'Informações Úteis & Pistas'],
  ['notasMestre', 'Dicas de Mesa (Mestre)'],
];

export function fichaLivreVazia(tipo = 'npc') {
  const ameaca = tipo === 'ameaca';
  return {
    tipo: ameaca ? 'ameaca' : 'npc',
    fichaLivre: true,
    nome: ameaca ? 'Nova Ameaça' : 'Novo NPC',
    breveDescricao: '',
    historia: '',
    vd: ameaca ? 20 : '',
    nex: '',
    descritores: [],
    tamanho: 'Médio',
    categoria: '',
    imagem: null,
    atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 },
    pv: 20,
    pvMachucado: 10,
    pe: '',
    san: '',
    defesa: ameaca ? 15 : 10,
    bloqueio: '',
    esquiva: '',
    deslocamento: '9m',
    sentidos: { percepcao: '1d20+0', iniciativa: '1d20+0' },
    testes: { fortitude: '1d20+0', reflexos: '1d20+0', vontade: '1d20+0' },
    imunidades: [],
    resistencias: [],
    vulnerabilidades: [],
    pericias: [],
    acoes: [],
    habilidades: [],
    poderes: [],
    presencaPerturbadora: null,
    enigmaDoMedo: null,
    roleplay: Object.fromEntries(CAMPOS_ROLEPLAY.map(([k]) => [k, ''])),
    tags: [],
    notas: '',
  };
}

/** Ameaças são sempre livres; NPCs só os que têm a marca. */
export function ehFichaLivre(f) {
  return Boolean(f) && (f.tipo === 'ameaca' || f.fichaLivre === true);
}

/** Roleplay de uma ficha livre — inclui os campos soltos das ameaças geradas
 * (aparencia / comportamento / dicaRp), para essas também aparecerem. */
export function roleplayDe(f) {
  const rp = f?.roleplay || {};
  return {
    ...Object.fromEntries(CAMPOS_ROLEPLAY.map(([k]) => [k, rp[k] || ''])),
    aparencia: rp.aparencia || f?.aparencia || '',
    personalidade: rp.personalidade || f?.comportamento || '',
    notasMestre: rp.notasMestre || f?.dicaRp || '',
  };
}

const numeroOu = (v, padrao) => {
  if (v === '' || v === null || v === undefined) return padrao;
  const n = Number(v);
  return Number.isFinite(n) ? n : v; // "—" ou "20 (grupo)" ficam como texto
};
const lista = (v) => (Array.isArray(v) ? v : []);
const texto = (v) => (v === null || v === undefined ? '' : String(v));

/**
 * Transforma o que vem de um ficheiro numa ficha pronta a guardar no Ordo.
 * Aceita o formato da ficha editável e também uma ameaça/NPC livre do
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

  return {
    ...base,
    ...resto,
    tipo,
    fichaLivre: true,
    nome: texto(dados.nome).trim() || base.nome,
    vd: numeroOu(dados.vd, base.vd),
    pv: numeroOu(dados.pv, base.pv),
    pvMachucado: numeroOu(dados.pvMachucado, Math.floor((Number(dados.pv) || base.pv) / 2)),
    defesa: numeroOu(dados.defesa, base.defesa),
    pe: numeroOu(dados.pe, ''),
    san: numeroOu(dados.san, ''),
    bloqueio: numeroOu(dados.bloqueio, ''),
    esquiva: numeroOu(dados.esquiva, ''),
    atributos: { ...base.atributos, ...(dados.atributos || {}) },
    sentidos: { ...base.sentidos, ...(dados.sentidos || {}) },
    testes: { ...base.testes, ...(dados.testes || {}) },
    descritores: lista(dados.descritores),
    imunidades: lista(dados.imunidades),
    resistencias: lista(dados.resistencias),
    vulnerabilidades: lista(dados.vulnerabilidades),
    pericias: lista(dados.pericias).map((p) => ({ nome: texto(p.nome), dados: Number(p.dados) || 1, bonus: Number(p.bonus) || 0 })),
    acoes: lista(dados.acoes).map((a) => ({
      tipo: a.tipo || 'Padrão', nome: texto(a.nome), detalhe: texto(a.detalhe),
      teste: texto(a.teste), dano: texto(a.dano), critico: texto(a.critico), descricao: texto(a.descricao),
    })),
    habilidades: lista(dados.habilidades).map((h) => ({ nome: texto(h.nome), custo: texto(h.custo), descricao: texto(h.descricao) })),
    poderes: lista(dados.poderes).map((h) => ({ nome: texto(h.nome), custo: texto(h.custo), descricao: texto(h.descricao) })),
    roleplay: { ...base.roleplay, ...(dados.roleplay || {}) },
    tags: lista(dados.tags),
    imagem: dados.imagem || null,
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
  const { id, atualizadoEm, versao, pvAtual, peAtual, sanAtual, pvTemp, ...resto } = f;
  return { formato: FORMATO_FICHA_LIVRE, versao: VERSAO_FICHA_LIVRE, ...resto };
}

/** Valores de combate de uma ficha livre (PV/PE/SAN/Defesa/AGI). */
export function vitaisLivre(f) {
  const pvMax = Number(f.pv) || 20;
  const pe = Number(f.pe);
  const san = Number(f.san);
  return {
    pv: { atual: Number(f.pvAtual ?? pvMax), max: pvMax, temp: 0 },
    pe: Number.isFinite(pe) && f.pe !== '' ? { atual: Number(f.peAtual ?? pe), max: pe, temp: 0 } : null,
    san: Number.isFinite(san) && f.san !== '' ? { atual: Number(f.sanAtual ?? san), max: san, temp: 0 } : null,
    defesa: Number(f.defesa) || 10,
    agi: Number(f.atributos?.agi ?? 1) || 0,
  };
}
