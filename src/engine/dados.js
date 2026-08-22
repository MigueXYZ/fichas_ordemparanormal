function d20() {
  return 1 + Math.floor(Math.random() * 20);
}

/**
 * Teste em Ordem Paranormal: rolas tantos d20 quantos o valor do atributo e
 * ficas com o melhor. Com atributo 0 rolas 2 e ficas com o pior.
 * Crítico = o dado escolhido saiu 20. Falha crítica = saiu 1.
 */
/**
 * `dadosExtra` (opcional): lista de expressões tipo "1d8" — dados fixos que
 * se SOMAM ao total do teste, à parte da pool de d20 (ex.: Especialista
 * Sangue 65%, "+1d8 em testes de ataques corpo a corpo" — não é mais um d20
 * na pool, é um dado fixo somado ao resultado).
 */
export function rolarTeste({ nome, dados, bonus = 0, detalhe = '', dadosExtra = [] }) {
  const n = Number(dados) || 0;
  const quantidade = n > 0 ? n : 2;
  const rolagens = Array.from({ length: quantidade }, d20);
  const escolhido = n > 0 ? Math.max(...rolagens) : Math.min(...rolagens);
  const b = Number(bonus) || 0;

  const extras = [];
  let somaExtra = 0;
  for (const expr of dadosExtra || []) {
    const m = String(expr).replace(/\s/g, '').toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/);
    if (!m) continue;
    const qtd = Math.min(Number(m[1] || 1), 20);
    const faces = Number(m[2]);
    const rs = Array.from({ length: qtd }, () => 1 + Math.floor(Math.random() * faces));
    const soma = rs.reduce((a, x) => a + x, 0) + Number(m[3] || 0);
    extras.push({ expr, rolagens: rs, soma });
    somaExtra += soma;
  }

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
    dadosExtra: extras,
    total: escolhido + b + somaExtra,
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
export function rolarAtaque({ nome, dados, bonus = 0, margem = 20, dadosExtra = [] }) {
  const r = rolarTeste({ nome, dados, bonus, dadosExtra });
  const m = Number(margem) || 20;
  return { ...r, tipo: 'ataque', margem: m, critico: r.escolhido >= m, falhaCritica: r.escolhido === 1 };
}

/**
 * Rolagem de dano. Num acerto crítico só os dados da arma são multiplicados —
 * bónus numéricos e dados extras não (Livro Base, cap. 4).
 */
/**
 * Algumas armas trazem duas hipóteses de dano ("1d4/1d6", por ser usada com uma
 * ou com as duas mãos). Ficamos com a primeira que der para rolar.
 */
function primeiraExpressaoValida(dano) {
  const partes = String(dano || '').split('/');
  for (const parte of partes) {
    const m = parte.replace(/\s/g, '').toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/);
    if (m) return m;
  }
  return null;
}

/**
 * `extras` (opcional): cada entrada é uma expressão tipo "1d8" (dano fixo
 * somado ao dano da arma) OU `{ expr: "1d8", elemental: true }` — marca-se
 * `elemental` quando o dado vem da Trilha do Monstruoso (ex.: o dano extra
 * "de Sangue" da drenagem), para a interface conseguir colorir só essa
 * parte da conta a vermelho e mostrar quanto do total é dano elemental. O
 * TOTAL continua um só número — não se separa em dois danos.
 */
export function rolarDano({ nome, dano, bonus = 0, extras = [], critico = false, multiplicador = 2 }) {
  const m = primeiraExpressaoValida(dano);
  if (!m) return null;
  const vezes = critico ? Math.max(1, Number(multiplicador) || 2) : 1;
  const qtd = Math.min((Number(m[1] || 1)) * vezes, 60);
  const faces = Number(m[2]);
  const fixo = Number(m[3] || 0) + (Number(bonus) || 0);

  const rolagens = Array.from({ length: qtd }, () => 1 + Math.floor(Math.random() * faces));
  let total = rolagens.reduce((a, b) => a + b, 0) + fixo;

  const detalhesExtra = [];
  for (const e of extras) {
    const expr = typeof e === 'string' ? e : e?.expr;
    const elemental = typeof e === 'object' && e !== null ? Boolean(e.elemental) : false;
    const me = String(expr).replace(/\s/g, '').toLowerCase().match(/^(\d*)d(\d+)$/);
    if (!me) continue;
    const rs = Array.from({ length: Math.min(Number(me[1] || 1), 30) }, () => 1 + Math.floor(Math.random() * Number(me[2])));
    const soma = rs.reduce((a, b) => a + b, 0);
    total += soma;
    detalhesExtra.push({ expr, rolagens: rs, soma, elemental });
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

/**
 * Um ataque é uma coisa só: o teste de acerto e, colado a ele, o dano.
 * O resultado leva o dano em `.dano` para o cartão mostrar as duas secções.
 */
export function rolarAtaqueCompleto({ nome, dados, bonusAtaque = 0, margem = 20, dano, bonusDano = 0, extras = [], multiplicador = 2, dadosExtraAtaque = [] }) {
  const acerto = rolarAtaque({ nome, dados, bonus: bonusAtaque, margem, dadosExtra: dadosExtraAtaque });
  const golpe = rolarDano({
    nome: `${nome} — dano`,
    dano, bonus: bonusDano, extras,
    critico: acerto.critico, multiplicador,
  });
  return { ...acerto, dano: golpe };
}
