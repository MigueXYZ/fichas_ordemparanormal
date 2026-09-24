/**
 * Geradores automáticos: fichas aleatórias, NPCs agentes e ameaças.
 *
 * As ameaças seguem o modelo tirado das 41 fichas do capítulo 7 do Livro Base:
 * ajustei Defesa, PV, bónus de teste e dano ao valor de desafio (VD) real
 * dessas fichas, para o que sai daqui encaixar nas regras de construção de
 * combate (soma dos VD ≈ soma dos NEX do grupo).
 */
import { ATRIBUTOS, REGRAS_ATRIBUTOS } from '../data/atributos.js';
import { PERICIAS, PERICIAS_POR_ID } from '../data/pericias.js';
import { ORIGENS } from '../data/origens.js';
import { CLASSES, CLASSES_POR_ID, TRILHAS_POR_ID } from '../data/classes.js';
import { ARMAS } from '../data/itens/armas.js';
import { ITENS_GERAIS } from '../data/itens/geral.js';
import { RITUAIS, circuloMaximoPorNex } from '../data/rituais.js';
import { NOMES_M, NOMES_F, APELIDOS, CIDADES, ANIMAIS, ANIMAIS_GRUPO, SITIOS } from '../data/nomesPt.js';
import { personagemVazio, normalizarRecursos } from './character.js';
import { orcamentoPericias, NEX_TRACK, calcMaximos, calcDefesas, calcPericias, calcDtRitual } from './calc.js';
import { aplicarConcessoes } from './concessoes.js';
import { interpretarCritico, estatisticasArma } from './armas.js';
import { FORMATO_FICHA_LIVRE, PERICIAS_BASE_NPC, paraFichaOrdo, poolTexto, textoDeslocamento } from './fichaLivre.js';
import { PERFIS_NPC, SEGREDOS_NPC, ESTILO_CULTO, PAPEIS_CULTO, comGenero } from '../data/perfisNpc.js';
import {
  COMPORTAMENTOS_CRIATURAS,
  APARENCIAS_CRIATURAS,
  DICAS_RP_CRIATURAS,
} from '../data/roleplayTabelas.js';

const ao = (lista) => (lista && lista.length ? lista[Math.floor(Math.random() * lista.length)] : null);
const entre = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

export function nomePortugues(gen = null) {
  const genero = gen || (Math.random() < 0.5 ? 'm' : 'f');
  const proprio = ao(genero === 'm' ? NOMES_M : NOMES_F);
  const segundo = Math.random() < 0.3 ? ao(genero === 'm' ? NOMES_M : NOMES_F) : '';
  const apelido1 = ao(APELIDOS);
  const apelido2 = ao(APELIDOS.filter((a) => a !== apelido1));
  const apelidos = Math.random() < 0.45 ? `${apelido1} ${apelido2}` : apelido1;
  const nome = [proprio, segundo && segundo !== proprio ? segundo : '', apelidos].filter(Boolean).join(' ');
  return { nome, genero };
}

// ---------------------------------------------------------------- conceitos

export const CONCEITOS = [
  {
    id: 'combate', nome: 'Combate',
    atributos: ['for', 'agi', 'vig'],
    pericias: ['luta', 'pontaria', 'fortitude', 'reflexos', 'atletismo', 'tatica', 'iniciativa'],
    classe: 'combatente',
  },
  {
    id: 'investigacao', nome: 'Investigação',
    atributos: ['int', 'pre', 'agi'],
    pericias: ['investigacao', 'percepcao', 'intuicao', 'crime', 'tecnologia', 'ciencias', 'atualidades'],
    classe: 'especialista',
  },
  {
    id: 'ritual', nome: 'Ritual',
    atributos: ['pre', 'int', 'vig'],
    pericias: ['ocultismo', 'vontade', 'religiao', 'intuicao', 'ciencias'],
    classe: 'ocultista',
  },
  {
    id: 'social', nome: 'Social',
    atributos: ['pre', 'int', 'agi'],
    pericias: ['diplomacia', 'enganacao', 'intimidacao', 'intuicao', 'percepcao', 'artes'],
    classe: 'especialista',
  },
  { id: 'surpresa', nome: 'Surpreende-me', atributos: null, pericias: null, classe: null },
];

export const CONCEITOS_POR_ID = Object.fromEntries(CONCEITOS.map((c) => [c.id, c]));

// ---------------------------------------------------------------- atributos

function distribuirAtributos(conceito) {
  const attrs = { for: 1, agi: 1, int: 1, pre: 1, vig: 1 };
  const favoritos = conceito?.atributos || ATRIBUTOS.map((a) => a.id);
  let pontos = REGRAS_ATRIBUTOS.pontosParaDistribuir;

  const fracos = ATRIBUTOS.map((a) => a.id).filter((id) => !favoritos.includes(id));
  if (fracos.length && Math.random() < 0.35) {
    attrs[ao(fracos)] = 0;
    pontos += 1;
  }

  while (pontos > 0) {
    const alvo = Math.random() < 0.75 ? ao(favoritos) : ao(ATRIBUTOS.map((a) => a.id));
    if (attrs[alvo] < REGRAS_ATRIBUTOS.maximoInicial) {
      attrs[alvo] += 1;
      pontos -= 1;
    } else if (favoritos.every((f) => attrs[f] >= REGRAS_ATRIBUTOS.maximoInicial)) {
      const livres = ATRIBUTOS.map((a) => a.id).filter((id) => attrs[id] < REGRAS_ATRIBUTOS.maximoInicial);
      if (!livres.length) break;
      attrs[ao(livres)] += 1;
      pontos -= 1;
    }
  }
  return attrs;
}

// ------------------------------------------------------------ ficha completa

/**
 * Gera uma ficha jogável com habilidades, poderes, rituais e detalhes de RP.
 */
/** Perfil compatível com o que o mestre escolheu (conceito/classe), ou qualquer um. */
export function escolherPerfil({ conceito = 'surpresa', classeId = null } = {}) {
  const porConceito = conceito && conceito !== 'surpresa' ? PERFIS_NPC.filter((pf) => pf.conceito === conceito) : PERFIS_NPC;
  const porClasse = classeId ? porConceito.filter((pf) => pf.classes.includes(classeId)) : porConceito;
  return ao(porClasse.length ? porClasse : porConceito.length ? porConceito : PERFIS_NPC);
}

export function gerarFicha({ nex = 5, conceito = 'surpresa', classeId = null, trilhaId = null, origemId = null, jogador = '', perfil = null } = {}) {
  // O perfil dá coerência a tudo (ocupação, perícias, arma, equipamento, RP);
  // o que o mestre escolher à mão (conceito, classe, origem) manda sempre.
  const pf = perfil || escolherPerfil({ conceito, classeId });
  const conc = conceito === 'surpresa'
    ? { id: 'perfil', atributos: pf.atributos, pericias: pf.pericias, classe: ao(pf.classes) }
    : { ...CONCEITOS_POR_ID[conceito], pericias: [...new Set([...pf.pericias, ...CONCEITOS_POR_ID[conceito].pericias])] };
  const { nome, genero } = nomePortugues();

  let p = personagemVazio();
  p.nome = nome;
  p.genero = genero;
  p.perfilId = pf.id;
  p.ocupacao = pf.ocupacao[genero === 'f' ? 1 : 0];
  p.jogador = jogador;
  p.nex = NEX_TRACK.includes(Number(nex)) ? Number(nex) : 5;
  p.atributos = distribuirAtributos(conc);

  // Origem (do perfil, se não foi escolhida)
  const origensPerfil = ORIGENS.filter((o) => pf.origens.includes(o.id));
  const origem = origemId ? ORIGENS.find((o) => o.id === origemId) : ao(origensPerfil.length ? origensPerfil : ORIGENS);
  if (origem) {
    p.origemId = origem.id;
    p = aplicarConcessoes(p, 'origem', origem.pericias || []);
    if (origem.periciasLivres) {
      const extra = escolherPericias(p, conc, origem.periciasLivres);
      p = aplicarConcessoes(p, 'origem', [...(origem.pericias || []), ...extra]);
    }
  }

  // Classe
  const classe = CLASSES_POR_ID[classeId] || CLASSES_POR_ID[conc?.classe] || CLASSES_POR_ID[ao(pf.classes)] || ao(CLASSES.filter((c) => c.id !== 'sobrevivente'));
  p.classeId = classe.id;
  p.proficiencias = [...(classe.proficiencias || [])];

  const orc = orcamentoPericias(p);
  const escolhas = {};
  (orc.escolhas || []).forEach((esc, i) => {
    const preferida = esc.entre.find((id) => conc?.pericias?.includes(id));
    escolhas[i] = preferida || ao(esc.entre);
  });
  const livres = escolherPericias(p, conc, orc.livres, [...orc.obrigatorias, ...Object.values(escolhas)]);
  p.periciasEscolhaClasse = escolhas;
  p.periciasLivresClasse = livres;
  p = aplicarConcessoes(p, 'classe', [...new Set([...orc.obrigatorias, ...Object.values(escolhas), ...livres])]);

  // Trilha (a partir de NEX 10%)
  if (p.nex >= 10 && classe.trilhas?.length) {
    const trilhaEscolhida = trilhaId ? classe.trilhas.find((t) => t.id === trilhaId) : null;
    p.trilhaId = trilhaEscolhida ? trilhaEscolhida.id : ao(classe.trilhas).id;
  }

  // Graus de treino mais altos conforme o NEX
  if (p.nex >= 35 || p.nex >= 70) {
    const treinadas = Object.entries(p.pericias).filter(([, v]) => v.grau === 'treinado').map(([k]) => k);
    const quantos = p.nex >= 70 ? 4 : 2;
    for (const id of treinadas.sort(() => Math.random() - 0.5).slice(0, quantos)) {
      p.pericias[id].grau = p.nex >= 70 && Math.random() < 0.5 ? 'expert' : 'veterano';
    }
  }

  // Habilidades de Classe e Origem
  const habilidadesGeradas = [];
  if (origem?.poder) {
    habilidadesGeradas.push({
      nome: origem.poder.nome || `Poder de ${origem.nome}`,
      descricao: origem.poder.descricao || '',
      origem: 'Origem',
    });
  }
  if (classe.habilidades?.length) {
    for (const hab of classe.habilidades) {
      if ((hab.nex ?? 5) <= p.nex) {
        habilidadesGeradas.push({
          nome: hab.nome,
          descricao: hab.descricao || '',
          origem: 'Classe',
        });
      }
    }
  }

  // Poderes de Trilha (NEX 10%, 40%, 65%, 99%)
  const trilhaObj = TRILHAS_POR_ID[p.trilhaId];
  if (trilhaObj && trilhaObj.poderes) {
    for (const pod of trilhaObj.poderes) {
      if ((pod.nex ?? 10) <= p.nex) {
        habilidadesGeradas.push({
          nome: pod.nome,
          descricao: pod.descricao || '',
          origem: `Trilha (${trilhaObj.nome})`,
        });
      }
    }
  }
  p.habilidades = habilidadesGeradas;

  // Poderes de Classe e Gerais (NEX 15%, 30%, 45%, 50%, 60%, 75%, 80%, 90%)
  const poderesDisponiveis = [...(classe.poderes || [])];
  const poderesEscolhidos = [];
  const qtdPoderes = Math.floor(p.nex / 15) + (p.nex >= 50 ? 1 : 0);
  const poderesBaralhados = [...poderesDisponiveis].sort(() => Math.random() - 0.5);
  for (let i = 0; i < qtdPoderes && i < poderesBaralhados.length; i++) {
    poderesEscolhidos.push({
      nome: poderesBaralhados[i].nome,
      descricao: poderesBaralhados[i].descricao || '',
      origem: 'Poder de Classe',
    });
  }
  p.poderes = poderesEscolhidos;

  // Rituais (para Ocultistas ou classes com rituais)
  if (classe.id === 'ocultista' || p.trilhaId?.includes('ocult') || p.nex >= 15) {
    const maxCirculo = circuloMaximoPorNex(p.nex);
    const rituaisCandidatos = RITUAIS.filter((r) => r.circulo <= maxCirculo);
    const qtdRituais = classe.id === 'ocultista'
      ? Math.min(15, 3 + Math.floor((p.nex - 5) / 5))
      : Math.min(6, Math.floor(p.nex / 20));

    const rituaisBaralhados = [...rituaisCandidatos].sort(() => Math.random() - 0.5);
    p.rituais = rituaisBaralhados.slice(0, qtdRituais).map((r) => ({
      id: r.id,
      nome: r.nome,
      circulo: r.circulo,
      elemento: r.elemento,
      execucao: r.execucao || 'Padrão',
      alcance: r.alcance || 'Curto',
      alvo: r.alvo || '',
      duracao: r.duracao || 'Instantânea',
      resistencia: r.resistencia || '',
      custo: r.custo || `${r.circulo} PE`,
      descricao: r.descricao || '',
    }));
  } else {
    p.rituais = [];
  }

  // Equipamento — a arma e os itens do perfil (um detetive com revólver e
  // algemas, não uma espingarda e uma pistola de dardos)
  const nomeArma = ao(pf.armas.filter((n) => ARMAS.some((a) => a.nome === n)));
  const armaPerfil = ARMAS.find((a) => a.nome === nomeArma);
  p.ataques = [armaPerfil ? armaDe(armaPerfil) : armaAleatoria(p, conc)];
  const itensPerfil = ITENS_GERAIS.filter((i) => pf.itens.includes(i.nome))
    .map((item) => ({ nome: item.nome, categoria: String(item.categoria ?? ''), espacos: item.espacos ?? 1, descricao: item.descricao || '' }));
  p.inventario = itensPerfil.length ? itensPerfil : equipamentoInicial();
  p.patenteId = p.nex >= 50 ? 'especial' : p.nex >= 20 ? 'operador' : 'recruta';

  // Comportamento, Descrição Visual e Dicas de RP — só do perfil (os poços
  // gerais são de agentes de combate e escritos no masculino, e destoavam:
  // uma psicóloga "a procurar ângulos de tiro")
  const g = (t) => comGenero(t, genero);
  const comportamento = g(ao(pf.comportamentos));
  const [idadeMin, idadeMax] = pf.idade || [22, 55];
  const aparencia = `${g(ao(pf.aparencias))} Natural de ${ao(CIDADES)}, ${entre(idadeMin, idadeMax)} anos.`;
  const dicaRp = g(ao(pf.personalidades));

  p.comportamento = comportamento;
  p.aparencia = aparencia;
  p.dicaRp = dicaRp;

  p.descricao = {
    aparencia,
    personalidade: `${comportamento} ${dicaRp}`,
    historico: origem ? origem.descricao : '',
    objetivo: 'Sobreviver e impedir o avanço das Entidades do Outro Lado.',
  };

  return normalizarRecursos(p);
}

function escolherPericias(p, conc, quantas, jaEscolhidas = []) {
  if (!quantas) return [];
  const usadas = new Set([
    ...jaEscolhidas,
    ...Object.entries(p.pericias || {}).filter(([, v]) => v.grau !== 'destreinado').map(([k]) => k),
  ]);
  const preferidas = (conc?.pericias || []).filter((id) => !usadas.has(id));
  const resto = PERICIAS.map((x) => x.id).filter((id) => !usadas.has(id) && !preferidas.includes(id))
    .sort(() => Math.random() - 0.5);
  return [...preferidas, ...resto].slice(0, quantas);
}

function armaAleatoria(p, conc) {
  const corpoACorpo = conc?.id === 'combate' ? Math.random() < 0.5 : Math.random() < 0.35;
  const candidatas = ARMAS.filter((a) =>
    (corpoACorpo ? /corpo a corpo/i.test(a.grupo || '') : /distância|fogo|disparo/i.test(a.grupo || '')) &&
    (a.categoria ?? 0) <= (p.nex >= 20 ? 2 : 1)
  );
  return armaDe(candidatas.length ? ao(candidatas) : ao(ARMAS));
}

/** Uma arma do catálogo no formato de ataque da ficha. */
function armaDe(arma) {
  const c = interpretarCritico(arma.critico);
  const corpo = /corpo a corpo/i.test(arma.grupo || '');
  return {
    nome: arma.nome, pericia: arma.pericia || (corpo ? 'luta' : 'pontaria'), bonus: 0,
    dano: arma.dano || '1d6', margem: c.margem, multiplicador: c.multiplicador,
    tipo: arma.tipoDano || '', alcance: arma.alcance || '', espacos: arma.espacos ?? 1,
    categoria: arma.categoria ?? '', atributoDano: corpo ? 'for' : '',
    danoExtra: [], modificacoes: [], notas: '',
  };
}

function equipamentoInicial() {
  const uteis = ITENS_GERAIS.filter((i) => (i.categoria ?? 0) <= 1);
  const escolhidos = [];
  for (let i = 0; i < 3 && uteis.length; i++) {
    const item = ao(uteis);
    if (!escolhidos.some((e) => e.nome === item.nome)) {
      escolhidos.push({ nome: item.nome, categoria: String(item.categoria ?? ''), espacos: item.espacos ?? 1, descricao: item.descricao || '' });
    }
  }
  return escolhidos;
}

// ------------------------------------------------------------------ NPCs

const capitalizar = (s) => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : '');
/** Elemento de um ritual: 'sangue' → 'Sangue'; vários (['morte','sangue']) → 'Variável'. */
const elementoRitual = (el) => (Array.isArray(el) ? (el.length === 1 ? capitalizar(el[0]) : 'Variável') : el === 'variavel' ? 'Variável' : capitalizar(el));

/**
 * NPC gerado — uma pessoa com ficha livre (engine/fichaLivre.js), com os
 * números já calculados a partir de uma ficha de agente gerada ao acaso
 * (gerarFicha): PV/PE/SAN, Defesa/Bloqueio/Esquiva, perícias treinadas,
 * ataques das armas, poderes, rituais com DT e equipamento. Não implica que
 * seja agente da Ordem.
 */
export function gerarNpcAgente(opcoes = {}) {
  const p = gerarFicha(opcoes);
  const pf = PERFIS_NPC.find((x) => x.id === p.perfilId) || ao(PERFIS_NPC);
  const g = (t) => comGenero(t, p.genero);
  const doPerfil = (lista) => g(ao(lista));
  const classe = CLASSES_POR_ID[p.classeId];
  const origem = ORIGENS.find((o) => o.id === p.origemId);
  const trilha = TRILHAS_POR_ID[p.trilhaId];
  const max = calcMaximos(p);
  const def = calcDefesas(p);

  // Perícias: Iniciativa/Percepção/testes de resistência (toda a gente os
  // rola) mais só as treinadas que definem a pessoa — 2 a 5 conforme o NEX,
  // primeiro as do perfil. A ficha de agente por baixo treina 7+ (é a regra
  // de uma personagem de jogador), o que num NPC era demasiado.
  const todas = calcPericias(p);
  const base = PERICIAS_BASE_NPC.map((nome) => todas.find((x) => x.nome === nome)).filter(Boolean);
  const quantas = Math.max(1, (p.nex <= 10 ? 2 : p.nex <= 35 ? 3 : p.nex <= 65 ? 4 : 5) + entre(-1, 1));
  const doPerfilPrimeiro = (x) => { const i = pf.pericias.indexOf(x.id); return i < 0 ? 99 : i; };
  const treinadas = todas
    .filter((x) => x.grau !== 'destreinado' && !PERICIAS_BASE_NPC.includes(x.nome))
    .sort((a, b) => doPerfilPrimeiro(a) - doPerfilPrimeiro(b) || b.bonus - a.bonus)
    .slice(0, quantas);
  const pericias = [...base, ...treinadas].map((x) => ({ nome: x.nome, dados: x.dados, bonus: x.bonus }));

  const acoes = (p.ataques || []).map((arma) => {
    const e = estatisticasArma(p, arma);
    const corpo = arma.pericia === 'luta';
    const bonusDano = Number(e.bonusDano) || 0;
    return {
      tipo: 'Padrão',
      nome: arma.nome,
      detalhe: [corpo ? 'Corpo a corpo' : 'À distância', arma.alcance && !corpo ? String(arma.alcance).toLowerCase() : ''].filter(Boolean).join(', '),
      teste: poolTexto(e.dados, e.bonusAtaque),
      dano: `${e.dano}${bonusDano ? (bonusDano > 0 ? '+' : '') + bonusDano : ''}${arma.tipo ? ' ' + String(arma.tipo).toLowerCase() : ''}`,
      critico: `${e.margem}/x${e.multiplicador}`,
      descricao: '',
    };
  });

  const habilidades = [...(p.habilidades || []), ...(p.poderes || [])].map((h) => ({ nome: h.nome, custo: h.origem || '', descricao: h.descricao || '' }));
  const rituais = (p.rituais || []).map((r) => ({
    nome: r.nome, circulo: String(r.circulo ?? ''), elemento: elementoRitual(r.elemento),
    dt: String(calcDtRitual(p, r) ?? ''), custo: r.custo || '', execucao: r.execucao || '', alcance: r.alcance || '', descricao: r.descricao || '',
  }));
  // arma + 2 a 3 pertences próprios do perfil + os itens da ficha
  const pertences = [...pf.pertences].sort(() => Math.random() - 0.5).slice(0, entre(2, 3)).map(g);
  const equipamento = [...new Set([...(p.ataques || []).map((a) => a.nome), ...pertences, ...(p.inventario || []).map((i) => i.nome)])];
  const segredo = Math.random() < 0.34 ? g(ao(SEGREDOS_NPC)) : '';

  return paraFichaOrdo({
    formato: FORMATO_FICHA_LIVRE,
    tipo: 'npc',
    fichaLivre: true,
    jogador: 'NPC',
    nome: p.nome,
    breveDescricao: p.ocupacao,
    historia: '', // a aparência e o resto já vão no roleplay; a história fica para o Mestre
    classe: classe?.nome || '',
    origem: origem?.nome || '',
    trilha: trilha?.nome || '',
    afiliacao: g(ao(pf.afiliacoes) || ''),
    nex: p.nex,
    vd: p.nex, // para o balanço do combate, um NPC pesa o que o seu NEX pesaria
    atributos: { ...p.atributos },
    pv: max.pv, pe: max.pe, san: max.san,
    defesa: def.defesa,
    bloqueio: def.bloqueio?.disponivel ? def.bloqueio.valor : '',
    esquiva: def.esquiva?.disponivel ? def.esquiva.valor : '',
    deslocamento: `${p.deslocamento ?? 9}m`,
    pericias, acoes, habilidades, rituais, equipamento,
    roleplay: {
      aparencia: p.aparencia,
      traco: doPerfil(pf.tracos),
      personalidade: p.dicaRp,
      maneirismos: doPerfil(pf.maneirismos),
      motivacao: doPerfil(pf.motivacoes),
      informacao: doPerfil(pf.informacoes),
      notasMestre: [p.comportamento, segredo].filter(Boolean).join('\n'),
    },
    tags: [],
  });
}

// ---------------------------------------------------------------- ameaças

export const VD_SUGERIDOS = [10, 20, 40, 60, 80, 100, 120, 160, 200, 240, 280, 320, 360, 400];

/**
 * Categoria da ameaça — a forma base da criatura. Cada uma tem o seu próprio
 * ataque/perícias por defeito e um pequeno poço de habilidades genéricas da
 * categoria (usadas quando nenhum Elemento está marcado, ou para completar
 * a lista de habilidades a par das dos elementos escolhidos).
 */
export const CATEGORIAS_AMEACA = [
  {
    id: 'humanoide', nome: 'Humanoide',
    atributos: { agi: 1, for: 2, int: 1, pre: 2, vig: 1 },
    ataques: [
      { nome: 'Golpe Errático', tipo: 'Impacto', dado: 8 },
      { nome: 'Dilaceração', tipo: 'Corte', dado: 8 },
      { nome: 'Estrangulamento', tipo: 'Impacto', dado: 6 },
    ],
    pericias: ['luta', 'intimidacao', 'percepcao'],
    habilidades: [
      { nome: 'Rosto Errado', descricao: 'Consegue imitar a voz e a postura de alguém específico que já tenha observado de perto — o suficiente para enganar quem não conheça bem essa pessoa (teste de Intuição, DT {DT}, para perceber a farsa).' },
      { nome: 'Golpe Calculado', descricao: 'Contra um alvo Surpreendido ou que ainda não tenha agido no combate, o ataque desta criatura causa +{BONUS_DANO} de dano extra.' },
      { nome: 'Fala Fragmentada', descricao: 'Uma vez por cena, pode dirigir-se a um alvo a até 9m com frases quebradas e fora de contexto: o alvo faz Vontade (DT {DT}) ou fica Abalado por 1 rodada.' },
      { nome: 'Resiliência Antinatural', descricao: 'No início do seu turno, se não tiver sofrido dano na rodada anterior, recupera {DANO_METADE} pontos de vida.' },
    ],
    // Habilidade de limiar — ver comentário em gerarAmeaca() junto a
    // poolCondicionais: garantida a partir de VD 40, entra sempre para além
    // das 4 normais acima.
    habilidadeCondicional: { nome: 'Máscara Cai', descricao: 'Quando fica Machucada, abandona qualquer fingimento: os seus ataques passam a causar +{BONUS_DANO} de dano extra e a voz distorce-se, revelando o que está por baixo.' },
  },
  {
    id: 'animal', nome: 'Animal',
    atributos: { agi: 3, for: 1, int: 0, pre: 0, vig: 2 },
    ataques: [
      { nome: 'Mordida', tipo: 'Perfuração', dado: 6 },
      { nome: 'Investida', tipo: 'Impacto', dado: 6 },
      { nome: 'Golpe de Garra', tipo: 'Corte', dado: 6 },
    ],
    pericias: ['percepcao', 'atletismo', 'furtividade'],
    habilidades: [
      { nome: 'Instinto de Matilha', descricao: 'Se outro aliado estiver adjacente ao mesmo alvo, o ataque desta criatura causa +{BONUS_DANO} de dano extra.' },
      { nome: 'Sentidos Apurados', descricao: 'Não pode ser Surpreendida e ganha +{BONUS_TESTE} em testes de Percepção baseados em olfato ou audição.' },
      { nome: 'Presa e Recuo', descricao: 'Depois de atacar, pode gastar a ação de movimento para se afastar até 6m sem provocar ataques de oportunidade.' },
    ],
    // "Fúria Ferida" era antes uma habilidade normal (podia sair ou não);
    // como já é, por natureza, uma habilidade de limiar (só faz sentido ao
    // ficar Machucada), passou a ser a condicional garantida do Animal.
    habilidadeCondicional: { nome: 'Fúria Ferida', descricao: 'Quando fica Machucada, os seus ataques passam a causar +1 dado de dano até ao fim do combate.' },
  },
  {
    id: 'criatura', nome: 'Criatura',
    atributos: { agi: 2, for: 2, int: 0, pre: 1, vig: 2 },
    ataques: [
      { nome: 'Investida Selvagem', tipo: 'Impacto', dado: 8 },
      { nome: 'Tentáculo Constritor', tipo: 'Impacto', dado: 8 },
      { nome: 'Ferrão', tipo: 'Perfuração', dado: 8 },
    ],
    pericias: ['fortitude', 'percepcao', 'furtividade'],
    habilidades: [
      { nome: 'Forma Errante', descricao: 'Consegue espremer-se por qualquer abertura até metade do seu tamanho, sem penalidade.' },
      { nome: 'Reflexos Predatórios', descricao: 'Uma vez por combate, pode fazer um ataque de oportunidade adicional.' },
      { nome: 'Pele Anómala', descricao: 'Reduz em {BONUS_DANO} todo o dano físico (Balístico, corte, impacto ou perfuração) recebido, antes de aplicar resistências.' },
      { nome: 'Fome Insaciável', descricao: 'Ao reduzir um alvo a 0 pontos de vida, ganha +{BONUS_TESTE} em todos os testes até ao fim do combate.' },
    ],
    habilidadeCondicional: { nome: 'Instinto de Sobrevivência', descricao: 'Quando fica Machucada, o seu deslocamento aumenta em 3m e ganha +{BONUS_TESTE} em testes de Reflexos até ao fim do combate.' },
  },
];

/**
 * Elementos oficiais de Ordem Paranormal (Sangue, Morte, Conhecimento,
 * Energia, Medo — os mesmos de ELEMENTOS_CULTISTAS) aplicados a ameaças: cada
 * um junta um descritor, resistência(s), sabor de ataque e o seu próprio
 * poço de habilidades. O mestre escolhe 0 a 5 no gerador; escolher um
 * elemento garante que ele entra na lista de habilidades (ver
 * selecionarHabilidades), não só o descritor.
 */
export const ELEMENTOS_AMEACA = [
  {
    id: 'Sangue',
    atributos: { for: 2, vig: 1 },
    ataques: [
      { nome: 'Garras', tipo: 'Corte', dado: 10 },
      { nome: 'Lanças de Osso', tipo: 'Perfuração', dado: 10 },
      { nome: 'Golpe Sangrento', tipo: 'Corte', dado: 8 },
    ],
    resistenciasVariantes: [
      ['Balístico, corte, impacto e perfuração 5', 'Sangue 10'],
      ['Sangue 15'],
    ],
    habilidades: [
      { nome: 'Hemorragia Persistente', descricao: 'Um alvo atingido pelo ataque corpo a corpo desta criatura fica Sangrando.' },
      { nome: 'Salpico Corrosivo', descricao: 'Quando esta criatura tira um crítico, o sangue expelido atinge quem estiver adjacente ao alvo: Reflexos (DT {DT}) ou sofrem {DANO_METADE} de dano de Sangue.' },
      { nome: 'Coagulação Instantânea', descricao: 'Uma vez por combate, como reação a sofrer dano, reduz esse dano em {BONUS_DANO}.' },
      { nome: 'Faro para Sangue', descricao: 'Sente a presença de qualquer criatura ferida ou Sangrando a até 18m, mesmo através de paredes, e sabe sempre a direção exata.' },
    ],
    habilidadeCondicional: { nome: 'Frenesim Sangrento', descricao: 'Quando fica Machucada, o seu ataque corpo a corpo passa a causar +{DANO_METADE} de dano extra de Sangue, mas perde qualquer resistência a dano físico que tivesse.' },
    // Comportamento/Aparência/Dica de RP próprios — usados em vez do poço
    // genérico de criaturas quando este elemento está marcado, para o texto
    // de interpretação bater certo com as habilidades acima (sangue,
    // cheiro, coagulação), em vez de sair um comportamento qualquer sem
    // ligação nenhuma às mecânicas da ficha.
    comportamentos: [
      'Deixa um rasto de sangue escuro e viscoso por onde passa, que crepita levemente ao contacto com metal.',
      'Fareja feridas abertas a metros de distância e muda de direção só de sentir o cheiro.',
    ],
    aparencias: [
      'Pele rachada com sangue escuro a escorrer por baixo, coagulando e voltando a abrir a cada movimento.',
    ],
    dicasRp: [
      'Persegue primeiro quem já estiver ferido — o cheiro do sangue chama-a mais do que qualquer outra coisa.',
    ],
  },
  {
    id: 'Morte',
    atributos: { vig: 1, pre: 2 },
    ataques: [
      { nome: 'Toque Necrótico', tipo: 'Morte', dado: 8 },
      { nome: 'Sopro Mortífero', tipo: 'Morte', dado: 8 },
      { nome: 'Garra Cadavérica', tipo: 'Corte', dado: 8 },
    ],
    resistenciasVariantes: [
      ['Morte 10', 'Imune a doenças e venenos'],
      ['Morte 15'],
    ],
    habilidades: [
      { nome: 'Frio da Sepultura', descricao: 'A área a até 3m desta criatura fica gelada e opressiva; quem lá permaneça no início do seu turno faz Fortitude (DT {DT}) ou fica Enjoado por 1 rodada.' },
      { nome: 'Presságio Fúnebre', descricao: 'Antes de atacar um alvo, pode gastar uma ação livre para o fitar: se o alvo falhar em Vontade (DT {DT}), o próximo ataque desta criatura contra ele causa +{BONUS_DANO} de dano.' },
      { nome: 'Negar a Morte', descricao: 'Uma vez por combate, ao ser reduzida a 0 pontos de vida, permanece de pé com {DADO_CURA} pontos de vida em vez de cair.' },
      { nome: 'Toque Consumptivo', descricao: 'Ao causar dano com o ataque corpo a corpo, recupera {DANO_METADE} pontos de vida.' },
    ],
    habilidadeCondicional: { nome: 'Abraço da Sepultura', descricao: 'Quando fica Machucada, deixa de temer o fim: os seus ataques causam +{BONUS_DANO} de dano extra, mas já não recupera pontos de vida de forma alguma.' },
    comportamentos: [
      'Move-se devagar e sem pressa, como se soubesse que o tempo está do seu lado.',
      'Aproxima-se de corpos e feridos antes de qualquer outra coisa, como se se alimentasse da proximidade da morte.',
    ],
    aparencias: [
      'Pele cinzenta e fria ao toque, com um cheiro fraco a terra húmida e coisas paradas.',
    ],
    dicasRp: [
      'Fala pouco e nunca se apressa — para ela, o combate já está decidido.',
    ],
  },
  {
    id: 'Conhecimento',
    atributos: { int: 3, pre: 1 },
    ataques: [
      { nome: 'Sussurro Dilacerante', tipo: 'Mental', dado: 8 },
      { nome: 'Olhar Impossível', tipo: 'Mental', dado: 8 },
      { nome: 'Golpe da Verdade', tipo: 'Mental', dado: 6 },
    ],
    resistenciasVariantes: [
      ['Conhecimento 10', 'Mental 5'],
      ['Conhecimento 15'],
    ],
    habilidades: [
      { nome: 'Olhar que Devora', descricao: 'Uma vez por cena, pode encarar um alvo a até 9m que a veja: o alvo faz Vontade (DT {DT}) ou fica Abalado por 1 rodada, perturbado por algo que preferia ignorar.' },
      { nome: 'Geometria Impossível', descricao: 'O espaço à sua volta parece errado aos olhos de quem a observa; ataques contra ela têm 20% de chance de falhar por pura confusão espacial.' },
      { nome: 'Segredo Pesado', descricao: 'Contra um alvo de quem conheça um segredo (a critério do mestre), os ataques desta criatura causam +{BONUS_DANO} de dano.' },
      { nome: 'Verdade Insuportável', descricao: 'Um alvo atingido pelo ataque corpo a corpo desta criatura faz Vontade (DT {DT}) ou fica Confuso por 1 rodada.' },
    ],
    habilidadeCondicional: { nome: 'Colapso da Razão', descricao: 'Quando fica Machucada, a sua presença torna-se insuportável: um alvo que a veja pela primeira vez em cada rodada faz Vontade (DT {DT}) ou fica Confuso por 1 rodada.' },
    comportamentos: [
      'Observa antes de agir, como se estivesse a avaliar cada segredo que os alvos escondem.',
      'Inclina a cabeça de formas que não deviam ser possíveis, como se ouvisse algo que mais ninguém ouve.',
    ],
    aparencias: [
      'Traços que parecem mudar ligeiramente sempre que alguém desvia o olhar.',
    ],
    dicasRp: [
      'Sabe coisas que não devia saber — deixa escapar um detalhe pessoal de um agente a meio do combate.',
    ],
  },
  {
    id: 'Energia',
    atributos: { int: 1, agi: 2 },
    ataques: [
      { nome: 'Descarga', tipo: 'Energia', dado: 10 },
      { nome: 'Lança de Energia', tipo: 'Energia', dado: 10 },
      { nome: 'Explosão Cinética', tipo: 'Energia', dado: 8 },
    ],
    resistenciasVariantes: [
      ['Energia 10'],
      ['Energia 15', 'Balístico 5'],
    ],
    habilidades: [
      { nome: 'Descarga em Cadeia', descricao: 'Quando acerta um ataque, uma segunda descarga salta para outra criatura a até 3m do alvo, causando {DANO_METADE} de dano de Energia.' },
      { nome: 'Interferência', descricao: 'Aparelhos eletrónicos a até 6m falham de forma intermitente e as luzes cintilam enquanto esta criatura estiver na área.' },
      { nome: 'Sobrecarga Cinética', descricao: 'Sempre que sofre dano, o seu próximo ataque antes do fim do combate causa +{BONUS_DANO} de dano extra.' },
      { nome: 'Forma Instável', descricao: 'Reduz para metade todo o dano físico (Balístico, corte, impacto ou perfuração) recebido, antes de aplicar resistências.' },
    ],
    habilidadeCondicional: { nome: 'Sobrecarga Terminal', descricao: 'Quando fica Machucada, liberta energia descontrolada: no início de cada um dos seus turnos, quem estiver adjacente sofre {DANO_METADE} de dano de Energia.' },
    comportamentos: [
      'Estática crepita à sua volta e as luzes próximas piscam sempre que se aproxima.',
      'Move-se em movimentos bruscos e descoordenados, como interferência elétrica em forma de criatura.',
    ],
    aparencias: [
      'Contornos que tremeluzem como um sinal mal sintonizado, com faíscas visíveis nas extremidades.',
    ],
    dicasRp: [
      'Aparelhos eletrónicos próximos falham antes de ela aparecer — é o primeiro aviso de que está perto.',
    ],
  },
  {
    id: 'Medo',
    atributos: { pre: 3, int: 1 },
    ataques: [
      { nome: 'Garras do Pavor', tipo: 'Mental', dado: 8 },
      { nome: 'Grito Dilacerante', tipo: 'Mental', dado: 8 },
      { nome: 'Toque do Terror', tipo: 'Mental', dado: 6 },
    ],
    resistenciasVariantes: [
      ['Medo 10'],
      ['Medo 15'],
    ],
    habilidades: [
      { nome: 'Presença Aterradora', descricao: 'Ao ver a criatura pela primeira vez, um alvo faz Vontade (DT {DT}) ou fica Apavorado por 1 rodada.' },
      { nome: 'Alimenta-se do Pavor', descricao: 'Recupera {DANO_METADE} pontos de vida sempre que um alvo a até 9m falha um teste de Vontade.' },
      { nome: 'Grito Paralisante', descricao: 'Uma vez por combate, pode soltar um grito: criaturas a até 6m fazem Fortitude (DT {DT}) ou ficam Paralisadas por 1 rodada.' },
      { nome: 'Marca do Medo', descricao: 'Um alvo que fique Apavorado por esta criatura sofre +{BONUS_DANO} de dano extra da próxima vez que ela o atingir nesse combate.' },
    ],
    habilidadeCondicional: { nome: 'Últimos Instantes de Pavor', descricao: 'Quando fica Machucada, todos os alvos a até 9m que já estejam Abalados ou Apavorados por ela sofrem +{BONUS_DANO} de dano extra do próximo ataque desta criatura.' },
    comportamentos: [
      'Aproxima-se devagar da escuridão, deixando que o medo dos alvos faça a maior parte do trabalho.',
      'Reage ao pânico de quem a vê — fica mais ousada quanto mais os agentes hesitam.',
    ],
    aparencias: [
      'Uma forma que parece mudar consoante o medo de quem a olha — nunca duas pessoas a descrevem da mesma maneira.',
    ],
    dicasRp: [
      'Alimenta-se de reações, não de sangue — dá mais medo a quem já demonstrou ter medo.',
    ],
  },
];

export const TAMANHOS = ['Minúsculo', 'Pequeno', 'Médio', 'Grande', 'Enorme', 'Colossal'];

/** Pequena variação aleatória à volta de um valor central (±pct) — os stat
 * blocks reais do livro também não caem todos exatamente em cima da curva
 * de VD, variam à volta dela. `minimo` evita que a variação empurre um
 * valor pequeno para algo ridículo (ex.: Defesa 2). O VD em si (o que
 * conta para o orçamento de combate) nunca é tocado por isto — só a
 * "textura" de Defesa/PV/DT à volta dele. */
function variar(valor, pct, minimo = 1) {
  const delta = valor * pct * (Math.random() * 2 - 1);
  return Math.max(minimo, Math.round(valor + delta));
}

/** Modelo tirado das fichas do livro (ver comentário no topo). */
function escalaAmeaca(vd) {
  const v = Math.max(5, Number(vd) || 10);
  const defesa = variar(13 + v * 0.115, 0.08, 8);
  const pv = Math.max(5, Math.round(variar(v * (1.6 + v / 320), 0.12, 5) / 5) * 5);
  const bonusTeste = Math.round(5 + v * 0.1);
  const dadosTeste = v >= 380 ? 6 : v >= 260 ? 5 : v >= 160 ? 4 : v >= 100 ? 3 : v >= 40 ? 2 : 1;
  const dadosDano = Math.min(6, Math.max(1, Math.round(1 + v / 70)));
  const bonusDano = Math.round(v / 10);
  const dt = variar(10 + v * 0.05, 0.08, 8);
  return { defesa, pv, bonusTeste, dadosTeste, dadosDano, bonusDano, dt };
}

/**
 * Ações além dos ataques, no estilo das fichas do livro (Agarrão como
 * Reação, Investida como Movimento, "uma vez por rodada" como Livre…). As
 * gerais servem a qualquer criatura; as do elemento dão-lhe o sabor dele.
 */
const ACOES_ESPECIAIS_GERAIS = [
  { tipo: 'Reação', nome: 'Agarrão', descricao: 'Se acertar um ataque corpo a corpo, pode tentar agarrar o alvo (teste {TESTE}). Mantém até dois alvos agarrados.' },
  { tipo: 'Movimento', nome: 'Investida Brutal', descricao: 'Avança até o dobro do deslocamento em linha reta e ataca no fim; se acertar, o alvo cai (Fortitude DT {DT} evita).' },
  { tipo: 'Reação', nome: 'Contra-ataque', descricao: 'Quando um inimigo adjacente falha um ataque contra si, faz um ataque contra esse inimigo.' },
  { tipo: 'Completa', nome: 'Fúria', descricao: 'Faz um ataque contra cada inimigo adjacente, com –1d20 em cada teste.' },
  { tipo: 'Movimento', nome: 'Recuar para as Sombras', descricao: 'Desloca-se sem provocar ataques de oportunidade e fica com camuflagem até ao seu próximo turno.' },
  { tipo: 'Padrão', nome: 'Arremessar', descricao: 'Atira um alvo agarrado ou um objeto pesado a até 9m: {DANO} de impacto (Reflexos DT {DT} reduz à metade).' },
  { tipo: 'Livre', nome: 'Rugido', descricao: 'Uma vez por rodada, solta um rugido: um alvo a até 9m faz Vontade (DT {DT}) ou fica abalado por 1 rodada.' },
];
const ACOES_ESPECIAIS_ELEMENTO = {
  Sangue: [
    { tipo: 'Livre', nome: 'Beber o Sangue', descricao: 'Quando reduz um alvo a 0 PV, recupera {DANO_METADE} PV.' },
    { tipo: 'Completa', nome: 'Explosão de Espinhos', descricao: 'Espinhos de osso rebentam do corpo: todos a até 3m sofrem {DANO} de Sangue (Reflexos DT {DT} reduz à metade).' },
  ],
  Morte: [
    { tipo: 'Padrão', nome: 'Toque do Lodo', descricao: 'Um alvo adjacente sofre {DANO_METADE} de Morte e fica lento por 1 rodada (Fortitude DT {DT} evita a lentidão).' },
    { tipo: 'Completa', nome: 'Onda de Decadência', descricao: 'Lodo negro espalha-se: todos a até 6m sofrem {DANO} de Morte (Fortitude DT {DT} reduz à metade).' },
  ],
  Conhecimento: [
    { tipo: 'Padrão', nome: 'Revelar Segredo', descricao: 'Sussurra um segredo de um alvo a até 9m: Vontade (DT {DT}) ou fica confuso por 1 rodada.' },
    { tipo: 'Movimento', nome: 'Distorcer o Espaço', descricao: 'Reaparece num ponto que consiga ver a até 9m, sem atravessar o espaço entre eles.' },
  ],
  Energia: [
    { tipo: 'Movimento', nome: 'Salto Elétrico', descricao: 'Viaja através de qualquer fonte elétrica a até 18m e sai por outra.' },
    { tipo: 'Completa', nome: 'Descarga em Cone', descricao: 'Todos num cone de 6m sofrem {DANO} de Energia (Reflexos DT {DT} reduz à metade).' },
  ],
  Medo: [
    { tipo: 'Padrão', nome: 'Encarar', descricao: 'Um alvo que a veja faz Vontade (DT {DT}) ou fica apavorado por 1 rodada.' },
    { tipo: 'Livre', nome: 'Desvanecer', descricao: 'Uma vez por cena, fica invisível até ao início do seu próximo turno.' },
  ],
};

/** Preenche os marcadores {DANO}, {DT}, etc. de uma habilidade com os valores já escalados pelo VD. */
function formatarHabilidade(hab, e) {
  const danoTexto = `${e.dadosDano}d6+${e.bonusDano}`;
  const danoMetade = Math.max(1, Math.round((e.dadosDano * 3.5 + e.bonusDano) / 2));
  return {
    ...hab,
    nome: hab.nome,
    descricao: hab.descricao
      .replace(/\{TESTE\}/g, `${e.dadosTeste}d20+${e.bonusTeste + 2}`)
      .replace(/\{DANO_METADE\}/g, String(danoMetade))
      .replace(/\{DANO\}/g, danoTexto)
      .replace(/\{DT\}/g, String(e.dt))
      .replace(/\{BONUS_TESTE\}/g, String(e.bonusTeste))
      .replace(/\{BONUS_DANO\}/g, String(e.bonusDano))
      .replace(/\{DADO_CURA\}/g, `1d${Math.max(4, e.dadosDano * 2)}`),
  };
}

/**
 * Escolhe `qtd` habilidades alternando entre os poços dados (round-robin),
 * sem repetir nomes. Os poços vêm ordenados por prioridade — os elementos
 * escolhidos pelo mestre entram primeiro, a categoria por último — para que
 * cada elemento marcado garanta pelo menos uma habilidade sua sempre que
 * `qtd` chegue para isso, em vez de deixar tudo ao acaso.
 */
function selecionarHabilidades(qtd, pools) {
  const filas = pools.filter((p) => p?.length).map((p) => [...p].sort(() => Math.random() - 0.5));
  if (!filas.length) return [];
  const usados = new Set();
  const escolhidas = [];
  let i = 0;
  while (escolhidas.length < qtd && filas.some((f) => f.length)) {
    const fila = filas[i % filas.length];
    i += 1;
    if (!fila.length) continue;
    const cand = fila.shift();
    if (!usados.has(cand.nome)) {
      usados.add(cand.nome);
      escolhidas.push(cand);
    }
  }
  return escolhidas;
}

/** Soma pesos de atributos (categoria + elementos escolhidos) num só objeto. */
function somarPesosAtributos(...listas) {
  const total = { agi: 0, for: 0, int: 0, pre: 0, vig: 0 };
  for (const pesos of listas) {
    if (!pesos) continue;
    for (const k of Object.keys(total)) total[k] += pesos[k] || 0;
  }
  return total;
}

/**
 * Atributos (AGI/FOR/INT/PRE/VIG) — campo oficial da ficha de ameaça (Livro
 * Base, cap. 7) que faltava no gerador. Não há tabela oficial de "atributo
 * por VD" (só há para Defesa/PV/testes, já usada em escalaAmeaca); esta é
 * uma escala própria, do mesmo estilo aproximado do resto do gerador —
 * `pesos` diz que atributos a categoria/elemento favorecem, `nivel` escala
 * com o VD (o mesmo 1-6 de dadosTeste) e um jitter dá variedade entre
 * gerações em vez de sair sempre o mesmo número para o mesmo VD.
 */
function gerarAtributosAmeaca(pesos, nivel) {
  const fator = 0.5 + nivel * 0.4;
  const attrs = {};
  for (const k of ['agi', 'for', 'int', 'pre', 'vig']) {
    const peso = pesos[k] || 0;
    const jitter = entre(-1, 1);
    attrs[k] = Math.max(-1, Math.min(9, Math.round(peso * fator) + jitter));
  }
  return attrs;
}

export function gerarAmeaca({ vd = 20, categoria = null, elementos = [], tamanho = null, conceito = '', grupo = false, quantidadeGrupo = 2 } = {}) {
  const conceitoLimpo = String(conceito || '').trim();
  const cat = CATEGORIAS_AMEACA.find((c) => c.id === categoria) || ao(CATEGORIAS_AMEACA);
  const elementosEscolhidos = ELEMENTOS_AMEACA.filter((el) => (elementos || []).includes(el.id));

  // Grupo de criaturas idênticas: o VD escolhido é o VD do grupo todo (o que
  // conta para o orçamento de combate), por isso divide-se pelo número de
  // criaturas para chegar ao VD — e à Defesa/PV/dano — de CADA uma.
  const ehGrupo = Boolean(grupo);
  const qtdGrupo = ehGrupo ? Math.max(2, Math.min(50, Math.round(Number(quantidadeGrupo) || 2))) : 1;
  const vdTotalPedido = Math.max(5, Number(vd) || 10);
  const vdCada = qtdGrupo > 1 ? Math.max(5, Math.round(vdTotalPedido / qtdGrupo)) : vdTotalPedido;
  const e = escalaAmeaca(vdCada);

  const descritores = [...new Set([cat.nome, ...elementosEscolhidos.map((el) => el.id)])];
  // Ações e resistências saem de um poço (categoria, e todos os elementos
  // escolhidos) escolhido ao acaso a cada geração — a mesma combinação de
  // Categoria+Elemento(s) já não sai sempre com o mesmo ataque/resistência.
  // Uma criatura pode ter 1 a 3 ações (mais VD = mais ações, tal como as
  // fichas maiores do livro têm sempre vários ataques listados), sem repetir
  // nome entre elas.
  // Quantos ataques: varia dentro de uma faixa que sobe com o VD (as fichas
  // do livro vão de um só "Agredir" a quatro ataques diferentes)
  const qtdAcoes = vdCada >= 200 ? entre(2, 4) : vdCada >= 100 ? entre(1, 3) : vdCada >= 40 ? entre(1, 2) : 1;
  const poolAcoesTotal = elementosEscolhidos.length
    ? [...elementosEscolhidos.flatMap((el) => el.ataques), ...cat.ataques]
    : [...cat.ataques];
  const candidatosAcoes = [...poolAcoesTotal].sort(() => Math.random() - 0.5);
  const nomesAcoesUsados = new Set();
  const acoesEscolhidas = [];
  for (const cand of candidatosAcoes) {
    if (acoesEscolhidas.length >= qtdAcoes) break;
    if (nomesAcoesUsados.has(cand.nome)) continue;
    nomesAcoesUsados.add(cand.nome);
    acoesEscolhidas.push(cand);
  }
  const resistenciasFlavor = [...new Set(elementosEscolhidos.flatMap((el) => ao(el.resistenciasVariantes) || []))];
  const periciasIds = cat.pericias;
  const atributosAmeaca = gerarAtributosAmeaca(
    somarPesosAtributos(cat.atributos, ...elementosEscolhidos.map((el) => el.atributos)),
    e.dadosTeste
  );
  // Deslocamento: base pelo VD, +3m para Animal (mais ágeis por natureza) e
  // mais 25% de hipótese de +3m extra — para não sair sempre exatamente 9m
  // ou 12m, sempre em múltiplos de 3m como o livro usa.
  const deslocamentoBase = (vdCada >= 200 ? 12 : 9) + (cat.id === 'animal' ? 3 : 0);
  const deslocamento = deslocamentoBase + (Math.random() < 0.25 ? 3 : 0);

  let nomeBase;
  if (conceitoLimpo) {
    nomeBase = conceitoLimpo.charAt(0).toUpperCase() + conceitoLimpo.slice(1);
  } else if (cat.id === 'animal') {
    // Nome coletivo (ex.: "Alcateia de lobos") só quando é mesmo um grupo —
    // uma única criatura "Animal" nunca sai com nome de bando. Os elementos
    // escolhidos continuam a valer para estatísticas/habilidades, só não
    // entram no nome — um "Corvo do Farol" não precisa de se chamar
    // "Corvo de Morte do Farol" para ter as habilidades de Morte.
    nomeBase = ehGrupo ? `${ao(ANIMAIS_GRUPO)} ${ao(SITIOS)}` : `${ao(ANIMAIS)} ${ao(SITIOS)}`;
  } else if (elementosEscolhidos.length) {
    nomeBase = `${cat.nome} de ${elementosEscolhidos.map((el) => el.id).join(' e ')} ${ao(SITIOS)}`;
  } else {
    nomeBase = `${cat.nome} ${ao(SITIOS)}`;
  }
  const nomeAmeaca = ehGrupo ? `${nomeBase} (grupo de ${qtdGrupo})` : nomeBase;

  const pericias = periciasIds.map((id) => ({
    nome: PERICIAS_POR_ID[id]?.nome || id,
    dados: e.dadosTeste,
    bonus: e.bonusTeste,
  }));

  // Habilidades conforme o VD de cada criatura: os elementos escolhidos têm
  // prioridade (cada um garante entrar, ver selecionarHabilidades), a
  // categoria preenche o resto.
  // Habilidades: podem não ser nenhuma (criaturas simples) ou várias
  const qtdHabilidades = vdCada >= 200 ? entre(2, 4) : vdCada >= 100 ? entre(1, 3) : vdCada >= 40 ? entre(0, 2) : entre(0, 1);
  const poolsPrioridade = [...elementosEscolhidos.map((el) => el.habilidades), cat.habilidades];
  let habilidades = selecionarHabilidades(qtdHabilidades, poolsPrioridade).map((h) => formatarHabilidade(h, e));

  // Habilidade de limiar: ao ficar Machucada (metade da vida), a criatura
  // ganha algo — o mesmo padrão de "Fúria Ferida" e dos precedentes oficiais
  // de criaturas que mudam a meio do combate (Zumbi de Sangue, Melancolia,
  // Apóstata). Garantida a partir de VD 40, além das habilidades normais
  // acima — abaixo disso a criatura não costuma durar o suficiente em
  // combate para a diferença se notar.
  const poolCondicionais = [...elementosEscolhidos.map((el) => el.habilidadeCondicional), cat.habilidadeCondicional].filter(Boolean);
  if (vdCada >= 40 && poolCondicionais.length && Math.random() < 0.6) {
    const extra = ao(poolCondicionais);
    if (!habilidades.some((h) => h.nome === extra.nome)) {
      habilidades = [...habilidades, formatarHabilidade(extra, e)];
    }
  }

  // Comportamento, Aparência e Dicas de Narração / RP — quando há elemento(s)
  // marcado(s), vêm do poço próprio de cada elemento (escrito para bater
  // certo com as habilidades desse elemento: sangue puxa para rasto/cheiro,
  // Energia para estática/interferência, etc.) em vez do poço genérico, para
  // o texto de interpretação nunca prometer algo que a ficha não tem.
  const poolComportamentos = elementosEscolhidos.length ? elementosEscolhidos.flatMap((el) => el.comportamentos) : COMPORTAMENTOS_CRIATURAS;
  const poolAparencias = elementosEscolhidos.length ? elementosEscolhidos.flatMap((el) => el.aparencias) : APARENCIAS_CRIATURAS;
  const poolDicasRp = elementosEscolhidos.length ? elementosEscolhidos.flatMap((el) => el.dicasRp) : DICAS_RP_CRIATURAS;
  const comportamento = ao(poolComportamentos);
  const aparencia = ao(poolAparencias);
  const dicaRp = ao(poolDicasRp);

  const notaGrupo = ehGrupo
    ? `Grupo de ${qtdGrupo} criaturas idênticas: cada uma tem VD ${vdCada} (Defesa, PV e dano já refletem isso); o grupo todo soma VD ${vdTotalPedido}. Duplica este cartão ${qtdGrupo}× no Campo de Batalha.`
    : '';

  // Ações especiais (0 a 3 conforme o VD): as do elemento primeiro, depois
  // as gerais — sem repetir nomes de habilidades já escolhidas
  const qtdEspeciais = vdCada >= 200 ? entre(1, 3) : vdCada >= 100 ? entre(1, 2) : vdCada >= 40 ? entre(0, 2) : entre(0, 1);
  const acoesEspeciais = selecionarHabilidades(qtdEspeciais, [
    ...elementosEscolhidos.map((el) => ACOES_ESPECIAIS_ELEMENTO[el.id] || []),
    ACOES_ESPECIAIS_GERAIS,
  ]).map((a) => {
    const f = formatarHabilidade(a, e);
    return { tipo: a.tipo, nome: f.nome, detalhe: '', teste: '', dano: '', critico: '', descricao: f.descricao };
  });

  // Sentidos: as criaturas paranormais do livro veem no escuro quase sempre, e
  // as mais altas sentem sem ver ("Percepção às cegas"); animais mundanos não.
  const paranormal = elementosEscolhidos.length > 0;
  const sentidos = {
    percepcao: poolTexto(e.dadosTeste, e.bonusTeste),
    iniciativa: poolTexto(e.dadosTeste, e.bonusTeste),
    visaoNoEscuro: paranormal || cat.id === 'animal',
    percepcaoAsCegas: paranormal && vdCada >= 100,
    extra: cat.id === 'animal' ? 'Faro' : '',
  };

  // Presença Perturbadora — só as paranormais. Calibrada pelas fichas do livro
  // (Aberração de Carne VD 40: DT 15, 3d6, NEX 30%; Carente VD 300: DT 35,
  // 7d8, NEX 90%; Aniquilação VD 380: DT 45, 9d8).
  const presencaPerturbadora = paranormal ? {
    dt: Math.round(12 + vdCada * 0.085),
    dano: vdCada <= 100 ? `${2 + Math.round(vdCada / 40)}d6 mental` : `${3 + Math.round(vdCada / 80)}d8 mental`,
    nex: Math.min(95, Math.round((vdCada * 0.25 + 20) / 5) * 5),
  } : null;

  // Deslocamento por tipo: Animal pode trepar; algumas criaturas voam.
  const deslocamentos = {
    terrestre: deslocamento,
    escalada: cat.id === 'animal' && Math.random() < 0.35 ? deslocamento : '',
    voo: cat.id === 'criatura' && paranormal && Math.random() < 0.2 ? deslocamento + 3 : '',
  };

  return paraFichaOrdo({
    formato: FORMATO_FICHA_LIVRE,
    tipo: 'ameaca',
    fichaLivre: true,
    nome: nomeAmeaca,
    tags: [],
    arquetipo: cat.id,
    elementos: elementosEscolhidos.map((el) => el.id),
    conceito: conceitoLimpo || null,
    vd: vdCada,
    grupo: ehGrupo ? { quantidade: qtdGrupo, vdTotal: vdTotalPedido, vdCada } : null,
    // descritores = elementos (o primeiro é o principal); a forma vai para a categoria
    descritores: descritores.filter((d) => d !== cat.nome),
    categoria: cat.nome,
    tamanho: tamanho || (vdCada >= 300 ? 'Enorme' : vdCada >= 160 ? 'Grande' : 'Médio'),
    historia: conceitoLimpo ? `${conceitoLimpo.charAt(0).toUpperCase()}${conceitoLimpo.slice(1)}.` : '',
    atributos: atributosAmeaca,
    presencaPerturbadora,
    sentidos,
    defesa: e.defesa,
    testes: {
      fortitude: poolTexto(e.dadosTeste, e.bonusTeste),
      reflexos: poolTexto(e.dadosTeste, Math.max(0, e.bonusTeste - 5)),
      vontade: poolTexto(e.dadosTeste, e.bonusTeste),
    },
    pv: e.pv,
    pvMachucado: Math.round(e.pv / 2),
    dt: e.dt,
    resistencias: resistenciasFlavor,
    deslocamentos,
    deslocamento: textoDeslocamento(deslocamentos),
    pericias,
    habilidades: habilidades.map((h) => ({ ...h, custo: /Machucada/.test(h.descricao) ? 'Ao ficar Machucada' : 'Passiva' })),
    // Ações no esquema oficial (Livro Base, cap. 7): os ataques "Agredir —
    // Garras" (x2 quando há mais de um) seguidos das ações especiais.
    acoes: [
      ...acoesEscolhidas.map((at) => ({
        tipo: 'Padrão',
        nome: `Agredir — ${at.nome}`,
        detalhe: acoesEscolhidas.length > 1 ? 'Corpo a corpo x2' : 'Corpo a corpo',
        teste: poolTexto(e.dadosTeste, e.bonusTeste),
        dano: `${e.dadosDano}d${at.dado}+${e.bonusDano} ${String(at.tipo).toLowerCase()}`,
        critico: '20/x2',
        descricao: '',
      })),
      ...acoesEspeciais,
    ],
    enigmaDoMedo: null,
    roleplay: { aparencia, comportamento, notasMestre: dicaRp },
    notas: notaGrupo,
  });
}

/** Ajuda o mestre: que VD total usar para um grupo. */
export function vdParaGrupo(nexTotal, dificuldade = 'equilibrado') {
  const fator = dificuldade === 'facil' ? 0.5 : dificuldade === 'dificil' ? 1.5 : 1;
  return Math.round(nexTotal * fator);
}


// ----------------------------------------------------------- OCULTISTAS INIMIGOS

import {
  NOMES_CULTOS,
  PODERES_PARANORMAIS_CULTISTAS,
  DICAS_RP_CULTISTAS,
  MOTIVACOES_CULTISTAS,
  INFORMACOES_CULTISTAS,
} from '../data/roleplayTabelas.js';

export const ELEMENTOS_CULTISTAS = ['Sangue', 'Morte', 'Conhecimento', 'Energia', 'Medo'];

export const PATENTES_CULTISTAS = [
  { id: 'neofito', nome: 'Neófito / Acólito', vdMin: 10, vdMax: 30, circuloMax: 1, poderes: 1 },
  { id: 'fanatico', nome: 'Fanático / Invocador', vdMin: 40, vdMax: 80, circuloMax: 2, poderes: 2 },
  { id: 'sacerdote', nome: 'Sacerdote Negro / Carniceiro', vdMin: 100, vdMax: 160, circuloMax: 3, poderes: 3 },
  { id: 'avatar', nome: 'Mestre do Oculto / Avatar', vdMin: 180, vdMax: 360, circuloMax: 4, poderes: 4 },
];

export function gerarOcultista({ vd = 40, elemento = null, patente = null } = {}) {
  const v = Math.max(10, Number(vd) || 20);
  const el = elemento && ELEMENTOS_CULTISTAS.includes(elemento) ? elemento : ao(ELEMENTOS_CULTISTAS);
  const pat = PATENTES_CULTISTAS.find((p) => p.id === patente) || (
    v >= 180 ? PATENTES_CULTISTAS[3] : v >= 100 ? PATENTES_CULTISTAS[2] : v >= 40 ? PATENTES_CULTISTAS[1] : PATENTES_CULTISTAS[0]
  );

  const { nome, genero } = nomePortugues();
  const g = (t) => comGenero(t, genero);
  const culto = ao(NOMES_CULTOS);
  // Estilo do elemento (arma, aparência, comportamento…) + papel no culto
  // (atributos, perícias, pertences, motivação) — dois cultistas do mesmo
  // elemento já não saem iguais, e tudo o que se lê bate certo entre si.
  const estilo = ESTILO_CULTO[el];
  const papel = ao(PAPEIS_CULTO);
  const nomePapel = papel.nome[genero === 'f' ? 1 : 0];

  const defesa = Math.round(14 + v * 0.08);
  const pv = Math.round((v * 1.5 + 20) / 5) * 5;
  const pe = Math.round(v * 0.8 + 10);
  const dt = Math.round(13 + v * 0.08);
  const dadosTeste = v >= 200 ? 5 : v >= 120 ? 4 : v >= 60 ? 3 : 2;
  const bonusTeste = Math.round(5 + v * 0.1);
  const dadosDano = Math.min(5, Math.max(1, Math.round(1 + v / 80)));
  const bonusDano = Math.round(v / 12);

  // Rituais do Ocultista
  const rituaisFiltrados = RITUAIS.filter((r) =>
    r.circulo <= pat.circuloMax &&
    (String(r.elemento).toLowerCase().includes(el.toLowerCase()) || r.elemento === 'variavel' || Math.random() < 0.25)
  );
  const rituaisBaralhados = [...rituaisFiltrados].sort(() => Math.random() - 0.5);
  const qtdRituais = Math.min(5, Math.max(2, pat.circuloMax + 1));
  const rituais = rituaisBaralhados.slice(0, qtdRituais).map((r) => ({
    id: r.id,
    nome: r.nome,
    circulo: r.circulo,
    elemento: r.elemento,
    execucao: r.execucao || 'Padrão',
    alcance: r.alcance || 'Curto',
    custo: `${r.circulo * 2} PE`,
    dt,
    descricao: r.descricao || '',
  }));

  // Poderes Paranormais
  const poderesBaralhados = [...PODERES_PARANORMAIS_CULTISTAS].sort(() => Math.random() - 0.5);
  const poderes = poderesBaralhados.slice(0, pat.poderes);

  // Detalhes de RP — do estilo do elemento (o poço geral de cultistas puxa
  // para Sangue — "corta a própria carne" — e destoava num cultista de Energia)
  const doEstilo = (lista) => g(ao(lista));
  const comportamento = doEstilo(estilo.comportamentos);
  const aparencia = doEstilo(estilo.aparencias);
  const dicaRp = [g(ao(estilo.dicas)), Math.random() < 0.5 ? ao(DICAS_RP_CULTISTAS) : ''].filter(Boolean).join(' ');

  const arma = ao(estilo.armas);
  const ataqueNome = arma.nome;
  const tipoDano = arma.tipo === el || arma.tipo === 'Mental' || arma.tipo === 'Energia' || arma.tipo === 'Morte' ? arma.tipo : `${arma.tipo} + ${el}`;

  // Um ocultista é uma pessoa: sai como NPC de ficha livre (Elenco), com
  // rituais, poderes e equipamento — não como ameaça (as ameaças não têm
  // rituais). Os atributos sobem com a patente (puxados para PRE/INT) e o
  // papel no culto acrescenta os seus.
  const nivel = PATENTES_CULTISTAS.indexOf(pat);
  const base = { agi: 1 + (Math.random() < 0.5 ? 1 : 0), for: 1, int: 2 + Math.floor(nivel / 2), pre: 2 + Math.ceil(nivel / 2), vig: 1 + (nivel >= 2 ? 1 : 0) };
  const atributos = Object.fromEntries(Object.entries(base).map(([k, v]) => [k, Math.min(5, v + (papel.atributos[k] || 0))]));

  const periciasBase = [
    { nome: 'Iniciativa', dados: atributos.agi, bonus: bonusTeste - 5 },
    { nome: 'Percepção', dados: atributos.pre, bonus: bonusTeste - 5 },
    { nome: 'Fortitude', dados: atributos.vig, bonus: Math.max(0, bonusTeste - 7) },
    { nome: 'Reflexos', dados: atributos.agi, bonus: Math.max(0, bonusTeste - 7) },
    { nome: 'Vontade', dados: atributos.pre, bonus: bonusTeste },
    { nome: 'Ocultismo', dados: atributos.int, bonus: bonusTeste + 5 },
  ];
  // as perícias do papel: sobem as que já existem, acrescentam as outras
  const ATRIBUTO_PERICIA = { Diplomacia: 'pre', Enganação: 'pre', Intuição: 'pre', Luta: 'for', Intimidação: 'pre', Fortitude: 'vig', Investigação: 'int', Religião: 'pre', Percepção: 'pre', Pontaria: 'agi', Reflexos: 'agi', Vontade: 'pre', Furtividade: 'agi', Crime: 'agi', Ocultismo: 'int' };
  const pericias = [...periciasBase];
  for (const [nomeP, peso] of papel.pericias) {
    const existente = pericias.find((x) => x.nome === nomeP);
    if (existente) existente.bonus += peso * 3;
    else pericias.push({ nome: nomeP, dados: atributos[ATRIBUTO_PERICIA[nomeP] || 'pre'], bonus: bonusTeste - 5 + peso * 3 });
  }

  return paraFichaOrdo({
    formato: FORMATO_FICHA_LIVRE,
    tipo: 'npc',
    fichaLivre: true,
    jogador: 'NPC',
    nome,
    breveDescricao: `${nomePapel} · ${pat.nome} d’${culto}`,
    historia: '',
    classe: 'Ocultista',
    origem: '',
    trilha: '',
    afiliacao: papel.afiliacaoExtra ? `${culto} (${papel.afiliacaoExtra})` : culto,
    papelCulto: papel.id,
    nex: '',
    vd: v,
    culto,
    elementoPrincipal: el,
    patente: pat.nome,
    atributos,
    pv, pe, san: Math.round(v * 0.4 + 10),
    defesa, bloqueio: '', esquiva: '',
    deslocamento: '9m',
    pericias: pericias.map((p) => ({ ...p, dados: Math.max(1, Math.max(p.dados, dadosTeste - 1)) })),
    resistencias: [`${el} 10`, 'Mental 5'],
    acoes: [{
      tipo: 'Padrão',
      nome: ataqueNome,
      detalhe: ['Mental', 'Energia'].includes(arma.tipo) ? 'À distância, curto' : 'Corpo a corpo',
      teste: poolTexto(dadosTeste, bonusTeste),
      dano: `${dadosDano}d6+${bonusDano} ${tipoDano.toLowerCase()}`,
      critico: '19/x2',
      descricao: '',
    }],
    habilidades: poderes.map((pd) => ({ nome: pd.nome, custo: pd.custo || 'Poder paranormal', descricao: pd.descricao || '' })),
    rituais: rituais.map((r) => ({ ...r, circulo: String(r.circulo), elemento: elementoRitual(r.elemento), dt: String(r.dt) })),
    equipamento: [ataqueNome, ...papel.pertences.map(g), `Símbolo d’${culto}`],
    roleplay: {
      aparencia,
      traco: doEstilo(estilo.tracos),
      personalidade: comportamento,
      maneirismos: doEstilo(estilo.maneirismos),
      motivacao: g(Math.random() < 0.7 ? ao(papel.motivacoes) : ao(MOTIVACOES_CULTISTAS)),
      informacao: g(Math.random() < 0.75 ? ao(papel.informacoes) : ao(INFORMACOES_CULTISTAS)),
      notasMestre: dicaRp,
    },
    tags: [],
    notas: '',
  });
}

export const gerarOcultistaInimigo = gerarOcultista;
