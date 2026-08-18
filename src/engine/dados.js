function d20() {
  return 1 + Math.floor(Math.random() * 20);
}

/**
 * Teste em Ordem Paranormal: rolas tantos d20 quantos o valor do atributo e
 * ficas com o melhor. Com atributo 0 rolas 2 e ficas com o pior.
 * Crítico = o dado escolhido saiu 20. Falha crítica = saiu 1.
 */
export function rolarTeste({ nome, dados, bonus = 0, detalhe = '' }) {
  const n = Number(dados) || 0;
  const quantidade = n > 0 ? n : 2;
  const rolagens = Array.from({ length: quantidade }, d20);
  const escolhido = n > 0 ? Math.max(...rolagens) : Math.min(...rolagens);
  const b = Number(bonus) || 0;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tipo: 'teste',
    nome,
    detalhe,
    dados: quantidade,
    piorDeDois: n === 0,
    rolagens,
    escolhido,
    bonus: b,
    total: escolhido + b,
    critico: escolhido === 20,
    falhaCritica: escolhido === 1,
  };
}

/** Parser de expressões tipo "2d20+3", "1d12", "d6-1". */
export function rolarExpressao(expr) {
  const limpo = String(expr).replace(/\s/g, '').toLowerCase();
  const m = limpo.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!m) return null;
  const qtd = Math.min(Math.max(Number(m[1] || 1), 1), 50);
  const faces = Number(m[2]);
  const mod = Number(m[3] || 0);
  const rolagens = Array.from({ length: qtd }, () => 1 + Math.floor(Math.random() * faces));
  const soma = rolagens.reduce((a, b) => a + b, 0);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tipo: 'expressao',
    nome: limpo,
    detalhe: '',
    rolagens,
    escolhido: null,
    bonus: mod,
    total: soma + mod,
    critico: faces === 20 && rolagens.includes(20),
    falhaCritica: faces === 20 && rolagens.every((r) => r === 1),
  };
}
