import { calcMaximos, nexEfetivo, calcPericias, calcDtRitual } from './calc.js';
import { rolarTeste } from './dados.js';
import {
  temComponentesDoElemento, reducaoTatuagemRitualistica,
  armarServirSangue, armarRevelacaoConhecimento, armarDefesaEnergia,
  classeMonstruosa, patamarAtual, elementoAtual,
} from './monstruoso.js';

/**
 * O preço de conjurar.
 *
 * Conjurar um ritual não custa só pontos: fazes um teste de Ocultismo e, se
 * ele não chegar, o Outro Lado leva a sua parte.
 *
 *   total < 20 + círculo  ->  −1 de Sanidade
 *   total < 10 + círculo  ->  −1 de Sanidade PERMANENTE (baixa também o máximo)
 *
 * Falhar por muito conta as duas coisas: quem fica abaixo de 10 + círculo
 * também está abaixo de 20 + círculo.
 */
export function precoDoRitual(total, circulo) {
  const c = Number(circulo) || 1;
  const t = Number(total) || 0;
  const limiteSan = 20 + c;
  const limitePermanente = 10 + c;
  return {
    limiteSan,
    limitePermanente,
    perdeSan: t < limiteSan,
    perdePermanente: t < limitePermanente,
  };
}

// ---------------------------------------------------------------- duração

/**
 * Um ritual pode ficar ATIVO na ficha (com um interruptor ligar/desligar)?
 *
 * Só os instantâneos não podem: "a manifestação de um ritual instantâneo
 * aparece e se dissipa no momento em que ele é lançado" — não há nada para
 * manter. Tudo o resto (Cena, Sustentada, duração definida, Permanente, ou
 * "veja texto") fica ligado até o jogador o desligar à mão: a app não tem
 * fronteira automática de cena nem relógio de rodadas.
 *
 * "Instantânea ou 1 dia" e afins contam como podendo ficar ativos — há um
 * ramo do ritual que dura.
 */
export function podeFicarAtivo(ritual) {
  const d = String(ritual?.duracao || '').trim().toLowerCase();
  if (!d) return false;
  if (d.startsWith('instant') && !d.includes(' ou ')) return false;
  return true;
}

// ----------------------------------------------------------- concentração

/**
 * Concentração (Livro Base, p. 120).
 *
 * "Conjurar um ritual exige concentração. Se você estiver em uma situação
 * difícil ou sofrer dano durante a execução, precisa passar em um teste de
 * Vontade. Se falhar, o ritual não funciona e os PE são perdidos."
 *
 *   Condição ruim ....... DT 15 + custo em PE do ritual
 *   Condição terrível ... DT 20 + custo em PE do ritual
 *   Ferido na execução .. DT igual ao dano sofrido
 */
export const CONDICOES_CONCENTRACAO = [
  {
    id: 'ruim',
    rotulo: 'Condição ruim',
    base: 15,
    exemplos: 'proteção leve, dentro de um veículo em movimento, caído no chão, ou a conjurar durante uma tempestade.',
  },
  {
    id: 'terrivel',
    rotulo: 'Condição terrível',
    base: 20,
    exemplos: 'proteção pesada, dentro de um veículo em alta velocidade, agarrado por outro ser, ou a conjurar durante um terremoto.',
  },
  {
    id: 'ferido',
    rotulo: 'Ferido durante a execução',
    base: null,
    exemplos: 'a DT é igual ao dano sofrido. Em rituais de ação padrão ou menos, só podes ser ferido durante a execução por um ataque feito como reação ou por dano contínuo (fogo, por exemplo).',
  },
];

export const CONDICOES_CONCENTRACAO_POR_ID = Object.fromEntries(CONDICOES_CONCENTRACAO.map((c) => [c.id, c]));

/**
 * ESTADO POR RITUAL — "marcado na pele" (Tatuagem Ritualística) e "ativo"
 * (ritual de duração não instantânea a decorrer).
 */
export function marcadoDoRitual(personagem, r) {
  if (!r) return false;
  if (r._monstruosoId) return (personagem?.monstruosoRituaisMarcados || []).includes(r._monstruosoId);
  return Boolean(r.marcado);
}

export function ativoDoRitual(personagem, r) {
  if (!r) return false;
  if (r._monstruosoId) return (personagem?.monstruosoRituaisAtivos || []).includes(r._monstruosoId);
  return Boolean(r.ativo);
}

/**
 * Patch que põe `campo` (ativo/marcado) a `valor` num ritual, seja ele
 * próprio (índice `i` em `personagem.rituais`) ou concedido pela trilha.
 */
export function patchEstadoRitual(personagem, r, i, campo, valor) {
  if (r?._monstruosoId) {
    const lista = campo === 'ativo' ? 'monstruosoRituaisAtivos' : 'monstruosoRituaisMarcados';
    const atuais = personagem?.[lista] || [];
    const tem = atuais.includes(r._monstruosoId);
    if (valor === tem) return {};
    return { [lista]: tem ? atuais.filter((x) => x !== r._monstruosoId) : [...atuais, r._monstruosoId] };
  }
  const proprios = [...(personagem?.rituais || [])];
  const idx = i != null && i >= 0 ? i : proprios.findIndex((x) => x === r || (x.id && x.id === r?.id && x.nome === r?.nome));
  if (idx < 0 || !proprios[idx]) return {};
  proprios[idx] = { ...proprios[idx], [campo]: valor };
  return { rituais: proprios };
}

export function custoBaseDeRitual(r) {
  return Number(String(r?.custo || '').replace(/\D/g, '')) || 0;
}

export function custoEfetivoRitual(personagem, nex, r) {
  const marcado = marcadoDoRitual(personagem, r);
  const red = reducaoTatuagemRitualistica(personagem, nex, r, marcado);
  return Math.max(0, custoBaseDeRitual(r) - red);
}

export function precisaComponentesRitual(r, personagem = null, nex = null) {
  if (!r?.elemento || r.elemento === 'medo' || r.elemento === 'variavel') return false;
  // Ocultista 99%+ (Ser Mutilado): rituais do elemento marcados na pele dispensam fala, gestos e componentes
  if (personagem && nex != null) {
    const n = Number(nex) || 0;
    if (classeMonstruosa(personagem) === 'ocultista' && patamarAtual(n) >= 99) {
      const el = elementoAtual(personagem);
      if (el && String(r.elemento).toLowerCase() === el.toLowerCase() && marcadoDoRitual(personagem, r)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Conjura um ritual: valida custos, componentes, executa o teste de Ocultismo
 * e custo de Sanidade/Determinação, atualiza os estados ativos e gatilhos da
 * Trilha do Monstruoso.
 */
export function conjurarRitual(personagem, r, { onRolar, index = null, ehReacao = false } = {}) {
  if (!r) return { erro: 'Nenhum ritual especificado.' };

  const nex = nexEfetivo(personagem);
  const max = calcMaximos(personagem);
  const usaPd = max.semSanidade;
  const atual = usaPd ? (personagem.pdAtual ?? max.pd) : (personagem.peAtual ?? max.pe);
  const custo = custoEfetivoRitual(personagem, nex, r);
  const marcado = marcadoDoRitual(personagem, r);
  const dt = calcDtRitual(personagem, r, marcado);

  if (personagem.formaMonstruosaAtiva) {
    return { erro: 'Não podes conjurar rituais enquanto transformado.' };
  }
  if (custo > atual) {
    return { erro: `PE insuficiente (precisas de ${custo} ${usaPd ? 'PD' : 'PE'}, tens ${atual}).` };
  }
  if (precisaComponentesRitual(r, personagem, nex) && !temComponentesDoElemento(personagem.inventario, r.elemento)) {
    return { erro: `Precisas de Componentes Ritualísticos de ${r.elemento} no inventário.` };
  }

  // Poder de toque da Trilha do Monstruoso (sem teste de Ocultismo)
  if (r._semTeste) {
    const patch = { [usaPd ? 'pdAtual' : 'peAtual']: atual - custo };
    if (ehReacao) patch.monstruosoReacaoTatuagemUsada = true;
    if (onRolar) {
      onRolar({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tipo: 'ritual',
        semTeste: true,
        nome: r.nome || 'Ritual',
        detalhe: ehReacao ? 'Reação · poder de toque — sem teste' : 'poder de toque — sem teste',
        notas: [
          `${custo} ${usaPd ? 'PD' : 'PE'} gastos`,
          ehReacao ? 'Reação (1x por cena) da Trilha do Monstruoso' : null,
          'Poder de toque da Trilha do Monstruoso — sem teste de Ocultismo',
        ].filter(Boolean),
        total: 'concedido',
        critico: false,
        falhaCritica: false,
      });
    }
    return { patch };
  }

  const circulo = Number(r.circulo) || 1;
  const oc = calcPericias(personagem).find((x) => x.id === 'ocultismo') || { dados: 0, bonus: 0 };
  const teste = rolarTeste({
    nome: `${r.nome || 'Ritual'}${ehReacao ? ' (Reação)' : ''} — Ocultismo`,
    dados: oc.dados,
    bonus: oc.bonus,
  });

  const { perdeSan, perdePermanente, limiteSan, limitePermanente } = precoDoRitual(teste.total, circulo);

  const campoAtual = usaPd ? 'pdAtual' : 'sanAtual';
  const maximoMental = usaPd ? max.pd : max.san;
  const mentalAtual = personagem[campoAtual] ?? maximoMental;

  const patch = { [usaPd ? 'pdAtual' : 'peAtual']: atual - custo };
  if (usaPd) {
    let pd = atual - custo;
    if (perdeSan) pd = Math.max(0, pd - 1);
    patch.pdAtual = pd;
    if (perdePermanente) patch.pdExtra = (Number(personagem.pdExtra) || 0) - 1;
  } else {
    if (perdeSan) patch.sanAtual = Math.max(0, mentalAtual - 1);
    if (perdePermanente) {
      patch.sanExtra = (Number(personagem.sanExtra) || 0) - 1;
      patch.sanAtual = Math.max(0, Math.min(patch.sanAtual ?? mentalAtual, maximoMental - 1));
    }
  }

  if (ehReacao) {
    patch.monstruosoReacaoTatuagemUsada = true;
  }

  // Gatilhos da Trilha do Monstruoso 65%+
  Object.assign(patch, armarServirSangue(personagem, nex, r));
  Object.assign(patch, armarRevelacaoConhecimento(personagem, nex, r));
  Object.assign(patch, armarDefesaEnergia(personagem, nex, r, custo));

  // Rituais de duração não instantânea ficam ATIVOS ao serem conjurados
  if (podeFicarAtivo(r)) {
    Object.assign(patch, patchEstadoRitual(personagem, r, index, 'ativo', true));
  }

  // Efeitos específicos (ex: Forma Monstruosa)
  if (r.nome === 'Forma Monstruosa') {
    patch.pvTemp = Number(personagem.pvTemp || 0) + 30;
    patch.formaMonstruosaAtiva = true;
  }

  const nomeMental = usaPd ? 'Determinação' : 'Sanidade';
  const reducao = reducaoTatuagemRitualistica(personagem, nex, r, marcado);
  const notas = [
    reducao > 0
      ? `${custo} ${usaPd ? 'PD' : 'PE'} gastos (${custoBaseDeRitual(r)} − ${reducao} da Tatuagem Ritualística)`
      : `${custo} ${usaPd ? 'PD' : 'PE'} gastos`,
    ehReacao ? 'Reação (1x por cena) da Trilha do Monstruoso' : null,
    dt ? `DT ${dt} para resistir` : null,
    perdePermanente
      ? `falhou por muito (< ${limitePermanente}): −1 de ${nomeMental} e −1 permanente`
      : perdeSan
        ? `abaixo de ${limiteSan}: −1 de ${nomeMental}`
        : `${limiteSan} ou mais: a mente aguentou`,
  ].filter(Boolean);

  if (onRolar) {
    onRolar({
      ...teste,
      tipo: 'ritual',
      nome: r.nome || 'Ritual',
      detalhe: `${circulo}º círculo${ehReacao ? ' · Reação' : ''}`,
      notas,
      sofreu: perdeSan,
    });
  }

  return { patch, teste };
}

/** A DT do teste de Vontade, e a conta em texto para mostrar ao lado do resultado. */
export function dtConcentracao(condicaoId, { custoPe = 0, dano = 0 } = {}) {
  const cond = CONDICOES_CONCENTRACAO_POR_ID[condicaoId];
  if (!cond) return { dt: 0, conta: '' };
  if (cond.base === null) {
    const d = Math.max(0, Math.trunc(Number(dano) || 0));
    return { dt: d, conta: `DT ${d} (dano sofrido)` };
  }
  const custo = Math.max(0, Math.trunc(Number(custoPe) || 0));
  return { dt: cond.base + custo, conta: `DT ${cond.base + custo} (${cond.base} + ${custo} PE do ritual)` };
}
