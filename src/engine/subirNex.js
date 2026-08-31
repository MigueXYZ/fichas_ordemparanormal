/**
 * O que a personagem ganha ao subir de NEX (ou de nível, com a regra
 * "nível separado" ligada).
 *
 * Junta num só sítio as três vias de progressão que estão espalhadas pelos
 * dados: a tabela da classe (`tabelaNex`), os poderes da trilha escolhida e,
 * quando a trilha é a do Monstruoso, os efeitos e notas do patamar. Também
 * calcula quanto sobem os máximos de PV/PE/SAN, porque isso não está escrito
 * em lado nenhum — é conta.
 *
 * Não altera nada na ficha: só descreve. Quem mostra é
 * `components/ficha/ModalSubidaNex.jsx`.
 */
import { NEX_TRACK, calcMaximos } from './calc.js';
import { CLASSES_POR_ID, TRILHAS_POR_ID } from '../data/classes.js';
import {
  PATAMARES_MONSTRUOSO,
  TEXTOS_POR_PATAMAR,
  EFEITOS_POR_PATAMAR,
  TRILHA_ID_POR_CLASSE,
} from '../data/monstruoso.js';

/** Degraus do NEX_TRACK que ficam para trás ao passar de `antes` para `depois`. */
export function degrausEntre(antes, depois) {
  const a = Number(antes);
  const b = Number(depois);
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return [];
  return NEX_TRACK.filter((v) => v > a && v <= b);
}

/** Cópia da personagem posicionada num degrau, respeitando a regra de nível separado. */
function noDegrau(personagem, degrau) {
  if (personagem?.regras?.nivelSeparado) {
    const i = NEX_TRACK.indexOf(degrau);
    return { ...personagem, nivel: i >= 0 ? i + 1 : personagem.nivel };
  }
  return { ...personagem, nex: degrau };
}

/** A classe a que pertence a trilha do Monstruoso escolhida, ou null. */
function classeMonstruosa(personagem) {
  const trilha = personagem?.trilhaId;
  if (!trilha) return null;
  for (const [classe, id] of Object.entries(TRILHA_ID_POR_CLASSE)) {
    if (id === trilha) return classe;
  }
  return null;
}

/** Descrição curta de uma entrada de EFEITOS_POR_PATAMAR. */
function descreverEfeitoMonstruoso(g) {
  if (g.tipo === 'atributo') {
    const sinal = g.delta > 0 ? '+' : '';
    return `${sinal}${g.delta} ${String(g.atributo || '').toUpperCase()}`;
  }
  if (g.tipo === 'ataque-natural') return `Ataque natural: ${g.nome} (${g.dano}, ${g.critico}, ${g.tipoDano})`;
  if (g.tipo === 'ritual') return `Ritual: ${g.nome}`;
  if (g.tipo === 'ritual-escolha') return `Ritual à escolha (${g.circulo}º círculo de ${g.elemento})`;
  if (g.tipo === 'pericias-livres') return `Perícias treinadas à escolha${g.quantas ? ` (${g.quantas})` : ''}`;
  if (g.tipo === 'poder') return `Poder: ${g.nome}`;
  if (g.tipo === 'pericia') return `Perícia: ${g.pericia}`;
  if (g.nome) return g.nome;
  return g.tipo;
}

/** Tudo o que UM degrau concede a esta personagem. */
export function ganhosDoDegrau(personagem, degrau) {
  const classe = CLASSES_POR_ID[personagem?.classeId] || null;
  const trilha = TRILHAS_POR_ID[personagem?.trilhaId] || null;

  const daClasse = (classe?.tabelaNex || [])
    .filter((l) => Number(l.nex) === Number(degrau))
    .flatMap((l) => l.habilidades || []);

  const daTrilha = (trilha?.poderes || [])
    .filter((p) => Number(p.nex) === Number(degrau))
    .map((p) => ({ nome: p.nome, descricao: p.descricao }));

  const monstruoso = [];
  const cm = classeMonstruosa(personagem);
  const elemento = personagem?.monstruosoElemento || null;
  if (cm && elemento && PATAMARES_MONSTRUOSO.includes(Number(degrau))) {
    for (const g of EFEITOS_POR_PATAMAR[cm]?.[elemento] || []) {
      if (Number(g.patamar) === Number(degrau)) monstruoso.push(descreverEfeitoMonstruoso(g));
    }
    for (const t of TEXTOS_POR_PATAMAR[cm]?.[elemento] || []) {
      if (Number(t.patamar) === Number(degrau)) monstruoso.push(t.texto);
    }
  }

  return {
    nex: Number(degrau),
    classeNome: classe?.nome || null,
    trilhaNome: trilha?.nome || null,
    elemento,
    daClasse,
    daTrilha,
    monstruoso,
    // um degrau sem nada é possível (trilha por escolher, classe sem linha)
    vazio: daClasse.length === 0 && daTrilha.length === 0 && monstruoso.length === 0,
  };
}

/**
 * Resumo completo da subida. Devolve `null` quando não houve subida nenhuma
 * (desceu, ficou igual, ou mexeu no NEX dentro do mesmo degrau).
 */
export function resumoSubida(personagem, antes, depois) {
  const degraus = degrausEntre(antes, depois);
  if (!degraus.length) return null;

  const a = calcMaximos(noDegrau(personagem, antes));
  const b = calcMaximos(noDegrau(personagem, depois));
  const recursos = [];
  if (b.pv - a.pv !== 0) recursos.push({ nome: 'PV máximo', delta: b.pv - a.pv, de: a.pv, para: b.pv });
  if (b.semSanidade) {
    if (b.pd - a.pd !== 0) recursos.push({ nome: 'PD máximo', delta: b.pd - a.pd, de: a.pd, para: b.pd });
  } else {
    if (b.pe - a.pe !== 0) recursos.push({ nome: 'PE máximo', delta: b.pe - a.pe, de: a.pe, para: b.pe });
    if (b.san - a.san !== 0) recursos.push({ nome: 'Sanidade máxima', delta: b.san - a.san, de: a.san, para: b.san });
  }

  const pePorRodadaAntes = Math.max(1, Math.floor(Number(antes) / 5));
  const pePorRodadaDepois = Math.max(1, Math.floor(Number(depois) / 5));
  if (pePorRodadaDepois !== pePorRodadaAntes) {
    recursos.push({
      nome: b.semSanidade ? 'PD por rodada' : 'PE por rodada',
      delta: pePorRodadaDepois - pePorRodadaAntes,
      de: pePorRodadaAntes,
      para: pePorRodadaDepois,
    });
  }

  return {
    de: Number(antes),
    para: Number(depois),
    porNivel: Boolean(personagem?.regras?.nivelSeparado),
    degraus: degraus.map((d) => ganhosDoDegrau(personagem, d)),
    recursos,
  };
}
