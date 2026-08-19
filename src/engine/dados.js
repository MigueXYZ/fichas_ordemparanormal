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

// ---------------------------------------------------------------- ataques

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Teste de ataque. O crítico acontece quando o dado escolhido é igual ou maior
 * que a margem de ameaça da arma (por omissão 20).
 */
export function rolarAtaque({ nome, dados, bonus = 0, margem = 20 }) {
  const r = rolarTeste({ nome, dados, bonus });
  const m = Number(margem) || 20;
  return { ...r, tipo: 'ataque', margem: m, critico: r.escolhido >= m, falhaCritica: r.escolhido === 1 };
}

/**
 * Rolagem de dano. Num acerto crítico só os dados da arma são multiplicados —
 * bónus numéricos e dados extras não (Livro Base, cap. 4).
 */
export function rolarDano({ nome, dano, bonus = 0, extras = [], critico = false, multiplicador = 2 }) {
  const m = String(dano || '').replace(/\s/g, '').toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!m) return null;
  const vezes = critico ? Math.max(1, Number(multiplicador) || 2) : 1;
  const qtd = Math.min((Number(m[1] || 1)) * vezes, 60);
  const faces = Number(m[2]);
  const fixo = Number(m[3] || 0) + (Number(bonus) || 0);

  const rolagens = Array.from({ length: qtd }, () => 1 + Math.floor(Math.random() * faces));
  let total = rolagens.reduce((a, b) => a + b, 0) + fixo;

  const detalhesExtra = [];
  for (const e of extras) {
    const me = String(e).replace(/\s/g, '').toLowerCase().match(/^(\d*)d(\d+)$/);
    if (!me) continue;
    const rs = Array.from({ length: Math.min(Number(me[1] || 1), 30) }, () => 1 + Math.floor(Math.random() * Number(me[2])));
    total += rs.reduce((a, b) => a + b, 0);
    detalhesExtra.push({ expr: e, rolagens: rs });
  }

  return {
    id: id(),
    tipo: 'dano',
    nome,
    critico,
    multiplicador: vezes,
    expressao: `${qtd}d${faces}`,
    rolagens,
    extras: detalhesExtra,
    bonus: fixo,
    total,
    falhaCritica: false,
  };
}
