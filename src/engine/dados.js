function d20() {
  return 1 + Math.floor(Math.random() * 20);
}

/**
 * Teste de perícia em Ordem Paranormal: rolas tantos d20 quantos o valor do
 * atributo e ficas com o melhor. Com atributo 0 rolas 2 e ficas com o pior.
 */
export function rolarPericia(dados, bonus = 0) {
  const n = Math.max(1, Math.abs(Number(dados) || 0) || 2);
  const rolagens = Array.from({ length: Number(dados) > 0 ? n : 2 }, d20);
  const escolhido = Number(dados) > 0 ? Math.max(...rolagens) : Math.min(...rolagens);
  return { rolagens, escolhido, bonus: Number(bonus) || 0, total: escolhido + (Number(bonus) || 0) };
}

/** Parser simples de expressões tipo "2d20+3", "1d12", "d6-1". */
export function rolarExpressao(expr) {
  const limpo = String(expr).replace(/\s/g, '').toLowerCase();
  const m = limpo.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!m) return null;
  const qtd = Math.min(Number(m[1] || 1), 50);
  const faces = Number(m[2]);
  const mod = Number(m[3] || 0);
  const rolagens = Array.from({ length: qtd }, () => 1 + Math.floor(Math.random() * faces));
  const soma = rolagens.reduce((a, b) => a + b, 0);
  return { expr: limpo, rolagens, mod, total: soma + mod };
}
