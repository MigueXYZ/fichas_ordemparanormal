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
import { NOMES_M, NOMES_F, APELIDOS, OCUPACOES, CIDADES, ANIMAIS, SITIOS } from '../data/nomesPt.js';
import { personagemVazio, normalizarRecursos } from './character.js';
import { orcamentoPericias, NEX_TRACK } from './calc.js';
import { aplicarConcessoes } from './concessoes.js';
import { interpretarCritico } from './armas.js';
import {
  COMPORTAMENTOS_ESTRANHOS_AGENTES,
  APARENCIAS_AGENTES,
  DICAS_RP_AGENTES,
  HABILIDADES_CRIATURAS,
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
export function gerarFicha({ nex = 5, conceito = 'surpresa', classeId = null, trilhaId = null, origemId = null, jogador = '' } = {}) {
  const conc = conceito === 'surpresa' ? ao(CONCEITOS.filter((c) => c.id !== 'surpresa')) : CONCEITOS_POR_ID[conceito];
  const { nome, genero } = nomePortugues();

  let p = personagemVazio();
  p.nome = nome;
  p.jogador = jogador;
  p.nex = NEX_TRACK.includes(Number(nex)) ? Number(nex) : 5;
  p.atributos = distribuirAtributos(conc);

  // Origem
  const origem = origemId ? ORIGENS.find((o) => o.id === origemId) : ao(ORIGENS);
  if (origem) {
    p.origemId = origem.id;
    p = aplicarConcessoes(p, 'origem', origem.pericias || []);
    if (origem.periciasLivres) {
      const extra = escolherPericias(p, conc, origem.periciasLivres);
      p = aplicarConcessoes(p, 'origem', [...(origem.pericias || []), ...extra]);
    }
  }

  // Classe
  const classe = CLASSES_POR_ID[classeId] || CLASSES_POR_ID[conc?.classe] || ao(CLASSES.filter((c) => c.id !== 'sobrevivente'));
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

  // Equipamento
  p.ataques = [armaAleatoria(p, conc)];
  p.inventario = equipamentoInicial();
  p.patenteId = p.nex >= 50 ? 'especial' : p.nex >= 20 ? 'operador' : 'recruta';

  // Comportamento Estranho, Descrição Visual e Dicas de RP
  const comportamento = ao(COMPORTAMENTOS_ESTRANHOS_AGENTES);
  const aparencia = `${ao(APARENCIAS_AGENTES)} Natural de ${ao(CIDADES)}, ${entre(22, 55)} anos.`;
  const dicaRp = ao(DICAS_RP_AGENTES);

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
  const arma = candidatas.length ? ao(candidatas) : ao(ARMAS);
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

/** NPC com ficha de agente — aliado da Ordem, rival, vilão com ficha a sério. */
export function gerarNpcAgente(opcoes = {}) {
  const p = gerarFicha(opcoes);
  p.tipo = 'npc';
  p.jogador = 'NPC';
  p.descricao = {
    ...p.descricao,
    personalidade: `${p.comportamento} ${ao(OCUPACOES)} antes de entrar na Ordem. ${p.dicaRp}`,
  };
  return p;
}

// ---------------------------------------------------------------- ameaças

export const VD_SUGERIDOS = [10, 20, 40, 60, 80, 100, 120, 160, 200, 240, 280, 320, 360, 400];

export const ARQUETIPOS_AMEACA = [
  {
    id: 'humano', nome: 'Humano armado', descritores: ['Humano'],
    ataque: { nome: 'Arma de fogo', tipo: 'Balístico', dado: 6 },
    pericias: ['pontaria', 'percepcao', 'intimidacao'],
    resistencias: () => [],
  },
  {
    id: 'cultista', nome: 'Cultista', descritores: ['Humano', 'Conhecimento'],
    ataque: { nome: 'Adaga ritual', tipo: 'Perfuração', dado: 4 },
    pericias: ['ocultismo', 'religiao', 'vontade'],
    resistencias: () => ['Conhecimento 5'],
  },
  {
    id: 'animal', nome: 'Animal', descritores: ['Animal'],
    ataque: { nome: 'Mordida', tipo: 'Perfuração', dado: 6 },
    pericias: ['percepcao', 'atletismo', 'furtividade'],
    resistencias: () => [],
  },
  {
    id: 'sangue', nome: 'Criatura de Sangue', descritores: ['Criatura', 'Sangue'],
    ataque: { nome: 'Garras', tipo: 'Corte', dado: 10 },
    pericias: ['luta', 'fortitude', 'atletismo'],
    resistencias: () => ['Balístico, corte, impacto e perfuração 5', 'Sangue 10'],
  },
  {
    id: 'morte', nome: 'Criatura de Morte', descritores: ['Criatura', 'Morte'],
    ataque: { nome: 'Toque necrótico', tipo: 'Morte', dado: 8 },
    pericias: ['furtividade', 'vontade', 'percepcao'],
    resistencias: () => ['Morte 10', 'Imune a doenças e venenos'],
  },
  {
    id: 'conhecimento', nome: 'Criatura de Conhecimento', descritores: ['Criatura', 'Conhecimento'],
    ataque: { nome: 'Sussurro dilacerante', tipo: 'Mental', dado: 8 },
    pericias: ['ocultismo', 'intuicao', 'enganacao'],
    resistencias: () => ['Conhecimento 10', 'Mental 5'],
  },
  {
    id: 'energia', nome: 'Criatura de Energia', descritores: ['Criatura', 'Energia'],
    ataque: { nome: 'Descarga', tipo: 'Energia', dado: 10 },
    pericias: ['reflexos', 'iniciativa', 'acrobacia'],
    resistencias: () => ['Energia 10'],
  },
];

export const TAMANHOS = ['Minúsculo', 'Pequeno', 'Médio', 'Grande', 'Enorme', 'Colossal'];

/** Modelo tirado das fichas do livro (ver comentário no topo). */
function escalaAmeaca(vd) {
  const v = Math.max(5, Number(vd) || 10);
  const defesa = Math.round(13 + v * 0.115);
  const pv = Math.round((v * (1.6 + v / 320)) / 5) * 5;
  const bonusTeste = Math.round(5 + v * 0.1);
  const dadosTeste = v >= 380 ? 6 : v >= 260 ? 5 : v >= 160 ? 4 : v >= 100 ? 3 : v >= 40 ? 2 : 1;
  const dadosDano = Math.min(6, Math.max(1, Math.round(1 + v / 70)));
  const bonusDano = Math.round(v / 10);
  const dt = Math.round(10 + v * 0.05);
  return { defesa, pv, bonusTeste, dadosTeste, dadosDano, bonusDano, dt };
}

/** Remove acentos e baixa para minúsculas, para comparar palavras-chave em PT-BR. */
function normalizarTexto(txt) {
  return String(txt || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');
}

/**
 * Temas usados para transformar um conceito livre (texto escrito pelo
 * utilizador, ex.: "aranha gigante que se alimenta de medo") em descritores,
 * ataque, resistências e habilidades temáticas para gerarAmeaca(). Cada tema
 * tem palavras-chave em português (sem acento) que pontuam a favor dele
 * quando aparecem no conceito. Os valores numéricos das habilidades (dano,
 * DT, bónus) são sempre preenchidos a partir de escalaAmeaca(vd) — o texto
 * livre nunca decide a matemática, só o sabor.
 */
const TEMAS_CONCEITO = [
  {
    id: 'sangue', descritores: ['Criatura', 'Sangue'], pericias: ['luta', 'fortitude', 'atletismo'],
    palavras: ['sangue', 'carne', 'dilacera', 'viscera', 'entranha', 'mutila', 'canibal', 'devora', 'garra', 'presa', 'visceral', 'carnificina'],
    ataque: { nome: 'Garras Ensanguentadas', tipo: 'Corte', dado: 10 },
    resistencias: ['Sangue 10'],
    habilidades: [
      { nome: 'Fome de Sangue', descricao: 'Ao causar dano com o ataque corpo a corpo, recupera {DANO_METADE} pontos de vida.' },
      { nome: 'Frenesi Sanguinário', descricao: 'Quando fica Machucada, ganha +{BONUS_TESTE} em testes de dano até ao fim do combate.' },
      { nome: 'Rastro de Sangue', descricao: 'Alvos feridos por esta criatura sofrem −2 em testes de Furtividade enquanto sangrarem.' },
      { nome: 'Regeneração Visceral', descricao: 'Recupera {DADO_CURA} pontos de vida no início de cada turno, a menos que tenha sofrido dano de Fogo ou Energia na rodada anterior.' },
    ],
  },
  {
    id: 'morte', descritores: ['Criatura', 'Morte'], pericias: ['furtividade', 'vontade', 'percepcao'],
    palavras: ['morte', 'morto', 'cadaver', 'necro', 'tumulo', 'decomp', 'putrefa', 'zumbi', 'cemiterio', 'sepultura', 'apodrecid', 'podre'],
    ataque: { nome: 'Toque Necrótico', tipo: 'Morte', dado: 8 },
    resistencias: ['Morte 10', 'Imune a doenças e venenos'],
    habilidades: [
      { nome: 'Hálito da Tumba', descricao: 'Criaturas a até 3 metros fazem um teste de Fortitude (DT {DT}) ou ficam Enjoadas por 1 rodada.' },
      { nome: 'Não-Morta', descricao: 'Não precisa de respirar, comer ou dormir. Imune a efeitos que dependam de processos biológicos vivos.' },
      { nome: 'Decomposição Acelerada', descricao: 'Objetos orgânicos tocados por esta criatura apodrecem; comida e bebida estragam-se instantaneamente.' },
      { nome: 'Última Vontade', descricao: 'Ao morrer, explode em matéria pútrida: criaturas a até 3 metros fazem Reflexos (DT {DT}) ou sofrem {DANO} de dano de Morte.' },
    ],
  },
  {
    id: 'agua', descritores: ['Criatura', 'Água'], pericias: ['atletismo', 'furtividade', 'fortitude'],
    palavras: ['agua', 'afoga', 'lodo', 'pantano', 'umid', 'mofo', 'chuva', 'rio', 'lago', 'oceano', 'mar', 'submers', 'molhad'],
    ataque: { nome: 'Aperto Afogante', tipo: 'Impacto', dado: 8 },
    resistencias: ['Impacto 5'],
    habilidades: [
      { nome: 'Anfíbia', descricao: 'Move-se na água à mesma velocidade que em terra e pode respirar debaixo de água indefinidamente.' },
      { nome: 'Afogar', descricao: 'Se acertar dois ataques corpo a corpo seguidos no mesmo alvo, pode tentar afogá-lo: o alvo faz Fortitude (DT {DT}) ou começa a sufocar.' },
      { nome: 'Corrente Traiçoeira', descricao: 'Criaturas na água a até 9 metros fazem Força (DT {DT}) ou são puxadas 3 metros em direção a ela.' },
      { nome: 'Dissolver-se', descricao: 'Quando sofreria dano que a reduziria a 0 PV, pode em vez disso dissolver-se em água e reaparecer a até 9 metros, com {DADO_CURA} pontos de vida.' },
    ],
  },
  {
    id: 'fogo', descritores: ['Criatura', 'Energia'], pericias: ['reflexos', 'iniciativa', 'atletismo'],
    palavras: ['fogo', 'chama', 'queima', 'brasa', 'cinza', 'incendio', 'ardente', 'calor', 'fumaca', 'fumo'],
    ataque: { nome: 'Investida Flamejante', tipo: 'Energia', dado: 8 },
    resistencias: ['Energia 10', 'Imune a Fogo'],
    habilidades: [
      { nome: 'Aura Ardente', descricao: 'Criaturas que a atacam corpo a corpo sofrem {DANO_METADE} de dano de Energia (fogo).' },
      { nome: 'Rastro de Cinzas', descricao: 'Deixa um rasto de fogo ao mover-se: quem passar pelo espaço percorrido sofre {DANO_METADE} de dano de Energia.' },
      { nome: 'Combustão', descricao: 'Uma vez por combate, pode explodir em chamas: todas as criaturas a até 6 metros fazem Reflexos (DT {DT}) ou sofrem {DANO} de dano de Energia.' },
      { nome: 'Imune ao Calor', descricao: 'Não sofre dano de Fogo nem de ambientes extremamente quentes.' },
    ],
  },
  {
    id: 'gelo', descritores: ['Criatura', 'Energia'], pericias: ['fortitude', 'reflexos', 'percepcao'],
    palavras: ['gelo', 'frio', 'congela', 'neve', 'inverno', 'glacial', 'gelido'],
    ataque: { nome: 'Garras Geladas', tipo: 'Energia', dado: 6 },
    resistencias: ['Energia 10', 'Imune a Frio'],
    habilidades: [
      { nome: 'Toque Gélido', descricao: 'Alvos atingidos pelo ataque fazem Fortitude (DT {DT}) ou têm o deslocamento reduzido a metade por 1 rodada.' },
      { nome: 'Congelar no Lugar', descricao: 'Uma vez por combate, pode tentar imobilizar um alvo a até 9 metros: Fortitude (DT {DT}) ou fica Paralisado por 1 rodada.' },
      { nome: 'Ar Gélido', descricao: 'A temperatura em volta desta criatura cai drasticamente; criaturas desprotegidas do frio sofrem −2 em todos os testes.' },
    ],
  },
  {
    id: 'sombra', descritores: ['Criatura', 'Conhecimento'], pericias: ['furtividade', 'intuicao', 'percepcao'],
    palavras: ['sombra', 'escurid', 'trevas', 'breu', 'noite', 'negrume', 'penumbra'],
    ataque: { nome: 'Garras Sombrias', tipo: 'Mental', dado: 8 },
    resistencias: ['Conhecimento 5', 'Mental 5'],
    habilidades: [
      { nome: 'Um com as Trevas', descricao: 'Em áreas escuras ou sem iluminação, esta criatura fica praticamente invisível — quem tentar percebê-la sofre −5 em Percepção.' },
      { nome: 'Deslizar nas Sombras', descricao: 'Pode mover-se entre quaisquer duas sombras a até 9 metros uma da outra como ação de movimento, sem provocar ataques de oportunidade.' },
      { nome: 'Terror na Escuridão', descricao: 'Criaturas que a vejam pela primeira vez em ambiente escuro fazem Vontade (DT {DT}) ou ficam Apavoradas por 1 rodada.' },
    ],
  },
  {
    id: 'inseto', descritores: ['Animal'], pericias: ['percepcao', 'furtividade', 'atletismo'],
    palavras: ['inseto', 'aranha', 'enxame', 'larva', 'verme', 'formiga', 'barata', 'gafanhoto', 'lacraia', 'centopeia', 'abelha', 'vespa'],
    ataque: { nome: 'Ferroada Venenosa', tipo: 'Perfuração', dado: 6 },
    resistencias: [],
    habilidades: [
      { nome: 'Enxame', descricao: 'Ataques de área contra ela causam apenas metade do dano; ataques corpo a corpo únicos têm 50% de chance de acertar só uma parte do enxame, sem efeito.' },
      { nome: 'Veneno Paralisante', descricao: 'Alvos atingidos pelo ataque fazem Fortitude (DT {DT}) ou ficam Vulneráveis por 1 rodada.' },
      { nome: 'Multiplicação', descricao: 'No início de cada turno seu, se estiver Machucada, pode gerar mais um enxame idêntico com {DADO_CURA} pontos de vida.' },
      { nome: 'Sentidos Compostos', descricao: 'Não pode ser Surpreendida e ignora penalidades de Percepção causadas por escuridão.' },
    ],
  },
  {
    id: 'mente', descritores: ['Criatura', 'Conhecimento'], pericias: ['intuicao', 'enganacao', 'vontade'],
    palavras: ['mente', 'loucura', 'sussurro', 'pesadelo', 'insania', 'delirio', 'alucina', 'psique', 'sonho'],
    ataque: { nome: 'Sussurro Dilacerante', tipo: 'Mental', dado: 8 },
    resistencias: ['Conhecimento 10', 'Mental 10'],
    habilidades: [
      { nome: 'Voz na Cabeça', descricao: 'Uma vez por turno, pode sussurrar algo perturbador na mente de um alvo a até 18 metros: Vontade (DT {DT}) ou o alvo fica Abalado por 1 rodada.' },
      { nome: 'Alimenta-se do Medo', descricao: 'Recupera {DANO_METADE} pontos de vida sempre que um Agente a até 9 metros falha um teste de Vontade.' },
      { nome: 'Ilusão Perfeita', descricao: 'Pode criar uma ilusão sensorial que só se desfaz com um teste de Vontade (DT {DT}) bem-sucedido.' },
      { nome: 'Presença Insana', descricao: 'Agentes que terminem o turno adjacentes a esta criatura fazem Vontade (DT {DT}) ou ganham 1 ponto de Sanidade Insana.' },
    ],
  },
  {
    id: 'infancia', descritores: ['Criatura'], pericias: ['enganacao', 'intuicao', 'furtividade'],
    palavras: ['crianca', 'infantil', 'boneca', 'brinquedo', 'berco', 'bebe', 'menina', 'menino'],
    ataque: { nome: 'Golpe Inesperado', tipo: 'Impacto', dado: 6 },
    resistencias: [],
    habilidades: [
      { nome: 'Aparência Inofensiva', descricao: 'Agentes que a vejam pela primeira vez precisam ser bem-sucedidos num teste de Intuição (DT {DT}) para reconhecê-la como ameaça antes de agir.' },
      { nome: 'Cântico Perturbador', descricao: 'Ao cantarolar, criaturas a até 9 metros fazem Vontade (DT {DT}) ou ficam Abaladas por 1 rodada.' },
      { nome: 'Brincadeira Cruel', descricao: 'Contra um alvo Surpreendido ou Desprevenido, o ataque desta criatura causa dano dobrado.' },
    ],
  },
  {
    id: 'ritual', descritores: ['Humano', 'Conhecimento'], pericias: ['ocultismo', 'religiao', 'vontade'],
    palavras: ['ritual', 'religiao', 'seita', 'altar', 'sacrificio', 'profeta', 'culto', 'oraculo'],
    ataque: { nome: 'Adaga Ritual', tipo: 'Perfuração', dado: 6 },
    resistencias: ['Conhecimento 5'],
    habilidades: [
      { nome: 'Bênção Profana', descricao: 'Uma vez por combate, pode conceder a si mesma ou a um aliado próximo +{BONUS_TESTE} num teste, invocando o nome de sua entidade.' },
      { nome: 'Marca do Sacrifício', descricao: 'Se um Agente morrer a até 9 metros desta criatura, ela recupera {DANO} pontos de vida.' },
      { nome: 'Fanatismo', descricao: 'Imune a efeitos que causem Medo ou Apavoramento, e a testes de Vontade contra Conhecimento.' },
    ],
  },
  {
    id: 'maquina', descritores: ['Criatura', 'Energia'], pericias: ['fortitude', 'percepcao', 'luta'],
    palavras: ['maquina', 'metal', 'engrenagem', 'ferrugem', 'robo', 'automato', 'mecanico', 'peca', 'parafuso'],
    ataque: { nome: 'Lâmina Mecânica', tipo: 'Corte', dado: 8 },
    resistencias: ['Balístico, corte, impacto e perfuração 5'],
    habilidades: [
      { nome: 'Construto', descricao: 'Imune a venenos, doenças, sono, medo e efeitos mentais. Não precisa de respirar.' },
      { nome: 'Blindagem', descricao: 'Reduz em {BONUS_DANO} todo o dano físico recebido, antes de aplicar resistências.' },
      { nome: 'Sobrecarga', descricao: 'Uma vez por combate, pode gastar o turno para disparar um raio de energia contra um alvo a até 18 metros: Reflexos (DT {DT}) ou {DANO} de dano de Energia.' },
    ],
  },
  {
    id: 'planta', descritores: ['Animal'], pericias: ['furtividade', 'fortitude', 'percepcao'],
    palavras: ['planta', 'raiz', 'floresta', 'espinho', 'flor', 'fungo', 'vinha', 'musgo', 'esporo'],
    ataque: { nome: 'Vinhas Constritoras', tipo: 'Impacto', dado: 8 },
    resistencias: [],
    habilidades: [
      { nome: 'Enraizada', descricao: 'Ao ficar imóvel por 1 rodada inteira, ganha +{BONUS_TESTE} na Defesa até se mover novamente.' },
      { nome: 'Esporos Tóxicos', descricao: 'Uma vez por combate, liberta uma nuvem de esporos num raio de 6 metros: Fortitude (DT {DT}) ou Enjoado por 1 rodada.' },
      { nome: 'Camuflagem Natural', descricao: 'Em ambientes com vegetação, ganha +5 em Furtividade e não pode ser Surpreendida.' },
    ],
  },
  {
    id: 'espirito', descritores: ['Criatura', 'Morte'], pericias: ['furtividade', 'intuicao', 'vontade'],
    palavras: ['fantasma', 'espirito', 'alma', 'assombra', 'eterea', 'etereo', 'poltergeist', 'aparicao'],
    ataque: { nome: 'Toque Espectral', tipo: 'Mental', dado: 8 },
    resistencias: ['Morte 10', 'Balístico, corte, impacto e perfuração 10'],
    habilidades: [
      { nome: 'Incorpórea', descricao: 'Pode atravessar objetos e criaturas sólidas, e só pode ser afetada por ataques ou efeitos paranormais.' },
      { nome: 'Assombração', descricao: 'Está presa a um local ou objeto: não pode afastar-se dele mais do que 90 metros.' },
      { nome: 'Manifestação Aterradora', descricao: 'Uma vez por combate, pode manifestar-se visivelmente: criaturas a até 9 metros fazem Vontade (DT {DT}) ou ficam Apavoradas por 1 rodada.' },
    ],
  },
];

/** Pontua os temas contra o texto do conceito e devolve os 1-2 mais fortes. */
function analisarConceito(texto) {
  // Ignora palavras curtas (artigos, preposições, etc.) para não gerar falsos positivos
  // — ex.: "na" não pode contar como se tivesse acertado a palavra-chave "insania".
  const tokens = normalizarTexto(texto).split(/\s+/).filter((t) => t.length >= 3);
  if (!tokens.length) return [];
  const pontuadas = TEMAS_CONCEITO
    .map((tema) => ({
      tema,
      // O token precisa CONTER a palavra-chave (ex.: "apodrecida" contém "apodrecid"),
      // nunca o inverso — assim um token curto não "acerta" por ser substring de uma
      // palavra-chave longa e não relacionada.
      pontos: tema.palavras.reduce((soma, palavra) => soma + (tokens.some((t) => t.includes(palavra)) ? 1 : 0), 0),
    }))
    .filter((x) => x.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos);
  return pontuadas.slice(0, 2).map((x) => x.tema);
}

/** Preenche os marcadores {DANO}, {DT}, etc. de uma habilidade temática com os valores já escalados pelo VD. */
function formatarHabilidadeConceito(hab, e) {
  const danoTexto = `${e.dadosDano}d6+${e.bonusDano}`;
  const danoMetade = Math.max(1, Math.round((e.dadosDano * 3.5 + e.bonusDano) / 2));
  return {
    nome: hab.nome,
    descricao: hab.descricao
      .replace(/\{DANO_METADE\}/g, String(danoMetade))
      .replace(/\{DANO\}/g, danoTexto)
      .replace(/\{DT\}/g, String(e.dt))
      .replace(/\{BONUS_TESTE\}/g, String(e.bonusTeste))
      .replace(/\{BONUS_DANO\}/g, String(e.bonusDano))
      .replace(/\{DADO_CURA\}/g, `1d${Math.max(4, e.dadosDano * 2)}`),
  };
}

export function gerarAmeaca({ vd = 20, arquetipo = null, tamanho = null, conceito = '' } = {}) {
  const conceitoLimpo = String(conceito || '').trim();
  const temasConceito = conceitoLimpo ? analisarConceito(conceitoLimpo) : [];
  const usaConceito = temasConceito.length > 0;

  const arq = usaConceito ? null : (ARQUETIPOS_AMEACA.find((a) => a.id === arquetipo) || ao(ARQUETIPOS_AMEACA));
  const e = escalaAmeaca(vd);

  const descritores = usaConceito
    ? [...new Set(temasConceito.flatMap((t) => t.descritores))].slice(0, 4)
    : arq.descritores;
  const ataqueFlavor = usaConceito ? temasConceito[0].ataque : arq.ataque;
  const resistenciasFlavor = usaConceito ? [...new Set(temasConceito.flatMap((t) => t.resistencias))] : arq.resistencias();
  const periciasIds = usaConceito ? [...new Set(temasConceito.flatMap((t) => t.pericias))].slice(0, 4) : arq.pericias;
  const humano = descritores.includes('Humano');

  const { nome } = nomePortugues();
  let nomeAmeaca;
  if (conceitoLimpo) {
    nomeAmeaca = conceitoLimpo.charAt(0).toUpperCase() + conceitoLimpo.slice(1);
  } else if (humano) {
    nomeAmeaca = `${nome} — ${arq.nome}`;
  } else if (arq.id === 'animal') {
    nomeAmeaca = `${ao(ANIMAIS)} ${ao(SITIOS)}`;
  } else {
    nomeAmeaca = `${arq.nome} ${ao(SITIOS)}`;
  }

  const pericias = periciasIds.map((id) => ({
    nome: PERICIAS_POR_ID[id]?.nome || id,
    dados: e.dadosTeste,
    bonus: e.bonusTeste,
  }));

  // Habilidades conforme o VD — temáticas (do conceito) ou aleatórias genéricas.
  const qtdHabilidades = Number(vd) >= 160 ? 3 : Number(vd) >= 60 ? 2 : 1;
  let habilidades;
  if (usaConceito) {
    const poolTemas = [...new Map(temasConceito.flatMap((t) => t.habilidades).map((h) => [h.nome, h])).values()];
    const baralhadas = poolTemas.sort(() => Math.random() - 0.5);
    habilidades = baralhadas.slice(0, qtdHabilidades).map((h) => formatarHabilidadeConceito(h, e));
  } else {
    const habilidadesBaralhadas = [...HABILIDADES_CRIATURAS].sort(() => Math.random() - 0.5);
    habilidades = habilidadesBaralhadas.slice(0, qtdHabilidades);
  }

  // Comportamento, Aparência e Dicas de Narração / RP
  const comportamento = ao(COMPORTAMENTOS_CRIATURAS);
  const aparencia = ao(APARENCIAS_CRIATURAS);
  const dicaRp = ao(DICAS_RP_CRIATURAS);

  return {
    tipo: 'ameaca',
    nome: nomeAmeaca,
    tags: [],
    arquetipo: usaConceito ? temasConceito.map((t) => t.id).join('+') : arq.id,
    conceito: conceitoLimpo || null,
    vd: Number(vd),
    descritores,
    tamanho: tamanho || (Number(vd) >= 300 ? 'Enorme' : Number(vd) >= 160 ? 'Grande' : 'Médio'),
    ocupacao: humano ? ao(OCUPACOES) : null,
    defesa: e.defesa,
    pv: e.pv,
    pvMachucado: Math.round(e.pv / 2),
    dt: e.dt,
    deslocamento: Number(vd) >= 200 ? 12 : 9,
    sentidos: { percepcao: `${e.dadosTeste}d20+${e.bonusTeste}`, iniciativa: `${e.dadosTeste}d20+${e.bonusTeste}` },
    resistencias: resistenciasFlavor,
    testes: {
      fortitude: `${e.dadosTeste}d20+${e.bonusTeste}`,
      reflexos: `${e.dadosTeste}d20+${Math.max(0, e.bonusTeste - 5)}`,
      vontade: `${e.dadosTeste}d20+${e.bonusTeste}`,
    },
    pericias,
    habilidades,
    comportamento,
    aparencia,
    dicaRp,
    ataque: {
      nome: ataqueFlavor.nome,
      teste: `${e.dadosTeste}d20+${e.bonusTeste}`,
      dados: e.dadosTeste,
      bonus: e.bonusTeste,
      dano: `${e.dadosDano}d${ataqueFlavor.dado}+${e.bonusDano}`,
      tipo: ataqueFlavor.tipo,
      critico: 'x2',
    },
    notas: conceitoLimpo
      ? `Conceito: "${conceitoLimpo}". ${comportamento} ${dicaRp}`
      : `${comportamento} ${dicaRp}`,
  };
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
  COMPORTAMENTOS_CULTISTAS,
  APARENCIAS_CULTISTAS,
  DICAS_RP_CULTISTAS,
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

  const { nome } = nomePortugues();
  const culto = ao(NOMES_CULTOS);
  const nomeCompleto = `${nome} (${pat.nome} d’${culto})`;

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

  // Detalhes de RP
  const comportamento = ao(COMPORTAMENTOS_CULTISTAS);
  const aparencia = ao(APARENCIAS_CULTISTAS);
  const dicaRp = ao(DICAS_RP_CULTISTAS);

  const armasNomes = {
    Sangue: 'Lâmina Sacrificial de Sangue',
    Morte: 'Foice Ritualística de Morte',
    Conhecimento: 'Adaga Rúnica de Conhecimento',
    Energia: 'Foco de Energia Caótica',
    Medo: 'Adaga do Medo Profundo',
  };

  const ataqueNome = armasNomes[el] || 'Lâmina Cerimonial';
  const tipoDano = el === 'Sangue' ? 'Corte / Sangue' : el === 'Morte' ? 'Perfuração / Morte' : el === 'Conhecimento' ? 'Impacto / Mental' : el === 'Energia' ? 'Energia' : 'Medo';

  return {
    tipo: 'ameaca',
    subtipo: 'ocultista',
    nome: nomeCompleto,
    culto,
    elemento: el,
    patente: pat.nome,
    vd: v,
    descritores: ['Humano', 'Ocultista', el],
    tamanho: 'Médio',
    defesa,
    pv,
    pvMachucado: Math.round(pv / 2),
    pe,
    dt,
    deslocamento: 9,
    sentidos: { percepcao: `${dadosTeste}d20+${bonusTeste}`, iniciativa: `${dadosTeste}d20+${bonusTeste}` },
    resistencias: [`${el} 10`, 'Mental 5'],
    testes: {
      fortitude: `${dadosTeste}d20+${Math.max(0, bonusTeste - 2)}`,
      reflexos: `${dadosTeste}d20+${Math.max(0, bonusTeste - 2)}`,
      vontade: `${dadosTeste}d20+${bonusTeste + 3}`,
    },
    pericias: [
      { nome: 'Ocultismo', dados: dadosTeste, bonus: bonusTeste + 5 },
      { nome: 'Vontade', dados: dadosTeste, bonus: bonusTeste + 3 },
      { nome: 'Enganação', dados: dadosTeste, bonus: bonusTeste },
      { nome: 'Iniciativa', dados: dadosTeste, bonus: bonusTeste },
    ],
    habilidades: poderes,
    rituais,
    comportamento,
    aparencia,
    dicaRp,
    ataque: {
      nome: ataqueNome,
      teste: `${dadosTeste}d20+${bonusTeste}`,
      dados: dadosTeste,
      bonus: bonusTeste,
      dano: `${dadosDano}d6+${bonusDano}`,
      tipo: tipoDano,
      critico: '19/x2',
    },
    notas: `Culto: ${culto}. ${comportamento} ${dicaRp}`,
  };
}

export const gerarOcultistaInimigo = gerarOcultista;
