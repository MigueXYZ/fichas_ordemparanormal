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
    faces: 20,
  };
}

/** Parser de expressões tipo "2d20+3", "1d12", "d6-1" ou "2d8 Balistico + 1d6 Sangue". */
export function rolarExpressao(expr) {
  const texto = String(expr || '').trim();
  if (!texto) return null;

  // Se for apenas uma rolagem simples padrão de dados (ex: "2d20+3", "1d12", "d6-1")
  const mSimples = texto.replace(/\s/g, '').toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (mSimples) {
    const qtd = Math.min(Math.max(Number(mSimples[1] || 1), 1), 50);
    const faces = Number(mSimples[2]);
    const mod = Number(mSimples[3] || 0);
    const rolagens = Array.from({ length: qtd }, () => 1 + Math.floor(Math.random() * faces));
    const soma = rolagens.reduce((a, b) => a + b, 0);
    return {
      id: id(),
      tipo: 'expressao',
      nome: texto,
      detalhe: '',
      rolagens,
      escolhido: null,
      bonus: mod,
      total: soma + mod,
      critico: faces === 20 && rolagens.includes(20),
      falhaCritica: faces === 20 && rolagens.every((r) => r === 1),
      faces,
    };
  }

  // Verificar se é uma expressão composta com tipos de dano (ex: "2d8 Balistico + 1d6 Sangue")
  const tokens = texto.split(/(?=[+-])/);
  const partes = [];
  let totalGeral = 0;
  let teveDado = false;
  let facesPrincipal = null;

  for (let token of tokens) {
    token = token.trim();
    if (!token) continue;
    const sinal = token.startsWith('-') ? -1 : 1;
    const limpo = token.replace(/^[+-]\s*/, '').trim();

    const mDado = limpo.match(/^(\d*)d(\d+)(?:\s*([+-]\s*\d+))?(?:\s+([a-zA-ZáàãâéêíóôõúçÁÀÃÂÉÊÍÓÔÕÚÇ]+))?/i);
    if (mDado) {
      teveDado = true;
      const qtd = Math.min(Math.max(Number(mDado[1] || 1), 1), 50);
      const faces = Number(mDado[2]);
      if (facesPrincipal === null) facesPrincipal = faces;
      const mod = Number(mDado[3] ? mDado[3].replace(/\s/g, '') : 0);
      const tipo = mDado[4] || null;
      const rolagens = Array.from({ length: qtd }, () => 1 + Math.floor(Math.random() * faces));
      const soma = (rolagens.reduce((a, b) => a + b, 0) + mod) * sinal;
      totalGeral += soma;
      partes.push({
        tipoDano: tipo,
        expressao: `${qtd}d${faces}${mod ? (mod > 0 ? `+${mod}` : mod) : ''}`,
        rolagens,
        bonus: mod,
        total: soma,
      });
    } else {
      const mNum = limpo.match(/^(\d+)(?:\s+([a-zA-ZáàãâéêíóôõúçÁÀÃÂÉÊÍÓÔÕÚÇ]+))?/i);
      if (mNum) {
        const val = Number(mNum[1]) * sinal;
        const tipo = mNum[2] || null;
        totalGeral += val;
        partes.push({
          tipoDano: tipo,
          expressao: String(val),
          rolagens: [],
          bonus: val,
          total: val,
        });
      }
    }
  }

  if (!teveDado && partes.length === 0) return null;

  return {
    id: id(),
    tipo: partes.some((p) => Boolean(p.tipoDano)) || partes.length > 1 ? 'dano' : 'expressao',
    nome: texto,
    detalhe: '',
    partes,
    total: totalGeral,
    critico: false,
    falhaCritica: false,
    faces: facesPrincipal,
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
function primeiraExpressaoValida(dano) {
  const partes = String(dano || '').split('/');
  for (const parte of partes) {
    const m = parte.replace(/\s/g, '').toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/);
    if (m) return m;
  }
  return null;
}

export function rolarDano({ nome, dano, tipoDano = null, bonus = 0, extras = [], critico = false, multiplicador = 2 }) {
  const m = primeiraExpressaoValida(dano);
  if (!m) return null;
  const vezes = critico ? Math.max(1, Number(multiplicador) || 2) : 1;
  const qtd = Math.min((Number(m[1] || 1)) * vezes, 60);
  const faces = Number(m[2]);
  const fixo = Number(m[3] || 0) + (Number(bonus) || 0);

  const rolagens = Array.from({ length: qtd }, () => 1 + Math.floor(Math.random() * faces));
  const subtotalBase = rolagens.reduce((a, b) => a + b, 0) + fixo;
  let total = subtotalBase;

  const partes = [];
  partes.push({
    tipoDano: tipoDano || null,
    expressao: `${qtd}d${faces}${fixo ? (fixo > 0 ? `+${fixo}` : fixo) : ''}`,
    rolagens,
    bonus: fixo,
    total: subtotalBase,
    elemental: Boolean(tipoDano && ['sangue', 'morte', 'energia', 'conhecimento', 'medo'].includes(tipoDano.toLowerCase())),
  });

  const detalhesExtra = [];
  for (const e of extras) {
    const expr = typeof e === 'string' ? e : e?.expr;
    const elemental = typeof e === 'object' && e !== null ? Boolean(e.elemental) : false;
    const eTipo = typeof e === 'object' ? (e.tipoDano || (elemental ? 'Sangue' : null)) : null;
    const me = String(expr).replace(/\s/g, '').toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/);
    if (!me) continue;
    const multExtra = (typeof e === 'object' && e?.multiplicaCritico && critico) ? vezes : 1;
    const eqtd = Math.min((Number(me[1] || 1)) * multExtra, 30);
    const efaces = Number(me[2]);
    const efixo = (Number(me[3] || 0)) * multExtra;
    const rs = Array.from({ length: eqtd }, () => 1 + Math.floor(Math.random() * efaces));
    const soma = rs.reduce((a, b) => a + b, 0) + efixo;
    total += soma;
    const exprFinal = `${eqtd}d${efaces}${efixo ? (efixo > 0 ? `+${efixo}` : efixo) : ''}`;
    detalhesExtra.push({ expr: exprFinal, rolagens: rs, soma, elemental, tipoDano: eTipo });
    partes.push({
      tipoDano: eTipo || (elemental ? 'Sangue' : null),
      expressao: exprFinal,
      rolagens: rs,
      bonus: efixo,
      total: soma,
      elemental: Boolean(elemental || (eTipo && ['sangue', 'morte', 'energia', 'conhecimento', 'medo'].includes(eTipo.toLowerCase()))),
    });
  }

  return {
    id: id(),
    tipo: 'dano',
    nome,
    tipoDano,
    critico,
    multiplicador: vezes,
    expressao: `${qtd}d${faces}`,
    rolagens,
    extras: detalhesExtra,
    partes,
    bonus: fixo,
    total,
    falhaCritica: false,
    faces,
  };
}

/**
 * Um ataque é uma coisa só: o teste de acerto e, colado a ele, o dano.
 * O resultado leva o dano em `.dano` para o cartão mostrar as duas secções.
 */
export function rolarAtaqueCompleto({ nome, dados, bonusAtaque = 0, margem = 20, dano, tipoDano = null, bonusDano = 0, extras = [], multiplicador = 2, dadosExtraAtaque = [] }) {
  const acerto = rolarAtaque({ nome, dados, bonus: bonusAtaque, margem, dadosExtra: dadosExtraAtaque });
  const golpe = rolarDano({
    nome: `${nome} — dano`,
    dano, tipoDano, bonus: bonusDano, extras,
    critico: acerto.critico, multiplicador,
  });
  return { ...acerto, dano: golpe };
}
