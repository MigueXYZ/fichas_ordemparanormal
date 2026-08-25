// Busca Rápida Global (Ctrl+K) — índice de pesquisa sobre o conteúdo já
// existente na app (rituais, poderes, perícias, itens, condições). Não
// inventa nada: só agrega e indexa os módulos de dados já usados noutros
// sítios da ficha, para se poder consultar qualquer um deles sem navegar
// pelas abas.
import { RITUAIS, ELEMENTOS } from '../data/rituais.js';
import { PODERES, TIPOS_PODER } from '../data/poderes.js';
import { PERICIAS } from '../data/pericias.js';
import { PERICIAS_TEXTO } from '../data/periciasTexto.js';
import { ITENS, TIPOS_ITEM } from '../data/itens.js';
import { CONDICOES, CATEGORIAS_CONDICAO } from '../data/condicoes.js';
import { ATRIBUTOS } from '../data/atributos.js';
import { categoriaRomana } from '../data/patentes.js';

function normalizar(texto) {
  return String(texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const NOME_ELEMENTO = Object.fromEntries(ELEMENTOS.map((e) => [e.id, e.nome]));
const NOME_TIPO_PODER = Object.fromEntries(TIPOS_PODER.map((t) => [t.id, t.nome]));
const NOME_TIPO_ITEM = Object.fromEntries(TIPOS_ITEM.map((t) => [t.id, t.nome]));
const NOME_CATEGORIA_CONDICAO = Object.fromEntries(CATEGORIAS_CONDICAO.map((c) => [c.id, c.nome]));
const ATRIBUTO_POR_ID = Object.fromEntries(ATRIBUTOS.map((a) => [a.id, a]));

export const CATEGORIAS_BUSCA = [
  { id: 'ritual', nome: 'Rituais' },
  { id: 'poder', nome: 'Poderes' },
  { id: 'pericia', nome: 'Perícias' },
  { id: 'item', nome: 'Itens' },
  { id: 'condicao', nome: 'Condições' },
];

function nomesElementos(r) {
  const lista = r.elementos && r.elementos.length ? r.elementos : [r.elemento];
  return lista.filter(Boolean).map((e) => NOME_ELEMENTO[e] || e).join('/');
}

function construirIndice() {
  const linhas = [];

  for (const r of RITUAIS) {
    linhas.push({
      categoria: 'ritual',
      chave: `ritual:${r.id}`,
      nome: r.nome,
      sub: `${r.circulo}º círculo · ${nomesElementos(r)}`,
      meta: [r.execucao, r.alcance, r.alvo, r.area, r.duracao, r.resistencia].filter(Boolean).join(' · '),
      descricao: r.descricao,
      extra: r.verdadeiro?.texto ? `Verdadeiro (${r.verdadeiro.custo}): ${r.verdadeiro.texto}` : '',
      pagina: r.livro || '',
      textoBusca: normalizar(`${r.nome} ${r.descricao} ${nomesElementos(r)} ${r.discente || ''}`),
    });
  }

  for (const p of PODERES) {
    linhas.push({
      categoria: 'poder',
      chave: `poder:${p.id}`,
      nome: p.nome,
      sub: [NOME_TIPO_PODER[p.tipo] || p.tipo, p.classe, p.elemento ? NOME_ELEMENTO[p.elemento] : null].filter(Boolean).join(' · '),
      meta: p.prerequisito ? `Pré-requisito: ${p.prerequisito}` : '',
      descricao: p.descricao,
      extra: p.nexMinimo ? `NEX mínimo: ${p.nexMinimo}%` : '',
      pagina: p.livro || '',
      textoBusca: normalizar(`${p.nome} ${p.descricao} ${p.prerequisito || ''}`),
    });
  }

  for (const per of PERICIAS) {
    const texto = PERICIAS_TEXTO[per.id];
    const attr = ATRIBUTO_POR_ID[per.attr];
    linhas.push({
      categoria: 'pericia',
      chave: `pericia:${per.id}`,
      nome: per.nome,
      sub: [attr?.sigla || per.attr, per.treinada ? 'só treinada' : null, per.carga ? 'penalidade de carga' : null].filter(Boolean).join(' · '),
      meta: '',
      descricao: texto?.texto || texto?.resumo || '',
      extra: '',
      pagina: texto?.livro || '',
      textoBusca: normalizar(`${per.nome} ${texto?.resumo || ''} ${texto?.texto || ''}`),
    });
  }

  for (const it of ITENS) {
    linhas.push({
      categoria: 'item',
      chave: `item:${it.chave || it.id}`,
      nome: it.nome,
      sub: [NOME_TIPO_ITEM[it.tipo] || it.tipo, it.subtipo].filter(Boolean).join(' · '),
      meta: [
        it.dano, it.critico, it.tipoDano, it.alcance, it.grupo,
        it.defesa != null ? `Defesa +${it.defesa}` : null,
        it.rd,
        it.espacos != null ? `${it.espacos} espaço${it.espacos === 1 ? '' : 's'}` : null,
        categoriaRomana(it.categoria) ? `Categoria ${categoriaRomana(it.categoria)}` : null,
      ].filter(Boolean).join(' · '),
      descricao: it.descricao || '',
      extra: it.penalidade || '',
      pagina: it.livro || '',
      textoBusca: normalizar(`${it.nome} ${it.descricao || ''} ${it.grupo || ''}`),
    });
  }

  for (const c of CONDICOES) {
    linhas.push({
      categoria: 'condicao',
      chave: `condicao:${c.id}`,
      nome: c.nome,
      sub: NOME_CATEGORIA_CONDICAO[c.tipo] || c.tipo,
      meta: '',
      descricao: c.descricao,
      extra: '',
      pagina: '',
      textoBusca: normalizar(`${c.nome} ${c.descricao}`),
    });
  }

  return linhas;
}

export const INDICE_BUSCA = construirIndice();

/** Pesquisa por nome/descrição, opcionalmente filtrada por categoria. */
export function pesquisar(termo, { categoria = null, limite = 80 } = {}) {
  const t = normalizar(termo).trim();
  if (!t) return [];
  const termos = t.split(/\s+/).filter(Boolean);
  const resultados = INDICE_BUSCA.filter((l) => {
    if (categoria && l.categoria !== categoria) return false;
    return termos.every((tm) => l.textoBusca.includes(tm));
  });
  resultados.sort((a, b) => {
    const an = normalizar(a.nome).includes(t) ? 0 : 1;
    const bn = normalizar(b.nome).includes(t) ? 0 : 1;
    if (an !== bn) return an - bn;
    return a.nome.localeCompare(b.nome, 'pt');
  });
  return resultados.slice(0, limite);
}
