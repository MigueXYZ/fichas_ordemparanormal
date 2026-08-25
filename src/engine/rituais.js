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
