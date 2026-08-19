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
